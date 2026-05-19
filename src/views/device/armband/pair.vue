<template>
  <div class="pair">
    <div v-if="pairedDevice" class="device-info">
      <div class="device-name">KAT Device Connect</div>
    </div>
    <div class="pair-title">
      <p>Plug the Bluetooth receiver into your PC’s USB port.</p>
      <p>Press the main button on Armband to turn on.</p>
    </div>
    <div class="pair-content">
      <div class="pair-item">
        <div v-if="!armbandConnected" class="not-connected">
          <div class="sensor-status">
            <div class="device-pairing">
              <div class="spinner-overlay">
                <div class="spinner"></div>
              </div>
            </div>
          </div>
          <div class="sensor-img">
            <img src="@/assets/pair/armview.png" v-nodrag />
          </div>
        </div>
        <div v-else class="connected">
          <div class="sensor-status">
            <div class="device-connected">
              <div class="connected-img">
                <img src="@/assets/pair/connected.png" v-nodrag />
              </div>
            </div>
          </div>
          <div class="sensor-img">
            <img src="@/assets/pair/armview.png" v-nodrag />
          </div>
        </div>
      </div>
    </div>
    <div v-if="armbandSensor.connected" class="pair-continue">
      <el-button type="info" @click="handleContinue">Continue</el-button>
    </div>
    <div class="step-container">
      <div :class="['step-item', 'step-left', activeStep === 1 ? 'active' : '']">
        Connect the Device
      </div>
      <div :class="['step-item', 'step-right', activeStep === 2 ? 'active' : '']" @click="monitoringState">
        Connect the Sensor
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import {
  computed,
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onUnmounted,
  watch,
  getCurrentInstance,
  toRaw
} from 'vue'
import { useStore } from 'vuex'
import {
  configWrite,
  getLocalHIDDeviceCount,
  getLcoalHIDDevice,
  getDevicePairingInfo,
  armbandIsListenDevice,
  armbandStartListen,
  armbandStopListen,
  getArmbandInfo,
  armbandBreak,
  armbandConnect,
  getConnectState
} from '@/utils/system'
import { useRoute, useRouter } from 'vue-router'

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const timer = ref(null)
const pairTimer = ref(null)

const store = useStore()
const armbandConnected = ref(false)
const armbandData = ref(null)
const paired = ref(false)
const activeStep = ref(2)

const armbandPairInfo = ref(null)

const pairingStatus = ref('idle')
const errorMessage = ref('')
const isProcessing = ref(false)

const router = useRouter()

const emit = defineEmits(['switch-view'])

const NAMESPACE = 'device'

const armbandSensor = reactive({
  connected: false,
  receiverMac: '',
  sensorMac: ''
})

const pairedDevice = computed(() => store.getters[`${NAMESPACE}/getPairedDevice`])

const allKatDevices = reactive([
  {
    deviceName: 'KAT loco S',
    deviceType: 2,
    receiverPid: '0x2F15',
    receiverVid: '0xC4F4',
    waistPid: '0x7F15',
    waistVid: '0xC4F4',
    footPid: '0x6F14',
    footVid: '0xC4F4'
  },
  {
    deviceName: 'KAT Walk C',
    deviceType: 3,
    receiverPid: '0x2F26',
    receiverVid: '0xC4F4',
    hallSensorPid: '0x8F25',
    hallSensorVid: '0xC4F4',
    footPid: '0x6F24',
    footVid: '0xC4F4'
  },
  {
    deviceName: 'KAT Walk C 2',
    deviceType: 4,
    receiverPid: '0x2F37',
    receiverVid: '0xC4F4',
    directionPid: '0x7F37',
    directionVid: '0xC4F4',
    footPid: '0x6F37',
    footVid: '0xC4F4',
    sittingPid: '0x8F37',
    sittingVid: '0xC4F4'
  },
  {
    deviceName: 'KAT Walk C 2 Core',
    deviceType: 8,
    receiverPid: '0x3F37',
    receiverVid: '0xC4F4',
    directionPid: '0x4F37',
    directionVid: '0xC4F4',
    footPid: '0x5F37',
    footVid: '0xC4F4',
    sittingPid: '0xBF37',
    sittingVid: '0xC4F4'
  },
  {
    deviceName: 'KAT Walk C2 Plus Enhanced',
    deviceType: 9,
    receiverPid: '0x3F12',
    receiverVid: '0xC4F4',
    directionPid: '0x4F12',
    directionVid: '0xC4F4',
    footPid: '0x5F12',
    footVid: '0xC4F4',
    sittingPid: '0xBF12',
    sittingVid: '0xC4F4',
    armbandPid: '0xBF13',
    armbandVid: '0xC4F4'
  }
])

const decimalToHex = (decimal) => {
  if (typeof decimal !== 'number' || !Number.isInteger(decimal) || decimal < 0) {
    return ''
  }
  let hex = decimal.toString(16)
  return `0x${hex.toUpperCase()}`
}

const hexToDecimal = (hexString) => {
  if (typeof hexString !== 'string') {
    return ''
  }

  const decimalValue = parseInt(hexString, 16)

  if (isNaN(decimalValue)) {
    return ''
  }

  return decimalValue
}

// 4. 启动定时器
const startPolling = () => {
  // 存储KAT设备列表
  store.commit('device/SET_KAT_DEVICES', allKatDevices)

  // 先清除可能存在的定时器，保证只有一个在运行
  if (timer.value) {
    clearInterval(timer.value)
  }

  // 立即执行
  armbandPairing()
}

const toHex = (num, width = 2) => {
  return '0x' + num.toString(16).toUpperCase().padStart(width, '0')
}
const toHexSeries = (arr) => {
  return arr.map((n) => toHex(n)).join(' ')
}

const uint8ArrayToBase64 = (uint8Array) => {
  const binaryString = String.fromCharCode.apply(null, uint8Array)

  return btoa(binaryString)
}

// 臂带配对
const armbandPairing = async () => {
  // 1. 防止并发执行
  if (isProcessing.value) return
  isProcessing.value = true

  console.log('--- 开始配对流程 ---')
  pairingStatus.value = 'pairing'
  errorMessage.value = ''

  const START_TIME = Date.now()
  const TIME_LIMIT = 60000

  const CONFIG = {
    PID: hexToDecimal('0xBF13'),
    VID: hexToDecimal('0xC4F4'),
    OUTER_LIMIT: 3,
    INNER_LIMIT: 15,
    BREAK_WAIT: 2000,
    PRE_INNER_WAIT: 2000,
    CHECK_INTERVAL: 1000
  }

  const checkTimeout = () => {
    if (Date.now() - START_TIME > TIME_LIMIT) {
      throw new Error('配对超时 (60s)')
    }
  }

  try {
    // await getDevicePairingInfo(host, 4)

    // 1. 设备检测
    const count = await getLocalHIDDeviceCount(host, CONFIG.PID, CONFIG.VID)
    const device = await getLcoalHIDDevice(host, CONFIG.PID, CONFIG.VID, 0)

    if (!device || count <= 0) {
      throw new Error('未检测到接收器设备，请确认插紧后重试')
    }

    const deviceInfo = JSON.parse(device)
    const serialNumber = deviceInfo?.serialNumber

    if (serialNumber) {
      // 2. 清空配对
      console.log('serialNumber', serialNumber)
      const isBreakSuccess = await armbandBreak(host, serialNumber)
      console.log('断开配对', isBreakSuccess)
      if (!isBreakSuccess) {
        throw new Error('清空配对失败，请重新尝试')
      }

      checkTimeout()
      // 等待2秒后进入循环
      await sleep(CONFIG.BREAK_WAIT)

      // 3. 外层循环（3次）
      for (let outer = 1; outer <= CONFIG.OUTER_LIMIT; outer++) {
        console.log(
          `[外循环] 第 ${outer} 次尝试, 已用时: ${Math.floor((Date.now() - START_TIME) / 1000)}s`
        )

        const connectRes = await armbandConnect(host, serialNumber)

        if (connectRes) {
          // 等待 2s 执行内循环
          await sleep(CONFIG.PRE_INNER_WAIT)

          // 4. 内层状态检查循环 (15次)
          for (let inner = 1; inner <= CONFIG.INNER_LIMIT; inner++) {
            const stateRes = await getConnectState(host, serialNumber)

            console.log(`[内循环] 第 ${inner} 次状态检查:`, stateRes)

            let isConnected = false
            if (stateRes) {
              const connectedObj = JSON.parse(stateRes)
              isConnected = connectedObj?.result

              if (isConnected) {
                armbandPairInfo.value = connectedObj.data
                armbandSensor.connected = true
                armbandSensor.receiverMac = connectedObj.data.receiverMAC
                armbandSensor.sensorMac = connectedObj.data.sensorMAC
              }
            }

            console.log('配对是否成功:', isConnected)
            console.log('armbandSensor', armbandSensor)

            if (isConnected) {
              pairingStatus.value = 'success'
              console.log('--- 配对成功 ---')
              armbandConnected.value = true
              console.log('配对信息:', armbandPairInfo.value)
              const armbandStr = JSON.stringify(armbandPairInfo.value)
              await writeArmbandPairingInfo(armbandStr)
              return true
            }

            // 对应流程图：每次调用间隔一秒
            if (inner < CONFIG.INNER_LIMIT) {
              await sleep(CONFIG.CHECK_INTERVAL)
            }
          }
        }

        // 如果内循环结束仍未成功，或 connectSent 为 false
        console.warn(`第 ${outer} 次完整尝试失败`)

        // 如果不是最后一次尝试，可以根据需要在这里加一个短暂停顿
        if (outer < CONFIG.OUTER_LIMIT) {
          await sleep(2000)
        }
      }
      throw new Error('配对失败，请重试')
    } else {
      store.commit('device/SET_ARMBAND_INFO', {
        connected: false,
        receiverMac: '',
        sensorMac: ''
      });
    }
  } catch (error) {
    console.error('配对过程发生错误:', error)
    pairingStatus.value = 'failed'
    return false
  } finally {
    // 无论成功失败，最后必须解锁
    isProcessing.value = false
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const writeArmbandPairingInfo = async (info) => {
  if (info) {
    const armBandInfo = JSON.parse(info)
    const folderPath = 'Local/New_Gateway'
    const fileName = 'ArmbandInfo.json'
    const data = {
      receiverMac: armBandInfo.receiverMAC,
      sensorMac: armBandInfo.sensorMAC
    }

    // 写入缓存
    store.commit('device/SET_ARMBAND_INFO', {
      connected: true,
      receiverMac: armbandConfigObj?.receiverMAC,
      sensorMac: armbandConfigObj?.sensorMAC
    });

    const vehicleData = JSON.stringify(data)
    return await configWrite(host, folderPath, fileName, vehicleData)
  }
}

// 5. 停止定时器
const stopPolling = async () => {
  if (timer.value) {
    await clearInterval(timer.value)
    timer.value = null
  }
}

const stopPairTimer = async () => {
  if (pairTimer.value) {
    await clearInterval(pairTimer.value)
    pairTimer.value = null
  }
}

const handleContinue = () => {
  router.push({
    name: 'Dashboard'
  })
}

const route = useRoute()
watch(
  () => route.path,
  (newPath) => { }
)

onBeforeMount(() => { })
onMounted(() => {
  startPolling()
})
onUnmounted(() => {
  stopPolling()
})
</script>

<style lang="scss" scoped>
.pair {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: inherit;
  justify-content: center;
}

.pair .device-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.pair .device-info .device-name {
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  color: var(--brand-color);
}

.pair-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: 0px;
  color: var(--title-color);
  max-width: 36em;

  p {
    margin: 0;
  }
}

.pair-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-top: 22.5px;

  .connected {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .not-connected {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .connected .sensor-img img {
    opacity: 0.6;
  }
}

.pair-continue {
  margin-top: 30px;
}

.pair-continue button {
  width: 150px;
  height: 33px;
  background: #0256ff;
  font-size: 16px;
  font-weight: normal;
  line-height: 23px;
  letter-spacing: 0px;
  color: #ffffff;
}

.pair .spinner-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
}

.pair .spinner {
  width: 22px;
  height: 22px;
  border: 4px solid rgba(0, 0, 0, 0.6);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.step-container {
  display: flex;
  width: 600px;
  height: 50px;
  background-color: #eee;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 3em;
}

.step-container .step-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #999;
}

.step-container .active {
  background-color: #1677ff !important;
  color: #fff !important;
}

.step-container .step-left {
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%);
  padding-right: 20px;
}

.step-container .step-right {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%);
  margin-left: -5%;
  padding-left: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
