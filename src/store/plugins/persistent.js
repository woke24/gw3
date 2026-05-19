import localforage from 'localforage'

const storePersistence = localforage.createInstance({
  name: 'GatewayAppStorage',
  storeName: 'vuex_persistence'
})

const exclude = ['actions', 'getters', 'mutations', 'namespaced']

const VERSION = 1
export default function Persistent ({ key, modules, modulesKeys }) {
  return async (store) => {

    let resolveRestore
    store.restored = new Promise(resolve => {
      resolveRestore = resolve
    })

    try {
      const localCache = await storePersistence.getItem(key) || {}
      const sessionCache = JSON.parse(sessionStorage.getItem(key) || '{}')

      let localOldState = {}
      if (localCache.version === VERSION) {
        localOldState = localCache.data || {}
      } else {
        await storePersistence.removeItem(key)
      }

      let sessionOldState = {}
      if (sessionCache.version === VERSION) {
        sessionOldState = sessionCache.data || {}
      } else {
        sessionStorage.removeItem(key)
      }

      const oldState = {
        ...localOldState,
        ...sessionOldState
      }

      if (Object.keys(oldState).length > 0) {
        const newState = { ...store.state }

        for (const moduleName in modules) {
          const module = modules[moduleName]
          const initialState = module.state ? module.state() : {}

          newState[moduleName] = mergeState(
            initialState,
            oldState[moduleName] || {}
          )
        }

        store.replaceState(newState)
      }

      store.subscribe((mutation, state) => {
        if (modulesKeys.local.length > 0) {
          const localData = setData(state, modulesKeys.local)
          storePersistence.setItem(key, {
            version: VERSION,
            data: localData
          }).catch(err => console.error('LocalForage Error:', err))
        } else {
          storePersistence.removeItem(key)
        }

        if (modulesKeys.session.length > 0) {
          const sessionData = setData(state, modulesKeys.session)
          sessionStorage.setItem(key, JSON.stringify({
            version: VERSION,
            data: sessionData
          }))
        } else {
          sessionStorage.removeItem(key)
        }
      })

    } catch (err) {
      console.error('Persistent restore error:', err)
    } finally {
      resolveRestore()
    }
  }
}

function setData (state, moduleKeys) {
  let data = {}
  for (const i of moduleKeys) {
    if (state[i]) {
      try {
        data[i] = JSON.parse(JSON.stringify(state[i]))
      } catch (e) {
        console.error(e)
      }
    }
  }
  return data
}

function mergeState (target, source) {
  const result = { ...target }

  for (const key in source) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = mergeState(target[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}
