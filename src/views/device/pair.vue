<template>
  <div class="pair">
    <div v-if="connectedDeviceInfo.connected" class="device-name">
      <div class="device-name-title">{{ connectedDeviceInfo.deviceName }}</div>
    </div>
    <div class="pair-title">Connect Your Device to Your PC</div>
    <div class="pair-content">
      <div v-if="!connectedDeviceInfo.connected" class="not-connected">
        <img src="@/assets/pair/device_not_connected.png" v-nodrag />
      </div>
      <div v-if="connectedDeviceInfo.connected" class="connected">
        <img src="@/assets/pair/device_connected.png" v-nodrag />
      </div>
    </div>
    <div v-if="connectedDeviceInfo.connected" class="pair-continue">
      <el-button type="info" @click="sensorPair">Continue</el-button>
    </div>
    <div v-else class="pairing">
      <div class="device-loading">
        <div v-if="isLoading" class="spinner-overlay">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, reactive, onBeforeMount, onMounted, onUnmounted, watch, getCurrentInstance, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from "vue-router";

const instance = getCurrentInstance();
const globalProperties = instance ? instance.appContext.config.globalProperties : {};
const host = globalProperties.$host;

const devices = ref(0);
const timer = ref(null);
const store = useStore();
const isLoading = ref(true);
const router = useRouter()

const emit = defineEmits(['switch-view']);

const sensorPair = () => {
  emit('switch-view', 'sensorPair');
};

const NAMESPACE = 'device';
const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`]);

const connectedDeviceInfo = ref({
  connected: false,
  deviceName: '',
  deviceType: 0,
  receiverSn: '',
  pid: '',
  vid: '',
});

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

// 4. 启动定时器
const startPolling = () => {

  // 存储KAT设备列表
  store.commit('device/SET_KAT_DEVICES', allKatDevices.value);

  // 先清除可能存在的定时器，保证只有一个在运行
  if (timer.value) {
    clearInterval(timer.value);
  }

  // 立即执行一次
  checkReceiverConnected();

  // 每 200 毫秒执行一次 checkReceiverConnected
  timer.value = setInterval(checkReceiverConnected, 200);
  console.log('Device status polling started every 200ms.');
}

const checkReceiverConnected = async () => {
  // 检查设备连接数量
  const count = await host.DeviceCount();
  const selectedDeviceInfo = selectedDevice.value;
  if (count > 0) {
    if (selectedDeviceInfo) {
      const devicePid = selectedDeviceInfo.pid;
      const deviceVid = selectedDeviceInfo.vid;
      connectedDeviceInfo.value.pid = selectedDeviceInfo.pid;
      connectedDeviceInfo.value.vid = selectedDeviceInfo.vid;
      connectedDeviceInfo.value.receiverSn = selectedDeviceInfo.serialNumber;
      connectedDeviceInfo.value.deviceName = selectedDeviceInfo.deviceName;
      connectedDeviceInfo.value.deviceType = selectedDeviceInfo.deviceType;
      if (devicePid && deviceVid) {
        const isConnected = await host.GetLocalHIDDeviceCount(devicePid, deviceVid);
        if (isConnected > 0) {
          setTimeout(() => {
            connectedDeviceInfo.value.connected = true;
          }, 1000);
          const pairedDevice = {
            deviceName: connectedDeviceInfo.value.deviceName,
            deviceType: connectedDeviceInfo.value.deviceType,
            receiverSn: connectedDeviceInfo.value.receiverSn,
            receiverPid: connectedDeviceInfo.value.pid,
            receiverVid: connectedDeviceInfo.value.vid,
          };
          store.commit('device/UPDATE_PAIRED_DEVICE', pairedDevice);
        } else {
          connectedDeviceInfo.connected = false;
          isLoading.value = true;
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
    console.log('Device status polling stopped.');
  }
}

const route = useRoute()
watch(() => route.path, (newPath) => {
})

onBeforeMount(() => {
});
onMounted(() => {
  console.log(route.path)
  startPolling();
})
onUnmounted(() => {
  stopPolling();
})
</script>

<style lang="scss" scoped>
.pair {
  display: flex;
  justify-content: center;
  height: 80vh;
  flex-direction: column;
  align-items: center;
}

.pair .device-name {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.pair .device-name .device-name-title {
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

.pair-continue button {
  width: 150px;
  height: 33px;
  background: #eeeeee;
  font-size: 16px;
  font-weight: normal;
  line-height: 23px;
  letter-spacing: 0px;
  color: #767676;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
