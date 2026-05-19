<template>
  <div class="pair">
    <div v-if="pairedDevice" class="device-info">
      <div class="device-name">{{ pairedDevice.deviceName }}</div>
    </div>
    <div class="pair-title">Connect Your Sensor to Your PC</div>
    <div class="pair-content">
      <div class="pair-item">
        <div v-if="!waistConnected" class="not-connected">
          <div class="sensor-img">
            <img src="@/assets/pair/waist_sensor.png" v-nodrag>
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
            <img src="@/assets/pair/waist_sensor.png" v-nodrag>
          </div>
          <div class="sensor-status">
            <div class="device-connected">
              <div class="connected-img">
                <img src="@/assets/pair/connected.png" v-nodrag>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pair-item">
        <div v-if="!leftFootConnected" class="not-connected">
          <div class="sensor-img">
            <img src="@/assets/pair/left_ankle_sensor.png" v-nodrag></img>
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
            <img src="@/assets/pair/left_ankle_sensor.png" v-nodrag>
          </div>
          <div class="sensor-status">
            <div class="device-connected">
              <div class="connected-img">
                <img src="@/assets/pair/connected.png" v-nodrag>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pair-item">
        <div v-if="!rightFootConnected" class="not-connected">
          <div class="sensor-img">
            <img src="@/assets/pair/right_ankle_sensor.png" v-nodrag />
          </div>
          <div class="sensor-status">
            <div class="sensor-pairing">
              <div class="spinner-overlay">
                <div class="spinner"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="connected">
          <div class="sensor-img">
            <img src="@/assets/pair/right_ankle_sensor.png" v-nodrag>
          </div>
          <div class="sensor-status">
            <div class="device-connected">
              <div class="connected-img">
                <img src="@/assets/pair/connected.png" v-nodrag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="waistSensor.connected && leftFootSensor.connected && rightFootSensor.connected" class="pair-continue">
      <el-button type="info" @click="handleContinue">Continue</el-button>
    </div>
    <div class="step-container">
      <div :class="['step-item', 'step-left', activeStep === 1 ? 'active' : '']">
        Connect the Device
      </div>
      <div :class="['step-item', 'step-right', activeStep === 2 ? 'active' : '']">
        Connect the Sensor
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { computed, ref, reactive, onBeforeMount, onMounted, onUnmounted, watch, getCurrentInstance, toRaw } from 'vue'
import { useStore } from 'vuex'
import { configWrite, locosWaistSerialNumberGet, locosWaistDeepSleepStatusSet, locosGetMacFromSensor, locosSetMacToReceiver, locosAnkleSerialNumberGet, locosAnkleDeepSleepStatusSet, locosAnklePacketDeviceAddressSet } from '@/utils/system';
import { useRoute, useRouter } from "vue-router";

const instance = getCurrentInstance();
const globalProperties = instance ? instance.appContext.config.globalProperties : {};
const host = globalProperties.$host;

const timer = ref(null);
const store = useStore();
const waistConnected = ref(false);
const leftFootConnected = ref(false);
const rightFootConnected = ref(false);
const allPaired = ref(false);
const activeStep = ref(2);

const router = useRouter()

const emit = defineEmits(['switch-view']);

const NAMESPACE = 'device';

const waistSensor = ref({
  connected: false,
  serialNumber: ''
});

const leftFootSensor = ref({
  connected: false,
  serialNumber: ''
});

const rightFootSensor = ref({
  connected: false,
  serialNumber: ''
});

const pairedDevice = computed(() => store.getters[`${NAMESPACE}/getLocosPairedDevice`]);

const allKatDevices = ref([{
  deviceName: 'KAT loco S',
  deviceType: 2,
  receiverPid: '0x2F15',
  receiverVid: '0xC4F4',
  waistPid: '0x7F15',
  waistVid: '0xC4F4',
  footPid: '0x6F14',
  footVid: '0xC4F4',
}, {
  deviceName: 'KAT Walk C',
  deviceType: 3,
  receiverPid: '0x2F26',
  receiverVid: '0xC4F4',
  hallSensorPid: '0x8F25',
  hallSensorVid: '0xC4F4',
  footPid: '0x6F24',
  footVid: '0xC4F4',
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
  sittingVid: '0xC4F4',
}, {
  deviceName: 'KAT Walk C 2 Core',
  deviceType: 8,
  receiverPid: '0x3F37',
  receiverVid: '0xC4F4',
  directionPid: '0x4F37',
  directionVid: '0xC4F4',
  footPid: '0x5F37',
  footVid: '0xC4F4',
  sittingPid: '0xBF37',
  sittingVid: '0xC4F4',
}, {
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
  armbandVid: '0xC4F4',
}]);

const decimalToHex = (decimal) => {
  if (typeof decimal !== 'number' || !Number.isInteger(decimal) || decimal < 0) {
    return "";
  }
  let hex = decimal.toString(16);
  return `0x${hex.toUpperCase()}`;
}

const hexToDecimal = (hexString) => {
  if (typeof hexString !== 'string') {
    return "";
  }

  const decimalValue = parseInt(hexString, 16);

  if (isNaN(decimalValue)) {
    return "";
  }

  return decimalValue;
}

// 4. 启动定时器
const startPolling = () => {

  // 存储KAT设备列表
  store.commit('device/SET_KAT_DEVICES', allKatDevices.value);

  // 先清除可能存在的定时器，保证只有一个在运行
  if (timer.value) {
    clearInterval(timer.value);
  }

  // 立即执行一次
  checkSensorConnected();

  // 每 200 毫秒执行一次 checkSensorConnected
  timer.value = setInterval(checkSensorConnected, 200);
}

// 检测方向传感器连接状态
const checkSensorConnected = async () => {
  const waistIsConnected = waistSensor.value.connected;
  const leftFootIsConnected = leftFootSensor.value.connected;
  const rightFootIsConnected = rightFootSensor.value.connected;

  const pairedAll = allPaired.value;

  console.log('传感器配对结果：' + pairedAll);

  // 获取配对信息
  const pairedDevice = computed(() => store.getters[`${NAMESPACE}/getLocosPairedDevice`]);

  if (!pairedAll) {
    if (waistIsConnected && leftFootIsConnected && rightFootIsConnected) {
      // 写入配对信息
      const receiverSn = pairedDevice.value.receiverSn;
      console.log('写入配对信息：' + receiverSn);
      allPaired.value = true;
    } else {

      if (!waistIsConnected) {
        await checkWaistSensorConnected();
      }

      if (!leftFootIsConnected) {
        await checkLeftFootSensorConnected();
      } else {
        if (!rightFootIsConnected) {
          await checkRightFootSensorConnected();
        }
      }
    }
  } else {
    stopPolling();
    const directionSn = toRaw(waistSensor.value.serialNumber);
    const leftFootSn = toRaw(leftFootSensor.value.serialNumber);
    const rightFootSn = toRaw(rightFootSensor.value.serialNumber);

    const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`]);

    const selectedDeviceInfo = selectedDevice.value;

    await writeDevicePairInfo();

    // 保存信息
    store.commit(`${NAMESPACE}/UPDATE_LOCOS_PAIRED_DEVICE`, {
      deviceName: selectedDeviceInfo.deviceName,
      deviceType: selectedDeviceInfo.deviceType,
      receiverSn: selectedDeviceInfo.serialNumber,
      receiverPid: selectedDeviceInfo.pid,
      receiverVid: selectedDeviceInfo.vid,
      waistSn: directionSn,
      leftFooterSn: leftFootSn,
      rightFooterSn: rightFootSn
    });
  }
}

const writeDevicePairInfo = async () => {
  const folderPath = 'Local/New_Gateway';
  const fileName = 'LocosPairingInfo.json';
  const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`]);
  const data = {
    deviceName: selectedDevice.value.deviceName,
    deviceType: selectedDevice.value.deviceType,
    receiverSn: selectedDevice.value.serialNumber,
    receiverPid: toHex(selectedDevice.value.pid),
    receiverVid: toHex(selectedDevice.value.vid),
    waistSn: waistSensor.value.serialNumber,
    leftFooterSn: leftFootSensor.value.serialNumber,
    rightFooterSn: rightFootSensor.value.serialNumber,
  }
  const deviceInfo = JSON.stringify(data);
  return await configWrite(host, folderPath, fileName, deviceInfo);
}

const toHex = (num, width = 2) => {
  return '0x' + num.toString(16).toUpperCase().padStart(width, '0');
};
const toHexSeries = (arr) => {
  return arr.map(n => toHex(n)).join(' ');
};

const uint8ArrayToBase64 = (uint8Array) => {
  const binaryString = String.fromCharCode.apply(null, uint8Array);

  return btoa(binaryString);
}

const checkWaistSensorConnected = async () => {

  const waistSn = await locosWaistSerialNumberGet(host);
  if (waistSn) {
    const deepSleep = 1;
    const deepResult = await locosWaistDeepSleepStatusSet(host, deepSleep);
    if (deepResult === 0) {
      // 1：Direction；2：Footer；
      const sensorType = 1;
      const getMacResult = await locosGetMacFromSensor(host, sensorType);
      if (getMacResult === 0) {
        const finallyResult = await locosSetMacToReceiver(host, sensorType);
        if (finallyResult === 0) {
          waistConnected.value = true;
          waistSensor.value.connected = true;
          waistSensor.value.serialNumber = waistSn;
        }
      }
    }
  }
}

const checkLeftFootSensorConnected = async () => {

  const leftFooterSn = await locosAnkleSerialNumberGet(host);
  if (leftFooterSn && leftFooterSn !== rightFootSensor.value.serialNumber) {
    const deepSleep = 1;
    const deepResult = await locosAnkleDeepSleepStatusSet(host, deepSleep);
    if (deepResult === 0) {
      // 2：Left Foot；3：Right Foot；
      const type = 2;
      const setResult = await locosAnklePacketDeviceAddressSet(host, type);
      if (setResult === 0) {
        // 1：Direction；2：Footer；
        const sensorType = 2;
        const getMacResult = await locosGetMacFromSensor(host, sensorType);
        if (getMacResult === 0) {
          const finallyResult = await locosSetMacToReceiver(host, type);
          if (finallyResult === 0) {
            leftFootConnected.value = true;
            leftFootSensor.value.connected = true;
            leftFootSensor.value.serialNumber = leftFooterSn;
          }
        }
      }
    }
  }
}

const checkRightFootSensorConnected = async () => {

  const rightFooterSn = await locosAnkleSerialNumberGet(host);
  if (rightFooterSn && rightFooterSn !== leftFootSensor.value.serialNumber) {
    const deepSleep = 1;
    const deepResult = await locosAnkleDeepSleepStatusSet(host, deepSleep);
    if (deepResult === 0) {
      // 2：Left Foot；3：Right Foot；
      const type = 3;
      const setResult = await locosAnklePacketDeviceAddressSet(host, type);
      if (setResult === 0) {
        // 1：Direction；2：Footer；
        const sensorType = 2;
        const getMacResult = await locosGetMacFromSensor(host, sensorType);
        if (getMacResult === 0) {
          const finallyResult = await locosSetMacToReceiver(host, type);
          if (finallyResult === 0) {
            rightFootConnected.value = true;
            rightFootSensor.value.connected = true;
            rightFootSensor.value.serialNumber = rightFooterSn;
          }
        }
      }
    }
  }
}

// 5. 停止定时器
const stopPolling = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}

const handleContinue = () => {
  router.push({
    name: 'Dashboard'
  });
}

const route = useRoute()
watch(() => route.path, (newPath) => {
})

onBeforeMount(() => {
});
onMounted(() => {
  startPolling();
})
onUnmounted(() => {
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
}

.pair-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-top: 22.5px;
}

.pair-continue {
  margin-top: 30px;
}

.pair-continue button {
  width: 150px;
  height: 33px;
  background: #0256FF;
  font-size: 16px;
  font-weight: normal;
  line-height: 23px;
  letter-spacing: 0px;
  color: #FFFFFF;
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
  background-color: #1677FF !important;
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