<template>
  <div class="pair">
    <div v-if="pairedDevice" class="device-info">
      <div class="device-name">{{ pairedDevice.deviceName }}</div>
    </div>
    <div class="pair-title">Connect Your Sensor to Your PC</div>
    <div class="pair-content">
      <div class="pair-item">
        <div v-if="!directionConnected" class="not-connected">
          <div class="sensor-img">
            <img src="@/assets/pair/direction_sensor_not_connect.png" v-nodrag>
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
            <img src="@/assets/pair/direction_sensor_connected.png" v-nodrag>
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
            <img src="@/assets/pair/foot_sensor_not_connect.png" v-nodrag></img>
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
            <img src="@/assets/pair/foot_sensor_connected.png" v-nodrag>
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
            <img src="@/assets/pair/foot_sensor_not_connect.png" v-nodrag />
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
            <img src="@/assets/pair/foot_sensor_connected.png" v-nodrag>
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
    <div v-if="directionSensor.connected && leftFootSensor.connected && rightFootSensor.connected"
      class="pair-continue">
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
import { configWrite } from '@/utils/system';
import { useRoute, useRouter } from "vue-router";

const instance = getCurrentInstance();
const globalProperties = instance ? instance.appContext.config.globalProperties : {};
const host = globalProperties.$host;

const devices = ref(0);
const timer = ref(null);
const store = useStore();
const directionConnected = ref(false);
const leftFootConnected = ref(false);
const rightFootConnected = ref(false);
const allPaired = ref(false);
const activeStep = ref(2);

const router = useRouter()

const emit = defineEmits(['switch-view']);

const NAMESPACE = 'device';

const directionSensor = ref({
  connected: false,
  serialNumber: '',
  mac: [],
});

const leftFootSensor = ref({
  connected: false,
  serialNumber: '',
  mac: [],
});

const rightFootSensor = ref({
  connected: false,
  serialNumber: '',
  mac: [],
});

const pairedDevice = computed(() => store.getters[`${NAMESPACE}/getPairedDevice`]);

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
  const directionIsConnected = directionSensor.value.connected;
  const leftFootIsConnected = leftFootSensor.value.connected;
  const rightFootIsConnected = rightFootSensor.value.connected;

  const pairedAll = allPaired.value;

  console.log('传感器配对结果：' + pairedAll);

  // 获取配对信息
  const pairedDevice = computed(() => store.getters[`${NAMESPACE}/getPairedDevice`]);

  if (!pairedAll) {
    if (directionIsConnected && leftFootIsConnected && rightFootIsConnected) {
      // 写入配对信息
      const receiverSn = pairedDevice.value.receiverSn;
      const macCount = 3;
      const directionMac = toRaw(directionSensor.value.mac);
      const leftFootMac = toRaw(leftFootSensor.value.mac);
      const rightFootMac = toRaw(rightFootSensor.value.mac);
      const macArray = new Uint8Array([...directionMac, ...leftFootMac, ...rightFootMac]);
      const base64Data = uint8ArrayToBase64(macArray);
      const writePairResult = await host.WriteSensorPair(receiverSn, macCount, base64Data);
      if (writePairResult) {
        allPaired.value = true;
      } else {
        allPaired.value = false;
      }
    } else {
      if (!directionIsConnected) {
        await checkDirectionSensorConnected();
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
    const directionSn = toRaw(directionSensor.value.serialNumber);
    const directionMac = toRaw(directionSensor.value.mac);
    const leftFootSn = toRaw(leftFootSensor.value.serialNumber);
    const leftFootMac = toRaw(leftFootSensor.value.mac);
    const rightFootSn = toRaw(rightFootSensor.value.serialNumber);
    const rightFootMac = toRaw(rightFootSensor.value.mac);

    const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`]);

    const selectedDeviceInfo = selectedDevice.value;

    await writeDevicePairInfo();

    // 保存信息
    store.commit(`${NAMESPACE}/UPDATE_PAIRED_DEVICE`, {
      deviceName: selectedDeviceInfo.deviceName,
      deviceType: selectedDeviceInfo.deviceType,
      receiverSn: selectedDeviceInfo.serialNumber,
      receiverPid: selectedDeviceInfo.pid,
      receiverVid: selectedDeviceInfo.vid,
      directionSn: directionSn,
      directionMac: directionMac,
      leftFooterSn: leftFootSn,
      leftFooterMac: leftFootMac,
      rightFooterSn: rightFootSn,
      rightFooterMac: rightFootMac,
    });
  }
}

const writeDevicePairInfo = async () => {
  const folderPath = 'Local/New_Gateway';
  const fileName = 'C2CoreReceiverPairingInfo.json';
  const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`]);
  const data = {
    deviceName: selectedDevice.value.deviceName,
    deviceType: selectedDevice.value.deviceType,
    receiverSn: selectedDevice.value.serialNumber,
    receiverPid: toHex(selectedDevice.value.pid),
    receiverVid: toHex(selectedDevice.value.vid),
    directionSn: directionSensor.value.serialNumber,
    directionMac: toHexSeries(directionSensor.value.mac),
    leftFooterSn: leftFootSensor.value.serialNumber,
    leftFooterMac: toHexSeries(leftFootSensor.value.mac),
    rightFooterSn: rightFootSensor.value.serialNumber,
    rightFooterMac: toHexSeries(rightFootSensor.value.mac)
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

const checkDirectionSensorConnected = async () => {

  const pairedDeviceInfo = pairedDevice.value;

  if (pairedDeviceInfo) {
    const deviceType = pairedDeviceInfo.deviceType;
    const deviceInfo = allKatDevices.value.find(item => item.deviceType === deviceType);
    if (deviceInfo) {
      const directionPid = hexToDecimal(deviceInfo.directionPid);
      const directionVid = hexToDecimal(deviceInfo.directionVid);
      const directions = await host.GetLocalHIDDeviceCount(directionPid, directionVid);
      if (directions > 0 && directions < 2) {
        const nIndex = directions - 1;
        const directionInfo = await host.GetLcoalHIDDevice(directionPid, directionVid, nIndex);
        if (directionInfo) {
          // 获取方向传感器信息Mac地址
          const directionObj = JSON.parse(directionInfo);

          // 保存方向传感器SN
          directionSensor.value.serialNumber = directionObj.serialNumber;

          const directionMacInfo = await host.GetSensorInformation(directionObj.serialNumber);
          if (directionMacInfo.length > 0) {
            const directionMacValid = directionMacInfo.some(item => item !== 0);
            if (directionMacValid) {
              // 保存Mac地址
              directionSensor.value.mac = directionMacInfo;

              // 写入设备标识
              const directionMark = 1;
              const writeResult = await host.WriteDeviceId(directionObj.serialNumber, directionMark);
              if (writeResult) {
                const readResult = await host.ReadDeviceId(directionObj.serialNumber);
                if (readResult && readResult === directionMark) {
                  setTimeout(() => {
                    directionSensor.value.connected = true;
                    directionConnected.value = true;
                  }, 500);
                }
              }
            }
          }
        }
      }
    }
  }
}

const checkLeftFootSensorConnected = async () => {

  const pairedDeviceInfo = pairedDevice.value;

  if (pairedDeviceInfo) {
    const deviceType = pairedDeviceInfo.deviceType;
    const deviceInfo = allKatDevices.value.find(item => item.deviceType === deviceType);
    if (deviceInfo) {
      const leftFootPid = hexToDecimal(deviceInfo.footPid);
      const leftFootVid = hexToDecimal(deviceInfo.footVid);
      // 获取脚步传感器插入数量
      const leftFoots = await host.GetLocalHIDDeviceCount(leftFootPid, leftFootVid);
      if (leftFoots > 0 && leftFoots < 2) {
        const nIndex = leftFoots - 1;
        // 获取脚部传感器信息
        const leftFootInfo = await host.GetLcoalHIDDevice(leftFootPid, leftFootVid, nIndex);
        if (leftFootInfo) {
          const leftFootObj = JSON.parse(leftFootInfo);
          if (leftFootObj.pid && leftFootObj.vid && leftFootObj.serialNumber) {
            leftFootSensor.value.serialNumber = leftFootObj.serialNumber;
            // 写入设备标识
            const leftFootMark = 2;
            const writeResult = await host.WriteDeviceId(leftFootObj.serialNumber, leftFootMark);
            if (writeResult) {
              const readResult = await host.ReadDeviceId(leftFootObj.serialNumber);
              if (readResult && readResult === leftFootMark) {
                const leftFootMacInfo = await host.GetSensorInformation(leftFootObj.serialNumber);
                if (leftFootMacInfo.length > 0) {
                  const leftFootMacValid = leftFootMacInfo.some(item => item !== 0);
                  if (leftFootMacValid) {
                    leftFootSensor.value.mac = leftFootMacInfo;
                    // MAC地址有效，调用DeepSleep解除脚步传感器深度休眠
                    const releaseResult = await host.DeepSleep(leftFootObj.serialNumber, 0);
                    if (releaseResult) {
                      setTimeout(() => {
                        leftFootSensor.value.connected = true;
                        leftFootConnected.value = true;
                      }, 500);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const checkRightFootSensorConnected = async () => {

  const pairedDeviceInfo = pairedDevice.value;

  if (pairedDeviceInfo) {
    const deviceType = pairedDeviceInfo.deviceType;
    const deviceInfo = allKatDevices.value.find(item => item.deviceType === deviceType);
    if (deviceInfo) {
      const rightFootPid = hexToDecimal(deviceInfo.footPid);
      const rightFootVid = hexToDecimal(deviceInfo.footVid);
      // 获取脚步传感器插入数量
      const rightFoots = await host.GetLocalHIDDeviceCount(rightFootPid, rightFootVid);
      if (rightFoots > 0 && rightFoots < 2) {
        const nIndex = rightFoots - 1;
        // 获取脚部传感器信息
        const rightFootInfo = await host.GetLcoalHIDDevice(rightFootPid, rightFootVid, nIndex);
        if (rightFootInfo) {
          const rightFootObj = JSON.parse(rightFootInfo);
          if (rightFootObj.pid && rightFootObj.vid && rightFootObj.serialNumber && rightFootObj.serialNumber !== leftFootSensor.value.serialNumber) {
            rightFootSensor.value.serialNumber = rightFootObj.serialNumber;
            // 写入设备标识
            const rightFootMark = 3;
            const writeResult = await host.WriteDeviceId(rightFootObj.serialNumber, rightFootMark);
            if (writeResult) {
              const readResult = await host.ReadDeviceId(rightFootObj.serialNumber);
              if (readResult && readResult === rightFootMark) {
                const rightFootMacInfo = await host.GetSensorInformation(rightFootObj.serialNumber);
                if (rightFootMacInfo.length > 0) {
                  const rightFootMacValid = rightFootMacInfo.some(item => item !== 0);
                  if (rightFootMacValid) {
                    // 获取右脚传感器MAC地址
                    rightFootSensor.value.mac = rightFootMacInfo;
                    // MAC地址有效，调用DeepSleep解除脚步传感器深度休眠
                    const releaseResult = await host.DeepSleep(rightFootObj.serialNumber, 0);
                    if (releaseResult) {
                      setTimeout(() => {
                        rightFootSensor.value.connected = true;
                        rightFootConnected.value = true;
                      }, 500);
                    }
                  }
                }
              }
            }
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
  stopPolling();
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