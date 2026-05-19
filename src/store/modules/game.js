import { debounce } from 'lodash-es';
import { gameDetail } from '@/api/game'
import { saveGameControllerOptions } from '@/utils/game'

const performSave = debounce(async (host, configs, commit) => {
  const result = await saveGameControllerOptions(host, configs)

  if (result) {
    const writeResult = JSON.parse(result)
    if (writeResult.result) {
      commit('RESET_DIRTY')
    }
  }
}, 500);

const state = () => ({
  gameRunningStatus: null,
  gameDetail: {},
  controllerSetting: {},
  sittingSetting: {},
  hapticsSetting: {},
  gameConfigSetting: {},
  globalGameConfigs: {},
  isDirty: false,
  runningGameData: null,
  addDialogVisible: false,
  steamGameList: [],
  searchGameList: [],
  gameType: 1,
  addGameConfig: { gameId: '', gameName: '' },
  selectGameName: '',
  fileList: [],
  searchAddGame: ''
})

// getters
const getters = {
  getGameDetail (state) {
    return state.gameDetail
  },
  getGameRunningStatus (state) {
    return state.gameRunningStatus
  },
  getGlobalGameConfigs (state) {
    return state.globalGameConfigs
  },
  getDirty (state) {
    return state.isDirty
  },
  getRunningGameData (state) {
    return state.runningGameData
  },
  getAddDialogVisible (state) {
    return state.addDialogVisible
  },
  getSteamGameList (state) {
    return state.steamGameList
  },
  getSearchGameList (state) {
    return state.searchGameList
  },
  getGameType (state) {
    return state.gameType
  },
  getAddGameConfig (state) {
    return state.addGameConfig
  },
  getSelectGameName (state) {
    return state.selectGameName
  },
  getFileList (state) {
    return state.fileList
  },
  getSearchAddGame (state) {
    return state.searchAddGame
  }
}

// mutations
const mutations = {
  gameDetailChange (state, detail) {
    state.gameDetail = detail
  },
  controllerSettingChange (state, setting) {
    state.controllerSetting = setting
  },
  sittingSettingChange (state, setting) {
    state.sittingSetting = setting
  },
  hapticsSettingChange (state, setting) {
    state.hapticsSetting = setting
  },
  gameConfigSettingChange (state, setting) {
    state.gameConfigSetting = setting
  },
  gameRunningStatusChange (state, status) {
    state.gameRunningStatus = status
  },
  globalGameConfigsChange (state, config) {
    state.globalGameConfigs = { ...state.globalGameConfigs, ...config }
    state.isDirty = true
  },
  RESET_DIRTY (state) {
    state.isDirty = false;
  },
  CLEAR_DETAIL (state) {
    state.gameDetail = {}
  },
  setRunningGameData (state, data) {
    state.runningGameData = data
  },
  setAddDialogVisible (state, visible) {
    state.addDialogVisible = visible
  },
  setSteamGameList (state, list) {
    state.steamGameList = list
  },
  setSearchGameList (state, list) {
    state.searchGameList = list
  },
  setGameType (state, type) {
    state.gameType = type
  },
  setAddGameConfig (state, config) {
    state.addGameConfig = config
  },
  setSelectGameName (state, name) {
    state.selectGameName = name
  },
  setFileList (state, list) {
    state.fileList = list
  },
  setSearchAddGame (state, value) {
    state.searchAddGame = value
  }
}

// actions
const actions = {
  // get game detail after user logined
  getGameDetail ({ commit }, params) {
    return new Promise((resolve, reject) => {
      gameDetail(params)
        .then(res => {
          if (res.code === 20000 && res.data) {
            commit('gameDetailChange', res.data)
            if (res.data.controllerSetting) {
              const controllerSetting = JSON.parse(res.data.controllerSetting)
              commit('controllerSettingChange', controllerSetting)
            }
            if (res.data.sittingSetting) {
              const sittingSetting = JSON.parse(res.data.sittingSetting)
              commit('sittingSettingChange', sittingSetting)
            }
            if (res.data.hapticsSetting) {
              const hapticsSetting = JSON.parse(res.data.hapticsSetting)
              commit('hapticsSettingChange', hapticsSetting)
            }
            if (res.data.gameConfigSetting) {
              const gameConfigSetting = JSON.parse(res.data.gameConfigSetting)
              commit('gameConfigSettingChange', gameConfigSetting)
            }
            resolve(res.data)
          } else {
            resolve({})
          }
        })
    })
  },
  setDeviceInfo ({ commit }, detail) {
    commit('gameDetailChange', detail)
  },
  setGameRunningStatus ({ commit }, status) {
    commit('gameRunningStatusChange', status)
  },
  setGlobalGameConfigs ({ commit }, config) {
    commit('globalGameConfigsChange', config)
    commit('RESET_DIRTY')
  },
  async persistGlobalGameConfigs ({ commit }, { host, gameConfigLists }) {
    try {
      commit('globalGameConfigsChange', gameConfigLists)

      performSave(host, gameConfigLists, commit);
    } catch (error) {
      console.error('保存流程出错:', error);
    }
  },
  setRunningGameData ({ commit }, data) {
    commit('setRunningGameData', data)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
