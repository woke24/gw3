import { register, login, googleLogin, facebookLogin, getInfo } from '@/api/user'

let validating = false
const state = () => ({
  token: '', // 登录token
  info: {},  // 用户信息
  register: {
    email: '',
    password: '',
    confirmPassword: ''
  },
  isQuickLogin: false,
  isRegisted: false,
  isForgot: false,
  system: {
    deviceId: '',
    timeZone: '',
    deviceInfo: {}
  },
  fitnessDatas: [
  ],
  userStatistics: {
    walking: 0,
    mileage: 0,
    consume: 0,
    activeTime: 0
  },
  LoggedIn: false,
  // idle | checking | loggedIn | loggedOut
  status: 'idle',
  validated: false,
  hasAddedDynamicRoutes: false
})

// getters
const getters = {
  token (state) {
    return state.token
  },

  getUserInfo (state) {
    return state.info
  },

  getRegister (state) {
    return state.register
  },

  getIsQuickLogin (state) {
    return state.isQuickLogin
  },

  getIsRegisted (state) {
    return state.isRegisted
  },

  getIsForgot (state) {
    return state.isForgot
  },

  getSystemInfo (state) {
    return state.system
  },

  getFitnessDatas (state) {
    return state.fitnessDatas
  },

  getUserStatistics (state) {
    if (!state.userStatistics) {
      state.userStatistics = {
        walking: 0,
        mileage: 0,
        consume: 0,
        activeTime: 0
      }
    }
    return state.userStatistics
  },

  getLoggedIn (state) {
    return state.LoggedIn
  },

  getStatus (state) {
    return state.status
  },

  getValidated (state) {
    return state.validated
  },

  getHasAddedDynamicRoutes (state) {
    return state.hasAddedDynamicRoutes
  }
}

// mutations
const mutations = {
  tokenChange (state, token) {
    state.token = token
  },
  infoChange (state, info) {
    state.info = info
  },

  registerChange (state, register) {
    state.register = register
  },

  isQuickLoginChange (state, isQuickLogin) {
    state.isQuickLogin = isQuickLogin
  },

  isRegistedChange (state, isRegisted) {
    state.isRegisted = isRegisted
  },

  isForgotChange (state, isForgot) {
    state.isForgot = isForgot
  },

  systemChange (state, system) {
    state.system = system
  },

  fitnessDatasChange (state, fitnessDatas) {
    state.fitnessDatas = fitnessDatas
  },

  userStatisticsChange (state, userStatistics) {
    state.userStatistics = userStatistics
  },

  loggedInChange (state, loggedIn) {
    state.LoggedIn = loggedIn
  },

  setStatus (state, status) {
    state.status = status
  },

  setValidated (state, validated) {
    state.validated = validated
  },

  SET_DYNAMIC_ROUTES_STATE (state, status) {
    state.hasAddedDynamicRoutes = status
  }
}

// actions
const actions = {

  // register
  register ({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      register(data)
        .then(res => {
          if (res.code === 20000 && res.data.code === 1 && res.data.token) {
            const token = `Bearer ${res.data.token}`
            commit('tokenChange', token)
            localStorage.setItem('token', token)
            dispatch('getInfo', { token: token })
              .then(infoRes => {
                resolve(res)
              })
          } else {
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
    })
  },
  // login by login.vue
  login ({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      login(data)
        .then(res => {
          if (res.code === 20000 && res.data.token) {
            const token = `Bearer ${res.data.token}`
            commit('loggedInChange', true)
            commit('setStatus', 'loggedIn')
            commit('tokenChange', token)
            localStorage.setItem('token', token)
            dispatch('getInfo', { token: token })
              .then(infoRes => {
                resolve(res)
              })
          } else {
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
    })
  },

  // login by google
  googleLogin ({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      googleLogin(data)
        .then(res => {
          if (res.code === 20000 && res.data.token) {
            const token = `Bearer ${res.data.token}`
            commit('loggedInChange', true)
            commit('setStatus', 'loggedIn')
            commit('tokenChange', token)
            localStorage.setItem('token', token)
            dispatch('getInfo', { token: token })
              .then(infoRes => {
                resolve(res)
              })
          } else {
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
    })
  },

  // login by facebook
  facebookLogin ({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      facebookLogin(data)
        .then(res => {
          if (res.code === 20000 && res.data.token) {
            const token = `Bearer ${res.data.token}`
            commit('loggedInChange', true)
            commit('setStatus', 'loggedIn')
            commit('tokenChange', token)
            localStorage.setItem('token', token)
            dispatch('getInfo', { token: token })
              .then(infoRes => {
                resolve(res)
              })
          } else {
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
    })
  },

  // get user info after user logined
  getInfo ({ commit }, params) {
    return new Promise((resolve, reject) => {
      getInfo(params)
        .then(res => {
          const { data, code } = res
          if (!data || code !== 20000) {
            reject('Verification failed, please Login again.')
          }
          commit('infoChange', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
    })
  },

  // login out the system after user click the loginOut button
  loginOut ({ commit }) {
    return new Promise((resolve) => {
      commit('tokenChange', '')
      commit('infoChange', {})
      commit('loggedInChange', false)
      commit('setStatus', 'loggedOut')
      localStorage.removeItem('token')
      localStorage.removeItem('tabs')
      localStorage.removeItem('vuex')
      sessionStorage.removeItem('vuex')
      location.reload()
    })
  },

  setRegistedChange ({ commit }, isRegisted) {
    commit('isRegistedChange', isRegisted)
  },

  setQuickLoginChange ({ commit }, isQuickLogin) {
    commit('isQuickLoginChange', isQuickLogin)
  },

  setForgotChange ({ commit }, isForgot) {
    commit('isForgotChange', isForgot)
  },

  setDeviceInfo ({ commit }, system) {
    commit('systemChange', system)
  },

  setUserStatistics ({ commit }, userStatistics) {
    commit('userStatisticsChange', userStatistics)
  },

  async validateLogin ({ state, commit, dispatch }) {

    if (validating) return

    validating = true

    try {
      if (!state.token) {
        commit('setStatus', 'loggedOut')
        return false
      }

      commit('setStatus', 'checking')

      await dispatch('getInfo', { token: state.token })

      commit('setStatus', 'loggedIn')
      commit('setValidated', true)
      return true
    } catch (err) {
      commit('tokenChange', '')
      commit('infoChange', {})
      commit('setStatus', 'loggedOut')
      localStorage.removeItem('token')
      return false
    } finally {
      validating = false
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
