<template>
  <div class="main-container">
    <div class="carousel-list">
      <Carousel />
    </div>
    <div class="main-content-container">
      <el-row :gutter="20" class="main-layout-container">
        <el-col :span="17" class="left-content-area">
          <Fitness />
          <Recent />
        </el-col>
        <el-col :span="7" class="right-visual-area">
          <Bot />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { newGameConfiguration } from '@/api/gateway'
import { gameCategoryLists } from '@/api/game'
import { activation } from '@/api/user'
import { configRead, configWrite, getGameInstalledStatus } from '@/utils/system'
import { getUserInfo } from '@/utils/global'

import Carousel from './components/carousel/index.vue'
import Fitness from './components/fitness/index.vue'
import Bot from './components/bot/index.vue'
import Recent from './components/recent/index.vue'

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const store = useStore()

const NAMESPACE = 'device'
// 设备数据和方法
const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`])

const gameConfig = ref({})
const gameLists = ref([])
const installed = ref([])

const getGameLists = async () => {
  const res = await gameCategoryLists()
  if (res.code === 20000) {
    gameLists.value = res.data
    const result = await checkGameCategoryListUpdate()
    if (result) {
      await saveGameCategoryLists(res.data)
    }
  }
}
const new_GatewayPath = 'Local/New_Gateway'
const profilePath = 'Profile'
const saveGameCategoryLists = async (games) => {
  const folderPath = new_GatewayPath
  const fileName = 'GameCategoryList.json'
  if (games) {
    const data = JSON.stringify(games)
    return await configWrite(host, folderPath, fileName, data)
  }
}

const checkGameCategoryListUpdate = async () => {
  const folderPath = new_GatewayPath
  const fileName = 'GameCategoryList.json'
  const result = await configRead(host, folderPath, fileName)
  if (result) {
    const localGames = JSON.parse(result)
    if (localGames && localGames.result) {
      const localGameList = JSON.parse(localGames.data)
      const remoteGameList = gameLists.value
      return await juxtapose(localGameList, remoteGameList)
    } else {
      await saveGameCategoryLists(gameLists.value)
      return true
    }
  }
  return false
}

const juxtapose = async (localDatas, remoteDatas) => {
  const localHash = generateHash(JSON.stringify(localDatas))
  const remoteHash = generateHash(JSON.stringify(remoteDatas))
  if (localHash !== remoteHash) {
    return true
  } else {
    return false
  }
}

const generateHash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return hash.toString()
}

// 会员激活
const activateMembership = async () => {
  const userInfo = await getUserInfo(host)
  if (userInfo && selectedDevice.value) {
    const folderPath = new_GatewayPath
    const fileName = 'Device.json'

    const deviceInfo = await configRead(host, folderPath, fileName)

    let deviceId = ''

    if (deviceInfo) {
      const localDeviceInfo = JSON.parse(deviceInfo)
      if (localDeviceInfo && localDeviceInfo.result) {
        const localData = JSON.parse(localDeviceInfo.data)
        if (localData && localData.deviceId) {
          deviceId = localData.deviceId
        }
      }
    }

    const userId = userInfo?.userId
    const deviceType = selectedDevice.value?.deviceType
    const receiverSn = selectedDevice.value?.serialNumber

    const res = await activation({
      userId: userId,
      deviceType: deviceType,
      receiverSn: receiverSn,
      deviceId: deviceId
    })
    if (res.code === 20000) {
      console.log('Membership activated successfully')
      return;
    } else {
      console.error('Membership activation failed:', res.message)
      return;
    }
  } else {
    console.warn('User info or selected device is missing, cannot activate membership')
    return;
  }
}

onMounted(() => {
  getGameLists()
  activateMembership()
})
</script>

<style lang="scss" scoped>
.main-container {
  position: relative;
  padding: 15px;
}
</style>
