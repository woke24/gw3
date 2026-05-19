import moment from 'moment'

const state = () => ({
  allDevices: [], // 所有已连接设备  
  selectedDevice: {}, // 当前选中的设备
  allKatDevices: [], // 所有KAT设备
  allSittingDevices: [], // 所有坐姿设备
  allArmbandDevices: [], // 所有臂带设备
  isListenRunning: false, // 是否正在监听
  shouldRestartListen: false, // 是否需要重启监听
  isOpenedDevice: false, // 设备Runtime是否打开
  // 设备实时数据
  deviceRealTimeData: {
    headsetAngel: 0,
    bodyAngel: 0,
    heartRate: 0
  },
  // C2系列跑步机数据
  treadmillData: {
    deviceName: '',
    connected: false,
    lastUpdateTimePoint: 0.0,
    bodyRotationRaw: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
      w: 0.0
    },
    moveSpeed: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    deviceDatas: [],
    direction: {
      btnPressed: false,
      isBatteryCharging: false,
      batteryLevel: 0.0,
      firmwareVersion: 0
    },
    leftFoot: {
      btnPressed: false,
      isBatteryCharging: false,
      batteryLevel: 0.0,
      firmwareVersion: 0
    },
    rightFoot: {
      btnPressed: false,
      isBatteryCharging: false,
      batteryLevel: 0.0,
      firmwareVersion: 0
    },
    extraData: {
      isLeftGround: false,
      isRightGround: false,
      isLeftStatic: false,
      isRightStatic: false,
      motionType: 0,
      skatingSpeed: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      lFootSpeed: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      rFootSpeed: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      }
    }
  },
  // C、loco S系列
  cTreadmillData: {
    deviceName: '',
    connected: false,
    lastUpdateTimePoint: 0.0,
    bodyRotationRaw: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
      w: 0.0
    },
    moveSpeed: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    deviceDatas: [
      {
        btnPressed: false,
        isBatteryCharging: false,
        batteryLevel: 0.0,
        firmwareVersion: 0
      },
      {
        btnPressed: false,
        isBatteryCharging: false,
        batteryLevel: 0.0,
        firmwareVersion: 0
      },
      {
        btnPressed: false,
        isBatteryCharging: false,
        batteryLevel: 0.0,
        firmwareVersion: 0
      }
    ],
    extraData: {
      baseSDKinfo: {
        isLeftGround: false,
        isRightGround: false,
        isLeftStatic: false,
        isRightStatic: false,
        motionType: 0,
        action: 0,
        isMoving: false,
        isForward: -1,
        calorie: 0.0,
        skatingSpeed: {
          x: 0.0,
          y: 0.0,
          z: 0.0
        },
        lFootSpeed: {
          x: 0.0,
          y: 0.0,
          z: 0.0
        },
        rFootSpeed: {
          x: 0.0,
          y: 0.0,
          z: 0.0
        }
      }
    },
    L_Status: 0,
    L_Pitch: 180.0,
    L_Roll: 180.0,
    R_Status: 0,
    R_Pitch: 180.0,
    R_Roll: 180.0,
    Compass_Status: 0,
    Waist_Sensor_Yaw_Angle: 0.0,
    HMD_Angle: 0.0,
    stepCount: 0
  },
  // 头戴设备数据
  headsetData: {},
  // 左脚数据
  leftFooterPosition: {
    show: false,
    x: 0,
    y: 0
  },
  // 右脚数据
  rightFooterPosition: {
    show: false,
    x: 0,
    y: 0
  },
  // 当前设备质量信息
  currentDeviceQualityInfo: {},
  // 每日行走步数
  dailySteps: {
    date: '',
    steps: 0,
    calories: 0,
    meters: 0,
    walkingTime: 0
  },
  // 左脚运动状态
  leftFooterStatus: false,
  // 右脚运动状态
  rightFooterStatus: false,
  // C2 系列设备配对
  pairedDevice: {
    deviceName: '',
    deviceType: '',
    receiverSn: '',
    receiverPid: '',
    receiverVid: '',
    directionSn: '',
    directionMac: '',
    leftFooterSn: '',
    leftFooterMac: '',
    rightFooterSn: '',
    rightFooterMac: ''
  },
  // loco 系列设备配对
  locosPairedDevice: {
    deviceName: '',
    deviceType: '',
    receiverSn: '',
    receiverPid: '',
    receiverVid: '',
    waistSn: '',
    leftFooterSn: '',
    rightFooterSn: ''
  },
  // 当前使用的设备
  currentDevice: {},
  // 臂带设备
  armbandInfo: {
    connected: false,
    receiverMac: '',
    sensorMac: '',
    battery: 0,
    heartRate: 0
  },
  // 坐姿设备
  sittingInfo: {
    connected: false,
    comStaus: false,
    isDown: false,
    isPress: false,
    vehicleHub: false,
    vehicleHubSpeed: false,
    vehicleRRSimulation: 0.0,
    vehicleHubType: 0,
    sitWalking: false,
    sitWalkingSpeed: 0.0,
    vehicleTrigger: false,
    quickDriveMode: false,
    ChairMode: 0,
    VehicleCruiseMode: false,
    SittingHeightAdjustment: false,
    VehicleVibration: 0.0
  }
})

// mutations
const mutations = {
  SET_DEVICES (state, newDevices) {
    state.allDevices = newDevices || []
  },

  SET_SELECTED_DEVICE (state, device) {
    state.selectedDevice = device || {}
  },

  UPDATE_SELECTED_DEVICE (state, device) {
    state.selectedDevice = {
      ...state.selectedDevice,
      ...device
    }
  },

  SET_KAT_DEVICES (state, newDevices) {
    state.allKatDevices = newDevices || []
  },

  SET_ALL_SITTING_DEVICES (state, newDevices) {
    state.allSittingDevices = newDevices || []
  },

  SET_ALL_ARMBAND_DEVICES (state, newDevices) {
    state.allArmbandDevices = newDevices || []
  },

  SET_LISTEN_STATUS (state, isRunning) {
    state.isListenRunning = !!isRunning
  },

  SET_SHOULD_RESTART_LISTEN (state, shouldRestart) {
    state.shouldRestartListen = !!shouldRestart
  },

  SET_HEADSET_ANGLE (state, angle) {
    if (!state.deviceRealTimeData) {
      state.deviceRealTimeData = { headsetAngel: 0, bodyAngel: 0, heartRate: 0 }
    }
    state.deviceRealTimeData.headsetAngel = angle || 0
  },

  UPDATE_HEADSET_ANGLE (state, payload) {
    state.deviceRealTimeData = {
      ...state.deviceRealTimeData,
      ...payload
    }
  },

  SET_BODY_ANGLE (state, angle) {
    if (!state.deviceRealTimeData) {
      state.deviceRealTimeData = { headsetAngel: 0, bodyAngel: 0, heartRate: 0 }
    }
    state.deviceRealTimeData.bodyAngel = angle || 0
  },

  UPDATE_BODY_ANGLE (state, payload) {
    state.deviceRealTimeData = {
      ...state.deviceRealTimeData,
      ...payload
    }
  },

  SET_HEART_RATE (state, rate) {
    if (!state.deviceRealTimeData) {
      state.deviceRealTimeData = { headsetAngel: 0, bodyAngel: 0, heartRate: 0 }
    }
    state.deviceRealTimeData.heartRate = rate || 0
  },

  UPDATE_HEART_RATE (state, payload) {
    state.deviceRealTimeData = {
      ...state.deviceRealTimeData,
      ...payload
    }
  },

  SET_TREADMILL_DATA (state, payload) {
    state.treadmillData = payload
  },

  UPDATE_TREADMILL_DATA (state, payload) {
    state.treadmillData = {
      ...state.treadmillData,
      ...payload
    }
  },

  CLEAR_TREADMILL_DATA (state) {
    state.treadmillData = {}
  },

  // C2 系列跑步机数据
  RESET_C2_TREADMILL_DATA (state) {
    const initialTreadmillData = {
      deviceName: '',
      connected: false,
      lastUpdateTimePoint: 0.0,
      bodyRotationRaw: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
        w: 0.0
      },
      moveSpeed: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      deviceDatas: [],
      direction: {
        btnPressed: false,
        isBatteryCharging: false,
        batteryLevel: 0.0,
        firmwareVersion: 0
      },
      leftFoot: {
        btnPressed: false,
        isBatteryCharging: false,
        batteryLevel: 0.0,
        firmwareVersion: 0
      },
      rightFoot: {
        btnPressed: false,
        isBatteryCharging: false,
        batteryLevel: 0.0,
        firmwareVersion: 0
      },
      extraData: {
        isLeftGround: false,
        isRightGround: false,
        isLeftStatic: false,
        isRightStatic: false,
        motionType: 0,
        skatingSpeed: {
          x: 0.0,
          y: 0.0,
          z: 0.0
        },
        lFootSpeed: {
          x: 0.0,
          y: 0.0,
          z: 0.0
        },
        rFootSpeed: {
          x: 0.0,
          y: 0.0,
          z: 0.0
        }
      }
    };
    state.treadmillData = JSON.parse(JSON.stringify(initialTreadmillData))
  },

  // C、loco S 跑步机数据
  SET_C_TREADMILL_DATA (state, payload) {
    state.cTreadmillData = payload
  },

  UPDATE_C_TREADMILL_DATA (state, payload) {
    state.cTreadmillData = {
      ...state.cTreadmillData,
      ...payload
    }
  },

  CLEAR_C_TREADMILL_DATA (state) {
    state.cTreadmillData = {}
  },

  // C、loco S跑步机数据
  RESET_C_TREADMILL_DATA (state) {
    const initialTreadmillData = {
      deviceName: '',
      connected: false,
      lastUpdateTimePoint: 0.0,
      bodyRotationRaw: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
        w: 0.0
      },
      moveSpeed: {
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      deviceDatas: [
        {
          btnPressed: false,
          isBatteryCharging: false,
          batteryLevel: 0.0,
          firmwareVersion: 0
        },
        {
          btnPressed: false,
          isBatteryCharging: false,
          batteryLevel: 0.0,
          firmwareVersion: 0
        },
        {
          btnPressed: false,
          isBatteryCharging: false,
          batteryLevel: 0.0,
          firmwareVersion: 0
        }
      ],
      extraData: {
        baseSDKinfo: {
          isLeftGround: false,
          isRightGround: false,
          isLeftStatic: false,
          isRightStatic: false,
          motionType: 0,
          action: 0,
          isMoving: false,
          isForward: -1,
          calorie: 0.0,
          skatingSpeed: {
            x: 0.0,
            y: 0.0,
            z: 0.0
          },
          lFootSpeed: {
            x: 0.0,
            y: 0.0,
            z: 0.0
          },
          rFootSpeed: {
            x: 0.0,
            y: 0.0,
            z: 0.0
          }
        }
      },
      L_Status: 0,
      L_Pitch: 180.0,
      L_Roll: 180.0,
      R_Status: 0,
      R_Pitch: 180.0,
      R_Roll: 180.0,
      Compass_Status: 0,
      Waist_Sensor_Yaw_Angle: 0.0,
      HMD_Angle: 0.0,
      stepCount: 0
    }
    state.cTreadmillData = JSON.parse(JSON.stringify(initialTreadmillData))
  },

  SET_HEADSET_DATA (state, payload) {
    state.headsetData = payload
  },

  UPDATE_HEADSET_DATA (state, payload) {
    console.log(payload)
    state.headsetData = {
      ...state.headsetData,
      ...payload
    }
  },

  SET_LEFT_FOOTER_POSITION (state, position) {
    state.leftFooterPosition.show = position.show || true
    state.leftFooterPosition.x = position.x || 40
    state.leftFooterPosition.y = position.y || 40
  },

  SET_RIGHT_FOOTER_POSITION (state, position) {
    state.rightFooterPosition.show = position.show || true
    state.rightFooterPosition.x = position.x || 40
    state.rightFooterPosition.y = position.y || 40
  },

  SET_CURRENT_DEVICE_QUALITY_INFO (state, info) {
    state.currentDeviceQualityInfo = info || {}
  },

  UPDATE_CURRENT_DEVICE_QUALITY_INFO (state, info) {
    state.currentDeviceQualityInfo = {
      ...state.currentDeviceQualityInfo,
      ...info
    }
  },

  SET_DAILY_STEPS (state, steps) {
    state.dailySteps = steps || {}
  },

  // 更新步数的核心逻辑
  UPDATE_DAILY_STEPS (state, payload) {
    const { date, steps, calories, meters, walkingTime } = payload;

    state.dailySteps.date = date;
    state.dailySteps.steps = steps;
    state.dailySteps.calories = calories;
    state.dailySteps.meters = meters;
    state.dailySteps.walkingTime = walkingTime;
  },

  SET_PAIRED_DEVICE (state, device) {
    state.pairedDevice = device || {}
  },

  SET_LOCOS_PAIRED_DEVICE (state, device) {
    state.locosPairedDevice = device || {}
  },

  UPDATE_PAIRED_DEVICE (state, partialDevice) {
    state.pairedDevice = {
      ...state.pairedDevice,
      ...partialDevice
    }
  },

  UPDATE_LOCOS_PAIRED_DEVICE (state, partialDevice) {
    state.locosPairedDevice = {
      ...state.locosPairedDevice,
      ...partialDevice
    }
  },

  SET_CURRENT_DEVICE (state, device) {
    state.currentDevice = device || {}
  },

  UPDATE_CURRENT_DEVICE (state, device) {
    state.currentDevice = {
      ...state.currentDevice,
      ...device
    }
  },

  SET_ARMBAND_INFO (state, device) {
    state.armbandInfo = device || {}
  },

  UPDATE_ARMBAND_INFO (state, device) {
    state.currentDevice = {
      ...state.armbandInfo,
      ...device
    }
  },

  SET_SITTING_INFO (state, info) {
    state.sittingInfo = info
  },

  UPDATE_SITTING_INFO (state, info) {
    state.sittingInfo = {
      ...state.sittingInfo,
      ...info
    }
  },

  RESET_SITTING_INFO (state) {
    const defaultSitting = {
      connected: false,
      comStaus: false,
      isDown: false,
      isPress: false,
      vehicleHub: false,
      vehicleHubSpeed: false,
      vehicleRRSimulation: 0.0,
      vehicleHubType: 0,
      sitWalking: false,
      sitWalkingSpeed: 0.0,
      vehicleTrigger: false,
      quickDriveMode: false,
      ChairMode: 0,
      VehicleCruiseMode: false,
      SittingHeightAdjustment: false,
      VehicleVibration: 0.0
    }

    state.sittingInfo = JSON.parse(JSON.stringify(defaultSitting))
  },

  SET_IS_OPENED_DEVICE (state, isOpened) {
    state.isOpenedDevice = !!isOpened
  },

  // C2 系列
  SET_BATCH_DEVICE_DATA (state, payload) {
    // 跑步机基础数据
    state.treadmillData = payload.treadmill;
    // 坐标点
    state.leftFooterPosition = payload.leftFootPos;
    state.rightFooterPosition = payload.rightFootPos;
    // 角度
    state.deviceRealTimeData.bodyAngel = payload.bodyAngle;
    state.deviceRealTimeData.headsetAngel = payload.headsetAngle;
    state.headsetData = payload.headsetData;
  },

  // C 系列
  SET_C_BATCH_DEVICE_DATA (state, payload) {
    // 跑步机基础数据
    state.cTreadmillData = payload.treadmill;
    // 坐标点
    state.leftFooterPosition = payload.leftFootPos;
    state.rightFooterPosition = payload.rightFootPos;
    // 角度
    state.deviceRealTimeData.bodyAngel = payload.bodyAngle;
    state.deviceRealTimeData.headsetAngel = payload.headsetAngle;
    state.headsetData = payload.headsetData;
  }
}

// actions
const actions = {
  addOrUpdateSteps ({ commit }, payload) {
    const { date, steps, calories, meters, walkingTime } = payload;

    commit('SET_DAILY_STEPS', {
      date: date,
      steps: steps,
      calories: calories,
      meters: meters,
      walkingTime: walkingTime
    });
  },

  reportSteps ({ commit }, data) {
    commit('UPDATE_DAILY_STEPS', data);
  }
}

// getters
const getters = {
  getDevices (state) {
    return state.allDevices || []
  },

  getSelectedDevice (state) {
    return state.selectedDevice || {}
  },

  getKatDevices (state) {
    return state.allKatDevices || []
  },

  getSittingDevices (state) {
    return state.allSittingDevices || []
  },
  getArmbandDevices (state) {
    return state.allArmbandDevices || []
  },

  getListenStatus (state) {
    return state.isListenRunning || false
  },

  getShouldRestartListen (state) {
    return state.shouldRestartListen || false
  },

  getHeadsetAngle (state) {
    return (state.deviceRealTimeData && state.deviceRealTimeData.headsetAngel) || 0
  },

  getBodyAngle (state) {
    return (state.deviceRealTimeData && state.deviceRealTimeData.bodyAngel) || 0
  },

  getHeartRate (state) {
    return (state.deviceRealTimeData && state.deviceRealTimeData.heartRate) || 0
  },

  getDeviceRealTimeData (state) {
    return state.deviceRealTimeData || { headsetAngel: 0, bodyAngel: 0, heartRate: 0 }
  },

  getTreadmillData (state) {
    return state.treadmillData
  },

  getCTreadmillData (state) {
    return state.cTreadmillData
  },

  getHeadsetData (state) {
    return state.headsetData
  },

  getLeftFooterPosition (state) {
    return state.leftFooterPosition || { show: false, x: 0, y: 0 }
  },

  getRightFooterPosition (state) {
    return state.rightFooterPosition || { show: false, x: 0, y: 0 }
  },

  getCurrentDeviceQualityInfo (state) {
    return state.currentDeviceQualityInfo || {}
  },

  getStepsByDate: (state) => (date) => {
    return state.dailySteps[date] || 0;
  },

  getAllSteps: (state) => {
    return state.dailySteps || {};
  },

  getPairedDevice (state) {
    return state.pairedDevice || {}
  },

  getLocosPairedDevice (state) {
    return state.locosPairedDevice || {}
  },

  getCurrentDevice (state) {
    return state.currentDevice || {}
  },

  getDailySteps (state) {
    return state.dailySteps || {}
  },

  getArmbandInfo (state) {
    return state.armbandInfo || {}
  },

  getSittingInfo (state) {
    return state.sittingInfo || {}
  },
  getIsOpenedDevice (state) {
    return state.isOpenedDevice || false
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
