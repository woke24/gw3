import { ref, reactive, computed } from 'vue'
import store from '@/store'
import { Quat } from '@/utils/convert'
import { allKatDevices } from './devices'
import _ from 'lodash'
import moment from 'moment'

const NAMESPACE = 'device'
// 所有连接设备列表
const connectedDevices = ref([])
// 是否正在监控设备状态，定义互斥锁
const isMonitoring = ref(false)
const isStartListen = ref(false)

// 模拟一个锁，获取已连接设备列表
let isFetching = false;
// 模块级变量，首次运行
let isFirstRun = true;
// 高频数据
const COMMIT_INTERVAL = 32; // UI更新间隔(ms)
const GRID_SIZE = 80;
const CENTER = 40;
const DOT_RADIUS = 5;

let lastCommitTime = 0;
let isProcessing = false;

// 逻辑计算用的临时状态
let internalFootPos = {
  left: { x: CENTER, y: CENTER, show: false },
  right: { x: CENTER, y: CENTER, show: false }
};

// 跑步机数据
const treadMillData = ref({})

// 通讯质量差的持续时间计时器 - 方向、左右脚通讯其中一个小于40，且持续15s
const failDuration = ref(0)
// 方向左右脚加起来大于 200 的累加器（用于计时清零）
const totalCommValue = ref(0)

// 设备通讯质量信息
const deviceCommQualityInfo = ref({})

// 头显模块
const headsetData = ref({})
let lastOpenVRRotation = ref(null)
let consecutiveRotationChanges = ref(0)
const ROTATION_CHANGE_THRESHOLD = 3
const useOpenVRData = ref(true)

// 左右脚位信息
const leftFootPosition = ref({ show: true, x: 40, y: 40 })
const rightFootPosition = ref({ show: true, x: 40, y: 40 })

// 步数计算
const currentDate = ref(null)

// 定义左右脚接触状态
const lastLeftGroundStatus = ref(false)
const lastRightGroundStatus = ref(false)
const SPEED_THRESHOLD = 0.015

// 臂带数据
const armbandData = ref({})

// 坐姿
const sittingConnected = ref(false)

// 用户信息
const userInfo = ref({})

const cachedSerialNumber = ref(null)
const cachedUserInfo = ref(null)
const isInitializing = ref(false)
const lastConnectedStatus = ref(null)

let lastRawArmbandData = ''
let cachedConfig = null

const STORAGE_KEY = 'treadmill_daily_steps'

const getTodayStr = () => moment().format('YYYY-MM-DD')

// 运动状态监听统计
const isMoving = ref(false)
const movementStartTime = ref(null)
const currentSessionStart = ref(null)
const SESSION_TIMEOUT = 5000
const lastStepTimestamp = ref(0)
const lastMovementTime = ref(0)
const MOVEMENT_TIMEOUT = 3000
const sessionDuration = ref(0)

// 连接设备时记录key（用序列号当key）
let lastOpenedKey = '';
let pollTimer = null;
let isOpening = false;

let dataPollingTimer = null;
let gameRecordTimer = null;
let gameWalkingTimer = null;

let isPolling = false;
const observers = new Set();

// 记录上一次数据 
let isFirstRuning = true;
let lastSensorCache = {
  gameId: null,
  stepCount: 0,
  calories: 0,
  meters: 0,
  walkingTime: 0
};

const new_GatewayPath = 'Local/New_Gateway'
const profilePath = 'Profile'

const getInitialSteps = () => {
  const cached = localStorage.getItem(STORAGE_KEY)
  if (cached) {
    const { date, steps } = JSON.parse(cached)
    if (date === getTodayStr()) {
      return steps
    }
  }
  return 0
}

// 今日行走步数
const dailySteps = ref(getInitialSteps())

// 计算步数
const handleStepIncrement = async (host) => {
  const now = Date.now()
  const today = getTodayStr()

  if (!isMoving.value) {
    isMoving.value = true
    currentSessionStart.value = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log('检测到运动开始:', currentSessionStart.value)
  }
  lastStepTimestamp.value = now

  const cachedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  if (cachedData.date && cachedData.date !== today) {
    dailySteps.value = 0
  }

  dailySteps.value++

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      date: today,
      steps: dailySteps.value
    })
  )

  try {
    await saveOrUpdateDaySteps(host, 1)
  } catch (error) {
    console.error('Failed to write steps to file:', error)
  }
}

// 心率监控
let currentSession = {
  heartRate: null,
  startTime: null
}

const decimalToHex = (decimal) => {
  if (typeof decimal !== 'number' || !Number.isInteger(decimal) || decimal < 0) {
    return ''
  }
  let hex = decimal.toString(16)
  return `0x${hex.toUpperCase()}`
}

function convertToInt32 (value) {
  if (typeof value === 'string') value = Number(value);

  const i = Math.floor(value);
  const f = value - i;
  if (f < 0.5) return i | 0;
  if (f > 0.5) return (i + 1) | 0;
  return (i % 2 === 0 ? i : i + 1) | 0;
}

// 处理角度
const normalizeHeadsetAngle = (convertedQuat) => {
  let headsetAngle = 0

  const angle = convertToInt32(convertedQuat) || 0

  if (angle >= 360) {
    headsetAngle = angle - 360
  } else if (angle < 0) {
    headsetAngle = angle + 360
  } else {
    headsetAngle = angle
  }

  return headsetAngle
}

// 计算行走速度
const calculateSpeedMagnitude = (speedVector) => {
  const { x, y, z } = speedVector
  return Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2))
}

// 进制转换
const hexToDecimal = (hexString) => {
  if (typeof hexString !== 'string') {
    return ''
  }

  const decimalValue = parseInt(hexString, 16)

  if (isNaN(decimalValue)) {
    return ''
  }

  return decimalValue
}

// 延迟函数
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 日期
 */
export const getDate = async (host) => {
  const currentTime = await host.GetCurrentTime()
  return moment(currentTime).format('YYYY-MM-DD')
}

/**
 * 时间
 */
export const getDateTime = async (host) => {
  const currentTime = await host.GetCurrentTime()
  return moment(currentTime).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 时区
 */
export const getTimeZone = async (host) => {
  const currentTimeZone = await host.GetTimeZone()
  return currentTimeZone
}

/**
 * 获取设备插入数量
 */
export const getConnectedDevices = async (host) => {
  if (!host || isFetching) return [];
  isFetching = true

  try {
    const devicesCount = await host.DeviceCount()
    // 所有连接上的设备
    const tempDevices = []

    // 获取设备插入数量（获取接收器），所有连接的设备
    for (let index = 0; index < devicesCount; index++) {
      // 获取设备信息
      const deviceInfo = await host.GetDevicesDesc(index);
      if (!deviceInfo) continue;

      try {
        const deviceInfoObj = JSON.parse(deviceInfo);
        const devicePid = decimalToHex(deviceInfoObj.pid);
        const deviceVid = decimalToHex(deviceInfoObj.vid);

        // 匹配已知设备配置, 增加设备图片及元数据
        const matched = allKatDevices.find(
          (d) => d.receiverPid === devicePid && d.receiverVid === deviceVid
        );

        if (matched) {
          Object.assign(deviceInfoObj, {
            deviceName: matched.deviceName,
            deviceType: matched.deviceType,
            img: matched.img,
            rawDesc: deviceInfo
          });
        }
        tempDevices.push(deviceInfoObj);
      } catch (parseErr) {
        console.error('Parse device JSON error:', parseErr);
      }
    }

    // 数据对比，只有在设备列表发生变化时才更新 Vuex 状态，避免不必要的组件更新
    const oldDevices = store.state.device.allDevices || [];
    const isOpenedStatus = store.state.device.isOpenedDevice;

    const isListChanged = !_.isEqual(tempDevices, oldDevices);
    const needToOpen = tempDevices.length > 0 && !isOpenedStatus;

    if (isListChanged || needToOpen || isFirstRun) {

      isFirstRun = false;

      if (tempDevices.length > 0) {
        connectedDevices.value = tempDevices;
        store.commit('device/SET_DEVICES', tempDevices);
        // 更新选中设备逻辑，多设备情况处理
        updateSelectedDeviceLogic(tempDevices);

        // 仅在列表变化且有设备时执行 Runtime 打开逻辑
        await handleDeviceOpen(host, tempDevices);
      } else {
        // 当列表变为空时，清空选中状态
        store.commit('device/SET_DEVICES', []);
        store.commit('device/SET_SELECTED_DEVICE', {});
        store.commit('device/SET_IS_OPENED_DEVICE', false);
        lastOpenedKey = '';
      }
    }

    return tempDevices;
  } catch (err) {
    return []
  } finally {
    isFetching = false;
  }
}

/**
 * 设备展示逻辑，连接设备有没有进行配对，初始化多设备连接，默认没有选中设备 */
const updateSelectedDeviceLogic = async (newList) => {
  const currentSelected = store.state.device.selectedDevice || {};

  if (newList.length === 0) {
    store.commit('device/SET_SELECTED_DEVICE', {});
  } else if (newList.length === 1) {
    // 只有一台设备时自动选中
    store.commit('device/SET_SELECTED_DEVICE', newList[0]);
  } else {
    // 多台设备：检查之前的选中项是否还在线
    const isStillConnected = newList.some(d => d.pid === currentSelected.pid && d.vid === currentSelected.vid);
    if (!isStillConnected) {
      store.commit('device/SET_SELECTED_DEVICE', newList[0]);
    }
  }
};

/**
 * 启动设备Runtime的逻辑
 */
const handleDeviceOpen = async (host, newList) => {
  if (!host || isOpening) return;

  // 从 Vuex 获取当前选中的设备
  const currentSelected = store.state.device.selectedDevice;
  const isOpenedStatus = store.state.device.isOpenedDevice;

  // 如果没有设备连接，重置所有状态
  if (newList.length === 0) {
    // 停止轮循
    stopDeviceDataPolling();
    if (isOpenedStatus) {
      store.commit('device/SET_IS_OPENED_DEVICE', false);
      lastOpenedKey = '';
    }
    return;
  }

  const target = (currentSelected && currentSelected.pid) ? currentSelected : newList[0];
  const currentKey = `${target.serialNumber}`;

  // 判断是否需要执行 Open 的条件：
  // A: 当前 Vuex 记录为“未开启”
  // B: 当前物理开启的设备 Key 与 目标设备 Key 不一致（说明换了设备）
  if (!isOpenedStatus || currentKey !== lastOpenedKey) {
    isOpening = true;
    console.log(`[Action] Attempting to open device: ${target.deviceName}`);

    // 切换设备，先停止轮循 
    stopDeviceDataPolling();

    try {
      // 执行启动方法
      console.log(`[Action] Opening device: ${target.deviceName}`);
      const success = await host.Open_Device(target.deviceType, target.rawDesc);

      // 执行成功，判断设备连接状态，获取步数数据
      if (success) {
        lastOpenedKey = currentKey; // 记录物理标识
        store.commit('device/SET_IS_OPENED_DEVICE', true); // 更新 Vuex 状态

        // 立即启动轮询，提高效率，获取设备数据
        startGetDeviceDatasPolling(host)

        // 30S 后检查是否已经成功启动
        verifyDeviceConnection(host, currentKey);

        console.log('[Success] Device opened and status recorded.');
      } else {
        lastOpenedKey = '';
        store.commit('device/SET_IS_OPENED_DEVICE', false);
        console.warn('[Fail] Hardware refused to open device.');
      }
    } catch (e) {
      console.error('[Error] Open_Device call exception:', e);
      lastOpenedKey = '';
      store.commit('device/SET_IS_OPENED_DEVICE', false);
    } finally {
      isOpening = false;
    }
  }
}

/**
 * 验证设备连接状态的健康检查
 * @param {Object} host - 硬件实例
 * @param {String} targetKey - 启动时记录的设备唯一标识
 */
const verifyDeviceConnection = (host, targetKey) => {
  console.log(`[Health Check] 定时检查任务已创建，30秒后验证设备: ${targetKey}`);
  const currentSelected = store.state.device.selectedDevice;

  if (currentSelected) {
    setTimeout(async () => {
      try {
        // 如果 30s 后连接的设备发生了改变，调用Open_Device
        if (lastOpenedKey !== targetKey) {
          console.log('[Health Check] 设备已切换');
          lastOpenedKey = '';
          store.commit('device/SET_IS_OPENED_DEVICE', false);
          // 停止数据获取
          stopDeviceDataPolling();
          return;
        }

        const isListening = await host.IsDeviceListen(currentSelected.serialNumber)
        const isDeviceBusy = await host.IsDeviceBusy(currentSelected.serialNumber)

        // 检测设备是否侦听，满足任何一状态不重启
        if (isListening || isDeviceBusy) {
          return;
        }

      } catch (checkErr) {
        console.error('[Health Check Error] 检查过程中出现异常:', checkErr);
      }
    }, 30000);
  }
};

// 首次强制扫描
export const initDeviceState = () => {
  store.commit('device/SET_IS_OPENED_DEVICE', false);
  store.commit('device/SET_DEVICES', []);
  lastOpenedKey = '';
};

/**
 * 封装：每2秒自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startDevicePolling = async (host) => {
  if (!host || pollTimer) return;

  const poll = async () => {
    await getConnectedDevices(host);
    pollTimer = setTimeout(poll, 2000);
  };

  // console.log('Dynamic equipment monitoring has been initiated (cycle: 2 second).')

  await poll()
}

export const stopDevicePolling = () => {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
};

/**
 * 所有连接的设备列表
 */
export const allConnectedDevices = () => computed(() => connectedDevices.value)

/**
 * 多设备连接情况，选择当前使用设备
 */
export const selectUseDevice = (serialNumber) => {
  const currentSelectedDevice = connectedDevices.value.find(
    (device) => device.serialNumber === serialNumber
  )
  if (currentSelectedDevice) {
    store.commit('device/SET_SELECTED_DEVICE', currentSelectedDevice)
  }
  return currentSelectedDevice
}

/**
 * 启动侦听，监听设备数据
 */
export const monitorDeviceStatus = async (host) => {
  if (isMonitoring.value) {
    return
  }

  isMonitoring.value = true

  try {
    // 获取选中的设备
    const currentDevice = store.getters['device/getSelectedDevice']
    if (!currentDevice || !currentDevice.serialNumber) {
      isMonitoring.value = false
      store.commit(`${NAMESPACE}/RESET_C2_TREADMILL_DATA`)
      return
    }

    // 根据sn查询设备是否侦听
    const isListening = await host.IsDeviceListen(currentDevice.serialNumber)
    const isDeviceBusy = await host.IsDeviceBusy(currentDevice.serialNumber)

    console.log('⭐⭐⭐⭐⭐⭐设备侦听状态⭐⭐⭐⭐⭐⭐', isListening)
    console.log('⭐⭐⭐⭐⭐⭐设备忙碌状态⭐⭐⭐⭐⭐⭐', isDeviceBusy)

    const currentShouldRestart = store.getters[`${NAMESPACE}/getShouldRestartListen`]

    // console.log('⭐⭐⭐⭐⭐⭐是否需要重启侦听⭐⭐⭐⭐⭐⭐', currentShouldRestart)

    if (isListening || isDeviceBusy) {
      // 通讯质量差断开需要重启侦听
      if (currentShouldRestart) {
        // 执行重启操作
        const stopResult = await host.StopListen(currentDevice.serialNumber)
        if (stopResult) {
          await sleep(1000);
          await host.StartListen(currentDevice.serialNumber)
        }

        // 信号已被消费，立即重置 Vuex 标志位
        store.commit(`${NAMESPACE}/SET_SHOULD_RESTART_LISTEN`, false)

        // 重启后，侦听状态暂时变为未就绪
        store.commit(`${NAMESPACE}/SET_LISTEN_STATUS`, false)
        // 释放锁
        isMonitoring.value = false
        return
      }

      // 如果没有收到重启信号，执行常规流程
      store.commit(`${NAMESPACE}/SET_LISTEN_STATUS`, true)
      // 表示侦听已经启动
      console.log(
        `Device ${currentDevice.deviceName} is already listening, starting data collection.`
      )

      // 调用GetWalkStatus 获取跑步机数据
      const walkStatus = await host.GetWalkStatus(currentDevice.serialNumber)

      if (walkStatus) {
        // 获取当前设备数据
        const deviceData = JSON.parse(walkStatus)

        // console.log('⭐⭐⭐⭐⭐⭐设备数据⭐⭐⭐⭐⭐⭐', deviceData)

        // 跑步机数据
        const newTreadmillData = {
          ...deviceData,
          direction: deviceData.deviceDatas[0],
          leftFoot: deviceData.deviceDatas[1],
          rightFoot: deviceData.deviceDatas[2]
        }
        treadMillData.value = newTreadmillData
        store.commit(`${NAMESPACE}/SET_TREADMILL_DATA`, newTreadmillData)
        // 设备存储数据
        const bodyRotationRaw = deviceData.bodyRotationRaw
        const myQuat = new Quat(
          bodyRotationRaw.w,
          bodyRotationRaw.x,
          bodyRotationRaw.y,
          bodyRotationRaw.z
        )
        const convertedQuat = await host.ConvertAngles(JSON.stringify(myQuat))
        // 四元素转换成角度
        const convertedAngle = normalizeHeadsetAngle(convertedQuat)
        // 腰部角度
        store.commit(`${NAMESPACE}/UPDATE_BODY_ANGLE`, { bodyAngel: convertedAngle })

        // 机器人小点移动逻辑 - 左脚是否离地
        const isLeftGround = deviceData.extraData.isLeftGround
        // 左脚速度
        let lFootSpeedx = deviceData.extraData.lFootSpeed.x
        let lFootSpeedy = deviceData.extraData.lFootSpeed.y
        let lFootSpeedz = deviceData.extraData.lFootSpeed.z

        const GRID_SIZE = 80
        const DOT_RADIUS = 5
        const MIN_COORD = DOT_RADIUS
        const MAX_COORD = GRID_SIZE - DOT_RADIUS

        // 是否离地或者速度都为0时显示中心点
        if (!isLeftGround || (lFootSpeedx === 0 && lFootSpeedy === 0 && lFootSpeedz === 0)) {
          // 左脚未离地-显示中心点
          leftFootPosition.value.show = false
          leftFootPosition.value.x = 40
          leftFootPosition.value.y = 40
        } else {
          // 左脚数据-计算坐标点移动的坐标
          const positionX = parseFloat(lFootSpeedx * 3)
          const positionY = parseFloat(lFootSpeedz * 3)

          leftFootPosition.value.show = true

          let newX = parseFloat(leftFootPosition.value.x + positionX)
          let newY = parseFloat(leftFootPosition.value.y - positionY)

          leftFootPosition.value.x = Math.max(MIN_COORD, Math.min(MAX_COORD, newX))
          leftFootPosition.value.y = Math.max(MIN_COORD, Math.min(MAX_COORD, newY))
        }
        // 判断设备是否连接，判断传感器是否离地，左脚接触地面
        if (deviceData.connected && isLeftGround) {
          leftFootPosition.value.show = true
          // 左脚数据-显示坐标点
          store.commit(`${NAMESPACE}/SET_LEFT_FOOTER_POSITION`, leftFootPosition.value)
        } else {
          // 不显示坐标点
          const position = {
            show: false,
            x: leftFootPosition.value.x,
            y: leftFootPosition.value.y
          }
          // 左脚数据-不显示坐标点
          store.commit(`${NAMESPACE}/SET_LEFT_FOOTER_POSITION`, position)
        }

        // 右脚是否离地
        const isRightGround = deviceData.extraData.isRightGround
        // 右脚速度
        const rFootSpeedx = deviceData.extraData.rFootSpeed.x
        const rFootSpeedy = deviceData.extraData.rFootSpeed.y
        const rFootSpeedz = deviceData.extraData.rFootSpeed.z

        if (!isRightGround || (rFootSpeedx === 0 && rFootSpeedy === 0 && rFootSpeedz === 0)) {
          // 右脚未离地-显示中心点，点位于中心坐标
          rightFootPosition.value.show = false
          rightFootPosition.value.x = 40
          rightFootPosition.value.y = 40
        } else {
          // 右脚数据-计算坐标点移动的坐标
          const positionX = parseFloat(rFootSpeedx * 3)
          const positionY = parseFloat(rFootSpeedz * 3)

          rightFootPosition.value.show = true

          let newX = parseFloat(rightFootPosition.value.x + positionX)
          let newY = parseFloat(rightFootPosition.value.y - positionY)

          rightFootPosition.value.x = Math.max(MIN_COORD, Math.min(MAX_COORD, newX))
          rightFootPosition.value.y = Math.max(MIN_COORD, Math.min(MAX_COORD, newY))
        }

        // 判断设备是否连接，判断传感器是否离地，右脚接触地面
        if (deviceData.connected && isRightGround) {
          // 显示坐标点
          rightFootPosition.value.show = true
          // 右脚数据-显示坐标点
          store.commit(`${NAMESPACE}/SET_RIGHT_FOOTER_POSITION`, rightFootPosition.value)
        } else {
          // 不显示坐标点
          const position = {
            show: false,
            x: rightFootPosition.value.x,
            y: rightFootPosition.value.y
          }
          // 右脚数据-不显示坐标点
          store.commit(`${NAMESPACE}/SET_RIGHT_FOOTER_POSITION`, position)
        }

        // 计算步数
        const moveSpeed = calculateSpeedMagnitude(deviceData.moveSpeed)
        // console.log('当前移动速度:', moveSpeed)

        if (!lastLeftGroundStatus.value && isLeftGround && moveSpeed > SPEED_THRESHOLD) {
          updateMovementSession()
          await handleStepIncrement(host)
        }

        if (!lastRightGroundStatus.value && isRightGround && moveSpeed > SPEED_THRESHOLD) {
          updateMovementSession()
          await handleStepIncrement(host)
        }

        currentDate.value = await getDate(host)

        // console.log(dailySteps.value)
        if (dailySteps.value > 0) {
          store.dispatch(`${NAMESPACE}/reportSteps`, {
            date: currentDate.value,
            steps: dailySteps.value
          })
        }

        // 运动步数
        lastLeftGroundStatus.value = isLeftGround
        lastRightGroundStatus.value = isRightGround
      }

      // 检查是否停下来
      checkMovementEnd()

      //每次轮询结束前检查是否需要结算本次运动
      await checkAndSaveSession(host)

      // 获取头显信息
      const headDisplayInfo = await host.ReadKatSteamStatus()

      if (headDisplayInfo) {
        const headsetData = JSON.parse(headDisplayInfo)
        // 判断OculusVRDevice下ready是否为true
        if (headsetData.oculusVRDevice && headsetData.oculusVRDevice.ready) {
          // 判断openVRDevice下ready是否为true
          if (headsetData.openVRDevice && headsetData.openVRDevice.ready) {
            // 判断openVRDevice的角度
            const currentRotation = headsetData.openVRDevice.hmdDevice.transforn.rotation
            // 四元素转换为角度
            const convertedQuat = await host.ConvertAngles(JSON.stringify(currentRotation))
            // 判断角度
            let headsetAngle = normalizeHeadsetAngle(convertedQuat)
            // 第 1 步：检查是否是第一次运行，或者旋转是否发生了变化
            if (lastOpenVRRotation.value !== null) {
              const isDifferent = headsetAngle !== lastOpenVRRotation.value

              if (isDifferent) {
                consecutiveRotationChanges.value++
              } else {
                // 如果与上次相同，则重置计数器
                consecutiveRotationChanges.value = 0
              }
            } else {
              // 第一次运行，直接记录当前旋转
              lastOpenVRRotation.value = headsetAngle
            }

            // 第 2 步：如果连续变化次数超过阈值（3次），则更新最后的值
            // 变化次数，是否大于3次
            if (consecutiveRotationChanges.value >= ROTATION_CHANGE_THRESHOLD) {
              lastOpenVRRotation.value = headsetAngle
              // 重置计数器
              consecutiveRotationChanges.value = 0
              // 超过3次
              useOpenVRData.value = true
            } else {
              // 取oculusVRDevice的值
              const oculusVRDeviceData = headsetData.oculusVRDevice
              store.commit(`${NAMESPACE}/SET_HEADSET_DATA`, oculusVRDeviceData)
              useOpenVRData.value = false
            }

            if (useOpenVRData.value) {
              // 取openVRDevice的数据
              const openVRDeviceData = headsetData.openVRDevice
              const openVrDeviceRotation = openVRDeviceData.hmdDevice.transforn.rotation
              const convertedOpenVrDeviceQuat = await host.ConvertAngles(
                JSON.stringify(openVrDeviceRotation)
              )

              // console.log('头显角度：', normalizeHeadsetAngle(convertedOpenVrDeviceQuat))
              // 存储头显角度
              store.commit(`${NAMESPACE}/UPDATE_HEADSET_ANGLE`, {
                headsetAngel: normalizeHeadsetAngle(convertedOpenVrDeviceQuat)
              })
              // console.log('openVRDeviceData', openVRDeviceData)
              await writeHeadsetConfig(host, openVRDeviceData)
              store.commit(`${NAMESPACE}/SET_HEADSET_DATA`, openVRDeviceData)
            } else {
              // 取oculusVRDevice的值
              const oculusVRDeviceData = headsetData.oculusVRDevice
              const oculusVrDeviceRotation = oculusVRDeviceData.hmdDevice.transforn.rotation
              const convertedOculusVrDeviceQuat = await host.ConvertAngles(
                JSON.stringify(oculusVrDeviceRotation)
              )
              // console.log('头显角度：', normalizeHeadsetAngle(convertedOculusVrDeviceQuat))
              // 存储头显角度
              store.commit(`${NAMESPACE}/UPDATE_HEADSET_ANGLE`, {
                headsetAngel: normalizeHeadsetAngle(convertedOculusVrDeviceQuat)
              })
              // console.log('oculusVRDeviceData', oculusVRDeviceData)
              await writeHeadsetConfig(host, oculusVRDeviceData)
              store.commit(`${NAMESPACE}/SET_HEADSET_DATA`, oculusVRDeviceData)
            }
          } else {
            // 取oculusVRDevice的值
            const oculusVRDeviceData = headsetData.oculusVRDevice
            const oculusVrDeviceRotation = oculusVRDeviceData.hmdDevice.transforn.rotation
            const convertedOculusVrDeviceQuat = await host.ConvertAngles(
              JSON.stringify(oculusVrDeviceRotation)
            )
            // console.log('头显角度：', normalizeHeadsetAngle(convertedOculusVrDeviceQuat))
            // 存储头显角度
            store.commit(`${NAMESPACE}/UPDATE_HEADSET_ANGLE`, {
              headsetAngel: normalizeHeadsetAngle(convertedOculusVrDeviceQuat)
            })
            // console.log('oculusVRDeviceData', oculusVRDeviceData)
            await writeHeadsetConfig(host, oculusVRDeviceData)
            store.commit(`${NAMESPACE}/SET_HEADSET_DATA`, oculusVRDeviceData)
          }
        } else {
          // 判断openVRDevice下ready是否为true
          if (headsetData.openVRDevice && headsetData.openVRDevice.ready) {
            // 取openVRDevice的数据
            const openVRDeviceData = headsetData.openVRDevice
            const openVrDeviceRotation = openVRDeviceData.hmdDevice.transforn.rotation
            const convertedOpenVrDeviceQuat = await host.ConvertAngles(
              JSON.stringify(openVrDeviceRotation)
            )
            // 存储头显角度
            // console.log('头显角度：', normalizeHeadsetAngle(convertedOpenVrDeviceQuat))
            store.commit(`${NAMESPACE}/UPDATE_HEADSET_ANGLE`, {
              headsetAngel: normalizeHeadsetAngle(convertedOpenVrDeviceQuat)
            })
            // console.log('openVRDeviceData', openVRDeviceData)
            await writeHeadsetConfig(host, openVRDeviceData)
            store.commit(`${NAMESPACE}/SET_HEADSET_DATA`, openVRDeviceData)
          } else {
            // 判断openXRDevice下ready是否为true
            if (headsetData.openXRDevice && headsetData.openXRDevice.ready) {
              // 取openXRDevice的数据
              const openXRDeviceData = headsetData.openXRDevice
              const openVrDeviceRotation = openVRDeviceData.hmdDevice.transforn.rotation
              const convertedOpenVrDeviceQuat = await host.ConvertAngles(
                JSON.stringify(openVrDeviceRotation)
              )
              // 存储头显角度
              // console.log('头显角度：', normalizeHeadsetAngle(convertedOpenVrDeviceQuat))
              store.commit(`${NAMESPACE}/UPDATE_HEADSET_ANGLE`, {
                headsetAngel: normalizeHeadsetAngle(convertedOpenVrDeviceQuat)
              })
              // console.log('openXRDeviceData', openXRDeviceData)
              await writeHeadsetConfig(host, oculusVRDeviceData)
              store.commit(`${NAMESPACE}/SET_HEADSET_DATA`, openXRDeviceData)
            } else {
              // 不取任何数据，头显未连接
              store.commit(`${NAMESPACE}/UPDATE_HEADSET_ANGLE`, {
                headsetAngel: 0
              })
              store.commit(`${NAMESPACE}/SET_HEADSET_DATA`, {})
            }
          }
        }
      }
    } else {
      // 调用StopListen后再调用StartListen启动侦听
      store.commit(`${NAMESPACE}/SET_LISTEN_STATUS`, false)
      // 调用StopListen后再调用StartListen启动侦听
      const stopResult = await host.StopListen(currentDevice.serialNumber)
      if (stopResult) {
        await sleep(1000);
        await host.StartListen(currentDevice.serialNumber)
      }
    }
  } catch (error) {
    console.error('Error in monitorDeviceStatus:', error)
  } finally {
    isMonitoring.value = false
  }
}

/**
 * 更新运动状态与时长记录
 */
const updateMovementSession = () => {
  const now = Date.now()

  // 如果当前不在运动中，标志着一次新运动的开始
  if (!isMoving.value) {
    isMoving.value = true
    movementStartTime.value = now
    console.log('--- 运动正式开始 ---', moment(now).format('HH:mm:ss'))
  }

  // 刷新最后活动时间
  lastMovementTime.value = now
}

/**
 * 检查运动是否结束并保存
 * 在 monitorDeviceStatus 的最后调用
 */
const checkAndSaveSession = async (host) => {
  if (!isMoving.value || !movementStartTime.value) return

  const now = Date.now()
  // 如果当前时间距离最后一次动超过了 5 秒
  if (now - lastMovementTime.value > SESSION_TIMEOUT) {
    const startTimeStr = moment(movementStartTime.value).format('YYYY-MM-DD HH:mm:ss')
    const endTimeStr = moment(lastMovementTime.value).format('YYYY-MM-DD HH:mm:ss')
    const durationSec = Math.floor((lastMovementTime.value - movementStartTime.value) / 1000)

    console.log(`--- 运动结束 --- 持续: ${durationSec}秒`)

    // 执行持久化
    await saveMovementSession(host, {
      startTime: startTimeStr,
      endTime: endTimeStr,
      duration: durationSec
    })

    // 重置状态
    isMoving.value = false
    movementStartTime.value = null
    lastMovementTime.value = 0
  }
}

/**
 * 保存运动会话到本地文件
 */
const saveMovementSession = async (host, sessionData) => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const fileName = 'UserSessions.json'

  try {
    let sessions = []
    const res = await host.ConfigRead(folderPath, fileName)
    if (res) {
      const parsed = JSON.parse(res)
      if (parsed.result && parsed.data) sessions = JSON.parse(parsed.data)
    }

    sessions.push(sessionData)
    // 只保留最近50条记录
    if (sessions.length > 50) sessions.shift()

    await host.ConfigWrite(folderPath, fileName, JSON.stringify(sessions))
  } catch (e) {
    console.error('Save Session Error:', e)
  }
}

/**
 * 检查运动是否结束（需在轮询中调用）
 */
const checkMovementEnd = () => {
  if (!isMoving.value) return

  const now = Date.now()
  // 如果当前时间距离最后一次迈步超过了阈值，认为本次运动结束
  if (now - lastMovementTime.value > MOVEMENT_TIMEOUT) {
    const durationMs = lastMovementTime.value - movementStartTime.value
    sessionDuration.value = Math.floor(durationMs / 1000)
    isMoving.value = false
    console.log(`本次运动结束，总时长: ${sessionDuration.value} 秒`)
  }
}

/**
 * 启动侦听，监听设备数据
 */
export const saveOrUpdateDaySteps = async (host, steps) => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const stepsFileName = 'UserSteps.json'

  const currentDate = await getDate(host)

  const fileExist = await checkStepConfiguration(host)

  if (!fileExist) {
    // 创建文件并写数据
    const userStepDatas = []
    const currentDateStep = {
      date: currentDate,
      steps: steps
    }
    userStepDatas.push(currentDateStep)
    const content = JSON.stringify(userStepDatas)
    // 写入文件
    return await host.ConfigWrite(folderPath, stepsFileName, content)
  } else {
    // 读取文件，更新或者新增数据
    let allStepDatas = []

    const stepDatas = await host.ConfigRead(folderPath, stepsFileName)
    if (stepDatas) {
      const res = JSON.parse(stepDatas)
      if (res.result && res.data) {
        allStepDatas = JSON.parse(res.data)
      }
    }

    if (allStepDatas.length > 0) {
      const result = allStepDatas.find((item) => item.date === currentDate)
      if (result) {
        // 更新步数
        result.steps = parseInt(result.steps) + parseInt(steps)

        // 写入文件
        const content = JSON.stringify(allStepDatas)
        // 写入文件
        return await host.ConfigWrite(folderPath, stepsFileName, content)
      } else {
        const currentDateStep = {
          date: currentDate,
          steps: steps
        }
        allStepDatas.push(currentDateStep)
        // 写入文件
        const content = JSON.stringify(allStepDatas)
        // 写入文件
        return await host.ConfigWrite(folderPath, stepsFileName, content)
      }
    }
  }
}

/**
 * 启动侦听，监听设备数据
 */
export const checkStepConfiguration = async (host) => {
  // 先从本地读取配置文件是否存在，不存在创建对应配置文件
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const stepsFileName = 'UserSteps.json'
  const fileExist = await host.ConfigRead(folderPath, stepsFileName)
  if (fileExist) {
    const res = JSON.parse(fileExist)
    if (res.result) {
      return true
    }
    return false
  }
}

/**
 * 获取步数数据
 */
export const getDaySteps = async (host) => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const stepsFileName = 'UserSteps.json'
  const fileExist = await host.ConfigRead(folderPath, stepsFileName)

  let userSteps = []
  if (fileExist) {
    const res = JSON.parse(fileExist)
    if (res.result && res.data) {
      userSteps = JSON.parse(res.data)
    }
  }
  return userSteps
}

/**
 * 封装：每10ms自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startMonitorDeviceStatusPolling = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await monitorDeviceStatus(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 10)
    }
  }

  // console.log('Dynamic device monitoring has been started (period: 10ms)')

  await poll()
}

/**
 * 保存当前头显数据（头部、左手、右手基本信息）
 */
export const writeHeadsetConfig = async (host, datas) => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const configurationFileName = 'HeadsetPairing.json'
  let headDisplayInfo = {}
  if (datas) {
    headDisplayInfo = {
      ready: datas.ready,
      headset: datas.hmdDevice.deviceName,
      headsetSerialNumber: datas.hmdDevice.serialNumber,
      leftController: datas.leftControllerDevice.deviceName,
      leftControllerSerialNumber: datas.leftControllerDevice.serialNumber,
      rightController: datas.rightControllerDevice.deviceName,
      rightControllerSerialNumber: datas.rightControllerDevice.serialNumber
    }
    const content = JSON.stringify(headDisplayInfo)
    await host.ConfigWrite(folderPath, configurationFileName, content)
  }
}

/**
 * 开始监控通信质量
 */
export const handleCommunicationQuality = async (host) => {
  // 1. 读取控制状态：左边表示侦听已经启动后，右侧方法才会执行
  const currentListenStatus = store.getters[`${NAMESPACE}/getListenStatus`]
  if (!currentListenStatus) {
    // 侦听未运行，清零内部计时器，不执行检查
    failDuration.value = 0
    totalCommValue.value = 0
    return
  }

  // 2. 执行通讯质量检查和判断
  const currentDevice = store.getters['device/getSelectedDevice']

  if (!currentDevice || !currentDevice.serialNumber) {
    console.log('No selected device to check communication quality.')
    store.commit(`${NAMESPACE}/SET_CURRENT_DEVICE_QUALITY_INFO`, {})
    return
  }

  // 获取c2设备连接通讯质量
  const commQualityValue = await host.GetDeviceConnection()

  if (commQualityValue) {
    deviceCommQualityInfo.value = JSON.parse(commQualityValue)
    store.commit(`${NAMESPACE}/SET_CURRENT_DEVICE_QUALITY_INFO`, deviceCommQualityInfo.value)
  }

  const currentDeviceQualityInfo = deviceCommQualityInfo.value

  // console.log('⭐⭐⭐⭐⭐⭐通讯质量⭐⭐⭐⭐⭐⭐', currentDeviceQualityInfo)

  const directionComm = Math.floor(currentDeviceQualityInfo.sensorStatus1)
  const leftFootComm = Math.floor(currentDeviceQualityInfo.sensorStatus2)
  const rightFootComm = Math.floor(currentDeviceQualityInfo.sensorStatus3)

  // 方向、左右脚其中一个小于 40, 持续15s
  const commFailed = directionComm < 40 || leftFootComm < 40 || rightFootComm < 40

  if (directionComm > 0 && leftFootComm > 0 && rightFootComm > 0) {
    // 流程图逻辑：其中一个小于40，持续 15s 的判断
    if (commFailed) {
      // 累加失败时间 (1s 周期累加 1000ms)
      failDuration.value += 1000

      // 判断是否达到 15 秒 (15000ms)
      if (failDuration.value >= 15000) {
        console.warn('⭐⭐⭐⭐⭐⭐检测到通讯质量持续差 15s！发送重启信号。⭐⭐⭐⭐⭐⭐')
        // 传递信号，更新Vuex 对应状态
        store.commit(`${NAMESPACE}/SET_SHOULD_RESTART_LISTEN`, true)
        // 信号发出后，重新计时
        failDuration.value = 0
      } else if (failDuration.value % 1000 === 0) {
        // 辅助日志：每秒打印一次计时
        console.log(
          `⭐⭐⭐⭐⭐⭐通讯质量，持续计时中⭐⭐⭐⭐⭐⭐: ${failDuration.value / 1000}s / 15s`
        )
      }
    } else {
      // 正常则清零计时
      failDuration.value = 0
    }
  }

  // 方向左右脚加起来大于 200 时，计时清零
  if (directionComm + leftFootComm + rightFootComm > 200) {
    totalCommValue.value = 0 // 清零累加器
    failDuration.value = 0
  } else {
    // 每次 1s 周期执行时，将通讯值累加到 totalCommValue
    totalCommValue.value += directionComm + leftFootComm + rightFootComm
  }
}

/**
 * 封装：每1s自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startCommunicationQualityPolling = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await handleCommunicationQuality(host)
      // console.log('Dynamic communication quality monitoring has been started (period: 1s)')
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 1000)
    }
  }

  // console.log('Dynamic communication quality monitoring has been started (period: 1s)')

  await poll()
}

/**
 * 臂带通讯
 */
export const handleArmbandCommunication = async (host) => {
  if (!host || isInitializing.value) return

  const rawData = await host.getArmbandInfo()

  if (rawData === lastRawArmbandData) return
  lastRawArmbandData = rawData

  const armbandRealData = JSON.parse(rawData)

  try {
    if (!cachedSerialNumber.value) {
      isInitializing.value = true
      const armbandPid = hexToDecimal('0xBF13')
      const armbandVid = hexToDecimal('0xC4F4')
      const count = await host.GetLocalHIDDeviceCount(armbandPid, armbandVid)

      if (count > 0) {
        const info = await host.GetLcoalHIDDevice(armbandPid, armbandVid, 0)
        const obj = JSON.parse(info)
        cachedSerialNumber.value = obj?.serialNumber
      }
      isInitializing.value = false

      if (!cachedSerialNumber.value) {
        updateDeviceStatus(false)
        return
      }
    }

    const isDeviceListen = await host.armbandIsListenDevice(cachedSerialNumber.value)
    if (!isDeviceListen) {
      await host.armbandStopListen()
      await host.armbandStartListen(cachedSerialNumber.value)
      return
    }

    if (!cachedConfig) {
      const configRes = JSON.parse((await host.GetConnectState(cachedSerialNumber.value)) || '{}')
      cachedConfig = configRes.data || {}
    }

    const armbandConfigObj = cachedConfig

    // 4. 处理数据逻辑
    const newHR = armbandRealData.heartRate
    const isWorking = armbandRealData.curStatus === 1

    if (!isWorking) {
      // 异常状态处理
      handleSessionEnd(host)
      updateDeviceStatus(false, armbandConfigObj, armbandRealData)
    } else {
      // 正常心率处理
      handleHeartRateLogic(host, newHR)
      updateDeviceStatus(true, armbandConfigObj, armbandRealData)
    }
  } catch (error) {
    console.error('Armband Communication Error:', error)
    cachedSerialNumber.value = null
  }
}

/**
 * 心率变化与存储逻辑
 */
const handleHeartRateLogic = (host, newHR) => {
  const now = performance.now()

  if (currentSession.heartRate !== null && newHR !== currentSession.heartRate) {
    // 心率变了，结算上一段心率的消耗
    const duration = (now - currentSession.startTime) / 1000
    // 异步执行，不 await，避免阻塞主循环
    saveArmbandData(host, currentSession.heartRate, duration)

    currentSession.heartRate = newHR
    currentSession.startTime = now
  } else if (currentSession.heartRate === null && newHR > 0) {
    // 初始获取到心率
    currentSession.heartRate = newHR
    currentSession.startTime = now
  }
}

/**
 * 强制结算当前 Session
 */
const handleSessionEnd = (host) => {
  if (currentSession.heartRate !== null) {
    const duration = (performance.now() - currentSession.startTime) / 1000
    saveArmbandData(host, currentSession.heartRate, duration)
    currentSession.heartRate = null
  }
}

/**
 * 统一管理 Vuex 更新，增加状态比对减少重绘
 */
const updateDeviceStatus = (connected, config = {}, realData = {}) => {
  // 更新心率 (频繁变动，直接更新)
  store.commit('device/UPDATE_HEART_RATE', { heartRate: realData.heartRate || 0 })

  // 状态或关键信息变化时才更新详情，减少 Vue 响应式压力
  const statusKey = `${connected}-${realData.battery}-${config.sensorMAC}`
  if (lastConnectedStatus.value !== statusKey) {
    store.commit('device/SET_ARMBAND_INFO', {
      connected,
      receiverMac: config.receiverMAC || '',
      sensorMac: config.sensorMAC || '',
      battery: realData.battery || 0,
      heartRate: realData.heartRate || 0
    })
    lastConnectedStatus.value = statusKey
  }
}

/**
 * 优化后的数据存储
 */
export const saveArmbandData = async (host, heartRate, duration) => {
  if (!host || duration < 0.5) return

  try {
    const userInfo = await getCachedUserInfo(host)
    const currentDate = await getDateTime(host)

    const isMale = userInfo.sex !== 0
    const weight = userInfo.weight || (isMale ? 80 : 60)

    let Calorie = 0
    if (heartRate > 60) {
      if (isMale) {
        Calorie = ((heartRate - 60) * (0.07 * weight + 5) * duration) / 6000
      } else {
        Calorie = ((heartRate - 60) * (0.063 * weight + 2.8) * duration) / 6000
      }
    }

    const armbandInfo = {
      userid: userInfo.userId,
      Timestamp: parseFloat(duration.toFixed(4)),
      HeartRate: heartRate,
      Date: currentDate,
      IsUpload: 0,
      Calorie: parseFloat(Calorie.toFixed(4))
    }

    host.GetArmbandAdd(JSON.stringify(armbandInfo))
  } catch (err) {
    console.error('Save Armband Data Failed:', err)
  }
}

/**
 * 查询臂带数据存储
 */
export const getArmbandData = async (host) => {
  const datas = await host.ArmbandDataRead()
  return datas
}

/**
 * 读取用户信息
 */

export const getUserInfo = async (host) => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const fileName = 'UserInfo.json'
  const data = await host.ConfigRead(folderPath, fileName)
  if (data) {
    const res = JSON.parse(data)
    if (res.result && res.data) {
      userInfo.value = JSON.parse(res.data)
    }
  }
  return userInfo.value
}

export const getCachedUserInfo = async (host) => {
  if (!cachedUserInfo.value) {
    cachedUserInfo.value = await getUserInfo(host)
  }
  return cachedUserInfo.value
}

/**
 *
 * 封装：每1s自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startArmbandPolling = async (host) => {
  if (!host) return
  const poll = async () => {
    const start = performance.now()

    try {
      await handleArmbandCommunication(host)
    } catch (err) {
      console.error(err)
    } finally {
      const end = performance.now()
      const delay = Math.max(1000 - (end - start), 200)
      setTimeout(poll, delay)
    }
  }

  setTimeout(poll, 1000)
}

/**
 * 查询数据库中心率数据
 */
export const getCurrentDayHeart = async (host, date) => {
  const day = moment(date).format('YYYY/M/D')
  const userInfo = await getCachedUserInfo(host)
  const userId = userInfo?.userId
  const sql = `SELECT 
      CASE 
          WHEN HeartRate <= 108 THEN 'warmUp'
          WHEN HeartRate BETWEEN 109 AND 126 THEN 'fatBurning'
          WHEN HeartRate BETWEEN 127 AND 144 THEN 'aerobic'
          WHEN HeartRate BETWEEN 145 AND 162 THEN 'anaerobic'
          ELSE 'extreme'
      END AS HeartRateZone,
      ROUND(SUM(Timestamp), 2) AS TotalDuration
  FROM "ArmbandData" 
  WHERE Date LIKE '%${day}%'
    AND HeartRate > 0 
    AND userid = '${userId}' 
  GROUP BY HeartRateZone
  ORDER BY HeartRateZone ASC;`;
  const heartRateDatas = await host.GatewayQuery(sql)
  if (heartRateDatas) {
    return JSON.parse(heartRateDatas)
  }
  return heartRateDatas
}

// 对应日期臂带数据 - 卡路里计算
const userStatistics = async (host, date) => {
  const day = moment(date).format('YYYY/M/D')
  const userInfo = await getCachedUserInfo(host)
  const userId = userInfo?.userId
  const sql = `SELECT
			ROUND(SUM(Calorie), 2) AS totalCalorie,
      ROUND(SUM(Timestamp), 2) AS totalDuration
  FROM "ArmbandData" 
  WHERE Date LIKE '%${day}%'
    AND HeartRate > 0 
    AND userid = '${userId}' 
  GROUP BY userid
  ORDER BY totalCalorie DESC;`
  const heartRateDatas = await host.GatewayQuery(sql)
  if (heartRateDatas) {
    return JSON.parse(heartRateDatas)
  }
  return heartRateDatas;
}

/**
 * 心率数据处理
 */
export const processHeartRateData = async (host, date) => {
  const heartRateDatas = await getCurrentDayHeart(host, date)
  if (heartRateDatas && heartRateDatas.ds.length > 0) {
    // console.log('心率数据：', heartRateDatas.ds)
    return heartRateDatas.ds
  } else {
    return []
  }
}

/**
 * 心率数据卡路里计算
 */
export const getUserStatistics = async (host, date) => {
  const heartRateDatas = await userStatistics(host, date)
  if (heartRateDatas && heartRateDatas.ds.length > 0) {
    // console.log('心率数据-卡路里：', heartRateDatas.ds)
    return heartRateDatas.ds.shift()
  } else {
    return []
  }
}

/**
 * 启动KATHandlerWatcher
 */
export const openKatHandleWatcher = async (host) => {
  if (!host) return
  try {
    await host.OpenKATHandlerWatcher()
    // console.log('KAT Handle Watcher Listen has been started (period: 2s)')
  } catch (err) {
    console.error(err)
  }
}

/**
 * 封装：每2s自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startKatHandleWatcherPolling = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await openKatHandleWatcher(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 2000)
    }
  }

  // console.log('KAT Handle Watcher Listen has been started (period: 2s)')

  await poll()
}

/**
 * 启动KatInputService
 */
export const openKatInputService = async (host) => {
  if (!host) return
  try {
    await host.OpenKATinPutService()
    // console.log('KAT Input Service Listen has been started (period: 2s)')
  } catch (err) {
    console.error(err)
  }
}

/**
 * 封装：每2s自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startKatInputService = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await openKatInputService(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 2000)
    }
  }

  // console.log('KAT Input Service Listen has been started (period: 2s)')

  await poll()
}

/**
 * 坐姿侦听
 */
export const handleSittingListen = async (host) => {
  if (isStartListen.value) {
    return
  }

  isStartListen.value = true

  try {
    const currentDevice = store.getters['device/getSelectedDevice']

    if (!currentDevice || !currentDevice.serialNumber) {
      isStartListen.value = false
      return
    }

    const deviceType = currentDevice.deviceType

    // 设备为C2系列（C2、C2 Core、C2 Plus）
    if (deviceType === 4 || deviceType === 8 || deviceType === 9) {
      let pid = '0x8F37'
      let vid = '0xC4F4'
      if (deviceType === 4) {
        pid = '0x8F37'
      } else if (deviceType === 8) {
        pid = '0xBF37'
      } else if (deviceType === 9) {
        pid = '0xBF12'
      }
      const vehiclePid = hexToDecimal(pid)
      const vehicleVid = hexToDecimal(vid)

      const vehicleHubs = await host.GetLocalHIDDeviceCount(vehiclePid, vehicleVid)
      // console.log('坐姿数量', vehicleHubs)
      if (vehicleHubs > 0 && vehicleHubs < 2) {
        const nIndex = vehicleHubs - 1
        const vehicleInfo = await host.GetLcoalHIDDevice(vehiclePid, vehicleVid, nIndex)
        // console.log('坐姿接收器信息', vehicleInfo)
        if (vehicleInfo) {
          // 启动侦听
          const receiverPid = currentDevice.pid
          const receiverVid = currentDevice.vid
          const receiverIndex = 0
          const receiverInfo = await host.GetLcoalHIDDevice(receiverPid, receiverVid, receiverIndex)
          // console.log('接收器信息：', receiverInfo)
          await host.c2SittingStartListen(receiverInfo, vehicleInfo)
          // console.log('启动侦听结果', result)
          const vehicleData = await getVehicleInfo(host)
          if (vehicleData) {
            const vehicleDataObj = JSON.parse(vehicleData)
            if (vehicleDataObj && vehicleDataObj.comStaus) {
              sittingConnected.value = true
              vehicleDataObj.connected = vehicleDataObj.comStaus
              store.commit('device/SET_SITTING_INFO', vehicleDataObj)
            } else {
              sittingConnected.value = false
              vehicleDataObj.connected = false
              store.commit('device/SET_SITTING_INFO', vehicleDataObj)
            }
          }
        }
      } else {
        store.commit('device/RESET_SITTING_INFO')
      }
    } else {
      isStartListen.value = false
      return
    }
  } catch (error) {
    console.log(error)
  } finally {
    isStartListen.value = false
  }
}

export const getVehicleInfo = async (host) => {
  const vehicleInfo = await host.GetC2VehicleInfo()
  return vehicleInfo
}

/**
 * 封装：每2s自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startSittingListen = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await handleSittingListen(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 1000)
    }
  }

  // console.log('Sitting Listen has been started (period: 1s)')

  await poll()
}

/**
 * 关闭VR 内平台
 */
export const closeKatGatewayOverlay = async (host) => {
  if (!host) return
  try {
    await host.CloseKATGatewayOverlay()
    console.log('KAT Gateway Overlay has been closed.')
  } catch (err) {
    console.error(err)
  }
}

/**
 * 启动VR 内平台
 */
export const openKatGatewayOverlay = async (host) => {
  if (!host) return
  try {
    await host.OpenKATGatewayOverlay()
    // console.log('KAT Gateway Overlay has been opened (period: 2s)')
  } catch (err) {
    console.error(err)
  }
}

/**
 * 封装：每2s启动VR 内平台
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const handleOpenKatGatewayOverlay = async (host) => {
  if (!host) return
  const poll = async () => {
    try {
      await openKatGatewayOverlay(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 2000)
    }
  }

  // console.log('KAT Gateway Overlay has been opened (period: 2s)')

  await closeKatGatewayOverlay()

  await poll()
}

/**
 * 关闭KATArmViewOverlay
 */
export const closeKatArmViewOverlay = async (host) => {
  if (!host) return
  try {
    await host.CloseKATArmViewOverlay()
    console.log('KAT Arm View Overlay has been closed.')
  } catch (err) {
    console.error(err)
  }
}

/**
 * 启动KATArmViewOverlay
 */
export const openKatArmViewOverlay = async (host) => {
  if (!host) return
  try {
    await host.OpenKATArmViewOverlay()
    // console.log('KAT Arm Overlay has been opened (period: 2s)')
  } catch (err) {
    console.error(err)
  }
}

/**
 * 封装：每2s启动KATArmViewOverlay
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const handleOpenKatArmViewOverlay = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await openKatArmViewOverlay(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 2000)
    }
  }

  // console.log('KAT Arm Overlay has been opened (period: 2s)')
  await closeKatArmViewOverlay()

  await poll()
}

/**
 * 所有已连接坐姿设备列表
 */
export const getConnectedSittings = async (host) => {
  if (!host) return []
  // 判断当前已连接设备，根据设备匹配传感器，筛选有效的坐姿设备
  try {

    const sittingConnectedDeviceList = []

    const currentDevice = store.getters['device/getSelectedDevice']

    if (!currentDevice || !currentDevice.serialNumber) {
      return
    }

    const deviceType = currentDevice.deviceType

    let pid = '0x8F37'
    let vid = '0xC4F4'
    if (deviceType === 4) {
      pid = '0x8F37'
    } else if (deviceType === 8) {
      pid = '0xBF37'
    } else if (deviceType === 9) {
      pid = '0xBF12'
    }

    const vehiclePid = hexToDecimal(pid)
    const vehicleVid = hexToDecimal(vid)

    const vehicleHubs = await host.GetLocalHIDDeviceCount(vehiclePid, vehicleVid)

    if (vehicleHubs > 0) {
      for (let index = 0; index < vehicleHubs; index++) {
        const vehicleInfo = await host.GetLcoalHIDDevice(vehiclePid, vehicleVid, index)
        if (vehicleInfo) {
          sittingConnectedDeviceList.push(JSON.parse(vehicleInfo))
        }
      }
    }

    // 写入缓存
    store.commit('device/SET_ALL_SITTING_DEVICES', sittingConnectedDeviceList)

    return sittingConnectedDeviceList

  } catch (err) {
    return []
  }
}

/**
 * 封装：每2s获取一次已连接的坐姿设备列表
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const handleDemandSittings = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await getConnectedSittings(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 2000)
    }
  }

  // console.log('KAT Sitting List has been requested (period: 2s)')
  await getConnectedSittings()

  await poll()
}

/**
 * 所有已连接臂带设备列表
 */
export const getConnectedArmbands = async (host) => {
  if (!host) return []
  // 判断当前已连接设备，根据设备匹配传感器，筛选有效的臂带设备
  try {

    const armbandConnectedDeviceList = []

    const currentDevice = store.getters['device/getSelectedDevice']

    if (!currentDevice || !currentDevice.serialNumber) {
      return
    }

    const armbandPid = hexToDecimal('0xBF13')
    const armbandVid = hexToDecimal('0xC4F4')

    const armbandCounts = await host.GetLocalHIDDeviceCount(armbandPid, armbandVid)

    if (armbandCounts > 0) {
      for (let index = 0; index < armbandCounts; index++) {
        const armbandInfo = await host.GetLcoalHIDDevice(armbandPid, armbandVid, index)
        if (armbandInfo) {
          armbandConnectedDeviceList.push(JSON.parse(armbandInfo))
        }
      }
    }

    // 写入缓存
    store.commit('device/SET_ALL_ARMBAND_DEVICES', armbandConnectedDeviceList)

    return armbandConnectedDeviceList

  } catch (err) {
    return []
  }
}

/**
 * 封装：每2s获取一次已连接的臂带设备列表
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const handleDemandArmbands = async (host) => {
  if (!host) return

  const poll = async () => {
    try {
      await getConnectedArmbands(host)
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(poll, 2000)
    }
  }

  // console.log('KAT Armband List has been requested (period: 2s)')
  await getConnectedArmbands(host)

  await poll()
}

/**
 * 设备连接，启动Runtime
 */
export const handleDeviceConnected = async (host) => {
  if (!host) return
  try {
    const currentDevice = store.getters['device/getSelectedDevice']
    if (!currentDevice || !currentDevice.serialNumber) {
      return
    }
    return await host.Open_Device(currentDevice.deviceType, currentDevice.serialNumber);
  } catch (err) {
    console.error('Failed to start runtime on device connection:', err)
  }
}

/**
 * 获取游戏记录
 */
export const getGameRecord = async (host) => {
  if (!host) return
  try {
    const gameRecordDataStr = await host.Get_GameRecord()
    if (gameRecordDataStr) {
      const gameRecordDatas = JSON.parse(gameRecordDataStr)
      return gameRecordDatas
    } else {
      return null;
    }
  } catch (err) {
    console.error('Failed to get game record:', err)
  }
}

/**
 * 封装：每100ms自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startGetGameRecordsPolling = async (host) => {
  if (!host || gameRecordTimer) return

  const poll = async () => {
    try {
      await getGameRecord(host)
    } catch (err) {
      console.error('获取游戏记录异常:', err);
    } finally {
      gameRecordTimer = setTimeout(poll, 1000);
    }
  }

  // console.log('Get game records has been started (period: 1s)')

  await poll()
}

/**
 * 停止获取游戏记录
 */
export const stopGetGameRecordsPolling = () => {
  if (gameRecordTimer) {
    clearTimeout(gameRecordTimer);
    gameRecordTimer = null;
  }
};

/**
 * 1. 核心计算：跑步机与坐标逻辑
 */
const processCTreadmillLogic = (deviceData) => {
  const { extraData, connected } = deviceData;

  let show = true;

  const calculatePos = (current, isGround, speed) => {
    show = isGround;
    // 如果脚在地面或速度为0，重置回中心
    if (!isGround || (speed.x === 0 && speed.y === 0 && speed.z === 0)) {
      return { x: CENTER, y: CENTER, show: show };
    }
    // 增量计算位置
    const newX = current.x + (parseFloat(speed.x) * 3);
    const newY = current.y - (parseFloat(speed.z) * 3);

    return {
      x: Math.max(DOT_RADIUS, Math.min(GRID_SIZE - DOT_RADIUS, newX)),
      y: Math.max(DOT_RADIUS, Math.min(GRID_SIZE - DOT_RADIUS, newY)),
      show: show
    };
  };

  internalFootPos.left = calculatePos(internalFootPos.left, extraData.baseSDKinfo.isLeftGround, extraData.baseSDKinfo.lFootSpeed);
  internalFootPos.right = calculatePos(internalFootPos.right, extraData.baseSDKinfo.isRightGround, extraData.baseSDKinfo.rFootSpeed);

  return {
    treadmillData: {
      ...deviceData,
      direction: deviceData.deviceDatas[0],
      leftFoot: deviceData.deviceDatas[1],
      rightFoot: deviceData.deviceDatas[2]
    },
    leftFootPos: { ...internalFootPos.left },
    rightFootPos: { ...internalFootPos.right }
  };
};

/**
 * 2. 核心计算：头显设备判定逻辑
 */
const processCHeadsetLogic = async (host, headDisplayInfo) => {
  if (!headDisplayInfo) return null;
  const data = JSON.parse(headDisplayInfo);

  // 优先级判定：Oculus -> OpenVR -> OpenXR
  let targetDevice = null;
  let deviceType = '';

  if (data.oculusVRDevice?.ready) {
    targetDevice = data.oculusVRDevice;
    deviceType = 'oculus';
  } else if (data.openVRDevice?.ready) {
    targetDevice = data.openVRDevice;
    deviceType = 'openVR';
  } else if (data.openXRDevice?.ready) {
    targetDevice = data.openXRDevice;
    deviceType = 'openXR';
  }

  if (!targetDevice) return { angle: 0, rawData: {} };

  // 转换角度
  const rotation = targetDevice.hmdDevice.transforn.rotation;
  const convertedQuat = await host.ConvertAngles(JSON.stringify(rotation));
  const angle = normalizeHeadsetAngle(convertedQuat);

  return { angle, rawData: targetDevice, type: deviceType };
};

/**
 * 3. 核心计算：腰部角度逻辑
 */
const processCBodyLogic = async (host, deviceData) => {
  const { bodyRotationRaw } = deviceData;
  const myQuat = { w: bodyRotationRaw.w, x: bodyRotationRaw.x, y: bodyRotationRaw.y, z: bodyRotationRaw.z };
  const convertedQuat = await host.ConvertAngles(JSON.stringify(myQuat));
  return normalizeHeadsetAngle(convertedQuat);
};

export const getCSeriesDeviceDatas = async (host) => {
  if (!host || isProcessing) return

  isProcessing = true

  try {

    // 获取选中的设备
    const currentDevice = store.getters['device/getSelectedDevice']
    if (!currentDevice?.serialNumber) {
      store.commit(`${NAMESPACE}/RESET_C_TREADMILL_DATA`)
      return;
    }

    // 获取调用GetWalkStatusWalkCLocoS 获取跑步机数据
    const [walkStatus, headDisplayInfo] = await Promise.all([
      host.GetWalkStatusWalkCLocoS(currentDevice.serialNumber),
      host.ReadKatSteamStatus()
    ]);

    if (!walkStatus) return;

    // 跑步机数据
    const deviceData = JSON.parse(walkStatus);
    // 计算运动坐标
    const treadmillRes = processCTreadmillLogic(deviceData);
    // Body 数据，腰部角度
    const bodyAngle = await processCBodyLogic(host, deviceData);
    // 头显数据，原始头显信息
    const headsetRes = await processCHeadsetLogic(host, headDisplayInfo);

    const now = Date.now();

    if (now - lastCommitTime > COMMIT_INTERVAL) {
      // 减少 Vue 响应式开销
      store.commit(`${NAMESPACE}/SET_C_BATCH_DEVICE_DATA`, {
        treadmill: treadmillRes.treadmillData,
        leftFootPos: treadmillRes.leftFootPos,
        rightFootPos: treadmillRes.rightFootPos,
        bodyAngle: bodyAngle,
        headsetAngle: headsetRes.angle,
        headsetData: headsetRes.rawData
      });
      lastCommitTime = now;
    }
  } catch (err) {
    console.error('Failed to get C-series device data:', err)
  } finally {
    isProcessing = false
  }
}

/**
 * 1. 核心计算：跑步机与坐标逻辑
 */
const processC2TreadmillLogic = (deviceData) => {
  const { extraData, connected } = deviceData;

  let show = true;

  const calculatePos = (current, isGround, speed) => {
    show = isGround;
    // 如果脚在地面或速度为0，重置回中心
    if (!isGround || (speed.x === 0 && speed.y === 0 && speed.z === 0)) {
      return { x: CENTER, y: CENTER, show: show };
    }
    // 增量计算位置
    const newX = current.x + (parseFloat(speed.x) * 3);
    const newY = current.y - (parseFloat(speed.z) * 3);

    return {
      x: Math.max(DOT_RADIUS, Math.min(GRID_SIZE - DOT_RADIUS, newX)),
      y: Math.max(DOT_RADIUS, Math.min(GRID_SIZE - DOT_RADIUS, newY)),
      show: show
    };
  };

  internalFootPos.left = calculatePos(internalFootPos.left, extraData.isLeftGround, extraData.lFootSpeed);
  internalFootPos.right = calculatePos(internalFootPos.right, extraData.isRightGround, extraData.rFootSpeed);

  return {
    treadmillData: {
      ...deviceData,
      direction: deviceData.deviceDatas[0],
      leftFoot: deviceData.deviceDatas[1],
      rightFoot: deviceData.deviceDatas[2]
    },
    leftFootPos: { ...internalFootPos.left },
    rightFootPos: { ...internalFootPos.right }
  };
};

/**
 * 2. 核心计算：头显设备判定逻辑
 */
const processC2HeadsetLogic = async (host, headDisplayInfo) => {
  if (!headDisplayInfo) return null;
  const data = JSON.parse(headDisplayInfo);

  // 优先级判定：Oculus -> OpenVR -> OpenXR
  let targetDevice = null;
  let deviceType = '';

  if (data.oculusVRDevice?.ready) {
    targetDevice = data.oculusVRDevice;
    deviceType = 'oculus';
  } else if (data.openVRDevice?.ready) {
    targetDevice = data.openVRDevice;
    deviceType = 'openVR';
  } else if (data.openXRDevice?.ready) {
    targetDevice = data.openXRDevice;
    deviceType = 'openXR';
  }

  if (!targetDevice) return { angle: 0, rawData: {} };

  // 转换角度
  const rotation = targetDevice.hmdDevice.transforn.rotation;
  const convertedQuat = await host.ConvertAngles(JSON.stringify(rotation));
  const angle = normalizeHeadsetAngle(convertedQuat);

  return { angle, rawData: targetDevice, type: deviceType };
};

/**
 * 3. 核心计算：腰部角度逻辑
 */
const processC2BodyLogic = async (host, deviceData) => {
  const { bodyRotationRaw } = deviceData;
  const myQuat = { w: bodyRotationRaw.w, x: bodyRotationRaw.x, y: bodyRotationRaw.y, z: bodyRotationRaw.z };
  const convertedQuat = await host.ConvertAngles(JSON.stringify(myQuat));
  return normalizeHeadsetAngle(convertedQuat);
};

/**
 * 获取设备数据，步数数据从接口直接获取
 */
export const getC2SeriesDeviceDatas = async (host) => {
  if (!host || isProcessing) return

  isProcessing = true

  try {
    // 获取选中的设备
    const currentDevice = store.getters['device/getSelectedDevice']
    if (!currentDevice?.serialNumber) {
      store.commit(`${NAMESPACE}/RESET_C2_TREADMILL_DATA`)
      return;
    }

    // 调用GetWalkStatus 获取跑步机数据
    const [walkStatus, headDisplayInfo] = await Promise.all([
      host.GetWalkStatus(currentDevice.serialNumber),
      host.ReadKatSteamStatus()
    ]);

    if (!walkStatus) return;
    // 跑步机数据
    const deviceData = JSON.parse(walkStatus);
    // 计算运动坐标
    const treadmillRes = processC2TreadmillLogic(deviceData);
    // Body 数据，腰部角度
    const bodyAngle = await host.Get_Waist_Angle();
    // 头显数据，原始头显信息
    const headsetRes = await processC2HeadsetLogic(host, headDisplayInfo);

    const headsetAngle = await host.Get_HMD_Angle();

    const now = Date.now();

    if (now - lastCommitTime > COMMIT_INTERVAL) {
      // 减少 Vue 响应式开销
      store.commit(`${NAMESPACE}/SET_BATCH_DEVICE_DATA`, {
        treadmill: treadmillRes.treadmillData,
        leftFootPos: treadmillRes.leftFootPos,
        rightFootPos: treadmillRes.rightFootPos,
        bodyAngle: bodyAngle,
        headsetAngle: headsetAngle,
        headsetData: headsetRes.rawData
      });
      lastCommitTime = now;
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isProcessing = false
  }
}

/**
 * 封装：每20ms自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startGetDeviceDatasPolling = async (host) => {
  if (!host || dataPollingTimer) return;

  const poll = async () => {

    const currentDevice = store.getters['device/getSelectedDevice']

    if (!currentDevice?.serialNumber) {
      return;
    }

    if (currentDevice.deviceType === 2 || currentDevice.deviceType === 3) {
      await getCSeriesDeviceDatas(host)
    } else if (currentDevice.deviceType === 4 || currentDevice.deviceType === 8 || currentDevice.deviceType === 9) {
      await getC2SeriesDeviceDatas(host)
    }

  }

  console.log('Get Device Datas has been started')

  poll()
}

/**
 * 停止C2系列设备数据获取
 */
export const stopDeviceDataPolling = () => {
  if (dataPollingTimer) {
    clearTimeout(dataPollingTimer);
    dataPollingTimer = null;
  }
};

/**
 * C2系列设备数据实时处理
 */
export const dataStorageAndComputing = async (host) => {
  if (!host) return

  const currentDate = await getDate(host)
  const timeZone = await getTimeZone(host);

  const coefficient = Number(60 * 1.2 / 1000);

  let currentDateData = {
    currentDate: currentDate,
    timeZone: timeZone,
    stepCount: 0,
    calories: 0,
    meters: 0,
    walkingTime: 0
  }

  const deviceDataStr = await host.Get_GameRecord();

  if (deviceDataStr) {
    const deviceData = JSON.parse(deviceDataStr)

    // 实时计算，显示，每过一段时间将数据存入本地，防止丢失
    // 不能频繁读写JSON文件，造成I/O阻塞
    if (deviceData) {
      currentDateData.stepCount = deviceData.stepCount;
      // 根据步数实时计计算卡路里和行走里程
      const calories = Math.round(deviceData.stepCount * coefficient);
      currentDateData.calories = calories
      // 行走里程
      const meters = Number((Math.round(deviceData.stepCount * 0.7)).toFixed(2));
      currentDateData.meters = meters
      // 行走时间
      const walkingTime = Number((Math.round(deviceData.minutes / 60)).toFixed(2));
      currentDateData.walkingTime = walkingTime;
    }
  }

  return currentDateData;
};

/**
 * 封装：每100ms自动循环监听
 * 采用递归 setTimeout 确保不会发生调用堆积
 */
export const startGetWalkingDataPolling = async (host) => {
  if (!host || gameWalkingTimer) return

  const poll = async () => {
    try {
      return await dataStorageAndComputing(host)
    } catch (err) {
      console.error('获取数据异常:', err);
    } finally {
      gameWalkingTimer = setTimeout(poll, 100);
    }
  }

  await poll()
}

/**
 * 停用C2系列实时数据处理
 */
export const stopGetWalkingDataPolling = () => {
  if (gameWalkingTimer) {
    clearTimeout(gameWalkingTimer);
    gameWalkingTimer = null;
  }
}

/**
 * 启动轮询
 */
export const startPolling = async (host) => {
  if (!host || isPolling) return;
  isPolling = true;

  const poll = async () => {
    try {
      const data = await dataStorageAndComputing(host);
      if (data) {
        observers.forEach(callback => callback(data));
      }
    } catch (err) {
      console.error('采集异常:', err);
    } finally {
      if (isPolling) {
        gameWalkingTimer = setTimeout(poll, 100);
      }
    }
  };

  poll();
};

/**
 * @param {Object} host 设备对象
 * @param {Function} callback 数据回调
 * @returns {Function} stop 取消监听的方法
 */
export const watchWalkingData = (host, callback) => {
  // 将回调加入观察者名单
  observers.add(callback);

  // 尝试启动服务
  startPolling(host);

  // 返回一个用于“销毁”的函数
  return () => {
    observers.delete(callback);

    if (observers.size === 0) {
      isPolling = false;
      clearTimeout(gameWalkingTimer);
      gameWalkingTimer = null;
    }
  };
};

/**
 * 保存行走数据（global），将内存中数据存入JSON中
 */
export const saveWalkingDatas = async (host, data) => {
  if (!host) return

  const folderPath = `${new_GatewayPath}/${profilePath}`
  const stepsFileName = 'UserSteps.json'
  const today = data.currentDate;

  let allStepDatas = [];
  const fileExist = await checkStepConfiguration(host)

  if (fileExist) {
    const res = await host.ConfigRead(folderPath, stepsFileName);
    if (res) {
      const parsed = JSON.parse(res);
      if (parsed.result && parsed.data) allStepDatas = JSON.parse(parsed.data);
    }
  }

  // 找到今日记录
  let dayRecord = allStepDatas.find(item => item.date === today);
  if (!dayRecord) {
    dayRecord = { date: today, steps: 0, calories: 0, meters: 0, walkingTime: 0 };
    allStepDatas.push(dayRecord);
  }

  dayRecord.steps = data.steps
  dayRecord.calories = data.calories
  dayRecord.meters = data.meters
  dayRecord.walkingTime = data.walkingTime

  await host.ConfigWrite(folderPath, stepsFileName, JSON.stringify(allStepDatas))

  return dayRecord;
}

/**
 * 游戏数据目录检测
 */
export const checkGameUploadConfiguration = async (host) => {
  // 先从本地读取配置文件是否存在，不存在创建对应配置文件
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const stepsFileName = 'UploadGameRecords.json'
  const fileExist = await host.ConfigRead(folderPath, stepsFileName)
  if (fileExist) {
    const res = JSON.parse(fileExist)
    if (res.result) {
      return true
    }
    return false
  }
}

/**
 * 保存启动游戏后行走数据，将内存中数据存入JSON中
 */
export const saveGameRunningDatas = async (host, data) => {
  if (!host) return

  const folderPath = `${new_GatewayPath}/${profilePath}`
  const stepsFileName = 'UploadGameRecords.json'

  const fileExist = await checkGameUploadConfiguration(host)

  // 数据文件是否存在，不存在直接创建文件，写入数据
  if (!fileExist) {
    // 创建文件并写数据
    const userGameStepDatas = []
    userGameStepDatas.push(data)
    const content = JSON.stringify(userGameStepDatas)
    // 写入文件
    return await host.ConfigWrite(folderPath, stepsFileName, content)
  } else {
    // 读取文件，新增游戏数据
    let gameStepDatas = []

    const stepDatas = await host.ConfigRead(folderPath, stepsFileName)
    if (stepDatas) {
      const res = JSON.parse(stepDatas)
      if (res.result && res.data) {
        gameStepDatas = JSON.parse(res.data)
      }
    }

    if (gameStepDatas.length > 0) {
      // 往记录表里新增数据
      gameStepDatas.push(data)
      // 写入文件
      const content = JSON.stringify(gameStepDatas)
      // 写入文件
      return await host.ConfigWrite(folderPath, stepsFileName, content)
    } else {
      // 无数据，直接新增数据
      gameStepDatas.push(data)
      // 写入文件
      const content = JSON.stringify(gameStepDatas)
      // 写入文件
      return await host.ConfigWrite(folderPath, stepsFileName, content)
    }
  }
}

// 数据上传成功后，清除本地数据
export const clearGameRunningDatas = async (host) => {
  if (!host) return

  const folderPath = `${new_GatewayPath}/${profilePath}`
  const stepsFileName = 'UploadGameRecords.json'

  // 创建文件并写数据
  const userGameStepDatas = []
  const content = JSON.stringify(userGameStepDatas)
  // 写入文件
  return await host.ConfigWrite(folderPath, stepsFileName, content)
}

// 获取游戏数据
export const getGameRunningDatas = async (host) => {
  if (!host) return

  const folderPath = `${new_GatewayPath}/${profilePath}`
  const fileName = 'UploadGameRecords.json'

  const dataStr = await host.ConfigRead(folderPath, fileName)

  if (dataStr) {
    const res = JSON.parse(dataStr)
    if (res.result && res.data) {
      return JSON.parse(res.data)
    } else {
      return []
    }
  } else {
    return []
  }
}

export const deleteLocalRecord = async (host, recordId) => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const stepsFileName = 'UploadGameRecords.json'
  const fileExist = await host.ConfigRead(folderPath, stepsFileName)
  if (fileExist) {
    const res = JSON.parse(fileExist)
    if (res.result) {
      const gameStepDatas = JSON.parse(res.data)
      const newGameStepDatas = gameStepDatas.filter(item => item.recordId !== recordId)
      const content = JSON.stringify(newGameStepDatas)
      // 写入文件
      return await host.ConfigWrite(folderPath, stepsFileName, content)
    }
  }
}

// 实时获取臂带心率
export const getRealArmbandHeartRate = async (host) => {
  if (!host) return
  const rawData = await host.getArmbandInfo()
  if (rawData) {
    const heartRateData = JSON.parse(rawData)
    return heartRateData.data
  }
}