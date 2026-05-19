<template>
  <div class="vsv-info">
    <div>
      <span class="vsv-info-title">Preview</span>
      <span>Drag to move modules</span>
    </div>

    <div class="vsv-info-refresh">
      <el-icon :size="20" @click="hudDefaultPreview" style="cursor: pointer">
        <RefreshLeft />
      </el-icon>
    </div>
  </div>
  <div class="main-painel">
    <img :src="hudPreview" alt="" class="bg-img" />
  </div>

  <div v-if="isReady" class="vrhud-settings-view" :key="renderKey">
    <div class="vsv-item vsv-rate" :style="{
      transform: `scale(${hudConfigMsg.heartRateSize})`,
      opacity: hudConfigMsg.heartRateVisible ? hudConfigMsg.heartRateOpacity : 0,
      left: pctValues.heartRateX,
      top: pctValues.heartRateY
    }" v-dragable="'.vrhud-settings-view'" @pointerdown="dragBegin($event, 'heartRate')"
      @pointerup="dragEnd($event, 'heartRate')">
      <span v-show="hudConfigMsg.heartRatingVisible">❤️</span>
      <span v-show="hudConfigMsg.heartRatingVisible">{{ heartRate }}</span>
      <span v-show="hudConfigMsg.stateofSportsVisible">🏃‍♀️</span>
    </div>
    <div class="vsv-item vsv-direction" :style="{
      transform: `scale(${hudConfigMsg.deviceDirectionSize})`,
      opacity: hudConfigMsg.deviceDirectionVisible ? hudConfigMsg.deviceDirectionOpacity : 0,
      left: pctValues.deviceDirectionX,
      top: pctValues.deviceDirectionY
    }" v-dragable="'.vrhud-settings-view'" @pointerdown="dragBegin($event, 'deviceDirection')"
      @pointerup="dragEnd($event, 'deviceDirection')">
      <preview :deviceDirectionLeft="0" :deviceDirectionRight="includedAngle"></preview>
    </div>
    <div class="vsv-item vsv-rank" :style="{
      transform: `scale(${hudConfigMsg.todaysRankSize})`,
      opacity: hudConfigMsg.todaysRankVisible ? hudConfigMsg.todaysRankOpacity : 0,
      left: pctValues.todaysRankX,
      top: pctValues.todaysRankY
    }" v-dragable="'.vrhud-settings-view'" @pointerdown="dragBegin($event, 'todaysRank')"
      @pointerup="dragEnd($event, 'todaysRank')">
      <div>
        <div class="vsv-rank-title">Today's Rank</div>
        <div class="vsv-rank-updated" v-show="hudConfigMsg.updateFrequencyTextVisible">
          Updated Houly
        </div>
      </div>
      <div class="vsv-rank-value">{{ dailySteps.steps }}</div>
    </div>

    <div class="vsv-item vsv-date" :style="{
      transform: `scale(${hudConfigMsg.currentTimeSize})`,
      opacity: hudConfigMsg.currentTimeVisible ? hudConfigMsg.currentTimeOpacity : 0,
      left: pctValues.currentTimeX,
      top: pctValues.currentTimeY
    }" v-dragable="'.vrhud-settings-view'" @pointerdown="dragBegin($event, 'currentTime')"
      @pointerup="dragEnd($event, 'currentTime')">
      {{ dateTime }}
    </div>
    <div class="vsv-item vsv-data" :style="{
      transform: `scale(${hudConfigMsg.fitnessDataSize})`,
      opacity: hudConfigMsg.fitnessDataVisible ? hudConfigMsg.fitnessDataOpacity : 0,
      left: pctValues.fitnessDataX,
      top: pctValues.fitnessDataY
    }" v-dragable="'.vrhud-settings-view'" @pointerdown="dragBegin($event, 'fitnessData')"
      @pointerup="dragEnd($event, 'fitnessData')">
      <div class="vsv-data-steps" v-show="hudConfigMsg.walkingVisible">
        <div class="steps-icon">
          <img :src="stepsIcon" width="11" height="11" alt="steps icon" />
        </div>
        <div class="steps-text">
          <span>{{ dailySteps.steps }}</span>
        </div>
      </div>
      <div class="vsv-data-duration" v-show="hudConfigMsg.mileageVisible">
        <div class="duration-icon">
          <img :src="durationIcon" width="11" height="11" alt="duration icon" />
        </div>
        <div class="duration-text">
          <span>{{ distanceTraveled }} m</span>
        </div>
      </div>
      <div class="vsv-data-calories" v-show="hudConfigMsg.consumeVisible">
        <div class="calories-icon">
          <img :src="caloriesIcon" width="11" height="11" alt="calories icon" />
        </div>
        <div class="calories-text">
          <span>{{ caloriesBurned }} Kcal</span>
        </div>
      </div>
      <div class="vsv-data-times" v-show="hudConfigMsg.sportsTimeVisible">
        <div class="times-icon">
          <img :src="timesIcon" width="11" height="11" alt="times icon" />
        </div>
        <div class="times-text">
          <span>0 Min</span>
        </div>
      </div>
    </div>
    <div class="vsv-item vsv-status" :style="{
      transform: `scale(${hudConfigMsg.deviceStatusSize})`,
      opacity: hudConfigMsg.deviceStatusVisible ? hudConfigMsg.deviceStatusOpacity : 0,
      left: pctValues.deviceStatusX,
      top: pctValues.deviceStatusY
    }" v-dragable="'.vrhud-settings-view'" @pointerdown="dragBegin($event, 'deviceStatus')"
      @pointerup="dragEnd($event, 'deviceStatus')">
      <div class="sensor-item" v-show="hudConfigMsg.armbandVisible">
        <div class="sensor-icon">
          <img :src="armview" width="11" height="11" alt="" />
        </div>
        <div class="sensor-battery">
          <Battery v-if="armbandConnectedInfo.connected" :quantity="armbandConnectedInfo.battery"
            :proIsCharge="false" />
          <Battery v-else :quantity="0" :proIsCharge="false" />
        </div>
      </div>
      <div class="sensor-item" v-show="hudConfigMsg.directionVisible">
        <div class="sensor-icon">
          <img :src="direction" width="11" height="11" alt="" />
        </div>
        <div class="sensor-battery">
          <Battery v-if="treadmillData.connected && treadmillData.direction.batteryLevel > 0"
            :quantity="treadmillData.direction.batteryLevel * 100"
            :proIsCharge="treadmillData.direction.isBatteryCharging" />
          <Battery v-else :quantity="0" :proIsCharge="false" />
        </div>
      </div>
      <div class="sensor-item" v-show="hudConfigMsg.leftFootVisible">
        <div class="sensor-icon">
          <img :src="leftFoot" width="11" height="11" alt="" />
        </div>
        <div class="sensor-battery">
          <Battery v-if="treadmillData.connected && treadmillData.leftFoot.batteryLevel > 0"
            :quantity="treadmillData.leftFoot.batteryLevel * 100"
            :proIsCharge="treadmillData.leftFoot.isBatteryCharging" />
          <Battery v-else :quantity="0" :proIsCharge="false" />
        </div>
      </div>
      <div class="sensor-item" v-show="hudConfigMsg.leftFootVisible">
        <div class="sensor-icon">
          <img :src="rightFoot" width="11" height="11" alt="" />
        </div>
        <div class="sensor-battery">
          <Battery v-if="treadmillData.connected && treadmillData.rightFoot.batteryLevel > 0"
            :quantity="treadmillData.rightFoot.batteryLevel * 100"
            :proIsCharge="treadmillData.rightFoot.isBatteryCharging" />
          <Battery v-else :quantity="0" :proIsCharge="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, reactive, onMounted, watch, computed, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'
import hudPreview from '@/assets/game/hud_preview.png'
import drag from '@/directive/dragable/index.js'
import preview from '@/views/library/components/preview-circle.vue'
import { formatDate, formatTime } from '@/utils/function/formatDateTime.js'
import { RefreshLeft } from '@element-plus/icons-vue'
import Battery from '@/views/library/components/sensor-battery.vue'

// Icons 引入
import armview from '@/assets/hud/armview_icon.png'
import direction from '@/assets/hud/direction_icon.png'
import leftFoot from '@/assets/hud/left_foot_icon.png'
import rightFoot from '@/assets/hud/right_foot_icon.png'
import stepsIcon from '@/assets/hud/steps_icon.png'
import durationIcon from '@/assets/hud/duration_icon.png'
import caloriesIcon from '@/assets/hud/calories_icon.png'
import timesIcon from '@/assets/hud/times_icon.png'

import { isEqual } from 'lodash-es'


const props = defineProps({
  hudConfig: {
    type: Object
  }
})
// Vuex 缓存
const store = useStore()
const NAMESPACE = 'device'

const getNormalizedYaw = (hmdAngle, waistYaw) => {
  if (hmdAngle === undefined || waistYaw === undefined) return 0

  let angle = Math.floor(hmdAngle - waistYaw)

  angle = ((angle % 360) + 360) % 360

  angle = (360 - angle) % 360

  return angle
}

const headsetAngle = ref(0)
const bodyAngle = ref(0)
const heartRate = ref(0)
const includedAngle = ref(0)
const treadmillData = ref({}) // 跑步机数据
const armbandConnectedInfo = ref({}) // 臂带数据
const dailySteps = ref({}) // 行走步数

const isDragging = ref(false) // 拖动时禁止数据更新

const renderKey = ref(0);
const isReady = ref(false);

const getStateVal = (path) => {
  return path.split('.').reduce((o, i) => o?.[i], store.state)
}

// 计算卡路里和距离等数据
const caloriesBurned = computed(() => {
  const coefficient = Number(60 * 1.2 / 1000);
  return Math.round((dailySteps.value.steps || 0) * coefficient)
})

const distanceTraveled = computed(() => {
  const stepLengthInMeters = 0.7;
  return Number((Math.round(dailySteps.value.steps * stepLengthInMeters)).toFixed(2));
})

// //监听整个页面的数据，有变动
watch(
  () => [
    getStateVal(`${NAMESPACE}.deviceRealTimeData.headsetAngel`), // 获取头显角度等数据
    getStateVal(`${NAMESPACE}.deviceRealTimeData.bodyAngle`),
    getStateVal(`${NAMESPACE}.deviceRealTimeData.heartRate`),
    getStateVal(`${NAMESPACE}.dailySteps`),
    getStateVal(`${NAMESPACE}.treadmillData`),
    getStateVal(`${NAMESPACE}.armbandInfo`)
  ],

  (newValues, oldValues) => {

    console.log('isDragging:', isDragging.value)
    if (isDragging.value) return
    if (isEqual(newValues, oldValues)) {
      return
    }
    const [
      newHeadsetAngle,
      newBodyAngle,
      newHeartRate,
      newDailySteps,
      newTreadmillData,
      newArmbandInfo
    ] = newValues
    headsetAngle.value = newHeadsetAngle
    bodyAngle.value = newBodyAngle
    includedAngle.value = getNormalizedYaw(newHeadsetAngle, newBodyAngle)

    heartRate.value = newHeartRate

    dailySteps.value = newDailySteps || {}
    treadmillData.value = newTreadmillData || {}
    armbandConnectedInfo.value = newArmbandInfo || {}
  },

  { immediate: true }
)

const hudConfigMsg = reactive({})

const keys = [
  'heartRateX',
  'heartRateY',
  'deviceDirectionX',
  'deviceDirectionY',
  'todaysRankX',
  'todaysRankY',
  'currentTimeX',
  'currentTimeY',
  'fitnessDataX',
  'fitnessDataY',
  'deviceStatusX',
  'deviceStatusY',
  'heartRateSize',
  'deviceDirectionSize',
  'todaysRankSize',
  'currentTimeSize',
  'fitnessDataSize',
  'deviceStatusSize',
  'deviceDirectionX',
  'deviceDirectionY',
  'heartRateOpacity',
  'heartRateVisible',
  'heartRatingVisible',
  'stateofSportsVisible',
  'fitnessDataOpacity',
  'walkingVisible',
  'mileageVisible',
  'consumeVisible',
  'sportsTimeVisible',
  'deviceDirectionOpacity',
  'deviceStatusOpacity',
  'armbandVisible',
  'directionVisible',
  'leftFootVisible',
  'todaysRankOpacity',
  'updateFrequencyTextVisible',
  'currentTimeOpacity',
  'heartRatingVisible',
  'todaysRankVisible',
  'currentTimeVisible',
  'fitnessDataVisible',
  'deviceDirectionVisible',
  'deviceStatusVisible'
]

keys.forEach((key) => {
  watch(
    () => props.hudConfig?.[key],
    (val) => {
      if (val === undefined) return
      hudConfigMsg[key] = val
    },
    { immediate: true }
  )
})

// 设置位置
const clamp01 = (v) => {
  const n = Number(v)
  if (Number.isNaN(n)) return 0
  return Math.min(Math.max(n, -0.05), 1)
}
const pct = (v) => `${Math.round(clamp01(v) * 10000) / 100}%` // 精度到 0.01%
const pctValues = reactive({});

const defaultPositions = {
  deviceDirectionX: 0.03,
  deviceDirectionY: 0.2,
  heartRateX: 0.03,
  heartRateY: 0.04,
  fitnessDataX: 0.52,
  fitnessDataY: 0.26,
  deviceStatusX: 0.52,
  deviceStatusY: 0.66,
  todaysRankX: 0.03,
  todaysRankY: 0.66,
  currentTimeX: 0.52,
  currentTimeY: 0.04
}

// 看后期怎么传值
const dateTime = formatDate(0) + '  ' + formatTime(0)
const vDragable = drag

const emit = defineEmits(['update-position'])

onBeforeUnmount(() => {
})

const dragElestr = ref('');
// 拖动相关 mousedown 事件在元素上，mousemove 和 mouseup 事件绑定在 document 上，以确保拖动过程中鼠标移动到元素外部时仍能正常工作
function dragBegin (e, dragEle) {
  console.log('1111222', dragEle);
  isDragging.value = true
  dragElestr.value = dragEle;

  const el = e.currentTarget
  if (el && el.setPointerCapture) {
    el.setPointerCapture(e.pointerId)
  }
}

function dragEnd (e, dragEle) {
  console.log('22222', dragElestr.value);
  dragEle = dragElestr.value;
  console.log('22222 dragEle  ', dragEle);
  isDragging.value = false

  const el = e.currentTarget || e.target

  if (el && el.releasePointerCapture) {
    el.releasePointerCapture(e.pointerId)
  }
  const parent = el.parentElement
  if (!parent) {
    console.log('Parent element not found for', el)
    return
  }

  console.log('Element 宽高:'
  )
  console.log('- offsetWidth:', el.offsetWidth, 'offsetHeight:', el.offsetHeight
  )


  const er = el.getBoundingClientRect()
  const pr = parent.getBoundingClientRect()

  console.log('- er (元素):', 'width:', er.width, 'height:', er.height)
  console.log('- pr (父容器):', 'width:', pr.width, 'height:', pr.height)
  // 相对于父容器的像素位置
  const leftPx = er.left - pr.left
  const topPx = er.top - pr.top

  console.log('原始计算值:')
  console.log('- leftPx:', leftPx, 'topPx:', topPx)
  console.log('- leftPx / pr.width:', leftPx / pr.width)
  console.log('- topPx / pr.height:', topPx / pr.height)

  // 使用更高精度的四舍五入函数
  const roundToDecimal = (value, decimals = 4
  ) => {
    const factor = Math.pow(10
      , decimals)
    return Math.round((value + Number.EPSILON
    ) * factor) / factor
  }

  // const clamp01 = (v) => {
  //   const num = Number(v)
  //   if (isNaN(num)) return 0
  //   // 允许负值（超出边缘），最小-0.05即允许超出5%
  //   return Math.min(Math.max(num, -0.05), 1)
  // }

  const xRatio = clamp01(leftPx / pr.width
  )
  const yRatio = clamp01(topPx / pr.height
  )

  const xNorm = roundToDecimal(xRatio, 4
  )
  const yNorm = roundToDecimal(yRatio, 4
  )

  console.log('精确计算结果:'
  )
  console.log('- xRatio:', xRatio, 'yRatio:'
    , yRatio)
  console.log('- xNorm:', xNorm, 'yNorm:'
    , yNorm)
  console.log('- 转换为字符串:', xNorm.toString(), yNorm.toString
    ())

  const keyX = dragEle + 'X'
  const keyY = dragEle + 'Y'

  if (pctValues[keyX] !== undefined
  ) {
    pctValues[keyX] =
      pct
        (xNorm)
    console.log('Updated', keyX, 'to'
      , pctValues[keyX])
  }
  if (pctValues[keyY] !== undefined
  ) {
    pctValues[keyY] =
      pct
        (yNorm)
    console.log('Updated', keyY, 'to'
      , pctValues[keyY])
  }

  emit('update-position', {
    key: dragEle, x: xNorm, y
      : yNorm
  })
}

// 重置预览（默认值由父组件维护）
const hudDefaultPreview = () => {
  Object.keys(defaultPositions).forEach(key => {
    pctValues[key] = pct(defaultPositions[key]);
  });

  const positionKeys = [
    'deviceDirection',
    'heartRate',
    'fitnessData',
    'deviceStatus',
    'todaysRank',
    'currentTime'
  ];

  positionKeys.forEach(key => {
    emit('update-position', {
      key: key,
      x: defaultPositions[`${key}X`],
      y: defaultPositions[`${key}Y`]
    });
  });
}

// watch(() => props.hudConfig, async (val) => {
//   console.log('hudConfig changed:', val);
//   if (!val) return
//   await nextTick() // 等待 DOM 准备就绪

//   Object.keys(defaultPositions).forEach((key) => {
//     // 强制触发赋值
//     pctValues[key] = pct(val[key] ?? defaultPositions[key])
//   })
// }, { immediate: true, deep: true })

const updateAllPositions = () => {
  console.log('updateAllPositions');
  if (!props.hudConfig) return;
  Object.keys(defaultPositions).forEach((key) => {
    pctValues[key] = pct(props.hudConfig[key] ?? defaultPositions[key]);
  });
};

onMounted(async () => {
  console.log('hud-preview mounted');
  updateAllPositions();
  setTimeout(() => {
    renderKey.value++;
    isReady.value = true;
  }, 300);
});

</script>
<style lang="scss" scoped>
.vsv-info {
  width: 100%;
  height: 30px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(45, 58, 64, 1);
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  color: #fff;
}

.vsv-info .vsv-info-title {
  font-size: 16px;
  font-weight: bold;
}

.vsv-info span {
  margin-left: 15px;
  font-size: 12px;
}

.vsv-info-refresh {
  display: flex;
  justify-content: center;
  align-items: center;
}

.vr-hud-left-panel .main-painel {
  position: relative;
  width: 100%;
  line-height: 0;
}

.bg-img {
  width: 100%;
  display: block;
}

.vr-hud-left-panel .main-painel img {
  position: absolute;
  left: 0;
  top: 30px;
  width: 100%;
}

.vrhud-settings-view {
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  overflow: hidden;
  pointer-events: none;

  .vsv-data-steps {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }

  .vsv-data-duration {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }

  .vsv-data-calories {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }

  .vsv-data-times {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }
}

.vsv-item {
  position: absolute !important;
  background: rgba(5, 195, 222, 0.2);
  padding: 8px;
  min-width: 100px;
  border-radius: 8px;
  border: 2px solid transparent;
  transform-origin: 0 0;
  user-select: none;
  will-change: left, top;
  pointer-events: auto;
  cursor: pointer;
  z-index: 10;
  white-space: nowrap;
  &:hover {
    border-color: #05c3de;
    z-index: 9999 !important;
  }

  &.is-dragging {
    transition: none !important;
    z-index: 1000 !important;
    border: 2px solid #05c3de;
    cursor: grabbing;
    background: rgba(5, 195, 222, 0.4);

  }

  .sensor-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
}

.vsv-item:hover {
  border: 2px solid #05c3de;
  cursor: pointer;
}

.vsv-rank {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 150px;
}

.vsv-rank .vsv-rank-title {
  margin-bottom: 10px;
}

.vsv-rank .vsv-rank-updated {
  font-size: 12px;
}

.vsv-rank .vsv-rank-value {
  font-size: 16px;
}

.vsv-status {
  display: flex;
  flex-wrap: wrap;
  width: 150px;
}

.vsv-status>div {
  width: 50%;
}

.vsv-direction-cirle {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
