<template>
  <div class="detail-page">
    <div class="game-header">
      <div v-if="gameId > 0" class="game-info">
        <div class="game-info-item">
          <div class="game-container-wrapper">
            <div class="game-icon">
              <img :src="gameInfo?.gameIcon" alt="" v-nodrag />
            </div>
            <div class="game-content">
              <div class="game-desc">
                <div class="game-title">
                  <p>{{ gameInfo?.gameName }}</p>
                </div>
                <div class="game-tags">
                  <div v-for="item in gameFlag" :key="item" class="game-tags-item">
                    {{ item }}
                  </div>
                </div>
              </div>
              <div class="game-installation-path">
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="game-info-item">
          <div class="game-function">
            <div class="game-function-item">
              <img :src="link" alt="" />
            </div>
            <div class="game-function-item">
              <img :src="collect" alt="" style="position: relative;top: -2px;" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="gameId > 0" class="game-thumbnails">
        <el-carousel height="40vh" autoplay>
          <el-carousel-item v-for="item in screenshotList" :key="item">
            <img :src="item" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="bottom-func">
        <div class="bottom-func-item">
          <div class="game-play">
            <el-button v-if="!runningGamesState" type="success" size="large" class="play-btn success-btn"
              @click="runGame">
              ▶ PLAY IN VR
            </el-button>
            <el-button v-else type="primary" size="large" class="play-btn" disabled>
              RUNING
            </el-button>
          </div>
        </div>
        <div class="bottom-func-item">
          <div class="profile-container">
            <div class="game-profile">
              <div class="profile-title">
                <span>Current Profile:</span>
              </div>
              <div class="profile-select dark-select">
                <el-select v-model="profile" placeholder="Select Profile" small style="width: 120px"
                  @change="changeProfile">
                  <el-option v-for="item in profileList" :key="item.name" :label="item.name" :value="item.name" />
                </el-select>
              </div>
            </div>
            <div class="restore-profile">
              <div class="restore-profile-icon" @click="showResetDialog">
                <!-- <img :src="restoreProfile" alt="" v-nodrag /> -->
                <SvgIcon name="restore" width="16px" height="16px" />
              </div>
              <el-dialog v-model="resetDialogVisible" width="500" center :show-close="false" class="config-restore">
                <template #header>
                  <div class="custom-dialog-header">
                    <span class="header-title">Reset All to Default Settings</span>
                    <div class="header-close-icon" @click="resetDialogVisible = false">
                      <el-icon>
                        <Close />
                      </el-icon>
                    </div>
                  </div>
                </template>

                <div class="dialog-body-content">
                  <p class="warning-text">
                    Warning: Current settings may not have been saved to your local profile.
                    Resetting will result in the loss of the current settings. Are you sure you want
                    to continue?
                  </p>
                </div>

                <template #footer>
                  <div class="dialog-footer">
                    <el-button class="btn-cancel" @click="resetDialogVisible = false">
                      Cancel
                    </el-button>
                    <el-button class="btn-restore" type="primary" @click="resetConfiguration">
                      Restore
                    </el-button>
                  </div>
                </template>
              </el-dialog>
            </div>
            <div class="save-profile">
              <div class="save-profile-icon" @click="showSaveDialog">
                <!-- <img :src="saveProfile" alt="" v-nodrag /> -->
                <SvgIcon name="save" width="16px" height="16px" />
              </div>
              <div v-if="profile === 'Default'">
                <el-dialog v-model="saveDialogVisible" width="500" center :show-close="false"
                  class="custom-save-dialog">
                  <template #header>
                    <div class="custom-dialog-header">
                      <span class="header-title">Save Current Settings as New Profile 另存为</span>
                      <div class="header-close-icon" @click="saveDialogVisible = false">
                        <el-icon>
                          <Close />
                        </el-icon>
                      </div>
                    </div>
                  </template>

                  <div class="dialog-body-content">
                    <p class="notice-text">
                      Notice: This action will save your current settings as a new profile in the
                      corresponding game folder.
                    </p>

                    <div class="form-container">
                      <div class="form-item">
                        <div class="label">
                          <span>Game Name:</span>
                        </div>
                        <div class="value">
                          <span>{{ gameInfo?.gameName }}</span>
                        </div>
                      </div>

                      <div class="form-item">
                        <div class="label">
                          <span>Profile Name:</span>
                        </div>
                        <div class="value">
                          <el-input v-model="newProfileName" placeholder="" class="custom-input"
                            @input="validateSave" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <template #footer>
                    <div class="dialog-footer">
                      <el-button class="btn-cancel" @click="saveDialogVisible = false">
                        Cancel
                      </el-button>
                      <el-button class="btn-save" :disabled="!newProfileName" @click="saveNewConfiguration">
                        Save
                      </el-button>
                    </div>
                  </template>
                </el-dialog>
              </div>
              <div v-else>
                <el-dialog v-model="saveDialogVisible" width="500" center :close-on-click-modal="false"
                  :show-close="false" class="custom-save-dialog">
                  <template #header>
                    <div class="custom-dialog-header">
                      <span class="header-title">Save Current Settings to Local Profile</span>
                      <div class="header-close-icon" @click="saveDialogVisible = false">
                        <el-icon>
                          <Close />
                        </el-icon>
                      </div>
                    </div>
                  </template>

                  <div class="dialog-body-content">
                    <p class="notice-text">
                      Warning: The previous profile will be overwritten and this action is
                      irreversible. Are you sure you want to continue?
                    </p>
                  </div>

                  <template #footer>
                    <div class="dialog-footer">
                      <el-button class="btn-cancel" @click="saveDialogVisible = false">
                        Cancel
                      </el-button>
                      <el-button class="btn-save" @click="updateConfiguration">Save</el-button>
                    </div>
                  </template>
                </el-dialog>
              </div>
            </div>
            <div class="edit-profile">
              <div class="edit-profile-icon" @click="showEditDialog">
                <!-- <img :src="editProfile" alt="" v-nodrag /> -->
                <SvgIcon name="edit" width="16px" height="16px" />
              </div>
              <el-dialog v-model="saveNewDialogVisible" width="500" center :close-on-click-modal="false"
                :show-close="false" class="custom-save-dialog">
                <template #header>
                  <div class="custom-dialog-header">
                    <span class="header-title">Save Current Settings as New Profile</span>
                    <div class="header-close-icon" @click="saveNewDialogVisible = false">
                      <el-icon>
                        <Close />
                      </el-icon>
                    </div>
                  </div>
                </template>

                <div class="dialog-body-content">
                  <p class="notice-text">
                    Notice: This action will save your current settings as a new profile in the
                    corresponding game folder.
                  </p>

                  <div class="form-container">
                    <div class="form-item">
                      <div class="label">
                        <span>Game Name:</span>
                      </div>
                      <div class="value">
                        <span>{{ gameInfo?.gameName }}</span>
                      </div>
                    </div>

                    <div class="form-item">
                      <div class="label">
                        <span>Profile Name:</span>
                      </div>
                      <div class="value">
                        <el-input v-model="newConfigProfileName" placeholder="" class="custom-input"
                          @input="validateSave" />
                      </div>
                    </div>
                  </div>
                </div>

                <template #footer>
                  <div class="dialog-footer">
                    <el-button class="btn-cancel" @click="saveNewDialogVisible = false">
                      Cancel
                    </el-button>
                    <el-button class="btn-save" :disabled="!newProfileName" @click="saveNewConfiguration">
                      Save
                    </el-button>
                  </div>
                </template>
              </el-dialog>
            </div>
            <div class="import-profile">
              <div class="import-profile-icon" @click="showImportDialog">
                <!-- <img :src="importProfile" alt="" v-nodrag /> -->
                <SvgIcon name="import" width="16px" height="16px" />
              </div>
              <el-dialog v-model="importDialogVisible" width="500" center :close-on-click-modal="false"
                :show-close="false" class="custom-import-dialog">
                <template #header>
                  <div class="custom-dialog-header">
                    <span class="header-title">Import Profile from Local Folder</span>
                    <div class="header-close-icon" @click="importDialogVisible = false">
                      <el-icon>
                        <Close />
                      </el-icon>
                    </div>
                  </div>
                </template>

                <div class="dialog-body-content">
                  <p class="notice-text">
                    Warning: The current settings may not have been saved. Importing a new profile
                    will result in the loss of your current settings. Are you sure you want to
                    continue?
                  </p>
                </div>

                <template #footer>
                  <div class="dialog-footer">
                    <el-button class="btn-cancel" @click="importDialogVisible = false">
                      Cancel
                    </el-button>
                    <el-upload action="" accept=".json" :auto-upload="false" :on-change="handleElChange"
                      :show-file-list="false">
                      <el-button class="btn-save">Import</el-button>
                    </el-upload>
                  </div>
                </template>
              </el-dialog>
            </div>
            <div class="delete-profile">
              <div class="delete-profile-icon" @click="showDeleteDialog">
                <!-- <img :src="deleteProfile" alt="" v-nodrag /> -->
                <SvgIcon name="delete" width="16px" height="16px" />
              </div>
              <el-dialog v-model="deleteDialogVisible" width="500" center :close-on-click-modal="false"
                :show-close="false" class="custom-delete-dialog">
                <template #header>
                  <div class="custom-dialog-header">
                    <span class="header-title">Delete Profile from Local Folder</span>
                    <div class="header-close-icon" @click="handleDeleteCancel">
                      <el-icon>
                        <Close />
                      </el-icon>
                    </div>
                  </div>
                </template>

                <div class="dialog-body-content">
                  <p class="notice-text">
                    Warning: The current settings and the Profile in your local folder will be lost,
                    and this action is irreversible. Are you sure you want to continue?
                  </p>
                </div>

                <template #footer>
                  <div class="dialog-footer">
                    <el-button class="btn-cancel" @click.stop="handleDeleteCancel">
                      Cancel
                    </el-button>
                    <el-button class="btn-save" @click="deleteConfiguration">Delete</el-button>
                  </div>
                </template>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel-control">
    </div>

    <div class="panel-container">
      <transition name="fade" mode="out-in" appear>
        <component :is="currentView" :key="`${gameId}_${setupMode}`" :game-info="gameInfo" ref="childRef"
          v-model:setupMode="setupMode" @chnage-setting-mode="updateProfileLists" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, onBeforeUnmount, reactive, ref, watch, nextTick } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import CryptoJS from 'crypto-js'
import { getUserInfo, getGameRecord, getGameRunningDatas, saveGameRunningDatas, deleteLocalRecord } from '@/utils/global'
import { configRead, configWrite, customProgramCommands, getRunGame, searchGameConfigurationFile, sanitizedFolderName, deleteFile } from '@/utils/system'
import { gameDetail, dataReporting } from '@/api/game'
import QuikSettings from './quik.vue'
import AdvancedSettings from './advanced.vue'

import { getKatVrHudConfig, getKatVrArmviewConfig } from '@/utils/global/config'

import { checkGameDefaultConfig } from '@/utils/game'

import link from '@/assets/game/link.png'
import collect from '@/assets/game/collect.png'
import head from '@/assets/game/head.png'





const route = useRoute()
const gameConfig = ref({})
const gameInfo = ref({})
const gameFlag = ref([])
const screenshotList = ref([])
const isLoading = ref(false)

const gameId = ref(parseInt(route.params.id))
const currentGameName = ref(route.params.name)
const runningGames = computed(() => store.getters['game/getRunningGameData'])
const allGameLists = computed(() => store.getters['game/getGlobalGameConfigs'])

const profile = ref(null)

const store = useStore()

const setupMode = ref('quik')
const isimgShow = ref(0)
const childRef = ref(null)
const profileList = ref([])

const resetDialogVisible = ref(false)
const saveDialogVisible = ref(false)
const saveNewDialogVisible = ref(false)
const importDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

const newProfileName = ref('')
const newConfigProfileName = ref('')
const isSaving = ref(false)

const gameConfigurations = ref([])
const currentGameConfigurations = ref({})

const runningGamesState = ref(false)

const currentView = computed(() => {
  return setupMode.value === 'quik' ? QuikSettings : AdvancedSettings
})

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const isSaveDisabled = computed(() => {
  return !newProfileName.value || newProfileName.value.trim().length === 0
})

const gameRunningStatus = computed(() => store.state.game.gameRunningStatus) || null

// 获取当前已里链接的设备
const NAMESPACE = 'device'
// 设备数据和方法
const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`])

const gameRuningRecords = ref(null)
// 存储游戏运行过程的完整记录
const lastSavedSession = ref(null)

let statusTimer = null;
// 进程结束后再等5次轮询，抓到关闭游戏时数据
let retryCountAfterStop = 0;
const MAX_RETRY = 10;
let pollingToken = 0;

const validateSave = (value) => {
  // 示例：禁止输入特殊字符，只允许字母、数字和空格
  newProfileName.value = value.replace(/[^\w\s]/gi, '')
}

const currentDevice = computed(() => selectedDevice.value)
const loadData = async (gameId) => {

  // 根据GameId获取游戏信息 
  if (gameId == '-1' || gameId < 2 || allGameLists.value.CustomGame.find(item => item.ID == gameId) || gameId == '43810011') {
    gameInfo.value = {
      gameId: gameId, gameName: currentGameName.value
    }
    if (gameId == '-1')
      isimgShow.value = 0 //default
    else if (gameId == '43810011')
      isimgShow.value = 1 // osc
    else
      isimgShow.value = 2 //自定义游戏
  }
  isimgShow.value = 3
  isLoading.value = true

  if (gameId === "43810011") {
    gameId = 438100;
  }

  if (gameId > 0) {
    await getGameInfo(gameId)
  }

  try {
    console.log('Update data content without destroying components.')
  } finally {
    isLoading.value = false
  }
}

const getGameInfo = async (gameId) => {

  gameInfo.value = {};

  store.commit('game/CLEAR_DETAIL');

  const res = await gameDetail({ gameId: gameId })
  if (res.code === 20000 && res.data) {
    gameInfo.value = res.data
    store.dispatch('game/getGameDetail', { gameId: gameId })

    gameFlag.value = res.data.gameFlag ? JSON.parse(res.data.gameFlag) : [];
    screenshotList.value = res.data.screenshotList ? JSON.parse(res.data.screenshotList) : [];
  }
  return res
}

const stopPolling = () => {
  pollingToken++

  if (statusTimer) {
    clearTimeout(statusTimer);
    statusTimer = null;
  }
};

const checkStatusLoop = async () => {

  stopPolling()
  const currentToken = ++pollingToken;

  const loop = async () => {
    if (currentToken !== pollingToken) return;

    try {

      const [status, records] = await Promise.all([
        getRunGame(host),
        getGameRecord(host)
      ]);

      store.commit('game/gameRunningStatusChange', !!status);

      const isProcessRunning = !!status;
      const isGatewayActive = records && String(records.gameId) !== '0';
      const isSameGame = records && String(records.gameId) === String(gameId.value)

      if (isSameGame) {
        gameRuningRecords.value = records

        lastSavedSession.value = {
          ...(lastSavedSession.value || {}),
          ...records
        }
      }

      if (isProcessRunning || (isGatewayActive && retryCountAfterStop < MAX_RETRY)) {
        if (!isProcessRunning) retryCountAfterStop++;
        statusTimer = setTimeout(loop, 500);
      } else {
        console.log('停止轮询，处理结算');

        const finalData = { ...(lastSavedSession.value || gameRuningRecords.value) };

        if (finalData && finalData.gameId) {

          try {
            const userInfo = await getUserInfo(host)
            const deviceInfo = selectedDevice.value
            const recordId = generateShortUUID();

            const completeRecord = {
              ...finalData,
              userId: userInfo?.userId,
              deviceType: deviceInfo?.deviceType,
              deviceName: deviceInfo?.deviceName,
              gameName: gameInfo.value?.gameName,
              gamePlatform: 1,
              recordId: recordId
            };

            await saveGameRunningDatas(host, completeRecord);
            // 上传数据到服务器
            await uploadUserGameRecord();
          } catch (error) {
            console.error('保存结算数据失败:', err);
          }
        } else {
          console.warn('结算失败：未抓取到有效的运行记录');
        }

        // 统一清理状态
        lastSavedSession.value = null;
        gameRuningRecords.value = null;
        retryCountAfterStop = 0;
        store.commit('game/gameRunningStatusChange', false);
      }
    } catch (error) {
      statusTimer = setTimeout(loop, 2000);
    }
  }

  loop()
}

const generateShortUUID = () => {
  const randomWords = CryptoJS.lib.WordArray.random(16);
  return randomWords.toString(CryptoJS.enc.Hex);
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const waitUntilGameRunning = async () => {
  for (let i = 0; i < 10; i++) {
    const status = await getRunGame(host)
    if (status) return true
    await sleep(1000)
  }
  return false
}

const runGame = async () => {
  pollingToken++

  stopPolling();
  store.commit('game/gameRunningStatusChange', null)

  lastSavedSession.value = null;
  retryCountAfterStop = 0

  try {
    await customProgramCommands(host, 'explorer.exe', `steam://rungameid/${gameId.value}`)

    const started = await waitUntilGameRunning()

    if (started) {
      console.log('游戏已启动，开始轮询')
      checkStatusLoop()
    } else {
      console.warn('⚠️ 未检测到游戏启动')
      store.commit('game/gameRunningStatusChange', false)
    }
  } catch (error) {
    console.log(error)
    store.commit('game/gameRunningStatusChange', null);
  }
}

// 上传玩家游戏数据
const uploadUserGameRecord = async () => {

  try {
    // 读数据
    const datas = await getGameRunningDatas(host)

    if (!datas || datas.length === 0) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const record of datas) {
      try {
        // 执行上传
        const result = await dataReporting(record);

        // 校验上传结果
        if (result.code === 20000 && result.data.success) {
          await deleteLocalRecord(host, record.recordId);

          successCount++;
          console.log(`Success: Record [${record.gameStartTime}] uploaded and removed.`);
        } else {
          failCount++;
          console.warn(`Failed: Server rejected record [${record.gameStartTime}].`, result.message);
        }
      } catch (itemError) {
        failCount++;
        console.error(`Error: Network issue while uploading [${record.gameStartTime}].`, itemError);
        break;
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const new_GatewayPath = 'Local/New_Gateway'
const profilePath = 'Profile'

const getProfileListByMode = async () => {
  console.log('Current Mode:', setupMode.value)
  const mode = setupMode.value
  const gameName = await sanitizedFolderName(host, currentGameName.value)

  const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}/configuration`
  const configurationFileName = 'config_profile.json'
  const data = await configRead(host, folderPath, configurationFileName)
  if (data) {
    const dataTwo = await searchGameConfigurationFile(host, `${new_GatewayPath}/${profilePath}`, gameName) //调用C#方法查找对应目录下的json文件
    let dataList = JSON.parse(dataTwo)

    if (dataList) {
      const resObj = JSON.parse(data)
      if (resObj.result && resObj.data) {
        var obj = JSON.parse(resObj.data).find((item) => item.isActive === true);
        const objname = obj?.name;

        var obj1 = dataList.find((item) => item.name === objname)


        if (obj1) {
          obj1.isActive = true;
        } else {
          var obj2 = dataList.find((item) => item.name === 'Default')
          if (obj2)
            obj2.isActive = true
        }


        console.log(dataList);

      }
    }

    profileList.value = JSON.parse(JSON.stringify(dataList));
    await applyConfiguration(profileList.value)
  }

  // 执行VR HUD和Armview参数配置
  await getKatVrHudConfig(host, mode)
  await getKatVrArmviewConfig(host, mode)
  return
}

const applyConfiguration = async (profiles) => {
  const activeProfile = profiles.find((item) => item.isActive)
  if (activeProfile) {
    profile.value = activeProfile.name
  }
}

const applyConfigToChild = async () => {
  await nextTick()

  if (childRef.value?.loadProfileData) {
    childRef.value.loadProfileData(profile.value);
  }
}

//恢复默认设置--点击刷新弹出对应界面
const showResetDialog = async () => {
  resetDialogVisible.value = true
}

const showSaveDialog = async () => {
  console.log('Show Save Dialog')
  console.log(profile.value)
  saveDialogVisible.value = true
}

const showEditDialog = async () => {
  console.log('Show Edit Dialog')
  console.log(profile.value)
  saveNewDialogVisible.value = true
}

const showImportDialog = async () => {
  console.log('Show Import Dialog')
  importDialogVisible.value = true
}

const showDeleteDialog = async () => {
  console.log('Show Delete Dialog')
  if (profile.value === 'Default' || profile.value === null)
    return
  deleteDialogVisible.value = true
}

//恢复游戏默认设置 
const resetConfiguration = async () => {
  const currentProfile = profile.value

  if (!childRef.value) return

  if (setupMode.value === 'quik') {
    childRef.value.handleQuikReset(currentProfile)
  } else if (setupMode.value === 'advanced') {
    childRef.value.handleAdvancedReset(currentPorfile)
  }

  resetDialogVisible.value = false
}




//保存文件
const updateConfiguration = async () => {
  console.log('Update Configuration', profile.value)
  const currentProfile = profile.value
  const gameIdValue = gameId.value
  const gameName = await sanitizedFolderName(host, currentGameName.value)
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}`
  const saveFileName = `${currentProfile}.json`

  const gameConfigInfo = await getGameConfig(gameIdValue)
  if (gameConfigInfo) {
    const data = JSON.parse(JSON.stringify(gameConfigInfo))
    if (data) {
      const content = JSON.stringify(gameConfigInfo)
      await configWrite(host, folderPath, saveFileName, content)
      saveDialogVisible.value = false
    }
    return;
  }


  //if (!childRef.value) return

  // if (setupMode.value === 'quik') {
  //   const result = childRef.value.handleQuikUpdate(currentProfile)
  //   if (result) {
  //     saveDialogVisible.value = false
  //   }
  // } else if (setupMode.value === 'advanced') {
  //   const result = childRef.value.handleAdvancedUpdate(currentProfile)
  //   if (result) {
  //     saveDialogVisible.value = false
  //   }
  // }
}

// 获取游戏配置详情 - 从allGameLists中获取（全局）
const getGameConfig = async (gameId) => {
  if (allGameLists.value) {
    if (gameId == '-1') { //Default
      const gameConfig = allGameLists.value.Default;
      if (gameConfig) {
        return gameConfig;
      }
    } else {
      // Steam游戏
      const gameConfig = allGameLists.value.SteamGame.find(item => item.ID === gameId)
      if (gameConfig) {
        return gameConfig;
      } else { //自定义游戏
        const gameConfig = allGameLists.value.CustomGame.find(item => item.ID == gameId)
        if (gameConfig) {
          return gameConfig;
        }
      }
    }
  }
}

//另存为文件
const saveNewConfiguration = async () => {

  const currentProfile = profile.value
  const newProfileNameStr = newProfileName.value
  if (!childRef.value) return


  if (isSaveDisabled.value) return

  try {
    isSaving.value = true
    console.log('正在另存为配置文件:', newConfigProfileName.value)
    const gameName = await sanitizedFolderName(host, currentGameName.value)
    const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}`
    const saveFileName = `${newProfileNameStr}.json`

    const gameConfigInfo = await getGameConfig(gameId.value)
    if (gameConfigInfo) {
      const data = JSON.parse(JSON.stringify(gameConfigInfo))
      if (data) {
        const content = JSON.stringify(data)
        await configWrite(host, folderPath, saveFileName, content)
        if (profileList) {
          saveNewDialogVisible.value = false
          newProfileName.value = ''
          newConfigProfileName.value = ''
          saveDialogVisible.value = false
          var obj = profileList.value.find((item) => item.name === newProfileNameStr)
          if (obj) {

            await handleProfileChange(newProfileNameStr)
            await applyConfiguration(profileList.value)
          } else {
            profileList.value.push({
              name: newProfileNameStr,
              filePath: folderPath,
              fileName: saveFileName,
              isDefault: false,
              isActive: true
            });

            await handleProfileChange(newProfileNameStr)
            await applyConfiguration(profileList.value)
          }

        }
      }
      return;
    }

    console.log('保存结果')
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    isSaving.value = false
  }

  saveNewDialogVisible.value = false
  newConfigProfileName.value = ''
}

const importNewConfiguration = async () => {
  const currentProfile = profile.value

  if (!childRef.value) return
}

const handleDeleteCancel = () => {
  deleteDialogVisible.value = false
}


//删除
const deleteConfiguration = async () => {

  const currentProfile = profile.value

  const currentMode = setupMode.value
  console.log(currentMode)

  const currentGameId = gameId.value
  // 移除对应配置
  const delRes = await handleDeleteProfile(currentProfile, currentGameId)

  if (delRes) {

    await handleProfileChange('Default')
    await applyConfiguration(profileList.value)
    deleteDialogVisible.value = false
    await getProfileListByMode()
    console.log('删除成功')
    // ElementPlus.ElMessage.success('删除成功')
  }

  if (!childRef.value) return
}

const handleElChange = async (uploadFile) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result)
    console.log(data)
  }
  reader.readAsText(uploadFile.raw)

  await importNewConfiguration()
}

const updateProfileLists = async (val) => {
  console.log(val)
  await getProfileListByMode()
}

//更改配置文件
const changeProfile = async (val) => {

  console.log('更改配置文件', val)
  handleProfileChange(val)
}

const handleProfileChange = async (selectedValue) => {
  profileList.value.forEach((item) => {
    item.isActive = item.name === selectedValue
  })
  console.log('更新后的数据结构：', profileList.value)

  await handleUpdateProfile(profileList.value)
}

const handleUpdateProfile = async (profiles) => {
  const currentGameId = gameId.value
  const mode = setupMode.value
  const gameName = await sanitizedFolderName(host, currentGameName.value)
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}/configuration`

  const configurationFileName = 'config_profile.json'

  if (profiles.length > 0) {
    const content = JSON.stringify(profiles)
    const data = await configWrite(host, folderPath, configurationFileName, content)
    if (data) {
      const res = JSON.parse(data)
      if (res.result && res.data) {
        return true
      }
      return false
    }
  }
}

//删除
const handleDeleteProfile = async (profile, gameId) => {
  const mode = setupMode.value
  const gameName = await sanitizedFolderName(host, currentGameName.value)
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}/configuration`
  const folderPath1 = `${new_GatewayPath}/${profilePath}/${gameName}`
  const configurationFileName = 'config_profile.json'

  const delData = await deleteFile(host, folderPath1, profile + '.json')//删除文件
  if (delData) {
    const delres = JSON.parse(delData)
    if (!delres.result) {
      return false
    }
  }
  // 读文件
  const data = await configRead(host, folderPath, configurationFileName)
  if (data) {
    const res = JSON.parse(data)
    if (res.result && res.data) {
      const profiles = JSON.parse(res.data)
      const index = profiles.findIndex((item) => item.name === profile)
      if (index !== -1) {
        profiles.splice(index, 1)
      }

      // 写文件
      const content = JSON.stringify(profiles)

      const writeResult = await configWrite(host, folderPath, configurationFileName, content)
      if (writeResult) {
        const wres = JSON.parse(writeResult)
        if (wres.result) {
          return true
        }
        return false
      }
    }
  }
}

const fetchGameRecords = async () => {
  try {
    const records = await getGameRecord(host);
    gameRuningRecords.value = records || null;
  } catch (error) {
    gameRuningRecords.value = null;
  }
};

const initDefaultConfig = async () => {
  const currentGameId = parseInt(gameId.value)
  await checkGameDefaultConfig(host, currentGameId)
}


const GetGameRunState = async () => {

  if (runningGames && runningGames.value?.GameId) {

    if (gameId.value === runningGames.value.GameId) {
      runningGamesState.value = true;
    } else {
      runningGamesState.value = false;
    }
  }
  else {
    runningGamesState.value = false;
  }
  console.log('当前游戏运行状态：', runningGamesState.value)
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadData(newId)
    }
  },
  { immediate: true }
)

// watch(setupMode, async (newMode) => {
//   console.log('Switch mode to:', newMode)
//   // 1. 这里可以先执行父组件重新获取该模式下配置文件列表的逻辑
//   await getProfileListByMode()

//   // 2. 然后应用配置
//   await applyConfigToChild()
// })

// watch(profile, (newVal) => {
//   console.log('Configuration change:', newVal)
//   applyConfigToChild()
// })

watch(() => store.state.game.gameRunningStatus, async (newVal) => {
  if (!newVal) {
    gameRuningRecords.value = null;
    stopPolling();
  }
}, { immediate: true })

//当前页面对应的游戏是否正在运行
watch(() => runningGames.value, (newrunningGames) => {
  GetGameRunState();
})

onMounted(async () => {
  const currentGameId = parseInt(route.params.id)
  gameId.value = currentGameId

  await getProfileListByMode()

  await fetchGameRecords()

  if (gameId.value) {
    const realStatus = await getRunGame(host);
    store.commit('game/gameRunningStatusChange', realStatus);

    if (realStatus) {
      lastSavedSession.value = null;
      checkStatusLoop();
    }
  }
})

onBeforeUnmount(() => {
  stopPolling();
  GetGameRunState();
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.detail-page {
  // padding: var(--middle-distance) 0;
  background: var(--main-bg-color);
  color: var(--text-color);
  font-family: var(--text-family);

  .game-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    h2 {
      margin: 0;
      font-size: 28px;
    }

    .path {
      color: #999;
      font-size: 12px;
    }

    .game-info {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px 24px 10px 16px;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 2;
      background: linear-gradient(180deg, var(--main-bg-color) 0%, transparent 100%);
    }

    .game-thumbnails img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .game-function {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }

    .game-container-wrapper {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 10px;
    }

    .game-desc {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

    .game-title {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    }

    .game-title p {
      margin: 0;
      padding: 0;
      font-size: 16px;
      font-weight: bold;
      line-height: 23px;
      letter-spacing: 0px;
      // color: var(--title-color);
      color: var(--title-color);
    }

    .game-tags {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

    .game-tags .game-tags-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0px 5px;
      // gap: 0px 10px;
      flex-wrap: wrap;
      align-content: flex-start;
      // background: #d8d8d8;
      background: #284052;
      border-radius: 2px;
      font-size: 12px;
      // line-height: 14px;
      color: var(--brand-color);

    }

    .game-icon img {
      width: 36px;
      height: 36px;
    }

    .game-installation-path {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      // font-size: 10px;
      font-size: 10px;
      font-weight: normal;
      line-height: 14px;
      letter-spacing: 0px;
      // color: #767676;
      color: var(--text-color);
    }
  }

  .bottom-func {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 24px 10px 16px;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: linear-gradient(0deg, var(--main-bg-color) 0%, transparent 100%);
    // margin-top: 10px;

    .bottom-func-item .profile-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;
    }

    .bottom-func-item .profile-container img {
      cursor: pointer;
    }

    .bottom-func-item .profile-container .game-profile {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      gap: 5px;
      font-size: var(--body-font-size);
      color: var(--text-color);
    }
  }

  .play-btn {
    // padding: 25px 40px;
    font-weight: bold;
    font-size: 16px;
  }
}

:deep(.config-restore) {
  background-color: #1a2b36;
  border: 1px solid #00acc1;
  padding: 0;
}

:deep(.detail-page .el-dialog) {
  background-color: #1a2b36;
  border: 1px solid #00acc1;
  padding: 0;
}

.save-profile .custom-dialog-header {
  background-color: #264653;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  font-weight: bold;
}

.edit-profile .custom-dialog-header {
  background-color: #264653;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  font-weight: bold;
}

.import-profile .custom-dialog-header {
  background-color: #264653;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  font-weight: bold;
}

.delete-profile .custom-dialog-header {
  background-color: #264653;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  font-weight: bold;
}

.header-title {
  font-size: 18px;
}

.header-close-icon {
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s;
}

.header-close-icon:hover {
  color: #00acc1;
}

.dialog-body-content {
  padding: 30px 40px;
  color: #fff;
  line-height: 1.6;
}

.warning-text {
  font-size: 16px;
  font-weight: 500;
}

.dialog-footer {
  padding-bottom: 20px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #00acc1;
  color: #00acc1;
}

.btn-restore {
  background: #00acc1;
  border: none;
}

:deep(.custom-save-dialog) {
  background-color: #1a2b36 !important;
  border: 1px solid #00acc1;
  padding: 0;
}

:deep(.custom-import-dialog) {
  background-color: #1a2b36 !important;
  border: 1px solid #00acc1;
  padding: 0;
}

:deep(.custom-delete-dialog) {
  background-color: #1a2b36 !important;
  border: 1px solid #00acc1;
  padding: 0;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

.dialog-body-content {
  padding: 25px 40px;
  color: #fff;
}

.notice-text {
  font-size: 15px;
  margin-bottom: 30px;
  line-height: 1.4;
  font-weight: 500;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.form-item .label {
  width: 110px;
  font-weight: bold;
  font-size: 16px;
}

.form-item .value {
  font-size: 16px;
  font-weight: bold;
}

.custom-input :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: 0 0 0 1px #00acc1 inset !important;
  border-radius: 0;
}

.custom-input :deep(.el-input__inner) {
  color: #fff !important;
}

.dialog-footer {
  padding-bottom: 25px;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.btn-cancel {
  background: transparent !important;
  border: 1px solid #00acc1 !important;
  color: #00acc1 !important;
  width: 120px;
}

.btn-save {
  background: #3c4146 !important;
  color: #888 !important;
  border: none !important;
  width: 120px;
}

.btn-save:not(:disabled) {
  background: #00acc1 !important;
  color: #fff !important;
}
</style>
