import CryptoJS from 'crypto-js'
import { gameThreads } from '@/api/game'

/**
 * 1.1
 * 获取系统当前时间
 * @export
 * @param {*} host
 * @return {*}
 */
export const getCurrentTime = async (host) => {
  return await host.GetCurrentTime()
}

/**
 * 1.2
 * 获取系统当前时区
 * @export
 * @param {*} host
 * @return {*}
 */
export const getTimeZone = async (host) => {
  return await host.GetTimeZone()
}

/**
 * 1.3
 * 获取设备插入数量（接收器）
 * @export
 * @param {*} host
 * @return {*}
 */
export const deviceCount = async (host) => {
  return await host.DeviceCount()
}

/**
 * 1.4
 * 通过DeviceCount返回的数量获取设备信息
 * @export
 * @param {*} host
 * @param {*} index
 * @return {*}
 */
export const getDevicesDesc = async (host, index) => {
  return await host.GetDevicesDesc(index)
}

/**
 * 1.5
 * 根据pid、vid获取设备是否插入
 * @export
 * @param {*} host
 * @param {*} pid
 * @param {*} vid
 * @return {*}
 */
export const getLocalHIDDeviceCount = async (host, pid, vid) => {
  return await host.GetLocalHIDDeviceCount(pid, vid)
}

/**
 * 1.6
 * 根据pid、vid和nIndex获取设备详细信息（坐姿接收器、传感器等等使用）
 * @export
 * @param {*} host
 * @param {*} pid
 * @param {*} vid
 * @param {*} index
 * @return {*}
 */
export const getLcoalHIDDevice = async (host, pid, vid, index) => {
  return await host.GetLcoalHIDDevice(pid, vid, index)
}

/**
 * 1.7
 * 根据serialNumber启动侦听
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const startListen = async (host, serialNumber) => {
  return await host.StartListen(serialNumber)
}

/**
 * 1.8
 * 根据serialNumber关闭侦听
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const stopListen = async (host, serialNumber) => {
  return await host.StopListen(serialNumber)
}

/**
 * 1.9
 * 获取设备连接状态 c2系列使用
 * @export
 * @param {*} host
 * @return {*}
 */
export const getDeviceConnection = async (host) => {
  return await host.GetDeviceConnection()
}

/**
 * 1.10
 * 通过serialNumber获取跑步机运动数据（C2、C2 Core、C2Plus）
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const getWalkStatus = async (host, serialNumber) => {
  return await host.GetWalkStatus(serialNumber)
}

/**
 * 1.11
 * 根据SN查询设备是否侦听
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const isDeviceListen = async (host, serialNumber) => {
  return await host.IsDeviceListen(serialNumber)
}

/**
 * 1.12
 * 设备是否正在被别的终端占用
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const isDeviceBusy = async (host, serialNumber) => {
  return await host.IsDeviceBusy(serialNumber)
}

/**
 * 1.13
 * 获取steam 游戏状态
 * @export
 * @param {*} host
 * @return {*}
 */
export const readKatSteamStatus = async (host) => {
  return await host.ReadKatSteamStatus()
}

/**
 * 1.14
 * 四元素转换成角度
 * @export
 * @param {*} host
 * @param {*} quaternion
 * @return {*}
 */
export const convertAngles = async (host, quaternion) => {
  return await host.ConvertAngles(quaternion)
}

/**
 * 1.15
 * 设置窗体状态（Normal、Minimized、Maximized）
 * @export
 * @param {*} host
 * @param {*} state
 * @return {*}
 */
export const setFormState = async (host, state) => {
  return await host.SetFormState(state)
}

/**
 * 1.16
 * 获取窗体状态
 * @export
 * @param {*} host
 * @return {*}
 */
export const getFormState = async (host) => {
  return await host.GetFormState()
}

/**
 * 1.17
 * 设置窗体大小
 * @export
 * @param {*} host
 * @param {*} width
 * @param {*} height
 * @return {*}
 */
export const setFormSize = async (host, width, height) => {
  return await host.SetFormSize(width, height)
}

/**
 * 1.18
 * 获取窗体大小
 * @export
 * @param {*} host
 * @return {*}
 */
export const getFormSize = async (host) => {
  return await host.GetFormSize()
}

/**
 * 1.19
 * 关闭窗体
 * @export
 * @param {*} host
 * @return {*}
 */
export const formClose = async (host) => {
  return await host.FormClose()
}

/**
 * 1.20
 * 获取C2 系列设备的MAC地址
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const getSensorInformation = async (host, serialNumber) => {
  return await host.GetSensorInformation(serialNumber)
}

/**
 * 1.21
 * C2系列设置设备id
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @param {*} id
 * @return {*}
 */
export const writeDeviceId = async (host, serialNumber, id) => {
  return await host.WriteDeviceId(serialNumber, id)
}

/**
 * 1.22
 * C2系列获取设备id
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const readDeviceId = async (host, serialNumber) => {
  return await host.ReadDeviceId(serialNumber)
}

/**
 * 1.23
 * C2系列写入配对信息（将配对信息写入接收器中）
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @param {*} macCount
 * @param {*} macObj
 * @return {*}
 */
export const writeSensorPair = async (host, serialNumber, macCount, macObj) => {
  return await host.WriteSensorPair(serialNumber, macCount, macObj)
}

/**
 * 1.24
 * C2 系列 设置深度休眠
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @param {*} type
 * @return {*}
 */
export const deepSleep = async (host, serialNumber, type) => {
  return await host.DeepSleep(serialNumber, type)
}

/**
 * 1.25
 * 启动坐姿侦听
 * @export
 * @param {*} host
 * @param {*} receiverDeviceDesc
 * @param {*} sittingDeviceDesc
 * @return {*}
 */
export const c2SittingStartListen = async (host, receiverDeviceDesc, sittingDeviceDesc) => {
  return await host.C2SittingStartListen(receiverDeviceDesc, sittingDeviceDesc)
}

/**
 * 1.26
 * 关闭坐姿侦听
 * @export
 * @param {*} host
 * @return {*}
 */
export const c2SittingStopListen = async (host) => {
  return await host.C2SittingStopListen()
}

/**
 * 1.27
 * 控制C2系列底盘震动
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @param {*} level
 * @return {*}
 */
export const c2Vibration = async (host, serialNumber, level) => {
  return await host.C2Vibration(serialNumber, level)
}

/**
 * 1.28
 * 获取坐姿通讯信息
 * @export
 * @param {*} host
 * @return {*}
 */
export const getC2VehicleInfo = async (host) => {
  return await host.GetC2VehicleInfo()
}

/**
 * 1.29
 * C2系列坐姿配对
 * @export
 * @param {*} host
 * @return {*}
 */
export const c2VehiclePairing = async (host) => {
  return await host.C2VehiclePairing()
}

/**
 * 1.30
 * 结束坐姿配对
 * @export
 * @param {*} host
 * @return {*}
 */
export const c2VehiclePairingEnd = async (host) => {
  return await host.C2VehiclePairingEnd()
}

/**
 * 1.31
 * 获取坐姿配对状态
 * @export
 * @param {*} host
 * @return {*}
 */
export const getVehiclePairingState = async (host) => {
  return await host.GetVehiclePairingState()
}

/**
 * 1.32
 * 获取坐姿配对结果
 * @export
 * @param {*} host
 * @return {*}
 */
export const getVehiclePairingResult = async (host) => {
  return await host.GetVehiclePairingResult()
}

/**
 * 1.33
 * 获取坐姿配对成功后的接收器、传感器信息
 * @export
 * @param {*} host
 * @return {*}
 */
export const getVehiclePairingInfo = async (host) => {
  return await host.GetVehiclePairingInfo()
}

/**
 * 1.33
 * 读取设备配对信息（gateway2.0之前的数据）
 * @export
 * @param {*} host
 * @param {*} deviceType（1：loco，2：loco s，3：walk c，4：walk c 2，8：walk c 2 core，9：walk c 2 plus enhanced）
 * @return {*}
 */
export const getDevicePairingInfo = async (host, deviceType) => {
  return await host.GetDevicePairingInfo(deviceType)
}

/**
 * 1.34
 * 写入文件内容
 * @export
 * @param {*} host
 * @param {*} folder
 * @param {*} fileName
 * @param {*} content
 * @return {*}
 */
export const configWrite = async (host, folder, fileName, content) => {
  return await host.ConfigWrite(folder, fileName, content)
}

/**
 * 1.35
 * 读取文件内容
 * @export
 * @param {*} host
 * @param {*} folder
 * @param {*} fileName
 * @return {*}
 */
export const configRead = async (host, folder, fileName) => {
  return await host.ConfigRead(folder, fileName)
}

/**
 * 1.36
 * 臂带是否侦听
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const armbandIsListenDevice = async (host, serialNumber) => {
  return await host.ArmbandIsListenDevice(serialNumber)
}

/**
 * 1.37
 * 臂带启动侦听
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const armbandStartListen = async (host, serialNumber) => {
  return await host.ArmbandStartListen(serialNumber)
}

/**
 * 1.38
 * 臂带停止侦听
 * @export
 * @param {*} host
 * @return {*}
 */
export const armbandStopListen = async (host) => {
  return await host.ArmbandStopListen()
}

/**
 * 1.39
 * 获取臂带通讯信息
 * @export
 * @param {*} host
 * @return {*}
 */
export const getArmbandInfo = async (host) => {
  return await host.GetArmbandInfo()
}

/**
 * 1.40
 * 断开臂带配对
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const armbandBreak = async (host, serialNumber) => {
  return await host.ArmbandBreak(serialNumber)
}

/**
 * 1.41
 * 臂带配对
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const armbandConnect = async (host, serialNumber) => {
  return await host.ArmbandConnect(serialNumber)
}

/**
 * 1.42
 * 获取臂带配对状态
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const getConnectState = async (host, serialNumber) => {
  return await host.GetConnectState(serialNumber)
}

/**
 * 1.43
 * 校准
 * @export
 * @param {*} host
 * @return {*}
 */
export const calibration = async (host) => {
  return await host.Calibration()
}

/**
 * 1.44
 * 是否正在校准
 * @export
 * @param {*} host
 * @return {*}
 */
export const checkCalibration = async (host) => {
  return await host.CheckCalibration()
}

/**
 * 1.45
 * 通过serialNumber获取walk c、locos跑步机运动数据
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const getWalkStatusWalkCLocoS = async (host, serialNumber) => {
  return await host.GetWalkStatusWalkCLocoS(serialNumber)
}

/**
 * 1.46
 * 获取walk c接收器sn
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const walkcGetReceiverSn = async (host) => {
  return await host.WalkC_Get_Receiver_SN()
}

/**
 * 1.47
 * 获取walk c脚步sn
 * @export
 * @param {*} host
 * @return {*}
 */
export const walkcInterfaceGetFootSensorSerialNumber = async (host) => {
  return await host.WalkC_Interface_Get_Foot_Sensor_Serial_Number()
}

/**
 * 1.48
 * 设置walkc脚步休眠模式
 * @export
 * @param {*} host
 * @param {*} type 0: 进入深度休眠 1:解除深度休眠
 * @return {*}
 */
export const walkcInterfaceSetFootSensorDeepSleepStatus = async (host, type) => {
  return await host.WalkC_Interface_Set_Foot_Sensor_Deep_Sleep_Status(type)
}

/** 1.49
 * 设置walkc脚步类型
 * @export
 * @param {*} host
 * @param {*} type 2: 左脚 3: 右脚
 * @return {*}
 */
export const walkcAnklePacketDeviceAddressSet = async (host, type) => {
  return await host.WalkC_Ankle_PACKET_DEVICE_ADDRESS_SET(type)
}

/**
 * 1.50
 * 获取walk 脚步mac
 * @export
 * @param {*} host
 * @return {*}
 */
export const walkcInterfaceGetMacFromSensor = async (host, type) => {
  return await host.WalkC_Interface_Get_MAC_From_Sensor(type)
}

/**
 * 1.51
 * 将walkc获取的脚步mac写入到接收器里
 * @export
 * @param {*} host
 * @param {*} type 2: 左脚 3: 右脚
 * @return {*}
 */
export const walkcInterfaceSetMacToReceiverSensor = async (host, type) => {
  return await host.WalkC_Interface_Set_MAC_To_Receiver_Sensor(type)
}

/**
 * 1.52
 * 获取walk c震动模块是否存在
 * @export
 * @param {*} host
 * @return {*}
 */
export const walkcHapticModuleCheck = async (host) => {
  return await host.WalkC_Haptic_Module_Check()
}

/**
 * 1.53
 * 获取locos 接收器sn
 * @export
 * @param {*} host
 * @param {*} type
 * @return {*}
 */
export const locosGetReceiverSn = async (host) => {
  return await host.LocoS_Get_Receiver_SN()
}

/**
 * 1.54
 * 获取locos 腰部sn
 * @export
 * @param {*} host
 * @return {*}
 */
export const locosWaistSerialNumberGet = async (host) => {
  return await host.LocoS_Waist_Serial_Number_Get()
}

/**
 * 1.55
 * locos深度休眠设置
 * @export
 * @param {*} host
 * @param {*} type 0: 进入深度休眠 1:解除深度休眠
 * @return {*}
 */
export const locosWaistDeepSleepStatusSet = async (host, type) => {
  return await host.LocoS_Waist_Deep_Sleep_Status_Set(type)
}

/**
 * 1.56
 * 获取locos传感器mac地址
 * @export
 * @param {*} host
 * @param {*} type 1: 获取方向传感器 2: 获取脚步传感器
 * @return {*}
 */
export const locosGetMacFromSensor = async (host, type) => {
  return await host.LocoS_Get_MAC_From_Sensor(type)
}

/**
 * 1.57
 * locos - 将获取的mac地址写入到接收器中
 * @export
 * @param {*} host
 * @param {*} type 1: 设置方向 2: 设置左脚 3: 设置右脚
 * @return {*}
 */
export const locosSetMacToReceiver = async (host, type) => {
  return await host.LocoS_Set_MAC_To_Receiver(type)
}

/**
 * 1.58
 * locos - 将获取脚步sn
 * @export
 * @param {*} host
 * @return {*}
 */
export const locosAnkleSerialNumberGet = async (host) => {
  return await host.LocoS_Ankle_Serial_Number_Get()
}

/**
 * 1.59
 * locos - 设置脚步传感器深度休眠
 * @export
 * @param {*} host
 * @param {*} type 0: 进入深度休眠 1:解除深度休眠
 * @return {*}
 */
export const locosAnkleDeepSleepStatusSet = async (host, type) => {
  return await host.LocoS_Ankle_Deep_Sleep_Status_Set(type)
}

/**
 * 1.60
 * locos - 设置脚步mac地址
 * @export
 * @param {*} host
 * @param {*} type 2: 左脚 3: 右脚
 * @return {*}
 */
export const locosAnklePacketDeviceAddressSet = async (host, type) => {
  return await host.LocoS_Ankle_PACKET_DEVICE_ADDRESS_SET(type)
}

/**
 * 1.61
 * 获取电脑信息
 * @export
 * @param {*} host
 * @return {*}
 */
export const getComputerInfo = async (host) => {
  return await host.GetComputerInfo()
}

/**
 * 1.62
 * 执行adb命令
 * @export
 * @param {*} host
 * @param {*} str
 * @return {*}
 */
export const runAdb = async (host, str) => {
  return await host.RunADB(str)
}

/**
 * 1.63
 * quest头显是否连接
 * @export
 * @param {*} host
 * @return {*}
 */
export const isQuestConnect = async (host) => {
  return await host.IsQuestConnect()
}

/**
 * 1.64
 * 头显是否连接了wifi
 * @export
 * @param {*} host
 * @return {*}
 */
export const isConnectedToWifi = async (host) => {
  return await host.IsConnectedToWifi()
}

/**
 * 1.65
 * 给头显安装apk
 * @export
 * @param {*} host
 * @param {*} path
 * @return {*}
 */
export const installApk = async (host, path) => {
  return await host.InstallApk(path)
}

/**
 * 1.66
 * 修复
 * @export
 * @param {*} host
 * @return {*}
 */
export const fix = async (host) => {
  return await host.FIX()
}

/**
 * 1.67
 * 获取c2系列接收器传感器版本号
 * 根据sn获取固件版本 --c2系列接收器，方向，左右脚都能获取  0表示未获取到，-1表示接收器坏掉,大于0是版本号
 * @export
 * @param {*} host
 * @param {*} serialNumber
 * @return {*}
 */
export const getVersion = async (host, serialNumber) => {
  return await host.Get_Version(serialNumber)
}

/**
 * 1.68
 * c2 固件更新相关 - 查找设备
 * @export
 * @param {*} host
 * @return {*}
 */
export const ch9326Find = async (host) => {
  return await host.ch9326_find()
}

/**
 * 1.69
 * c2系列固件更新--打开设备
 * @export
 * @param {*} host
 * @param {*} vid
 * @param {*} pid
 * @return {*}
 */
export const ch9326Open = async (host, vid, pid) => {
  return await host.ch9326_open(vid, pid)
}

/**
 * 1.70
 * c2系列固件更新--设置芯片的GPIO功能
 * @export
 * @param {*} host
 * @param {*} index
 * @param {*} dir
 * @param {*} data
 * @return {*}
 */
export const ch9326SetGpio = async (host, index, dir, data) => {
  return await host.ch9326_set_gpio(index, dir, data)
}

/**
 * 1.71
 * c2系列固件更新--连接
 * @export
 * @param {*} host
 * @param {*} index
 * @return {*}
 */
export const ch9326Connected = async (host, index) => {
  return await host.ch9326_connected(index, dir)
}

/**
 * 1.72
 * c2系列固件更新--更新
 * @export
 * @param {*} host
 * @param {*} path
 * @param {*} type
 * @param {*} state
 * @return {*}
 */
export const flash = async (host, path, type, state) => {
  return await host.flash(path, type, state)
}

/**
 * 1.73
 * c2系列固件更新--清除线程数据缓冲区
 * @export
 * @param {*} host
 * @return {*}
 */
export const ch9326ClearThreadData = async (host) => {
  return await host.ch9326_ClearThreadData()
}

/**
 * 1.74
 * c2系列固件更新--关闭设备
 * @export
 * @param {*} host
 * @return {*}
 */
export const closeCh9326 = async (host) => {
  return await host.close_ch9326()
}

/**
 * 1.75
 * 启动KATArmViewOverlay（启动overlay让在vr里显示，2s调用一次，如果已启动下次调用不会再启动）
 * @export
 * @param {*} host
 * @return {*}
 */
export const openKatArmViewOverlay = async (host) => {
  return await host.OpenKATArmViewOverlay()
}

/**
 * 1.76
 * 关闭KATArmViewOverlay
 * @export
 * @param {*} host
 * @return {*}
 */
export const closeKatArmViewOverlay = async (host) => {
  return await host.CloseKATArmViewOverlay()
}

/**
 * 1.77
 * 传递overlay设置的参数
 * @export
 * @param {*} host
 * @param {*} config JSON
 * @return {*}
 */
export const toKatArmviewConfig = async (host, config) => {
  return await host.To_KAT_Armview_Config(config)
}

/**
 * 1.78
 * 传递VR HUD设置的参数
 * @export
 * @param {*} host
 * @param {*} config
 * @return {*}
 */
export const toKatVrHudConfig = async (host, config) => {
  return await host.To_KAT_VR_HUD_Config(config)
}

/**
 * 1.79
 * 启动vr内平台
 * @export
 * @param {*} host
 * @return {*}
 */
export const openKatGatewayOverlay = async (host) => {
  return await host.OpenKATGatewayOverlay()
}

/**
 * 1.80
 * 关闭vr内平台
 * @export
 * @param {*} host
 * @return {*}
 */
export const closeKatGatewayOverlay = async (host) => {
  return await host.CloseKATGatewayOverlay()
}

/**
 * 1.81
 * 启动监控游戏运行的线程
 * @export
 * @param {*} host
 * @param {*} gameList
 * @return {*}
 */
export const openRunGameThread = async (host, gameList) => {
  return await host.OpenRunGameThread(gameList)
}

/**
 * 1.82
 * 获取正在运行的游戏
 * @export
 * @param {*} host
 * @return {*}
 */
export const getRunGame = async (host) => {
  return await host.GetRunGame()
}

/**
 * 1.83
 * 获取steam游戏是否安装
 * @export
 * @param {*} host
 * @param {*} steamId
 * @return {*}
 */
export const getGameInstalledStatus = async (host, steamId) => {
  return await host.Get_Game_Installed_Status(steamId)
}

/**
 * 1.84
 * 获取steam游戏是否运行
 * @export
 * @param {*} host
 * @param {*} steamId
 * @return {*}
 */
export const getGameRunningStatus = async (host, steamId) => {
  return await host.Get_Game_Running_Status(steamId)
}

/**
 * 1.85
 * 根据steamId打开steam商店
 * @export
 * @param {*} host
 * @param {*} steamId
 * @return {*}
 */
export const openStoreBySteamId = async (host, steamId) => {
  return await host.Open_Store_By_Steam_ID(steamId)
}

/**
 * 1.86
 * 检查steam是否安装
 * @export
 * @param {*} host
 * @return {*}
 */
export const checkSteamInstalled = async (host) => {
  return await host.Check_Steam_Installed()
}

/**
 * 1.87
 * 自定义程序命令
 * 传递参数: string exeName, string commands  如传"explorer.exe"，"steam://rungameid/250820"
 * @export
 * @param {*} host
 * @param {*} command1
 * @param {*} command2
 * @return {*}
 */
export const customProgramCommands = async (host, command1, command2) => {
  return await host.CustomProgram_Commands(command1, command2)
}

/**
 * 1.88
 * 根据进程名获取是否正在运行
 * @export
 * @param {*} host
 * @param {*} processName
 * @return {*}
 */
export const getProcessesByNameLength = async (host, processName) => {
  return await host.GetProcessesByNameLength(processName)
}

/**
 * 1.89
 * 打开页面
 * @export
 * @param {*} host
 * @param {*} str
 * @return {*}
 */
export const openUrl = async (host, str) => {
  return await host.OpenUrl(str)
}

/**
 * 1.90
 * 启动KATHandlerWatcher
 * 启动OpenKATHandlerWatcher.exe ，一直调用每个2s调用一次，是获取各平台头显相关数据的进程
 * @export
 * @param {*} host
 * @return {*}
 */
export const openKatHandlerWatcher = async (host) => {
  return await host.OpenKATHandlerWatcher()
}

/**
 * 1.91
 * 关闭KATHandlerWatcher
 * @export
 * @param {*} host
 * @return {*}
 */
export const closeKatHandlerWatcher = async (host) => {
  return await host.CloseKATHandlerWatcher()
}

/**
 * 1.92
 * 启动KATInPutService
 * 启动OpenKATInPutService.exe ，2s调用一次
 * @export
 * @param {*} host
 * @return {*}
 */
export const openKatInPutService = async (host) => {
  return await host.OpenKATinPutService()
}

/**
 * 1.93
 * 关闭KATinPutService
 * @export
 * @param {*} host
 * @return {*}
 */
export const closeKatInPutService = async (host) => {
  return await host.CloseKATinPutService()
}

/**
 * 1.94
 * 设置速度等参数
 * @export
 * @param {*} host
 * @return {*}
 */
export const driverConfigToVr = async (host, config) => {
  return await host.DRIVER_CONFIG_To_VR(config)
}

/**
 * 1.95
 * 设置inputconfig
 * @export
 * @param {*} host
 * @return {*}
 */
export const inputConfigToVr = async (host, config) => {
  return await host.INPUT_CONFIG_To_VR(config)
}

/**
 * 1.96
 * 设置坐姿相关参数
 * @export
 * @param {*} host
 * @return {*}
 */
export const driverConfigVehicle = async (host, config) => {
  return await host.DRIVER_CONFIG_Vehicle(config)
}

/**
 * 1.97
 * 设置震动相关参数
 * @export
 * @param {*} host
 * @return {*}
 */
export const driverConfigHaptics = async (host, config) => {
  return await host.DRIVER_CONFIG_Haptics(config)
}

/**
 * 1.98
 * 设置游戏相关参数
 * @export
 * @param {*} host
 * @param {*} config
 * @return {*}
 */
export const KatGameConfigToVR = async (host, config) => {
  return await host.KATGameConfig_ToVR(config)
}

/**
 * 1.99
 * 启动固件更新（walkc、locos设备）
 * 设备类型loco = 1,loco_s = 2, walk_c = 3
 * Receiver=0,Left=1,Waist=2,Right=3,Ankle=4
 * @export
 * @param {*} host
 * @return {*}
 */
export const devicesFirmwareUpdateStart = async (host, deviceType, sensorType) => {
  return await host.Devices_Firmware_Update_Start(deviceType, sensorType)
}

/**
 * 1.100
 * 获取固件更新进度
 * @export
 * @param {*} host
 * @return {*}
 */
export const firmwareUpdateProcessPercent = async (host) => {
  return await host.Firmware_Update_Process_Percent()
}

/**
 * 1.101
 * 获取固件更新状态
 * @export
 * @param {*} host
 * @return {*}
 */
export const firmwareUpdateStatus = async (host) => {
  return await host.Firmware_Update_Status()
}

/**
 * 1.102
 * 获取臂带数据
 * @export
 * @param {*} host
 * @return {*}
 */
export const armbandDataRead = async (host) => {
  return await host.ArmbandDataRead()
}

/**
 * 1.103
 * 查询臂带数据 sql语句
 * @export
 * @param {*} host
 * @return {*}
 */
export const getArmbandModeList = async (host, sql) => {
  return await host.GetArmbandModeList(sql)
}

/**
 * 1.104
 * 修改臂带数据--数据库
 * @export
 * @param {*} host
 * @return {*}
 */
export const updayeArmbandData = async (host, data) => {
  return await host.getArmbandUpdate(data)
}

/**
 * 1.105
 * 添加臂带数据--数据库
 * @export
 * @param {*} host
 * @return {*}
 */
export const addArmbandData = async (host, data) => {
  return await host.getArmbandUpdate(data)
}

/**
 * 1.106
 * 执行sql语句返回受影响的行数
 * @export
 * @param {*} host
 * @return {*}
 */
export const updateArmbandRows = async (host, sql) => {
  return await host.GetArmbandUpdate(sql)
}

/**
 * 1.107
 * 执行sql语句返回dateset字符串
 * @export
 * @param {*} host
 * @return {*}
 */
export const gatewayQuery = async (host, sql) => {
  return await host.GatewayQuery(sql)
}

/**
 * 1.108
 * 执行sql语句返回dateset字符串
 * @export
 * @param {*} host
 * @param {*} state
 * @return {*}
 */
export const regeditLaunchBootChange = async (host, state) => {
  return await host.Regedit_Launch_Boot_Change(state)
}

// 获取设备信息
export const getDeviceInfo = async (host) => {
  return await host.GetComputerInfo()
}

// 获取设备ID
export const getDeviceId = async (host) => {
  const data = await host.GetComputerInfo()

  if (data) {
    const { SerialNumber, CpuID, MacAddress } = JSON.parse(data)
    if (SerialNumber) {
      return CryptoJS.MD5(SerialNumber).toString()
    } else {
      return CryptoJS.MD5(CpuID + MacAddress).toString()
    }
  }
  return null
}

// 获取Steam游戏 ID 列表，用于启动监控游戏运行的线程
export const getGameThreadData = async () => {
  try {
    const res = await gameThreads();
    if (res.code === 20000 && res.data.length > 0) {
      return JSON.stringify(res.data);
    }
    return null;
  } catch (error) {
    return null;
  }
};

// 启动监控游戏运行的线程
export const runGameThreadSync = async (host, steamGames) => {
  if (!steamGames) return;
  await openRunGameThread(host, steamGames);
};

//根据根据游戏name和路径 查询游戏下面的文件
export const searchGameConfigurationFile = async (host, path, gameName) => {
  return await host.SearchGameConfigurationFile(path, gameName)
}

//替换特殊字符，以防创建文件夹时出错
export const sanitizedFolderName = async (host, folderName) => {
  return await host.SanitizedFolderName(folderName)
}

//删除文件
export const deleteFile = async (host, folder, filename) => {
  return await host.DeleteFile(folder, filename)
}

