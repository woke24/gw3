<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view v-if="isInitialized"></router-view>
    <div v-else v-loading="true" class="loading-mask"></div>
  </el-config-provider>
</template>

<script lang="js">
import { defineComponent, computed, onMounted, getCurrentInstance, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import {
  initDeviceState,
  startDevicePolling,
  startMonitorDeviceStatusPolling,
  startCommunicationQualityPolling,
  startArmbandPolling,
  startKatHandleWatcherPolling,
  startKatInputService,
  startSittingListen,
  handleOpenKatGatewayOverlay,
  handleOpenKatArmViewOverlay,
  handleDemandSittings,
  handleDemandArmbands,
  processHeartRateData,
  startGetDeviceDatasPolling
} from '@/utils/global'

import { initGameConfigSetting, initVrHudSetting, initArmviewSetting, handleSettingVrHud, handleSettingArmview } from '@/utils/global/config'

import { configWrite, getDeviceId, getGameThreadData, runGameThreadSync } from '@/utils/system';

import { generateInitialConfig, readGameControllerOptions, getAllGameConfigs, startGetRunningGamePolling } from '@/utils/game'

import { getAuthRoutes } from './router/permission'

export default defineComponent({
  name: 'App',
  setup () {
    const store = useStore()
    const i18n = useI18n()

    const instance = getCurrentInstance()
    const globalProperties = instance?.appContext.config.globalProperties || {}
    const host = globalProperties.$host

    // 初始化状态控制
    const isInitialized = ref(false)
    const size = computed(() => store.state.app.elementSize)
    const deviceIsReady = computed(() => !!store.state.device.treadmillData?.connected)

    const isLoggedIn = computed(() => store.state.user.status === 'loggedIn')

    const initAuth = async () => {
      await store.dispatch('user/validateLogin')
    }

    const initCore = async () => {
      const localLocale = localStorage.getItem('locale')
      if (localLocale) i18n.locale.value = localLocale
    }

    const initAfterLogin = async () => {
      await Promise.all([
        getAllGameConfigs(host),
        saveDeviceIdToConfig(host),
        initDeviceState(host)
      ])

      const gameConfigs = await readGameControllerOptions(host)

      if (!gameConfigs?.Default) {
        const result = await generateInitialConfig(host)
        if (result) {
          const allConfigs = await readGameControllerOptions(host)
          store.commit('game/globalGameConfigsChange', allConfigs)
        }
      } else {
        await generateInitialConfig(host)
        store.commit('game/globalGameConfigsChange', gameConfigs)
      }

      startDevicePolling(host)
      startGetDeviceDatasPolling(host)

      const data = await getGameThreadData()
      if (data) runGameThreadSync(host, data)
    }

    const startExtendedServices = async () => {
      // 如果已经启动过，不再重复执行
      if (store.state.app.servicesStarted) return

      initGameConfigSetting(host)
      initVrHudSetting(host)
      initArmviewSetting(host)

      startSittingListen(host)
      startArmbandPolling(host)
      handleSettingVrHud(host)
      handleSettingArmview(host)
      handleDemandSittings(host)
      handleDemandArmbands(host)

      store.commit('app/setServicesStarted', true)
    }

    // 保存设备ID逻辑
    const saveDeviceIdToConfig = async (host) => {
      try {
        const deviceId = await getDeviceId(host)
        const content = { deviceId }
        await configWrite(host, `Local/New_Gateway`, 'Device.json', JSON.stringify(content))
      } catch (e) { console.error('DeviceID Save Error:', e) }
    }

    onMounted(async () => {
      await initAuth()
      await initCore()

      if (isLoggedIn.value) {
        try {
          await initAfterLogin()
        } catch (e) {
          console.error('Init failed:', e)
        }
      }

      if (store.state.user.token) {
        await getAuthRoutes()
      }

      isInitialized.value = true
    })

    // 监听设备就绪状态启动高级服务
    watch(() => deviceIsReady.value, (ready) => {
      if (ready) startExtendedServices()
    }, { immediate: true })

    watch(() => isLoggedIn.value, async (loggedIn) => {
      if (loggedIn && isInitialized.value) {
        try {
          await initAfterLogin()
        } catch (e) {
          console.error('Init after login failed:', e)
        }
      }
    })

    const locale = computed(() => ({
      name: i18n.locale.value,
      el: i18n.messages.value[i18n.locale.value]?.el
    }))

    return { locale, size, isInitialized }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #C5CBD8;
  width: 100%;
  height: 100vh;
}

.loading-mask {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
