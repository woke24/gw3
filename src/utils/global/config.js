import { reactive, computed } from 'vue'
import { getHeartRateType } from '@/utils/heartRate';
import store from '@/store'
import { searchGameConfigurationFile, sanitizedFolderName } from '@/utils/system'

const NAMESPACE = 'device'

// 响应式获取 Vuex 实时数据
const headsetAngle = computed(() => store.getters[`${NAMESPACE}/getHeadsetAngle`])
const bodyAngle = computed(() => store.getters[`${NAMESPACE}/getBodyAngle`])
const heartRate = computed(() => store.getters[`${NAMESPACE}/getHeartRate`])

// 选中的已连接设备
const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`])

// 跑步机数据
const treadMillData = computed(() => {
  const deviceType = selectedDevice.value.deviceType;

  // 逻辑归类
  if ([2, 3].includes(deviceType)) {
    return store.getters[`${NAMESPACE}/getCTreadmillData`];
  }

  if ([4, 8, 9].includes(deviceType)) {
    return store.getters[`${NAMESPACE}/getTreadmillData`];
  }

  return {};
});

// 臂带数据
const armbandConnectedInfo = computed(() => store.getters[`${NAMESPACE}/getArmbandInfo`])

// 行走步数
const dailySteps = computed(() => store.getters[`${NAMESPACE}/getDailySteps`])
console.log('dailySteps', dailySteps.value)

// 计算卡路里和距离等数据
const caloriesBurned = computed(() => {
  const coefficient = Number(60 * 1.2 / 1000);
  return Math.round((dailySteps.value.steps || 0) * coefficient)
})

const distanceTraveled = computed(() => {
  const stepLengthInMeters = 0.7;
  return Number((Math.round(dailySteps.value.steps * stepLengthInMeters)).toFixed(2));
})

const heartRateType = computed(() => {
  return getHeartRateType(heartRate.value);
});

const getNormalizedYaw = (hmdAngle, waistYaw) => {
  let angle = 0;

  if (hmdAngle && waistYaw) {
    angle = Math.floor(hmdAngle - waistYaw);

    angle = angle % 360;
    if (angle < 0) {
      angle += 360;
    }
  }

  return angle;
}

// 参数默认值
const katTreadMillConfig = reactive({
  // 万向行走开关
  omniDirectional: false,
  // 行走速度 对应Walking Speed Multiplier
  speedMul: 1.0,
  // 行走灵敏度 对应Walking Accuracy
  ForwardMovementSensitivity: 0,
  //  特殊动作 横向移动 对应Lateral Movement
  LateralMovement: false,
  //  横向移动模式 (0、1、2)  0为关，1、2为开，locos开传2， walkc开传1
  LateralMovementFun: 0,
  //  横向灵敏度
  LateralMovementSensitivity: 0,
  //  反向运动
  BackwardMovement: false,
  //  反向触发灵敏度
  BackwardMovementSensitivity: 0,
  // 巡航
  CruiseMode: false,
  // 巡航触发灵敏度
  CruiseModeSensitivity: 0,
  // 头身独立 始终传true
  BodyDirection: true,
  // 踏步模式
  StepMode: false,
  // 下蹲模式
  SauctLockMode: false,
  // 续航速度 对应Cruise Speed
  CruiseSpeed: 0.0,
  // 小动作屏蔽
  SmallActionMasking: 0,
  // 踏步灵敏度 Gateway 未使用
  StepModeSensitivity: 0
})

const katTrackerConfig = reactive({
  headToHipOffset: 0.0,
  hipHeight: 0.0,
  hipThighOffset: 0.0,
  thighLength: 0.0,
  thighsOffset: 0.0,
  shankLength: 0.0
})

const inputConfig = reactive({
  enableHook: true,
  rawSpeedMul: 1.0,
  vibrateLevel: 0,
  calibrationVibrate: 3,
  dirctionSource: 0,
  enableVibration: false,
  sensorSensivity: 0.0,
  enableDoubleTriggerCalibration: false,
  enableLongPressMenuCalibration: true,
  enableAutoCalibration: false,
  dummyBoolConfig: false
})

const vehicleSetting = reactive({
  comStaus: false,
  isDown: false,
  isPress: false,
  vehicleHub: false,
  vehicleHubSpeed: 1.7,
  vehicleRRSimulation: 1.0,
  vehicleHubType: 0,
  sitWalking: false,
  sitWalkingSpeed: 1.0,
  vehicleTrigger: false,
  quickDriveMode: true,
  ChairMode: 0,
  VehicleCruiseMode: false,
  SittingHeightAdjustment: false,
  VehicleVibration: 0.0
})

const hapticsSetting = reactive({
  C2TriggerBySteps: 0,
  HapticsMoudleEnable: false,
  HapticsModuleByVRControllerLevel: 0,
  HapticsModuleByLateralLevel: 0,
  HapticsModuleByBackwardLevel: 0,
  HapticsModuleByCruiseLevel: 0
})

const gameSetting = reactive({
  Hand: 0,
  DirctionSource: 0,
  WalkTriggerSource: 0,
  WalkSpeedType: 0,
  SprintSource: 0,
  JumpSource: 0,
  DeadZone: 0,
  ActiveZone: 0,
  Curve: 0,
  MaxSpeedInGame: 0.0,
  LeftHandedMode: false,
  OrlginalTrackpad: 0,
  SprintMode: false,
  SprintThreshold: 0.0,
  JumpMode: false,
  JumpThreshold: 0,
  CurrentControllers: '',
  BothTriggerCalibration: false,
  FastBackward: false
})

const hudConfig = reactive({
  hudDistanceVisible: true,
  hudDistanceZ: 2.0,
  isHudTransparent: true,
  cameraZ: -980,
  heartRateVisible: true,
  heartRateX: 0.03,
  heartRateY: 0.04,
  heartRatingVisible: true,
  stateofSportsVisible: true,
  heartRateSize: 1.0,
  fitnessDataVisible: true,
  fitnessDataX: 0.52,
  fitnessDataY: 0.26,
  walkingVisible: true,
  mileageVisible: true,
  consumeVisible: true,
  sportsTimeVisible: true,
  fitnessDataSize: 1.0,
  deviceDirectionVisible: true,
  deviceDirectionX: 0.03,
  deviceDirectionY: 0.20,
  deviceDirectionSize: 1.0,
  deviceStatusVisible: true,
  deviceStatusX: 0.52,
  deviceStatusY: 0.66,
  armbandVisible: true,
  directionVisible: true,
  leftFootVisible: true,
  rightFootVisible: true,
  deviceStatusSize: 1.0,
  heartRate: 0,
  heartRateType: 0,
  steps: 100,
  duration: 1.0,
  calories: 10.0,
  times: 0,
  hmdAngle: 0,
  sensorAngle: 0,
  armbandData: {
    connectionState: 0,
    battery: 0,
    isBatteryCharging: 0
  },
  sensorData: {
    connectionState: 0,
    battery: 0,
    isBatteryCharging: 0
  },
  leftFootData: {
    connectionState: 0,
    battery: 0,
    isBatteryCharging: 0
  },
  rightFootData: {
    connectionState: 0,
    battery: 0,
    isBatteryCharging: 0
  },
  heartRateOpacity: 1.0,
  fitnessDataOpacity: 1.0,
  deviceDirectionOpacity: 1.0,
  deviceStatusOpacity: 1.0,
  todaysRank: 1,
  todaysRankVisible: true,
  todaysRankX: 0.03,
  todaysRankY: 0.66,
  todaysRankSize: 1.0,
  todaysRankOpacity: 1.0,
  updateFrequencyTextVisible: true,
  currentTimeVisible: true,
  currentTimeX: 0.52,
  currentTimeY: 0.04,
  currentTimeSize: 1.0,
  currentTimeOpacity: 1.0,
  currentTimeDate: 0,
  currentTimeTime: 0
})

const armviewConfig = reactive({
  armViewDistanceVisible: true,
  armViewDisplayArm: true,
  armViewSize: 0.5,
  armviewHeight: 0.0,
  armviewOpacity: 1,
  armviewDisplayDistance: 1,
  armviewX: -0.23,
  armviewY: -0.10,
  armviewHeartRateVisible: true,
  armviewHeartRatingVisible: true,
  armviewStateofSportsVisible: true,
  armviewFitnessDataVisible: true,
  armviewWalkingVisible: true,
  armviewMileageVisible: true,
  armviewConsumeVisible: true,
  armviewActiveTimeVisible: true,
  armviewDeviceDirectionVisible: true,
  armviewDeviceStatusVisible: true,
  armviewArmbandVisible: true,
  armviewDirectionVisible: true,
  armviewLeftFootVisible: true,
  armviewRightFootVisible: true,
  armviewTodaysRankVisible: true,
  armviewUpdateFrequencyText: true,
  armviewCurrentTimeVisible: true,
  armviewCurrentTimeDate: 0,
  armviewCurrentTimeTime: 0,
  heartRate: 100,
  heartRateType: 1,
  steps: 100,
  duration: 60.0,
  calories: 100.0,
  times: 0,
  hmdAngle: 0.0,
  sensorAngle: 0.0,
  armbandData: {
    connectionState: 0,
    battery: 0,
    isBatteryCharging: 0
  },
  sensorData: {
    connectionState: 0,
    battery: 0,
    isBatteryCharging: 0
  },
  leftFootData: {
    connectionState: 0,
    battery: 0,
    isBatteryCharging: 0
  },
  rightFootData: {
    connectionState: 0,
    battery: 0,
    isBatteryCharging: 0
  },
  todaysRank: 0,
  panelOpacity: 1.0,
  isDisplayDistance: false,
  xEuler_left: 6,
  yEuler_left: 272,
  zEuler_left: 312,
  xEuler_right: 174,
  yEuler_right: 272,
  zEuler_right: -132,
  overlayRotAngle: -360
})

const new_GatewayPath = 'Local/New_Gateway'
const profilePath = 'Profile'
/**
 * 读取默认Game Congig并应用
 */
export const initGameConfigSetting = async (host) => {
  if (!host) return

  // File Path
  try {
    const gameId = -1
    const folderPath = `${new_GatewayPath}/${profilePath}/${gameNameDefault}`
    const fileName = 'Default.json'

    // 读默认配置文件
    const data = await host.ConfigRead(folderPath, fileName)

    if (data) {
      const resObj = JSON.parse(data)
      if (resObj.result && resObj.data) {
        const configration = JSON.parse(resObj.data)
        // 设置对应的参数
        await applicationSettings(host, configration)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const applicationSettings = async (host, configs) => {
  if (configs) {
    // Preference
    gameSetting.LeftHandedMode = configs.Preference.DominantHand
    gameSetting.OrlginalTrackpad = configs.Preference.OriginalController
    inputConfig.enableDoubleTriggerCalibration = configs.Preference.BothTriggerCalibration
    katTreadMillConfig.speedMul = configs.Preference.Speed
    katTreadMillConfig.ForwardMovementSensitivity = configs.Preference.accuracy
    gameSetting.SprintMode = configs.Preference.SprintMode
    gameSetting.SprintThreshold = configs.Preference.SprintThreshold
    gameSetting.JumpMode = configs.Preference.JumpMode
    gameSetting.JumpThreshold = configs.Preference.JumpThreshold
    katTreadMillConfig.CruiseMode = configs.Preference.CruiseMode

    // GameConfig
    gameSetting.Hand = configs.GameConfig.WalkController
    gameSetting.WalkTriggerSource = configs.GameConfig.WalkAction
    gameSetting.WalkSpeedType = configs.GameConfig.WalkSpeedType
    gameSetting.SprintSource = configs.GameConfig.SprintAction
    gameSetting.JumpSource = configs.GameConfig.JumpAction
    gameSetting.Curve = configs.GameConfig.Curve
    gameSetting.MaxSpeedInGame = configs.GameConfig.MaxSpeedInGame
    gameSetting.DeadZone = configs.GameConfig.DeadZone
    gameSetting.ActiveZone = configs.GameConfig.ActiveZone

    // Sitting
    vehicleSetting.vehicleHub = configs.Sitting.VehicleHubMode
    vehicleSetting.quickDriveMode = configs.Sitting.QuickDriveMode
    vehicleSetting.vehicleHubType = configs.Sitting.VehicleHubType
    vehicleSetting.vehicleHubSpeed = configs.Sitting.VehicleSpeed
    vehicleSetting.vehicleRRSimulation = configs.Sitting.vehicleRRSimulation

    // Haptics
    hapticsSetting.HapticsMoudleEnable = configs.Haptics.HapticsMode
    inputConfig.vibrateLevel = configs.Haptics.ControllerVibration
    hapticsSetting.C2TriggerBySteps = configs.Haptics.TriggerBySteps

    // 设置游戏相关参数
    await applyGameSettings(host)
    // 设置速度等参数
    await applyTreadMillConfig(host)
    // 设置InputConfig
    await applyInputConfig(host)
    // 设置坐姿参数
    await applySittingConfig(host)
    // 设置震动相关参数
    await applyHapticsConfig(host)
  }
}

// 设置游戏相关参数
const applyGameSettings = async (host) => {
  const currentGameSetting = JSON.stringify(gameSetting)
  await host.KATGameConfig_ToVR(currentGameSetting)
}

// 设置速度等参数
const applyTreadMillConfig = async (host) => {
  const treadMillConfig = JSON.stringify({
    KATTreadMillConfig: katTreadMillConfig,
    KATTrackerConfig: katTrackerConfig
  })
  await host.DRIVER_CONFIG_To_VR(treadMillConfig)
}

// 设置InputConfig
const applyInputConfig = async (host) => {
  console.log('设置InputConfig对应参数', inputConfig)
  const inputConfigSetting = JSON.stringify(inputConfig)
  await host.INPUT_CONFIG_To_VR(inputConfigSetting)
}

// 设置坐姿参数
const applySittingConfig = async (host) => {
  console.log('设置坐姿参数', vehicleSetting)
  const sittingConfigSetting = JSON.stringify(vehicleSetting)
  await host.DRIVER_CONFIG_Vehicle(sittingConfigSetting)
}

// 设置震动相关参数
const applyHapticsConfig = async (host) => {
  console.log('设置震动相关参数', hapticsSetting)
  const hapticsConfigSetting = JSON.stringify(hapticsSetting)
  await host.DRIVER_CONFIG_Haptics(hapticsConfigSetting)
}
const gameNameDefault = 'Default';
/**
 * 读取默认VR HUD并应用
 */
export const initVrHudSetting = async (host) => {
  if (!host) return
  try {
    const gameId = -1

    const folderPath = `${new_GatewayPath}/${profilePath}/${gameNameDefault}`
    const fileName = 'VrHudConfiguration.json'

    // 读默认配置文件
    const data = await host.ConfigRead(folderPath, fileName)

    if (data) {
      const resObj = JSON.parse(data)
      if (resObj.result && resObj.data) {
        const hudConfiguration = resObj.data
        // 应用参数
        await setKatVrHudConfig(host, hudConfiguration)
      } else {
        // 创建配置文件，并应用参数
        const vrhudConfiguration = JSON.stringify(hudConfig)

        // 应用默认参数
        await setKatVrHudConfig(host, vrhudConfiguration)

        const wresult = await host.ConfigWrite(folderPath, fileName, vrhudConfiguration)
        if (wresult) {
          const writeResult = JSON.parse(wresult)
          if (writeResult && writeResult.result) {
            return true
          } else {
            return false
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 读取默认Armvier并应用
 */
export const initArmviewSetting = async (host) => {
  return;
  if (!host) return

  try {
    const folderPath = `${new_GatewayPath}/${profilePath}`
    const fileName = 'ArmviewConfiguration.json'

    // 读默认配置文件
    const data = await host.ConfigRead(folderPath, fileName)

    if (data) {
      const resObj = JSON.parse(data)
      if (resObj.result && resObj.data) {
        const armviewConfiguration = resObj.data
        // 应用参数
        await setKatVrArmviewConfig(host, armviewConfiguration)
      } else {
        // 创建配置文件，并应用参数
        const armviewConfiguration = JSON.stringify(armviewConfig)

        // 应用参数
        await setKatVrArmviewConfig(host, armviewConfiguration)

        const wresult = await host.ConfigWrite(folderPath, fileName, armviewConfiguration)
        if (wresult) {
          const writeResult = JSON.parse(wresult)
          if (writeResult && writeResult.result) {
            return true
          } else {
            return false
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 设置VR HUD参数
 */
export const setKatVrHudConfig = async (host, config) => {
  if (!host) return

  if (config) {
    await host.To_KAT_VR_HUD_Config(config)
  }
}

/**
 * 设置overlay设置的参数
 */
export const setKatVrArmviewConfig = async (host, config) => {
  if (!host) return

  if (config) {
    await host.To_KAT_Armview_Config(config)
  }
}

/**
 * 读取VR HUD参数
 */
export const getKatVrHudConfig = async (host, mode) => {
  return;
  if (!host || !mode) return
  const currentMode = mode

  if (currentMode === 'quik') {
    // 读取快捷设置参数，若不存在，则写入默认的，并返回
    let folderPath = `${new_GatewayPath}/${profilePath}`
    const fileName = 'VrHudConfiguration.json'

    let finalResult = false

    // 配置文件，是否存在
    try {
      const data = await host.ConfigRead(folderPath, fileName)
      if (data) {
        const resObj = JSON.parse(data)
        if (resObj.result && resObj.data) {
          const hudConfiguration = resObj.data
          // 应用参数
          await setKatVrHudConfig(host, hudConfiguration)

          return JSON.parse(hudConfiguration)
        } else {
          // 创建配置文件，并应用参数
          const vrhudConfiguration = JSON.stringify(hudConfig)

          // 应用默认参数
          await setKatVrHudConfig(host, vrhudConfiguration)

          const wresult = await host.ConfigWrite(folderPath, fileName, vrhudConfiguration)
          if (wresult) {
            const writeResult = JSON.parse(wresult)
            if (writeResult && writeResult.result) {
              finalResult = true
            } else {
              finalResult = false
            }
          }
          return finalResult ? JSON.parse(vrhudConfiguration) : hudConfig
        }
      }
    } catch (error) {
      console.log(error)
    }

  } else {
    // 读取快捷设置参数，若不存在，则写入默认的，并返回
    let folderPath = `${new_GatewayPath}/${profilePath}`
    const fileName = 'VrHudConfiguration.json'

    let finalResult = false

    // 配置文件，是否存在
    try {
      const data = await host.ConfigRead(folderPath, fileName)
      if (data) {
        const resObj = JSON.parse(data)
        if (resObj.result && resObj.data) {
          const hudConfiguration = resObj.data
          // 应用参数
          await setKatVrHudConfig(host, hudConfiguration)

          return JSON.parse(hudConfiguration)
        } else {
          // 创建配置文件，并应用参数
          const vrhudConfiguration = JSON.stringify(hudConfig)

          // 应用默认参数
          await setKatVrHudConfig(host, vrhudConfiguration)

          const wresult = await host.ConfigWrite(folderPath, fileName, vrhudConfiguration)
          if (wresult) {
            const writeResult = JSON.parse(wresult)
            if (writeResult && writeResult.result) {
              finalResult = true
            } else {
              finalResult = false
            }
          }
          return finalResult ? JSON.parse(vrhudConfiguration) : hudConfig
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

/**
 * 读取Armview参数
 */
export const getKatVrArmviewConfig = async (host, mode) => {
  return;
  if (!host || !mode) return

  const currentMode = mode

  if (currentMode === 'quik') {
    // 读取快捷设置参数，若不存在，则写入默认的，并返回
    let folderPath = `${new_GatewayPath}/${profilePath}`
    const fileName = 'ArmviewConfiguration.json'

    let finalResult = false
    // 配置文件，是否存在
    try {
      const data = await host.ConfigRead(folderPath, fileName)
      if (data) {
        const resObj = JSON.parse(data)
        if (resObj.result && resObj.data) {
          const armviewConfiguration = resObj.data
          // 应用参数
          await setKatVrArmviewConfig(host, armviewConfiguration)

          return JSON.parse(armviewConfiguration)
        } else {
          // 创建配置文件，并应用参数
          const armviewConfiguration = JSON.stringify(armviewConfig)

          // 应用参数
          await setKatVrArmviewConfig(host, armviewConfiguration)

          const wresult = await host.ConfigWrite(folderPath, fileName, armviewConfiguration)
          if (wresult) {
            const writeResult = JSON.parse(wresult)
            if (writeResult && writeResult.result) {
              finalResult = true
            } else {
              finalResult = false
            }
          }
          return finalResult ? JSON.parse(armviewConfiguration) : armviewConfig
        }
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    // 读取快捷设置参数，若不存在，则写入默认的，并返回
    let folderPath = `${new_GatewayPath}/${profilePath}`
    const fileName = 'ArmviewConfiguration.json'

    let finalResult = false
    // 配置文件，是否存在
    try {
      const data = await host.ConfigRead(folderPath, fileName)
      if (data) {
        const resObj = JSON.parse(data)
        if (resObj.result && resObj.data) {
          const armviewConfiguration = resObj.data
          // 应用参数
          await setKatVrArmviewConfig(host, armviewConfiguration)

          return JSON.parse(armviewConfiguration)
        } else {
          // 创建配置文件，并应用参数
          const armviewConfiguration = JSON.stringify(armviewConfig)

          // 应用参数
          await setKatVrArmviewConfig(host, armviewConfiguration)

          const wresult = await host.ConfigWrite(folderPath, fileName, armviewConfiguration)
          if (wresult) {
            const writeResult = JSON.parse(wresult)
            if (writeResult && writeResult.result) {
              finalResult = true
            } else {
              finalResult = false
            }
          }
          return finalResult ? JSON.parse(armviewConfiguration) : armviewConfig
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// 保存默认配置到Default.json
const saveDefaultConfig = async (gameInfo) => {
  const gameId = gameInfo.gameId
  const gameName = await sanitizedFolderName(host, gameInfo.gameName);
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}`
  const fileName = 'Default.json'

  // 保存高级设置文件
  const gameConfiguration = {
    gameId: gameInfo.gameId,
    gameName: gameInfo.gameName,
    Preference: {
      DominantHand: gameSetting.LeftHandedMode,
      OriginalController: gameSetting.OrlginalTrackpad,
      BothTriggerCalibration: inputConfig.enableDoubleTriggerCalibration,
      Speed: katTreadMillConfig.speedMul,
      accuracy: katTreadMillConfig.ForwardMovementSensitivity,
      UnintentionalMovement: katTreadMillConfig.SmallActionMasking,
      SprintMode: gameSetting.SprintMode,
      SprintThreshold: gameSetting.SprintThreshold,
      JumpMode: gameSetting.JumpMode,
      JumpThreshold: gameSetting.JumpThreshold,
      CruiseMode: katTreadMillConfig.CruiseMode,
      CruiseSpeed: katTreadMillConfig.CruiseSpeed
    },
    GameConfig: {
      WalkController: gameSetting.Hand,
      WalkAction: gameSetting.WalkTriggerSource,
      WalkSpeedType: gameSetting.WalkSpeedType,
      SprintAction: gameSetting.SprintSource,
      JumpAction: gameSetting.JumpSource,
      Curve: gameSetting.Curve,
      MaxSpeedInGame: gameSetting.MaxSpeedInGame,
      DeadZone: gameSetting.DeadZone,
      ActiveZone: gameSetting.ActiveZone
    },
    Sitting: {
      VehicleHubMode: vehicleSetting.vehicleHub,
      QuickDriveMode: vehicleSetting.quickDriveMode,
      VehicleHubType: vehicleSetting.vehicleHubType,
      VehicleSpeed: vehicleSetting.vehicleHubSpeed,
      vehicleRRSimulation: vehicleSetting.vehicleRRSimulation
    },
    Haptics: {
      HapticsMode: hapticsSetting.HapticsMoudleEnable,
      ControllerVibration: inputConfig.vibrateLevel,
      TriggerBySteps: hapticsSetting.C2TriggerBySteps
    }
  }

  const content = JSON.stringify(gameConfiguration)
  await host.ConfigWrite(folderPath, fileName, content)
}

// 设置VR HUD参数
const setRealtimeKatVrHudConfig = async (host, config) => {
  if (config) {
    config.steps = dailySteps.value.steps || 0
    config.duration = distanceTraveled.value || 0
    config.calories = caloriesBurned.value || 0
    config.heartRate = heartRate.value || 0
    const newConfig = JSON.stringify(config)
    await setKatVrHudConfig(host, newConfig)
  }
}

/**
 * 监控VR HUD
 */
export const settingVrHudConfig = async (host) => {
  if (!host) return
  try {

    // 步数
    hudConfig.steps = dailySteps.value.steps || 0;
    // 运动时长（分钟）
    hudConfig.duration = distanceTraveled.value || 0;
    // 消耗卡路里
    hudConfig.calories = caloriesBurned.value || 0;

    // 心率与角度
    hudConfig.heartRate = heartRate.value;
    hudConfig.heartRateType = heartRateType.value;
    hudConfig.sensorAngle = getNormalizedYaw(headsetAngle.value, bodyAngle.value);

    // 手环数据
    hudConfig.armbandData = {
      connectionState: armbandConnectedInfo.value.connected ? 1 : 0,
      battery: parseInt(armbandConnectedInfo.value.battery),
      isBatteryCharging: 0
    };

    // 跑步机/传感器数据
    const td = treadMillData.value;
    const updateSensor = (key) => ({
      connectionState: (td.connected && td[key]?.batteryLevel > 0) ? 1 : 0,
      battery: parseInt(td[key]?.batteryLevel * 100),
      isBatteryCharging: td[key]?.isBatteryCharging ? 1 : 0
    });
    hudConfig.sensorData = updateSensor('direction');
    hudConfig.leftFootData = updateSensor('leftFoot');
    hudConfig.rightFootData = updateSensor('rightFoot');

    await setRealtimeKatVrHudConfig(host, hudConfig)

  } catch (err) {
    console.error(err)
  }
}

/**
 * 封装：每10ms设置VR HUD参数
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const handleSettingVrHud = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await settingVrHudConfig(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 10)
    }
  }

  // console.log('Setting VR HUD has been started (period: 1s)')
  await settingVrHudConfig()

  await poll()
}

// 设置VR HUD参数
const setRealtimeKatArmviewConfig = async (host, config) => {
  if (config) {
    config.steps = dailySteps.value.steps || 0
    config.duration = distanceTraveled.value || 0
    config.calories = caloriesBurned.value || 0
    config.heartRate = heartRate.value || 0
    const newConfig = JSON.stringify(config)
    await setKatVrArmviewConfig(host, newConfig)
  }
}

/**
 * 监控Armview
 */
export const settingArmviewConfig = async (host) => {
  if (!host) return
  try {
    // 步数
    armviewConfig.steps = dailySteps.value.steps || 0;
    // 运动时长（分钟）
    armviewConfig.duration = distanceTraveled.value || 0;
    // 消耗卡路里
    armviewConfig.calories = caloriesBurned.value || 0;

    // 心率与角度
    armviewConfig.heartRate = heartRate.value;
    armviewConfig.heartRateType = heartRateType.value;
    armviewConfig.sensorAngle = getNormalizedYaw(headsetAngle.value, bodyAngle.value);

    // 手环数据
    armviewConfig.armbandData = {
      connectionState: armbandConnectedInfo.value.connected ? 1 : 0,
      battery: parseInt(armbandConnectedInfo.value.battery),
      isBatteryCharging: 0
    };

    // 跑步机/传感器数据
    const td = treadMillData.value;
    const updateSensor = (key) => ({
      connectionState: (td.connected && td[key]?.batteryLevel > 0) ? 1 : 0,
      battery: parseInt(td[key]?.batteryLevel * 100),
      isBatteryCharging: td[key]?.isBatteryCharging ? 1 : 0
    });

    armviewConfig.sensorData = updateSensor('direction');
    armviewConfig.leftFootData = updateSensor('leftFoot');
    armviewConfig.rightFootData = updateSensor('rightFoot');

    await setRealtimeKatArmviewConfig(host, armviewConfig)

  } catch (err) {
    console.error(err)
  }
}

/**
 * 封装：每10ms设置VR HUD参数
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const handleSettingArmview = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await settingArmviewConfig(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 10)
    }
  }

  // console.log('Setting Armview has been started (period: 1s)')
  await settingArmviewConfig(host)

  await poll()
}