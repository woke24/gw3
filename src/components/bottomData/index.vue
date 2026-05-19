<template>
  <div class="footer-container">
    <div class="footer-devices">
      <div class="headset-device">
        <div class="device-item">
          <div v-if="!deviceStatus">
            <img :src="headsetOff" alt="Headset status off" v-nodrag />
          </div>
          <div v-else>
            <img :src="headsetReady" alt="Headset status ready" v-nodrag />
          </div>
        </div>
        <div class="device-item">
          <div v-if="!leftControllerInfo?.leftControllerSerialNumber">
            <img :src="leftHandOff" alt="Left hand off" v-nodrag />
          </div>
          <div v-else>
            <img :src="leftHandReady" alt="Left hand ready" v-nodrag />
          </div>
        </div>
        <div class="device-item">
          <div v-if="!rightControllerInfo?.rightControllerSerialNumber">
            <img :src="rightHandOff" alt="Right hand off" v-nodrag />
          </div>
          <div v-else>
            <img :src="rightHandReady" alt="Right hand ready" v-nodrag />
          </div>
        </div>
      </div>
      <div class="kat-device">
        <div class="device-item">
          <img v-if="selectedDevice.deviceType === 1" :src="locoDevice" alt="Loco" :class="{
            'device-connected': treadMillData.connected,
            'device-disconnected': !treadMillData.connected
          }" />
          <img v-if="selectedDevice.deviceType === 2" :src="locosDevice" alt="Loco S" :class="{
            'device-connected': treadMillData.connected,
            'device-disconnected': !treadMillData.connected
          }" />
          <img v-if="selectedDevice.deviceType === 3" :src="walkcDevice" alt="KAT Walk C" :class="{
            'device-connected': treadMillData.connected,
            'device-disconnected': !treadMillData.connected
          }" />
          <img v-if="selectedDevice.deviceType === 4" :src="walkc2Device" alt="KAT Walk C 2" :class="{
            'device-connected': treadMillData.connected,
            'device-disconnected': !treadMillData.connected
          }" />
          <img v-if="selectedDevice.deviceType === 8" :src="walkc2CoreDevice" alt="KAT Walk C 2 Core" :class="{
            'device-connected': treadMillData.connected,
            'device-disconnected': !treadMillData.connected
          }" />
          <img v-if="selectedDevice.deviceType === 9" :src="walkc2EnhancedDevice" alt="KAT Walk C 2 Plus Enhanced"
            :class="{
              'device-connected': treadMillData.connected,
              'device-disconnected': !treadMillData.connected
            }" />
          <img v-if="selectedDevice.deviceType === 10" :src="walkc3UltraDevice" alt="KAT Walk C 3 Ultra" :class="{
            'device-connected': treadMillData.connected,
            'device-disconnected': !treadMillData.connected
          }" />
        </div>
      </div>
      <div class="kat-sensors">
        <div class="kat-sensors-item">
          <img :src="directionDevice" alt="Direction Sensor" :class="{
            'device-connected':
              treadMillData.connected,
            'device-disconnected': !treadMillData.connected
          }" />
          <Battery v-if="
            treadMillData.connected &&
            treadMillData.direction?.batteryLevel > 0
          " :quantity="treadMillData.direction?.batteryLevel * 100"
            :proIsCharge="treadMillData.direction?.isBatteryCharging" />
        </div>
        <div class="kat-sensors-item">
          <img :src="leftFooterSensor" alt="Left Footer Sensor" :class="{
            'device-connected':
              treadMillData.connected,
            'device-disconnected': !treadMillData.connected
          }" />
          <Battery v-if="
            treadMillData.connected &&
            treadMillData.leftFoot?.batteryLevel > 0
          " :quantity="treadMillData.leftFoot?.batteryLevel * 100"
            :proIsCharge="treadMillData.leftFoot?.isBatteryCharging" />
        </div>
        <div class="kat-sensors-item">
          <img :src="rightFooterSensor" alt="Right Footer Sensor" :class="{
            'device-connected': treadMillData.connected,
            'device-disconnected': !treadMillData.connected
          }" />
          <Battery v-if="
            treadMillData.connected &&
            treadMillData.rightFoot?.batteryLevel > 0
          " :quantity="treadMillData.rightFoot?.batteryLevel * 100"
            :proIsCharge="treadMillData.rightFoot?.isBatteryCharging" />
        </div>
        <div class="kat-sensors-item">
          <img :src="armbandSensor" alt="Heart Sensor" :class="{
            'device-connected': armbandConnectedInfo.connected,
            'device-disconnected': !armbandConnectedInfo.connected
          }" />
          <Battery v-if="armbandConnectedInfo.connected && armbandConnectedInfo.battery > 0"
            :quantity="armbandConnectedInfo.battery" :proIsCharge="false" />
        </div>
      </div>
    </div>
    <div class="footer-analysis">
      <div v-if="isLibrayPage" @click="libraryType = !libraryType">
        <div v-show="libraryType">
          <el-popover title="Today's Fitness Data" :width="200" trigger="hover" content="Click to change" effect="dark">
            <template #reference>
              <img :src="libraryGame" class="data-img">
            </template>
          </el-popover>
        </div>
        <div v-show="!libraryType">
          <el-popover title="Cumulative Gameplay Data for This Game" :width="200" trigger="hover"
            content="Click to change" effect="dark">
            <template #reference>
              <img :src="libraryGlobal" class="data-img">
            </template>
          </el-popover>
        </div>
      </div>
      <div v-else>
        <img :src="gloablImg" class="data-img">
      </div>
      <div class="device-data">
        <div class="device-data-bottom">
          <el-popover :width="120" trigger="hover" effect="dark">
            <template #reference>
              <span class="device-popover-span">
                {{ dailySteps?.steps }} steps
              </span>
            </template>
            <template #default>
              <div class="device-popover-div">
                <div>
                  <img src="@/assets/icons/mileage.webp" />
                </div>
                <div>
                  <div class="device-popover-title">Walking</div>
                  <div class="device-popover-text">{{ dailySteps?.steps }} steps</div>
                </div>
              </div>
            </template>

          </el-popover>

          <el-popover :width="120" trigger="hover" effect="dark">
            <template #reference>
              <span class="device-popover-span">{{ dailySteps?.walkingTime }} hrs</span>
            </template>
            <template #default>
              <div class="device-popover-div">
                <div>
                  <img src="@/assets/icons/active_time.webp" />
                </div>
                <div>
                  <div class="device-popover-title">Active Time</div>
                  <div class="device-popover-text">{{ dailySteps?.walkingTime }} hrs</div>
                </div>
              </div>
            </template>
          </el-popover>

        </div>
        <div class="device-data-bottom">
          <el-popover :width="120" trigger="hover" effect="dark">
            <template #reference>
              <span class="device-popover-span">{{ dailySteps?.calories }} Kcal</span>
            </template>
            <template #default>
              <div class="device-popover-div">
                <div>
                  <img src="@/assets/icons/consume.webp" />
                </div>
                <div>
                  <div class="device-popover-title">Consume</div>
                  <div class="device-popover-text">{{ dailySteps?.calories }} Kcal</div>
                </div>
              </div>
            </template>
          </el-popover>

          <el-popover :width="120" trigger="hover" effect="dark">
            <template #reference>
              <span class="device-popover-span">{{ dailySteps?.meters }} m</span>
            </template>
            <template #default>
              <div class="device-popover-div">
                <div>
                  <img src="@/assets/icons/mileage.webp" />
                </div>
                <div>
                  <div class="device-popover-title">Mileage</div>
                  <div class="device-popover-text">{{ dailySteps?.meters }} m</div>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onUnmounted,
  watch,
  getCurrentInstance,
  computed
} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import { throttle, isArray, includes } from 'lodash-es';

import { getDate, getDaySteps, watchWalkingData, saveWalkingDatas } from '@/utils/global'

import Battery from '@/views/main/dashboard/components/battery/index.vue'

import headsetOff from '@/assets/devices/headset_off.png'
import headsetReady from '@/assets/devices/headset_ready.png'
import leftHandOff from '@/assets/devices/left_controller_off.png'
import leftHandReady from '@/assets/devices/left_controller_ready.png'
import rightHandOff from '@/assets/devices/right_controller_off.png'
import rightHandReady from '@/assets/devices/right_controller_ready.png'

// KAT Device
import locoDevice from '@/assets/devices/pic_loco.png'
import locosDevice from '@/assets/devices/pic_locos.png'
import walkcDevice from '@/assets/devices/pic_walkc.png'
import walkc2Device from '@/assets/devices/pic_walkc2.png'
import walkc2CoreDevice from '@/assets/devices/pic_walkc2_core.png'
import walkc2EnhancedDevice from '@/assets/devices/pic_walkc2PE.png'
import walkc3UltraDevice from '@/assets/devices/pic_walkc3_ultra.png'
import directionDevice from '@/assets/devices/direction.png'
import leftFooterSensor from '@/assets/devices/left_footer.png'
import rightFooterSensor from '@/assets/devices/right_footer.png'
import armbandSensor from '@/assets/devices/armband_ready.png'

// Icons
import footerImg from '@/assets/icons/footer.png'

// data
import gloablImg from '@/assets/fitness/global.png'
import libraryGame from '@/assets/fitness/library-game.png'
import libraryGlobal from '@/assets/fitness/library-global.png'

const footerImage = footerImg

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const route = useRoute()
const router = useRouter()

// Vuex 缓存
const store = useStore()
const NAMESPACE = 'device'

// 设备数据和方法
const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`])

// 根据设备类型筛选数据
const treadMillData = computed(() => {
  const deviceType = selectedDevice.value.deviceType;

  // 逻辑归类
  if ([2, 3].includes(deviceType)) {
    return store.getters[`${NAMESPACE}/getCTreadmillData`];
  }

  if ([4, 8, 9].includes(deviceType)) {
    return store.getters[`${NAMESPACE}/getTreadmillData`];
  }

  return {};
});

// 头显数据
const headsetData = computed(() => store.getters[`${NAMESPACE}/getHeadsetData`])

const hmdDeviceInfo = headsetData.value?.hmdDevice
const leftControllerInfo = headsetData.value?.leftControllerDevice
const rightControllerInfo = headsetData.value?.rightControllerDevice
const deviceStatus = headsetData.value?.ready

// 臂带数据
const armbandConnectedInfo = computed(() => store.getters[`${NAMESPACE}/getArmbandInfo`])

const dailySteps = computed(() => store.getters[`${NAMESPACE}/getDailySteps`])
console.log('今日行走数据', dailySteps.value)
let memoryCache = null
let lastSensorCache = null
let saveTimer = null
let unwatch = null
let isDirty = false

const loadFromJson = async () => {
  try {
    const userSteps = await getDaySteps(host)
    const currentDay = await getDate(host)

    let dailyData = {
      date: currentDay,
      steps: 0,
      calories: 0,
      meters: 0,
      walkingTime: 0
    }

    if (isArray(userSteps) && userSteps.length > 0) {
      const found = userSteps.find(item => item.date === currentDay)
      if (found) dailyData = found
    }

    store.commit(`${NAMESPACE}/UPDATE_DAILY_STEPS`, dailyData)

    memoryCache = { ...dailyData }

  } catch (err) {
    console.error('读取本地文件失败:', err)
  }
}

const handleRealtimeData = (data) => {
  if (!data || !memoryCache) return

  if (!lastSensorCache) {
    lastSensorCache = { ...data }
    return
  }

  const isReset =
    data.gameId !== lastSensorCache.gameId ||
    data.stepCount < lastSensorCache.stepCount

  let deltaSteps = 0
  let deltaCalories = 0
  let deltaMeters = 0
  let deltaWalkingTime = 0

  if (isReset) {
    deltaSteps = data.stepCount
    deltaCalories = data.calories
    deltaMeters = data.meters
    deltaWalkingTime = data.walkingTime
  } else {
    deltaSteps = data.stepCount - lastSensorCache.stepCount
    deltaCalories = data.calories - lastSensorCache.calories
    deltaMeters = data.meters - lastSensorCache.meters
    deltaWalkingTime = data.walkingTime - lastSensorCache.walkingTime
  }

  if (deltaSteps <= 0) return

  const updated = {
    ...memoryCache,
    steps: memoryCache.steps + Math.max(0, deltaSteps),
    calories: memoryCache.calories + Math.max(0, deltaCalories),
    meters: memoryCache.meters + Math.max(0, deltaMeters),
    walkingTime: memoryCache.walkingTime + Math.max(0, deltaWalkingTime)
  }

  memoryCache = updated

  store.commit(`${NAMESPACE}/UPDATE_DAILY_STEPS`, updated)

  isDirty = true

  lastSensorCache = { ...data }
}

const startAutoSave = () => {
  saveTimer = setInterval(async () => {
    if (!memoryCache || !isDirty) return

    try {
      await saveWalkingDatas(host, {
        ...memoryCache,
        currentDate: memoryCache.date
      })

      isDirty = false
    } catch (err) {
      console.error('保存失败:', err)
    }
  }, 5000)
}

// 获取路径
const isLibrayPage = computed(() => route.path.indexOf('/library/index') !== -1)
const libraryType = ref(true)

onMounted(async () => {
  if (!host) return

  await loadFromJson()

  unwatch = watchWalkingData(host, (data) => {
    handleRealtimeData(data)
  })

  startAutoSave()
});

onUnmounted(() => {
  if (unwatch) unwatch()

  if (saveTimer) {
    clearInterval(saveTimer)
    saveTimer = null
  }

  if (memoryCache && isDirty) {
    saveWalkingDatas(host, {
      ...memoryCache,
      currentDate: memoryCache.date
    })
  }
});
</script>

<style lang="scss" scoped>
.el-main .el-footer {
  background: #e0eaff;
}

.footer-container {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.footer-container>div {
  display: flex;
  align-items: center;
}

.footer-devices>div {
  padding: 0 10px;
  cursor: pointer;
  border-right: 2px solid var(--divider-color);
}

.footer-devices>div:nth-last-of-type(1) {
  border-right: none;
}

.footer-devices .headset-device {
  display: flex;
  gap: 10px;
}

.footer-devices .headset-device img {
  width: auto;
  height: 30px;
}

.footer-devices .kat-device {
  display: flex;
  gap: 6px;
}

.footer-devices .kat-device .device-item {
  position: relative;
}

.footer-devices .kat-device img {
  width: auto;
  height: 30px;
}

.footer-devices .kat-sensors {
  display: flex;
  gap: 6px;
}

.footer-devices .kat-sensors .kat-sensors-item {
  position: relative;
}

.footer-devices .kat-sensors img {
  width: auto;
  height: 30px;
}

.footer-analysis {
  height: 100%;
}


.footer-analysis>div {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  font-size: var(--footnote-font-size);
  padding: 0 10px;
  flex-direction: column;
  justify-content: center;
  color: var(--text-color);
}

.data-img {
  width: 30px;
  height: auto;
  cursor: pointer;
}

.device-data {
  border-left: 2px solid var(--divider-color);
  padding-left: 5px;
}

.device-data>div {
  padding: 2px 0;
  text-align: left;
}

.device-data-bottom {
  display: flex;
  justify-content: space-between;
  width: 140px;
  gap: 10px;
}

.device-data-bottom span {
  flex: 1;
}

.tooltip-desc {
  cursor: pointer;
  color: #999;
}

.device-connected {
  filter: grayscale(0%);
}

.device-disconnected {
  filter: grayscale(100%);
}

.electric-panel {
  position: absolute;
  bottom: 7px;
  left: 15px;
}

.device-popover-span {
  cursor: pointer;
}

.device-popover-div {
  display: flex;
  gap: 10px;
  align-items: center;
}

.device-popover-div img {
  width: 24px;
  height: auto;
}

.device-popover-text {
  color: var(--text-color);
}
</style>
