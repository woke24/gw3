<template>
  <div class="advanced-setup-container">
    <div class="panel-tab-nav">
      <div class="panel-tab dark-tab">
        <nav class="custom-tabs-nav">
          <div v-for="tab in tabList" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key">
            {{ tab.label }}
            <div class="active-bar"></div>
          </div>
        </nav>
      </div>
      <div class="panel-tips">
        <p>All settings take effect in real time.</p>
      </div>
      <div v-if="activeTab === 'preference'" class="panel-setup">
        <el-select :model-value="setupMode" class="dark-select" @change="onModeChange" placeholder="Select"
          size="default" style="width: 130px">
          <el-option label="Quik Setup" value="quik" />
          <el-option label="Advanced Setup" value="advanced" />
        </el-select>
      </div>
    </div>
    <div class="tab-main-content">
      <section v-if="activeTab === 'preference'" class="tab-panel">
        <div class="preference-setting-container">
          <div class="preference-row">
            <div class="left-handed-mode">
              <div class="left-handed-mode-text">
                <span>Left Handed Mode</span>
              </div>
              <div class="left-handed-mode-control">
                <el-radio-group v-model="gameSetting.LeftHandedMode" size="default" text-color="#fff" fill="#05C3DE"
                  @change="changeLeftHandedMode">
                  <el-radio-button :value="true">ON</el-radio-button>
                  <el-radio-button :value="false">OFF</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="original-trackpad">
              <div class="original-trackpad-text">
                <span>Original Trackpad/Joystick For Walk</span>
              </div>
              <div class="original-trackpad-control">
                <el-select v-model="gameSetting.OrlginalTrackpad" class="dark-select" size="default"
                  placeholder="Select" text-color="#fff" fill="#05C3DE" @change="changeOrlginalTrackpad"
                  style="width: 240px">
                  <el-option label="Controller Secondary" :value="0">Controller Secondary</el-option>
                  <el-option label="Controller Priority" :value="1">Controller Priority</el-option>
                  <el-option label="Disable" :value="2">Disable</el-option>
                </el-select>
              </div>
            </div>
            <div class="both-trigger-calibration">
              <div class="both-trigger-calibration-text">
                <span>Both Trigger Calibration</span>
              </div>
              <div class="both-trigger-calibration-control">
                <el-radio-group v-model="inputConfig.enableDoubleTriggerCalibration" size="default" text-color="#fff"
                  fill="#05C3DE" @change="changeTriggerCalibration">
                  <el-radio-button :value="true">ON</el-radio-button>
                  <el-radio-button :value="false">OFF</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <el-divider />

            <div class="walking-speed-multiplier">
              <div class="walking-speed-multiplier-text">
                <span>Walking Speed Multiplier</span>
              </div>
              <div class="walking-speed-multiplier-control">
                <el-button size="default" @click="restoreWalkingSpeed" plain>Default</el-button>
              </div>
            </div>
            <div class="walking-speed-multiplier-slider">
              <div class="slider-min">
                <div class="slider-min-icon" @click="speedDecrease">-</div>
                <div class="slider-min-text">MIN</div>
              </div>
              <div class="slider-control">
                <el-slider v-model="katTreadMillConfig.speedMul" size="default" :min="0.5" :max="1.5" :step="0.1"
                  :show-tooltip="true" :show-stops="false" @change="changeSpeed" />
              </div>
              <div class="slider-max">
                <div class="slider-max-icon" @click="speedIncrease">+</div>
                <div class="slider-max-text">MAX</div>
              </div>
            </div>
            <div :class="[
              'walking-accuracy-container',
              { 'disabled-area': katTreadMillConfig.CruiseMode }
            ]">
              <div class="walking-accuracy-multiplier">
                <div class="walking-accuracy-multiplier-text">
                  <span>Walking Accuracy</span>
                </div>
                <div class="walking-accuracy-multiplier-control">
                  <el-button size="default" @click="restoreWalkingAccuracy" plain>Default</el-button>
                </div>
              </div>
              <div class="walking-accuracy-multiplier-slider">
                <div class="slider-min">
                  <div class="slider-min-icon" @click="accuracyDecrease">-</div>
                  <div class="slider-min-text">Smooth</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="katTreadMillConfig.ForwardMovementSensitivity" size="default" :min="0" :max="5"
                    :step="1" :show-tooltip="true" :show-stops="false" @change="changeWalkingAccuracy" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="accuracyIncrease">+</div>
                  <div class="slider-max-text">Accuracy</div>
                </div>
              </div>
            </div>
            <el-divider />
            <div class="unintentional-movement-filter">
              <div class="unintentional-movement-filter-text">
                <span>Unintentional Movement Filter</span>
              </div>
              <div class="unintentional-movement-filter-control">
                <el-button size="default" @click="restoreUnintentionalMovement" plain>
                  Default
                </el-button>
              </div>
            </div>
            <div class="unintentional-movement-filter-slider">
              <div class="slider-min">
                <div class="slider-min-icon" @click="filterDecrease">-</div>
                <div class="slider-min-text">Unfiltered</div>
              </div>
              <div class="slider-control">
                <el-slider v-model="katTreadMillConfig.SmallActionMasking" size="default" :min="0" :max="10" :step="1"
                  :show-tooltip="true" :show-stops="false" @change="changeSmallActionMasking" />
              </div>
              <div class="slider-max">
                <div class="slider-max-icon" @click="filterIncrease">+</div>
                <div class="slider-max-text">High Filtering</div>
              </div>
            </div>
            <el-divider />
            <div class="sprint-mode">
              <div class="sprint-mode-text">
                <span>Sprint Mode</span>
              </div>
              <div class="sprint-mode-control">
                <el-radio-group v-model="gameSetting.SprintMode" size="default" text-color="#fff" fill="#05C3DE"
                  @change="changeSprintMode">
                  <el-radio-button :value="true">ON</el-radio-button>
                  <el-radio-button :value="false">OFF</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div :class="['sprint-container', { 'disabled-area': !gameSetting.SprintMode }]">
              <div class="sprint-threshold">
                <div class="sprint-threshold-text">
                  <span>Sprint Threshold</span>
                </div>
                <div class="sprint-threshold-control">
                  <el-button size="default" @click="restoreSprintThreshold" plain>Default</el-button>
                </div>
              </div>
              <div class="sprint-threshold-slider">
                <div class="slider-min">
                  <div class="slider-min-icon" @click="thresholdDecrease">-</div>
                  <div class="slider-min-text">MIN</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="gameSetting.SprintThreshold" size="default" :min="0" :max="30" :step="1"
                    :show-tooltip="true" :show-stops="false" @change="changeSprintThreshold" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="thresholdIncrease">+</div>
                  <div class="slider-max-text">MAX</div>
                </div>
              </div>
            </div>
            <el-divider />
            <div class="jump-mode">
              <div class="jump-mode-text">
                <span>Jump Mode</span>
              </div>
              <div class="jump-mode-control">
                <el-radio-group v-model="gameSetting.JumpMode" size="default" text-color="#fff" fill="#05C3DE"
                  @change="changeJumpMode">
                  <el-radio-button :value="true">ON</el-radio-button>
                  <el-radio-button :value="false">OFF</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="jump-mode-control-tips">
              <span>Calibrate Before Each Use!</span>
            </div>
            <div :class="['jump-threshold-container', { 'disabled-area': !gameSetting.JumpMode }]">
              <div class="jump-threshold">
                <div class="jump-threshold-text">
                  <span>Jump Threshold</span>
                </div>
                <div class="jump-threshold-control">
                  <el-button size="default" @click="restoreJumpThreshold" plain>Default</el-button>
                </div>
              </div>
              <div class="jump-threshold-slider">
                <div class="slider-min">
                  <div class="slider-min-icon" @click="jumpThresholdDecrease">-</div>
                  <div class="slider-min-text">MIN</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="gameSetting.JumpThreshold" size="default" :min="1" :max="15" :step="1"
                    :show-tooltip="true" :show-stops="false" @change="changeJumpThreshold" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="jumpThresholdIncrease">+</div>
                  <div class="slider-max-text">MAX</div>
                </div>
              </div>
            </div>
            <el-divider />
            <div class="cruise-mode">
              <div class="cruise-mode-text">
                <span>Cruise Mode</span>
              </div>
              <div class="cruise-mode-control">
                <el-radio-group v-model="katTreadMillConfig.CruiseMode" size="default" text-color="#fff" fill="#05C3DE"
                  @change="onCruiseModeChange">
                  <el-radio-button :value="true">ON</el-radio-button>
                  <el-radio-button :value="false">OFF</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <!-- Game Config -->
            <div class="controller-settings">
              <div class="controller-settings-item">
                <div class="controller-property">
                  <span>Controller Property</span>
                </div>
                <div class="controller-settings-func">
                  <div class="controller-name">
                    <span>Controller Name</span>
                  </div>
                  <div class="controller-icon">
                    <el-icon>
                      <EditPen />
                    </el-icon>
                  </div>
                </div>
              </div>
              <el-divider />
              <div class="controller-settings-item">
                <div class="controller-property">
                  <span>Walk Controller</span>
                </div>
                <div class="controller-property-value">
                  <el-select v-model="gameSetting.Hand" class="dark-select" placeholder="Select" size="default"
                    style="width: 240px" @change="changeWalkController">
                    <el-option label="LeftHand Controller" :value="0" />
                    <el-option label="RightHand Controller" :value="1" />
                  </el-select>
                </div>
              </div>
              <div class="controller-settings-item">
                <div class="controller-property">
                  <span>Walk Action</span>
                </div>
                <div class="controller-property-value">
                  <el-select v-model="gameSetting.WalkTriggerSource" class="dark-select" placeholder="Select"
                    size="default" @change="changeWalkTriggerSource" style="width: 240px">
                    <el-option label="Trackpad touch" :value="0" />
                    <el-option label="Trackpad click" :value="1" />
                    <el-option label="Both trackpads touch" :value="2" />
                    <el-option label="Joystick" :value="3" />
                    <el-option label="Joystick click" :value="4" />
                    <el-option label="Both joysticks" :value="5" />
                    <el-option label="Trigger" :value="6" />
                    <el-option label="Grip" :value="7" />
                    <el-option label="None" :value="8" />
                  </el-select>
                </div>
              </div>
              <div class="controller-settings-item">
                <div class="controller-property">
                  <span>Walk Speed Type</span>
                </div>
                <div class="controller-property-value">
                  <el-select v-model="gameSetting.WalkSpeedType" class="dark-select" placeholder="Select" size="default"
                    @change="changeWalkSpeedType" style="width: 240px">
                    <el-option label="Linear movement" :value="0" />
                    <el-option label="Constant speed movement" :value="1" />
                  </el-select>
                </div>
              </div>
              <div class="controller-settings-item">
                <div class="controller-property">
                  <span>Sprint Action</span>
                </div>
                <div class="controller-property-value">
                  <el-select v-model="gameSetting.SprintSource" class="dark-select" placeholder="Select" size="default"
                    @change="changeSprintSource" style="width: 240px">
                    <el-option label="No sprint" :value="0" />
                    <el-option label="Trackpad click" :value="1" />
                    <el-option label="Trackpad double click" :value="2" />
                    <el-option label="Joystick click" :value="3" />
                    <el-option label="Grip press" :value="4" />
                  </el-select>
                </div>
              </div>
              <div class="controller-settings-item">
                <div class="controller-property">
                  <span>Jump Action</span>
                </div>
                <div class="controller-property-value">
                  <el-select v-model="gameSetting.JumpSource" class="dark-select" placeholder="Select" size="default"
                    @change="changeJumpSource" style="width: 240px">
                    <el-option label="Left trigger" :value="0" />
                    <el-option label="Left grip" :value="1" />
                    <el-option label="Left trackpad click up" :value="2" />
                    <el-option label="Left trackpad click down" :value="3" />
                    <el-option label="Left trackpad click left" :value="4" />
                    <el-option label="Left trackpad click right" :value="5" />
                    <el-option label="Left trackpad click center" :value="6" />
                    <el-option label="Left joystick click" :value="7" />
                    <el-option label="Left joystick up" :value="8" />
                    <el-option label="Left joystick down" :value="9" />
                    <el-option label="Left joystick left" :value="10" />
                    <el-option label="Left joystick right" :value="11" />
                    <el-option label="Left X" :value="12" />
                    <el-option label="Left Y/menu" :value="13" />
                    <el-option label="Right trigger" :value="14" />
                    <el-option label="Right grip" :value="15" />
                    <el-option label="Right trackpad click up" :value="16" />
                    <el-option label="Right trackpad click down" :value="17" />
                    <el-option label="Right trackpad click left" :value="18" />
                    <el-option label="Right trackpad click right" :value="19" />
                    <el-option label="Right trackpad click center" :value="20" />
                    <el-option label="Right joystick click" :value="21" />
                    <el-option label="Right joystick up" :value="22" />
                    <el-option label="Right joystick down" :value="23" />
                    <el-option label="Right joystick left" :value="24" />
                    <el-option label="Right joystick right" :value="25" />
                    <el-option label="Right A" :value="26" />
                    <el-option label="Right B/menu" :value="27" />
                    <el-option label="No jump" :value="28" />
                  </el-select>
                </div>
              </div>
            </div>
            <div class="controller-settings-tip">
              <div class="controller-settings-tip-text">
                <p>Correction of Hidden Parameters in Game (skip if unsure)</p>
              </div>
            </div>
            <div class="controller-settings-controls">
              <div class="acceleration-curve-container">
                <div class="acceleration-curve-line">
                  <div class="acceleration-curve-key">
                    <span>Acceleration Curve</span>
                  </div>
                  <div class="acceleration-curve-value">
                    <el-button size="default" @click="restoreCurve" plain>Default</el-button>
                  </div>
                </div>
              </div>
              <div class="acceleration-curve-slider">
                <div class="slider-min">
                  <div class="slider-min-icon" @click="curveDecrease">-</div>
                  <div class="slider-min-text">0</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="gameSetting.Curve" size="default" :min="0" :max="100" :step="1"
                    :show-tooltip="true" :show-stops="false" @change="changeCurve" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="curveIncrease">+</div>
                  <div class="slider-max-text">100</div>
                </div>
              </div>
            </div>
            <div class="controller-settings-controls">
              <div class="get-max-speed-container">
                <div class="get-max-speed-line">
                  <div class="get-max-speed-key">
                    <span>Hardness to Get Max Speed</span>
                  </div>
                  <div class="get-max-speed-value">
                    <el-button size="default" @click="restoreMaxSpeedInGame" plain>Default</el-button>
                  </div>
                </div>
              </div>
              <div class="get-max-speed-slider">
                <div class="slider-min">
                  <div class="slider-min-icon" @click="maxSpeedInGameDecrease">-</div>
                  <div class="slider-min-text">0</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="gameSetting.MaxSpeedInGame" size="default" :min="0" :max="5" :step="0.01"
                    :show-tooltip="true" :show-stops="false" @change="changeMaxSpeedInGame" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="maxSpeedInGameIncrease">+</div>
                  <div class="slider-max-text">5</div>
                </div>
              </div>
            </div>
            <div class="controller-settings-controls">
              <div class="starting-joystick-mapping-container">
                <div class="starting-joystick-mapping-line">
                  <div class="starting-joystick-mapping-key">
                    <span>Starting Joystick Mapping</span>
                  </div>
                  <div class="starting-joystick-mapping-value">
                    <el-button size="default" @click="restoreDeadZone" plain>Default</el-button>
                  </div>
                </div>
              </div>
              <div class="starting-joystick-mapping-slider">
                <div class="slider-min">
                  <div class="slider-min-icon" @click="deadZoneDecrease">-</div>
                  <div class="slider-min-text">0</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="gameSetting.DeadZone" size="default" :min="0" :max="50" :step="1"
                    :show-tooltip="true" :show-stops="false" @change="changeDeadZone" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="deadZoneIncrease">+</div>
                  <div class="slider-max-text">50</div>
                </div>
              </div>
            </div>
            <div class="controller-settings-controls">
              <div class="max-joystick-mapping-container">
                <div class="max-joystick-mapping-line">
                  <div class="max-joystick-mapping-key">
                    <span>Max Joystick Mapping</span>
                  </div>
                  <div class="max-joystick-mapping-value">
                    <el-button size="default" @click="restoreActiveZone" plain>Default</el-button>
                  </div>
                </div>
              </div>
              <div class="max-joystick-mapping-slider">
                <div class="slider-min">
                  <div class="slider-min-icon" @click="activeZoneDecrease">-</div>
                  <div class="slider-min-text">50</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="gameSetting.ActiveZone" size="default" :min="50" :max="100" :step="1"
                    :show-tooltip="true" :show-stops="false" @change="changeActiveZone" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="activeZoneIncrease">+</div>
                  <div class="slider-max-text">100</div>
                </div>
              </div>
            </div>
            <!-- Sitting Config -->
            <div class="controller-settings-controls">
              <div class="sitting-container">
                <div class="sitting-line">
                  <div class="sitting-key">
                    <span>Vehicle hub Mode</span>
                  </div>
                  <div class="sitting-value">
                    <el-radio-group v-model="vehicleSetting.vehicleHub" size="default" text-color="#fff" fill="#05C3DE"
                      @change="changeVehicleHub">
                      <el-radio-button :value="true">ON</el-radio-button>
                      <el-radio-button :value="false">OFF</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
                <div class="sitting-line">
                  <div class="sitting-key">
                    <span>Quick Drive Mode</span>
                  </div>
                  <div class="sitting-value">
                    <el-radio-group v-model="vehicleSetting.quickDriveMode" size="default" text-color="#fff"
                      fill="#05C3DE" @change="changeQuickDriveMode">
                      <el-radio-button :value="true">ON</el-radio-button>
                      <el-radio-button :value="false">OFF</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="controller-settings-controls">
              <div class="mod-setting-container">
                <div class="mod-setting-item">
                  <div class="mod-icon" @click="changeMode(0)">
                    <img v-if="vehicleSetting.vehicleHubType === 0" :src="autoOn" alt="" width="60" height="60"
                      v-nodrag />
                    <img v-else :src="autoOff" alt="" width="60" height="60" v-nodrag />
                  </div>
                  <div class="mod-text">AUTO</div>
                </div>
                <div class="mod-setting-item">
                  <div class="mod-icon" @click="changeMode(1)">
                    <img v-if="vehicleSetting.vehicleHubType === 1" :src="mountOn" alt="" width="60" height="60"
                      v-nodrag />
                    <img v-else :src="mountOff" alt="" width="60" height="60" v-nodrag />
                  </div>
                  <div class="mod-text">MOUNTS</div>
                </div>
                <div class="mod-setting-item">
                  <div class="mod-icon" @click="changeMode(2)">
                    <img v-if="vehicleSetting.vehicleHubType === 2" :src="aircraftOn" alt="" width="60" height="60"
                      v-nodrag />
                    <img v-else :src="aircraftOff" alt="" width="60" height="60" v-nodrag />
                  </div>
                  <div class="mod-text">AIRCRAFT</div>
                </div>
                <div class="mod-setting-item">
                  <div class="mod-icon" @click="changeMode(3)">
                    <img v-if="vehicleSetting.vehicleHubType === 3" :src="heavyvehicleOn" alt="" width="60" height="60"
                      v-nodrag />
                    <img v-else :src="heavyvehicleOff" alt="" width="60" height="60" v-nodrag />
                  </div>
                  <div class="mod-text">HEAVY VEHICLES</div>
                </div>
              </div>
            </div>
            <div class="controller-settings-controls">
              <div class="vehicle-speed-container">
                <div class="vehicle-speed-line">
                  <div class="vehicle-speed-key">
                    <span>Vehicle Speed</span>
                  </div>
                  <div class="vehicle-speed-value">
                    <el-button size="default" plain @click="restoreVehicleHubSpeed">Default</el-button>
                  </div>
                </div>
              </div>
              <div class="vehicle-speed-slider">
                <div class="slider-min">
                  <div class="slider-min-icon" @click="vehicleHubSpeedDecrease">-</div>
                  <div class="slider-min-text">MIN</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="vehicleSetting.vehicleHubSpeed" size="default" :min="1.1" :max="2" :step="0.1"
                    :show-tooltip="true" :show-stops="false" @change="changeVehicleHubSpeed" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="vehicleHubSpeedIncrease">+</div>
                  <div class="slider-max-text">MAX</div>
                </div>
              </div>
            </div>
            <div class="controller-settings-controls">
              <div class="road-roughness-simulation-container">
                <div class="road-roughness-simulation-line">
                  <div class="road-roughness-simulation-key">
                    <span>Road Roughness Simulation</span>
                  </div>
                  <div class="road-roughness-simulation-value">
                    <el-button size="default" plain @click="restoreVehicleRRSimulation">
                      Default
                    </el-button>
                  </div>
                </div>
              </div>
              <div class="road-roughness-simulation-slider">
                <div class="slider-min">
                  <div class="slider-min-icon" @click="vehicleRRSimulationDecrease">-</div>
                  <div class="slider-min-text">MIN</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="vehicleSetting.vehicleRRSimulation" size="default" :min="0" :max="2" :step="0.1"
                    :show-tooltip="true" :show-stops="false" @change="changeVehicleRRSimulation" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="vehicleRRSimulationIncrease">+</div>
                  <div class="slider-max-text">MAX</div>
                </div>
              </div>
            </div>
            <!-- Haptics Config -->
            <div class="controller-settings-controls">
              <div class="haptics-container">
                <div class="haptics-line">
                  <div class="haptics-key">
                    <span>Haptics Mode</span>
                  </div>
                  <div class="haptics-value">
                    <el-radio-group v-model="hapticsSetting.HapticsMoudleEnable" size="default" text-color="#fff"
                      fill="#05C3DE" @change="changeHapticsMoudleEnable">
                      <el-radio-button :value="true">ON</el-radio-button>
                      <el-radio-button :value="false">OFF</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="controller-settings-controls">
              <div class="vibration-container">
                <div class="vibration-line">
                  <div class="vibration-key">
                    <span>Trigger By Controller Vibration</span>
                  </div>
                  <div class="vibration-value">
                    <el-button size="default" plain @click="restoreVibrateLevel">Default</el-button>
                  </div>
                </div>
              </div>
              <div class="vibration-slider">
                <div :class="['vibration-icon', { active: inputConfig.vibrateLevel > 0 }]">
                  <span v-if="inputConfig.vibrateLevel > 0">ON</span>
                  <span v-else>OFF</span>
                </div>
                <div class="slider-min">
                  <div class="slider-min-icon" @click="vibrateLevelDecrease">-</div>
                  <div class="slider-min-text">MIN</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="inputConfig.vibrateLevel" size="default" :min="0" :max="6" :step="1"
                    :show-tooltip="true" :show-stops="false" @change="changeVibrateLevel" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="vibrateLevelIncrease">+</div>
                  <div class="slider-max-text">MAX</div>
                </div>
                <div class="vibration-test">
                  <el-button size="default" plain>Test</el-button>
                </div>
              </div>
            </div>
            <div class="controller-settings-controls">
              <div class="trigger-by-steps-container">
                <div class="trigger-by-steps-line">
                  <div class="trigger-by-steps-key">
                    <span>Trigger By Steps</span>
                  </div>
                  <div class="trigger-by-steps-value">
                    <el-button size="default" plain @click="restoreTriggerBySteps">Default</el-button>
                  </div>
                </div>
              </div>
              <div class="trigger-by-steps-slider">
                <div :class="['trigger-by-steps-icon', { active: hapticsSetting.C2TriggerBySteps > 0 }]">
                  <span v-if="hapticsSetting.C2TriggerBySteps > 0">ON</span>
                  <span v-else>OFF</span>
                </div>
                <div class="slider-min">
                  <div class="slider-min-icon" @click="triggerByStepsDecrease">-</div>
                  <div class="slider-min-text">MIN</div>
                </div>
                <div class="slider-control">
                  <el-slider v-model="hapticsSetting.C2TriggerBySteps" size="default" :min="0" :max="3" :step="1"
                    :show-tooltip="true" :show-stops="false" @change="changeC2TriggerBySteps" />
                </div>
                <div class="slider-max">
                  <div class="slider-max-icon" @click="triggerByStepsIncrease">+</div>
                  <div class="slider-max-text">MAX</div>
                </div>
                <div class="trigger-by-steps-test">
                  <el-button size="default" plain>Test</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'config'" class="tab-panel">
        <div class="game-config-describe">
          <div class="config-item">
            <div class="config-item-content">
              <div class="first-describe">
                <div class="config-item-icon">
                  <img v-nodrag :src="attention" alt="" />
                </div>
                <div class="config-item-text">
                  <p>
                    These parameters below describe locomotion in the original game. Warning: To
                    customize things, please go to "Preference".
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="config-item">
            <div class="config-item-content">
              <div class="second-describe">
                <div class="config-item-icon">
                  <img v-nodrag :src="attention" alt="" />
                </div>
                <div class="config-item-text">
                  <p>Step 1: Set the Game config as following:</p>
                </div>
              </div>
            </div>
          </div>
          <div class="config-item">
            <div class="config-item-content">
              <div class="third-describe">
                <div class="config-item-text">
                  <p>
                    ALWAYS SET the game to HEAD ORIENTED DIRECTION and FREE / SMOOTH LOCOMOTION FOR
                    WALKING to have the proper walking with independent walking direction.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="config-item">
            <div class="config-item-content">
              <div class="fourth-describe">
                <div class="config-item-text">
                  <p>KAT always walk towards the direction of body.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="config-item">
            <div class="config-item-content">
              <div class="fiveth-describe">
                <div class="config-item-text">
                  <div class="config-item-icon">
                    <img v-nodrag :src="attention" alt="" />
                  </div>
                  <div class="config-item-text">
                    <p>
                      Step 2: Set below locomotion method according to original game and your
                      controller (Every time after changes):
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="config-item">
            <div v-if="gameInfo" class="config-item-content" v-html="gameInfo.gameTips">
            </div>
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'vrhud'" class="tab-panel">
        <div class="vr-hud-container">
          <div class="vr-hud-left-panel">
            <hudPreviewEle :hudConfig="hudConfig" @update-position="UpdateHudPosition">
            </hudPreviewEle>
          </div>
          <div class="vr-hud-right-panel">
            <div class="global-settings">
              <div class="global-settings-title">Global Settings</div>
              <div class="global-settings-property">
                <el-button size="default" @click="ApplyToAllgamesGlobalSettings">Apply to all games</el-button>
              </div>
            </div>
            <div class="global-settings-controls">
              <div class="control-item">
                <div class="control-item-panel">
                  <div class="control-item-text">
                    <div class="text-icon">
                      <img v-nodrag :src="hudDistance" alt="" />
                    </div>
                    <div class="text-title">HUD Distance</div>
                  </div>
                  <div class="control-item-restore">
                    <el-icon @click="restoreHudDistance">
                      <RefreshLeft />
                    </el-icon>
                  </div>
                </div>
                <div class="control-item-panel">
                  <div class="panel-controls">
                    <div class="controls-left-text">Near</div>
                    <div class="control-slider">
                      <el-slider v-model="hudConfig.hudDistanceZ" show-tooltip :min="2" :max="10"
                        :step="0.1"></el-slider>
                    </div>
                    <div class="controls-right-text">Far</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="global-settings">
              <div class="global-settings-title">Module Settings</div>
              <div class="global-settings-property">
                <el-button size="default">Apply to all games</el-button>
              </div>
            </div>
            <div class="module-settings-controls">
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="heart" alt="" />
                      </div>
                      <div class="text-title">Heart Rate</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showHeartRate">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="heartDialogVisible" title="Heart Rate" width="430" center>
                        <div class="heart-rate-setting">
                          <div class="heart-rate-item">
                            <div class="opacity-container">
                              <div class="opacity-container-text">
                                <div class="opacity-icon"></div>
                                <div class="opacity-title">Opacity</div>
                              </div>
                              <div class="opacity-container-restore">
                                <el-icon @click="restoreHeartRateOpacity">
                                  <RefreshLeft />
                                </el-icon>
                              </div>
                            </div>
                          </div>
                          <div class="heart-rate-item">
                            <div class="heart-rate-control">
                              <div class="heart-rate-reduce">0%</div>
                              <div class="heart-rate-slider">
                                <el-slider v-model="hudConfig.heartRateOpacity" show-tooltip :min="0" :max="1"
                                  :step="0.1"></el-slider>
                              </div>
                              <div class="heart-rate-increase">100%</div>
                            </div>
                          </div>
                          <div class="heart-rate-item">
                            <el-divider />
                          </div>
                          <div class="heart-rate-item">
                            <div class="heart-rate-config">
                              <div class="heart-rate-text">Haert Rate</div>
                              <div class="heart-rate-switch">
                                <el-switch v-model="hudConfig.heartRatingVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="heart-rate-item">
                            <div class="fitness-zone-config">
                              <div class="fitness-zone-text">Fitness Zone</div>
                              <div class="fitness-zone-switch">
                                <el-switch v-model="hudConfig.stateofSportsVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="heartDialogVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="heartDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="hudConfig.heartRateVisible" size="small" />
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreHeartRate">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control" @click="heartRateSizeDecrease">A-</div>
                  <div class="heart-rate-control">
                    <el-slider v-model="hudConfig.heartRateSize" show-tooltip :min="0.4" :max="2"
                      :step="0.1"></el-slider>
                  </div>
                  <div class="increase-control" @click="heartRateSizeIncrease">A+</div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="fitness" alt="" />
                      </div>
                      <div class="text-title">Fitness Data</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showFitnessData">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="fitnessDialogVisible" title="Fitness Data" width="430" center>
                        <div class="fitness-data-setting">
                          <div class="fitness-data-item">
                            <div class="opacity-container">
                              <div class="opacity-container-text">
                                <div class="opacity-icon"></div>
                                <div class="opacity-title">Opacity</div>
                              </div>
                              <div class="opacity-container-restore">
                                <el-icon @click="restoreFitnessDataOpacity">
                                  <RefreshLeft />
                                </el-icon>
                              </div>
                            </div>
                          </div>
                          <div class="fitness-data-item">
                            <div class="fitness-data-control">
                              <div class="fitness-data-reduce">0%</div>
                              <div class="fitness-data-slider">
                                <el-slider v-model="hudConfig.fitnessDataOpacity" show-tooltip :min="0" :max="1"
                                  :step="0.1"></el-slider>
                              </div>
                              <div class="fitness-data-increase">100%</div>
                            </div>
                          </div>
                          <div class="fitness-data-item">
                            <el-divider />
                          </div>
                          <div class="fitness-data-item">
                            <div class="walking-config">
                              <div class="walking-text">Walking</div>
                              <div class="walking-switch">
                                <el-switch v-model="hudConfig.walkingVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="fitness-data-item">
                            <div class="mileage-config">
                              <div class="mileage-text">Mileage</div>
                              <div class="mileage-switch">
                                <el-switch v-model="hudConfig.mileageVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="fitness-data-item">
                            <div class="consume-config">
                              <div class="consume-text">Consume</div>
                              <div class="consume-switch">
                                <el-switch v-model="hudConfig.consumeVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="fitness-data-item">
                            <div class="active-time-config">
                              <div class="active-time-text">Active Time</div>
                              <div class="active-time-switch">
                                <el-switch v-model="hudConfig.sportsTimeVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="fitnessDialogVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="fitnessDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="hudConfig.fitnessDataVisible" size="small"></el-switch>
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreFitnessData">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control" @click="fitnessDataSizeDecrese">A-</div>
                  <div class="fitness-data-control">
                    <el-slider v-model="hudConfig.fitnessDataSize" show-tooltip :min="0.4" :max="2"
                      :step="0.1"></el-slider>
                  </div>
                  <div class="increase-control" @click="fitnessDataSizeIncrese">A+</div>
                </div>
              </div>
            </div>
            <div class="module-settings-controls">
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="deviceDirection" alt="" />
                      </div>
                      <div class="text-title">Device Direction</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showDirectionDialog">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="directionDialogVisible" title="Device Direction" width="430" center>
                        <div class="device-direction-setting">
                          <div class="device-direction-item">
                            <div class="opacity-container">
                              <div class="opacity-container-text">
                                <div class="opacity-icon"></div>
                                <div class="opacity-title">Opacity</div>
                              </div>
                              <div class="opacity-container-restore">
                                <el-icon @click="restoreDirectionOpacity">
                                  <RefreshLeft />
                                </el-icon>
                              </div>
                            </div>
                          </div>
                          <div class="device-direction-item">
                            <div class="device-direction-control">
                              <div class="device-direction-reduce">0%</div>
                              <div class="device-direction-slider">
                                <el-slider v-model="hudConfig.deviceDirectionOpacity" show-tooltip :min="0" :max="1"
                                  :step="0.1"></el-slider>
                              </div>
                              <div class="device-direction-increase">100%</div>
                            </div>
                          </div>
                          <div class="device-direction-item">
                            <el-divider />
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="directionDialogVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="directionDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="hudConfig.deviceDirectionVisible" size="small"></el-switch>
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreDeviceDirection">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control" @click="deviceDirectionDecrease">A-</div>
                  <div class="device-direction-control">
                    <el-slider v-model="hudConfig.deviceDirectionSize" show-tooltip :min="0.4" :max="2"
                      :step="0.1"></el-slider>
                  </div>
                  <div class="increase-control" @click="deviceDirectionIncrease">A+</div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="deviceStatus" alt="" />
                      </div>
                      <div class="text-title">Device Status</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showDeviceStatus">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="deviceStatusDialogVisible" title="Device Status" width="430" center>
                        <div class="device-status-setting">
                          <div class="device-status-item">
                            <div class="opacity-container">
                              <div class="opacity-container-text">
                                <div class="opacity-icon"></div>
                                <div class="opacity-title">Opacity</div>
                              </div>
                              <div class="opacity-container-restore">
                                <el-icon @click="restoreDeviceStatusOpacity">
                                  <RefreshLeft />
                                </el-icon>
                              </div>
                            </div>
                          </div>
                          <div class="device-status-item">
                            <div class="device-status-control">
                              <div class="device-status-reduce">0%</div>
                              <div class="device-status-slider">
                                <el-slider v-model="hudConfig.deviceStatusOpacity" show-tooltip :min="0" :max="1"
                                  :step="0.1"></el-slider>
                              </div>
                              <div class="device-status-increase">100%</div>
                            </div>
                          </div>
                          <div class="device-status-item">
                            <el-divider />
                          </div>
                          <div class="device-status-item">
                            <div class="armband-config">
                              <div class="armband-text">VR Armband</div>
                              <div class="armband-switch">
                                <el-switch v-model="hudConfig.armbandVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="device-status-item">
                            <div class="direction-sensor-config">
                              <div class="direction-sensor-text">Direction Sensor</div>
                              <div class="direction-sensor-switch">
                                <el-switch v-model="hudConfig.directionVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="device-status-item">
                            <div class="foot-sensor-config">
                              <div class="foot-sensor-text">Foot Sensor</div>
                              <div class="foot-sensor-switch">
                                <el-switch v-model="hudConfig.leftFootVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="deviceStatusDialogVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="deviceStatusDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="hudConfig.deviceStatusVisible" size="small"></el-switch>
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreDeviceStatus">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control" @click="deviceStatusSizeDecrease">A-</div>
                  <div class="device-status-control">
                    <el-slider v-model="hudConfig.deviceStatusSize" show-tooltip :min="0.4" :max="2"
                      :step="0.1"></el-slider>
                  </div>
                  <div class="increase-control" @click="deviceStatusSizeIncrease">A+</div>
                </div>
              </div>
            </div>
            <div class="module-settings-controls">
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="todayRank" alt="" />
                      </div>
                      <div class="text-title">Today's Rank</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showRankDialog">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="rankDialogVisible" title="Today's Rank" width="430" center>
                        <div class="today-rank-setting">
                          <div class="today-rank-item">
                            <div class="opacity-container">
                              <div class="opacity-container-text">
                                <div class="opacity-icon"></div>
                                <div class="opacity-title">Opacity</div>
                              </div>
                              <div class="opacity-container-restore">
                                <el-icon>
                                  <RefreshLeft />
                                </el-icon>
                              </div>
                            </div>
                          </div>
                          <div class="today-rank-item">
                            <div class="today-rank-control">
                              <div class="today-rank-reduce">0%</div>
                              <div class="today-rank-slider">
                                <el-slider v-model="hudConfig.todaysRankOpacity" show-tooltip :min="0" :max="1"
                                  :step="0.1"></el-slider>
                              </div>
                              <div class="today-rank-increase">100%</div>
                            </div>
                          </div>
                          <div class="today-rank-item">
                            <el-divider />
                          </div>
                          <div class="today-rank-item">
                            <div class="update-frequency-config">
                              <div class="update-frequency-text">Update Frequency Text</div>
                              <div class="update-frequency-switch">
                                <el-switch v-model="hudConfig.updateFrequencyTextVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="rankDialogVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="rankDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="hudConfig.todaysRankVisible" size="small" />
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreTodayRank">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control" @click="todaysRankSizeDecrease">A-</div>
                  <div class="today-rank-control">
                    <el-slider v-model="hudConfig.todaysRankSize" show-tooltip :min="0.4" :max="2"
                      :step="0.1"></el-slider>
                  </div>
                  <div class="increase-control" @click="todaysRankSizeIncrease">A+</div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="currentTime" alt="" />
                      </div>
                      <div class="text-title">Current Time</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showTimeDialog">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="currentTimeDialogVisible" title="Current Time" width="430" center>
                        <div class="current-time-setting">
                          <div class="current-time-item">
                            <div class="opacity-container">
                              <div class="opacity-container-text">
                                <div class="opacity-icon"></div>
                                <div class="opacity-title">Opacity</div>
                              </div>
                              <div class="opacity-container-restore">
                                <el-icon>
                                  <RefreshLeft />
                                </el-icon>
                              </div>
                            </div>
                          </div>
                          <div class="current-time-item">
                            <div class="current-time-control">
                              <div class="current-time-reduce">0%</div>
                              <div class="current-time-slider">
                                <el-slider v-model="hudConfig.currentTimeOpacity" show-tooltip :min="0" :max="1"
                                  :step="0.1"></el-slider>
                              </div>
                              <div class="current-time-increase">100%</div>
                            </div>
                          </div>
                          <div class="current-time-item">
                            <el-divider />
                          </div>
                          <div class="current-time-item">
                            <div class="date-config">
                              <div class="date-text">Date</div>
                              <div class="date-select">
                                <el-select v-model="hudConfig.currentTimeDate" placeholder="Select" size="small"
                                  style="width: 130px">
                                  <el-option label="MM/DD/YYYY" :value="0" />
                                  <el-option label="DD/MM/YYYY" :value="1" />
                                  <el-option label="YYYY/MM/DD" :value="2" />
                                  <el-option label="Hidden" :value="3" />
                                </el-select>
                              </div>
                            </div>
                          </div>
                          <div class="current-time-item">
                            <div class="time-config">
                              <div class="time-text">Time</div>
                              <div class="time-select">
                                <el-select v-model="hudConfig.currentTimeTime" placeholder="Select" size="small"
                                  style="width: 130px">
                                  <el-option label="AM/PM Time" :value="0" />
                                  <el-option label="HH:MM" :value="1" />
                                  <el-option label="Hidden" :value="2" />
                                </el-select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="currentTimeDialogVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="currentTimeDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="hudConfig.currentTimeVisible" />
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreCurrentTime">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control" @click="currentTimeSizeDecrease">A-</div>
                  <div class="current-time-control">
                    <el-slider v-model="hudConfig.currentTimeSize" show-tooltip :min="0.4" :max="2"
                      :step="0.1"></el-slider>
                  </div>
                  <div class="increase-control" @click="currentTimeSizeIncrease">A+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section v-if="activeTab === 'armview'" class="tab-panel">
        <div class="armview-container">
          <div class="armview-left-container">
            <armviewPreview :armviewConfig="armviewConfig" @update-position="updateArmviewPosition" />
          </div>
          <div class="armview-right-container">
            <div class="global-settings">
              <div class="global-settings-title">Global Settings</div>
              <div class="global-settings-property">
                <el-button size="default">Apply to all games</el-button>
              </div>
            </div>
            <div class="global-settings-controls">
              <div class="control-item">
                <div class="control-item-panel">
                  <div class="control-item-text">
                    <div class="text-icon">
                      <img :src="displayArm" alt="" />
                    </div>
                    <div class="text-title">Display Arm</div>
                  </div>
                  <div class="control-item-choose">
                    <el-radio-group v-model="armviewConfig.armViewDisplayArm" size="small" text-color="#fff"
                      fill="#05C3DE" @change="handleChangeDisplayArm">
                      <el-radio-button :value="true">L</el-radio-button>
                      <el-radio-button :value="false">R</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-text">
                    <div class="text-icon">
                      <img :src="psize" alt="" />
                    </div>
                    <div class="text-title">Size</div>
                  </div>
                  <div class="control-item-restore">
                    <el-icon @click="restoreArmviewSize">
                      <RefreshLeft />
                    </el-icon>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control" @click="armViewSizeDecrease">A-</div>
                  <div class="size-control">
                    <el-slider v-model="armviewConfig.armViewSize" show-tooltip :min="0.325" :max="0.775"
                      :step="0.05"></el-slider>
                  </div>
                  <div class="increase-control" @click="armViewSizeIncrease">A+</div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-text">
                    <div class="text-icon">
                      <img :src="rotate" alt="" />
                    </div>
                    <div class="text-title">Rotate</div>
                  </div>
                  <div class="control-item-restore">
                    <el-icon @click="restoreRotate">
                      <RefreshLeft />
                    </el-icon>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control">0°</div>
                  <div class="size-control">
                    <el-slider v-model="armviewConfig.overlayRotAngle" :min="range.min" :max="range.max"
                      :step="1"></el-slider>
                  </div>
                  <div class="increase-control">180°</div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-text">
                    <div class="text-icon">
                      <img :src="floatsHeight" alt="" />
                    </div>
                    <div class="text-title">Floats Height</div>
                  </div>
                  <div class="control-item-restore">
                    <el-icon @click="restoreFloatsHeight">
                      <RefreshLeft />
                    </el-icon>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control">Low</div>
                  <div class="size-control">
                    <el-slider v-model="armviewConfig.armviewHeight" show-tooltip :min="-0.05" :max="0.05" :step="0.01"
                      reverse></el-slider>
                  </div>
                  <div class="increase-control">Height</div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-text">
                    <div class="text-icon">
                      <img :src="opacity" alt="" />
                    </div>
                    <div class="text-title">Opacity</div>
                  </div>
                  <div class="control-item-restore">
                    <el-icon @click="restoreArmviewOpacity">
                      <RefreshLeft />
                    </el-icon>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control">40%</div>
                  <div class="size-control">
                    <el-slider v-model="armviewConfig.armviewOpacity" show-tooltip :min="0.4" :max="1"
                      :step="0.01"></el-slider>
                  </div>
                  <div class="increase-control">100%</div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-text">
                    <div class="text-icon">
                      <img :src="backgroundOpacity" alt="" />
                    </div>
                    <div class="text-title">Background Opacity</div>
                  </div>
                  <div class="control-item-restore">
                    <el-icon @click="restorePanelOpacity">
                      <RefreshLeft />
                    </el-icon>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control">0%</div>
                  <div class="size-control">
                    <el-slider v-model="armviewConfig.panelOpacity" show-tooltip :min="0" :max="1"
                      :step="0.1"></el-slider>
                  </div>
                  <div class="increase-control">100%</div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-text">
                    <div class="text-icon">
                      <img :src="vanishDistance" alt="" />
                    </div>
                    <div class="text-title">Vanish Distance</div>
                  </div>
                  <div class="control-item-restore">
                    <el-icon @click="restoreVanishDistance">
                      <RefreshLeft />
                    </el-icon>
                  </div>
                </div>
                <div class="control-item-size">
                  <div class="reduce-control">Near</div>
                  <div class="size-control">
                    <el-slider v-model="armviewConfig.armviewDisplayDistance" show-tooltip :min="0.25" :max="1"
                      :step="0.05"></el-slider>
                  </div>
                  <div class="increase-control">Far</div>
                </div>
              </div>
            </div>
            <div class="global-settings">
              <div class="global-settings-title">Module Settings</div>
            </div>
            <div class="global-settings-controls">
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="heart" alt="" />
                      </div>
                      <div class="text-title">Heart Rate</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showArmHeartRate">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="armHeartRateDialogVisible" title="Heart Rate" width="430" center>
                        <div class="heart-rate-setting">
                          <div class="heart-rate-item">
                            <div class="heart-rate-config">
                              <div class="heart-rate-text">Haert Rate</div>
                              <div class="heart-rate-switch">
                                <el-switch v-model="armviewConfig.armviewHeartRatingVisible" size="small" />
                              </div>
                            </div>
                          </div>
                          <div class="heart-rate-item">
                            <div class="fitness-zone-config">
                              <div class="fitness-zone-text">Fitness Zone</div>
                              <div class="fitness-zone-switch">
                                <el-switch v-model="armviewConfig.armviewStateofSportsVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="armHeartRateDialogVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="armHeartRateDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="armviewConfig.armviewHeartRateVisible" size="small" />
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreArmHeartRate">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="todayRank" alt="" />
                      </div>
                      <div class="text-title">Today's Rank</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showArmTodayRank">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="armRankDialogVisible" title="Today's Rank" width="430" center>
                        <div class="today-rank-setting">
                          <div class="today-rank-item">
                            <div class="update-frequency-config">
                              <div class="update-frequency-text">Update Frequency Text</div>
                              <div class="update-frequency-switch">
                                <el-switch v-model="armviewConfig.armviewUpdateFrequencyText" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="armRankDialogVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="armRankDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="armviewConfig.armviewTodaysRankVisible" size="small" />
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreArmTodayRank">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="deviceDirection" alt="" />
                      </div>
                      <div class="text-title">Device Direction</div>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="armviewConfig.armviewDeviceDirectionVisible" size="small" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="fitness" alt="" />
                      </div>
                      <div class="text-title">Fitness Data</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showArmFitnessDialogVisible">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="armFitnessDialogVisible" title="Fitness Data" width="430" center>
                        <div class="fitness-data-setting">
                          <div class="fitness-data-item">
                            <div class="walking-config">
                              <div class="walking-text">Walking</div>
                              <div class="walking-switch">
                                <el-switch v-model="armviewConfig.armviewWalkingVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="fitness-data-item">
                            <div class="mileage-config">
                              <div class="mileage-text">Mileage</div>
                              <div class="mileage-switch">
                                <el-switch v-model="armviewConfig.armviewMileageVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="fitness-data-item">
                            <div class="consume-config">
                              <div class="consume-text">Consume</div>
                              <div class="consume-switch">
                                <el-switch v-model="armviewConfig.armviewConsumeVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="fitness-data-item">
                            <div class="active-time-config">
                              <div class="active-time-text">Active Time</div>
                              <div class="active-time-switch">
                                <el-switch v-model="armviewConfig.armviewActiveTimeVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="armFitnessDialogVisible = false">Cancel</el-button>
                            <el-button type="primary" @click="armFitnessDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="armviewConfig.armviewFitnessDataVisible" size="small" />
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreArmFitnessData">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="deviceStatus" alt="" />
                      </div>
                      <div class="text-title">Device Status</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showArmDeviceStatusDataVisible">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="armDeviceStatusDialogVisible" title="Device Status" width="430" center>
                        <div class="device-status-setting">
                          <div class="device-status-item">
                            <div class="armband-config">
                              <div class="armband-text">VR Armband</div>
                              <div class="armband-switch">
                                <el-switch v-model="armviewConfig.armviewArmbandVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="device-status-item">
                            <div class="direction-sensor-config">
                              <div class="direction-sensor-text">Direction Sensor</div>
                              <div class="direction-sensor-switch">
                                <el-switch v-model="armviewConfig.armviewDirectionVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                          <div class="device-status-item">
                            <div class="foot-sensor-config">
                              <div class="foot-sensor-text">Foot Sensor</div>
                              <div class="foot-sensor-switch">
                                <el-switch v-model="armviewConfig.armviewLeftFootVisible" size="small"></el-switch>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="armDeviceStatusDialogVisible = false">
                              Cancel
                            </el-button>
                            <el-button type="primary" @click="armDeviceStatusDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="armviewConfig.armviewDeviceStatusVisible" size="small" />
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreArmDeviceStatusData">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div class="control-item">
                <div class="control-item-property">
                  <div class="control-item-panel">
                    <div class="control-item-text">
                      <div class="text-icon">
                        <img v-nodrag :src="currentTime" alt="" />
                      </div>
                      <div class="text-title">Current Time</div>
                    </div>
                    <div class="control-item-setting">
                      <el-icon @click="showArmCurrentTimeDialogVisible">
                        <MoreFilled />
                      </el-icon>
                      <el-dialog v-model="armCurrentTimeDialogVisible" title="Current Time" width="430" center>
                        <div class="current-time-setting">
                          <div class="current-time-item">
                            <div class="date-config">
                              <div class="date-text">Date</div>
                              <div class="date-select">
                                <el-select v-model="armviewConfig.armviewCurrentTimeDate" placeholder="Select"
                                  size="small" style="width: 130px">
                                  <el-option label="MM/DD/YYYY" :value="0" />
                                  <el-option label="DD/MM/YYYY" :value="1" />
                                  <el-option label="YYYY/MM/DD" :value="2" />
                                  <el-option label="Hidden" :value="3" />
                                </el-select>
                              </div>
                            </div>
                          </div>
                          <div class="current-time-item">
                            <div class="time-config">
                              <div class="time-text">Time</div>
                              <div class="time-select">
                                <el-select v-model="armviewConfig.armviewCurrentTimeTime" placeholder="Select"
                                  size="small" style="width: 130px">
                                  <el-option label="AM/PM Time" :value="0" />
                                  <el-option label="HH:MM" :value="1" />
                                  <el-option label="Hidden" :value="2" />
                                </el-select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template #footer>
                          <div class="dialog-footer">
                            <el-button @click="armCurrentTimeDialogVisible = false">
                              Cancel
                            </el-button>
                            <el-button type="primary" @click="armCurrentTimeDialogVisible = false">
                              Confirm
                            </el-button>
                          </div>
                        </template>
                      </el-dialog>
                    </div>
                  </div>
                  <div class="control-item-panel">
                    <div class="panel-item">
                      <el-switch v-model="armviewConfig.armviewCurrentTimeVisible" size="small" />
                    </div>
                    <div class="panel-item">
                      <el-icon @click="restoreArmCurrentTimeData">
                        <RefreshLeft />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onBeforeMount, onMounted, onActivated, reactive, ref, watch, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import _ from 'lodash'
import {
  configRead,
  configWrite,
  driverConfigToVr,
  inputConfigToVr,
  driverConfigVehicle,
  driverConfigHaptics,
  KatGameConfigToVR,
  toKatVrHudConfig,
  toKatArmviewConfig
} from '@/utils/system'

import { EditPen } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import attention from '@/assets/game/attention.png'
import autoOn from '@/assets/game/autoON.png'
import autoOff from '@/assets/game/autoOFF.png'
import mountOn from '@/assets/game/mountON.png'
import mountOff from '@/assets/game/mountOFF.png'
import aircraftOn from '@/assets/game/aircraftON.png'
import aircraftOff from '@/assets/game/aircraftOFF.png'
import heavyvehicleOn from '@/assets/game/heavyvehicleON.png'
import heavyvehicleOff from '@/assets/game/heavyvehicleOFF.png'

import hudPreview from '@/assets/game/hud_preview.png'
import hudDistance from '@/assets/game/hud_distance.png'
import heart from '@/assets/game/heart.png'
import fitness from '@/assets/game/fitness.png'
import deviceDirection from '@/assets/game/direction.png'
import deviceStatus from '@/assets/game/device_status.png'
import todayRank from '@/assets/game/today_rank.png'
import currentTime from '@/assets/game/current_time.png'
import armview from '@/assets/game/armview.png'
import displayArm from '@/assets/game/display_arm.png'
import vanishDistance from '@/assets/game/vanish_distance.png'
import psize from '@/assets/game/psize.png'
import opacity from '@/assets/game/opacity.png'
import backgroundOpacity from '@/assets/game/background_opacity.png'
import rotate from '@/assets/game/rotate.png'
import floatsHeight from '@/assets/game/floats_height.png'

import { RefreshLeft, MoreFilled } from '@element-plus/icons-vue'
import hudPreviewEle from '@/views/library/components/hud-preview.vue'
import armviewPreview from '@/views/library/components/armview-preview.vue'

import { initGameDefaultConfig, readGameDefaultConfig, updateGameHudConfig, updateGameArmviewConfig } from '@/utils/game'
import { searchGameConfigurationFile, sanitizedFolderName } from '@/utils/system'

import { getHeartRateType } from '@/utils/heartRate';

import { debounce } from 'lodash-es';

const props = defineProps({
  setupMode: String,
  profile: String,
  gameInfo: Object
})

const route = useRoute()

const store = useStore()

const currentGameId = ref(parseInt(route.params.id))

const allGameLists = computed(() => store.getters['game/getGlobalGameConfigs'])

const currentGameConfig = ref({})

const NAMESPACE = 'device'

// 响应式获取 Vuex 实时数据
const headsetAngle = computed(() => store.getters[`${NAMESPACE}/getHeadsetAngle`])
const bodyAngle = computed(() => store.getters[`${NAMESPACE}/getBodyAngle`])
const heartRate = computed(() => store.getters[`${NAMESPACE}/getHeartRate`])

const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`])

const sittingConnectedInfo = computed(() => store.getters[`${NAMESPACE}/getSittingInfo`])

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

const heartRateType = computed(() => {
  return getHeartRateType(heartRate.value);
});

const range = computed(() => {
  return armviewConfig.armViewDisplayArm
    ? { min: -405, max: -225 }
    : { min: 225, max: 405 }
})

console.log('当前的 setupMode 是:', props.setupMode)
const emit = defineEmits(['update:setupMode', 'chnage-mode'])

const onModeChange = async (val) => {
  console.log('onModeChange', val)

  await emit('update:setupMode', val)

  try {
    await changeAdvancedConfiguration(val)
  } catch (error) {
    console.error('业务逻辑出错:', error);
  }
}

const changeAdvancedConfiguration = async (val) => {

  console.log('changeAdvancedConfiguration', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))

  if (val === 'quik') {
    newGameConfig.QuickConfiguration = true
  } else if (val === 'advanced') {
    newGameConfig.QuickConfiguration = false
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }

    // 重新给页面赋值
    await applicationSettings(newGameConfig)

    // 更新整个游戏配置
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const activeTab = ref('preference')

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const currentDevice = computed(() => selectedDevice.value)

const heartDialogVisible = ref(false)
const fitnessDialogVisible = ref(false)
const directionDialogVisible = ref(false)
const deviceStatusDialogVisible = ref(false)
const rankDialogVisible = ref(false)
const currentTimeDialogVisible = ref(false)
const armHeartRateDialogVisible = ref(false)
const armRankDialogVisible = ref(false)
const armFitnessDialogVisible = ref(false)
const armDeviceStatusDialogVisible = ref(false)
const armCurrentTimeDialogVisible = ref(false)

const selectedSetting = ref(null)

const quickConfiguration = ref(true)

const gameId = ref(parseInt(route.params.id))
const currentGameName = ref(route.params.name)

let isSavingHud = false
let isSavingArmview = false

const tabList = [
  { key: 'preference', label: 'Preference' },
  { key: 'config', label: 'Game Config' },
  { key: 'vrhud', label: 'VRHUD' },
  { key: 'armview', label: 'Armview' }
]

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

// 设置Input参数 - 关于steam游戏 - INPUT_CONFIG_To_VR
const inputConfig = reactive({
  // 是否能行走，传true
  enableHook: true,
  // 行走速度，跟DRIVER_CONFIG_To_VR传的速度一致，速度改变两边都得重新调用 
  rawSpeedMul: 1.0,
  // 手柄跟随震动强度，对应Trigger By Controller Vibration
  vibrateLevel: 0,
  // 校准震动强度，默认传3
  calibrationVibrate: 3,
  // 头身分离 HMD=2，Controller=1，HMD_Body=0 ，这里传0
  dirctionSource: 0,
  // 震动模块是否开启，对应Haptics Mode
  enableVibration: false,
  // 传感器灵敏度，用10-设置的值传过去，最小为0.01不能为0，如果是0重新改成0.01传递，对应Unintentional Movement Filter
  sensorSensivity: 0,
  // 双trigger校准开关. 对应Both Trigger Calibration
  enableDoubleTriggerCalibration: false,
  // 长按Menu校准开关，Gateway始终传true
  enableLongPressMenuCalibration: true,
  // 自动校准，未使用
  enableAutoCalibration: false,
  // 未使用
  dummyBoolConfig: false
})

// 设置坐姿相关参数 - DRIVER_CONFIG_Vehicle
const vehicleSetting = reactive({
  // 坐姿模块通讯连接状态，传GetC2VehicleInfo获取的值
  comStaus: false,
  // 坐姿模块放下，传GetC2VehicleInfo获取的值
  isDown: false,
  // 模式切换按钮按下，传GetC2VehicleInfo获取的值
  isPress: false,
  // 载具模式开关，对应Vehicle hub Mode
  vehicleHub: false,
  // 载具模式速度，对应Vehicle Speed
  vehicleHubSpeed: 1.7,
  // 载具模式崎岖度，对应Road Roughness Simulation
  vehicleRRSimulation: 1.0,
  // 载具模式，机动(AUTO)车=0，坐骑(MOUNTS)=1，飞行器(AIRCRAFT) =2，重型车辆(HEAVY VEHICLES)=3，椅子=4，CHAIR=5
  vehicleHubType: 0,
  // 传false，暂未使用
  sitWalking: false,
  // 坐姿模式速度，始终传1
  sitWalkingSpeed: 1.0,
  // 暂未使用
  vehicleTrigger: false,
  // 对应Quick Drive Mode
  quickDriveMode: true,
  // 1= Gameing Chair、0= Office Chair
  ChairMode: 0,
  // 暂未使用
  VehicleCruiseMode: false,
  // 暂未使用
  SittingHeightAdjustment: false,
  // 暂未使用
  VehicleVibration: 0.0
})

// 设置震动相关参数 - DRIVER_CONFIG_Haptics
const hapticsSetting = reactive({
  // C2步频震动[0,3] 对应Trigger By Steps
  C2TriggerBySteps: 0,
  // 震动开关，对应Haptics Mode
  HapticsMoudleEnable: false,
  // Gateway暂未使用
  HapticsModuleByVRControllerLevel: 0,
  // Gateway暂未使用
  HapticsModuleByLateralLevel: 0,
  // Gateway暂未使用
  HapticsModuleByBackwardLevel: 0,
  // Gateway暂未使用
  HapticsModuleByCruiseLevel: 0
})

// 设置游戏相关参数 - KATGameConfig_ToVR
const gameSetting = reactive({
  // 对应Walk Controller，LeftHand=0，RightHand=1
  Hand: 0,
  // 头身分离，HMD=2，Controller=1，HMD_Body=0，这里传0
  DirctionSource: 0,
  // 行走方式，对应Walk Action：Trackpad_touch = 0，Trackpad_click = 1，Both_trackpads_touch = 2，Joystick = 3，Joystick_click = 4，Both_joysticks = 5，Trigger = 6，Grip = 7，None = 8
  WalkTriggerSource: 0,
  // 对应Walk Speed Type：LinearMovement = 0，ConstantSpeedMovement = 1
  WalkSpeedType: 0,
  // 对应Sprint Action
  SprintSource: 0,
  // 对应Jump Action
  JumpSource: 0,
  // 对应 Starting Joystick Mapping
  DeadZone: 0,
  // 对应Max Joystick Mapping
  ActiveZone: 0,
  // 对应Acceleration Curve
  Curve: 0,
  // 对应Hardness to Get Max Speed
  MaxSpeedInGame: 0.0,
  // 左手模式，对应Left Handed Mode
  LeftHandedMode: false,
  // 对应Gateway Original Trackpad/Joystick For Walk Controller，Secondary=0，ControllerPriority=1，Disable=2
  OrlginalTrackpad: 0,
  // 对应Sprint Mode
  SprintMode: false,
  // 对应Sprint Threshold
  SprintThreshold: 0.0,
  // 对应Jump Mode
  JumpMode: false,
  // 对应Jump Threshold
  JumpThreshold: 0,
  // 对应的手柄名称 string 28个字节
  CurrentControllers: null,
  // 未使用
  BothTriggerCalibration: false,
  // 未使用
  FastBackward: false
})

// VR HUD设置参数 - To_KAT_VR_HUD_Config
const hudConfig = reactive({
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
})

// overlay设置参数 - To_KAT_Armview_Config
const armviewConfig = reactive({
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
})

const speedIncrease = async () => {
  if (katTreadMillConfig.speedMul < 1.5) {
    katTreadMillConfig.speedMul = Number((katTreadMillConfig.speedMul + 0.01).toFixed(2))
  }

  console.log('speedIncrease', katTreadMillConfig.speedMul)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const speedDecrease = async () => {
  if (katTreadMillConfig.speedMul > 0.5) {
    katTreadMillConfig.speedMul = Number((katTreadMillConfig.speedMul - 0.01).toFixed(2))
  }

  console.log('speedDecrease', katTreadMillConfig.speedMul)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeSpeed = async (val) => {
  console.log('changeSpeed', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.WalkingSpeed = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.WalkingSpeed = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.WalkingSpeed = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreWalkingSpeed = async () => {
  katTreadMillConfig.speedMul = 1.0
  console.log('restoreWalkingSpeed', katTreadMillConfig.speedMul)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const accuracyIncrease = async () => {
  katTreadMillConfig.ForwardMovementSensitivity < 5 && katTreadMillConfig.ForwardMovementSensitivity++

  console.log('accuracyIncrease', katTreadMillConfig.ForwardMovementSensitivity)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const accuracyDecrease = async () => {
  katTreadMillConfig.ForwardMovementSensitivity > 0 && katTreadMillConfig.ForwardMovementSensitivity--

  console.log('accuracyDecrease', katTreadMillConfig.ForwardMovementSensitivity)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeWalkingAccuracy = async (val) => {
  console.log('changeWalkingAccuracy', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.WalkingAccuracy = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.WalkingAccuracy = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.WalkingAccuracy = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreWalkingAccuracy = async () => {
  katTreadMillConfig.ForwardMovementSensitivity = 0

  console.log('restoreWalkingAccuracy', katTreadMillConfig.ForwardMovementSensitivity)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const filterIncrease = async () => {
  katTreadMillConfig.SmallActionMasking < 10 && katTreadMillConfig.SmallActionMasking++

  console.log('filterIncrease', katTreadMillConfig.SmallActionMasking)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const filterDecrease = async () => {
  katTreadMillConfig.SmallActionMasking > 0 && katTreadMillConfig.SmallActionMasking--

  console.log('filterDecrease', katTreadMillConfig.SmallActionMasking)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeSmallActionMasking = async (val) => {
  console.log('changeSmallActionMasking', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.SensorSensitivity = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.SensorSensitivity = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.SensorSensitivity = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreUnintentionalMovement = async () => {
  katTreadMillConfig.SmallActionMasking = 0

  console.log('restoreUnintentionalMovement', katTreadMillConfig.SmallActionMasking)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeSprintMode = async (val) => {
  console.log('changeSprintMode', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.SprintMode = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.SprintMode = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.SprintMode = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const thresholdIncrease = async () => {
  gameSetting.SprintThreshold < 30 && gameSetting.SprintThreshold++

  console.log('thresholdIncrease', gameSetting.SprintThreshold)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const thresholdDecrease = async () => {
  gameSetting.SprintThreshold > 0 && gameSetting.SprintThreshold--

  console.log('thresholdIncrease', gameSetting.SprintThreshold)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeSprintThreshold = async (val) => {
  console.log('changeSprintThreshold', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.SprintThreshold = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.SprintThreshold = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.SprintThreshold = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreSprintThreshold = async () => {
  gameSetting.SprintThreshold = 4.15

  console.log('restoreSprintThreshold', gameSetting.SprintThreshold)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeJumpMode = async (val) => {
  console.log('changeJumpMode', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.JumpMode = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.JumpMode = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.JumpMode = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const jumpThresholdIncrease = async () => {
  gameSetting.JumpThreshold < 15 && gameSetting.JumpThreshold++

  console.log('jumpThresholdIncrease', gameSetting.JumpThreshold)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const jumpThresholdDecrease = async () => {
  gameSetting.JumpThreshold > 1 && gameSetting.JumpThreshold--

  console.log('jumpThresholdDecrease', gameSetting.JumpThreshold)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeJumpThreshold = async (val) => {
  console.log('changeJumpThreshold', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.JumpThreshold = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.JumpThreshold = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.JumpThreshold = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreJumpThreshold = async () => {
  gameSetting.JumpThreshold = 5

  console.log('restoreJumpThreshold', gameSetting.JumpThreshold)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const onCruiseModeChange = async (val) => {
  console.log('onCruiseModeChange', val)

  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.CruiseMode = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.CruiseMode = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.CruiseMode = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  if (val) {
    ElMessageBox.alert('Notice: Walking Accuracy has been disabled!', '', {
      confirmButtonText: 'OK',
      type: 'warning'
    }).then(() => {
      return
    })
  }

  return
}

const changeWalkController = async (val) => {
  console.log('changeWalkController', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MappingController = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MappingController = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MappingController = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeWalkTriggerSource = async (val) => {
  console.log('changeWalkTriggerSource', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ControlMethodTwo = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ControlMethodTwo = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ControlMethodTwo = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeWalkSpeedType = async (val) => {
  console.log('changeWalkSpeedType', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.WalkSpeedType = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.WalkSpeedType = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.WalkSpeedType = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeSprintSource = async (val) => {
  console.log('changeSprintSource', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.SprintSource = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.SprintSource = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.SprintSource = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeJumpSource = async (val) => {
  console.log('changeJumpSource', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.JumpSource = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.JumpSource = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.JumpSource = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const curveIncrease = async () => {
  gameSetting.Curve < 100 && gameSetting.Curve++

  console.log('curveIncrease', gameSetting.Curve)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = gameSetting.Curve
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = gameSetting.Curve
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = gameSetting.Curve
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const curveDecrease = async () => {
  gameSetting.Curve > 0 && gameSetting.Curve--

  console.log('curveDecrease', gameSetting.Curve)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = gameSetting.Curve
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = gameSetting.Curve
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = gameSetting.Curve
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeCurve = async (val) => {
  console.log('changeCurve', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreCurve = async () => {
  gameSetting.Curve = 0

  console.log('restoreCurve', gameSetting.Curve)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = gameSetting.Curve
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = gameSetting.Curve
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.Curve = gameSetting.Curve
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const maxSpeedInGameIncrease = async () => {
  if (gameSetting.MaxSpeedInGame < 5.0) {
    gameSetting.MaxSpeedInGame = Number((gameSetting.MaxSpeedInGame + 0.01).toFixed(2))
  }

  console.log('maxSpeedInGameIncrease', gameSetting.MaxSpeedInGame)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const maxSpeedInGameDecrease = async () => {
  if (gameSetting.MaxSpeedInGame > 0.0) {
    gameSetting.MaxSpeedInGame = Number((gameSetting.MaxSpeedInGame - 0.01).toFixed(2))
  }

  console.log('maxSpeedInGameDecrease', gameSetting.MaxSpeedInGame)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeMaxSpeedInGame = async (val) => {
  console.log('changeMaxSpeedInGame', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreMaxSpeedInGame = async () => {
  gameSetting.MaxSpeedInGame = 3.0

  console.log('restoreMaxSpeedInGame', gameSetting.MaxSpeedInGame)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const deadZoneIncrease = async () => {
  gameSetting.DeadZone < 50 && gameSetting.DeadZone++

  console.log('deadZoneIncrease', gameSetting.DeadZone)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = gameSetting.DeadZone
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = gameSetting.DeadZone
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = gameSetting.DeadZone
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const deadZoneDecrease = async () => {
  gameSetting.DeadZone > 0 && gameSetting.DeadZone--

  console.log('deadZoneDecrease', gameSetting.DeadZone)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = gameSetting.DeadZone
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = gameSetting.DeadZone
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = gameSetting.DeadZone
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeDeadZone = async (val) => {
  console.log('changeDeadZone', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreDeadZone = async () => {
  gameSetting.DeadZone = 0

  console.log('restoreDeadZone', gameSetting.DeadZone)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = gameSetting.DeadZone
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = gameSetting.DeadZone
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.DeadZone = gameSetting.DeadZone
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const activeZoneIncrease = async () => {
  gameSetting.ActiveZone < 100 && gameSetting.ActiveZone++

  console.log('activeZoneIncrease', gameSetting.ActiveZone)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = gameSetting.ActiveZone
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = gameSetting.ActiveZone
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = gameSetting.ActiveZone
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const activeZoneDecrease = async () => {
  gameSetting.ActiveZone > 50 && gameSetting.ActiveZone--

  console.log('activeZoneDecrease', gameSetting.ActiveZone)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = gameSetting.ActiveZone
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = gameSetting.ActiveZone
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = gameSetting.ActiveZone
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeActiveZone = async (val) => {
  console.log('changeActiveZone', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreActiveZone = async () => {
  gameSetting.ActiveZone = 0

  console.log('restoreActiveZone', gameSetting.ActiveZone)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = gameSetting.ActiveZone
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = gameSetting.ActiveZone
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.GlobalConfig) {
      newGameConfig.GlobalConfig.ActiveZone = gameSetting.ActiveZone
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeVehicleHub = async (val) => {
  console.log('changeVehicleHub', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleHub = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleHub = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleHub = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeQuickDriveMode = async (val) => {
  console.log('changeQuickDriveMode', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.QuickDrive = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.QuickDrive = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.QuickDrive = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeMode = async (val) => {
  console.log('changeMode', val)
  vehicleSetting.vehicleHubType = val

  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleMode = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleMode = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleMode = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}


const vehicleHubSpeedIncrease = async () => {
  if (vehicleSetting.vehicleHubSpeed < 2.0) {
    vehicleSetting.vehicleHubSpeed = Number((vehicleSetting.vehicleHubSpeed + 0.1).toFixed(2))
  }

  console.log('vehicleHubSpeedIncrease', vehicleSetting.vehicleHubSpeed)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const vehicleHubSpeedDecrease = async () => {
  if (vehicleSetting.vehicleHubSpeed > 1.1) {
    vehicleSetting.vehicleHubSpeed = Number((vehicleSetting.vehicleHubSpeed - 0.1).toFixed(2))
  }

  console.log('vehicleHubSpeedDecrease', vehicleSetting.vehicleHubSpeed)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeVehicleHubSpeed = async (val) => {
  console.log('changeVehicleHubSpeed', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreVehicleHubSpeed = async () => {
  vehicleSetting.vehicleHubSpeed = 1.7

  console.log('restoreVehicleHubSpeed', vehicleSetting.vehicleHubSpeed)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const vehicleRRSimulationDecrease = async () => {
  if (vehicleSetting.vehicleRRSimulation > 0) {
    vehicleSetting.vehicleRRSimulation = Number((vehicleSetting.vehicleRRSimulation - 0.01).toFixed(2))
  }

  console.log('vehicleRRSimulationDecrease', vehicleSetting.vehicleRRSimulation)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const vehicleRRSimulationIncrease = async () => {
  if (vehicleSetting.vehicleRRSimulation < 2.0) {
    vehicleSetting.vehicleRRSimulation = Number((vehicleSetting.vehicleRRSimulation + 0.01).toFixed(2))
  }

  console.log('vehicleRRSimulationIncrease', vehicleSetting.vehicleRRSimulation)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeVehicleRRSimulation = async (val) => {
  console.log('changeVehicleRRSimulation', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreVehicleRRSimulation = async () => {
  vehicleSetting.vehicleRRSimulation = 1.0

  console.log('restoreVehicleRRSimulation', vehicleSetting.vehicleRRSimulation)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.Sitting && newGameConfig.Sitting.Advanced) {
      newGameConfig.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeHapticsMoudleEnable = async (val) => {
  console.log('changeHapticsMoudleEnable', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Advanced) {
      newGameConfig.OtherHaptic.Advanced.HapticMoudleEanble = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticMoudleEanble = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticMoudleEanble = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeVibrateLevel = async (val) => {
  console.log('changeVibrateLevel', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Advanced) {
      newGameConfig.OtherHaptic.Advanced.HapticModuleByVRControllerLevel = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByVRControllerLevel = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByVRControllerLevel = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreVibrateLevel = async () => {
  inputConfig.vibrateLevel = 5

  console.log('changeVibrateLevel', inputConfig.vibrateLevel)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Advanced) {
      newGameConfig.OtherHaptic.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const vibrateLevelIncrease = async () => {
  inputConfig.vibrateLevel < 6 && inputConfig.vibrateLevel++

  console.log('vibrateLevelIncrease', inputConfig.vibrateLevel)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Advanced) {
      newGameConfig.OtherHaptic.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const vibrateLevelDecrease = async () => {
  inputConfig.vibrateLevel > 0 && inputConfig.vibrateLevel--

  console.log('vibrateLevelDecrease', inputConfig.vibrateLevel)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Advanced) {
      newGameConfig.OtherHaptic.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeC2TriggerBySteps = async (val) => {
  console.log('changeC2TriggerBySteps', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Advanced) {
      newGameConfig.OtherHaptic.Advanced.HapticModuleByWalkLevel = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByWalkLevel = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByWalkLevel = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const restoreTriggerBySteps = async () => {
  hapticsSetting.C2TriggerBySteps = 1

  console.log('restoreTriggerBySteps', hapticsSetting.C2TriggerBySteps)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Advanced) {
      newGameConfig.OtherHaptic.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const triggerByStepsIncrease = async () => {
  hapticsSetting.C2TriggerBySteps < 3 && hapticsSetting.C2TriggerBySteps++

  console.log('triggerByStepsIncrease', hapticsSetting.C2TriggerBySteps)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Advanced) {
      newGameConfig.OtherHaptic.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const triggerByStepsDecrease = async () => {
  hapticsSetting.C2TriggerBySteps > 0 && hapticsSetting.C2TriggerBySteps--

  console.log('triggerByStepsDecrease', hapticsSetting.C2TriggerBySteps)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Advanced) {
      newGameConfig.OtherHaptic.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Advanced) {
      newGameConfig.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const showHeartRate = () => {
  heartDialogVisible.value = true
}

const showFitnessData = () => {
  fitnessDialogVisible.value = true
}

const showDirectionDialog = () => {
  directionDialogVisible.value = true
}

const showDeviceStatus = () => {
  deviceStatusDialogVisible.value = true
}

const showRankDialog = () => {
  rankDialogVisible.value = true
}

const showTimeDialog = () => {
  currentTimeDialogVisible.value = true
}

const showArmHeartRate = () => {
  armHeartRateDialogVisible.value = true
}

const showArmTodayRank = () => {
  armRankDialogVisible.value = true
}

const showArmFitnessDialogVisible = () => {
  armFitnessDialogVisible.value = true
}

const showArmDeviceStatusDataVisible = () => {
  armDeviceStatusDialogVisible.value = true
}

const showArmCurrentTimeDialogVisible = () => {
  armCurrentTimeDialogVisible.value = true
}

const restoreHudDistance = async () => {
  hudConfig.hudDistanceZ = 2.0
}

//#region 
const ApplyToAllgamesGlobalSettings = async () => {

  hudConfig.hudDistanceZ = 2.0
}
//#endregion

const restoreHeartRate = async () => {
  // 外面设置
  hudConfig.heartRateSize = 1.0
  // 重置里面的配置项目
  hudConfig.heartRateOpacity = 1.0
  hudConfig.heartRatingVisible = true
  hudConfig.stateofSportsVisible = true
}

const restoreHeartRateOpacity = async () => {
  hudConfig.heartRateOpacity = 1
}

const restoreFitnessDataOpacity = async () => {
  hudConfig.fitnessDataOpacity = 1.0
}

const restoreFitnessData = async () => {
  // 外面设置
  hudConfig.fitnessDataSize = 1.0
  // 浮窗里的设置项
  hudConfig.fitnessDataOpacity = 1.0
  hudConfig.walkingVisible = true
  hudConfig.mileageVisible = true
  hudConfig.consumeVisible = true
  hudConfig.sportsTimeVisible = true
}

const restoreDeviceDirection = async () => {
  // 外面设置
  hudConfig.deviceDirectionSize = 1.0
  // 浮窗里的设置项
  hudConfig.deviceDirectionOpacity = 1.0
}

const restoreDeviceStatus = async () => {
  // 外面设置
  hudConfig.deviceStatusSize = 1.0
  // 浮窗里设置项
  hudConfig.deviceStatusOpacity = 1.0
  hudConfig.armbandVisible = true
  hudConfig.directionVisible = true
  hudConfig.leftFootVisible = true
  hudConfig.rightFootVisible = true
}

const restoreTodayRank = async () => {
  // 外面设置
  hudConfig.todaysRankSize = 1.0
  // 浮窗里的设置项
  hudConfig.todaysRankOpacity = 1.0
  hudConfig.updateFrequencyTextVisible = true
}

// 重置当前时间浮窗的设置
const restoreCurrentTime = async () => {
  // 外面设置
  hudConfig.currentTimeSize = 1.0
  // 浮窗里的设置项
  hudConfig.currentTimeOpacity = 1.0
  hudConfig.currentTimeDate = 1.0
  hudConfig.currentTimeTime = 0
}

// 重置方向浮窗的透明度
const restoreDirectionOpacity = async () => {
  hudConfig.deviceDirectionOpacity = 1.0
}

const restoreDeviceStatusOpacity = async () => {
  hudConfig.deviceStatusOpacity = 1.0
}

const restoreArmviewSize = async () => {
  armviewConfig.armViewSize = 0.5
}

const restoreRotate = async () => {
  if (armviewConfig.armViewDisplayArm) {
    armviewConfig.overlayRotAngle = -360
  } else {
    armviewConfig.overlayRotAngle = 360
  }
}

const restoreFloatsHeight = async () => {
  armviewConfig.armviewHeight = 0.0
}

const restoreArmviewOpacity = async () => {
  armviewConfig.armviewOpacity = 1.0
}

const restorePanelOpacity = async () => {
  armviewConfig.panelOpacity = 1.0
}

const restoreVanishDistance = async () => {
  armviewConfig.armviewDisplayDistance = 1.0
}

const restoreArmHeartRate = async () => {
  armviewConfig.armviewHeartRatingVisible = true
  armviewConfig.armviewStateofSportsVisible = true
}

const restoreArmTodayRank = async () => {
  armviewConfig.armviewUpdateFrequencyText = true
}

const restoreArmFitnessData = async () => {
  armviewConfig.armviewWalkingVisible = true
  armviewConfig.armviewMileageVisible = true
  armviewConfig.armviewConsumeVisible = true
  armviewConfig.armviewActiveTimeVisible = true
}

const restoreArmDeviceStatusData = async () => {
  armviewConfig.armviewArmbandVisible = true
  armviewConfig.armviewDirectionVisible = true
  armviewConfig.armviewLeftFootVisible = true
  armviewConfig.armviewRightFootVisible = true
}

const restoreArmCurrentTimeData = async () => {
  armviewConfig.armviewCurrentTimeDate = 0
  armviewConfig.armviewCurrentTimeTime = 0
}

const setKatVrHudConfig = async (config) => {
  if (config) {
    config.steps = dailySteps.value.steps || 0
    config.duration = dailySteps.value.walkingTime || 0
    config.calories = dailySteps.value.calories || 0
    config.heartRate = heartRate.value || 0
    const newConfig = JSON.stringify(config)
    await toKatVrHudConfig(host, newConfig)
  }
}

const setKatVrArmviewConfig = async (config) => {
  if (config) {
    config.steps = dailySteps.value.steps || 0
    config.duration = dailySteps.value.walkingTime || 0
    config.calories = dailySteps.value.calories || 0
    config.heartRate = heartRate.value || 0
    const newConfig = JSON.stringify(config)
    await toKatArmviewConfig(host, newConfig)
  }
}

const heartRateSizeDecrease = () => {
  if (hudConfig.heartRateSize > 0.4) {
    hudConfig.heartRateSize = Number((hudConfig.heartRateSize - 0.1).toFixed(2))
  }
}

const heartRateSizeIncrease = () => {
  if (hudConfig.heartRateSize < 2) {
    hudConfig.heartRateSize = Number((hudConfig.heartRateSize + 0.1).toFixed(2))
  }
}

const fitnessDataSizeDecrese = () => {
  if (hudConfig.fitnessDataSize > 0.4) {
    hudConfig.fitnessDataSize = Number((hudConfig.fitnessDataSize - 0.1).toFixed(2))
  }
}

const fitnessDataSizeIncrese = () => {
  if (hudConfig.fitnessDataSize < 2) {
    hudConfig.fitnessDataSize = Number((hudConfig.fitnessDataSize + 0.1).toFixed(2))
  }
}

const deviceDirectionDecrease = () => {
  if (hudConfig.deviceDirectionSize > 0.4) {
    hudConfig.deviceDirectionSize = Number((hudConfig.deviceDirectionSize - 0.1).toFixed(2))
  }
}

const deviceDirectionIncrease = () => {
  if (hudConfig.deviceDirectionSize < 2) {
    hudConfig.deviceDirectionSize = Number((hudConfig.deviceDirectionSize + 0.1).toFixed(2))
  }
}

const deviceStatusSizeDecrease = () => {
  if (hudConfig.deviceStatusSize > 0.4) {
    hudConfig.deviceStatusSize = Number((hudConfig.deviceStatusSize - 0.1).toFixed(2))
  }
}

const deviceStatusSizeIncrease = () => {
  if (hudConfig.deviceStatusSize < 2) {
    hudConfig.deviceStatusSize = Number((hudConfig.deviceStatusSize + 0.1).toFixed(2))
  }
}

const todaysRankSizeDecrease = () => {
  if (hudConfig.todaysRankSize > 0.4) {
    hudConfig.todaysRankSize = Number((hudConfig.todaysRankSize - 0.1).toFixed(2))
  }
}

const todaysRankSizeIncrease = () => {
  if (hudConfig.todaysRankSize < 2) {
    hudConfig.todaysRankSize = Number((hudConfig.todaysRankSize + 0.1).toFixed(2))
  }
}

const currentTimeSizeDecrease = () => {
  if (hudConfig.currentTimeSize > 0.4) {
    hudConfig.currentTimeSize = Number((hudConfig.currentTimeSize - 0.1).toFixed(2))
  }
}

const currentTimeSizeIncrease = () => {
  if (hudConfig.currentTimeSize < 2) {
    hudConfig.currentTimeSize = Number((hudConfig.currentTimeSize + 0.1).toFixed(2))
  }
}

const armViewSizeDecrease = () => {
  if (armviewConfig.armViewSize > 0.325) {
    armviewConfig.armViewSize = Number((armviewConfig.armViewSize - 0.05).toFixed(2))
  }
}

const armViewSizeIncrease = () => {
  if (armviewConfig.armViewSize < 0.775) {
    armviewConfig.armViewSize = Number((armviewConfig.armViewSize + 0.05).toFixed(2))
  }
}
const new_GatewayPath = 'Local/New_Gateway'
const profilePath = 'Profile'
// 检测是否存在默认高级配置
const checkDefaultAdvancedConfig = async () => {
  if (currentGameId.value) {

    const gameId = currentGameId.value

    const folderPath = `${new_GatewayPath}/${profilePath}/${gameId}`
    const fileName = 'Default.json'

    const fileInfo = await configRead(host, folderPath, fileName)

    if (fileInfo) {
      const res = JSON.parse(fileInfo)
      // 检测是否存在默认配置文件， 如果不存在则生成，并写入配置文件
      if (!res.result) {
        await initGameDefaultConfig(host, gameId)
        await writeConfigProfile(gameInfo)
      } else {
        await writeConfigProfile(gameInfo)
      }
    }
  }
  return
}

// 保存配置文件路径，用于切换配置
const writeConfigProfile = async (gameInfo) => {
  try {
    const gameId = gameInfo.gameId

    const gameName = await sanitizedFolderName(host, currentGameName.value);

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
        // 生成配置记录文件
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
        // 更新profile列表
        changeSettingModel()
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const changeSettingModel = () => {
  emit('chnage-setting-mode', 'advanced')
}

// 读取该游戏默认配置文件
const readConfigProfile = async () => {
  const gameId = currentGameId.value

  const gameName = await sanitizedFolderName(host, currentGameName.value);
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}/configuration`
  const configurationFileName = 'config_profile.json'
  const data = await configRead(host, folderPath, configurationFileName)
  if (data) {
    const res = JSON.parse(data)
    if (res.result && res.data) {
      return JSON.parse(res.data)
    }
  }
}

const loadProfileData = async (profile) => {
  console.log(`Load Advanced mode configuration: ${profile}`)
  // 读取参数并应用
  const configurations = await readConfigProfile()

  if (profile && configurations) {
    const profileConfiguration = configurations.find((item) => item.name === profile)
    if (profileConfiguration) {
      console.log('profileConfiguration', profileConfiguration)
      const filePath = profileConfiguration.filePath
      const configurationFileName = profileConfiguration.fileName
      const configData = await configRead(host, filePath, configurationFileName)
      if (configData) {
        const res = JSON.parse(configData)
        if (res.result && res.data) {
          const currentGameAdvancedConfig = JSON.parse(res.data)
          selectedSetting.value = currentGameAdvancedConfig
          await applicationSettings(currentGameAdvancedConfig)
        }
      }
    }
  }
}

// 恢复默认配置
const restoreDefaultConfiguration = async () => {
  const gameId = currentGameId.value
  const gameName = await sanitizedFolderName(host, currentGameName.value);
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}`
  const configurationFileName = 'Default.json'
  const data = await configRead(host, folderPath, configurationFileName)
  if (data) {
    const readResult = JSON.parse(data)
    if (readResult.result && readResult.data) {
      const currentGameAdvancedConfig = JSON.parse(readResult.data)
      await applicationSettings(currentGameAdvancedConfig)
    }
  }
}

//应用参数设置
const applicationSettings = async (configs) => {
  console.log('applicationSettings', configs)
  if (configs) {
    // 根据设备匹配对应设置
    let controllerOptions = {}
    let hapticOptions = {}
    if ([2, 3].includes(currentDevice.value.deviceType)) {
      controllerOptions = configs.OtherControllerOptions
      hapticOptions = configs.OtherHaptic
    } else if ([4, 8, 9].includes(currentDevice.value.deviceType)) {
      controllerOptions = configs.C2ControllerOptions
      hapticOptions = configs.HapticC2
    } else if ([10].includes(currentDevice.value.deviceType)) {
      controllerOptions = configs.C3ControllerOptions
      hapticOptions = configs.OtherHaptic
    } else {
      controllerOptions = configs.C2ControllerOptions
      hapticOptions = configs.HapticC2
    }

    // Preference
    gameSetting.LeftHandedMode = controllerOptions.Advanced.LeftHandedMode
    gameSetting.OrlginalTrackpad = controllerOptions.Advanced.OrlginalTrackpad
    inputConfig.enableDoubleTriggerCalibration = controllerOptions.Advanced.EnableBothTriggerCalibration
    katTreadMillConfig.speedMul = controllerOptions.Advanced.WalkingSpeed
    katTreadMillConfig.ForwardMovementSensitivity = controllerOptions.Advanced.WalkingAccuracy
    katTreadMillConfig.SmallActionMasking = controllerOptions.Advanced.SensorSensitivity
    gameSetting.SprintMode = controllerOptions.Advanced.SprintMode
    gameSetting.SprintThreshold = controllerOptions.Advanced.SprintThreshold
    gameSetting.JumpMode = controllerOptions.Advanced.JumpMode
    gameSetting.JumpThreshold = controllerOptions.Advanced.JumpThreshold
    katTreadMillConfig.CruiseMode = controllerOptions.Advanced.CruiseMode

    // GameConfig
    gameSetting.Hand = configs.GlobalConfig.MappingController
    gameSetting.WalkTriggerSource = configs.GlobalConfig.ControlMethodTwo
    gameSetting.WalkSpeedType = configs.GlobalConfig.WalkSpeedType
    gameSetting.SprintSource = configs.GlobalConfig.SprintSource
    gameSetting.JumpSource = configs.GlobalConfig.JumpSource
    gameSetting.Curve = configs.GlobalConfig.Curve
    gameSetting.MaxSpeedInGame = configs.GlobalConfig.MaxSpeedInGame
    gameSetting.DeadZone = configs.GlobalConfig.DeadZone
    gameSetting.ActiveZone = configs.GlobalConfig.ActiveZone

    // Sitting
    vehicleSetting.vehicleHub = configs.Sitting.Advanced.VehicleHub
    vehicleSetting.quickDriveMode = configs.Sitting.Advanced.QuickDrive
    vehicleSetting.vehicleHubType = configs.Sitting.Advanced.VehicleMode
    vehicleSetting.vehicleHubSpeed = configs.Sitting.Advanced.VehicleSpeed
    vehicleSetting.vehicleRRSimulation = configs.Sitting.Advanced.RRSimulation

    // Haptics
    hapticsSetting.HapticsMoudleEnable = hapticOptions.Advanced.HapticMoudleEanble
    inputConfig.vibrateLevel = hapticOptions.Advanced.HapticModuleByVRControllerLevel
    hapticsSetting.C2TriggerBySteps = hapticOptions.Advanced.HapticModuleByWalkLevel

    // HUD 相关设置
    Object.assign(hudConfig, configs.HudConfig);
    Object.assign(armviewConfig, configs.ArmviewConfig);

    // 设置游戏相关参数
    await applyGameSettings()
    // 设置速度等参数
    await applyTreadMillConfig()
    // 设置InputConfig
    await applyInputConfig()
    // 设置坐姿参数
    await applySittingConfig()
    // 设置震动相关参数
    await applyHapticsConfig()
  }
}

// 设置游戏相关参数
const applyGameSettings = async () => {
  const currentGameSetting = JSON.stringify(gameSetting)
  await KatGameConfigToVR(host, currentGameSetting)
}

// 设置速度等参数
const applyTreadMillConfig = async () => {
  const treadMillConfig = JSON.stringify({
    KATTreadMillConfig: katTreadMillConfig,
    KATTrackerConfig: katTrackerConfig
  })
  await driverConfigToVr(host, treadMillConfig)
}

// 设置InputConfig
const applyInputConfig = async () => {
  const inputConfigSetting = JSON.stringify(inputConfig)
  await inputConfigToVr(host, inputConfigSetting)
}

// 设置坐姿参数
const applySittingConfig = async () => {
  const sittingConfigSetting = JSON.stringify(vehicleSetting)
  await driverConfigVehicle(host, sittingConfigSetting)
}

// 设置震动相关参数
const applyHapticsConfig = async () => {
  const hapticsConfigSetting = JSON.stringify(hapticsSetting)
  await driverConfigHaptics(host, hapticsConfigSetting)
}

const handleAdvancedReset = async (currentProfile) => {
  console.log(currentProfile)
  console.log('Advanced子组件执行恢复默认配置逻辑...')
  await restoreDefaultConfiguration()
}

//子组件保存逻辑
const handleAdvancedSave = async (currentProfile, fileName) => {

  console.log(currentProfile)
  console.log('Advanced子组件执行保存逻辑...')

  // 保存配置文件
  const gameId = currentGameId.value
  const gameName = await sanitizedFolderName(host, currentGameName.value);
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}`
  const saveFileName = `${fileName}.json`

  // 读取默认的文件形成新的文件进行保存
  const fileInfo = await readGameDefaultConfig(host, gameId)

  if (fileInfo) {

    fileInfo.Name = fileName
    fileInfo.GameConfigFile = fileName

    const deviceInfo = currentDevice.value
    const deviceType = deviceInfo.deviceType
    if ([2, 3].includes(deviceType)) {
      // Preference
      fileInfo.OtherControllerOptions.Advanced.LeftHandedMode = gameSetting.LeftHandedMode
      fileInfo.OtherControllerOptions.Advanced.OrlginalTrackpad = gameSetting.OrlginalTrackpad
      fileInfo.OtherControllerOptions.Advanced.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
      fileInfo.OtherControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
      fileInfo.OtherControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
      fileInfo.OtherControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
      fileInfo.OtherControllerOptions.Advanced.SprintMode = gameSetting.SprintMode
      fileInfo.OtherControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
      fileInfo.OtherControllerOptions.Advanced.JumpMode = gameSetting.JumpMode
      fileInfo.OtherControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
      fileInfo.OtherControllerOptions.Advanced.CruiseMode = katTreadMillConfig.CruiseMode

      // GameConfig
      fileInfo.GlobalConfig.MappingController = gameSetting.Hand
      fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
      fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
      fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
      fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
      fileInfo.GlobalConfig.Curve = gameSetting.Curve
      fileInfo.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
      fileInfo.GlobalConfig.DeadZone = gameSetting.DeadZone
      fileInfo.GlobalConfig.ActiveZone = gameSetting.ActiveZone

      // Sitting
      fileInfo.Sitting.Advanced.VehicleHub = vehicleSetting.vehicleHub
      fileInfo.Sitting.Advanced.QuickDrive = vehicleSetting.quickDriveMode
      fileInfo.Sitting.Advanced.VehicleMode = vehicleSetting.vehicleHubType
      fileInfo.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
      fileInfo.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation

      // Haptics
      fileInfo.OtherHaptic.Advanced.HapticMoudleEanble = hapticsSetting.HapticsMoudleEnable
      fileInfo.OtherHaptic.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
      fileInfo.OtherHaptic.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps

    } else if ([4, 8, 9].includes(deviceType)) {
      // Preference
      fileInfo.C2ControllerOptions.Advanced.LeftHandedMode = gameSetting.LeftHandedMode
      fileInfo.C2ControllerOptions.Advanced.OrlginalTrackpad = gameSetting.OrlginalTrackpad
      fileInfo.C2ControllerOptions.Advanced.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
      fileInfo.C2ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
      fileInfo.C2ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
      fileInfo.C2ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
      fileInfo.C2ControllerOptions.Advanced.SprintMode = gameSetting.SprintMode
      fileInfo.C2ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
      fileInfo.C2ControllerOptions.Advanced.JumpMode = gameSetting.JumpMode
      fileInfo.C2ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
      fileInfo.C2ControllerOptions.Advanced.CruiseMode = katTreadMillConfig.CruiseMode

      // GameConfig
      fileInfo.GlobalConfig.MappingController = gameSetting.Hand
      fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
      fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
      fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
      fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
      fileInfo.GlobalConfig.Curve = gameSetting.Curve
      fileInfo.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
      fileInfo.GlobalConfig.DeadZone = gameSetting.DeadZone
      fileInfo.GlobalConfig.ActiveZone = gameSetting.ActiveZone

      // Sitting
      fileInfo.Sitting.Advanced.VehicleHub = vehicleSetting.vehicleHub
      fileInfo.Sitting.Advanced.QuickDrive = vehicleSetting.quickDriveMode
      fileInfo.Sitting.Advanced.VehicleMode = vehicleSetting.vehicleHubType
      fileInfo.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
      fileInfo.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation

      // Haptics
      fileInfo.HapticC2.Advanced.HapticMoudleEanble = hapticsSetting.HapticsMoudleEnable
      fileInfo.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
      fileInfo.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    } else if ([10].includes(deviceType)) {
      // Preference
      fileInfo.C3ControllerOptions.Advanced.LeftHandedMode = gameSetting.LeftHandedMode
      fileInfo.C3ControllerOptions.Advanced.OrlginalTrackpad = gameSetting.OrlginalTrackpad
      fileInfo.C3ControllerOptions.Advanced.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
      fileInfo.C3ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
      fileInfo.C3ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
      fileInfo.C3ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
      fileInfo.C3ControllerOptions.Advanced.SprintMode = gameSetting.SprintMode
      fileInfo.C3ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
      fileInfo.C3ControllerOptions.Advanced.JumpMode = gameSetting.JumpMode
      fileInfo.C3ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
      fileInfo.C3ControllerOptions.Advanced.CruiseMode = katTreadMillConfig.CruiseMode

      // GameConfig
      fileInfo.GlobalConfig.MappingController = gameSetting.Hand
      fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
      fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
      fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
      fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
      fileInfo.GlobalConfig.Curve = gameSetting.Curve
      fileInfo.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
      fileInfo.GlobalConfig.DeadZone = gameSetting.DeadZone
      fileInfo.GlobalConfig.ActiveZone = gameSetting.ActiveZone

      // Sitting
      fileInfo.Sitting.Advanced.VehicleHub = vehicleSetting.vehicleHub
      fileInfo.Sitting.Advanced.QuickDrive = vehicleSetting.quickDriveMode
      fileInfo.Sitting.Advanced.VehicleMode = vehicleSetting.vehicleHubType
      fileInfo.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
      fileInfo.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation

      // Haptics
      fileInfo.HapticC2.Advanced.HapticMoudleEanble = hapticsSetting.HapticsMoudleEnable
      fileInfo.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
      fileInfo.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  }

  const content = JSON.stringify(fileInfo)
  const writeResult = await configWrite(host, folderPath, saveFileName, content)

  let newConfiguration = []

  if (writeResult) {
    const res = JSON.parse(writeResult)
    if (res.result) {
      const gameName = await sanitizedFolderName(host, currentGameName.value);
      // 更新配置文件
      const cfolderPath = `${new_GatewayPath}/${profilePath}/${gameName}/configuration`
      const cFileName = 'config_profile.json'

      const fileConfiguration = await configRead(host, cfolderPath, cFileName)
      if (fileConfiguration) {
        const allConfiguration = JSON.parse(fileConfiguration)
        if (allConfiguration.result && allConfiguration.data) {
          const allConfig = JSON.parse(allConfiguration.data)
          if (_.isArray(allConfig)) {
            allConfig.push({
              name: fileName,
              filePath: folderPath,
              fileName: saveFileName,
              isDefault: false,
              isActive: false
            })
          }
          newConfiguration = JSON.stringify(allConfig)
          // 更新配置文件
          await configWrite(host, cfolderPath, cFileName, newConfiguration)
        }
      }
    }
  }
  return newConfiguration
}

const handleAdvancedNewSave = async (currentProfile, fileName) => {
  console.log(currentProfile)
  console.log('Advanced子组件执行另存逻辑...')

  // 保存配置文件
  const gameId = currentGameId.value
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameId}`
  const saveFileName = `${fileName}.json`

  // 读取默认的文件形成新的文件进行保存
  const fileInfo = await readGameDefaultConfig(host, gameId)

  if (fileInfo) {
    const deviceInfo = currentDevice.value
    const deviceType = deviceInfo.deviceType

    if ([2, 3].includes(deviceType)) {
      // Preference
      fileInfo.OtherControllerOptions.Advanced.LeftHandedMode = gameSetting.LeftHandedMode
      fileInfo.OtherControllerOptions.Advanced.OrlginalTrackpad = gameSetting.OrlginalTrackpad
      fileInfo.OtherControllerOptions.Advanced.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
      fileInfo.OtherControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
      fileInfo.OtherControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
      fileInfo.OtherControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
      fileInfo.OtherControllerOptions.Advanced.SprintMode = gameSetting.SprintMode
      fileInfo.OtherControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
      fileInfo.OtherControllerOptions.Advanced.JumpMode = gameSetting.JumpMode
      fileInfo.OtherControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
      fileInfo.OtherControllerOptions.Advanced.CruiseMode = katTreadMillConfig.CruiseMode

      // GameConfig
      fileInfo.GlobalConfig.MappingController = gameSetting.Hand
      fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
      fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
      fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
      fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
      fileInfo.GlobalConfig.Curve = gameSetting.Curve
      fileInfo.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
      fileInfo.GlobalConfig.DeadZone = gameSetting.DeadZone
      fileInfo.GlobalConfig.ActiveZone = gameSetting.ActiveZone

      // Sitting
      fileInfo.Sitting.Advanced.VehicleHub = vehicleSetting.vehicleHub
      fileInfo.Sitting.Advanced.QuickDrive = vehicleSetting.quickDriveMode
      fileInfo.Sitting.Advanced.VehicleMode = vehicleSetting.vehicleHubType
      fileInfo.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
      fileInfo.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation

      // Haptics
      fileInfo.OtherHaptic.Advanced.HapticMoudleEanble = hapticsSetting.HapticsMoudleEnable
      fileInfo.OtherHaptic.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
      fileInfo.OtherHaptic.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps

    } else if ([4, 8, 9].includes(deviceType)) {
      // Preference
      fileInfo.C2ControllerOptions.Advanced.LeftHandedMode = gameSetting.LeftHandedMode
      fileInfo.C2ControllerOptions.Advanced.OrlginalTrackpad = gameSetting.OrlginalTrackpad
      fileInfo.C2ControllerOptions.Advanced.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
      fileInfo.C2ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
      fileInfo.C2ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
      fileInfo.C2ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
      fileInfo.C2ControllerOptions.Advanced.SprintMode = gameSetting.SprintMode
      fileInfo.C2ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
      fileInfo.C2ControllerOptions.Advanced.JumpMode = gameSetting.JumpMode
      fileInfo.C2ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
      fileInfo.C2ControllerOptions.Advanced.CruiseMode = katTreadMillConfig.CruiseMode

      // GameConfig
      fileInfo.GlobalConfig.MappingController = gameSetting.Hand
      fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
      fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
      fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
      fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
      fileInfo.GlobalConfig.Curve = gameSetting.Curve
      fileInfo.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
      fileInfo.GlobalConfig.DeadZone = gameSetting.DeadZone
      fileInfo.GlobalConfig.ActiveZone = gameSetting.ActiveZone

      // Sitting
      fileInfo.Sitting.Advanced.VehicleHub = vehicleSetting.vehicleHub
      fileInfo.Sitting.Advanced.QuickDrive = vehicleSetting.quickDriveMode
      fileInfo.Sitting.Advanced.VehicleMode = vehicleSetting.vehicleHubType
      fileInfo.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
      fileInfo.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation

      // Haptics
      fileInfo.HapticC2.Advanced.HapticMoudleEanble = hapticsSetting.HapticsMoudleEnable
      fileInfo.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
      fileInfo.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    } else if ([10].includes(deviceType)) {
      // Preference
      fileInfo.C3ControllerOptions.Advanced.LeftHandedMode = gameSetting.LeftHandedMode
      fileInfo.C3ControllerOptions.Advanced.OrlginalTrackpad = gameSetting.OrlginalTrackpad
      fileInfo.C3ControllerOptions.Advanced.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
      fileInfo.C3ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
      fileInfo.C3ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
      fileInfo.C3ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
      fileInfo.C3ControllerOptions.Advanced.SprintMode = gameSetting.SprintMode
      fileInfo.C3ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
      fileInfo.C3ControllerOptions.Advanced.JumpMode = gameSetting.JumpMode
      fileInfo.C3ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
      fileInfo.C3ControllerOptions.Advanced.CruiseMode = katTreadMillConfig.CruiseMode

      // GameConfig
      fileInfo.GlobalConfig.MappingController = gameSetting.Hand
      fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
      fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
      fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
      fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
      fileInfo.GlobalConfig.Curve = gameSetting.Curve
      fileInfo.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
      fileInfo.GlobalConfig.DeadZone = gameSetting.DeadZone
      fileInfo.GlobalConfig.ActiveZone = gameSetting.ActiveZone

      // Sitting
      fileInfo.Sitting.Advanced.VehicleHub = vehicleSetting.vehicleHub
      fileInfo.Sitting.Advanced.QuickDrive = vehicleSetting.quickDriveMode
      fileInfo.Sitting.Advanced.VehicleMode = vehicleSetting.vehicleHubType
      fileInfo.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
      fileInfo.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation

      // Haptics
      fileInfo.HapticC2.Advanced.HapticMoudleEanble = hapticsSetting.HapticsMoudleEnable
      fileInfo.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
      fileInfo.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
    }
  }

  const content = JSON.stringify(fileInfo)
  const writeResult = await configWrite(host, folderPath, saveFileName, content)

  // 写VR HUD 配置
  await saveVrHudConfiguration();

  // 写Armview配置
  await saveArmviewConfiguration();

  let newConfiguration = []

  if (writeResult) {
    const res = JSON.parse(writeResult)
    if (res.result) {
      // 更新配置文件
      const gameInfo = await getGameConfig(gameId);
      const gameName = await sanitizedFolderName(host, currentGameName.value);

      const cfolderPath = `${new_GatewayPath}/${profilePath}/${gameName}/configuration`
      const cFileName = 'config_profile.json'

      const fileConfiguration = await configRead(host, cfolderPath, cFileName)
      if (fileConfiguration) {
        const allConfiguration = JSON.parse(fileConfiguration)
        if (allConfiguration.result && allConfiguration.data) {
          const allConfig = JSON.parse(allConfiguration.data)
          if (_.isArray(allConfig)) {
            allConfig.push({
              name: fileName,
              filePath: folderPath,
              fileName: saveFileName,
              isDefault: false,
              isActive: false
            })
          }
          newConfiguration = JSON.stringify(allConfig)
          // 更新配置文件
          await configWrite(host, cfolderPath, cFileName, newConfiguration)
        }
      }
    }
  }
  return newConfiguration
}

// VR HUD 参数保存
const saveVrHudConfiguration = async () => {
  // 保存配置文件
  const gameId = currentGameId.value
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameId}`
  const fileName = 'VrHudConfiguration.json'

  // 检查本地是否存在
  const result = await configRead(host, folderPath, fileName)
  if (result) {
    let hudInfo = JSON.parse(result)
    if (hudInfo && hudInfo.result) {
      // 更新配置，新的配置参数直接覆盖文件保存
      hudInfo = hudConfig
      // 写入配置文件中
      const hudConfiguration = JSON.stringify(hudInfo)
      const wresult = await configWrite(host, folderPath, fileName, hudConfiguration)
      // 写入结果
      if (wresult) {
        const writeResult = JSON.parse(wresult)
        if (writeResult && writeResult.result) {
          return true
        } else {
          return false
        }
      }
    } else {
      // 写配置
      const vrhudConfiguration = JSON.stringify(hudConfig);
      const wresult = await configWrite(host, folderPath, fileName, vrhudConfiguration);
      if (wresult) {
        const writeResult = JSON.parse(wresult)
        if (writeResult && writeResult.result) {
          return true
        } else {
          return false
        }
      }
    }
  } else {
    return false;
  }
}

// Armview 参数保存
const saveArmviewConfiguration = async () => {
  return
  // 保存配置文件
  const gameId = currentGameId.value
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameId}`
  const fileName = 'ArmviewConfiguration.json'

  // 检查本地是否存在
  const result = await configRead(host, folderPath, fileName)
  if (result) {
    let armviewInfo = JSON.parse(result)
    if (armviewInfo && armviewInfo.result) {
      // 更新配置，新的配置参数直接覆盖文件保存
      armviewInfo = armviewConfig
      // 写入配置文件中
      const armviewConfiguration = JSON.stringify(armviewInfo)
      const wresult = await configWrite(host, folderPath, fileName, armviewConfiguration)
      // 写入结果
      if (wresult) {
        const writeResult = JSON.parse(wresult)
        if (writeResult && writeResult.result) {
          return true
        } else {
          return false
        }
      }
    } else {
      // 写配置
      const armviewConfiguration = JSON.stringify(armviewConfig);
      const wresult = await configWrite(host, folderPath, fileName, armviewConfiguration);
      if (wresult) {
        const writeResult = JSON.parse(wresult)
        // 写入结果
        if (writeResult && writeResult.result) {
          return true
        } else {
          return false
        }
      }
    }
  } else {
    return false;
  }
}

const handleAdvancedImport = (currentProfile) => {
  console.log(currentProfile)
  console.log('Advanced子组件执行导入逻辑...')
}

const handleAdvancedDelete = (currentProfile) => {
  console.log(currentProfile)
  console.log('Advanced子组件执行删除逻辑...')
}

const handleAdvancedUpdate = async (currentProfile) => {
  console.log(currentProfile)
  console.log('Advanced子组件执行更新逻辑...')

  // 保存配置文件
  const gameId = currentGameId.value
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameId}`
  const saveFileName = `${currentProfile}.json`

  // 读取原配置文件
  const data = await configRead(host, folderPath, saveFileName)

  let finalResult

  if (data) {
    const res = JSON.parse(data)
    if (res.result) {
      const fileInfo = JSON.parse(res.data)
      if (fileInfo) {
        const deviceInfo = currentDevice.value
        const deviceType = deviceInfo.deviceType
        if ([2, 3].includes(deviceType)) {
          // Preference
          fileInfo.OtherControllerOptions.Advanced.LeftHandedMode = gameSetting.LeftHandedMode
          fileInfo.OtherControllerOptions.Advanced.OrlginalTrackpad = gameSetting.OrlginalTrackpad
          fileInfo.OtherControllerOptions.Advanced.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
          fileInfo.OtherControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
          fileInfo.OtherControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
          fileInfo.OtherControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
          fileInfo.OtherControllerOptions.Advanced.SprintMode = gameSetting.SprintMode
          fileInfo.OtherControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
          fileInfo.OtherControllerOptions.Advanced.JumpMode = gameSetting.JumpMode
          fileInfo.OtherControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
          fileInfo.OtherControllerOptions.Advanced.CruiseMode = katTreadMillConfig.CruiseMode

          // GameConfig
          fileInfo.GlobalConfig.MappingController = gameSetting.Hand
          fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
          fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
          fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
          fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
          fileInfo.GlobalConfig.Curve = gameSetting.Curve
          fileInfo.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
          fileInfo.GlobalConfig.DeadZone = gameSetting.DeadZone
          fileInfo.GlobalConfig.ActiveZone = gameSetting.ActiveZone

          // Sitting
          fileInfo.Sitting.Advanced.VehicleHub = vehicleSetting.vehicleHub
          fileInfo.Sitting.Advanced.QuickDrive = vehicleSetting.quickDriveMode
          fileInfo.Sitting.Advanced.VehicleMode = vehicleSetting.vehicleHubType
          fileInfo.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
          fileInfo.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation

          // Haptics
          fileInfo.OtherHaptic.Advanced.HapticMoudleEanble = hapticsSetting.HapticsMoudleEnable
          fileInfo.OtherHaptic.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
          fileInfo.OtherHaptic.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps

        } else if ([4, 8, 9].includes(deviceType)) {
          // Preference
          fileInfo.C2ControllerOptions.Advanced.LeftHandedMode = gameSetting.LeftHandedMode
          fileInfo.C2ControllerOptions.Advanced.OrlginalTrackpad = gameSetting.OrlginalTrackpad
          fileInfo.C2ControllerOptions.Advanced.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
          fileInfo.C2ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
          fileInfo.C2ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
          fileInfo.C2ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
          fileInfo.C2ControllerOptions.Advanced.SprintMode = gameSetting.SprintMode
          fileInfo.C2ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
          fileInfo.C2ControllerOptions.Advanced.JumpMode = gameSetting.JumpMode
          fileInfo.C2ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
          fileInfo.C2ControllerOptions.Advanced.CruiseMode = katTreadMillConfig.CruiseMode

          // GameConfig
          fileInfo.GlobalConfig.MappingController = gameSetting.Hand
          fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
          fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
          fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
          fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
          fileInfo.GlobalConfig.Curve = gameSetting.Curve
          fileInfo.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
          fileInfo.GlobalConfig.DeadZone = gameSetting.DeadZone
          fileInfo.GlobalConfig.ActiveZone = gameSetting.ActiveZone

          // Sitting
          fileInfo.Sitting.Advanced.VehicleHub = vehicleSetting.vehicleHub
          fileInfo.Sitting.Advanced.QuickDrive = vehicleSetting.quickDriveMode
          fileInfo.Sitting.Advanced.VehicleMode = vehicleSetting.vehicleHubType
          fileInfo.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
          fileInfo.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation

          // Haptics
          fileInfo.HapticC2.Advanced.HapticMoudleEanble = hapticsSetting.HapticsMoudleEnable
          fileInfo.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
          fileInfo.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
        } else if ([10].includes(deviceType)) {
          // Preference
          fileInfo.C3ControllerOptions.Advanced.LeftHandedMode = gameSetting.LeftHandedMode
          fileInfo.C3ControllerOptions.Advanced.OrlginalTrackpad = gameSetting.OrlginalTrackpad
          fileInfo.C3ControllerOptions.Advanced.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
          fileInfo.C3ControllerOptions.Advanced.WalkingSpeed = katTreadMillConfig.speedMul
          fileInfo.C3ControllerOptions.Advanced.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
          fileInfo.C3ControllerOptions.Advanced.SensorSensitivity = katTreadMillConfig.SmallActionMasking
          fileInfo.C3ControllerOptions.Advanced.SprintMode = gameSetting.SprintMode
          fileInfo.C3ControllerOptions.Advanced.SprintThreshold = gameSetting.SprintThreshold
          fileInfo.C3ControllerOptions.Advanced.JumpMode = gameSetting.JumpMode
          fileInfo.C3ControllerOptions.Advanced.JumpThreshold = gameSetting.JumpThreshold
          fileInfo.C3ControllerOptions.Advanced.CruiseMode = katTreadMillConfig.CruiseMode

          // GameConfig
          fileInfo.GlobalConfig.MappingController = gameSetting.Hand
          fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
          fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
          fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
          fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
          fileInfo.GlobalConfig.Curve = gameSetting.Curve
          fileInfo.GlobalConfig.MaxSpeedInGame = gameSetting.MaxSpeedInGame
          fileInfo.GlobalConfig.DeadZone = gameSetting.DeadZone
          fileInfo.GlobalConfig.ActiveZone = gameSetting.ActiveZone

          // Sitting
          fileInfo.Sitting.Advanced.VehicleHub = vehicleSetting.vehicleHub
          fileInfo.Sitting.Advanced.QuickDrive = vehicleSetting.quickDriveMode
          fileInfo.Sitting.Advanced.VehicleMode = vehicleSetting.vehicleHubType
          fileInfo.Sitting.Advanced.VehicleSpeed = vehicleSetting.vehicleHubSpeed
          fileInfo.Sitting.Advanced.RRSimulation = vehicleSetting.vehicleRRSimulation

          // Haptics
          fileInfo.HapticC2.Advanced.HapticMoudleEanble = hapticsSetting.HapticsMoudleEnable
          fileInfo.HapticC2.Advanced.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
          fileInfo.HapticC2.Advanced.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
        }
      }
      const content = JSON.stringify(fileInfo)

      const updateResult = await configWrite(host, folderPath, saveFileName, content)


      if (updateResult) {
        const res = JSON.parse(updateResult)
        finalResult = res.result
      }
    }
  }
  return finalResult
}

const handleChangeDisplayArm = async (val) => {
  if (!val) {
    armviewConfig.armviewX = Math.abs(armviewConfig.armviewX)
  } else {
    armviewConfig.armviewX = -Math.abs(armviewConfig.armviewX)
  }

  await restoreRotate()

  await setKatVrArmviewConfig(armviewConfig)
}

// 查找对应游戏配置
const findGameConfig = async () => {
  const gameId = currentGameId.value
  if (allGameLists.value) {
    const gameConfig = await getGameConfig(gameId)
    if (gameConfig) {
      currentGameConfig.value = gameConfig

      // 配置模式
      quickConfiguration.value = gameConfig.QuickConfiguration

      // 设置页面参数
      await setPageConfig()
    }
  }
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

//根据gameid从gameConfigLists中找到对应的游戏配置（临时）
const getGameConfigLists = async (gameId, gameConfigLists) => {
  if (gameConfigLists) {
    if (gameId == '-1') { //Default
      const gameConfig = gameConfigLists.Default;
      if (gameConfig) {
        return gameConfig;
      }
    } else {
      // Steam游戏
      const gameConfig = gameConfigLists.SteamGame.find(item => item.ID === gameId)
      if (gameConfig) {
        return gameConfig;
      } else { //自定义游戏
        const gameConfig = gameConfigLists.CustomGame.find(item => item.ID == gameId)
        if (gameConfig) {
          return gameConfig;
        }
      }
    }
  }
}

// 设置页面参数
const setPageConfig = async () => {
  const gameConfigs = currentGameConfig.value
  if (!gameConfigs) return
  // 设置对应参数
  console.log('setPageConfig', gameConfigs)
  await applicationSettings(gameConfigs)
}

// 配置项
const changeLeftHandedMode = async (val) => {
  console.log('changeLeftHandedMode', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.LeftHandedMode = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.LeftHandedMode = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.LeftHandedMode = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeOrlginalTrackpad = async (val) => {
  console.log('changeOrlginalTrackpad', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.OrlginalTrackpad = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.OrlginalTrackpad = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.OrlginalTrackpad = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

const changeTriggerCalibration = async (val) => {
  console.log('changeTriggerCalibration', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Advanced) {
      newGameConfig.OtherControllerOptions.Advanced.EnableBothTriggerCalibration = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Advanced) {
      newGameConfig.C2ControllerOptions.Advanced.EnableBothTriggerCalibration = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Advanced) {
      newGameConfig.C3ControllerOptions.Advanced.EnableBothTriggerCalibration = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await getGameConfigLists(gameId, gameConfigLists)
    if (gameConfig) {
      Object.assign(gameConfig, newGameConfig);
    }
    await store.dispatch('game/persistGlobalGameConfigs', {
      host,
      gameConfigLists
    })
  }

  return
}

defineExpose({
  handleAdvancedReset,
  handleAdvancedSave,
  handleAdvancedNewSave,
  handleAdvancedImport,
  handleAdvancedDelete,
  handleAdvancedUpdate,
  loadProfileData
})

// 更新 HUD 各元素X、Y位置
function UpdateHudPosition ({ key, x, y }) {
  const xKey = `${key}X`
  const yKey = `${key}Y`
  if (xKey in hudConfig) hudConfig[xKey] = x
  if (yKey in hudConfig) hudConfig[yKey] = y
  console.log('UpdateHudPosition', hudConfig)
}

// 更新armview 元素X/Y
function updateArmviewPosition ({ key, x, y }) {
  const xKey = `${key}X`
  const yKey = `${key}Y`
  if (xKey in armviewConfig) armviewConfig[xKey] = x
  if (yKey in armviewConfig) armviewConfig[yKey] = y
  console.log('updateArmviewPosition', armviewConfig)
}

const persistHudConfig = async (newVal) => {
  if (isSavingHud) return;

  try {
    isSavingHud = true;

    // 使用 toRaw 获取原始对象，避免响应式代理带来的性能开销
    const rawData = JSON.parse(JSON.stringify(newVal));

    // 并行执行两个更新操作
    // await Promise.all([
    //   updateGameHudConfig(host, currentGameId.value, rawData),
    //   setKatVrHudConfig(rawData)
    // ]);

    updateGameHudConfig(host, currentGameId.value, rawData);
    setKatVrHudConfig(rawData);

  } catch (error) {
    console.error('保存配置失败:', error);
  } finally {
    isSavingHud = false;
  }
};

const persistArmviewConfig = async (newVal) => {
  if (isSavingArmview) return;

  try {
    isSavingArmview = true;

    // 使用 toRaw 获取原始对象，避免响应式代理带来的性能开销
    const rawData = JSON.parse(JSON.stringify(newVal));

    // 并行执行两个更新操作
    await Promise.all([
      updateGameArmviewConfig(host, currentGameId.value, rawData),
      setKatVrArmviewConfig(rawData)
    ]);

  } catch (error) {
    console.error('保存配置失败:', error);
  } finally {
    isSavingArmview = false;
  }
};

const debouncedSaveHud = debounce(persistHudConfig, 500);
const debouncedSaveArmview = debounce(persistArmviewConfig, 500);

// onActivated(() => {
//   if (props.profile) {
//     loadProfileData(props.profile)
//   }
// })

const settingIsChanged = async () => {
  // 设置游戏相关参数
  await applyGameSettings()
  // 设置速度等参数
  await applyTreadMillConfig()
  // 设置InputConfig
  await applyInputConfig()
  // 设置坐姿参数
  await applySittingConfig()
  // 设置震动相关参数
  await applyHapticsConfig()
}

watch(
  katTreadMillConfig,
  async (newValue, oldValue) => {
    console.log('katTreadMillConfig对象发生了变化', newValue)
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  katTrackerConfig,
  async (newValue, oldValue) => {
    console.log('katTrackerConfig对象发生了变化', newValue)
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  inputConfig,
  async (newValue, oldValue) => {
    console.log('inputConfig对象发生了变化', newValue)
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  vehicleSetting,
  async (newValue, oldValue) => {
    console.log('vehicleSetting对象发生了变化', newValue)
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  hapticsSetting,
  async (newValue, oldValue) => {
    // console.log('hapticsSetting对象发生了变化', newValue)
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  gameSetting,
  async (newValue, oldValue) => {
    // console.log('gameSetting对象发生了变化', newValue)
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  [heartRate, heartRateType, headsetAngle, bodyAngle, armbandConnectedInfo, treadMillData],
  () => {

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
  },
  { deep: true, immediate: true }
);

watch(
  hudConfig,
  debounce(async (newValue) => {
    // 强制检查：如果是字符串，先解析回对象
    let realObject = newValue;
    if (typeof newValue === 'string') {
      try {
        realObject = JSON.parse(newValue);
      } catch (e) {
        console.error("解析失败", e);
      }
    }

    const raw = toRaw(realObject);
    // 使用这种方式打印，绝对是原始干净的对象
    console.log('HudConfig 原始对象:', JSON.parse(JSON.stringify(raw)));

    debouncedSaveHud(raw);
  }, 300),
  { deep: true }
)

watch(
  armviewConfig,
  debounce(async (newValue) => {
    // 强制检查：如果是字符串，先解析回对象
    let realObject = newValue;
    if (typeof newValue === 'string') {
      try {
        realObject = JSON.parse(newValue);
      } catch (e) {
        console.error("解析失败", e);
      }
    }

    const raw = toRaw(realObject);
    // 使用这种方式打印，绝对是原始干净的对象
    console.log('ArmviewConfig 原始对象:', JSON.parse(JSON.stringify(raw)));

    debouncedSaveArmview(raw);
  }, 300),
  { deep: true }
)

onMounted(async () => {
  // await findGameConfig()

  // requestAnimationFrame(() => {
  //   console.log(quickConfiguration.value)
  //   if (quickConfiguration.value) {
  //     onModeChange('quik')
  //   } else {
  //     onModeChange('advanced')
  //   }
  // })

  // // await checkDefaultAdvancedConfig()
  // await setKatVrHudConfig(hudConfig)
  // await setKatVrArmviewConfig(armviewConfig)
})

onBeforeMount(async () => {
  await findGameConfig()
  requestAnimationFrame(() => {
    console.log(quickConfiguration.value)
    if (quickConfiguration.value) {
      onModeChange('quik')
    } else {
      onModeChange('advanced')
    }
  })

  // await checkDefaultAdvancedConfig()
  await setKatVrHudConfig(hudConfig)
  await setKatVrArmviewConfig(armviewConfig)
})
</script>

<style lang="scss" scoped>
.advanced-setup-container {
  min-height: 400px;
}

.tab-main-content {
  padding: 5px 16px;

  >div :deep(.el-row) {
    margin-bottom: 10px;

    >div {
      margin-bottom: 10px;
    }
  }

  .el-radio-group {
    gap: var(--mini-distance);

    label {
      border-radius: 4px;
      overflow: hidden;

    }

    :deep(.el-radio-button.is-active .el-radio-button__inner) {
      background: var(--brand-color);
      color: var(--title-color);
    }

    :deep(.el-radio-button__inner) {
      background: var(--divider-color);
      color: var(--text-color);
      padding: 4px 10px;
      min-width: 80px;
    }
  }
}

.preference-setting-container {
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  .preference-row {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .el-radio-group {
      gap: var(--mini-distance);

      label {
        border-radius: 4px;
        overflow: hidden;

      }

      :deep(.el-radio-button.is-active .el-radio-button__inner) {
        background: var(--brand-color);
        color: var(--title-color);
      }

      :deep(.el-radio-button__inner) {
        background: var(--divider-color);
        color: var(--text-color);
        padding: 4px 10px;
        min-width: 80px;
      }
    }

    :deep(.el-button) {
      background: var(--divider-color);
      border: none;
      color: var(--title-color);
      padding: 4px 10px;
      min-width: 80px;
    }
  }
}

.panel-tab-nav {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-direction: row;
  padding: 5px 16px;
}

.panel-tips p {
  font-size: 12px;
}

.custom-tabs-nav {
  display: flex;
  gap: 25px;
  margin-bottom: 10px;

  .tab-item {
    padding: 5px 0;
    cursor: pointer;
    position: relative;
    transition: color 0.3s;
    font-size: 12px;

    .active-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
    }
  }
}

.tab-main-content .tab-panel .game-config-describe {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  justify-content: flex-start;
}

.tab-main-content .tab-panel .game-config-describe .config-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-icon {
  width: 24px;
  height: 24px;
}

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-icon img {
  filter: invert(1);
  width: 24px;
  height: 24px;
}

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-content .first-describe {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: flex-start;

  p {
    color: #fcaf1b;
  }
}

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-content .second-describe {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
}

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-content .third-describe {
  display: flex;
  flex-direction: row;
  gap: 5px;

  p {
    color: #fcaf1b;
    text-indent: 2em;
  }
}

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-content .fourth-describe {
  display: flex;
  flex-direction: row;
  gap: 5px;

  p {
    text-indent: 2em;
  }
}

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-content .fiveth-describe {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: flex-start;

  .config-item-text {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: flex-start;
  }
}

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-text p {
  margin: 0;
  font-size: 16px;
  text-align: left;
  line-height: 20px;
}

.tab-main-content .tab-panel .controller-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  margin-left: 0;
}

.tab-main-content .tab-panel .controller-settings .controller-settings-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  .controller-settings-func {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    .controller-icon {
      cursor: pointer;
    }
  }
}

.controller-settings-tip {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .controller-settings-tip-text p {
    text-indent: 0;
  }
}

.controller-settings-controls {
  margin-left: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .acceleration-curve-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;

    .acceleration-curve-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .get-max-speed-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;

    .get-max-speed-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .starting-joystick-mapping-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;

    .starting-joystick-mapping-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .max-joystick-mapping-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;

    .max-joystick-mapping-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .haptics-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;

    .haptics-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .vibration-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;

    .vibration-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .trigger-by-steps-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;

    .trigger-by-steps-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .acceleration-curve-slider {
    display: grid;
    grid-template-columns: 1fr 20fr 1fr;
    column-gap: 10px;
  }

  .get-max-speed-slider {
    display: grid;
    grid-template-columns: 1fr 20fr 1fr;
    column-gap: 10px;
  }

  .starting-joystick-mapping-slider {
    display: grid;
    grid-template-columns: 1fr 20fr 1fr;
    column-gap: 10px;
  }

  .max-joystick-mapping-slider {
    display: grid;
    grid-template-columns: 1fr 20fr 1fr;
    column-gap: 10px;
  }

  .vibration-slider {
    display: grid;
    grid-template-columns: 1fr 1fr 20fr 1fr 1fr;
    column-gap: 10px;

    .vibration-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      border: 1px solid;
      line-height: 18px;
      opacity: 0.6;
    }

    .active {
      opacity: 1;
    }
  }

  .trigger-by-steps-slider {
    display: grid;
    grid-template-columns: 1fr 1fr 20fr 1fr 1fr;
    column-gap: 10px;

    .trigger-by-steps-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      border: 1px solid;
      line-height: 18px;
      opacity: 0.6;
    }

    .active {
      opacity: 1;
    }
  }

  .sitting-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    gap: 10px;

    .sitting-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .mod-setting-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 80px;
  }

  .mod-setting-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .mod-icon {
    cursor: pointer;
  }

  .mod-text {
    font-size: 14px;
    font-weight: 500;
  }

  .vehicle-speed-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    gap: 10px;
  }

  .vehicle-speed-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .vehicle-speed-slider {
    display: grid;
    grid-template-columns: 1fr 20fr 1fr;
    column-gap: 10px;
  }

  .road-roughness-simulation-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    gap: 10px;
  }

  .road-roughness-simulation-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .road-roughness-simulation-slider {
    display: grid;
    grid-template-columns: 1fr 20fr 1fr;
    column-gap: 10px;
  }
}

.tab-main-content .tab-panel .left-handed-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .original-trackpad {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .both-trigger-calibration {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .walking-speed-multiplier {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .walking-accuracy-multiplier {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .unintentional-movement-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .sprint-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .sprint-threshold {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .jump-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .jump-threshold {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .cruise-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tab-main-content .tab-panel .slider-min {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
}

.tab-main-content .tab-panel .slider-min-icon {
  font-size: 36px;
  font-weight: bold;
  height: 10px;
  line-height: 0;
  cursor: pointer;
}

.tab-main-content .tab-panel .slider-min-text {
  font-size: 10px;
  font-weight: normal;
  line-height: 12px;
  cursor: pointer;
}

.tab-main-content .tab-panel .walking-speed-multiplier-slider {
  display: grid;
  grid-template-columns: 1fr 20fr 1fr;
  align-items: flex-start;
  gap: 10px;
  margin-top: 10px;
}

.tab-main-content .tab-panel .walking-accuracy-multiplier-slider {
  display: grid;
  grid-template-columns: 1fr 20fr 1fr;
  align-items: flex-start;
  gap: 10px;
  margin-top: 10px;
}

.tab-main-content .tab-panel .unintentional-movement-filter-slider {
  display: grid;
  grid-template-columns: 1fr 20fr 1fr;
  align-items: flex-start;
  gap: 0px;
  margin-top: 10px;
}

.tab-main-content .tab-panel .sprint-threshold-slider {
  display: grid;
  grid-template-columns: 1fr 20fr 1fr;
  align-items: flex-start;
  gap: 10px;
  margin-top: 10px;
}

.tab-main-content .tab-panel .jump-threshold-slider {
  display: grid;
  grid-template-columns: 1fr 20fr 1fr;
  align-items: flex-start;
  gap: 10px;
  margin-top: 10px;
}

.tab-main-content .tab-panel .slider-max {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.tab-main-content .tab-panel .slider-max-icon {
  font-size: 36px;
  font-weight: bold;
  height: 10px;
  line-height: 0;
  cursor: pointer;
}

.tab-main-content .tab-panel .slider-max-text {
  font-size: 10px;
  font-weight: normal;
  line-height: 12px;
  cursor: pointer;
}

.tab-main-content .tab-panel .jump-mode-control-tips {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
}

.tab-main-content .tab-panel .jump-mode-control-tips span {
  color: #fcca00;
  color: #fcca00;
}

.tab-main-content .tab-panel .disabled-area {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

:deep(.el-divider--horizontal) {
  margin: 10px 0;
}

:deep(.el-slider) {
  --el-slider-main-bg-color: #05c3de;
  --el-slider-runway-bg-color: #333;
  --el-slider-stop-bg-color: transparent;
  height: 6px;

  .el-slider__runway {
    height: 4px;
  }

  .el-slider__bar {
    height: 4px;
  }

  :deep(.el-slider__button-wrapper) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tab-main-content .tab-panel .custom-slider-thumb {
    width: 45px;
    height: 22px;
    background-color: #0d1a21;
    border: 1px solid #05c3de;
    color: #05c3de;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    border-radius: 2px;
    position: relative;
    z-index: 10;
  }
}

.vr-hud-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.vr-hud-container .vr-hud-left-panel {
  flex: 1;
}

.vr-hud-left-panel {
  position: relative;
  aspect-ratio: 1/1;
}

.vr-hud-container .vr-hud-right-panel {
  flex: 1;

  .global-settings {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;

    .global-settings-title {
      font-size: 16px;
      font-weight: bold;
      line-height: 23px;
      letter-spacing: 0px;
      color: #FFFFFF;
    }

    .global-settings-property {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 5px;

      .el-button {
        padding: 2px 8px;
        background: #05C3DE;
        color: #ffffff;
      }
    }
  }

  .control-item-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 3px;

    .panel-controls {
      display: grid;
      grid-template-columns: 1fr 20fr 1fr;
      gap: 20px;

      .controls-left-text {
        font-size: 12px;
        font-weight: normal;
        line-height: 17px;
        letter-spacing: 0px;
        color: #767676;
      }

      .controls-right-text {
        font-size: 12px;
        font-weight: normal;
        line-height: 17px;
        letter-spacing: 0px;
        color: #767676;
      }
    }

    .control-item-text {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      color: #767676;
    }

    .control-item-setting {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      opacity: 1;
      background: #91caff;

      .heart-rate-setting {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 20px;
        padding-right: 20px;

        .opacity-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 10px;
        }

        .heart-rate-control {
          display: grid;
          grid-template-columns: 1fr 18fr 1fr;
          align-items: center;
          gap: 20px;
        }

        .heart-rate-config {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          justify-content: space-between;
        }

        .fitness-zone-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }
      }

      .fitness-data-setting {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 20px;
        padding-right: 20px;

        .opacity-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 10px;
        }

        .fitness-data-control {
          display: grid;
          grid-template-columns: 1fr 18fr 1fr;
          align-items: center;
          gap: 20px;
        }

        .fitness-data-config {
          display: flex;
          flex-direction: row;
          align-items: baseline;
        }

        .walking-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }

        .mileage-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }

        .consume-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }

        .active-time-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }
      }

      .device-direction-setting {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 20px;
        padding-right: 20px;

        .opacity-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 10px;
        }

        .device-direction-control {
          display: grid;
          grid-template-columns: 1fr 18fr 1fr;
          align-items: center;
          gap: 20px;
        }
      }

      .device-status-setting {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 20px;
        padding-right: 20px;

        .opacity-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 10px;
        }

        .device-status-control {
          display: grid;
          grid-template-columns: 1fr 18fr 1fr;
          align-items: center;
          gap: 20px;
        }

        .armband-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }

        .direction-sensor-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }

        .foot-sensor-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }
      }

      .today-rank-setting {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 20px;
        padding-right: 20px;

        .opacity-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 10px;
        }

        .today-rank-control {
          display: grid;
          grid-template-columns: 1fr 18fr 1fr;
          align-items: center;
          gap: 20px;
        }

        .update-frequency-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }
      }

      .current-time-setting {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 20px;
        padding-right: 20px;

        .opacity-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 10px;
        }

        .current-time-control {
          display: grid;
          grid-template-columns: 1fr 18fr 1fr;
          align-items: center;
          gap: 20px;
        }

        .date-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }

        .time-config {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
        }
      }
    }
  }

  .global-settings-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    .control-item {
      padding: 8px 10px;
      border-radius: 10px;
      background: #e6f4ff;
      height: 56px;
    }
  }

  .module-settings-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;

    .control-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 2px 4px;
      border-radius: 10px;
      background: #e6f4ff;
      height: 56px;

      .control-item-property {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 20px;
      }

      .control-item-size {
        display: grid;
        grid-template-columns: 1fr 8fr 1fr;
        gap: 20px;
        align-items: center;
      }
    }
  }
}

.armview-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.armview-container .armview-left-container {
  flex: 1;
}

.armview-container .armview-right-container {
  flex: 1;

  .global-settings {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;

    .global-settings-title {
      font-size: 16px;
      font-weight: bold;
      line-height: 23px;
      letter-spacing: 0px;
      color: #FFFFFF;
    }

    .global-settings-property {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 5px;

      .el-button {
        padding: 2px 8px;
        background: #05C3DE;
        color: #ffffff;
      }
    }
  }

  .control-item-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 3px;

    .control-item-text {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0px;
      color: #767676;
    }

    .control-item-setting .update-frequency-config {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .control-item-setting .heart-rate-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .fitness-zone-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .walking-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .mileage-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .consume-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .active-time-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .armband-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .direction-sensor-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .foot-sensor-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .date-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .control-item-setting .time-config {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .global-settings-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 10px;

    .control-item {
      display: grid;
      grid-template-columns: 1fr;
      padding: 8px 10px;
      border-radius: 10px;
      background: #e6f4ff;
      height: 56px;

      .control-item-property {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .control-item-text {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          font-weight: normal;
          line-height: 17px;
          letter-spacing: 0px;
          color: #767676;
        }
      }

      .control-item-size {
        display: grid;
        grid-template-columns: 1fr 8fr 1fr;
        align-items: center;
        gap: 20px;
      }
    }
  }

  .el-radio-group {
    gap: 0;

    label {
      border-radius: 4px;
      overflow: hidden;

    }

    :deep(.el-radio-button.is-active .el-radio-button__inner) {
      background: var(--brand-color);
      color: var(--title-color);
    }

    :deep(.el-radio-button__inner) {
      background: var(--divider-color);
      color: var(--text-color);
      padding: 4px 10px;
      min-width: 40px;
    }
  }

  :deep(.el-button) {
    background: var(--divider-color);
    border: none;
    color: var(--title-color);
    padding: 4px 10px;
    min-width: 40px;
  }
}
</style>
