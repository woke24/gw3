<template>
  <div class="vsv-info">
    <div>
      <span class="vsv-info-title">Preview</span>
      <span>Drag to move modules</span>
    </div>
    <div class="vsv-info-refresh">
      <el-icon :size="20" @click="armviewDefaultPreview" style="cursor: pointer">
        <RefreshLeft />
      </el-icon>
    </div>
  </div>
  <div class="armview-preview-container">
    <img v-if="armviewConfigMsg.armViewDisplayArm" :src="armviewLeft" alt="" />
    <img v-else :src="armviewRight" alt="" />
    <div class="armview-settings-view asv-top">
      <!--  -->
      <div class="asv-panel" v-dragable="'.asv-top'" @pointerdown="dragBegin($event)"
        @pointerup="dragEnd($event, 'armview')" :style="{
          position: 'absolute',
          transform: `scale(${armviewConfigMsg.armViewSize})`,
          left: pctValues.armviewX,
          top: pctValues.armviewY,
        }">
        <div class="asv-top-rotate" :style="{
          transform: `rotate(${armviewConfigMsg.overlayRotAngle}deg)`
        }">
          <div class="asv-panel-dateTime">
            <span v-show="armviewConfigMsg.armviewCurrentTimeVisible">
              {{ dateTime }}
            </span>
          </div>
          <div class="asv-panel-middle">
            <div class="asvpm-left">
              <div class="asvpm-left-top" v-show="armviewConfigMsg.armviewHeartRateVisible">
                <span v-show="armviewConfigMsg.armviewHeartRatingVisible"></span>
                <span v-show="armviewConfigMsg.armviewHeartRatingVisible">{{ heartRate }}</span>
                <span v-show="armviewConfigMsg.armviewStateofSportsVisible"></span>
              </div>
              <div class="asvpm-left-bottom" v-show="armviewConfigMsg.armviewTodaysRankVisible">
                <div>
                  <div>
                    <div class="asvpm-left-text">Today's Rank</div>
                  </div>
                  <div class="asvpm-left-text" v-show="armviewConfigMsg.armviewUpdateFrequencyText">
                    Updated Hourly
                  </div>
                </div>
                <div style="font-weight: 600">{{ dailySteps.steps }}</div>
              </div>
            </div>
            <div class="asvpm-right" v-show="armviewConfigMsg.armviewDeviceDirectionVisible">
              <armviewCircle :deviceDirectionX="0" :deviceDirectionY="includedAngle"></armviewCircle>
            </div>
          </div>
          <div class="asvpm-panel-bottom">
            <div class="asvpm-data-div" v-show="armviewConfigMsg.armviewFitnessDataVisible">
              <!-- <div class="asvpm-fitnessData">Fitness Data</div> -->
              <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewWalkingVisible">
                <div>
                  <span></span>
                  <span>Walking</span>
                </div>
                <div>{{ dailySteps.steps }} steps</div>
              </div>
              <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewMileageVisible">
                <div>
                  <span></span>
                  <span>Mileage</span>
                </div>
                <div>0 m</div>
              </div>
              <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewConsumeVisible">
                <div>
                  <span></span>
                  <span>Consume</span>
                </div>
                <div>0 Kcal</div>
              </div>
              <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewActiveTimeVisible">
                <div>
                  <span></span>
                  <span>Active Time</span>
                </div>
                <div>0 min</div>
              </div>
            </div>
            <div class="asvpm-data-div" v-show="armviewConfigMsg.armviewDeviceStatusVisible">
              <!-- <div class="asvpm-deviceStatus">Device Status</div> -->
              <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewArmbandVisible">
                <div>
                  <span></span>
                  <span>Armband</span>
                </div>
                <div class="armband-battery">
                  <Battery v-if="armbandConnectedInfo.connected" :quantity="armbandConnectedInfo.battery"
                    :proIsCharge="false" />
                  <Battery v-else :quantity="0" :proIsCharge="false" />
                </div>
              </div>
              <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewDirectionVisible">
                <div>
                  <span></span>
                  <span>Direction</span>
                </div>
                <div class="direction-battery">
                  <Battery v-if="treadmillData.connected && treadmillData.direction.batteryLevel > 0"
                    :quantity="treadmillData.direction.batteryLevel * 100"
                    :proIsCharge="treadmillData.direction.isBatteryCharging" />
                  <Battery v-else :quantity="0" :proIsCharge="false" />
                </div>
              </div>
              <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewLeftFootVisible">
                <div>
                  <span></span>
                  <span>Left Foot</span>
                </div>
                <div class="left-foot-battery">
                  <Battery v-if="treadmillData.connected && treadmillData.leftFoot.batteryLevel > 0"
                    :quantity="treadmillData.leftFoot.batteryLevel * 100"
                    :proIsCharge="treadmillData.leftFoot.isBatteryCharging" />
                  <Battery v-else :quantity="0" :proIsCharge="false" />
                </div>
              </div>
              <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewLeftFootVisible">
                <div>
                  <span></span>
                  <span>Right Foot</span>
                </div>
                <div class="right-foot-battery">
                  <Battery v-if="treadmillData.connected && treadmillData.rightFoot.batteryLevel > 0"
                    :quantity="treadmillData.rightFoot.batteryLevel * 100"
                    :proIsCharge="treadmillData.rightFoot.isBatteryCharging" />
                  <Battery v-else :quantity="0" :proIsCharge="false" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="armview-settings-view asv-bottom">
      <div class="asv-panel">
        <div class="asv-panel-dateTime">
          <span v-show="armviewConfigMsg.armviewCurrentTimeVisible">
            {{ dateTime }}
          </span>
        </div>
        <div class="asv-panel-middle">
          <div class="asvpm-left">
            <div class="asvpm-left-top" v-show="armviewConfigMsg.armviewHeartRateVisible">
              <span v-show="armviewConfigMsg.armviewHeartRatingVisible"></span>
              <span v-show="armviewConfigMsg.armviewHeartRatingVisible">{{ heartRate }}</span>
              <span v-show="armviewConfigMsg.armviewStateofSportsVisible"></span>
            </div>
            <div class="asvpm-left-bottom" v-show="armviewConfigMsg.armviewTodaysRankVisible">
              <div>
                <div>
                  <div class="asvpm-left-text">Today's Rank</div>
                </div>
                <div class="asvpm-left-text" v-show="armviewConfigMsg.armviewUpdateFrequencyText">
                  Updated Hourly
                </div>
              </div>
              <div style="font-weight: 600">{{ dailySteps.steps }}</div>
            </div>
          </div>
          <div class="asvpm-right" v-show="armviewConfigMsg.armviewDeviceDirectionVisible">
            <armviewCircle :deviceDirectionX="0" :deviceDirectionY="includedAngle"></armviewCircle>
          </div>
        </div>
        <div class="asvpm-panel-bottom">
          <div class="asvpm-data-div" v-show="armviewConfigMsg.armviewFitnessDataVisible">
            <!-- <div class="asvpm-fitnessData">Fitness Data</div> -->
            <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewWalkingVisible">
              <div>
                <span></span>
                <span>Walking</span>
              </div>
              <div>{{ dailySteps.steps }} steps</div>
            </div>
            <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewMileageVisible">
              <div>
                <span></span>
                <span>Mileage</span>
              </div>
              <div>{{ caloriesBurned }} m</div>
            </div>
            <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewConsumeVisible">
              <div>
                <span></span>
                <span>Consume</span>
              </div>
              <div>{{ distanceTraveled }} Kcal</div>
            </div>
            <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewActiveTimeVisible">
              <div>
                <span></span>
                <span>Active Time</span>
              </div>
              <div>0 min</div>
            </div>
          </div>
          <div class="asvpm-data-div" v-show="armviewConfigMsg.armviewDeviceStatusVisible">
            <!-- <div class="asvpm-deviceStatus">Device Status</div> -->
            <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewArmbandVisible">
              <div>
                <span></span>
                <span>Armband</span>
              </div>
              <div class="armband-battery">
                <Battery v-if="armbandConnectedInfo.connected" :quantity="armbandConnectedInfo.battery"
                  :proIsCharge="false" />
                <Battery v-else :quantity="0" :proIsCharge="false" />
              </div>
            </div>
            <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewDirectionVisible">
              <div>
                <span></span>
                <span>Direction</span>
              </div>
              <div class="direction-battery">
                <Battery v-if="treadmillData.connected && treadmillData.direction.batteryLevel > 0"
                  :quantity="treadmillData.direction.batteryLevel * 100"
                  :proIsCharge="treadmillData.direction.isBatteryCharging" />
                <Battery v-else :quantity="0" :proIsCharge="false" />
              </div>
            </div>
            <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewLeftFootVisible">
              <div>
                <span></span>
                <span>Left Foot</span>
              </div>
              <div class="left-foot-battery">
                <Battery v-if="treadmillData.connected && treadmillData.leftFoot.batteryLevel > 0"
                  :quantity="treadmillData.leftFoot.batteryLevel * 100"
                  :proIsCharge="treadmillData.leftFoot.isBatteryCharging" />
                <Battery v-else :quantity="0" :proIsCharge="false" />
              </div>
            </div>
            <div class="asvpm-bottom-row" v-show="armviewConfigMsg.armviewLeftFootVisible">
              <div>
                <span></span>
                <span>Right Foot</span>
              </div>
              <div class="right-foot-battery">
                <Battery v-if="treadmillData.connected && treadmillData.rightFoot.batteryLevel > 0"
                  :quantity="treadmillData.rightFoot.batteryLevel * 100"
                  :proIsCharge="treadmillData.rightFoot.isBatteryCharging" />
                <Battery v-else :quantity="0" :proIsCharge="false" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { computed, ref, reactive, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import armviewLeft from '@/assets/game/armview_left.png'
import armviewRight from '@/assets/game/armview_right.png'
import drag from '@/directive/dragable/index.js'
import { formatDate, formatTime } from '@/utils/function/formatDateTime.js'
import { RefreshLeft } from '@element-plus/icons-vue'
import armviewCircle from '@/views/library/components/armview-circle.vue'

import Battery from '@/views/library/components/sensor-battery.vue'
import { isEqual } from 'lodash-es'
const vDragable = drag

const props = defineProps({
  armviewConfig: {
    type: Object
  }
})
const emit = defineEmits(['update-position'])

const store = useStore();
const NAMESPACE = 'device'


const getNormalizedYaw = (hmdAngle, waistYaw) => {
  if (hmdAngle === undefined || waistYaw === undefined) return 0;

  let angle = Math.floor(hmdAngle - waistYaw);

  angle = ((angle % 360) + 360) % 360;

  angle = (360 - angle) % 360;

  return angle;
}


const headsetAngle = ref(0)
const bodyAngle = ref(0)
const heartRate = ref(0)
const includedAngle = ref(0)
const treadmillData = ref({}) // 跑步机数据
const armbandConnectedInfo = ref({}) // 臂带数据
const dailySteps = ref({}) // 行走步数

const isDragging = ref(false) // 拖动时禁止数据更新

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

watch(
  () => [
    getStateVal(`${NAMESPACE}.deviceRealTimeData.headsetAngel`),
    getStateVal(`${NAMESPACE}.deviceRealTimeData.bodyAngle`),
    getStateVal(`${NAMESPACE}.deviceRealTimeData.heartRate`),
    getStateVal(`${NAMESPACE}.dailySteps`),
    getStateVal(`${NAMESPACE}.treadmillData`),
    getStateVal(`${NAMESPACE}.armbandInfo`)
  ],

  (newValues, oldValues) => {
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

const dateTime = computed(() => formatDate(0) + ' ' + formatTime(0))

const armviewConfigMsg = reactive({})

const keys = [
  'armViewDisplayArm',
  'armViewSize',
  'overlayRotAngle',
  'armviewHeartRateVisible',
  'armviewTodaysRankVisible',
  'armviewDeviceDirectionVisible',
  'armviewFitnessDataVisible',
  'armviewDeviceStatusVisible',
  'armviewCurrentTimeVisible',
  'armviewHeartRatingVisible',
  'armviewStateofSportsVisible',
  'armviewUpdateFrequencyText',
  'armviewWalkingVisible',
  'armviewMileageVisible',
  'armviewConsumeVisible',
  'armviewActiveTimeVisible',
  'armviewArmbandVisible',
  'armviewDirectionVisible',
  'armviewLeftFootVisible'
]

watch(() => props.armviewConfig, (val) => {
  if (val) {
    keys.forEach(k => {
      if (val[k] !== undefined) armviewConfigMsg[k] = val[k]
    })
  }
}, { immediate: true, deep: true })

// 设置位置
const clamp01 = (v) => {
  const n = Number(v)
  if (Number.isNaN(n)) return 0
  return Math.min(Math.max(n, -0.05), 1)
}
const pct = (v) => `${Math.round(clamp01(v) * 10000) / 100}%` // 精度到 0.01%
const defaultPositions = {
  armviewX: 0.23,
  armviewY: 0.10,
}
const pctValues = reactive({
  armviewX: pct(props.armviewConfig?.armviewX ?? defaultPositions.armviewX),
  armviewY: pct(props.armviewConfig?.armviewY ?? defaultPositions.armviewY),
})
const armviewDefaultPreview = () => {
  const defaultPos = { x: 0.23, y: 0.10 }
  pctValues.armviewX = pct(defaultPositions.armviewX)
  pctValues.armviewY = pct(defaultPositions.armviewY)
  emit('update-position', { key: 'armview', ...defaultPos })
}

function dragBegin (e) {
  isDragging.value = true
  const el = e.currentTarget
  if (el && el.setPointerCapture) {
    el.setPointerCapture(e.pointerId)
  }
}
function dragEnd (e, dragEle) {
  isDragging.value = false
  const el = e.currentTarget || e.target
  if (el && el.releasePointerCapture) {
    el.releasePointerCapture(e.pointerId)
  }

  const parent = el.parentElement
  if (!parent) return

  const er = el.getBoundingClientRect()
  const pr = parent.getBoundingClientRect()

  // 相对于父容器的像素位置
  const leftPx = Math.round(er.left - pr.left)
  const topPx = Math.round(er.top - pr.top)

  // 归一化 0..1（并四舍五入到 4 位小数）
  // const clamp01 = (v) => Math.min(Math.max(v, 0), 1)
  const round4 = (v) => Math.round(v * 10000) / 10000
  const xNorm = round4(clamp01(leftPx / pr.width))
  const yNorm = round4(clamp01(topPx / pr.height))

  const keyX = dragEle + 'X'
  const keyY = dragEle + 'Y'

  if (pctValues[keyX] !== undefined) {
    pctValues[keyX] = pct(xNorm)
  }
  if (pctValues[keyY] !== undefined) {
    pctValues[keyY] = pct(yNorm)
  }

  emit('update-position', { key: dragEle, x: xNorm, y: yNorm })
}

onMounted(() => {
  if (props.armviewConfig?.armviewX === undefined) {
    armviewDefaultPreview()
  }
})
</script>
<style lang="scss" scoped>
.armview-preview-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #000;
  overflow: hidden;

  .bg-arm {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    z-index: 1;
  }
}

.asv-top {
  position: relative;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.asv-panel {
  pointer-events: auto;
  width: 277px;
  height: 206px;
  transform-origin: 0 0;
  cursor: move;
  z-index: 10;
  background: rgba(5, 195, 222, 0.1);

  &.is-dragging {
    border: 2px solid #05c3de;
    background: rgba(5, 195, 222, 0.2);
    z-index: 100;
  }
}

.asv-top-rotate {
  width: 100%;
  height: 100%;
  border: 1.5px solid #05c3de;
  border-radius: 12px;
  box-sizing: border-box;
  background: rgba(10, 30, 35, 0.6);
  backdrop-filter: blur(2px);
}

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

.asv-top .asv-top-rotate {
  border: 2px solid #05c3de;
  border-radius: 12px;
  box-sizing: border-box;
}

.armview-preview-container {
  position: relative;
  aspect-ratio: 1;
}

.armview-preview-container>img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.armview-settings-view {
  aspect-ratio: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.asv-top-rotate {
  width: 100%;
  height: 100%;
  transform-origin: center center;
}

.asv-panel {
  width: 277px;
  height: 206px;
  z-index: 2;
  color: #05c3de;
  font-size: 11px;
  transform-origin: 0 0;
  box-sizing: border-box;

  .asv-panel-dateTime {
    height: 24px;
    line-height: 24px;
    text-align: center;
    text-indent: 110px;
  }

  .asv-panel-middle {
    height: 81px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;

    .asvpm-left-top {
      border-bottom: 1px solid #05c3de;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 24px;
    }

    .asvpm-left-bottom {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 50px;
      text-align: left;
      padding: 5px 0;
      box-sizing: border-box;

      .asvpm-left-text {
        line-height: 20px;
      }
    }
  }

  .asvpm-panel-bottom {
    display: flex;
    gap: 8px;
    padding: 0 15px;
    text-align: left;

    .asvpm-data-div {
      border: 1px solid #05c3de;
      flex: 1;
      padding: 10px 5px 5px;
      border-radius: 10px;
      position: relative;
      min-height: 80px;
      box-sizing: border-box;

      .asvpm-fitnessData,
      .asvpm-deviceStatus {
        position: absolute;
        top: -6px;
        left: 25%;
        text-align: center;
        width: 60%;
      }
    }

    .asvpm-data-div::before {
      position: absolute;
      left: 50%;
      top: 0;
      background: #0b464e;
      transform: translate(-50%, -50%);
      display: inline-block;
      margin: 0 auto;
      padding: 0 5px;
      white-space: nowrap;
    }

    &>div:nth-of-type(1)::before {
      content: 'Fitness Data';
    }

    &>div:nth-of-type(2)::before {
      content: 'Device Status';
    }

    .asvpm-bottom-row {
      display: flex;
      justify-content: space-between;
      height: 18px;
    }
  }

  .asvpm-panel-bottom>div:nth-of-type(1) .asvpm-bottom-row>div:nth-of-type(2) {
    min-width: 40px;
  }
}
</style>
