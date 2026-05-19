<template>
  <div class="device-container" :style="{ '--bg-image': 'url(' + backgroundImage + ')' }">
    <div class="device-top-panel">
      <div class="panel-left"></div>
      <div class="panel-right"></div>
    </div>
    <div class="device-main-panel">
      <div class="device-check">
        <h2 v-if="isLoading">{{ $t('message.device.noDevice') }}</h2>
      </div>
      <div class="device-tip">
        <h2 v-if="isLoading">{{ $t('message.device.noDeviceTip') }}</h2>
      </div>
      <div class="device-loading">
        <div v-if="isLoading" class="spinner-overlay">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
    <div class="device-bottom-panel"></div>
  </div>
</template>

<script lang="js" setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onUnmounted,
  watch,
  getCurrentInstance
} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import panelBackground from '@/assets/images/bg_pair_null.png'

import { allConnectedDevices } from '@/utils/global'

const store = useStore()
const isLoading = ref(true)
const router = useRouter()

const backgroundImage = ref(panelBackground)

// 所有连接的设备列表
const connectedDevices = allConnectedDevices()
console.log(connectedDevices.value.length)

watch(
  () => connectedDevices.value.length,
  (newLength) => {
    console.log('Detected device count changed:', newLength)

    if (newLength < 2) {
      isLoading.value = false
      router.push('/device/detection')
    } else {
      isLoading.value = false
      router.push('/device/choose')
    }
  },
  { immediate: true }
)

onMounted(() => {})
</script>

<style lang="scss" scoped>
.device-container {
  background: var(--bg-image) no-repeat top center;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}

.device-top-panel {
  width: 100%;
  height: 80px;
  -webkit-app-region: drag;
}

.device-main-panel {
  position: relative;
  width: 100%;
  height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.device-main-panel h2 {
  text-align: center;
  color: #ffffff;
  font-size: 26px;
  margin-top: 6px;
  margin-bottom: 6px;
}

.device-main-panel .spinner-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
}

.device-main-panel .spinner {
  width: 22px;
  height: 22px;
  border: 4px solid rgba(255, 255, 255, 0.3);
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
