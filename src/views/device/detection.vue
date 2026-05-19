<template>
  <div class="device-detection-container">
    <div class="device-detection-title">
      <p>Please connect your KATVR device to continue.</p>
    </div>
    <div class="device-detection-panel">
      <div class="left-panel">
        <el-image :src="connect" alt="connect" />
      </div>
      <div class="loading">
        <div v-if="isLoading" class="spinner-overlay">
          <div class="spinner"></div>
        </div>
        <div v-else>
          <img src="@/assets/pair/connected.png"></img>
        </div>
      </div>
      <div class="right-panel">
        <el-image :src="main" alt="main" />
      </div>
    </div>
    <div v-if="connected" class="pair-continue" @click="handlePair">
      <el-button type="info">Continue</el-button>
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
import { ref, onBeforeMount, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from "vue-router";

import { allConnectedDevices } from '@/utils/global'

import connect from '@/assets/pair/connect_receiver.png'
import main from '@/assets/pair/main.png'

const store = useStore();
const router = useRouter()
const route = useRoute()

const isLoading = ref(true);
const activeStep = ref(1);
const connected = ref(false)

// 所有连接的设备列表
const connectedDevices = allConnectedDevices()
console.log(connectedDevices.value.length)

const handlePair = () => {
  router.push({ name: 'deviceChoose' });
}

// 监听已连接设备数量变化
watch(
  () => connectedDevices.value.length,
  (newLength) => {
    console.log('Detected device count changed:', newLength);

    if (newLength > 0) {
      isLoading.value = false;
      connected.value = true;
    } else {
      isLoading.value = true;
      connected.value = false;
    }
  },
  { immediate: true }
);

onBeforeMount(() => {
});
onMounted(() => {
})
onUnmounted(() => {
})
</script>

<style lang="scss" scoped>
.device-detection-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.device-detection-container .device-detection-title {
  margin-top: 2em;
  margin-bottom: 2em;
}

.device-detection-container .device-detection-title p {
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: 0px;
  color: var(--title-color);
}

.device-detection-container .device-detection-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.device-detection-container .device-detection-panel .spinner-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
}

.device-detection-container .device-detection-panel .spinner {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #191919;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.device-detection-container .pair-continue button {
  width: 150px;
  height: 33px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 15px;
  gap: 10px;
  background: #05C3DE;
  border-radius: 5px;
  font-size: 16px;
  font-weight: normal;
  line-height: 23px;
  letter-spacing: 0px;
  color: #FFFFFF;
  border: var(--brand-color);
}

.device-detection-container .step-container {
  display: flex;
  width: 600px;
  height: 50px;
  background-color: #eee;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 3em;
}

.device-detection-container .step-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #999;
}

.device-detection-container .active {
  background-color: var(--brand-color) !important;
  color: #fff !important;
}

.device-detection-container .step-left {
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%);
  padding-right: 20px;
}

.device-detection-container .step-right {
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