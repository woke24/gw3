<template>
  <div class="choose-device-container">
    <div v-if="deviceDetected" class="choose-device-main-panel">
      <div class="choose-device-tip">
        <h2>Switch the Device you want Connect</h2>
      </div>
      <div class="choose-device-list">
        <div class="choose-device-item" v-for="(item, index) in connectedDevices" :key="index"
          @click="chooseDevice(item)">
          <div class="image-placeholder">
            <img :src="item.img" alt="" v-nodrag />
          </div>
          <div class="device-name">{{ item.deviceName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, reactive, onBeforeMount, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { allConnectedDevices, selectUseDevice } from '@/utils/global'

const store = useStore()
const router = useRouter()

// 是否检测到设备
const deviceDetected = ref(false)
// 当前选中设备
const selectedDevice = ref(null)

const connectedDeviceInfo = ref({
  connected: false,
  deviceName: '',
  deviceType: 0,
  receiverSn: '',
  pid: '',
  vid: ''
})

const connectedDevices = allConnectedDevices()
console.log(connectedDevices.value.length)

// 选择设备
const chooseDevice = async (device) => {
  if (device) {
    const serialNumber = device.serialNumber
    selectedDevice.value = selectUseDevice(serialNumber)
    const choosedDevice = selectedDevice.value
    console.log(choosedDevice)
    // loco 系列
    if (choosedDevice.deviceType === 1 || choosedDevice.deviceType === 2) {
      const devicePid = choosedDevice.pid
      const deviceVid = choosedDevice.vid
      connectedDeviceInfo.value.connected = true
      connectedDeviceInfo.value.pid = devicePid
      connectedDeviceInfo.value.vid = deviceVid
      connectedDeviceInfo.value.receiverSn = choosedDevice.serialNumber
      connectedDeviceInfo.value.deviceName = choosedDevice.deviceName
      connectedDeviceInfo.value.deviceType = choosedDevice.deviceType
      // 存入本地
      const pairedDevice = {
        deviceName: connectedDeviceInfo.value.deviceName,
        deviceType: connectedDeviceInfo.value.deviceType,
        receiverSn: connectedDeviceInfo.value.receiverSn,
        receiverPid: connectedDeviceInfo.value.pid,
        receiverVid: connectedDeviceInfo.value.vid
      }
      // 写入缓存
      store.commit('device/UPDATE_LOCOS_PAIRED_DEVICE', pairedDevice)
      // C系列
    } else if (
      choosedDevice.deviceType === 3 ||
      choosedDevice.deviceType === 4 ||
      choosedDevice.deviceType === 8 ||
      choosedDevice.deviceType === 9
    ) {
      const devicePid = choosedDevice.pid
      const deviceVid = choosedDevice.vid
      connectedDeviceInfo.value.connected = true
      connectedDeviceInfo.value.pid = devicePid
      connectedDeviceInfo.value.vid = deviceVid
      connectedDeviceInfo.value.receiverSn = choosedDevice.serialNumber
      connectedDeviceInfo.value.deviceName = choosedDevice.deviceName
      connectedDeviceInfo.value.deviceType = choosedDevice.deviceType
      // 存入本地
      const pairedDevice = {
        deviceName: connectedDeviceInfo.value.deviceName,
        deviceType: connectedDeviceInfo.value.deviceType,
        receiverSn: connectedDeviceInfo.value.receiverSn,
        receiverPid: connectedDeviceInfo.value.pid,
        receiverVid: connectedDeviceInfo.value.vid
      }
      // 写入缓存
      store.commit('device/UPDATE_PAIRED_DEVICE', pairedDevice)
    }

    router.push({ name: 'Dashboard' })
  }
}

// 监听已连接设备数量变化
watch(
  () => connectedDevices.value.length,
  (newLength) => {
    console.log('Detected device count changed:', newLength)

    if (newLength > 0) {
      deviceDetected.value = true
    } else {
      deviceDetected.value = false
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.choose-device-main-panel {
  position: relative;
  width: 100%;
  height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.choose-device-main-panel .choose-device-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 50%;
}

.choose-device-main-panel h2 {
  font-size: 24px;
  color: var(--title-color);
  font-weight: bold;
  line-height: 34px;
  letter-spacing: 0;
  margin-top: 6px;
  margin-bottom: 6px;
}

.choose-device-list {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: nowrap;
  gap: 30px;
  margin-top: 30px;
}

.choose-device-list .choose-device-item {
  cursor: pointer;
  border-radius: 15px;
  box-shadow: 0px 3px 7.5px 0px rgba(0, 0, 0, 0.3);
}

.choose-device-list .choose-device-item .device-card {
  flex-shrink: 0;
  width: calc(100% / 4.6);
  padding: 0;
  border: 1px solid #eee;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  user-select: none;
  -webkit-user-drag: none;
}

.choose-device-list .choose-device-item .image-placeholder {
  width: auto;
  min-height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.choose-device-list .choose-device-item .device-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: 0px;
  color: var(--title-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7.5px;
  background: #0F1922;
}
</style>
