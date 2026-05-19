import { reactive, computed } from 'vue'
import store from '@/store'
import { configRead, configWrite, getGameInstalledStatus, sanitizedFolderName } from '@/utils/system'
import { newGameConfiguration } from '@/api/gateway'


const allGameLists = computed(() => store.getters['game/getGlobalGameConfigs'])

let gamePollingTimer = null


// 生成hash值用于对比数据是否发生变化
const generateHash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return hash.toString()
}

// 对比本地和远程数据的hash值，判断是否需要更新本地配置
const juxtapose = async (localDatas, remoteDatas) => {
  const localHash = generateHash(JSON.stringify(localDatas))
  const remoteHash = generateHash(JSON.stringify(remoteDatas))
  if (localHash !== remoteHash) {
    return true
  } else {
    return false
  }
}

// 获取所有steam游戏推荐配置并写入全局配置文件
export const getAllGameConfigs = async (host) => {
  try {
    const res = await newGameConfiguration()
    if (res.code === 20000) {
      // 写入配置
      if (res.data && res.data.length > 0) {
        const configurations = res.data
        await saveConfigurations(host, configurations)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

// 保存游戏配置到本地存储
export const saveConfigurations = async (host, configurations) => {
  try {
    const remoteGameList = configurations
    await saveGameConfigs(host, configurations)
  } catch (error) {
    console.log(error)
  }
}

// 读取STEAM游戏推荐设置配置文件
const readGameConfigs = async (host) => {
  const folderPath = new_GatewayPath
  const fileName = 'NewConfiguration.json'
  try {
    return await configRead(host, folderPath, fileName)
  } catch (error) {
    console.log(error)
  }
}

// 写入STEAM游戏推荐配置文件
const saveGameConfigs = async (host, configs) => {
  const folderPath = new_GatewayPath
  const fileName = 'NewConfiguration.json'
  if (configs) {
    const data = JSON.stringify(configs)
    return await configWrite(host, folderPath, fileName, data)
  }
}

// 初始化游戏全局配置文件，根据已安装STEAM游戏列表生成配置文件数据结构并写入全局配置文件
export const initGlobalGameConfigs = async (host) => {
  try {
    const gameConfigs = await readGameConfigs(host);
    if (!gameConfigs) return [];

    const { result, data } = JSON.parse(gameConfigs);
    if (!result || !data) return [];

    const gameList = JSON.parse(data);
    if (!Array.isArray(gameList) || gameList.length === 0) return [];

    const statusPromises = gameList.map(async (game) => {
      const gameId = parseInt(game.ID);
      const isInstalled = await getGameInstalledStatus(host, gameId);

      return isInstalled ? { ID: gameId, Name: game.Name } : null;
    });

    const results = await Promise.all(statusPromises);
    const filteredGames = results.filter(game => game !== null);

    const findResult = filteredGames.find((item) => Number(item.ID) === 438100)

    if (findResult) {
      filteredGames.push({
        ID: 43810011,
        Name: 'VRCHATOSC'
      })
    }

    return filteredGames;

  } catch (err) {
    console.error('Failed to init global game configs:', err);
    return [];
  }
};

// 生成初始配置, 没有默认配置时初始化default配置
export const generateInitialConfig = async (host) => {

  console.log('生成初始化配置')
  let finalResult = true

  try {
    // 定义JSON数据结构
    let gameConfig = {
      DevicesList: [],
      Current_Select_Game: 'Default_-1_DEFAULT',
      SteamGame: [],
      CustomGame: [],
      Default: {},
      Devices: {}
    }

    // 处理默认参数
    gameConfig.Default = {
      ID: -1,
      Name: 'Default',
      Installed: 0,
      KAT: 1,
      Config_Index: 0,
      QuickConfiguration: true,
      C2ControllerOptions: {
        Quik: {
          LeftHandedMode: false,
          WalkingSpeed: 1,
          WalkingAccuracy: 0,
          OrlginalTrackpad: 1,
          SensorSensitivity: 0,
          SprintMode: true,
          SprintThreshold: 10,
          JumpMode: true,
          JumpThreshold: 5,
          CruiseMode: false,
          CruiseModeSensitivity: 2,
          EnableBothTriggerCalibration: true
        },
        Advanced: {
          LeftHandedMode: false,
          WalkingSpeed: 1.0,
          WalkingAccuracy: 0,
          OrlginalTrackpad: 0,
          SensorSensitivity: 0,
          SprintMode: false,
          SprintThreshold: 4.15,
          JumpMode: false,
          JumpThreshold: 5,
          CruiseMode: false,
          CruiseModeSensitivity: 2.0,
          EnableBothTriggerCalibration: true
        }
      },
      C3ControllerOptions: {
        Quik: {
          LeftHandedMode: false,
          WalkingSpeed: 1,
          WalkingAccuracy: 0,
          OrlginalTrackpad: 1,
          BackwardSpeed: 1,
          SensorSensitivity: 0,
          SprintMode: true,
          SprintThreshold: 10,
          JumpMode: true,
          JumpThreshold: 5,
          CruiseMode: false,
          CruiseModeSensitivity: 2,
          EnableBothTriggerCalibration: true
        },
        Advanced: {
          LeftHandedMode: false,
          WalkingSpeed: 1.0,
          WalkingAccuracy: 0,
          OrlginalTrackpad: 0,
          BackwardSpeed: 1,
          SensorSensitivity: 0,
          SprintMode: false,
          SprintThreshold: 4.15,
          JumpMode: false,
          JumpThreshold: 5,
          CruiseMode: false,
          CruiseModeSensitivity: 2.0,
          EnableBothTriggerCalibration: true
        }
      },
      OtherControllerOptions: {
        Quik: {
          LeftHandedMode: false,
          OrlginalTrackpad: 0,
          WalkingSpeed: 1,
          WalkingAccuracy: 0,
          LateralFun: false,
          LateralFunSensitivity: 0,
          BackFun: false,
          BackSensitivity: 0,
          CruiseFun: false,
          CruiseFunSensitivity: 0,
          SensorSensitivity: 0,
          SprintMode: false,
          SprintThreshold: 10,
          JumpMode: false,
          JumpThreshold: 5,
          EnableBothTriggerCalibration: true
        },
        Advanced: {
          LeftHandedMode: false,
          OrlginalTrackpad: 0,
          LateralFun: false,
          LateralFunSensitivity: 0,
          BackFun: false,
          BackSensitivity: 0,
          CruiseFun: false,
          CruiseFunSensitivity: 0,
          SensorSensitivity: 0,
          SprintMode: false,
          SprintThreshold: 4.15,
          JumpMode: false,
          JumpThreshold: 5,
          EnableBothTriggerCalibration: true
        }
      },
      Sitting: {
        Quik: {
          VehicleHub: true,
          QuickDrive: true,
          VehicleMode: 0,
          VehicleSpeed: 1.7,
          RRSimulation: 1
        },
        Advanced: {
          VehicleHub: false,
          QuickDrive: true,
          VehicleMode: 0,
          VehicleHubList: [
            {
              VehicleSpeed: 1.7,
              RRSimulation: 1
            },
            {
              VehicleSpeed: 1.1,
              RRSimulation: 1
            },
            {
              VehicleSpeed: 2,
              RRSimulation: 1
            },
            {
              VehicleSpeed: 1.2,
              RRSimulation: 1
            }
          ],
          VehicleSpeed: 1.7,
          RRSimulation: 1
        }
      },
      HapticC2: {
        Quik: {
          HapticMoudleEanble: false,
          HapticModuleByVRControllerLevel: 5,
          HapticModuleByWalkLevel: 1
        },
        Advanced: {
          HapticMoudleEanble: false,
          HapticModuleByVRControllerLevel: 5,
          HapticModuleByWalkLevel: 1
        }
      },
      OtherHaptic: {
        Quik: {
          HapticMoudleEanble: false,
          HapticModuleByVRControllerLevel: 5,
          HapticModuleByWalkLevel: 1,
          HapticModuleByWalkEnable: true,
          HapticModuleByLateralLevel: 2,
          HapticModuleByBackwardLevel: 2,
          HapticModuleByCruiseLevel: 2
        },
        Advanced: {
          HapticMoudleEanble: false,
          HapticModuleByVRControllerLevel: 5,
          HapticModuleByWalkLevel: 1,
          HapticModuleByWalkEnable: true,
          HapticModuleByLateralLevel: 2,
          HapticModuleByBackwardLevel: 2,
          HapticModuleByCruiseLevel: 2
        }
      },
      GlobalConfig: {
        LinearMapping: true,
        MappingController: 0,
        DirectionDatum: 0,
        ControlMethod: 0,
        ControlMethodTwo: 3,
        MappingSpeed: 1,
        SprintSource: 0,
        JumpSource: 26,
        FollowRecommendedSettings: true,
        WalkSpeedType: 0,
        DeadZone: 0,
        ActiveZone: 100,
        Curve: 0,
        MaxSpeedInGame: 3,
        Devices: {
          DetectedController: 'No Controllers',
          RenameController: 'No Controllers',
          DeviceName: 'No Controllers',
          SerialNumber: ''
        }
      },
      HudConfig: {
        // 全部总开关
        hudDistanceVisible: true,
        // z轴远近 [2.00,10.00]  默认2
        hudDistanceZ: 2.0,
        // 背景是不是透明 =true为透明
        isHudTransparent: false,
        // 相机的z轴远近  固定传-980
        cameraZ: -980,
        // Heart Rate总开关，默认true
        heartRateVisible: true,
        // Heart Rate显示的x坐标，以左上为原点，默认值0.0333333351之前的后面可根据效果自行更改
        heartRateX: 0.03,
        // Heart Rate显示的y坐标，以左上为原点，默认值0.0466666669之前的后面可根据效果自行更改
        heartRateY: 0.04,
        // heartRatings显示，默认true，对应Heart Rate显示与否
        heartRatingVisible: true,
        // 默认true，对应 Fitness Zone显示与否
        stateofSportsVisible: true,
        // Heart Rate 字体大小倍率，默认1 范围[0.40,2.00] --> add 0.1
        heartRateSize: 1.0,
        // Fitness Data总开关 默认true
        fitnessDataVisible: true,
        // Fitness Data显示的x坐标，以左上为原点 默认值0.728888869
        fitnessDataX: 0.52,
        // Fitness Data显示的y坐标，以左上为原点 默认值0.111111112
        fitnessDataY: 0.26,
        // walking是否显示 默认true 对应walking
        walkingVisible: true,
        // mileage是否显示 默认 true 对应 mileage
        mileageVisible: true,
        // consume是否显示  默认 true 对应 consume
        consumeVisible: true,
        // sportsTime是否显示 默认true 对应 active time 
        sportsTimeVisible: true,
        // Fitness Data 字体大小倍率  [0.40,2.00] 默认1.0
        fitnessDataSize: 1.0,
        // Device Direction 开关 默认true
        deviceDirectionVisible: true,
        // Device Direction显示的x坐标，以左上为原点  默认值0.0333333351
        deviceDirectionX: 0.03,
        // Device Direction显示的y坐标，以左上为原点  默认值0.126666665
        deviceDirectionY: 0.20,
        // Device Direction 字体大小倍率  [0.40,2.00] 默认1.0
        deviceDirectionSize: 1.0,
        // Device Status总开关 默认true
        deviceStatusVisible: true,
        // Device Status显示的x坐标，以左上为原点  默认0.728888869
        deviceStatusX: 0.52,
        // Device Status显示的y坐标，以左上为原点  默认0.311111122
        deviceStatusY: 0.66,
        // armband是否显示 默认true 对应VR Armband
        armbandVisible: true,
        // direction是否显示 默认 true 对应Direction Sensor
        directionVisible: true,
        // leftFoot是否显示 默认 true 对应Foot Sensor 由一个按钮控制
        leftFootVisible: true,
        // rightFoot是否显示 默认 true 对应Foot Sensor
        rightFootVisible: true,
        // Device Status 字体大小倍率 默认1.0 [0.40,2.00]
        deviceStatusSize: 1.0,
        // 心率
        heartRate: 0,
        // No=0 没插入设备，没有通讯数据时为0, Warm Up=1 心率小于等于108时传1,Fat Burning=2 心率小于等于126大于108时传2,Aerobic=3 心率大于126小于等于144时传3,Anaerobic=4 心率大于144小于等于162时传4,Extreme=5 心率大于162时传5
        heartRateType: 0,
        // 步数
        steps: 0,
        // 路程 m
        duration: 0.0,
        // 卡路里 Kcal
        calories: 0.0,
        // 时间 分钟
        times: 0,
        // 头显角度
        hmdAngle: 0,
        // 方向角度
        sensorAngle: 0,
        // 臂带
        armbandData: {
          // 连接状态
          connectionState: 0,
          // 电量
          battery: 0,
          // 充电状态
          isBatteryCharging: 0
        },
        // 方向传感器
        sensorData: {
          connectionState: 0,
          battery: 0,
          isBatteryCharging: 0
        },
        // 左脚传感器
        leftFootData: {
          connectionState: 0,
          battery: 0,
          isBatteryCharging: 0
        },
        // 右脚传感器
        rightFootData: {
          connectionState: 0,
          battery: 0,
          isBatteryCharging: 0
        },
        // heartRate 透明度[0,1]
        heartRateOpacity: 1.0,
        // fitnessData透明度[0,1]
        fitnessDataOpacity: 1.0,
        // deviceDirection 透明度[0,1]
        deviceDirectionOpacity: 1.0,
        // deviceStatus 透明度[0,1]
        deviceStatusOpacity: 1.0,
        // 当日排行榜 为0时显示
        todaysRank: 0,
        // Today's Rank总开关 默认true
        todaysRankVisible: true,
        // 默认0.0333333351
        todaysRankX: 0.03,
        // 默认0.36
        todaysRankY: 0.66,
        // Today's Rank 字体大小倍率 [0.40,2.00] 默认1
        todaysRankSize: 1.0,
        // todaysRank透明度[0,1] 默认1
        todaysRankOpacity: 1.0,
        // updateFrequency文本是否显示 默认true
        updateFrequencyTextVisible: true,
        // Current Time总开关
        currentTimeVisible: true,
        // CurrentTime显示的x坐标，默认0.728888869
        currentTimeX: 0.52,
        // CurrentTime显示Y坐标，默认0.0466666669
        currentTimeY: 0.04,
        // Current Time 字体大小倍率，[0.40,2.00] 默认1
        currentTimeSize: 1.0,
        // Current Time透明度[0,1] 默认1
        currentTimeOpacity: 1.0,
        // 0--> MM/DD/YYYY06/20/2025  1-->DD/MM/YYYY20/06/2025 2-->YYYY/MM/DD2025/06/20  3-->Hidden不显示日期
        currentTimeDate: 0,
        // 0-->AM/PM Time06:00 PM 1-->  HH:MM18:00  2-->Hidden不显示日期
        currentTimeTime: 0
      },
      ArmviewConfig: {
        // 全部总开关 默认 true
        armViewDistanceVisible: true,
        // true为左手 false为右手  默认true
        armViewDisplayArm: true,
        // 字体大小 size [0.325,0.775] 默认0.5 add 0.05
        armViewSize: 0.5,
        // 高度 floats height 传[0.05,-0.05]  左边是大  默认0
        armviewHeight: 0.0,
        // 透明度opacity [0.4,1] 默认1
        armviewOpacity: 1,
        // 显示距离 Z  Vanish Distance  默认1  [0.25,1]
        armviewDisplayDistance: 1,
        // x的坐标 以正方形圆点为中心   Gateway面板的长宽为445, 223，拖动的显示1.0大小为100, 75  默认-0.10157913
        armviewX: 0.23,
        // y的坐标 以正方形圆点为中心  默认-0.101970375
        armviewY: 0.10,
        // Heart Rate总开关 默认true
        armviewHeartRateVisible: true,
        // 红心开关 默认ture
        armviewHeartRatingVisible: true,
        // 运动图标开关  默认ture
        armviewStateofSportsVisible: true,
        // Fitness Data总开关  默认ture
        armviewFitnessDataVisible: true,
        // walking显示开关 默认ture
        armviewWalkingVisible: true,
        // mileage显示开关 默认ture
        armviewMileageVisible: true,
        // Consume显示开关 默认ture
        armviewConsumeVisible: true,
        // ActiveTime显示开关 默认ture
        armviewActiveTimeVisible: true,
        // Device Direction 开关 默认ture
        armviewDeviceDirectionVisible: true,
        // Device Status总开关 默认ture
        armviewDeviceStatusVisible: true,
        // vr armband显示开关 默认ture
        armviewArmbandVisible: true,
        // Direction显示开关 默认ture
        armviewDirectionVisible: true,
        // 左脚显示开关 默认ture
        armviewLeftFootVisible: true,
        // 右脚显示开关 默认ture
        armviewRightFootVisible: true,
        // Today's Rank总开关 默认ture
        armviewTodaysRankVisible: true,
        // 文本是否显示 默认ture
        armviewUpdateFrequencyText: true,
        // Today's Rank总开关 默认ture
        armviewCurrentTimeVisible: true,
        // MM/dd/yyyy 06/20/2025  1-->dd/MM/yyyy 20/06/2025 2-->yyyy/MM/dd 2025/06/20  3-->Hidden不显示日期
        armviewCurrentTimeDate: 0,
        // 0-->AM/PM Time06:00 PM 1-->  HH:mm 18:00  2-->Hidden不显示日期
        armviewCurrentTimeTime: 0,
        // 心率
        heartRate: 0,
        // No=0, Warm Up=1,Fat Burning=2,Aerobic=3,Anaerobic=4,Extreme=5
        heartRateType: 0,
        // 步数 
        steps: 0,
        // 路程 m
        duration: 0.0,
        // 卡路里 Kcal
        calories: 0.0,
        // 时间 分钟
        times: 0,
        // 头显角度
        hmdAngle: 0.0,
        // 方向角度
        sensorAngle: 0.0,
        // 臂带
        armbandData: {
          connectionState: 0,
          battery: 0,
          isBatteryCharging: 0
        },
        // 方向传感器
        sensorData: {
          connectionState: 0,
          battery: 0,
          isBatteryCharging: 0
        },
        // 左脚传感器
        leftFootData: {
          connectionState: 0,
          battery: 0,
          isBatteryCharging: 0
        },
        // 右脚传感器
        rightFootData: {
          connectionState: 0,
          battery: 0,
          isBatteryCharging: 0
        },
        // 排名
        todaysRank: 0,
        // 透明度 background opacity [0.00,1.00] 默认1
        panelOpacity: 1.0,
        // 背景板是否显示，传false
        isDisplayDistance: false,
        // 左右手柄平面对应的欧拉角 传6
        xEuler_left: 6,
        // 传 272
        yEuler_left: 272,
        // 传 312
        zEuler_left: 312,
        // 传 174
        xEuler_right: 174,
        // 传 272
        yEuler_right: 272,
        // 传 -132
        zEuler_right: -132,
        // 旋转角度 rotate[-2250, -4050],默认-3600 左右对称，然后，当armViewDisplayArm为true时，传overlayRotAngle为false时，传-overlayRotAngle
        overlayRotAngle: -360
      },
      GameConfigFile: 'Default',
      Page: 0
    }

    // 当前使用手柄
    gameConfig.Devices = {
      DetectedController: "No Controllers",
      RenameController: "No Controllers",
      DeviceName: "No Controllers",
      SerialNumber: ""
    }

    // 设备列表集合
    gameConfig.DevicesList.push(gameConfig.Devices)

    // 判断全局配置文件GameControllerOptions.json是否生成，若已经生成，判断默认Default文件是否生成
    const fileInfo = await readGameControllerOptions(host)

    if (!fileInfo) {
      // 写入配置

      const writeResStr = await saveGameControllerOptions(host, gameConfig);

      if (writeResStr) {
        const writeResult = JSON.parse(writeResStr)

        if (writeResult.result) {
          finalResult = true
        }
        finalResult = false
      }

      finalResult = false
    }

    if (finalResult) {
      // 检查默认配置文件是否生成
      const defaultConfig = gameConfig.Default
      // 生成默认配置文件
      await writeDefaultGameConfigFile(host, defaultConfig)
    }

    return finalResult

  } catch (error) {
    console.log(error)
    finalResult = false
    return finalResult
  }
}

// 保存游戏列表全局配置
export const saveGameControllerOptions = async (host, configs) => {
  try {
    const folderPath = new_GatewayPath
    const fileName = 'GameControllerOptions.json'
    if (configs) {
      const data = JSON.stringify(configs)
      return await configWrite(host, folderPath, fileName, data)
    }
  } catch (error) {
    console.log(error)
  }
}

// 读取游戏列表全局配置GameControllerOptions.json
export const readGameControllerOptions = async (host) => {
  // 读取配置信息
  const folderPath = new_GatewayPath
  const fileName = 'GameControllerOptions.json'

  try {
    const data = await configRead(host, folderPath, fileName)

    if (data) {
      const resObj = JSON.parse(data)
      if (resObj.result && resObj.data) {
        const configration = JSON.parse(resObj.data)
        return configration;
      }
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 更新STEAM游戏配置
 * @param {*} host
 * @param {*} mode // 快捷/高级
 * @param {*} configs
 */
export const updateGameControllerOptions = async (host, configs) => {
  try {
    await saveGameControllerOptions(host, configs);
  } catch (error) {
    console.log(error)
  }
}

// 已安装STEAM游戏列表
const saveInstalledGames = async (host, games) => {
  const folderPath = new_GatewayPath
  const fileName = 'InstalledSteamGames.json'
  if (games) {
    const data = JSON.stringify(games)
    return await configWrite(host, folderPath, fileName, data)
  }
}

// 生成对应游戏默认配置文件
export const initGameDefaultConfig = async (host, gameId) => {
  try {

    // 读取游戏配置信息
    let configurations = []
    const gameConfigs = await readGameConfigs(host);
    if (gameConfigs) {
      const res = JSON.parse(gameConfigs);
      if (res.result && res.data) {
        configurations = JSON.parse(res.data)
      }
    }

    let gameInfo = {};

    // 查找对应游戏信息
    if (configurations.length > 0) {
      gameInfo = configurations.find((item) => parseInt(item.ID) === parseInt(gameId))
    }

    // 定义游戏配置结构
    let gameConfig = {}

    if (gameInfo) {

      const gameId = gameInfo.ID
      const gameName = gameInfo.Name

      let VehicleSpeed = 1.7
      let RRSimulation = 1.0

      // 根据模式匹配对应设置
      switch (gameInfo.sittingSetting.vehicleMode) {
        case 0:
          VehicleSpeed = parseFloat(gameInfo?.sittingSetting.autoOptions.vehicleSpeed)
          RRSimulation = parseFloat(gameInfo?.sittingSetting.autoOptions.roadRoughnessSimulation)
          break
        case 1:
          VehicleSpeed = parseFloat(gameInfo?.sittingSetting.mountsOptions.vehicleSpeed)
          RRSimulation = parseFloat(gameInfo?.sittingSetting.mountsOptions.roadRoughnessSimulation)
          break
        case 2:
          VehicleSpeed = parseFloat(gameInfo?.sittingSetting.aircraftOptions.vehicleSpeed)
          RRSimulation = parseFloat(gameInfo?.sittingSetting.aircraftOptions.roadRoughnessSimulation)
          break
        case 3:
          VehicleSpeed = parseFloat(gameInfo?.sittingSetting.heavyVehiclesOptions.vehicleSpeed)
          RRSimulation = parseFloat(gameInfo?.sittingSetting.heavyVehiclesOptions.roadRoughnessSimulation)
          break
      }

      gameConfig = {
        ID: gameId,
        Name: gameName,
        Path: '',
        Exe: '',
        Installed: 0,
        KAT: 1,
        Config_Index: 0,
        QuickConfiguration: true,
        C2ControllerOptions: {
          Quik: {
            LeftHandedMode: false,
            WalkingSpeed: 1.0,
            WalkingAccuracy: 0,
            OrlginalTrackpad: 1,
            SensorSensitivity: 0, // Unintentional Movement 小动作屏蔽
            SprintMode: true,
            SprintThreshold: 10,
            JumpMode: true,
            JumpThreshold: 5,
            CruiseMode: false,
            CruiseModeSensitivity: 2.0,
            EnableBothTriggerCalibration: true
          },
          Advanced: {
            LeftHandedMode: gameInfo?.c2controllerSetting.leftHandedMode,
            WalkingSpeed: gameInfo?.c2controllerSetting.walkingSpeed ? Number(gameInfo?.c2controllerSetting.walkingSpeed) : 1.0,
            WalkingAccuracy: gameInfo?.c2controllerSetting.walkingAccuracy ? Number(gameInfo?.c2controllerSetting.walkingAccuracy) : 0,
            OrlginalTrackpad: gameInfo?.c2controllerSetting.originalTrackpadOrJoystick ? Number(gameInfo?.c2controllerSetting.originalTrackpadOrJoystick) : 1,
            SensorSensitivity: gameInfo?.c2controllerSetting.sensorSensitivity ? Number(gameInfo?.c2controllerSetting.sensorSensitivity) : 0,
            SprintMode: gameInfo?.c2controllerSetting.sprintMode,
            SprintThreshold: gameInfo?.c2controllerSetting.sprintThreshold ? Number(gameInfo?.c2controllerSetting.sprintThreshold) : 4.15,
            JumpMode: gameInfo?.c2controllerSetting.jumpMode,
            JumpThreshold: gameInfo?.c2controllerSetting.jumpThreshold ? Number(gameInfo?.c2controllerSetting.jumpThreshold) : 5,
            CruiseMode: gameInfo?.c2controllerSetting.cruiseMode,
            CruiseModeSensitivity: gameInfo?.c2controllerSetting.cruiseSpeed ? Number(gameInfo?.c2controllerSetting.cruiseModeSensitivity) : 2.0,
            EnableBothTriggerCalibration: true
          }
        },
        C3ControllerOptions: {
          Quik: {
            LeftHandedMode: false,
            WalkingSpeed: 1.0,
            WalkingAccuracy: 0,
            OrlginalTrackpad: 1,
            BackwardSpeed: 1.0,  // C 3
            SensorSensitivity: 0, // Unintentional Movement 小动作屏蔽
            SprintMode: true,
            SprintThreshold: 10,
            JumpMode: true,
            JumpThreshold: 5,
            CruiseMode: false,
            CruiseModeSensitivity: 2.0,
            EnableBothTriggerCalibration: true
          },
          Advanced: {
            LeftHandedMode: gameInfo?.c2controllerSetting.leftHandedMode,
            WalkingSpeed: gameInfo?.c2controllerSetting.walkingSpeed ? Number(gameInfo?.c2controllerSetting.walkingSpeed) : 1.0,
            WalkingAccuracy: gameInfo?.c2controllerSetting.walkingAccuracy ? Number(gameInfo?.c2controllerSetting.walkingAccuracy) : 0,
            OrlginalTrackpad: gameInfo?.c2controllerSetting.originalTrackpadOrJoystick ? Number(gameInfo?.c2controllerSetting.originalTrackpadOrJoystick) : 1,
            BackwardSpeed: 1.0, // C 3
            SensorSensitivity: gameInfo?.c2controllerSetting.sensorSensitivity ? Number(gameInfo?.c2controllerSetting.sensorSensitivity) : 0,
            SprintMode: gameInfo?.c2controllerSetting.sprintMode,
            SprintThreshold: gameInfo?.c2controllerSetting.sprintThreshold ? Number(gameInfo?.c2controllerSetting.sprintThreshold) : 4.15,
            JumpMode: gameInfo?.c2controllerSetting.jumpMode,
            JumpThreshold: gameInfo?.c2controllerSetting.jumpThreshold ? Number(gameInfo?.c2controllerSetting.jumpThreshold) : 5,
            CruiseMode: gameInfo?.c2controllerSetting.cruiseMode,
            CruiseModeSensitivity: gameInfo?.c2controllerSetting.cruiseSpeed ? Number(gameInfo?.c2controllerSetting.cruiseModeSensitivity) : 2.0,
            EnableBothTriggerCalibration: true
          }
        },
        OtherControllerOptions: {
          Quik: {
            LeftHandedMode: false,
            OrlginalTrackpad: 0,
            WalkingSpeed: 1.0,
            WalkingAccuracy: 0,
            LateralFun: false,
            LateralFunSensitivity: 0,
            BackFun: false,
            BackSensitivity: 0,
            CruiseFun: false,
            CruiseFunSensitivity: 0,
            SensorSensitivity: 0,
            SprintMode: false,
            SprintThreshold: 10,
            JumpMode: false,
            JumpThreshold: 5,
            EnableBothTriggerCalibration: true
          },
          Advanced: {
            LeftHandedMode: false,
            OrlginalTrackpad: gameInfo?.otherControllerSetting.otherOriginalTrackpadOrJoystick ? Number(gameInfo?.otherControllerSetting.otherOriginalTrackpadOrJoystick) : 0,
            WalkingSpeed: gameInfo?.otherControllerSetting.walkingSpeed ? Number(gameInfo?.otherControllerSetting.walkingSpeed) : 1.0,
            WalkingAccuracy: gameInfo?.otherControllerSetting.walkingAccuracy ? Number(gameInfo?.otherControllerSetting.walkingAccuracy) : 0,
            LateralFun: gameInfo?.otherControllerSetting.lateralOptions.lateralMovement,
            LateralFunSensitivity: gameInfo?.otherControllerSetting.lateralOptions.lateralTriggerSensitivity ? Number(gameInfo?.otherControllerSetting.lateralOptions.lateralTriggerSensitivity) : 0,
            BackFun: gameInfo?.otherControllerSetting.backwardMovementOptions.backwardMovement,
            BackSensitivity: gameInfo?.otherControllerSetting.backwardMovementOptions.backwardTriggerSensitivity ? Number(gameInfo?.otherControllerSetting.backwardMovementOptions.backwardTriggerSensitivity) : 0,
            CruiseFun: gameInfo?.otherControllerSetting.cruiseMovementOptions.cruiseMovement,
            CruiseFunSensitivity: gameInfo?.otherControllerSetting.cruiseMovementOptions.cruiseTriggerSensitivity ? Number(gameInfo?.otherControllerSetting.cruiseMovementOptions.cruiseTriggerSensitivity) : 0,
            SensorSensitivity: gameInfo?.otherControllerSetting.otherSensorSensitivity ? Number(gameInfo?.otherControllerSetting.otherSensorSensitivity) : 0,
            SprintMode: gameInfo?.otherControllerSetting.otherSprintMode,
            SprintThreshold: gameInfo?.otherControllerSetting.otherSprintThreshold ? Number(gameInfo?.otherControllerSetting.otherSprintThreshold) : 4.15,
            JumpMode: gameInfo?.otherControllerSetting.otherJumpMode,
            JumpThreshold: gameInfo?.otherControllerSetting.otherJumpThreshold ? Number(gameInfo?.otherControllerSetting.otherJumpThreshold) : 5,
            EnableBothTriggerCalibration: true
          }
        },
        Sitting: {
          Quik: {
            VehicleHub: true,
            QuickDrive: true,
            VehicleMode: 0,
            VehicleSpeed: 1.7,
            RRSimulation: 1.0
          },
          Advanced: {
            VehicleHub: gameInfo?.sittingSetting.vehicleHub,
            QuickDrive: gameInfo?.sittingSetting.quickDriveMode,
            VehicleMode: gameInfo?.sittingSetting.vehicleMode,
            VehicleHubList: [
              {
                VehicleSpeed: 1.7,
                RRSimulation: 1.0
              },
              {
                VehicleSpeed: 1.1,
                RRSimulation: 1.0
              },
              {
                VehicleSpeed: 2.0,
                RRSimulation: 1.0
              },
              {
                VehicleSpeed: 1.2,
                RRSimulation: 1.0
              }
            ],
            VehicleSpeed: VehicleSpeed,
            RRSimulation: RRSimulation,
          }
        },
        HapticC2: {
          Quik: {
            HapticMoudleEanble: false,
            HapticModuleByVRControllerLevel: 5,
            HapticModuleByWalkLevel: 1,
          },
          Advanced: {
            HapticMoudleEanble: gameInfo?.hapticsSetting.hapticModuleVibration,
            HapticModuleByVRControllerLevel: gameInfo?.hapticsSetting.triggerByControllerVibration ? Number(gameInfo?.hapticsSetting.triggerByControllerVibration) : 5,
            HapticModuleByWalkLevel: gameInfo?.hapticsSetting.triggerBySteps ? Number(gameInfo?.hapticsSetting.triggerBySteps) : 1,
          }
        },
        OtherHaptic: {
          Quik: {
            HapticMoudleEanble: false,
            HapticModuleByVRControllerLevel: 5,
            HapticModuleByWalkLevel: 1,
            HapticModuleByWalkEnable: true,
            HapticModuleByLateralLevel: 2,
            HapticModuleByBackwardLevel: 2,
            HapticModuleByCruiseLevel: 2,
          },
          Advanced: {
            HapticMoudleEanble: gameInfo?.otherHapticsSetting.hapticModuleVibration,
            HapticModuleByVRControllerLevel: gameInfo?.otherHapticsSetting.triggerByControllerVibration ? Number(gameInfo?.otherHapticsSetting.triggerByControllerVibration) : 5,
            HapticModuleByWalkLevel: gameInfo?.hapticsSetting.triggerBySteps ? Number(gameInfo?.otherHapticsSetting.triggerBySteps) : 1,
            HapticModuleByWalkEnable: true,
            HapticModuleByLateralLevel: gameInfo?.otherHapticsSetting.triggerByLateralMovement ? Number(gameInfo?.otherHapticsSetting.triggerByLateralMovement) : 2,
            HapticModuleByBackwardLevel: gameInfo?.otherHapticsSetting.triggerByBackwardMovement ? Number(gameInfo?.otherHapticsSetting.triggerByBackwardMovement) : 2,
            HapticModuleByCruiseLevel: gameInfo?.otherHapticsSetting.triggerByCruiseMovement ? Number(gameInfo?.otherHapticsSetting.triggerByCruiseMovement) : 2,
          }
        },
        GlobalConfig: {
          LinearMapping: true,
          MappingController: 0,
          DirectionDatum: 0,
          ControlMethod: 0,
          ControlMethodTwo: 3,
          MappingSpeed: 1,
          SprintSource: 0,
          JumpSource: 26,
          FollowRecommendedSettings: true,
          WalkSpeedType: 0,
          DeadZone: 0,
          ActiveZone: 100,
          Curve: 0,
          MaxSpeedInGame: 3,
          Devices: {
            DetectedController: "No Controllers",
            RenameController: "No Controllers",
            DeviceName: "No Controllers",
            SerialNumber: ""
          }
        },
        Global_Data_List: [],
        Page: 0
      }
    } else {
      // VRCHAT OSC
      if (gameId === 43810011) {
        const gameName = 'VRCHAT OSC'

        const gameInfo = configurations.find((item) => parseInt(item.ID) === 438100)

        let VehicleSpeed = 1.7
        let RRSimulation = 1.0

        // 根据模式匹配对应设置
        switch (gameInfo.sittingSetting.vehicleMode) {
          case 0:
            VehicleSpeed = parseFloat(gameInfo?.sittingSetting.autoOptions.vehicleSpeed)
            RRSimulation = parseFloat(gameInfo?.sittingSetting.autoOptions.roadRoughnessSimulation)
            break
          case 1:
            VehicleSpeed = parseFloat(gameInfo?.sittingSetting.mountsOptions.vehicleSpeed)
            RRSimulation = parseFloat(gameInfo?.sittingSetting.mountsOptions.roadRoughnessSimulation)
            break
          case 2:
            VehicleSpeed = parseFloat(gameInfo?.sittingSetting.aircraftOptions.vehicleSpeed)
            RRSimulation = parseFloat(gameInfo?.sittingSetting.aircraftOptions.roadRoughnessSimulation)
            break
          case 3:
            VehicleSpeed = parseFloat(gameInfo?.sittingSetting.heavyVehiclesOptions.vehicleSpeed)
            RRSimulation = parseFloat(gameInfo?.sittingSetting.heavyVehiclesOptions.roadRoughnessSimulation)
            break
        }

        gameConfig = {
          ID: gameId,
          Name: gameName,
          Path: '',
          Exe: '',
          Installed: 0,
          KAT: 1,
          Config_Index: 0,
          QuickConfiguration: true,
          C2ControllerOptions: {
            Quik: {
              LeftHandedMode: false,
              WalkingSpeed: 1.0,
              WalkingAccuracy: 0,
              OrlginalTrackpad: 1,
              SensorSensitivity: 0, // Unintentional Movement 小动作屏蔽
              SprintMode: true,
              SprintThreshold: 10,
              JumpMode: true,
              JumpThreshold: 5,
              CruiseMode: false,
              CruiseModeSensitivity: 2.0,
              EnableBothTriggerCalibration: true
            },
            Advanced: {
              LeftHandedMode: gameInfo?.c2controllerSetting.leftHandedMode,
              WalkingSpeed: gameInfo?.c2controllerSetting.walkingSpeed ? Number(gameInfo?.c2controllerSetting.walkingSpeed) : 1.0,
              WalkingAccuracy: gameInfo?.c2controllerSetting.walkingAccuracy ? Number(gameInfo?.c2controllerSetting.walkingAccuracy) : 0,
              OrlginalTrackpad: gameInfo?.c2controllerSetting.originalTrackpadOrJoystick ? Number(gameInfo?.c2controllerSetting.originalTrackpadOrJoystick) : 1,
              SensorSensitivity: gameInfo?.c2controllerSetting.sensorSensitivity ? Number(gameInfo?.c2controllerSetting.sensorSensitivity) : 0,
              SprintMode: gameInfo?.c2controllerSetting.sprintMode,
              SprintThreshold: gameInfo?.c2controllerSetting.sprintThreshold ? Number(gameInfo?.c2controllerSetting.sprintThreshold) : 4.15,
              JumpMode: gameInfo?.c2controllerSetting.jumpMode,
              JumpThreshold: gameInfo?.c2controllerSetting.jumpThreshold ? Number(gameInfo?.c2controllerSetting.jumpThreshold) : 5,
              CruiseMode: gameInfo?.c2controllerSetting.cruiseMode,
              CruiseModeSensitivity: gameInfo?.c2controllerSetting.cruiseSpeed ? Number(gameInfo?.c2controllerSetting.cruiseModeSensitivity) : 2.0,
              EnableBothTriggerCalibration: true
            }
          },
          C3ControllerOptions: {
            Quik: {
              LeftHandedMode: false,
              WalkingSpeed: 1.0,
              WalkingAccuracy: 0,
              OrlginalTrackpad: 1,
              BackwardSpeed: 1.0,  // C 3
              SensorSensitivity: 0, // Unintentional Movement 小动作屏蔽
              SprintMode: true,
              SprintThreshold: 10,
              JumpMode: true,
              JumpThreshold: 5,
              CruiseMode: false,
              CruiseModeSensitivity: 2.0,
              EnableBothTriggerCalibration: true
            },
            Advanced: {
              LeftHandedMode: gameInfo?.c2controllerSetting.leftHandedMode,
              WalkingSpeed: gameInfo?.c2controllerSetting.walkingSpeed ? Number(gameInfo?.c2controllerSetting.walkingSpeed) : 1.0,
              WalkingAccuracy: gameInfo?.c2controllerSetting.walkingAccuracy ? Number(gameInfo?.c2controllerSetting.walkingAccuracy) : 0,
              OrlginalTrackpad: gameInfo?.c2controllerSetting.originalTrackpadOrJoystick ? Number(gameInfo?.c2controllerSetting.originalTrackpadOrJoystick) : 1,
              BackwardSpeed: 1.0, // C 3
              SensorSensitivity: gameInfo?.c2controllerSetting.sensorSensitivity ? Number(gameInfo?.c2controllerSetting.sensorSensitivity) : 0,
              SprintMode: gameInfo?.c2controllerSetting.sprintMode,
              SprintThreshold: gameInfo?.c2controllerSetting.sprintThreshold ? Number(gameInfo?.c2controllerSetting.sprintThreshold) : 4.15,
              JumpMode: gameInfo?.c2controllerSetting.jumpMode,
              JumpThreshold: gameInfo?.c2controllerSetting.jumpThreshold ? Number(gameInfo?.c2controllerSetting.jumpThreshold) : 5,
              CruiseMode: gameInfo?.c2controllerSetting.cruiseMode,
              CruiseModeSensitivity: gameInfo?.c2controllerSetting.cruiseSpeed ? Number(gameInfo?.c2controllerSetting.cruiseModeSensitivity) : 2.0,
              EnableBothTriggerCalibration: true
            }
          },
          OtherControllerOptions: {
            Quik: {
              LeftHandedMode: false,
              OrlginalTrackpad: 0,
              WalkingSpeed: 1.0,
              WalkingAccuracy: 0,
              LateralFun: false,
              LateralFunSensitivity: 0,
              BackFun: false,
              BackSensitivity: 0,
              CruiseFun: false,
              CruiseFunSensitivity: 0,
              SensorSensitivity: 0,
              SprintMode: false,
              SprintThreshold: 10,
              JumpMode: false,
              JumpThreshold: 5,
              EnableBothTriggerCalibration: true
            },
            Advanced: {
              LeftHandedMode: false,
              OrlginalTrackpad: gameInfo?.otherControllerSetting.otherOriginalTrackpadOrJoystick ? Number(gameInfo?.otherControllerSetting.otherOriginalTrackpadOrJoystick) : 0,
              WalkingSpeed: gameInfo?.otherControllerSetting.walkingSpeed ? Number(gameInfo?.otherControllerSetting.walkingSpeed) : 1.0,
              WalkingAccuracy: gameInfo?.otherControllerSetting.walkingAccuracy ? Number(gameInfo?.otherControllerSetting.walkingAccuracy) : 0,
              LateralFun: gameInfo?.otherControllerSetting.lateralOptions.lateralMovement,
              LateralFunSensitivity: gameInfo?.otherControllerSetting.lateralOptions.lateralTriggerSensitivity ? Number(gameInfo?.otherControllerSetting.lateralOptions.lateralTriggerSensitivity) : 0,
              BackFun: gameInfo?.otherControllerSetting.backwardMovementOptions.backwardMovement,
              BackSensitivity: gameInfo?.otherControllerSetting.backwardMovementOptions.backwardTriggerSensitivity ? Number(gameInfo?.otherControllerSetting.backwardMovementOptions.backwardTriggerSensitivity) : 0,
              CruiseFun: gameInfo?.otherControllerSetting.cruiseMovementOptions.cruiseMovement,
              CruiseFunSensitivity: gameInfo?.otherControllerSetting.cruiseMovementOptions.cruiseTriggerSensitivity ? Number(gameInfo?.otherControllerSetting.cruiseMovementOptions.cruiseTriggerSensitivity) : 0,
              SensorSensitivity: gameInfo?.otherControllerSetting.otherSensorSensitivity ? Number(gameInfo?.otherControllerSetting.otherSensorSensitivity) : 0,
              SprintMode: gameInfo?.otherControllerSetting.otherSprintMode,
              SprintThreshold: gameInfo?.otherControllerSetting.otherSprintThreshold ? Number(gameInfo?.otherControllerSetting.otherSprintThreshold) : 4.15,
              JumpMode: gameInfo?.otherControllerSetting.otherJumpMode,
              JumpThreshold: gameInfo?.otherControllerSetting.otherJumpThreshold ? Number(gameInfo?.otherControllerSetting.otherJumpThreshold) : 5,
              EnableBothTriggerCalibration: true
            }
          },
          Sitting: {
            Quik: {
              VehicleHub: true,
              QuickDrive: true,
              VehicleMode: 0,
              VehicleSpeed: 1.7,
              RRSimulation: 1.0
            },
            Advanced: {
              VehicleHub: gameInfo?.sittingSetting.vehicleHub,
              QuickDrive: gameInfo?.sittingSetting.quickDriveMode,
              VehicleMode: gameInfo?.sittingSetting.vehicleMode,
              VehicleHubList: [
                {
                  VehicleSpeed: 1.7,
                  RRSimulation: 1.0
                },
                {
                  VehicleSpeed: 1.1,
                  RRSimulation: 1.0
                },
                {
                  VehicleSpeed: 2.0,
                  RRSimulation: 1.0
                },
                {
                  VehicleSpeed: 1.2,
                  RRSimulation: 1.0
                }
              ],
              VehicleSpeed: VehicleSpeed,
              RRSimulation: RRSimulation,
            }
          },
          HapticC2: {
            Quik: {
              HapticMoudleEanble: false,
              HapticModuleByVRControllerLevel: 5,
              HapticModuleByWalkLevel: 1,
            },
            Advanced: {
              HapticMoudleEanble: gameInfo?.hapticsSetting.hapticModuleVibration,
              HapticModuleByVRControllerLevel: gameInfo?.hapticsSetting.triggerByControllerVibration ? Number(gameInfo?.hapticsSetting.triggerByControllerVibration) : 5,
              HapticModuleByWalkLevel: gameInfo?.hapticsSetting.triggerBySteps ? Number(gameInfo?.hapticsSetting.triggerBySteps) : 1,
            }
          },
          OtherHaptic: {
            Quik: {
              HapticMoudleEanble: false,
              HapticModuleByVRControllerLevel: 5,
              HapticModuleByWalkLevel: 1,
              HapticModuleByWalkEnable: true,
              HapticModuleByLateralLevel: 2,
              HapticModuleByBackwardLevel: 2,
              HapticModuleByCruiseLevel: 2,
            },
            Advanced: {
              HapticMoudleEanble: gameInfo?.otherHapticsSetting.hapticModuleVibration,
              HapticModuleByVRControllerLevel: gameInfo?.otherHapticsSetting.triggerByControllerVibration ? Number(gameInfo?.otherHapticsSetting.triggerByControllerVibration) : 5,
              HapticModuleByWalkLevel: gameInfo?.hapticsSetting.triggerBySteps ? Number(gameInfo?.otherHapticsSetting.triggerBySteps) : 1,
              HapticModuleByWalkEnable: true,
              HapticModuleByLateralLevel: gameInfo?.otherHapticsSetting.triggerByLateralMovement ? Number(gameInfo?.otherHapticsSetting.triggerByLateralMovement) : 2,
              HapticModuleByBackwardLevel: gameInfo?.otherHapticsSetting.triggerByBackwardMovement ? Number(gameInfo?.otherHapticsSetting.triggerByBackwardMovement) : 2,
              HapticModuleByCruiseLevel: gameInfo?.otherHapticsSetting.triggerByCruiseMovement ? Number(gameInfo?.otherHapticsSetting.triggerByCruiseMovement) : 2,
            }
          },
          GlobalConfig: {
            LinearMapping: true,
            MappingController: 0,
            DirectionDatum: 0,
            ControlMethod: 0,
            ControlMethodTwo: 3,
            MappingSpeed: 1,
            SprintSource: 0,
            JumpSource: 26,
            FollowRecommendedSettings: true,
            WalkSpeedType: 0,
            DeadZone: 0,
            ActiveZone: 100,
            Curve: 0,
            MaxSpeedInGame: 3,
            Devices: {
              DetectedController: "No Controllers",
              RenameController: "No Controllers",
              DeviceName: "No Controllers",
              SerialNumber: ""
            }
          },
          Global_Data_List: [],
          Page: 0
        }
      } else if (parseInt(gameId) === -1) {
        gameConfig = {
          ID: parseInt(gameId),
          Name: 'Default',
          Path: '',
          Exe: '',
          Installed: 0,
          KAT: 1,
          Config_Index: 0,
          QuickConfiguration: true,
          C2ControllerOptions: {
            Quik: {
              LeftHandedMode: false,
              WalkingSpeed: 1,
              WalkingAccuracy: 0,
              OrlginalTrackpad: 1,
              SensorSensitivity: 0,
              SprintMode: true,
              SprintThreshold: 10,
              JumpMode: true,
              JumpThreshold: 5,
              CruiseMode: false,
              CruiseModeSensitivity: 2,
              EnableBothTriggerCalibration: true
            },
            Advanced: {
              LeftHandedMode: false,
              WalkingSpeed: 1.0,
              WalkingAccuracy: 0,
              OrlginalTrackpad: 0,
              SensorSensitivity: 0,
              SprintMode: false,
              SprintThreshold: 4.15,
              JumpMode: false,
              JumpThreshold: 5,
              CruiseMode: false,
              CruiseModeSensitivity: 2.0,
              EnableBothTriggerCalibration: true
            }
          },
          C3ControllerOptions: {
            Quik: {
              LeftHandedMode: false,
              WalkingSpeed: 1,
              WalkingAccuracy: 0,
              OrlginalTrackpad: 1,
              BackwardSpeed: 1,
              SensorSensitivity: 0,
              SprintMode: true,
              SprintThreshold: 10,
              JumpMode: true,
              JumpThreshold: 5,
              CruiseMode: false,
              CruiseModeSensitivity: 2,
              EnableBothTriggerCalibration: true
            },
            Advanced: {
              LeftHandedMode: false,
              WalkingSpeed: 1.0,
              WalkingAccuracy: 0,
              OrlginalTrackpad: 0,
              BackwardSpeed: 1,
              SensorSensitivity: 0,
              SprintMode: false,
              SprintThreshold: 4.15,
              JumpMode: false,
              JumpThreshold: 5,
              CruiseMode: false,
              CruiseModeSensitivity: 2.0,
              EnableBothTriggerCalibration: true
            }
          },
          OtherControllerOptions: {
            Quik: {
              LeftHandedMode: false,
              OrlginalTrackpad: 0,
              WalkingSpeed: 1,
              WalkingAccuracy: 0,
              LateralFun: false,
              LateralFunSensitivity: 0,
              BackFun: false,
              BackSensitivity: 0,
              CruiseFun: false,
              CruiseFunSensitivity: 0,
              SensorSensitivity: 0,
              SprintMode: false,
              SprintThreshold: 10,
              JumpMode: false,
              JumpThreshold: 5,
              EnableBothTriggerCalibration: true
            },
            Advanced: {
              LeftHandedMode: false,
              OrlginalTrackpad: 0,
              LateralFun: false,
              LateralFunSensitivity: 0,
              BackFun: false,
              BackSensitivity: 0,
              CruiseFun: false,
              CruiseFunSensitivity: 0,
              SensorSensitivity: 0,
              SprintMode: false,
              SprintThreshold: 4.15,
              JumpMode: false,
              JumpThreshold: 5,
              EnableBothTriggerCalibration: true
            }
          },
          Sitting: {
            Quik: {
              VehicleHub: true,
              QuickDrive: true,
              VehicleMode: 0,
              VehicleSpeed: 1.7,
              RRSimulation: 1
            },
            Advanced: {
              VehicleHub: false,
              QuickDrive: true,
              VehicleMode: 0,
              VehicleHubList: [
                {
                  VehicleSpeed: 1.7,
                  RRSimulation: 1
                },
                {
                  VehicleSpeed: 1.1,
                  RRSimulation: 1
                },
                {
                  VehicleSpeed: 2,
                  RRSimulation: 1
                },
                {
                  VehicleSpeed: 1.2,
                  RRSimulation: 1
                }
              ],
              VehicleSpeed: 1.7,
              RRSimulation: 1
            }
          },
          HapticC2: {
            Quik: {
              HapticMoudleEanble: false,
              HapticModuleByVRControllerLevel: 5,
              HapticModuleByWalkLevel: 1
            },
            Advanced: {
              HapticMoudleEanble: false,
              HapticModuleByVRControllerLevel: 5,
              HapticModuleByWalkLevel: 1
            }
          },
          OtherHaptic: {
            Quik: {
              HapticMoudleEanble: false,
              HapticModuleByVRControllerLevel: 5,
              HapticModuleByWalkLevel: 1,
              HapticModuleByWalkEnable: true,
              HapticModuleByLateralLevel: 2,
              HapticModuleByBackwardLevel: 2,
              HapticModuleByCruiseLevel: 2
            },
            Advanced: {
              HapticMoudleEanble: false,
              HapticModuleByVRControllerLevel: 5,
              HapticModuleByWalkLevel: 1,
              HapticModuleByWalkEnable: true,
              HapticModuleByLateralLevel: 2,
              HapticModuleByBackwardLevel: 2,
              HapticModuleByCruiseLevel: 2
            }
          },
          GlobalConfig: {
            LinearMapping: true,
            MappingController: 0,
            DirectionDatum: 0,
            ControlMethod: 0,
            ControlMethodTwo: 3,
            MappingSpeed: 1,
            SprintSource: 0,
            JumpSource: 26,
            FollowRecommendedSettings: true,
            WalkSpeedType: 0,
            DeadZone: 0,
            ActiveZone: 100,
            Curve: 0,
            MaxSpeedInGame: 3,
            Devices: {
              DetectedController: "No Controllers",
              RenameController: "No Controllers",
              DeviceName: "No Controllers",
              SerialNumber: ""
            }
          },
          Global_Data_List: [],
          Page: 0
        }
      }
    }

    return await saveGameDefaultConfig(host, gameId, gameConfig)

  } catch (error) {
    console.log(error)
  }
}

const new_GatewayPath = 'Local/New_Gateway'
const profilePath = 'Profile'

// 保存默认配置文件
const saveGameDefaultConfig = async (host, gameId, configs) => {
  try {
    const folderPath = new_GatewayPath

    const gameInfo = await getGameConfig(gameId);
    const gameName = await sanitizedFolderName(host, gameInfo.Name);


    const fileName = `${profilePath}/${gameName}/Default.json`
    if (configs) {
      const data = JSON.stringify(configs)
      return await configWrite(host, folderPath, fileName, data)
    }
  } catch (error) {
    console.log(error)
  }
}

// 检查默认配置
export const checkGameDefaultConfig = async (host, gameId) => {
  try {
    const folderPath = new_GatewayPath

    c
    const fileName = `${profilePath}/${gameName}/Default.json`
    const data = await configRead(host, folderPath, fileName)
    if (data) {
      const res = JSON.parse(data)
      if (res.result && res.data) {
        return true
      } else {
        await initGameDefaultConfig(host, gameId);
      }
    } else {
      await initGameDefaultConfig(host, gameId);
    }
  } catch (error) {
    console.log(error)
  }
}

// 读取游戏默认配置文件
export const readGameDefaultConfig = async (host, gameId) => {
  try {
    const folderPath = new_GatewayPath
    const gameInfo = await getGameConfig(gameId);
    const gameName = await sanitizedFolderName(host, gameInfo.Name);

    const fileName = `${profilePath}/${gameName}/Default.json`
    const data = await configRead(host, folderPath, fileName)
    if (data) {
      const res = JSON.parse(data)
      if (res.result && res.data) {
        return JSON.parse(res.data)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// 扫描游戏，增加对应游戏及对应推荐配置
export const scanGames = async (host) => {
  // 读取推荐STEAM游戏列表
  try {
    const gameConfigs = await readGameConfigs(host)
    if (!gameConfigs) return [];

    const { result, data } = JSON.parse(gameConfigs);
    if (!result || !data) return [];

    const gameList = JSON.parse(data);
    if (!Array.isArray(gameList) || gameList.length === 0) return [];

    const statusPromises = gameList.map(async (game) => {
      const gameId = parseInt(game.ID);
      const isInstalled = await getGameInstalledStatus(host, gameId);

      return isInstalled ? { ID: gameId, Name: game.Name } : null;
    });

    const results = await Promise.all(statusPromises);
    const filteredGames = results.filter(game => game !== null);

    const findResult = filteredGames.find((item) => Number(item.ID) === 438100)

    if (findResult) {
      filteredGames.push({
        ID: 43810011,
        Name: 'VRCHATOSC'
      })
    }

    const gameLists = [];

    // 存储对应推荐设置参数
    for (const game of filteredGames) {
      const gameId = game.ID
      const gameName = game.Name

      const matchedGame = gameList.find(item => parseInt(item.ID) === gameId)
      if (matchedGame) {
        let VehicleSpeed = 1.7
        let RRSimulation = 1.0

        // 根据模式匹配对应设置
        switch (matchedGame.sittingSetting.vehicleMode) {
          case 0:
            VehicleSpeed = parseFloat(matchedGame?.sittingSetting.autoOptions.vehicleSpeed)
            RRSimulation = parseFloat(matchedGame?.sittingSetting.autoOptions.roadRoughnessSimulation)
            break
          case 1:
            VehicleSpeed = parseFloat(matchedGame?.sittingSetting.mountsOptions.vehicleSpeed)
            RRSimulation = parseFloat(matchedGame?.sittingSetting.mountsOptions.roadRoughnessSimulation)
            break
          case 2:
            VehicleSpeed = parseFloat(matchedGame?.sittingSetting.aircraftOptions.vehicleSpeed)
            RRSimulation = parseFloat(matchedGame?.sittingSetting.aircraftOptions.roadRoughnessSimulation)
            break
          case 3:
            VehicleSpeed = parseFloat(matchedGame?.sittingSetting.heavyVehiclesOptions.vehicleSpeed)
            RRSimulation = parseFloat(matchedGame?.sittingSetting.heavyVehiclesOptions.roadRoughnessSimulation)
            break
        }

        const gameConfig = {
          ID: gameId,
          Name: gameName,
          Installed: 0,
          KAT: 1,
          Config_Index: 0,
          QuickConfiguration: true,
          C2ControllerOptions: {
            Quik: {
              LeftHandedMode: false,
              WalkingSpeed: 1.0,
              WalkingAccuracy: 0,
              OrlginalTrackpad: 1,
              SensorSensitivity: 0, // Unintentional Movement 小动作屏蔽
              SprintMode: true,
              SprintThreshold: 10,
              JumpMode: true,
              JumpThreshold: 5,
              CruiseMode: false,
              CruiseModeSensitivity: 2.0,
              EnableBothTriggerCalibration: true
            },
            Advanced: {
              LeftHandedMode: matchedGame?.c2controllerSetting.leftHandedMode,
              WalkingSpeed: matchedGame?.c2controllerSetting.walkingSpeed ? Number(matchedGame?.c2controllerSetting.walkingSpeed) : 1.0,
              WalkingAccuracy: matchedGame?.c2controllerSetting.walkingAccuracy ? Number(matchedGame?.c2controllerSetting.walkingAccuracy) : 0,
              OrlginalTrackpad: matchedGame?.c2controllerSetting.originalTrackpadOrJoystick ? Number(matchedGame?.c2controllerSetting.originalTrackpadOrJoystick) : 1,
              SensorSensitivity: matchedGame?.c2controllerSetting.sensorSensitivity ? Number(matchedGame?.c2controllerSetting.sensorSensitivity) : 0,
              SprintMode: matchedGame?.c2controllerSetting.sprintMode,
              SprintThreshold: matchedGame?.c2controllerSetting.sprintThreshold ? Number(matchedGame?.c2controllerSetting.sprintThreshold) : 4.15,
              JumpMode: matchedGame?.c2controllerSetting.jumpMode,
              JumpThreshold: matchedGame?.c2controllerSetting.jumpThreshold ? Number(matchedGame?.c2controllerSetting.jumpThreshold) : 5,
              CruiseMode: matchedGame?.c2controllerSetting.cruiseMode,
              CruiseModeSensitivity: matchedGame?.c2controllerSetting.cruiseSpeed ? Number(matchedGame?.c2controllerSetting.cruiseModeSensitivity) : 2.0,
              EnableBothTriggerCalibration: true
            }
          },
          C3ControllerOptions: {
            Quik: {
              LeftHandedMode: false,
              WalkingSpeed: 1.0,
              WalkingAccuracy: 0,
              OrlginalTrackpad: 1,
              BackwardSpeed: 1.0,  // C 3
              SensorSensitivity: 0, // Unintentional Movement 小动作屏蔽
              SprintMode: true,
              SprintThreshold: 10,
              JumpMode: true,
              JumpThreshold: 5,
              CruiseMode: false,
              CruiseModeSensitivity: 2.0,
              EnableBothTriggerCalibration: true
            },
            Advanced: {
              LeftHandedMode: matchedGame?.c2controllerSetting.leftHandedMode,
              WalkingSpeed: matchedGame?.c2controllerSetting.walkingSpeed ? Number(matchedGame?.c2controllerSetting.walkingSpeed) : 1.0,
              WalkingAccuracy: matchedGame?.c2controllerSetting.walkingAccuracy ? Number(matchedGame?.c2controllerSetting.walkingAccuracy) : 0,
              OrlginalTrackpad: matchedGame?.c2controllerSetting.originalTrackpadOrJoystick ? Number(matchedGame?.c2controllerSetting.originalTrackpadOrJoystick) : 1,
              BackwardSpeed: 1.0, // C 3
              SensorSensitivity: matchedGame?.c2controllerSetting.sensorSensitivity ? Number(matchedGame?.c2controllerSetting.sensorSensitivity) : 0,
              SprintMode: matchedGame?.c2controllerSetting.sprintMode,
              SprintThreshold: matchedGame?.c2controllerSetting.sprintThreshold ? Number(matchedGame?.c2controllerSetting.sprintThreshold) : 4.15,
              JumpMode: matchedGame?.c2controllerSetting.jumpMode,
              JumpThreshold: matchedGame?.c2controllerSetting.jumpThreshold ? Number(matchedGame?.c2controllerSetting.jumpThreshold) : 5,
              CruiseMode: matchedGame?.c2controllerSetting.cruiseMode,
              CruiseModeSensitivity: matchedGame?.c2controllerSetting.cruiseSpeed ? Number(matchedGame?.c2controllerSetting.cruiseModeSensitivity) : 2.0,
              EnableBothTriggerCalibration: true
            }
          },
          OtherControllerOptions: {
            Quik: {
              LeftHandedMode: false,
              OrlginalTrackpad: 0,
              WalkingSpeed: 1.0,
              WalkingAccuracy: 0,
              LateralFun: false,
              LateralFunSensitivity: 0,
              BackFun: false,
              BackSensitivity: 0,
              CruiseFun: false,
              CruiseFunSensitivity: 0,
              SensorSensitivity: 0,
              SprintMode: false,
              SprintThreshold: 4.15,
              JumpMode: false,
              JumpThreshold: 5,
              EnableBothTriggerCalibration: true
            },
            Advanced: {
              LeftHandedMode: false,
              OrlginalTrackpad: matchedGame?.otherControllerSetting.otherOriginalTrackpadOrJoystick ? Number(matchedGame?.otherControllerSetting.otherOriginalTrackpadOrJoystick) : 0,
              WalkingSpeed: matchedGame?.otherControllerSetting.walkingSpeed ? Number(matchedGame?.otherControllerSetting.walkingSpeed) : 1.0,
              WalkingAccuracy: matchedGame?.otherControllerSetting.walkingAccuracy ? Number(matchedGame?.otherControllerSetting.walkingAccuracy) : 0,
              LateralFun: matchedGame?.otherControllerSetting.lateralOptions.lateralMovement,
              LateralFunSensitivity: matchedGame?.otherControllerSetting.lateralOptions.lateralTriggerSensitivity ? Number(matchedGame?.otherControllerSetting.lateralOptions.lateralTriggerSensitivity) : 0,
              BackFun: matchedGame?.otherControllerSetting.backwardMovementOptions.backwardMovement,
              BackSensitivity: matchedGame?.otherControllerSetting.backwardMovementOptions.backwardTriggerSensitivity ? Number(matchedGame?.otherControllerSetting.backwardMovementOptions.backwardTriggerSensitivity) : 0,
              CruiseFun: matchedGame?.otherControllerSetting.cruiseMovementOptions.cruiseMovement,
              CruiseFunSensitivity: matchedGame?.otherControllerSetting.cruiseMovementOptions.cruiseTriggerSensitivity ? Number(matchedGame?.otherControllerSetting.cruiseMovementOptions.cruiseTriggerSensitivity) : 0,
              SensorSensitivity: matchedGame?.otherControllerSetting.otherSensorSensitivity ? Number(matchedGame?.otherControllerSetting.otherSensorSensitivity) : 0,
              SprintMode: matchedGame?.otherControllerSetting.otherSprintMode,
              SprintThreshold: matchedGame?.otherControllerSetting.otherSprintThreshold ? Number(matchedGame?.otherControllerSetting.otherSprintThreshold) : 4.15,
              JumpMode: matchedGame?.otherControllerSetting.otherJumpMode,
              JumpThreshold: matchedGame?.otherControllerSetting.otherJumpThreshold ? Number(matchedGame?.otherControllerSetting.otherJumpThreshold) : 5,
              EnableBothTriggerCalibration: true
            }
          },
          Sitting: {
            Quik: {
              VehicleHub: true,
              QuickDrive: true,
              VehicleMode: 0,
              VehicleSpeed: 1.7,
              RRSimulation: 1.0
            },
            Advanced: {
              VehicleHub: matchedGame?.sittingSetting.vehicleHub,
              QuickDrive: matchedGame?.sittingSetting.quickDriveMode,
              VehicleMode: matchedGame?.sittingSetting.vehicleMode,
              VehicleHubList: [
                {
                  VehicleSpeed: 1.7,
                  RRSimulation: 1.0
                },
                {
                  VehicleSpeed: 1.1,
                  RRSimulation: 1.0
                },
                {
                  VehicleSpeed: 2.0,
                  RRSimulation: 1.0
                },
                {
                  VehicleSpeed: 1.2,
                  RRSimulation: 1.0
                }
              ],
              VehicleSpeed: VehicleSpeed,
              RRSimulation: RRSimulation,
            }
          },
          HapticC2: {
            Quik: {
              HapticMoudleEanble: false,
              HapticModuleByVRControllerLevel: 5,
              HapticModuleByWalkLevel: 1,
            },
            Advanced: {
              HapticMoudleEanble: matchedGame?.hapticsSetting.hapticModuleVibration,
              HapticModuleByVRControllerLevel: matchedGame?.hapticsSetting.triggerByControllerVibration ? Number(matchedGame?.hapticsSetting.triggerByControllerVibration) : 5,
              HapticModuleByWalkLevel: matchedGame?.hapticsSetting.triggerBySteps ? Number(matchedGame?.hapticsSetting.triggerBySteps) : 1,
            }
          },
          OtherHaptic: {
            Quik: {
              HapticMoudleEanble: false,
              HapticModuleByVRControllerLevel: 5,
              HapticModuleByWalkLevel: 1,
              HapticModuleByWalkEnable: true,
              HapticModuleByLateralLevel: 2,
              HapticModuleByBackwardLevel: 2,
              HapticModuleByCruiseLevel: 2,
            },
            Advanced: {
              HapticMoudleEanble: matchedGame?.otherHapticsSetting.hapticModuleVibration,
              HapticModuleByVRControllerLevel: matchedGame?.otherHapticsSetting.triggerByControllerVibration ? Number(matchedGame?.otherHapticsSetting.triggerByControllerVibration) : 5,
              HapticModuleByWalkLevel: matchedGame?.otherHapticsSetting.triggerBySteps ? Number(matchedGame?.otherHapticsSetting.triggerBySteps) : 1,
              HapticModuleByWalkEnable: true,
              HapticModuleByLateralLevel: matchedGame?.otherHapticsSetting.triggerByLateralMovement ? Number(matchedGame?.otherHapticsSetting.triggerByLateralMovement) : 2,
              HapticModuleByBackwardLevel: matchedGame?.otherHapticsSetting.triggerByBackwardMovement ? Number(matchedGame?.otherHapticsSetting.triggerByBackwardMovement) : 2,
              HapticModuleByCruiseLevel: matchedGame?.otherHapticsSetting.triggerByCruiseMovement ? Number(matchedGame?.otherHapticsSetting.triggerByCruiseMovement) : 2,
            }
          },
          HudConfig: {
            // 全部总开关
            hudDistanceVisible: true,
            // z轴远近 [2.00,10.00]  默认2
            hudDistanceZ: 2.0,
            // 背景是不是透明 =true为透明
            isHudTransparent: false,
            // 相机的z轴远近  固定传-980
            cameraZ: -980,
            // Heart Rate总开关，默认true
            heartRateVisible: true,
            // Heart Rate显示的x坐标，以左上为原点，默认值0.0333333351之前的后面可根据效果自行更改
            heartRateX: 0.03,
            // Heart Rate显示的y坐标，以左上为原点，默认值0.0466666669之前的后面可根据效果自行更改
            heartRateY: 0.04,
            // heartRatings显示，默认true，对应Heart Rate显示与否
            heartRatingVisible: true,
            // 默认true，对应 Fitness Zone显示与否
            stateofSportsVisible: true,
            // Heart Rate 字体大小倍率，默认1 范围[0.40,2.00] --> add 0.1
            heartRateSize: 1.0,
            // Fitness Data总开关 默认true
            fitnessDataVisible: true,
            // Fitness Data显示的x坐标，以左上为原点 默认值0.728888869
            fitnessDataX: 0.52,
            // Fitness Data显示的y坐标，以左上为原点 默认值0.111111112
            fitnessDataY: 0.26,
            // walking是否显示 默认true 对应walking
            walkingVisible: true,
            // mileage是否显示 默认 true 对应 mileage
            mileageVisible: true,
            // consume是否显示  默认 true 对应 consume
            consumeVisible: true,
            // sportsTime是否显示 默认true 对应 active time 
            sportsTimeVisible: true,
            // Fitness Data 字体大小倍率  [0.40,2.00] 默认1.0
            fitnessDataSize: 1.0,
            // Device Direction 开关 默认true
            deviceDirectionVisible: true,
            // Device Direction显示的x坐标，以左上为原点  默认值0.0333333351
            deviceDirectionX: 0.03,
            // Device Direction显示的y坐标，以左上为原点  默认值0.126666665
            deviceDirectionY: 0.20,
            // Device Direction 字体大小倍率  [0.40,2.00] 默认1.0
            deviceDirectionSize: 1.0,
            // Device Status总开关 默认true
            deviceStatusVisible: true,
            // Device Status显示的x坐标，以左上为原点  默认0.728888869
            deviceStatusX: 0.52,
            // Device Status显示的y坐标，以左上为原点  默认0.311111122
            deviceStatusY: 0.66,
            // armband是否显示 默认true 对应VR Armband
            armbandVisible: true,
            // direction是否显示 默认 true 对应Direction Sensor
            directionVisible: true,
            // leftFoot是否显示 默认 true 对应Foot Sensor 由一个按钮控制
            leftFootVisible: true,
            // rightFoot是否显示 默认 true 对应Foot Sensor
            rightFootVisible: true,
            // Device Status 字体大小倍率 默认1.0 [0.40,2.00]
            deviceStatusSize: 1.0,
            // 心率
            heartRate: 0,
            // No=0 没插入设备，没有通讯数据时为0, Warm Up=1 心率小于等于108时传1,Fat Burning=2 心率小于等于126大于108时传2,Aerobic=3 心率大于126小于等于144时传3,Anaerobic=4 心率大于144小于等于162时传4,Extreme=5 心率大于162时传5
            heartRateType: 0,
            // 步数
            steps: 0,
            // 路程 m
            duration: 0.0,
            // 卡路里 Kcal
            calories: 0.0,
            // 时间 分钟
            times: 0,
            // 头显角度
            hmdAngle: 0,
            // 方向角度
            sensorAngle: 0,
            // 臂带
            armbandData: {
              // 连接状态
              connectionState: 0,
              // 电量
              battery: 0,
              // 充电状态
              isBatteryCharging: 0
            },
            // 方向传感器
            sensorData: {
              connectionState: 0,
              battery: 0,
              isBatteryCharging: 0
            },
            // 左脚传感器
            leftFootData: {
              connectionState: 0,
              battery: 0,
              isBatteryCharging: 0
            },
            // 右脚传感器
            rightFootData: {
              connectionState: 0,
              battery: 0,
              isBatteryCharging: 0
            },
            // heartRate 透明度[0,1]
            heartRateOpacity: 1.0,
            // fitnessData透明度[0,1]
            fitnessDataOpacity: 1.0,
            // deviceDirection 透明度[0,1]
            deviceDirectionOpacity: 1.0,
            // deviceStatus 透明度[0,1]
            deviceStatusOpacity: 1.0,
            // 当日排行榜 为0时显示
            todaysRank: 0,
            // Today's Rank总开关 默认true
            todaysRankVisible: true,
            // 默认0.0333333351
            todaysRankX: 0.03,
            // 默认0.36
            todaysRankY: 0.66,
            // Today's Rank 字体大小倍率 [0.40,2.00] 默认1
            todaysRankSize: 1.0,
            // todaysRank透明度[0,1] 默认1
            todaysRankOpacity: 1.0,
            // updateFrequency文本是否显示 默认true
            updateFrequencyTextVisible: true,
            // Current Time总开关
            currentTimeVisible: true,
            // CurrentTime显示的x坐标，默认0.728888869
            currentTimeX: 0.52,
            // CurrentTime显示Y坐标，默认0.0466666669
            currentTimeY: 0.04,
            // Current Time 字体大小倍率，[0.40,2.00] 默认1
            currentTimeSize: 1.0,
            // Current Time透明度[0,1] 默认1
            currentTimeOpacity: 1.0,
            // 0--> MM/DD/YYYY06/20/2025  1-->DD/MM/YYYY20/06/2025 2-->YYYY/MM/DD2025/06/20  3-->Hidden不显示日期
            currentTimeDate: 0,
            // 0-->AM/PM Time06:00 PM 1-->  HH:MM18:00  2-->Hidden不显示日期
            currentTimeTime: 0
          },
          ArmviewConfig: {
            // 全部总开关 默认 true
            armViewDistanceVisible: true,
            // true为左手 false为右手  默认true
            armViewDisplayArm: true,
            // 字体大小 size [0.325,0.775] 默认0.5 add 0.05
            armViewSize: 0.5,
            // 高度 floats height 传[0.05,-0.05]  左边是大  默认0
            armviewHeight: 0.0,
            // 透明度opacity [0.4,1] 默认1
            armviewOpacity: 1,
            // 显示距离 Z  Vanish Distance  默认1  [0.25,1]
            armviewDisplayDistance: 1,
            // x的坐标 以正方形圆点为中心   Gateway面板的长宽为445, 223，拖动的显示1.0大小为100, 75  默认-0.10157913
            armviewX: 0.23,
            // y的坐标 以正方形圆点为中心  默认-0.101970375
            armviewY: 0.10,
            // Heart Rate总开关 默认true
            armviewHeartRateVisible: true,
            // 红心开关 默认ture
            armviewHeartRatingVisible: true,
            // 运动图标开关  默认ture
            armviewStateofSportsVisible: true,
            // Fitness Data总开关  默认ture
            armviewFitnessDataVisible: true,
            // walking显示开关 默认ture
            armviewWalkingVisible: true,
            // mileage显示开关 默认ture
            armviewMileageVisible: true,
            // Consume显示开关 默认ture
            armviewConsumeVisible: true,
            // ActiveTime显示开关 默认ture
            armviewActiveTimeVisible: true,
            // Device Direction 开关 默认ture
            armviewDeviceDirectionVisible: true,
            // Device Status总开关 默认ture
            armviewDeviceStatusVisible: true,
            // vr armband显示开关 默认ture
            armviewArmbandVisible: true,
            // Direction显示开关 默认ture
            armviewDirectionVisible: true,
            // 左脚显示开关 默认ture
            armviewLeftFootVisible: true,
            // 右脚显示开关 默认ture
            armviewRightFootVisible: true,
            // Today's Rank总开关 默认ture
            armviewTodysRankVisible: true,
            // 文本是否显示 默认ture
            armviewUpdateFrequencyText: true,
            // Today's Rank总开关 默认ture
            armviewCurrentTimeVisible: true,
            // MM/dd/yyyy 06/20/2025  1-->dd/MM/yyyy 20/06/2025 2-->yyyy/MM/dd 2025/06/20  3-->Hidden不显示日期
            armviewCurrentTimeDate: 0,
            // 0-->AM/PM Time06:00 PM 1-->  HH:mm 18:00  2-->Hidden不显示日期
            armviewCurrentTimeTime: 0,
            // 心率
            heartRate: 0,
            // No=0, Warm Up=1,Fat Burning=2,Aerobic=3,Anaerobic=4,Extreme=5
            heartRateType: 0,
            // 步数 
            steps: 0,
            // 路程 m
            duration: 0.0,
            // 卡路里 Kcal
            calories: 0.0,
            // 时间 分钟
            times: 0,
            // 头显角度
            hmdAngle: 0.0,
            // 方向角度
            sensorAngle: 0.0,
            // 臂带
            armbandData: {
              connectionState: 0,
              battery: 0,
              isBatteryCharging: 0
            },
            // 方向传感器
            sensorData: {
              connectionState: 0,
              battery: 0,
              isBatteryCharging: 0
            },
            // 左脚传感器
            leftFootData: {
              connectionState: 0,
              battery: 0,
              isBatteryCharging: 0
            },
            // 右脚传感器
            rightFootData: {
              connectionState: 0,
              battery: 0,
              isBatteryCharging: 0
            },
            // 排名
            todaysRank: 0,
            // 透明度 background opacity [0.00,1.00] 默认1
            panelOpacity: 1.0,
            // 背景板是否显示，传false
            isDisplayDistance: false,
            // 左右手柄平面对应的欧拉角 传6
            xEuler_left: 6,
            // 传 272
            yEuler_left: 272,
            // 传 312
            zEuler_left: 312,
            // 传 174
            xEuler_right: 174,
            // 传 272
            yEuler_right: 272,
            // 传 -132
            zEuler_right: -132,
            // 旋转角度 rotate[-2250, -4050],默认-3600 左右对称，然后，当armViewDisplayArm为true时，传overlayRotAngle为false时，传-overlayRotAngle
            overlayRotAngle: -360
          },
          GlobalConfig: {
            LinearMapping: true,
            MappingController: matchedGame?.KAT_Config_No.Mapping_Controller,
            DirectionDatum: matchedGame?.KAT_Config_No.Direction_Source,
            ControlMethod: 0,
            ControlMethodTwo: matchedGame?.KAT_Config_No.Walk_Source,
            MappingSpeed: 0,
            SprintSource: matchedGame?.KAT_Config_No.Run_Source,
            JumpSource: matchedGame?.KAT_Config_No.Jump_Source,
            FollowRecommendedSettings: true,
            WalkSpeedType: matchedGame?.KAT_Config_No.Walk_Speed_Type,
            DeadZone: matchedGame?.KAT_Config_No.Dead_Zone,
            ActiveZone: matchedGame?.KAT_Config_No.Active_Zone,
            Curve: matchedGame?.KAT_Config_No.Curve,
            MaxSpeedInGame: matchedGame?.KAT_Config_No.Max_Speed_In_Game,
            Devices: {
              DetectedController: "No Controllers",
              RenameController: "No Controllers",
              DeviceName: "No Controllers",
              SerialNumber: ""
            }
          },
          Global_Data_List: [{
            LinearMapping: true,
            MappingController: matchedGame?.KAT_Config_No.Mapping_Controller,
            DirectionDatum: matchedGame?.KAT_Config_No.Direction_Source,
            ControlMethod: 0,
            ControlMethodTwo: matchedGame?.KAT_Config_No.Walk_Source,
            MappingSpeed: 0,
            SprintSource: matchedGame?.KAT_Config_No.Run_Source,
            JumpSource: matchedGame?.KAT_Config_No.Jump_Source,
            FollowRecommendedSettings: true,
            WalkSpeedType: matchedGame?.KAT_Config_No.Walk_Speed_Type,
            DeadZone: matchedGame?.KAT_Config_No.Dead_Zone,
            ActiveZone: matchedGame?.KAT_Config_No.Active_Zone,
            Curve: matchedGame?.KAT_Config_No.Curve,
            MaxSpeedInGame: matchedGame?.KAT_Config_No.Max_Speed_In_Game,
            Devices: {
              DetectedController: "No Controllers",
              RenameController: "No Controllers",
              DeviceName: "No Controllers",
              SerialNumber: ""
            }
          }],
          Page: 0
        }

        gameLists.push(gameConfig)

        // 生成默认配置
        writeDefaultGameConfigFile(host, gameConfig)

      } else {
        // VRCHAT OSC特殊处理
        if (gameId === 43810011) {
          let VehicleSpeed = 1.7
          let RRSimulation = 1.0

          const matchedGame = gameList.find(item => parseInt(item.ID) === 438100)

          // 根据模式匹配对应设置
          switch (matchedGame.sittingSetting.vehicleMode) {
            case 0:
              VehicleSpeed = parseFloat(matchedGame?.sittingSetting.autoOptions.vehicleSpeed)
              RRSimulation = parseFloat(matchedGame?.sittingSetting.autoOptions.roadRoughnessSimulation)
              break
            case 1:
              VehicleSpeed = parseFloat(matchedGame?.sittingSetting.mountsOptions.vehicleSpeed)
              RRSimulation = parseFloat(matchedGame?.sittingSetting.mountsOptions.roadRoughnessSimulation)
              break
            case 2:
              VehicleSpeed = parseFloat(matchedGame?.sittingSetting.aircraftOptions.vehicleSpeed)
              RRSimulation = parseFloat(matchedGame?.sittingSetting.aircraftOptions.roadRoughnessSimulation)
              break
            case 3:
              VehicleSpeed = parseFloat(matchedGame?.sittingSetting.heavyVehiclesOptions.vehicleSpeed)
              RRSimulation = parseFloat(matchedGame?.sittingSetting.heavyVehiclesOptions.roadRoughnessSimulation)
              break
          }

          const gameConfig = {
            ID: gameId,
            Name: gameName,
            Installed: 0,
            KAT: 1,
            Config_Index: 0,
            QuickConfiguration: true,
            C2ControllerOptions: {
              Quik: {
                LeftHandedMode: false,
                WalkingSpeed: 1.0,
                WalkingAccuracy: 0,
                OrlginalTrackpad: 1,
                SensorSensitivity: 0, // Unintentional Movement 小动作屏蔽
                SprintMode: true,
                SprintThreshold: 10,
                JumpMode: true,
                JumpThreshold: 5,
                CruiseMode: false,
                CruiseModeSensitivity: 2.0,
                EnableBothTriggerCalibration: true
              },
              Advanced: {
                LeftHandedMode: matchedGame?.c2controllerSetting.leftHandedMode,
                WalkingSpeed: matchedGame?.c2controllerSetting.walkingSpeed,
                WalkingAccuracy: matchedGame?.c2controllerSetting.walkingAccuracy,
                OrlginalTrackpad: matchedGame?.c2controllerSetting.originalTrackpadOrJoystick,
                SensorSensitivity: matchedGame?.c2controllerSetting.sensorSensitivity,
                SprintMode: matchedGame?.c2controllerSetting.sprintMode,
                SprintThreshold: matchedGame?.c2controllerSetting.sprintThreshold,
                JumpMode: matchedGame?.c2controllerSetting.jumpMode,
                JumpThreshold: matchedGame?.c2controllerSetting.jumpThreshold,
                CruiseMode: matchedGame?.c2controllerSetting.cruiseMode,
                CruiseModeSensitivity: matchedGame?.c2controllerSetting.cruiseSpeed,
                EnableBothTriggerCalibration: true
              }
            },
            C3ControllerOptions: {
              Quik: {
                LeftHandedMode: false,
                WalkingSpeed: 1.0,
                WalkingAccuracy: 0,
                OrlginalTrackpad: 1,
                BackwardSpeed: 1.0,  // C 3
                SensorSensitivity: 0, // Unintentional Movement 小动作屏蔽
                SprintMode: true,
                SprintThreshold: 10,
                JumpMode: true,
                JumpThreshold: 5,
                CruiseMode: false,
                CruiseModeSensitivity: 2.0,
                EnableBothTriggerCalibration: true
              },
              Advanced: {
                LeftHandedMode: matchedGame?.c2controllerSetting.leftHandedMode,
                WalkingSpeed: matchedGame?.c2controllerSetting.walkingSpeed,
                WalkingAccuracy: matchedGame?.c2controllerSetting.walkingAccuracy,
                OrlginalTrackpad: matchedGame?.c2controllerSetting.originalTrackpadOrJoystick,
                BackwardSpeed: 1.0, // C 3
                SensorSensitivity: matchedGame?.c2controllerSetting.sensorSensitivity,
                SprintMode: matchedGame?.c2controllerSetting.sprintMode,
                SprintThreshold: matchedGame?.c2controllerSetting.sprintThreshold,
                JumpMode: matchedGame?.c2controllerSetting.jumpMode,
                JumpThreshold: matchedGame?.c2controllerSetting.jumpThreshold,
                CruiseMode: matchedGame?.c2controllerSetting.cruiseMode,
                CruiseModeSensitivity: matchedGame?.c2controllerSetting.cruiseSpeed,
                EnableBothTriggerCalibration: true
              }
            },
            OtherControllerOptions: {
              Quik: {
                LeftHandedMode: false,
                OrlginalTrackpad: 0,
                WalkingSpeed: 1.0,
                WalkingAccuracy: 0,
                LateralFun: false,
                LateralFunSensitivity: 0,
                BackFun: false,
                BackSensitivity: 0,
                CruiseFun: false,
                CruiseFunSensitivity: 0,
                SensorSensitivity: 0,
                SprintMode: false,
                SprintThreshold: 10,
                JumpMode: false,
                JumpThreshold: 5,
                EnableBothTriggerCalibration: true
              },
              Advanced: {
                LeftHandedMode: false,
                OrlginalTrackpad: matchedGame?.otherControllerSetting.otherOriginalTrackpadOrJoystick,
                WalkingSpeed: matchedGame?.otherControllerSetting.walkingSpeed,
                WalkingAccuracy: matchedGame?.otherControllerSetting.walkingAccuracy,
                LateralFun: matchedGame?.otherControllerSetting.lateralOptions.lateralMovement,
                LateralFunSensitivity: matchedGame?.otherControllerSetting.lateralOptions.lateralTriggerSensitivity,
                BackFun: matchedGame?.otherControllerSetting.backwardMovementOptions.backwardMovement,
                BackSensitivity: matchedGame?.otherControllerSetting.backwardMovementOptions.backwardTriggerSensitivity,
                CruiseFun: matchedGame?.otherControllerSetting.cruiseMovementOptions.cruiseMovement,
                CruiseFunSensitivity: matchedGame?.otherControllerSetting.cruiseMovementOptions.cruiseTriggerSensitivity,
                SensorSensitivity: matchedGame?.otherControllerSetting.otherSensorSensitivity,
                SprintMode: matchedGame?.otherControllerSetting.otherSprintMode,
                SprintThreshold: matchedGame?.otherControllerSetting.otherSprintThreshold,
                JumpMode: matchedGame?.otherControllerSetting.otherJumpMode,
                JumpThreshold: matchedGame?.otherControllerSetting.otherJumpThreshold,
                EnableBothTriggerCalibration: true
              }
            },
            Sitting: {
              Quik: {
                VehicleHub: true,
                QuickDrive: true,
                VehicleMode: 0,
                VehicleSpeed: 1.7,
                RRSimulation: 1.0
              },
              Advanced: {
                VehicleHub: matchedGame?.sittingSetting.vehicleHub,
                QuickDrive: matchedGame?.sittingSetting.quickDriveMode,
                VehicleMode: matchedGame?.sittingSetting.vehicleMode,
                VehicleHubList: [
                  {
                    VehicleSpeed: 1.7,
                    RRSimulation: 1.0
                  },
                  {
                    VehicleSpeed: 1.1,
                    RRSimulation: 1.0
                  },
                  {
                    VehicleSpeed: 2.0,
                    RRSimulation: 1.0
                  },
                  {
                    VehicleSpeed: 1.2,
                    RRSimulation: 1.0
                  }
                ],
                VehicleSpeed: VehicleSpeed,
                RRSimulation: RRSimulation,
              }
            },
            HapticC2: {
              Quik: {
                HapticMoudleEanble: false,
                HapticModuleByVRControllerLevel: 5,
                HapticModuleByWalkLevel: 1,
              },
              Advanced: {
                HapticMoudleEanble: matchedGame?.hapticsSetting.hapticModuleVibration,
                HapticModuleByVRControllerLevel: matchedGame?.hapticsSetting.triggerByControllerVibration ? Number(matchedGame?.hapticsSetting.triggerByControllerVibration) : 5,
                HapticModuleByWalkLevel: matchedGame?.hapticsSetting.triggerBySteps ? Number(matchedGame?.hapticsSetting.triggerBySteps) : 1,
              }
            },
            OtherHaptic: {
              Quik: {
                HapticMoudleEanble: false,
                HapticModuleByVRControllerLevel: 5,
                HapticModuleByWalkLevel: 1,
                HapticModuleByWalkEnable: true,
                HapticModuleByLateralLevel: 2,
                HapticModuleByBackwardLevel: 2,
                HapticModuleByCruiseLevel: 2,
              },
              Advanced: {
                HapticMoudleEanble: matchedGame?.otherHapticsSetting.hapticModuleVibration,
                HapticModuleByVRControllerLevel: matchedGame?.otherHapticsSetting.triggerByControllerVibration ? Number(matchedGame?.otherHapticsSetting.triggerByControllerVibration) : 5,
                HapticModuleByWalkLevel: matchedGame?.otherHapticsSetting.triggerBySteps ? Number(matchedGame?.otherHapticsSetting.triggerBySteps) : 1,
                HapticModuleByWalkEnable: true,
                HapticModuleByLateralLevel: matchedGame?.otherHapticsSetting.triggerByLateralMovement ? Number(matchedGame?.otherHapticsSetting.triggerByLateralMovement) : 2,
                HapticModuleByBackwardLevel: matchedGame?.otherHapticsSetting.triggerByBackwardMovement ? Number(matchedGame?.otherHapticsSetting.triggerByBackwardMovement) : 2,
                HapticModuleByCruiseLevel: matchedGame?.otherHapticsSetting.triggerByCruiseMovement ? Number(matchedGame?.otherHapticsSetting.triggerByCruiseMovement) : 2,
              }
            },
            HudConfig: {
              // 全部总开关
              hudDistanceVisible: true,
              // z轴远近 [2.00,10.00]  默认2
              hudDistanceZ: 2.0,
              // 背景是不是透明 =true为透明
              isHudTransparent: false,
              // 相机的z轴远近  固定传-980
              cameraZ: -980,
              // Heart Rate总开关，默认true
              heartRateVisible: true,
              // Heart Rate显示的x坐标，以左上为原点，默认值0.0333333351之前的后面可根据效果自行更改
              heartRateX: 0.03,
              // Heart Rate显示的y坐标，以左上为原点，默认值0.0466666669之前的后面可根据效果自行更改
              heartRateY: 0.04,
              // heartRatings显示，默认true，对应Heart Rate显示与否
              heartRatingVisible: true,
              // 默认true，对应 Fitness Zone显示与否
              stateofSportsVisible: true,
              // Heart Rate 字体大小倍率，默认1 范围[0.40,2.00] --> add 0.1
              heartRateSize: 1.0,
              // Fitness Data总开关 默认true
              fitnessDataVisible: true,
              // Fitness Data显示的x坐标，以左上为原点 默认值0.728888869
              fitnessDataX: 0.52,
              // Fitness Data显示的y坐标，以左上为原点 默认值0.111111112
              fitnessDataY: 0.26,
              // walking是否显示 默认true 对应walking
              walkingVisible: true,
              // mileage是否显示 默认 true 对应 mileage
              mileageVisible: true,
              // consume是否显示  默认 true 对应 consume
              consumeVisible: true,
              // sportsTime是否显示 默认true 对应 active time 
              sportsTimeVisible: true,
              // Fitness Data 字体大小倍率  [0.40,2.00] 默认1.0
              fitnessDataSize: 1.0,
              // Device Direction 开关 默认true
              deviceDirectionVisible: true,
              // Device Direction显示的x坐标，以左上为原点  默认值0.0333333351
              deviceDirectionX: 0.03,
              // Device Direction显示的y坐标，以左上为原点  默认值0.126666665
              deviceDirectionY: 0.20,
              // Device Direction 字体大小倍率  [0.40,2.00] 默认1.0
              deviceDirectionSize: 1.0,
              // Device Status总开关 默认true
              deviceStatusVisible: true,
              // Device Status显示的x坐标，以左上为原点  默认0.728888869
              deviceStatusX: 0.52,
              // Device Status显示的y坐标，以左上为原点  默认0.311111122
              deviceStatusY: 0.66,
              // armband是否显示 默认true 对应VR Armband
              armbandVisible: true,
              // direction是否显示 默认 true 对应Direction Sensor
              directionVisible: true,
              // leftFoot是否显示 默认 true 对应Foot Sensor 由一个按钮控制
              leftFootVisible: true,
              // rightFoot是否显示 默认 true 对应Foot Sensor
              rightFootVisible: true,
              // Device Status 字体大小倍率 默认1.0 [0.40,2.00]
              deviceStatusSize: 1.0,
              // 心率
              heartRate: 0,
              // No=0 没插入设备，没有通讯数据时为0, Warm Up=1 心率小于等于108时传1,Fat Burning=2 心率小于等于126大于108时传2,Aerobic=3 心率大于126小于等于144时传3,Anaerobic=4 心率大于144小于等于162时传4,Extreme=5 心率大于162时传5
              heartRateType: 0,
              // 步数
              steps: 0,
              // 路程 m
              duration: 0.0,
              // 卡路里 Kcal
              calories: 0.0,
              // 时间 分钟
              times: 0,
              // 头显角度
              hmdAngle: 0,
              // 方向角度
              sensorAngle: 0,
              // 臂带
              armbandData: {
                // 连接状态
                connectionState: 0,
                // 电量
                battery: 0,
                // 充电状态
                isBatteryCharging: 0
              },
              // 方向传感器
              sensorData: {
                connectionState: 0,
                battery: 0,
                isBatteryCharging: 0
              },
              // 左脚传感器
              leftFootData: {
                connectionState: 0,
                battery: 0,
                isBatteryCharging: 0
              },
              // 右脚传感器
              rightFootData: {
                connectionState: 0,
                battery: 0,
                isBatteryCharging: 0
              },
              // heartRate 透明度[0,1]
              heartRateOpacity: 1.0,
              // fitnessData透明度[0,1]
              fitnessDataOpacity: 1.0,
              // deviceDirection 透明度[0,1]
              deviceDirectionOpacity: 1.0,
              // deviceStatus 透明度[0,1]
              deviceStatusOpacity: 1.0,
              // 当日排行榜 为0时显示
              todaysRank: 0,
              // Today's Rank总开关 默认true
              todaysRankVisible: true,
              // 默认0.0333333351
              todaysRankX: 0.03,
              // 默认0.36
              todaysRankY: 0.66,
              // Today's Rank 字体大小倍率 [0.40,2.00] 默认1
              todaysRankSize: 1.0,
              // todaysRank透明度[0,1] 默认1
              todaysRankOpacity: 1.0,
              // updateFrequency文本是否显示 默认true
              updateFrequencyTextVisible: true,
              // Current Time总开关
              currentTimeVisible: true,
              // CurrentTime显示的x坐标，默认0.728888869
              currentTimeX: 0.52,
              // CurrentTime显示Y坐标，默认0.0466666669
              currentTimeY: 0.04,
              // Current Time 字体大小倍率，[0.40,2.00] 默认1
              currentTimeSize: 1.0,
              // Current Time透明度[0,1] 默认1
              currentTimeOpacity: 1.0,
              // 0--> MM/DD/YYYY06/20/2025  1-->DD/MM/YYYY20/06/2025 2-->YYYY/MM/DD2025/06/20  3-->Hidden不显示日期
              currentTimeDate: 0,
              // 0-->AM/PM Time06:00 PM 1-->  HH:MM18:00  2-->Hidden不显示日期
              currentTimeTime: 0
            },
            ArmviewConfig: {
              // 全部总开关 默认 true
              armViewDistanceVisible: true,
              // true为左手 false为右手  默认true
              armViewDisplayArm: true,
              // 字体大小 size [0.325,0.775] 默认0.5 add 0.05
              armViewSize: 0.5,
              // 高度 floats height 传[0.05,-0.05]  左边是大  默认0
              armviewHeight: 0.0,
              // 透明度opacity [0.4,1] 默认1
              armviewOpacity: 1,
              // 显示距离 Z  Vanish Distance  默认1  [0.25,1]
              armviewDisplayDistance: 1,
              // x的坐标 以正方形圆点为中心   Gateway面板的长宽为445, 223，拖动的显示1.0大小为100, 75  默认-0.10157913
              armviewX: 0.23,
              // y的坐标 以正方形圆点为中心  默认-0.101970375
              armviewY: 0.10,
              // Heart Rate总开关 默认true
              armviewHeartRateVisible: true,
              // 红心开关 默认ture
              armviewHeartRatingVisible: true,
              // 运动图标开关  默认ture
              armviewStateofSportsVisible: true,
              // Fitness Data总开关  默认ture
              armviewFitnessDataVisible: true,
              // walking显示开关 默认ture
              armviewWalkingVisible: true,
              // mileage显示开关 默认ture
              armviewMileageVisible: true,
              // Consume显示开关 默认ture
              armviewConsumeVisible: true,
              // ActiveTime显示开关 默认ture
              armviewActiveTimeVisible: true,
              // Device Direction 开关 默认ture
              armviewDeviceDirectionVisible: true,
              // Device Status总开关 默认ture
              armviewDeviceStatusVisible: true,
              // vr armband显示开关 默认ture
              armviewArmbandVisible: true,
              // Direction显示开关 默认ture
              armviewDirectionVisible: true,
              // 左脚显示开关 默认ture
              armviewLeftFootVisible: true,
              // 右脚显示开关 默认ture
              armviewRightFootVisible: true,
              // Today's Rank总开关 默认ture
              armviewTodysRankVisible: true,
              // 文本是否显示 默认ture
              armviewUpdateFrequencyText: true,
              // Today's Rank总开关 默认ture
              armviewCurrentTimeVisible: true,
              // MM/dd/yyyy 06/20/2025  1-->dd/MM/yyyy 20/06/2025 2-->yyyy/MM/dd 2025/06/20  3-->Hidden不显示日期
              armviewCurrentTimeDate: 0,
              // 0-->AM/PM Time06:00 PM 1-->  HH:mm 18:00  2-->Hidden不显示日期
              armviewCurrentTimeTime: 0,
              // 心率
              heartRate: 0,
              // No=0, Warm Up=1,Fat Burning=2,Aerobic=3,Anaerobic=4,Extreme=5
              heartRateType: 0,
              // 步数 
              steps: 0,
              // 路程 m
              duration: 0.0,
              // 卡路里 Kcal
              calories: 0.0,
              // 时间 分钟
              times: 0,
              // 头显角度
              hmdAngle: 0.0,
              // 方向角度
              sensorAngle: 0.0,
              // 臂带
              armbandData: {
                connectionState: 0,
                battery: 0,
                isBatteryCharging: 0
              },
              // 方向传感器
              sensorData: {
                connectionState: 0,
                battery: 0,
                isBatteryCharging: 0
              },
              // 左脚传感器
              leftFootData: {
                connectionState: 0,
                battery: 0,
                isBatteryCharging: 0
              },
              // 右脚传感器
              rightFootData: {
                connectionState: 0,
                battery: 0,
                isBatteryCharging: 0
              },
              // 排名
              todaysRank: 0,
              // 透明度 background opacity [0.00,1.00] 默认1
              panelOpacity: 1.0,
              // 背景板是否显示，传false
              isDisplayDistance: false,
              // 左右手柄平面对应的欧拉角 传6
              xEuler_left: 6,
              // 传 272
              yEuler_left: 272,
              // 传 312
              zEuler_left: 312,
              // 传 174
              xEuler_right: 174,
              // 传 272
              yEuler_right: 272,
              // 传 -132
              zEuler_right: -132,
              // 旋转角度 rotate[-2250, -4050],默认-3600 左右对称，然后，当armViewDisplayArm为true时，传overlayRotAngle为false时，传-overlayRotAngle
              overlayRotAngle: -360
            },
            GlobalConfig: {
              LinearMapping: true,
              MappingController: matchedGame?.KAT_Config_No.Mapping_Controller,
              DirectionDatum: matchedGame?.KAT_Config_No.Direction_Source,
              ControlMethod: 0,
              ControlMethodTwo: matchedGame?.KAT_Config_No.Walk_Source,
              MappingSpeed: 0,
              SprintSource: matchedGame?.KAT_Config_No.Run_Source,
              JumpSource: matchedGame?.KAT_Config_No.Jump_Source,
              FollowRecommendedSettings: true,
              WalkSpeedType: matchedGame?.KAT_Config_No.Walk_Speed_Type,
              DeadZone: matchedGame?.KAT_Config_No.Dead_Zone,
              ActiveZone: matchedGame?.KAT_Config_No.Active_Zone,
              Curve: matchedGame?.KAT_Config_No.Curve,
              MaxSpeedInGame: matchedGame?.KAT_Config_No.Max_Speed_In_Game,
              Devices: {
                DetectedController: "No Controllers",
                RenameController: "No Controllers",
                DeviceName: "No Controllers",
                SerialNumber: ""
              }
            },
            Global_Data_List: [{
              LinearMapping: true,
              MappingController: matchedGame?.KAT_Config_No.Mapping_Controller,
              DirectionDatum: matchedGame?.KAT_Config_No.Direction_Source,
              ControlMethod: 0,
              ControlMethodTwo: matchedGame?.KAT_Config_No.Walk_Source,
              MappingSpeed: 0,
              SprintSource: matchedGame?.KAT_Config_No.Run_Source,
              JumpSource: matchedGame?.KAT_Config_No.Jump_Source,
              FollowRecommendedSettings: true,
              WalkSpeedType: matchedGame?.KAT_Config_No.Walk_Speed_Type,
              DeadZone: matchedGame?.KAT_Config_No.Dead_Zone,
              ActiveZone: matchedGame?.KAT_Config_No.Active_Zone,
              Curve: matchedGame?.KAT_Config_No.Curve,
              MaxSpeedInGame: matchedGame?.KAT_Config_No.Max_Speed_In_Game,
              Devices: {
                DetectedController: "No Controllers",
                RenameController: "No Controllers",
                DeviceName: "No Controllers",
                SerialNumber: ""
              }
            }],
            Page: 0
          }

          gameLists.push(gameConfig)

          // 生成默认配置
          writeDefaultGameConfigFile(host, gameConfig)
        }
      }
    }

    if (gameLists && gameLists.length > 0) {
      await updateGameConfig(host, gameLists)
    }

    return gameLists;

  } catch (error) {
    console.log(error)
  }
}

// 生成游戏默认配置文件
export const writeDefaultGameConfigFile = async (host, gameConfig) => {
  try {
    const gameId = gameConfig.ID
    const gameName = await sanitizedFolderName(host, gameConfig.Name);
    const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}`
    const fileName = 'Default.json'

    let finalResult = true

    // 判断默认文件是否存在
    const fileInfo = await configRead(host, folderPath, fileName)

    if (fileInfo) {
      const res = JSON.parse(fileInfo)
      // 不存在，生成默认配置
      if (!res.result) {
        const saveGameConfig = JSON.stringify(gameConfig)
        const writeResultStr = await configWrite(host, folderPath, fileName, saveGameConfig)
        if (writeResultStr) {
          const writeResult = JSON.parse(writeResultStr)
          if (writeResult && writeResult.result) {
            finalResult = true
          } else {
            finalResult = false
          }
        }
      }

      // 写配置文件列表
      await writeConfigProfile(host, gameId)
    }
    return finalResult
  } catch (error) {
    console.log(error)
    return false
  }
}

// 写入模式配置列表
export const writeConfigProfile = async (host, gameId) => {

  try {
    const gameInfo = await getGameConfig(gameId);
    const gameName = await sanitizedFolderName(host, gameInfo.Name);


    const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}/configuration`
    const configurationFileName = 'config_profile.json'

    // 检查配置文件是否存在
    const fileInfo = await configRead(host, folderPath, configurationFileName)

    if (fileInfo) {
      const res = JSON.parse(fileInfo)
      if (res.result) {
        const resData = JSON.parse(res.data)
        return resData
      } else {
        // 生成默认配置文件对应路径信息
        const filePath = `${new_GatewayPath}/${profilePath}/${gameName}`

        const fileName = 'Default.json'

        const configurations = [
          {
            name: 'Default',
            filePath: filePath,
            fileName: fileName,
            isDefault: true,
            isActive: true
          }
        ]

        const content = JSON.stringify(configurations)
        await configWrite(host, folderPath, configurationFileName, content)
        return;
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// 更新游戏配置文件
export const updateGameConfig = async (host, gameConfigs) => {
  try {
    // 读取游戏JSON配置文件
    const gameConfigFile = JSON.parse(JSON.stringify(allGameLists.value))
    if (!gameConfigFile) return
    if (gameConfigs && gameConfigs.length > 0) {
      gameConfigFile.SteamGame = gameConfigs
    }

    store.commit('game/globalGameConfigsChange', gameConfigFile)

    // 写入游戏JSON配置文件
    return await saveGameControllerOptions(host, gameConfigFile);
  } catch (error) {
    console.log(error)
  }
}

// 更新对应游戏的HUD参数配置
export const updateGameHudConfig = async (host, gameId, hudConfig) => {

  try {
    // 读取游戏JSON配置文件
    const gameConfigFile = allGameLists.value //await readGameControllerOptions(host)
    if (!gameConfigFile) return

    const gameConfigLists = JSON.parse(JSON.stringify(gameConfigFile))

    if (gameId == '-1') {
      if (gameConfigLists.Default !== -1) {
        const oldHudConfig = gameConfigLists.Default.HudConfig || {}

        gameConfigLists.Default.HudConfig = {
          ...oldHudConfig,
          ...hudConfig
        }

        await store.dispatch('game/persistGlobalGameConfigs', {
          host,
          gameConfigLists
        })

        return true
      }
    } else {

      const gameIndex = gameConfigLists.SteamGame.findIndex(game => game.ID === gameId)

      if (gameIndex !== -1) {
        const oldHudConfig = gameConfigLists.SteamGame[gameIndex].HudConfig || {}

        gameConfigLists.SteamGame[gameIndex].HudConfig = {
          ...oldHudConfig,
          ...hudConfig
        }

        await store.dispatch('game/persistGlobalGameConfigs', {
          host,
          gameConfigLists
        })

        return true
      } else {
        const customGameIndex = gameConfigLists.CustomGame.findIndex(game => game.ID === gameId)

        if (customGameIndex !== -1) {
          const oldHudConfig = gameConfigLists.CustomGame[customGameIndex].HudConfig || {}

          gameConfigLists.CustomGame[customGameIndex].HudConfig = {
            ...oldHudConfig,
            ...hudConfig
          }

          await store.dispatch('game/persistGlobalGameConfigs', {
            host,
            gameConfigLists
          })

          return true
        }
      }
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

// 更新对应游戏的Armview参数配置
export const updateGameArmviewConfig = async (host, gameId, armviewConfig) => {
  try {

    // 读取游戏JSON配置文件
    const gameConfigFile = allGameLists.value;//await readGameControllerOptions(host)
    if (!gameConfigFile) return

    const gameConfigLists = JSON.parse(JSON.stringify(gameConfigFile))
    if (gameId == '-1') {
      if (gameConfigLists.Default !== -1) {
        const oldArmviewConfig = gameConfigLists.Default.ArmviewConfig || {}

        gameConfigLists.Default.ArmviewConfig = {
          ...oldArmviewConfig,
          ...armviewConfig
        }

        await store.dispatch('game/persistGlobalGameConfigs', {
          host,
          gameConfigLists
        })
        return true
      }
    } else {

      const gameIndex = gameConfigLists.SteamGame.findIndex(game => game.ID === gameId)

      if (gameIndex !== -1) {
        const oldArmviewConfig = gameConfigLists.SteamGame[gameIndex].ArmviewConfig || {}

        gameConfigLists.SteamGame[gameIndex].ArmviewConfig = {
          ...oldArmviewConfig,
          ...armviewConfig
        }

        await store.dispatch('game/persistGlobalGameConfigs', {
          host,
          gameConfigLists
        })
      } else {
        const gameIndex = gameConfigLists.CustomGame.findIndex(game => game.ID === gameId)

        if (gameIndex !== -1) {
          const oldArmviewConfig = gameConfigLists.CustomGame[gameIndex].ArmviewConfig || {}

          gameConfigLists.CustomGame[gameIndex].ArmviewConfig = {
            ...oldArmviewConfig,
            ...armviewConfig
          }

          await store.dispatch('game/persistGlobalGameConfigs', {
            host,
            gameConfigLists
          })
        }

      }
    }
  } catch (error) {
    console.log(error)
  }
}

//通过游戏id获取配置信息
export const getGameConfig = async (gameId) => {

  if (gameId == '-1') { //Default
    const gameConfig = allGameLists.value.Default;
    if (gameConfig) {
      return JSON.parse(JSON.stringify(gameConfig));
    }
  } else if (allGameLists.value) { //steam游戏
    const gameConfig = allGameLists.value.SteamGame.find(item => Number(item.ID) === Number(gameId))
    if (gameConfig) {

      return JSON.parse(JSON.stringify(gameConfig));
    } else { //自定义游戏
      const gameConfig = allGameLists.value.CustomGame.find(item => Number(item.ID) === Number(gameId))
      if (gameConfig) {
        return JSON.parse(JSON.stringify(gameConfig));
      } else {
        return JSON.parse(JSON.stringify(allGameLists.value.Default));
      }
    }
  }
}


//通过游戏id更新allGameLists
export const updateAllGameLists = async (gameId, newGameConfig, host) => {


  if (allGameLists.value) {

    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))

    if (gameId == '-1') {
      let gameConfig = gameConfigLists.Default
      if (gameConfig) {
        Object.assign(gameConfig, newGameConfig);
      }
    }
    if (gameId != '-1' && gameConfigLists.SteamGame) {
      let gameConfig = gameConfigLists.SteamGame.find(item => Number(item.ID) === Number(gameId))

      if (gameConfig) {
        Object.assign(gameConfig, newGameConfig)
      }
    }
    if (gameId != '-1' && gameConfigLists.CustomGame) {
      let gameConfig = gameConfigLists.CustomGame.find(item => Number(item.ID) === Number(gameId))
      if (gameConfig) {
        Object.assign(gameConfig, newGameConfig)
      }
    }

    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })

  }
}

let intnum = 0; // 轮询间隔时间，单位为毫秒
/**
 * 实时获取正在运行的游戏
 */
let oldRunningGames = null;
export const startGetRunningGamePolling = async (host) => {


  if (!host || gamePollingTimer) return;

  const poll = async () => {
    try {

      // intnum++;
      // console.log('轮询正在运行的游戏中...', intnum + "   " + new Date().toLocaleTimeString());

      const res = await host.GetRunGame();

      const resData = typeof res === 'string' ? JSON.parse(res) : res;

      //console.log('正在运行的游戏数据：', resData);

      store.dispatch('game/setRunningGameData', resData);


      // if (oldRunningGames != res) { //正在运行的游戏数据发生变化时才更新 一些操作
      //   oldRunningGames = res.value;

      // }
      return resData;
    } catch (err) {
      console.error(err);
    } finally {
      if (gamePollingTimer !== null) {
        gamePollingTimer = setTimeout(poll, 100);
      }
    }
  };

  gamePollingTimer = true;

  poll();
};

/**
 * 停止获取正在运行的游戏
 */
export const stopGetRunningGamePolling = () => {
  if (gamePollingTimer) {
    clearTimeout(gamePollingTimer);
    gamePollingTimer = null;
  }
};

/**
 * 检测已安装Steam游戏
 */
export const checkSteamGames = async (host) => {
  try {
    const gameConfigs = await readGameConfigs(host);
    if (!gameConfigs) return [];

    const { result, data } = JSON.parse(gameConfigs);
    if (!result || !data) return [];

    const gameList = JSON.parse(data);
    if (!Array.isArray(gameList) || gameList.length === 0) return [];

    const statusPromises = gameList.map(async (game) => {
      const gameId = parseInt(game.ID);
      const isInstalled = await getGameInstalledStatus(host, gameId);

      return isInstalled ? { ID: gameId, Name: game.Name } : null;
    });

    const results = await Promise.all(statusPromises);
    const filteredGames = results.filter(game => game !== null);

    return filteredGames;

  } catch (err) {
    console.error('Failed to checked Steam Games:', err);
    return [];
  }
}
