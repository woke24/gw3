<template>
  <div class="pair">
    <div v-if="pairedDevice" class="device-info">
      <div class="device-name">Vehicle Hub</div>
    </div>
    <div class="pair-title">
      Please, hold the pairing button for 3 seconds to start pairing(Wait for the ✓ symbol to
      appear). Constant light indicates successful pairing.
    </div>
    <div class="pair-content">
      <div class="pair-item">
        <div v-if="!vehicleHubConnected" class="not-connected">
          <div class="sensor-img">
            <img src="@/assets/pair/vehicle_hub.png" v-nodrag />
          </div>
          <div class="sensor-status">
            <div class="device-pairing">
              <div class="spinner-overlay">
                <div class="spinner"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="connected">
          <div class="sensor-img">
            <img src="@/assets/pair/vehicle_hub.png" v-nodrag />
          </div>
          <div class="sensor-status">
            <div class="device-connected">
              <div class="connected-img">
                <img src="@/assets/pair/connected.png" v-nodrag />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="vehicleSensor.connected" class="pair-continue">
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
  c2SittingStartListen,
  getC2VehicleInfo,
  c2VehiclePairingEnd,
  c2VehiclePairing,
  getDevicePairingInfo,
  getVehiclePairingState,
  getVehiclePairingResult,
  getVehiclePairingInfo
} from '@/utils/system'
import { useRoute, useRouter } from 'vue-router'

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const timer = ref(null)
const pairTimer = ref(null)
const store = useStore()
const vehicleHubConnected = ref(false)
const paired = ref(false)
const activeStep = ref(2)

const router = useRouter()

const emit = defineEmits(['switch-view'])

const NAMESPACE = 'device'

const vehicleSensor = ref({
  connected: false,
  serialNumber: '',
  mac: []
})

const pairedDevice = computed(() => store.getters[`${NAMESPACE}/getPairedDevice`])

const allKatDevices = ref([
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
  store.commit('device/SET_KAT_DEVICES', allKatDevices.value)

  // 先清除可能存在的定时器，保证只有一个在运行
  if (timer.value) {
    clearInterval(timer.value)
  }

  // 立即执行一次
  checkVehicleHubConnected()

  // 每 2 秒执行一次 checkVehicleHubConnected
  timer.value = setInterval(checkVehicleHubConnected, 2000)
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
// 坐姿检测
const checkVehicleHubConnected = async () => {
  const vehiclePid = hexToDecimal('0x8F37')
  const vehicleVid = hexToDecimal('0xC4F4')
  // await getDevicePairingInfo(host, 4)
  const vehicleHubs = await getLocalHIDDeviceCount(host, vehiclePid, vehicleVid)
  console.log('坐姿数量', vehicleHubs)
  if (vehicleHubs > 0 && vehicleHubs < 2) {
    const nIndex = vehicleHubs - 1
    const vehicleInfo = await getLcoalHIDDevice(host, vehiclePid, vehicleVid, nIndex)
    console.log('坐姿接收器信息', vehicleInfo)
    if (vehicleInfo) {
      // 启动侦听
      const receiverPid = hexToDecimal('0x2F37')
      const receiverVid = hexToDecimal('0xC4F4')
      const receiverIndex = 0
      const receiverInfo = await getLcoalHIDDevice(host, receiverPid, receiverVid, receiverIndex)
      console.log(receiverInfo)
      const result = await c2SittingStartListen(host, receiverInfo, vehicleInfo)
      console.log('启动侦听结果', result)
      if (result) {
        stopPolling()
        await vehiclePairing()
      }
    }
  }
}

// 坐姿配对
const vehiclePairing = async () => {
  console.log('开始配对')
  // 获取配对结果
  await getPairingResult()
}

const getPairingResult = async () => {
  // 先结束配对
  await stopPairing()

  await c2VehiclePairing(host)

  if (pairTimer.value) {
    await clearInterval(pairTimer.value)
  }

  pairTimer.value = setInterval(async () => {
    // 获取配对信息
    const vehiclePairingResult = await getVehiclePairingResult(host)
    console.log('配对结果', vehiclePairingResult)
    if (vehiclePairingResult) {
      const vehiclePairingInfo = await getVehiclePairingInfo(host)
      console.log('配对信息', vehiclePairingInfo)
      await writeVehiclePairingInfo(vehiclePairingInfo)
      vehicleHubConnected.value = true
      vehicleSensor.value.connected = true
      vehicleSensor.value.serialNumber = vehiclePairingInfo.receiverSN
      vehicleSensor.value.mac = vehiclePairingInfo.sensorMac
      await stopPairTimer()
      await stopPairing()
    }
  }, 100)
}

const monitoringState = async () => {
  await setInterval(async () => {
    const vehicleHubInfo = await getC2VehicleInfo(host)
    console.log('坐姿设备信息', vehicleHubInfo)
  }, 100)
}

const writeVehiclePairingInfo = async (info) => {
  if (info) {
    const vehicleInfo = JSON.parse(info)
    const folderPath = 'Local/New_Gateway'
    const fileName = 'VehicleInfo.json'
    const data = {
      ReceiverSN: vehicleInfo.receiverSN,
      SensorMac: vehicleInfo.sensorMac
    }
    const vehicleData = JSON.stringify(data)
    return await configWrite(host, folderPath, fileName, vehicleData)
  }
}

const stopPairing = async () => {
  await c2VehiclePairingEnd(host)
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
}

.pair-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-top: 22.5px;

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
