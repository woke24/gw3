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
import { computed, ref, onBeforeMount, onMounted, onUnmounted, watch, getCurrentInstance, toRaw } from 'vue'
import { useStore } from 'vuex'
import { configWrite } from '@/utils/system';
import { useRoute, useRouter } from "vue-router";
import { allKatDevices } from '@/utils/global/devices';

const instance = getCurrentInstance();
const globalProperties = instance ? instance.appContext.config.globalProperties : {};
const host = globalProperties.$host;

const store = useStore();
const router = useRouter()

const NAMESPACE = 'device';
const activeStep = ref(2);
// 控制循环开关
const isPolling = ref(false);

// 传感器状态
const directionConnected = ref(false);
const leftFootConnected = ref(false);
const rightFootConnected = ref(false);
const allPaired = ref(false);

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

// // 从 Store 获取接收器信息
const pairedDevice = computed(() => store.getters[`${NAMESPACE}/getPairedDevice`]);
const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`]);

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

const toHex = (num, width = 2) => {
  return '0x' + num.toString(16).toUpperCase().padStart(width, '0');
};
const toHexSeries = (arr) => {
  return arr.map(n => toHex(n)).join(' ');
};

// 主循环
const startPolling = async () => {

  if (isPolling.value) return;

  isPolling.value = true;
  store.commit('device/SET_KAT_DEVICES', allKatDevices);

  while (isPolling.value) {
    await checkSensorConnected();
    // 每次检测停顿 200ms，防止 CPU 占用过高
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

// 停止
const stopPolling = () => {
  isPolling.value = false;
}

// 检测方向传感器连接状态
const checkSensorConnected = async () => {
  // 全部完成配对，执行最后数据写入并停止
  if (allPaired.value) {
    await finalizePairing();
    stopPolling();
    return;
  }

  // 2. 检查是否三个传感器物理连接都已识别
  if (directionSensor.value.connected && leftFootSensor.value.connected && rightFootSensor.value.connected) {
    await writeHardwarePairing();
    return;
  }

  // 3. 检测方向
  if (!directionSensor.value.connected) {
    await attemptConnectSensor('direction');
  }

  // 检测脚步
  if (!leftFootSensor.value.connected) {
    // 只有左脚没连时，尝试连左脚
    await attemptConnectSensor('left');
  } else if (!rightFootSensor.value.connected) {
    // 只有左脚连上了，才开始尝试连右脚
    await attemptConnectSensor('right');
  }
}

// 通用的传感器连接尝试逻辑
const attemptConnectSensor = async (type) => {
  const pInfo = pairedDevice.value;
  if (!pInfo) return;

  const deviceInfo = allKatDevices.find(item => item.deviceType === pInfo.deviceType);
  if (!deviceInfo) return;

  let pid, vid, mark, sensorRef, UIConnected;

  if (type === 'direction') {
    pid = hexToDecimal(deviceInfo.directionPid);
    vid = hexToDecimal(deviceInfo.directionVid);
    mark = 1;
    sensorRef = directionSensor;
    UIConnected = directionConnected;
  } else {
    pid = hexToDecimal(deviceInfo.footPid);
    vid = hexToDecimal(deviceInfo.footVid);
    mark = (type === 'left') ? 2 : 3;
    sensorRef = (type === 'left') ? leftFootSensor : rightFootSensor;
    UIConnected = (type === 'left') ? leftFootConnected : rightFootConnected;
  }

  const count = await host.GetLocalHIDDeviceCount(pid, vid);
  if (count > 0) {
    const rawData = await host.GetLcoalHIDDevice(pid, vid, count - 1);
    if (!rawData) return;

    const obj = JSON.parse(rawData);
    // 右脚排除左脚已占用的 SN
    if (type === 'right' && obj.serialNumber === leftFootSensor.value.serialNumber) return;

    // 写入并验证 Device ID
    const writeOk = await host.WriteDeviceId(obj.serialNumber, mark);
    if (writeOk) {
      const readMark = await host.ReadDeviceId(obj.serialNumber);
      if (readMark === mark) {
        const macInfo = await host.GetSensorInformation(obj.serialNumber);
        if (macInfo?.some(v => v !== 0)) {
          // 如果是脚部传感器，解除休眠
          if (type !== 'direction') await host.DeepSleep(obj.serialNumber, 0);

          sensorRef.value.serialNumber = obj.serialNumber;
          sensorRef.value.mac = macInfo;
          sensorRef.value.connected = true;
          UIConnected.value = true;
        }
      }
    }
  }
};

// 写入硬件配对表
const writeHardwarePairing = async () => {
  const macArray = new Uint8Array([
    ...toRaw(directionSensor.value.mac),
    ...toRaw(leftFootSensor.value.mac),
    ...toRaw(rightFootSensor.value.mac)
  ]);
  const base64Data = btoa(String.fromCharCode(...macArray));
  const success = await host.WriteSensorPair(pairedDevice.value.receiverSn, 3, base64Data);
  if (success) allPaired.value = true;
};

// 最终保存 JSON 配置文件并更新 Store
const finalizePairing = async () => {
  const folderPath = 'Local/New_Gateway';
  const fileName = 'C2ReceiverPairingInfo.json';
  const sInfo = selectedDevice.value;

  const data = {
    deviceName: sInfo.deviceName,
    deviceType: sInfo.deviceType,
    receiverSn: sInfo.serialNumber,
    receiverPid: toHex(sInfo.pid),
    receiverVid: toHex(sInfo.vid),
    directionSn: directionSensor.value.serialNumber,
    directionMac: toHexSeries(directionSensor.value.mac),
    leftFooterSn: leftFootSensor.value.serialNumber,
    leftFooterMac: toHexSeries(leftFootSensor.value.mac),
    rightFooterSn: rightFootSensor.value.serialNumber,
    rightFooterMac: toHexSeries(rightFootSensor.value.mac)
  };

  await configWrite(host, folderPath, fileName, JSON.stringify(data));

  store.commit(`${NAMESPACE}/UPDATE_PAIRED_DEVICE`, {
    ...data,
    directionMac: directionSensor.value.mac,
    leftFooterMac: leftFootSensor.value.mac,
    rightFooterMac: rightFootSensor.value.mac
  });
};

// 进入坐姿配对
const handleContinue = () => {
  router.push({
    name: 'vehicleHubPair'
  });
}

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