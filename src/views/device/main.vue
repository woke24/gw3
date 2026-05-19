<template>
  <div :class="['dashboard-container', { 'three-column-mode': isDetailMode }]">
    <div class="left-panel">
      <div v-if="!isDetailMode" class="wide-robot-info" :style="{ backgroundImage: `url(${widebg})` }">
        <div class="device-info">
          <div class="headsetAdirection">
            <div class="headsetVal">{{ headsetAngle }}°</div>
          </div>
          <div class="bodyDirection">
            <div class="bodyDirectionVal">{{ bodyAngle }}°</div>
          </div>
          <div class="rightFootSensor">
            <div class="rightFootSensorVal">
              <div class="grid" ref="grid1">
                <div class="cross center-x"></div>
                <div class="cross center-y"></div>
                <div v-show="rightFooterPosition.show" class="dot" :style="{
                  transform: `translate(${rightFooterPosition.x - 5}px, ${rightFooterPosition.y - 5
                    }px)`
                }"></div>
              </div>
            </div>
          </div>
          <div class="leftFootSensor">
            <div class="leftFootSensorVal">
              <div class="grid" ref="grid1">
                <div class="cross center-x"></div>
                <div class="cross center-y"></div>
                <div v-show="leftFooterPosition.show" class="dot" :style="{
                  transform: `translate(${leftFooterPosition.x - 5}px, ${leftFooterPosition.y - 5
                    }px)`
                }"></div>
              </div>
            </div>
          </div>
          <div class="vrAmband">
            <div class="vrAmbandVal">{{ heartRate }}</div>
          </div>
          <div class="calibration" @click="handleCalibration">Desktop Calibration</div>
        </div>
      </div>
      <div v-else class="narrow-robot-info" :style="{ backgroundImage: `url(${narrowbg})` }">
        <div class="device-info">
          <div class="headsetAdirection">
            <div class="headsetVal">{{ headsetAngle }}°</div>
          </div>
          <div class="bodyDirection">
            <div class="headsetVal">{{ bodyAngle }}°</div>
          </div>
          <div class="rightFootSensor">
            <div class="rightFootVal">
              <div class="grid" ref="grid1">
                <div class="cross center-x"></div>
                <div class="cross center-y"></div>
                <div class="dot" :style="{
                  transform: `translate(${rightFooterPosition.x - 5}px, ${rightFooterPosition.y - 5
                    }px)`
                }"></div>
              </div>
            </div>
          </div>
          <div class="leftFootSensor">
            <div class="letFootVal">
              <div class="grid" ref="grid1">
                <div class="cross center-x"></div>
                <div class="cross center-y"></div>
                <div class="dot" :style="{
                  transform: `translate(${leftFooterPosition.x - 5}px, ${leftFooterPosition.y - 5
                    }px)`
                }"></div>
              </div>
            </div>
          </div>
          <div class="vrAmband">
            <div class="vrAmbandVal">{{ heartRate }}</div>
          </div>
          <div class="calibration" @click="handleCalibration">Desktop Calibration</div>
        </div>
      </div>
    </div>

    <div class="middle-panel">
      <div class="add-button-header" @click="handleAddDevice">
        <!-- <span class="plus-icon">+</span> -->
        <el-icon color="#67707B" size="24">
          <Plus />
        </el-icon>
      </div>

      <div class="device-list">
        <div :class="['device-card', { 'is-active': headSelected }]" @click="handleSelectDevice('headset')"
          :style="{ height: `${calculatedCarouselHeight}px` }">
          <div class="device-sensor-info">
            <div class="sensor-name">
              <h3 class="device-name" style="text-transform: capitalize;">{{ hmdDeviceInfo?.deviceName }}</h3>
            </div>
            <div class="device-sensor-item">
              <div class="sensor-headset">
                <div class="sensor-headset-name">
                  <div class="icon">
                    <!-- <img src="@/assets/product/headset.png" alt="" /> -->
                    <SvgIcon name="headset" width="16px" height="16px" />
                  </div>
                  <div class="name">{{ $t('message.main.peripherals.headSet') }}</div>
                </div>
                <div class="sensor-headset-battery">
                  <div class="sensor-status">
                    <div v-if="deviceStatus" class="connected"></div>
                    <div v-else class="disconnected"></div>
                  </div>
                  <div class="sensor-battery">
                    <Battery v-if="deviceStatus" :quantity="100" :proIsCharge="false" />
                  </div>
                </div>
              </div>
              <div class="sensor-lcontroller">
                <div class="sensor-lcontroller-name">
                  <div class="icon">
                    <!-- <img src="@/assets/product/left_control.png" alt="" /> -->
                    <svgIcon name="lcontroller" width="16px" height="16px" />
                  </div>
                  <div class="name">{{ $t('message.main.peripherals.leftController') }}</div>
                </div>
                <div class="sensor-lcontroller-battery">
                  <div class="sensor-status">
                    <div v-if="deviceStatus" class="connected"></div>
                    <div v-else class="disconnected"></div>
                  </div>
                  <div class="sensor-battery">
                    <Battery v-if="deviceStatus" :quantity="100" :proIsCharge="false" />
                  </div>
                </div>
              </div>
              <div class="sensor-rcontroller">
                <div class="sensor-rcontroller-name">
                  <div class="icon">
                    <!-- <img src="@/assets/product/right_control.png" alt="" /> -->
                    <svgIcon name="rcontroller" width="16px" height="16px" />
                  </div>
                  <div class="name">{{ $t('message.main.peripherals.rightController') }}</div>
                </div>
                <div class="sensor-rcontroller-battery">
                  <div class="sensor-status">
                    <div v-if="deviceStatus" class="connected"></div>
                    <div v-else class="disconnected"></div>
                  </div>
                  <div class="sensor-battery">
                    <Battery v-if="deviceStatus" :quantity="100" :proIsCharge="false" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="device-img-thumbnail">
            <img src="@/assets/product/head.png" alt="" v-nodrag />
          </div>
        </div>
        <div :class="['device-card', { 'is-active': deviceSelected }]" @click="handleSelectDevice('device')"
          :style="{ height: `${calculatedCarouselHeight}px` }">
          <div class="device-sensor-info">
            <div class="sensor-name">
              <h3 class="device-name">
                {{ currentConnectedDevice?.deviceName }}
              </h3>
            </div>
            <div class="device-sensor-item">
              <div class="sensor-direction">
                <div class="sensor-direction-name">
                  <div class="icon">
                    <!-- <img src="@/assets/product/direction.png" alt="" /> -->
                    <svgIcon name="direction" width="16px" height="16px" />
                  </div>
                  <div class="name">{{ $t('message.main.device.directionSensor') }}</div>
                </div>
                <div class="sensor-direction-battery">
                  <div class="sensor-status">
                    <div v-if="treadMillData.connected" class="connected"></div>
                    <div v-else class="disconnected"></div>
                  </div>
                  <div class="sensor-battery">
                    <Battery v-if="treadMillData.connected && treadMillData.direction.batteryLevel > 0"
                      :quantity="treadMillData.direction.batteryLevel * 100"
                      :proIsCharge="treadMillData.direction.isBatteryCharging" />
                  </div>
                  <div class="battery-quatity"
                    v-if="treadMillData.connected && treadMillData.direction.batteryLevel > 0">
                    <span v-if="parseInt(treadMillData.direction.batteryLevel * 100) >= 30" class="battery-quatity-text"
                      style="color: #13ce66">
                      {{ parseInt(treadMillData.direction.batteryLevel * 100) }}%
                    </span>
                    <span v-else-if="parseInt(treadMillData.direction.batteryLevel * 100) >= 15"
                      class="battery-quatity-text" style="color: #ffba00">
                      {{ parseInt(treadMillData.direction.batteryLevel * 100) }}%
                    </span>
                    <span v-else-if="parseInt(treadMillData.direction.batteryLevel * 100) >= 5"
                      class="battery-quatity-text" style="color: #ff4949">
                      {{ parseInt(treadMillData.direction.batteryLevel * 100) }}%
                    </span>
                  </div>
                </div>
              </div>
              <div class="sensor-lfoot">
                <div class="sensor-lfoot-name">
                  <div class="icon">
                    <!-- <img src="@/assets/product/left_foot.png" alt="" /> -->
                    <svgIcon name="lfoot" width="16px" height="16px" />
                  </div>
                  <div class="name">{{ $t('message.main.device.leftFootSensor') }}</div>
                </div>
                <div class="sensor-lfoot-battery">
                  <div class="sensor-status">
                    <div v-if="treadMillData.connected" class="connected"></div>
                    <div v-else class="disconnected"></div>
                  </div>
                  <div class="sensor-battery">
                    <Battery v-if="treadMillData.connected && treadMillData.leftFoot.batteryLevel > 0"
                      :quantity="treadMillData.leftFoot.batteryLevel * 100"
                      :proIsCharge="treadMillData.leftFoot.isBatteryCharging" />
                  </div>
                  <div class="battery-quatity"
                    v-if="treadMillData.connected && treadMillData.leftFoot.batteryLevel > 0">
                    <span v-if="parseInt(treadMillData.leftFoot.batteryLevel * 100) >= 30" class="battery-quatity-text"
                      style="color: #13ce66">
                      {{ parseInt(treadMillData.leftFoot.batteryLevel * 100) }}%
                    </span>
                    <span v-else-if="parseInt(treadMillData.leftFoot.batteryLevel * 100) >= 15"
                      class="battery-quatity-text" style="color: #ffba00">
                      {{ parseInt(treadMillData.leftFoot.batteryLevel * 100) }}%
                    </span>
                    <span v-else-if="parseInt(treadMillData.leftFoot.batteryLevel * 100) >= 1"
                      class="battery-quatity-text" style="color: #ff4949">
                      {{ parseInt(treadMillData.leftFoot.batteryLevel * 100) }}%
                    </span>
                  </div>
                </div>
              </div>
              <div class="sensor-rfoot">
                <div class="sensor-rfoot-name">
                  <div class="icon">
                    <!-- <img src="@/assets/product/right_foot.png" alt="" /> -->
                    <svgIcon name="rfoot" width="16px" height="16px" />
                  </div>
                  <div class="name">{{ $t('message.main.device.rightFootSensor') }}</div>
                </div>
                <div class="sensor-rfoot-battery">
                  <div class="sensor-status">
                    <div v-if="treadMillData.connected" class="connected"></div>
                    <div v-else class="disconnected"></div>
                  </div>
                  <div class="sensor-battery">
                    <Battery v-if="treadMillData.connected && treadMillData.rightFoot.batteryLevel > 0"
                      :quantity="treadMillData.rightFoot.batteryLevel * 100"
                      :proIsCharge="treadMillData.rightFoot.isBatteryCharging" />
                  </div>
                  <div class="battery-quatity"
                    v-if="treadMillData.connected && treadMillData.rightFoot.batteryLevel > 0">
                    <span v-if="parseInt(treadMillData.rightFoot.batteryLevel * 100) >= 30" class="battery-quatity-text"
                      style="color: #13ce66">
                      {{ parseInt(treadMillData.rightFoot.batteryLevel * 100) }}%
                    </span>
                    <span v-else-if="parseInt(treadMillData.rightFoot.batteryLevel * 100) >= 15"
                      class="battery-quatity-text" style="color: #ffba00">
                      {{ parseInt(treadMillData.rightFoot.batteryLevel * 100) }}%
                    </span>
                    <span v-else-if="parseInt(treadMillData.rightFoot.batteryLevel * 100) >= 5"
                      class="battery-quatity-text" style="color: #ff4949">
                      {{ parseInt(treadMillData.rightFoot.batteryLevel * 100) }}%
                    </span>
                  </div>
                </div>
              </div>
              <div class="sensor-vhub"
                v-if="currentConnectedDevice.deviceType === 4 || currentConnectedDevice.deviceType === 8 || currentConnectedDevice.deviceType === 9">
                <div class="sensor-vhub-name">
                  <div class="icon">
                    <img src="@/assets/svg/device/vehiclehub.webp" alt="vehiclehub" />
                    <!-- <svgIcon name="vehiclehub" width="16px" height="16px" /> -->
                  </div>
                  <div class="name">{{ $t('message.main.device.vehicleHub') }}</div>
                </div>
                <div class="sensor-vhub-battery">
                  <div class="sensor-status">
                    <div v-if="sittingConnectedInfo.connected" class="connected"></div>
                    <div v-else class="disconnected"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="device-img-thumbnail">
            <img src="@/assets/product/c2_enhanced.png" alt="" v-nodrag />
          </div>
        </div>
        <div :class="['device-card', { 'is-active': armbandSelected }]" @click="handleSelectDevice('armband')"
          :style="{ height: `${calculatedCarouselHeight}px` }">
          <div class="device-sensor-info">
            <div class="sensor-name">
              <h3 class="device-name">VR Armband</h3>
            </div>
            <div class="device-sensor-item">
              <div class="sensor-armbamd">
                <div class="sensor-armband-name">
                  <div class="icon">
                    <!-- <img src="@/assets/product/armband_icon.png" alt="" /> -->
                    <svgIcon name="armband" width="16px" height="16px" />
                  </div>
                  <div class="name">{{ $t('message.main.accessories.armBand') }}</div>
                </div>
                <div class="sensor-armband-battery">
                  <div class="sensor-status">
                    <div v-if="armbandConnectedInfo.connected" class="connected"></div>
                    <div v-else class="disconnected"></div>
                  </div>
                  <div class="sensor-battery">
                    <Battery v-if="armbandConnectedInfo.connected" :quantity="armbandConnectedInfo.battery"
                      :proIsCharge="false" />
                  </div>
                  <div class="battery-quatity"
                    v-if="armbandConnectedInfo.connected && armbandConnectedInfo.battery > 0">
                    <span v-if="parseInt(armbandConnectedInfo.battery) >= 30" class="battery-quatity-text"
                      style="color: #13ce66">
                      {{ parseInt(armbandConnectedInfo.battery) }}%
                    </span>
                    <span v-else-if="parseInt(armbandConnectedInfo.battery) >= 15" class="battery-quatity-text"
                      style="color: #ffba00">
                      {{ parseInt(armbandConnectedInfo.battery) }}%
                    </span>
                    <span v-else-if="parseInt(armbandConnectedInfo.battery) >= 1" class="battery-quatity-text"
                      style="color: #ff4949">
                      {{ parseInt(armbandConnectedInfo.battery) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="device-img-thumbnail">
            <img src="@/assets/product/armband.png" alt="" v-nodrag />
          </div>
        </div>
      </div>
    </div>

    <div v-if="isDetailMode && selectedDevice" class="right-panel-detail">
      <div class="detail-header">
        <span class="back-link" @click="handleGoBack">
          <el-icon>
            <Back />
          </el-icon>
          Back
        </span>
      </div>

      <div v-if="selectedDevice === 'headset'" class="detail-info-card">
        <div class="device-activation-info">
          <div class="device-icon">
            <img src="@/assets/product/head.png" alt="" />
          </div>
          <div class="device-ccontent-info">
            <div class="device-name" style="text-transform: capitalize;">{{ hmdDeviceInfo?.deviceName }}</div>
            <div class="device-status">
              <div class="connect-status">
                <div v-if="deviceStatus" class="connected"></div>
                <div v-else class="disconnected"></div>
                <div class="device-status-text">
                  <span v-if="deviceStatus">
                    {{ $t('message.main.info.connected') }}
                  </span>
                  <span v-else>{{ $t('message.main.info.disconnected') }}</span>
                </div>
              </div>
            </div>
            <div class="device-activation-time">
              <div class="activation-time-text">
                <span>{{ $t('message.main.info.activationTime') }}: 26/01/2025</span>
              </div>
              <div class="last-used-time">
                <span>{{ $t('message.main.info.lastUsedTime') }}: 26/01/2025</span>
              </div>
            </div>
          </div>
        </div>
        <div class="device-sensor-list">
          <div class="sensor-item">
            <div class="sensor-icon">
              <img src="@/assets/product/left_controller.png" alt="" />
            </div>
            <div class="sensor-detail">
              <div class="sensor-name">Left Controller</div>
              <div class="sensor-sn">S/N: {{ hmdDeviceInfo?.leftControllerSerialNumber }}</div>
            </div>
          </div>
          <div class="sensor-item">
            <div class="sensor-icon">
              <img src="@/assets/product/right_controller.png" alt="" />
            </div>
            <div class="sensor-detail">
              <div class="sensor-name">Right Controller</div>
              <div class="sensor-sn">S/N: {{ hmdDeviceInfo?.rightControllerSerialNumber }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedDevice === 'device'" class="detail-info-card">
        <div class="device-activation-info">
          <div class="device-icon">
            <img src="@/assets/product/product_c2_enhanced.png" alt="" />
          </div>
          <div class="device-ccontent-info">
            <div class="device-name">{{ currentConnectedDevice?.deviceName }}</div>
            <div class="device-status">
              <div v-if="treadMillData.connected" class="device-symbol">
                <span class="device-symbol-text">{{ $t('message.main.info.currentDevice') }}</span>
              </div>
              <div class="connect-status">
                <div v-if="treadMillData.connected" class="connected"></div>
                <div v-else class="disconnected"></div>
                <div class="device-status-text">
                  <span v-if="treadMillData.connected">
                    {{ $t('message.main.info.connected') }}
                  </span>
                  <span v-else>{{ $t('message.main.info.disconnected') }}</span>
                </div>
              </div>
            </div>
            <div class="device-activation-time">
              <div class="activation-time-text">
                <span>{{ $t('message.main.info.activationTime') }}: 06/15/2025</span>
              </div>
              <div class="last-used-time">
                <span>{{ $t('message.main.info.lastUsedTime') }}: 09/30/2025</span>
              </div>
            </div>
            <div class="switch-device">
              <el-button type="primary" @click="deviceSwitch">
                {{ $t('message.main.info.switchDevice') }}
              </el-button>
            </div>
          </div>
        </div>
        <div class="device-function">
          <div class="device-function-item">
            <div class="initial-rairing">
              <el-button type="primary" @click="initialRearing">
                {{ $t('message.main.settings.initialRearing') }}
              </el-button>
            </div>
            <div class="device-sensor-info"></div>
          </div>
          <div class="device-function-item">
            <div class="quik-repairing">
              <el-button type="primary">
                {{ $t('message.main.settings.quickRepairing') }}
              </el-button>
            </div>
          </div>
          <div class="device-function-item">
            <div class="update-firmware">
              <el-button type="primary">
                {{ $t('message.main.settings.updateFirmware') }}
              </el-button>
            </div>
          </div>
          <div class="device-function-item">
            <div class="troubleshoot-sensors">
              <el-button type="primary">
                {{ $t('message.main.settings.troubleshootSensors') }}
              </el-button>
            </div>
          </div>
        </div>
        <div class="device-sensor-list">
          <div class="sensor-item">
            <div class="sensor-icon">
              <img src="@/assets/product/foot_sensor_icon.png" alt="" />
            </div>
            <div class="sensor-detail">
              <div class="sensor-name">{{ $t('message.main.deviceInfo.leftFootSensor') }}</div>
              <div class="sensor-sn">S/N: {{ currentPairedDevice?.leftFooterSn }}</div>
            </div>
          </div>
          <div class="sensor-item">
            <div class="sensor-icon">
              <img src="@/assets/product/foot_sensor_icon.png" alt="" />
            </div>
            <div class="sensor-detail">
              <div class="sensor-name">{{ $t('message.main.deviceInfo.rightFootSensor') }}</div>
              <div class="sensor-sn">S/N: {{ currentPairedDevice?.rightFooterSn }}</div>
            </div>
          </div>
          <div class="sensor-item">
            <div class="sensor-icon">
              <img src="@/assets/product/receiver_icon.png" alt="" />
            </div>
            <div class="sensor-detail">
              <div class="sensor-name">{{ $t('message.main.deviceInfo.receiver') }}</div>
              <div class="sensor-sn">S/N: {{ currentPairedDevice?.receiverSn }}</div>
            </div>
          </div>
          <div class="sensor-item"
            v-if="currentConnectedDevice.deviceType === 4 || currentConnectedDevice.deviceType === 8 || currentConnectedDevice.deviceType === 9">
            <div class="sensor-icon">
              <img src="@/assets/product/directtion_icon.png" alt="" />
            </div>
            <div class="sensor-detail">
              <div class="sensor-name">{{ $t('message.main.deviceInfo.directionSensor') }}</div>
              <div class="sensor-sn">S/N: {{ currentPairedDevice?.directionSn }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedDevice === 'armband'" class="detail-info-card">
        <div class="device-activation-info">
          <div class="device-icon">
            <img src="@/assets/product/product_armband.png" alt="" style="height: 120px" />
          </div>
          <div class="device-ccontent-info">
            <div class="device-name" style="text-transform: capitalize;">VR Armband</div>
            <div class="device-status">
              <div class="connect-status">
                <div v-if="armbandConnectedInfo.connected" class="connected"></div>
                <div v-else class="disconnected"></div>
                <div class="device-status-text">
                  <span v-if="armbandConnectedInfo.connected">
                    {{ $t('message.main.info.connected') }}
                  </span>
                  <span v-else>{{ $t('message.main.info.disconnected') }}</span>
                </div>
              </div>
            </div>
            <div class="device-activation-time">
              <div class="activation-time-text">
                <span>{{ $t('message.main.info.activationTime') }}: 26/01/2026</span>
              </div>
              <div class="last-used-time">
                <span>{{ $t('message.main.info.lastUsedTime') }}: 26/01/2026</span>
              </div>
            </div>
          </div>
        </div>
        <div class="device-sensor-list">
          <div class="sensor-item">
            <div class="sensor-detail">
              <div class="receiver-mac">
                <p>Receiver Mac: {{ armBandPairedInfo?.receiverMac }}</p>
              </div>
              <div class="sensor-mac">
                <p>Sensor Mac: {{ armBandPairedInfo?.sensorMac }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  shallowRef,
  reactive,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  watch,
  getCurrentInstance
} from 'vue'
import { useStore } from 'vuex'
import { configRead, getDevicePairingInfo, calibration, checkCalibration } from '@/utils/system'
import { useWindowSize } from '@/composables/useWindowSize'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { allConnectedDevices, selectUseDevice } from '@/utils/global'
import { Plus, Back } from '@element-plus/icons-vue'

import Battery from '@/views/main/dashboard/components/battery/index.vue'

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

// Vuex 缓存
const store = useStore()
const router = useRouter()
const route = useRoute()
const NAMESPACE = 'device'

// 响应式获取 Vuex 实时数据
const headsetAngle = computed(() => store.getters[`${NAMESPACE}/getHeadsetAngle`])
const bodyAngle = computed(() => store.getters[`${NAMESPACE}/getBodyAngle`])
const heartRate = computed(() => store.getters[`${NAMESPACE}/getHeartRate`])
const leftFooterPosition = computed(() => store.getters[`${NAMESPACE}/getLeftFooterPosition`])
const rightFooterPosition = computed(() => store.getters[`${NAMESPACE}/getRightFooterPosition`])

// 当前连接接收器设备
const currentConnectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`])
console.log('当前连接设备', currentConnectedDevice.value)

// 根据设备类型筛选跑步机数据
const treadMillData = computed(() => {
  const deviceType = currentConnectedDevice.value.deviceType;

  // 逻辑归类
  if ([2, 3].includes(deviceType)) {
    return store.getters[`${NAMESPACE}/getCTreadmillData`];
  }

  if ([4, 8, 9].includes(deviceType)) {
    return store.getters[`${NAMESPACE}/getTreadmillData`];
  }

  return {};
});

// 头显数据
const headsetData = computed(() => store.getters[`${NAMESPACE}/getHeadsetData`])

// 臂带数据
const armbandConnectedInfo = computed(() => store.getters[`${NAMESPACE}/getArmbandInfo`])

// 坐姿连接数据
const sittingConnectedInfo = computed(() => store.getters[`${NAMESPACE}/getSittingInfo`])

const hmdDeviceInfo = headsetData.value?.hmdDevice
const leftControllerInfo = headsetData.value?.leftControllerDevice
const rightControllerInfo = headsetData.value?.rightControllerDevice
const deviceStatus = headsetData.value?.ready


// 所有已连接接收器设备列表
const connectedDevices = allConnectedDevices()

const availableOtherDevices = computed(() => {
  // 确保数据存在，否则返回空数组或原始列表
  if (!connectedDevices.value) return []

  const currentSN = currentConnectedDevice.value?.serialNumber

  if (!currentSN) {
    return connectedDevices.value
  }

  // 过滤掉 SN 匹配的设备
  return connectedDevices.value.filter(device => device.serialNumber !== currentSN)
})

// 当前配对设备
const currentPairedDevice = ref({})

import widebg from '@/assets/images/device_wide_bg.png'
import narrowbg from '@/assets/images/device_narrow_bg.png'

// 1. **状态管理**
const selectedDevice = ref(null)

// 计算属性：判断是否处于详情模式（即三栏模式）
const isDetailMode = computed(() => !!selectedDevice.value)

const headSelected = ref(false)
const deviceSelected = ref(false)
const armbandSelected = ref(false)

const headsetInfo = ref({})
const armBandPairedInfo = ref({})

const emit = defineEmits(['switch-view'])

const deviceSwitch = () => {
  router.push({ name: 'deviceSwitch' })
}

const initialRearing = () => {
  // 发射事件，并发送目标组件的字符串名称
  emit('switch-view', 'pair')
}

const { width, height } = useWindowSize(150)

const calculatedCarouselHeight = computed(() => {
  return height.value / 4.2 - 22
})

/**
 * 切换到详情视图 (触发两栏 -> 三栏切换)
 */
const handleSelectDevice = async (name) => {
  selectedDevice.value = name
  if (name === 'headset') {
    headSelected.value = true
    deviceSelected.value = false
    armbandSelected.value = false
    await getHeadsetInfo()
  } else if (name === 'device') {
    headSelected.value = false
    deviceSelected.value = true
    armbandSelected.value = false
  } else if (name === 'armband') {
    headSelected.value = false
    deviceSelected.value = false
    armbandSelected.value = true
    await getArmbandInfo()
  }
}
const new_GatewayPath = 'Local/New_Gateway'
const profilePath = 'Profile'
// 读取配置文件
const getHeadsetInfo = async () => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const configurationFileName = 'HeadsetPairing.json'
  const data = await configRead(host, folderPath, configurationFileName);
  if (data) {
    const res = JSON.parse(data)
    if (res.result && res.data) {
      headsetInfo.value = JSON.parse(res.data)
    }
  }
  return headsetInfo.value;
}

// 读取配置文件
const getArmbandInfo = async () => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const configurationFileName = 'ArmbandInfo.json'
  const data = await configRead(host, folderPath, configurationFileName);
  if (data) {
    const res = JSON.parse(data)
    if (res.result && res.data) {
      armBandPairedInfo.value = JSON.parse(res.data)
    }
  }
  return armBandPairedInfo.value;
}

const getCPairedDevice = async () => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const fileName = 'CReceiverPairingInfo.json'
  return await configRead(host, folderPath, fileName)
}

const getC2PairedDevice = async () => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const fileName = 'C2ReceiverPairingInfo.json'
  return await configRead(host, folderPath, fileName)
}

const getC2CorePairedDevice = async () => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const fileName = 'C2CoreReceiverPairingInfo.json'
  return await configRead(host, folderPath, fileName)
}

const getC2EnhancedPairedDevice = async () => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const fileName = 'C2EnhancedReceiverPairingInfo.json'
  return await configRead(host, folderPath, fileName)
}

const getLocoPairedDevice = async () => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const fileName = 'LocoPairingInfo.json'
  return await configRead(host, folderPath, fileName)
}

const getLocosPairedDevice = async () => {
  const folderPath = `${new_GatewayPath}/${profilePath}`
  const fileName = 'LocosPairingInfo.json'
  return await configRead(host, folderPath, fileName)
}

/**
 * 切换回列表视图 (触发三栏 -> 两栏切换)
 */
const handleGoBack = () => {
  selectedDevice.value = null // 清空选中设备
}

const getCurrentDevice = async () => {
  const currentSelected = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`])
  if (currentSelected.value) {
    const deviceType = currentSelected.value.deviceType
    if (deviceType === 1) {
      const pairedDevice = await getLocoPairedDevice()
      if (pairedDevice) {
        const newData = JSON.parse(pairedDevice)
        if (newData.result && newData.data) {
          currentPairedDevice.value = JSON.parse(newData.data)
        }
      }
    } else if (deviceType === 2) {
      const pairedDevice = await getLocosPairedDevice()
      if (pairedDevice) {
        const newData = JSON.parse(pairedDevice)
        if (newData.result && newData.data) {
          currentPairedDevice.value = JSON.parse(newData.data)
        }
      }
    } else if (deviceType === 3) {
      const pairedDevice = await getCPairedDevice()
      if (pairedDevice) {
        const newData = JSON.parse(pairedDevice)
        if (newData.result && newData.data) {
          currentPairedDevice.value = JSON.parse(newData.data)
        }
      }
    } else if (deviceType === 4) {
      const pairedDevice = await getC2PairedDevice()
      if (pairedDevice) {
        const newData = JSON.parse(pairedDevice)
        if (newData.result && newData.data) {
          currentPairedDevice.value = JSON.parse(newData.data)
        }
      }
    } else if (deviceType === 8) {
      const pairedDevice = await getC2CorePairedDevice()
      if (pairedDevice) {
        const newData = JSON.parse(pairedDevice)
        if (newData.result && newData.data) {
          currentPairedDevice.value = JSON.parse(newData.data)
        }
      }
    } else if (deviceType === 9) {
      const pairedDevice = await getC2EnhancedPairedDevice()
      if (pairedDevice) {
        const newData = JSON.parse(pairedDevice)
        if (newData.result && newData.data) {
          currentPairedDevice.value = JSON.parse(newData.data)
        }
      }
    }
  } else {
    currentPairedDevice.value = null
  }
}

const handleAddDevice = async () => {
  // 跳转设备向导页，判断已连接设备数（排除当前设备），多个才能跳转
  if (treadMillData.value.connected && availableOtherDevices.value.length > 0) {
    router.push({ name: 'pair' })
  } else {
    ElMessage({
      message: 'No devices can be added. Please connect another device first.',
      type: 'warning',
    })
  }
}

// Desktop校准
const handleCalibration = async () => {
  // 校准
  await calibration(host)

  // 获取校准状态
  const calibrationStatus = await checkCalibration(host)
  if (calibrationStatus) {

    // 获取角度
    const bodyAngle = await store.getters[`${NAMESPACE}/getBodyAngle`]
    console.log('获取到的角度：', bodyAngle)

    ElMessage({
      message: 'Calibration Successful!',
      type: 'success',
    })
  } else {
    ElMessage({
      message: 'Calibration Failed!',
      type: 'error',
    })
  }
}

watch(
  () => [width.value, height.value],
  () => {
    console.log(width.value, height.value)
  }
)

watch(
  () => armbandConnectedInfo.value?.connected,
  (isConnected) => {
    if (isConnected) {
      console.log('臂带连接状态改变：已连上');
    } else {
      console.log('臂带连接状态改变：已断开');
    }
  }
);

watch(
  () => sittingConnectedInfo.value?.connected,
  (isConnected) => {
    if (isConnected) {
      console.log('坐姿连接状态改变：已连上');
    } else {
      console.log('坐姿连接状态改变：已断开');
    }
  }
);

watch(
  () => heartRate.value, (newVal) => {
    console.log('⭐⭐⭐⭐⭐臂带心率数据变化⭐⭐⭐⭐⭐', newVal)
  }
)

watch(availableOtherDevices.value, (newVal) => {
  console.log('可添加设备列表:', newVal)
})

onBeforeMount(() => { })
onMounted(async () => {
  getCurrentDevice()
})
onUnmounted(() => { })
</script>

<style scoped>
.dashboard-container {
  display: grid;
  grid-template-columns: 680fr 380fr;
  transition: grid-template-columns 0.4s ease-in-out;
  min-width: 1060px;
  background: var(--main-bg-color);
  min-height: -webkit-fill-available;
}

.three-column-mode {
  grid-template-columns: 33% 34% 33%;
}

.left-panel {
  /* padding-top: 20px; */
  overflow-y: auto;
  position: relative;
  /* background: #e0eaff; */
  /* background: linear-gradient(180deg, #3E4E69 0%, #0F1922 100%); */
  margin: 20px;
  border-radius: 10px;
}

.wide-robot-info {
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
  height: 100%;
}

.wide-robot-info .device-info .headsetAdirection {
  position: absolute;
  top: 8%;
  left: 10.6%;
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  /* color: var(--brand-color); */
  color: var(--brand-color);
}

.wide-robot-info .device-info .bodyDirection {
  position: absolute;
  top: 20%;
  left: 7.7%;
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  /* color: var(--brand-color); */
  color: var(--brand-color);
}

.wide-robot-info .device-info .rightFootSensor {
  position: absolute;
  top: 32.6%;
  left: 7.6%;
}

.wide-robot-info .device-info .leftFootSensor {
  position: absolute;
  top: 51%;
  left: 7.6%;
}

.wide-robot-info .device-info .vrAmband {
  position: absolute;
  top: 9.6%;
  right: 10%;
}

.wide-robot-info .device-info .vrAmbandVal {
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  /* color: #cf1322; */
  color: var(--error-bg-color);
}

.wide-robot-info .device-info .calibration {
  position: absolute;
  top: 24.6%;
  right: 36%;
  transform: translate(-50%, -50%);
  font-size: 8px;
  color: #ffffff;
  cursor: pointer;
}

.wide-robot-info .device-info .grid {
  position: relative;
  width: 80px;
  height: 80px;
  /* border: 1px solid #6197ff; */
  border: 1px solid var(--brand-color);
  background-image:
    repeating-linear-gradient(to right, var(--brand-color) 0, var(--brand-color) 1px, transparent 1px, transparent 20px),
    repeating-linear-gradient(to bottom, var(--brand-color) 0, var(--brand-color) 1px, transparent 1px, transparent 20px);
  background-size: 20px 20px;
  border-radius: 4px;
  box-shadow: inset 0 0 6px rgba(100, 150, 255, 0.2);
}

.wide-robot-info .device-info .cross {
  position: absolute;
  /* background-color: #8ab3ff; */
  background: var(--brand-color);
  opacity: 0.6;
}

.wide-robot-info .device-info .center-x {
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
}

.wide-robot-info .device-info .center-y {
  left: 50%;
  top: 0;
  height: 100%;
  width: 2px;
  transform: translateX(-50%);
}

.wide-robot-info .device-info .dot {
  position: absolute;
  width: 10px;
  height: 10px;
  /* background-color: #1e6eff; */
  background: var(--brand-color);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 50ms linear;

  &:active {
    background-color: #66b1ff;
    cursor: grabbing;
  }
}

.narrow-robot-info {
  background-size: auto;
  background-position: top center;
  background-repeat: no-repeat;
  height: 100%;
}

.narrow-robot-info .device-info .headsetAdirection {
  position: absolute;
  top: 5.6%;
  left: 18.6%;
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  /* color: var(--brand-color); */
  color: var(--brand-color);
}

.narrow-robot-info .device-info .bodyDirection {
  position: absolute;
  top: 16.6%;
  left: 11%;
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  /* color: var(--brand-color); */
  color: var(--brand-color);
}

.narrow-robot-info .device-info .rightFootSensor {
  position: absolute;
  top: 33.6%;
  left: 7.6%;
}

.narrow-robot-info .device-info .leftFootSensor {
  position: absolute;
  top: 48.5%;
  left: 7.6%;
}

.narrow-robot-info .device-info .vrAmband {
  position: absolute;
  top: 17.7%;
  right: 14%;
}

.narrow-robot-info .device-info .vrAmbandVal {
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  /* color: #cf1322; */
  color: var(--error-bg-color);
}

.narrow-robot-info .device-info .calibration {
  position: absolute;
  top: 27%;
  right: 30%;
  transform: translate(-50%, -50%);
  font-size: 8px;
  color: #ffffff;
  cursor: pointer;
}


.narrow-robot-info .device-info .grid {
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid var(--brand-color);
  background-image:
    repeating-linear-gradient(to right, var(--brand-color) 0, var(--brand-color) 1px, transparent 1px, transparent 20px),
    repeating-linear-gradient(to bottom, var(--brand-color) 0, var(--brand-color) 1px, transparent 1px, transparent 20px);
  background-size: 20px 20px;
  border-radius: 4px;
  box-shadow: inset 0 0 6px rgba(100, 150, 255, 0.2);
}

.narrow-robot-info .device-info .cross {
  position: absolute;
  /* background-color: #8ab3ff; */
  background: var(--brand-color);
  opacity: 0.6;
}

.narrow-robot-info .device-info .center-x {
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
}

.narrow-robot-info .device-info .center-y {
  left: 50%;
  top: 0;
  height: 100%;
  width: 2px;
  transform: translateX(-50%);
}

.narrow-robot-info .device-info .dot {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--brand-color);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 50ms linear;

  &:active {
    background-color: #66b1ff;
    cursor: grabbing;
  }
}

.middle-panel {
  padding: 20px 20px 20px 0;
  overflow-y: auto;
}

.middle-panel .add-button-header {
  height: 50px;
  border-radius: 10px;
  opacity: 1;
  /* background: rgba(224, 234, 255, 0.2); */
  background: var(--main-bg-color);
  box-sizing: border-box;
  border: 1px dashed var(--divider-color);
  margin-bottom: var(--small-distance);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* .middle-panel .add-button-header .plus-icon {
  font-size: 24px;
  font-weight: bold;
  color: #aaaaaa;
  cursor: pointer;
} */

.middle-panel .device-card .sensor-headset-name {
  display: flex;
  gap: 2px;
  justify-content: flex-start;
  justify-items: baseline;
  align-items: center;
}

.middle-panel .device-card .sensor-lcontroller-name {
  display: flex;
  gap: 2px;
  justify-content: flex-start;
  justify-items: baseline;
  align-items: center;
}

.middle-panel .device-card .sensor-rcontroller-name {
  display: flex;
  gap: 2px;
  justify-content: flex-start;
  justify-items: baseline;
  align-items: center;
}

.middle-panel .device-card .sensor-direction-name {
  display: flex;
  gap: 2px;
  justify-content: flex-start;
  justify-items: baseline;
}

.middle-panel .device-card .sensor-lfoot-name {
  display: flex;
  gap: 2px;
  justify-content: flex-start;
  justify-items: baseline;
}

.middle-panel .device-card .sensor-rfoot-name {
  display: flex;
  gap: 2px;
  justify-content: flex-start;
  justify-items: baseline;
  align-items: center;
}

.middle-panel .device-card .sensor-vhub-name {
  display: flex;
  gap: 2px;
  justify-content: flex-start;
  justify-items: baseline;
  align-items: center;
}

.middle-panel .device-card .connected {
  width: 7.38px;
  height: 7.38px;
  opacity: 1;
  background: #34c759;
  border-radius: 8px;
}

.middle-panel .device-card .disconnected {
  width: 7.38px;
  height: 7.38px;
  opacity: 1;
  background: #ff3b30;
  border-radius: 8px;
}

.middle-panel .device-card .sensor-headset {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6px;
  align-items: center;
}

.middle-panel .device-card .sensor-lcontroller {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6px;
  align-items: center;
}

.middle-panel .device-card .sensor-rcontroller {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6px;
  align-items: center;
}

.middle-panel .device-card .sensor-headset-battery {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
}

.middle-panel .device-card .sensor-lcontroller-battery {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
}

.middle-panel .device-card .sensor-rcontroller-battery {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
}

.middle-panel .device-card .sensor-direction {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6px;
  align-items: center;
}

.middle-panel .device-card .sensor-lfoot {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6px;
  align-items: center;
}

.middle-panel .device-card .sensor-rfoot {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6px;
  align-items: center;
}

.middle-panel .device-card .sensor-rfoot {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6px;
  align-items: center;
}

.middle-panel .device-card .sensor-vhub {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6px;
  align-items: center;
}

.middle-panel .device-card .sensor-direction-battery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
}

.middle-panel .device-card .sensor-lfoot-battery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
}

.middle-panel .device-card .sensor-rfoot-battery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
}

.middle-panel .device-card .sensor-vhub-battery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
}

.middle-panel .device-card .sensor-armbamd {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6px;
  align-items: center;
}

.middle-panel .device-card .sensor-armband-name {
  display: flex;
  gap: 2px;
  justify-content: flex-start;
  justify-items: baseline;
  align-items: center;
}

.middle-panel .device-card .sensor-armband-battery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
}

.middle-panel .device-card .battery-quatity {
  width: 36px;
}

.right-panel-detail {
  margin: 20px;
  padding: 16px;
  border-radius: 4px;
  /* background-color: #e0eaff; */
  background: linear-gradient(180deg, #3E4E69 0%, #0F1922 100%);
  overflow-y: auto;
}

.middle-panel .device-card {
  display: grid;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: var(--small-distance);
  border: 1px solid rgba(103, 112, 123, 0.3);
  border-radius: 8px;
  cursor: pointer;
  background: linear-gradient(180deg, #3E4E69 0%, #0F1922 100%);
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.5);
  min-height: 150px;
  grid-template-columns: 3fr 2fr;
  /* padding: 16px 0 16px 16px; */
  padding: var(--small-distance);
  color: var(--text-color);
  font-size: 12px;
  box-sizing: content-box;

  .sensor-battery {
    transform: rotate(90deg);
  }
}

.middle-panel .device-card .device-sensor-item {
  display: grid;
  row-gap: 5px;
}

.middle-panel .device-card:last-child {
  margin-bottom: 0;
}

.middle-panel .device-card.is-active {
  border: 2px solid #007bff;
  background-color: #eaf3ff;
}

.middle-panel .device-sensor-info .device-name {
  font-size: 16px;
  font-weight: bold;
  color: var(--brand-color);
  text-align: left;
  white-space: nowrap;
}

.middle-panel .device-card .device-img-thumbnail img {
  max-width: 126px;
  height: auto;
}

.detail-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.right-panel-detail .device-activation-info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
  margin-bottom: 12px;
}

.right-panel-detail .device-activation-info .device-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-panel-detail .device-ccontent-info {
  display: grid;
  grid-auto-columns: 1fr;
  justify-content: flex-start;
  align-items: center;
  max-height: 120px;
  row-gap: 5px;
}

.right-panel-detail .device-name {
  display: flex;
  justify-content: flex-start;
  font-size: var(--title-font-size);
  font-weight: 600;
  line-height: 23px;
  letter-spacing: 0px;
  /* color: var(--title-color); */
  color: var(--title-color);
}

.right-panel-detail .device-status {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 5px;
}

.right-panel-detail .device-symbol {
  border-radius: 3px;
  opacity: 1;
  display: flex;
  flex-direction: row;
  padding: 0px 5px;
  gap: 0px 10px;
  flex-wrap: wrap;
  align-content: flex-start;
  background: #adc6ff;
  width: fit-content;
}

.right-panel-detail .device-symbol .device-symbol-text {
  font-size: 12px;
  font-weight: normal;
  line-height: 14px;
  letter-spacing: 0px;
  color: var(--brand-color);
}

.right-panel-detail .connect-status {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
}

.right-panel-detail .connect-status .connected {
  width: 7.38px;
  height: 7.38px;
  opacity: 1;
  background: #13ce66;
  border-radius: 8px;
}

.right-panel-detail .connect-status .disconnected {
  width: 7.38px;
  height: 7.38px;
  opacity: 1;
  background: #ff3b30;
  border-radius: 8px;
}

.right-panel-detail .switch-device button {
  width: 100%;
  height: 27px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  gap: 5px;
  /* background: #0256ff; */
  background: var(--brand-color);
  font-size: 12px;
  font-weight: normal;
  line-height: 17px;
  letter-spacing: 0px;
  color: #ffffff;
  border: none;
}

.right-panel-detail .device-function {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 0;
}

.right-panel-detail .device-function .device-function-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.right-panel-detail .device-function .device-function-item .initial-rairing {
  width: 100%;
}

.right-panel-detail .device-function .device-function-item .quik-repairing {
  width: 100%;
}

.right-panel-detail .device-function .device-function-item .update-firmware {
  width: 100%;
}

.right-panel-detail .device-function .device-function-item .troubleshoot-sensors {
  width: 100%;
}

.right-panel-detail .device-sensor-list {
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  justify-content: flex-start;
  margin-top: 20px;
}


.right-panel-detail .device-sensor-list .sensor-item .sensor-detail {
  display: grid;
  grid-template-columns: 1fr;
  text-align: left;
  row-gap: 5px;
}

.back-link {
  font-size: 16px;
  font-weight: bold;
  /* color: #007bff; */
  color: var(--title-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.right-panel-detail {
  font-family: var(--text-family);

  .device-status-text {
    color: var(--text-color);
    font-size: 10px;
  }

  .device-activation-time {
    display: grid;
    justify-content: flex-start;
    row-gap: 5px;
    font-size: 10px;
    font-weight: normal;
    line-height: 14px;
    letter-spacing: 0px;
    color: var(--text-color);
  }

  .device-function .device-function-item button {
    width: 100%;
    height: 27px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
    gap: 5px;
    /* background: #0256ff; */
    background: var(--brand-color);
    font-size: 12px;
    font-weight: normal;
    line-height: 17px;
    letter-spacing: 0px;
    color: #ffffff;
    border: none;
  }

  .device-sensor-list .sensor-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    width: auto;
    max-height: 60px;
    /* background: rgba(255, 255, 255, 0.5); */
    background: #3E4E69;
    border-radius: 5px;
    padding: 10px 20px;

    .sensor-name {
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0px;
      color: #fff;
    }

    .sensor-sn {
      font-size: 10px;
      font-weight: normal;
      line-height: 14px;
      letter-spacing: 0px;
      color: var(--text-color);
    }
  }

  .receiver-mac p,
  .sensor-mac p {
    font-size: 12px;
    margin: 0;
    color: var(--title-color);
  }
}
</style>
