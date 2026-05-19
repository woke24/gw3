<template>
  <div class="heart-rate-container">
    <div class="heart-rate-date">
      <el-date-picker class="dark-input" v-model="hrDate" type="date" placeholder="Pick day"
        :disabled-date="disabledDate" style="width: 100%" @change="flushDatas" />
    </div>
    <div class="hr-circle-container">
      <div class="hr-circle">
        <!-- 多层实心渐变圆环（同步缩放，保持颜色层次） -->
        <div class="pulse-group">
          <div class="pulse-ring pulse-ring-1"></div>
          <div class="pulse-ring pulse-ring-2"></div>
          <div class="pulse-ring pulse-ring-3"></div>
          <div class="pulse-ring pulse-ring-4"></div>
        </div>
        <!-- 中心数字 -->
        <div v-if="heartRate.curStatus === 1" class="heart-rate-number">{{ heartRate.heartRate }}</div>
        <div v-else class="heart-rate-number">0</div>
      </div>
      <div class="hr-circle-info">
        <div>
          MAX
          <span>{{ maxHeartRate }}</span>
        </div>
        <div style="height: 40px; line-height: 40px">
          <div class="heart-rate-status">
            <div class="heart-rate-img">
              <img src="@/assets/icons/heart_status.webp" :class="currentStatus.class" />
            </div>
            <div class="heart-rate-text">
              <p>{{ currentStatus.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hr-times">
      <div v-for="zone in HEART_ZONES_CONFIG" :key="zone.key">
        <div>
          <span :style="{ background: zone.color }"></span>
          <span>{{ zone.label }}</span>
        </div>
        <div>
          {{ formatDuration(hrStatistics[zone.key]?.duration) }} min
        </div>
      </div>
    </div>
    <div class="hr-data">
      <div>
        <div>
          <span class="ft-hr-icon">
            <img src="@/assets/icons/walking.webp" />
          </span>
          <span>Walking</span>
        </div>
        <div>
          <span>{{ userStatisticsData?.walking || 0 }}</span>
          <span>steps</span>
        </div>
      </div>
      <div>
        <div>
          <span class="ft-hr-icon">
            <img src="@/assets/icons/mileage.webp" />
          </span>
          <span>Mileage</span>
        </div>
        <div>
          <span>{{ userStatisticsData?.mileage || 0 }}</span>
          <span>m</span>
        </div>
      </div>
      <div>
        <div>
          <span class="ft-hr-icon">
            <img src="@/assets/icons/consume.webp" />
          </span>
          <span>Consume</span>
        </div>
        <div>
          <span>{{ userStatisticsData?.consume || 0 }}</span>
          <span>Kcal</span>
        </div>
      </div>
      <div>
        <div>
          <span class="ft-hr-icon">
            <img src="@/assets/icons/active_time.webp" />
          </span>
          <span>Active Time</span>
        </div>
        <div>
          <span>{{ userStatisticsData?.activeTime || 0 }}</span>
          <span>hrs</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount, onMounted, watch, getCurrentInstance, shallowRef } from 'vue'
import { processHeartRateData, getCachedUserInfo, getUserStatistics } from '@/utils/global'
import { statistics } from '@/api/user'
import { useStore } from 'vuex'
import moment from 'moment'

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const store = useStore()

const hrDate = ref(new Date())

const earliest_date = new Date('2015-01-01')
const disabledDate = (time) => {
  return time.getTime() > Date.now() || time.getTime() < earliest_date.getTime()
}

// 心率数值
const heartRate = shallowRef({
  curStatus: 0,
  battery: 0,
  heartRate: 0,
  RRInterval1: 0,
  RRInterval2: 0,
  RRInterval3: 0,
  RRInterval4: 0,
  lastUpdateTime: 0.0
});
const maxHeartRate = shallowRef(0);

const hrStatistics = ref({
  extreme: { duration: 0 },
  anaerobic: { duration: 0 },
  aerobic: { duration: 0 },
  fatBurning: { duration: 0 },
  warmUp: { duration: 0 },
});

const isRunning = ref(false);

let rafId = null;
let lastTime = 0;
const INTERVAL = 50;

let statsCounter = 0;

let lastFetchTime = 0;
const FETCH_INTERVAL = 60000;

const HEART_ZONES = [
  { max: 0, text: 'No Device', class: 'status-no-device' },
  { max: 108, text: 'Warm up', class: 'status-warm-up' },
  { max: 126, text: 'Fat burning', class: 'status-fat-burn' },
  { max: 144, text: 'Aerobic', class: 'status-aerobic' },
  { max: 162, text: 'Anaerobic', class: 'status-anaerobic' },
  { max: 999, text: 'Extreme', class: 'status-extreme' }
];

const HEART_ZONES_CONFIG = [
  { key: 'extreme', label: 'Extreme', color: '#ff2e56' },
  { key: 'anaerobic', label: 'Anaerobic', color: '#fe9601' },
  { key: 'aerobic', label: 'Aerobic', color: '#ffcb01' },
  { key: 'fatBurning', label: 'Fat Burning', color: '#34c55b' },
  { key: 'warmUp', label: 'Warm Up', color: '#31aee6' }
];

const userStatisticsData = computed(() => store.getters['user/getUserStatistics']);
console.log('userStatisticsData', userStatisticsData.value);

const formatDuration = (val) => {
  if (!val) return '0.0';
  return val
};

const pollData = async (currentTime) => {
  if (!isRunning.value) return;

  // 检查是否到达 50ms 间隔
  if (currentTime - lastTime >= INTERVAL) {
    lastTime = currentTime;

    try {
      const rawData = await host.getArmbandInfo();
      if (rawData) {
        const parsed = JSON.parse(rawData);
        const currentVal = parsed.heartRate;

        if (heartRate.value !== parsed) {
          heartRate.value = parsed;
        }

        const rawStatsArray = await processHeartRateData(host, hrDate.value);

        statsCounter++;
        if (statsCounter >= 20) {
          updateStatistics(rawStatsArray);
          statsCounter = 0;
        }

        if (currentTime - lastFetchTime >= FETCH_INTERVAL) {
          await getStatistics();
          lastFetchTime = currentTime;
        }

        if (currentVal > maxHeartRate.value) {
          maxHeartRate.value = currentVal;
        }
      }
    } catch (err) {
      console.warn('error', err);
    }
  }

  rafId = requestAnimationFrame(pollData);
};

const currentStatus = computed(() => {
  const hr = heartRate.value.heartRate;
  return HEART_ZONES.find(zone => hr <= zone.max) || HEART_ZONES[HEART_ZONES.length - 1];
});

const updateStatistics = (rawDataArray) => {

  Object.keys(hrStatistics.value).forEach(key => {
    hrStatistics.value[key].duration = 0;
  });

  if (Array.isArray(rawDataArray) && rawDataArray.length > 0) {
    rawDataArray.forEach(item => {
      if (hrStatistics.value[item.HeartRateZone]) {
        hrStatistics.value[item.HeartRateZone].duration = Number((item.TotalDuration / 1000).toFixed(2));
      }
    });
  }
}

const getStatistics = async () => {
  const userInfo = await getCachedUserInfo(host);
  if (!userInfo) return;

  const day = moment(hrDate.value).format('YYYY-MM-DD')

  const res = await statistics({
    userId: userInfo.userId,
    date: day
  });

  if (res.code === 20000) {
    const data = res.data;
    const userData = {
      walking: data.totalSteps,
      mileage: data.totalDistance,
      consume: data.totalCalories,
      activeTime: data.totalDuration
    }

    // 获取臂带心率数据-计算出的卡路里与运动数据卡路里比较
    const date = hrDate.value;
    const armData = await getUserStatistics(host, date);

    if (armData && armData.totalCalorie > userData.consume) {
      userData.consume = armData.totalCalorie;
    }

    store.dispatch('user/setUserStatistics', userData);
  }
};

const toggleMonitor = async () => {
  if (isRunning.value) {
    isRunning.value = false;
    if (rafId) cancelAnimationFrame(rafId);
  } else {
    isRunning.value = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(pollData);
  }
};

const flushDatas = async () => {
  await getStatistics();
};

onBeforeUnmount(() => {
  isRunning.value = false;
  if (rafId) cancelAnimationFrame(rafId);
});

onMounted(async () => {
  toggleMonitor();
})
</script>

<style scoped>
.heart-rate-container {
  /* padding: 10px; */
  text-align: left;
  /* background: #e0ebff; */
  background: var(--nav-bg-color);
  color: var(--text-color);
  border-radius: 12px;
  height: 100%;
}

.heart-rate-status {
  display: flex;
  justify-content: center;
  align-items: anchor-center;
  gap: 6px;
}

.heart-rate-text p {
  margin: 0;
  padding: 0;
}

.status-no-device {
  filter: grayscale(1);
  opacity: 0.5;
}

.status-warm-up {
  filter: hue-rotate(160deg) brightness(1.2);
}

.status-fat-burn {
  filter: hue-rotate(80deg);
}

.status-aerobic {
  filter: none;
}

.status-anaerobic {
  filter: hue-rotate(-60deg);
}

.status-extreme {
  filter: hue-rotate(-110deg) saturate(1.5);
}

.heart-rate-status {
  display: flex;
  align-items: center;
}

.heart-rate-img img {
  width: 18px;
  height: auto;
  transition: filter 0.3s ease;
}

/* .heart-rate-date :deep(.el-input__wrapper){
  background: #409eff;
  :deep(.el-input__prefix) {
    color: #fff;
  }
  :deep(.el-input__inner) {
    color: #fff;
  }
  
  :deep(.el-input__suffix) {
    color: #fff;
  }
} */
.hr-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-group {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #e91e63;
  opacity: 1;
  box-sizing: border-box;
}

.pulse-ring-1 {
  width: 100%;
  height: 100%;
  background-color: #880e4f;
}

.pulse-ring-2 {
  width: 95%;
  height: 95%;
  margin: 2.5%;
  background-color: #ad1457;
  animation: pulse-scale3 2s infinite ease-in-out;
}

.pulse-ring-3 {
  width: 85%;
  height: 85%;
  margin: 7.5%;
  background-color: #c2185b;
  animation: pulse-scale2 2s infinite ease-in-out;
}

.pulse-ring-4 {
  width: 75%;
  height: 75%;
  margin: 12.5%;
  background-color: #d81b60;
  animation: pulse-scale 2s infinite ease-in-out;
}

@keyframes pulse-scale {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes pulse-scale2 {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.88);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes pulse-scale3 {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.96);
  }

  100% {
    transform: scale(1);
  }
}

.heart-rate-number {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  position: absolute;
  z-index: 10;
}

.heart-rate-container>div {
  padding: 10px 10px 0 10px;
}

.hr-circle-info {
  padding-top: 10px;
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
}

.hr-times>div,
.hr-data>div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  line-height: 2;
  /* color: #666; */
}

.hr-times,
.hr-data {
  border-top: 1px solid var(--divider-color);
}

/* .hr-times > div > div:first-child {
  color: #fff;
}
.hr-times > div > div:last-child {
  color: #666;
} */
.hr-times>div>div:first-child>span:first-child {
  padding: 5px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 10px;
}

.hr-data>div>div:nth-of-type(1) {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ft-hr-icon {
  display: flex;

  svg {
    width: 20px;
    height: 20px;
  }
}

.hr-data>div>div:nth-of-type(2)>span:nth-of-type(2) {
  display: inline-block;
  min-width: 32px;
  margin-left: 4px;
}
</style>
