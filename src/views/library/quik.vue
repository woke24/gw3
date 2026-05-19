<template>
  <div class="quik-setup-container">
    <div class="panel-tab-nav">
      <div class="panel-tab dark-tab">
        <nav class="custom-tabs-nav">
          <div v-for="tab in tabList" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key">
            {{ tab.label }}
            <div class="active-bar"></div>
          </div>
        </nav>
        <div class="panel-tips">
          <p>All settings take effect in real time.</p>
        </div>
      </div>
      <div v-if="activeTab === 'preference'" class="panel-setup">
        <el-select :model-value="setupMode" @change="onModeChange" class="dark-select" placeholder="Select" size="small"
          style="width: 130px">
          <el-option label="Quik Setup" value="quik" />
          <el-option label="Advanced Setup" value="advanced" />
        </el-select>
      </div>
    </div>
    <div class="tab-main-content">
      <section v-if="activeTab === 'preference'" class="tab-panel">
        <div class="preference-setting-container">
          <div class="control-setting">
            <div class="control-setting-panel">
              <el-row>
                <el-divider content-position="left" class="control-setting-title setting-title">Control</el-divider>
              </el-row>
              <el-row class="preference-row">
                <el-col :span="12">
                  <div class="control-setting-property">
                    <div class="control-setting-property-key">
                      <span class="preference-col-label">Dominant Hand</span>
                    </div>
                    <div class="control-setting-property-value">
                      <el-radio-group v-model="gameSetting.LeftHandedMode" size="small" @change="changeDominantHand">
                        <el-radio-button :value="true">Left</el-radio-button>
                        <el-radio-button :value="false">Right</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="control-setting-property">
                    <div class="control-setting-property-key">
                      <span class="preference-col-label">Both Trigger Calibration</span>
                    </div>
                    <div class="control-setting-property-value">
                      <el-radio-group v-model="inputConfig.enableDoubleTriggerCalibration" size="small"
                        @change="changeTriggerCalibration">
                        <el-radio-button :value="false">Off</el-radio-button>
                        <el-radio-button :value="true">On</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="walking-setting">
            <div class="walking-setting-panel">
              <el-row>
                <el-divider content-position="left" class="control-setting-title setting-title">Walking</el-divider>
              </el-row>
              <el-row class="preference-row">
                <el-col :span="12">
                  <div class="walking-setting-property">
                    <div class="walking-setting-property-key">
                      <span class="preference-col-label">Speed</span>
                    </div>
                    <div class="walking-setting-property-value">
                      <el-radio-group v-model="katTreadMillConfig.speedMul" size="small" @change="changeSpeed">
                        <el-radio-button :value="0.5">Slow</el-radio-button>
                        <el-radio-button :value="1.0">Medium</el-radio-button>
                        <el-radio-button :value="1.5">Fast</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="walking-setting-property">
                    <div class="walking-setting-property-key">
                      <span class="preference-col-label">Accuracy</span>
                    </div>
                    <div class="walking-setting-property-value">
                      <el-radio-group v-model="katTreadMillConfig.ForwardMovementSensitivity" size="small"
                        @change="changeAccuracy">
                        <el-radio-button :value="0">Smooth</el-radio-button>
                        <el-radio-button :value="5">Medium</el-radio-button>
                        <el-radio-button :value="10">Accuracy</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="walking-setting-property">
                    <div class="walking-setting-property-key">
                      <span class="preference-col-label">Original Controller</span>
                    </div>
                    <div class="walking-setting-property-value">
                      <el-radio-group v-model="gameSetting.OrlginalTrackpad" size="small"
                        @change="changeOriginalController">
                        <el-radio-button :value="0">Secondary</el-radio-button>
                        <el-radio-button :value="1">Priority</el-radio-button>
                        <el-radio-button :value="2">Disable</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" v-show="currentDevice?.deviceType > 9">
                  <div class="walking-setting-property">
                    <div class="walking-setting-property-key">
                      <span class="preference-col-label">Backward Speed</span>
                    </div>
                    <div class="walking-setting-property-value">
                      <el-radio-group size="small">
                        <el-radio-button label="Off" :value="0" />
                        <el-radio-button label="Slow" :value="1" />
                        <el-radio-button label="Fast" :value="2" />
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row class="preference-row">
                <el-col :span="24">
                  <div class="walking-setting-last-property">
                    <div class="walking-setting-last-property-key">
                      <span class="preference-col-label">Unintentional Movement</span>
                    </div>
                    <div class="walking-setting-last-property-value">
                      <el-radio-group v-model="katTreadMillConfig.SmallActionMasking" size="small"
                        @change="changeUnintentionalMovement">
                        <el-radio-button label="Unfiltered" :value="0" />
                        <el-radio-button label="Medium" :value="5" />
                        <el-radio-button label="High Filtering" :value="10" />
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="actions-setting">
            <div class="actions-setting-panel">
              <el-row>
                <el-divider content-position="left" class="actions-setting-title setting-title">Actions</el-divider>
              </el-row>
              <el-row class="preference-row">
                <el-col :span="12">
                  <div class="actions-setting-property">
                    <div class="actions-setting-property-key">
                      <span class="preference-col-label">Sprint</span>
                    </div>
                    <div class="actions-setting-property-value">
                      <el-radio-group v-model="gameSetting.SprintThreshold" size="small"
                        @change="changeSprintThreshold">
                        <el-radio-button :value="0">Off</el-radio-button>
                        <el-radio-button :value="10">Easy</el-radio-button>
                        <el-radio-button :value="20">Hard</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="actions-setting-property">
                    <div class="actions-setting-property-key">
                      <span class="preference-col-label">Jump</span>
                    </div>
                    <div class="actions-setting-property-value">
                      <el-radio-group v-model="gameSetting.JumpThreshold" size="small" @change="changeJumpThreshold">
                        <el-radio-button :value="0">Off</el-radio-button>
                        <el-radio-button :value="5">Easy</el-radio-button>
                        <el-radio-button :value="15">Hard</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="actions-setting-property">
                    <div class="actions-setting-property-key">
                      <span class="preference-col-label">Cruise</span>
                    </div>
                    <div class="actions-setting-property-value">
                      <el-radio-group v-model="katTreadMillConfig.CruiseMode" size="small" @change="changeCruiseMode">
                        <el-radio-button :value="false">Off</el-radio-button>
                        <el-radio-button :value="true">On</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="vehicle-hub-setting" :class="{ 'is-disabled': !sittingConnectedInfo.connected }">
            <div class="vehicle-hub-setting-panel">
              <el-row>
                <el-divider content-position="left" class="vehicle-hub-setting-title setting-title">Vehicle
                  Hub</el-divider>
              </el-row>
              <el-row class="preference-row">
                <el-col :span="12">
                  <div class="vehicle-hub-setting-property">
                    <div class="vehicle-hub-setting-property-key">
                      <span class="preference-col-label">Vehicle Hub Type</span>
                    </div>
                    <div class="vehicle-hub-setting-property-value">
                      <el-radio-group v-model="vehicleSetting.vehicleHubType" size="small"
                        @change="changeVehicleHubType">
                        <el-radio-button :value="0">AUTO</el-radio-button>
                        <el-radio-button :value="1">MOUNTS</el-radio-button>
                        <el-radio-button :value="2">AIRCRAFT</el-radio-button>
                        <el-radio-button :value="3">HEAVY VEHICLES</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="vehicle-hub-setting-property">
                    <div class="vehicle-hub-setting-property-key">
                      <span class="preference-col-label">Vehicle Speed</span>
                    </div>
                    <div class="vehicle-hub-setting-property-value">
                      <el-radio-group v-model="vehicleSetting.vehicleHubSpeed" size="small"
                        @change="changeVehicleHubSpeed">
                        <el-radio-button :value="1.1">Slow</el-radio-button>
                        <el-radio-button :value="1.7">Medium</el-radio-button>
                        <el-radio-button :value="2.0">Fast</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="vehicle-hub-setting-property">
                    <div class="vehicle-hub-setting-property-key">
                      <span class="preference-col-label">Road Roughness Simulation</span>
                    </div>
                    <div class="vehicle-hub-setting-property-value">
                      <el-radio-group v-model="vehicleSetting.vehicleRRSimulation" size="small"
                        @change="changeRRSimulation">
                        <el-radio-button :value="0">Smooth</el-radio-button>
                        <el-radio-button :value="1">Moderate</el-radio-button>
                        <el-radio-button :value="2.0">Rough</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="haptics-setting">
            <div class="haptics-setting-panel">
              <el-row>
                <el-divider content-position="left" class="haptics-setting-title setting-title">Haptics</el-divider>
              </el-row>
              <el-row class="preference-row">
                <el-col :span="12">
                  <div class="haptics-setting-property">
                    <div class="haptics-setting-property-key">
                      <span class="preference-col-label">Trigger by Controller</span>
                    </div>
                    <div class="haptics-setting-property-value">
                      <el-radio-group v-model="inputConfig.vibrateLevel" size="small" @change="changeVibrateLevel">
                        <el-radio-button :value="0">Off</el-radio-button>
                        <el-radio-button :value="1">Weak</el-radio-button>
                        <el-radio-button :value="3">Medium</el-radio-button>
                        <el-radio-button :value="5">Strong</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="haptics-setting-property">
                    <div class="haptics-setting-property-key">
                      <span class="preference-col-label">Trigger by Steps</span>
                    </div>
                    <div class="haptics-setting-property-value">
                      <el-radio-group v-model="hapticsSetting.C2TriggerBySteps" size="small"
                        @change="changeC2TriggerBySteps">
                        <el-radio-button :value="0">Off</el-radio-button>
                        <el-radio-button :value="1">Weak</el-radio-button>
                        <el-radio-button :value="2">Medium</el-radio-button>
                        <el-radio-button :value="3">Strong</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="controller-mapping-setting">
            <div class="controller-mapping-setting-panel">
              <el-row>
                <el-divider content-position="left" class="controller-mapping-setting-title setting-title">Controller
                  Mapping</el-divider>
              </el-row>
              <el-row class="preference-row">
                <el-col :span="24">
                  <div class="mapping-setting-property">
                    <div class="mapping-setting-property-key">
                      <span class="preference-col-label">Walk Controller</span>
                    </div>
                    <div class="mapping-setting-property-value">
                      <el-select v-model="gameSetting.Hand" placeholder="Select" class="dark-select" size="small"
                        @change="changeHand" style="width: 200px">
                        <el-option label="LeftHand Controller" :value="0" />
                        <el-option label="RightHand Controller" :value="1" />
                      </el-select>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="mapping-setting-property">
                    <div class="mapping-setting-property-key">
                      <span class="preference-col-label">Walk Action</span>
                    </div>
                    <div class="mapping-setting-property-value">
                      <el-select v-model="gameSetting.WalkTriggerSource" placeholder="Select" class="dark-select"
                        size="small" @change="changeWalkTriggerSource" style="width: 200px">
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
                </el-col>
                <el-col :span="24">
                  <div class="mapping-setting-property">
                    <div class="mapping-setting-property-key">
                      <span class="preference-col-label">Walk Speed Type</span>
                    </div>
                    <div class="mapping-setting-property-value">
                      <el-select v-model="gameSetting.WalkSpeedType" placeholder="Select" class="dark-select"
                        size="small" @change="changeWalkSpeedType" style="width: 200px">
                        <el-option label="Linear movement" :value="0" />
                        <el-option label="Constant speed movement" :value="1" />
                      </el-select>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="mapping-setting-property">
                    <div class="mapping-setting-property-key">
                      <span class="preference-col-label">Sprint Action</span>
                    </div>
                    <div class="mapping-setting-property-value">
                      <el-select v-model="gameSetting.SprintSource" placeholder="Select" class="dark-select"
                        size="small" @change="changeSprintSource" style="width: 200px">
                        <el-option label="No sprint" :value="0" />
                        <el-option label="Trackpad click" :value="1" />
                        <el-option label="Trackpad double click" :value="2" />
                        <el-option label="Joystick click" :value="3" />
                        <el-option label="Grip press" :value="4" />
                      </el-select>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="mapping-setting-property">
                    <div class="mapping-setting-property-key">
                      <span class="preference-col-label">Jump Action</span>
                    </div>
                    <div class="mapping-setting-property-value">
                      <el-select v-model="gameSetting.JumpSource" placeholder="Select" class="dark-select" size="small"
                        @change="changeJumpSource" style="width: 200px">
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
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'config'" class="tab-panel">
        <div v-if="currentGameId !== 43810011" class="game-config-describe">
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
            <div v-if="gameInfo" class="config-item-content" v-html="gameInfo.gameTips">
            </div>
          </div>
        </div>
        <div v-else>
          <div class="game-config-describe">
            <div class="config-item">
              <div class="config-item-content">
                <div class="first-describe">
                  <div class="config-item-text">
                    <p>
                      *If you are a Quest Standalone user, make sure your device is on the same LAN as
                      this PC device
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="config-item">
              <div class="config-item-content">
                <div class="third-describe">
                  <div class="config-item-icon">
                    <img v-nodrag :src="attention" alt="" />
                  </div>
                  <div class="config-item-text">
                    <p>Before use, please turn on the OSC function in the game</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="config-item">
              <div class="config-item-content">
                <div class="fourth-describe">
                  <div class="config-item-text">
                    <p>You can turn on OSC in the Action Menu under Osc > Enabled.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="game-config-thumbnails">
            <div class="osc-setting">
              <img :src="oscSetting" alt="" />
            </div>
            <div class="osc-setting-text">
              <p>After opening, click the "Run Game" button on the left.</p>
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
                <el-button @click="VrhudApplyToDistance" size="default">Apply to all games</el-button>
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
                      <el-slider v-model="hudConfig.hudDistanceZ" :min="2" :max="10" :step="0.1"
                        @change="changeHudDistance" />
                    </div>
                    <div class="controls-right-text">Far</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="global-settings">
              <div class="global-settings-title">Module Settings</div>
              <div class="global-settings-property">
                <el-button @click="VrhudApplyToAll" size="default">Apply to all games</el-button>
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
                                <el-slider v-model="hudConfig.heartRateOpacity" :min="0" :max="1"
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
                    <el-slider v-model="hudConfig.heartRateSize" :min="0.4" :max="2" :step="0.1"></el-slider>
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
                                <el-slider v-model="hudConfig.fitnessDataOpacity" :min="0" :max="1"
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
                    <el-slider v-model="hudConfig.fitnessDataSize" :min="0.4" :max="2" :step="0.1"></el-slider>
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
                                <el-slider v-model="hudConfig.deviceDirectionOpacity" :min="0" :max="1"
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
                    <el-slider v-model="hudConfig.deviceDirectionSize" :min="0.4" :max="2" :step="0.1"></el-slider>
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
                                <el-slider v-model="hudConfig.deviceStatusOpacity" :min="0" :max="1"
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
                    <el-slider v-model="hudConfig.deviceStatusSize" :min="0.4" :max="2" :step="0.1"></el-slider>
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
                                <el-slider v-model="hudConfig.todaysRankOpacity" :min="0" :max="1"
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
                    <el-slider v-model="hudConfig.todaysRankSize" :min="0.4" :max="2" :step="0.1"></el-slider>
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
                                <el-slider v-model="hudConfig.currentTimeOpacity" :min="0" :max="1"
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
                    <el-slider v-model="hudConfig.currentTimeSize" :min="0.4" :max="2" :step="0.1"></el-slider>
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
                <el-button @click="ArmApplyToAll" size="default">Apply to all games</el-button>
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
                    <el-slider v-model="armviewConfig.armViewSize" :min="0.325" :max="0.775" :step="0.05"></el-slider>
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
                  <div class="reduce-control">Height</div>
                  <div class="size-control">
                    <el-slider v-model="armviewConfig.armviewHeight" :min="-0.05" :max="0.05" :step="0.01"
                      reverse></el-slider>
                  </div>
                  <div class="increase-control">Low</div>
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
                    <el-slider v-model="armviewConfig.armviewOpacity" :min="0.4" :max="1" :step="0.01"></el-slider>
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
                    <el-slider v-model="armviewConfig.panelOpacity" :min="0" :max="1" :step="0.1"></el-slider>
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
                    <el-slider v-model="armviewConfig.armviewDisplayDistance" :min="0.25" :max="1"
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
import attention from '@/assets/game/attention.png'
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
import oscSetting from '@/assets/game/osc_setting.png'

import { RefreshLeft, MoreFilled } from '@element-plus/icons-vue'
import hudPreviewEle from '@/views/library/components/hud-preview.vue'
import armviewPreview from '@/views/library/components/armview-preview.vue'

// 读写文件、配置参数应用
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

import { initGameDefaultConfig, readGameDefaultConfig, updateGameHudConfig, updateGameArmviewConfig } from '@/utils/game'

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
const currentGameName = ref(route.params.name)
const allGameLists = computed(() => store.getters['game/getGlobalGameConfigs'])

const currentGameConfig = ref({})

const NAMESPACE = 'device'

// 响应式获取 Vuex 实时数据
const headsetAngle = computed(() => store.getters[`${NAMESPACE}/getHeadsetAngle`])
const bodyAngle = computed(() => store.getters[`${NAMESPACE}/getBodyAngle`])
const heartRate = computed(() => store.getters[`${NAMESPACE}/getHeartRate`])

const selectedDevice = computed(() => store.getters[`${NAMESPACE}/getSelectedDevice`])

const sittingConnectedInfo = computed(() => store.getters[`${NAMESPACE}/getSittingInfo`])

// 跑步机数据，根据设备类型读取
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

const gameInfo = computed(() => props.gameInfo)

const onModeChange = async (val) => {
  console.log('onModeChange', val)

  await emit('update:setupMode', val)

  try {
    await changeQuikConfiguration(val)
  } catch (error) {
    console.error('业务逻辑出错:', error);
  }
}

// 更新模式
const changeQuikConfiguration = async (val) => {
  console.log('changeQuikConfiguration', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  if (gameConfigInfo) {
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

      // 更新整个全局游戏配置列表
      await store.dispatch('game/persistGlobalGameConfigs', {
        host,
        gameConfigLists
      })
    }
  }

  return
}

const activeTab = ref('preference')

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const currentDevice = computed(() => selectedDevice.value)

// Armview 相关
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



let isSavingHud = false
let isSavingArmview = false

const tabList = [
  { key: 'preference', label: 'Preference' },
  { key: 'config', label: 'Game Config' },
  { key: 'vrhud', label: 'VRHUD' },
  { key: 'armview', label: 'Armview' }
]

// 设置速度等参数 - DRIVER_CONFIG_To_VR
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
// DRIVER_CONFIG_To_VR
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
  LeftHandedMode: true,
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
  console.log('restoreHudDistance')
  hudConfig.hudDistanceZ = 2.0
}

const restoreHeartRate = async () => {
  console.log('restoreHeartRate')
  // 外面设置
  hudConfig.heartRateSize = 1.0
  // 重置里面的配置项目
  hudConfig.heartRateOpacity = 1.0
  hudConfig.heartRatingVisible = true
  hudConfig.stateofSportsVisible = true
}

const restoreHeartRateOpacity = async () => {
  console.log('restoreHeartRateOpacity')
  hudConfig.heartRateOpacity = 1
}

const restoreFitnessDataOpacity = async () => {
  console.log('restoreFitnessDataOpacity')
  hudConfig.fitnessDataOpacity = 1.0
}

const restoreFitnessData = async () => {
  console.log('restoreFitnessData')
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
  console.log('restoreDeviceDirection')
  // 外面设置
  hudConfig.deviceDirectionSize = 1.0
  // 浮窗里的设置项
  hudConfig.deviceDirectionOpacity = 1.0
}

const restoreDeviceStatus = async () => {

  console.log('restoreDeviceStatus')
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
  console.log('restoreTodayRank')
  // 外面设置
  hudConfig.todaysRankSize = 1.0
  // 浮窗里的设置项
  hudConfig.todaysRankOpacity = 1.0
  hudConfig.updateFrequencyTextVisible = true
}

// 重置当前时间浮窗的设置
const restoreCurrentTime = async () => {
  console.log('restoreCurrentTime')
  // 外面设置
  hudConfig.currentTimeSize = 1.0
  // 浮窗里的设置项
  hudConfig.currentTimeOpacity = 1.0
  hudConfig.currentTimeDate = 1.0
  hudConfig.currentTimeTime = 0
}

// 重置方向浮窗的透明度
const restoreDirectionOpacity = async () => {
  console.log('restoreDirectionOpacity')
  hudConfig.deviceDirectionOpacity = 1.0
}

const restoreDeviceStatusOpacity = async () => {
  console.log('restoreDeviceStatusOpacity')
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

  console.log('heartRateSizeDecrease')
  if (hudConfig.heartRateSize > 0.4) {
    hudConfig.heartRateSize = Number((hudConfig.heartRateSize - 0.1).toFixed(2))
  }
}

const heartRateSizeIncrease = () => {
  console.log('heartRateSizeIncrease')
  if (hudConfig.heartRateSize < 2) {
    hudConfig.heartRateSize = Number((hudConfig.heartRateSize + 0.1).toFixed(2))
  }
}

const fitnessDataSizeDecrese = () => {
  console.log('fitnessDataSizeDecrese')
  if (hudConfig.fitnessDataSize > 0.4) {
    hudConfig.fitnessDataSize = Number((hudConfig.fitnessDataSize - 0.1).toFixed(2))
  }
}

const fitnessDataSizeIncrese = () => {
  console.log('fitnessDataSizeIncrese')
  if (hudConfig.fitnessDataSize < 2) {
    hudConfig.fitnessDataSize = Number((hudConfig.fitnessDataSize + 0.1).toFixed(2))
  }
}

const deviceDirectionDecrease = () => {
  console.log('deviceDirectionDecrease')
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
  console.log('deviceStatusSizeDecrease')
  if (hudConfig.deviceStatusSize > 0.4) {
    hudConfig.deviceStatusSize = Number((hudConfig.deviceStatusSize - 0.1).toFixed(2))
  }
}

const deviceStatusSizeIncrease = () => {
  console.log('deviceStatusSizeIncrease')
  if (hudConfig.deviceStatusSize < 2) {
    hudConfig.deviceStatusSize = Number((hudConfig.deviceStatusSize + 0.1).toFixed(2))
  }
}

const todaysRankSizeDecrease = () => {
  console.log('todaysRankSizeDecrease')
  if (hudConfig.todaysRankSize > 0.4) {
    hudConfig.todaysRankSize = Number((hudConfig.todaysRankSize - 0.1).toFixed(2))
  }
}

const todaysRankSizeIncrease = () => {
  console.log('todaysRankSizeIncrease')
  if (hudConfig.todaysRankSize < 2) {
    hudConfig.todaysRankSize = Number((hudConfig.todaysRankSize + 0.1).toFixed(2))
  }
}

const currentTimeSizeDecrease = () => {
  console.log('currentTimeSizeDecrease')
  if (hudConfig.currentTimeSize > 0.4) {
    hudConfig.currentTimeSize = Number((hudConfig.currentTimeSize - 0.1).toFixed(2))
  }
}

const currentTimeSizeIncrease = () => {
  console.log('currentTimeSizeIncrease')
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
// 检测是否存在默认快捷配置，没有则创建
const checkDefaultQuikConfig = async () => {
  try {
    if (currentGameId.value) {

      const gameId = currentGameId.value

      const folderPath = `${new_GatewayPath}/${profilePath}/${gameId}`
      const fileName = 'Default.json'
      const fileInfo = await configRead(host, folderPath, fileName)
      if (fileInfo) {
        const res = JSON.parse(fileInfo)
        // 不存在，生成默认配置，存在则更新配置JSON
        if (!res.result) {
          await initGameDefaultConfig(host, gameId)
          await writeConfigProfile(gameId)
        } else {
          await writeConfigProfile(gameId)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

// 保存配置文件路径，用于切换配置
const writeConfigProfile = async (gameId) => {

  try {
    const gameName = await sanitizedFolderName(host, currentGameName.value)
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
  emit('chnage-setting-mode', 'quik')
}

// 读取该游戏默认配置文件
const readConfigProfile = async () => {
  const gameId = currentGameId.value
  const gameName = await sanitizedFolderName(host, currentGameName.value)
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
  console.log(`Load Quik mode configuration: ${profile}`)
  // 执行具体的 API 请求或逻辑处理
  const configurations = await readConfigProfile()
  if (profile) {
    const profileConfiguration = configurations.find((item) => item.name === profile)

    if (profileConfiguration) {
      console.log('profileConfiguration', profileConfiguration)
      const filePath = profileConfiguration.filePath
      const configurationFileName = profileConfiguration.fileName
      const configData = await configRead(host, filePath, configurationFileName)
      if (configData) {
        const res = JSON.parse(configData)
        if (res.result && res.data) {
          const currentGameQuikConfig = JSON.parse(res.data)
          selectedSetting.value = currentGameQuikConfig
          await applicationSettings(currentGameQuikConfig)
        }
      }
    }
  }
}

// 恢复默认配置
const restoreDefaultConfiguration = async () => {
  const gameId = currentGameId.value
  const folderPath = `${new_GatewayPath}/${profilePath}/${gameId}`
  const configurationFileName = 'Default.json'
  const data = await configRead(host, folderPath, configurationFileName)
  if (data) {
    const readResult = JSON.parse(data)
    if (readResult.result && readResult.data) {
      const currentGameQuikConfig = JSON.parse(readResult.data)
      await applicationSettings(currentGameQuikConfig)
    }
  }
}

const parseConfig = (config) => {
  if (typeof config === 'string') {
    try {
      return JSON.parse(config);
    } catch (e) {
      console.error("配置解析失败:", e);
      return {};
    }
  }
  return config;
};

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
    gameSetting.LeftHandedMode = controllerOptions.Quik.LeftHandedMode
    inputConfig.enableDoubleTriggerCalibration = controllerOptions.Quik.EnableBothTriggerCalibration
    katTreadMillConfig.speedMul = controllerOptions.Quik.WalkingSpeed
    katTreadMillConfig.ForwardMovementSensitivity = controllerOptions.Quik.WalkingAccuracy
    gameSetting.OrlginalTrackpad = controllerOptions.Quik.OrlginalTrackpad
    katTreadMillConfig.SmallActionMasking = controllerOptions.Quik.SensorSensitivity
    gameSetting.SprintMode = controllerOptions.Quik.SprintMode
    gameSetting.SprintThreshold = controllerOptions.Quik.SprintThreshold
    gameSetting.JumpMode = controllerOptions.Quik.JumpMode
    gameSetting.JumpThreshold = controllerOptions.Quik.JumpThreshold
    katTreadMillConfig.CruiseMode = controllerOptions.Quik.CruiseMode
    vehicleSetting.vehicleHubType = configs.Sitting.Quik.VehicleMode
    vehicleSetting.vehicleHubSpeed = configs.Sitting.Quik.VehicleSpeed
    vehicleSetting.vehicleRRSimulation = configs.Sitting.Quik.RRSimulation
    inputConfig.vibrateLevel = hapticOptions.Quik.HapticModuleByVRControllerLevel
    hapticsSetting.C2TriggerBySteps = hapticOptions.Quik.HapticModuleByWalkLevel
    gameSetting.Hand = configs.GlobalConfig.MappingController
    gameSetting.WalkTriggerSource = configs.GlobalConfig.ControlMethodTwo
    gameSetting.WalkSpeedType = configs.GlobalConfig.WalkSpeedType
    gameSetting.SprintSource = configs.GlobalConfig.SprintSource
    gameSetting.JumpSource = configs.GlobalConfig.JumpSource

    // HUD 相关设置
    const safeHudConfig = parseConfig(configs.HudConfig);
    const safeArmviewConfig = parseConfig(configs.ArmviewConfig);
    console.log('safeHudConfig', safeHudConfig)
    console.log('gameid', configs.ID)
    Object.assign(hudConfig, safeHudConfig);
    Object.assign(armviewConfig, safeArmviewConfig);

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

const handleQuikReset = async (currentProfile) => {
  console.log('handleQuikReset', currentProfile)
  await restoreDefaultConfiguration()
}

// 在默认配置文件上进行保存 
const handleQuikSave = async (currentProfile, fileName) => {
  try {
    // 保存配置文件
    const gameId = currentGameId.value

    const gameName = await sanitizedFolderName(host, currentGameName.value)
    const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}`
    const saveFileName = `${fileName}.json`

    const gameConfigInfo = await getGameConfig(gameId)
    if (gameConfigInfo) {
      const data = JSON.parse(JSON.stringify(gameConfigInfo))
      if (data) {
        const content = JSON.stringify(fileInfo)
        await configWrite(host, folderPath, saveFileName, content)
      }
    }

    const cfolderPath = `${new_GatewayPath}/${profilePath}/${gameName}/configuration`
    const cFileName = 'config_profile.json'
    // 更新配置文件
    const fileConfiguration = await configRead(host, cfolderPath, cFileName)
    let newConfiguration = []
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
    return newConfiguration
  } catch (error) {
    console.log(error)
  }
}

// 另存配置文件
const handleQuikNewSave = async (currentProfile, fileName) => {
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
      fileInfo.OtherControllerOptions.Quik.LeftHandedMode = gameSetting.LeftHandedMode
      fileInfo.OtherControllerOptions.Quik.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
      fileInfo.OtherControllerOptions.Quik.WalkingSpeed = katTreadMillConfig.speedMul
      fileInfo.OtherControllerOptions.Quik.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
      fileInfo.OtherControllerOptions.Quik.OrlginalTrackpad = gameSetting.OrlginalTrackpad
      fileInfo.OtherControllerOptions.Quik.SensorSensitivity = katTreadMillConfig.SmallActionMasking
      fileInfo.OtherControllerOptions.Quik.SprintMode = gameSetting.SprintMode
      fileInfo.OtherControllerOptions.Quik.SprintThreshold = gameSetting.SprintThreshold
      fileInfo.OtherControllerOptions.Quik.JumpMode = gameSetting.JumpMode
      fileInfo.OtherControllerOptions.Quik.JumpThreshold = gameSetting.JumpThreshold
      fileInfo.OtherControllerOptions.Quik.CruiseMode = katTreadMillConfig.CruiseMode
      fileInfo.Sitting.Quik.VehicleMode = vehicleSetting.vehicleHubType
      fileInfo.Sitting.Quik.VehicleSpeed = vehicleSetting.vehicleHubSpeed
      fileInfo.Sitting.Quik.RRSimulation = vehicleSetting.vehicleRRSimulation
      fileInfo.OtherHaptic.Quik.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
      fileInfo.OtherHaptic.Quik.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
      fileInfo.GlobalConfig.MappingController = gameSetting.Hand
      fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
      fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
      fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
      fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
    } else if ([4, 8, 9].includes(deviceType)) {
      fileInfo.C2ControllerOptions.Quik.LeftHandedMode = gameSetting.LeftHandedMode
      fileInfo.C2ControllerOptions.Quik.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
      fileInfo.C2ControllerOptions.Quik.WalkingSpeed = katTreadMillConfig.speedMul
      fileInfo.C2ControllerOptions.Quik.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
      fileInfo.C2ControllerOptions.Quik.OrlginalTrackpad = gameSetting.OrlginalTrackpad
      fileInfo.C2ControllerOptions.Quik.SensorSensitivity = katTreadMillConfig.SmallActionMasking
      fileInfo.C2ControllerOptions.Quik.SprintMode = gameSetting.SprintMode
      fileInfo.C2ControllerOptions.Quik.SprintThreshold = gameSetting.SprintThreshold
      fileInfo.C2ControllerOptions.Quik.JumpMode = gameSetting.JumpMode
      fileInfo.C2ControllerOptions.Quik.JumpThreshold = gameSetting.JumpThreshold
      fileInfo.C2ControllerOptions.Quik.CruiseMode = katTreadMillConfig.CruiseMode
      fileInfo.Sitting.Quik.VehicleMode = vehicleSetting.vehicleHubType
      fileInfo.Sitting.Quik.VehicleSpeed = vehicleSetting.vehicleHubSpeed
      fileInfo.Sitting.Quik.RRSimulation = vehicleSetting.vehicleRRSimulation
      fileInfo.HapticC2.Quik.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
      fileInfo.HapticC2.Quik.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
      fileInfo.GlobalConfig.MappingController = gameSetting.Hand
      fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
      fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
      fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
      fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
    } else if ([10].includes(deviceType)) {
      fileInfo.C3ControllerOptions.Quik.LeftHandedMode = gameSetting.LeftHandedMode
      fileInfo.C3ControllerOptions.Quik.EnableBothTriggerCalibration = inputConfig.enableDoubleTriggerCalibration
      fileInfo.C3ControllerOptions.Quik.WalkingSpeed = katTreadMillConfig.speedMul
      fileInfo.C3ControllerOptions.Quik.WalkingAccuracy = katTreadMillConfig.ForwardMovementSensitivity
      fileInfo.C3ControllerOptions.Quik.OrlginalTrackpad = gameSetting.OrlginalTrackpad
      fileInfo.C3ControllerOptions.Quik.SensorSensitivity = katTreadMillConfig.SmallActionMasking
      fileInfo.C3ControllerOptions.Quik.SprintMode = gameSetting.SprintMode
      fileInfo.C3ControllerOptions.Quik.SprintThreshold = gameSetting.SprintThreshold
      fileInfo.C3ControllerOptions.Quik.JumpMode = gameSetting.JumpMode
      fileInfo.C3ControllerOptions.Quik.JumpThreshold = gameSetting.JumpThreshold
      fileInfo.C3ControllerOptions.Quik.CruiseMode = katTreadMillConfig.CruiseMode
      fileInfo.Sitting.Quik.VehicleMode = vehicleSetting.vehicleHubType
      fileInfo.Sitting.Quik.VehicleSpeed = vehicleSetting.vehicleHubSpeed
      fileInfo.Sitting.Quik.RRSimulation = vehicleSetting.vehicleRRSimulation
      fileInfo.HapticC2.Quik.HapticModuleByVRControllerLevel = inputConfig.vibrateLevel
      fileInfo.HapticC2.Quik.HapticModuleByWalkLevel = hapticsSetting.C2TriggerBySteps
      fileInfo.GlobalConfig.MappingController = gameSetting.Hand
      fileInfo.GlobalConfig.ControlMethodTwo = gameSetting.WalkTriggerSource
      fileInfo.GlobalConfig.WalkSpeedType = gameSetting.WalkSpeedType
      fileInfo.GlobalConfig.SprintSource = gameSetting.SprintSource
      fileInfo.GlobalConfig.JumpSource = gameSetting.JumpSource
    }
  }

  const content = JSON.stringify(fileInfo)
  await configWrite(host, folderPath, saveFileName, content)

  // 写VR HUD 配置
  await saveVrHudConfiguration();

  // 写Armview配置
  await saveArmviewConfiguration();

  // 更新配置文件
  const gameName = await sanitizedFolderName(host, currentGameName.value)
  const cfolderPath = `${new_GatewayPath}/${profilePath}/${gameName}/configuration`
  const cFileName = 'config_profile.json'

  const fileConfiguration = await configRead(host, cfolderPath, cFileName)
  let newConfiguration = []
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
  return newConfiguration
}


const handleQuikImport = async (currentProfile) => {
  console.log(currentProfile)
  console.log('Quik子组件执行导入逻辑...')
}

const handleQuikDelete = async (currentProfile) => {
  console.log(currentProfile)
  console.log('Quik子组件执行删除逻辑...')
}
//保存文件 quik
const handleQuikUpdate = async (currentProfile) => {
  // console.log(currentProfile)
  // console.log('Quik子组件执行更新逻辑...')

  // // 保存配置文件
  // const gameId = currentGameId.value
  // const gameName = await sanitizedFolderName(host, currentGameName.value)
  // const folderPath = `${new_GatewayPath}/${profilePath}/${gameName}`
  // const saveFileName = `${currentProfile}.json`

  // const gameConfigInfo = await getGameConfig(gameId)
  // if (gameConfigInfo) {
  //   const data = JSON.parse(JSON.stringify(gameConfigInfo))
  //   if (data) {
  //     const content = JSON.stringify(fileInfo)
  //     await configWrite(host, folderPath, saveFileName, content)
  //   }
  //   return;
  // }
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

      // 设置值
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
    // const gameConfig = allGameLists.value.SteamGame.find(item => item.ID === gameId)
    // return gameConfig
  }
}

//根据gameid从gameConfigLists中找到对应的游戏配置（临时）
const getGameConfigLists = async (gameId, gameConfigLists) => {
  if (gameConfigLists) {
    if (gameId == '-1') { //Default
      return gameConfigLists.Default;
    } else {
      // Steam游戏
      const gameConfig = gameConfigLists.SteamGame.find(item => item.ID === gameId)
      if (gameConfig) {
        return gameConfigLists.SteamGame.find(item => item.ID === gameId);
      } else { //自定义游戏
        const gameConfig = gameConfigLists.CustomGame.find(item => item.ID == gameId)
        if (gameConfig) {
          return gameConfigLists.CustomGame.find(item => item.ID == gameId);
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

const changeDominantHand = async (val) => {
  console.log('changeDominantHand', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.LeftHandedMode = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.LeftHandedMode = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.LeftHandedMode = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await await getGameConfigLists(gameId, gameConfigLists)
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
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.EnableBothTriggerCalibration = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.EnableBothTriggerCalibration = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.EnableBothTriggerCalibration = val
    }
  }

  // 更新配置文件
  if (allGameLists.value) {
    const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
    let gameConfig = await await getGameConfigLists(gameId, gameConfigLists)
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
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.WalkingSpeed = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.WalkingSpeed = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.WalkingSpeed = val
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

const changeAccuracy = async (val) => {
  console.log('changeAccuracy', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.WalkingAccuracy = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.WalkingAccuracy = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.WalkingAccuracy = val
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

const changeOriginalController = async (val) => {
  console.log('changeOriginalController', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.OrlginalTrackpad = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.OrlginalTrackpad = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.OrlginalTrackpad = val
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

const changeUnintentionalMovement = async (val) => {
  console.log('changeUnintentionalMovement', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.SensorSensitivity = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.SensorSensitivity = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.SensorSensitivity = val
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
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.SprintThreshold = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.SprintThreshold = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.SprintThreshold = val
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
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.JumpThreshold = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.JumpThreshold = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.JumpThreshold = val
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

const changeCruiseMode = async (val) => {
  console.log('changeCruiseMode', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.CruiseMode = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.CruiseMode = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.CruiseMode = val
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

const changeVehicleHubType = async (val) => {
  console.log('changeVehicleHubType', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.VehicleMode = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.VehicleMode = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.VehicleMode = val
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
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.VehicleSpeed = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.VehicleSpeed = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.VehicleSpeed = val
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

const changeRRSimulation = async (val) => {
  console.log('changeRRSimulation', val)
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  const newGameConfig = JSON.parse(JSON.stringify(gameConfigInfo))
  const deviceInfo = currentDevice.value

  if ([2, 3].includes(deviceInfo.deviceType)) {
    if (newGameConfig.OtherControllerOptions && newGameConfig.OtherControllerOptions.Quik) {
      newGameConfig.OtherControllerOptions.Quik.RRSimulation = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C2ControllerOptions && newGameConfig.C2ControllerOptions.Quik) {
      newGameConfig.C2ControllerOptions.Quik.RRSimulation = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.C3ControllerOptions && newGameConfig.C3ControllerOptions.Quik) {
      newGameConfig.C3ControllerOptions.Quik.RRSimulation = val
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
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Quik) {
      newGameConfig.OtherHaptic.Quik.HapticModuleByVRControllerLevel = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Quik) {
      newGameConfig.HapticC2.Quik.HapticModuleByVRControllerLevel = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Quik) {
      newGameConfig.HapticC2.Quik.HapticModuleByVRControllerLevel = val
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
    if (newGameConfig.OtherHaptic && newGameConfig.OtherHaptic.Quik) {
      newGameConfig.OtherHaptic.Quik.HapticModuleByWalkLevel = val
    }
  } else if ([4, 8, 9].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Quik) {
      newGameConfig.HapticC2.Quik.HapticModuleByWalkLevel = val
    }
  } else if ([10].includes(deviceInfo.deviceType)) {
    if (newGameConfig.HapticC2 && newGameConfig.HapticC2.Quik) {
      newGameConfig.HapticC2.Quik.HapticModuleByWalkLevel = val
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

const changeHand = async (val) => {
  console.log('changeHand', val)
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

const changeHudDistance = async (val) => {
  console.log('changeHudDistance', val)
  await updateGameVrHudConfig()
}

// 更新HUD配置
const updateGameVrHudConfig = async () => {

  const gameId = currentGameId.value

  await updateGameHudConfig(host, gameId, hudConfig)
}

// 更新Armview配置
const updateGameVrArmviewConfig = async () => {

  const gameId = currentGameId.value

  await updateGameArmviewConfig(host, gameId, armviewConfig)
}

//将当前游戏的hud Distance 参数应用到游戏中
const VrhudApplyToDistance = async () => {
  const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)

  // 深拷贝 gameConfigInfo.hud 以防止后续修改影响所有对象
  const newHud = JSON.parse(JSON.stringify(gameConfigInfo.HudConfig));
  // 遍历并更新每个对象的 arm 属性
  if (gameConfigLists.SteamGame && newHud) {

    gameConfigLists.SteamGame.forEach(element => {

      element.HudConfig.hudDistanceZ = newHud.hudDistanceZ
    });
  }
  if (gameConfigLists.CustomGame && newHud) {

    gameConfigLists.CustomGame.forEach(element => {

      element.HudConfig.hudDistanceZ = newHud.hudDistanceZ
    });
  }
  if (gameConfigLists.Default && newHud) {

    gameConfigLists.Default.HudConfig.hudDistanceZ = newHud.hudDistanceZ
  }
  // 更新整个全局游戏配置列表
  await store.dispatch('game/persistGlobalGameConfigs', {
    host,
    gameConfigLists
  })
}


//将当前游戏的hud除 Distance以外的参数应用到游戏中
const VrhudApplyToAll = async () => {
  const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)

  // 深拷贝 gameConfigInfo.hud 以防止后续修改影响所有对象
  const newHud = JSON.parse(JSON.stringify(gameConfigInfo.HudConfig));
  // 遍历并更新每个对象的 arm 属性
  if (gameConfigLists.SteamGame && newHud) {

    gameConfigLists.SteamGame.forEach(element => {
      newHud.hudDistanceZ = element.HudConfig.hudDistanceZ
      element.HudConfig = newHud
    });
  }
  if (gameConfigLists.CustomGame && newHud) {

    gameConfigLists.CustomGame.forEach(element => {
      newHud.hudDistanceZ = element.HudConfig.hudDistanceZ
      element.HudConfig = newHud
    });
  }
  if (gameConfigLists.Default && newHud) {
    newHud.hudDistanceZ = gameConfigLists.Default.HudConfig.hudDistanceZ
    gameConfigLists.Default.HudConfig = newHud
  }
  // 更新整个全局游戏配置列表
  await store.dispatch('game/persistGlobalGameConfigs', {
    host,
    gameConfigLists
  })
}


defineExpose({
  handleQuikReset,
  handleQuikSave,
  handleQuikNewSave,
  handleQuikImport,
  handleQuikDelete,
  handleQuikUpdate,
  loadProfileData
})

// 更新 HUD 各元素X、Y位置
function UpdateHudPosition ({ key, x, y }) {

  const xKey = `${key}X`
  const yKey = `${key}Y`
  if (xKey in hudConfig) hudConfig[xKey] = x
  if (yKey in hudConfig) hudConfig[yKey] = y
  console.log('更新hud---------------')
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

    const rawData = JSON.parse(JSON.stringify(newVal));

    // 并行执行两个更新操作
    await Promise.all([
      updateGameHudConfig(host, currentGameId.value, rawData),
      setKatVrHudConfig(rawData)
    ]);

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


//将当前游戏的arm参数应用到游戏中
const ArmApplyToAll = async () => {
  const gameConfigLists = JSON.parse(JSON.stringify(allGameLists.value))
  const gameId = currentGameId.value
  const gameConfigInfo = await getGameConfig(gameId)
  // 深拷贝 gameConfigInfo.arm 以防止后续修改影响所有对象
  const newArm = JSON.parse(JSON.stringify(gameConfigInfo.ArmviewConfig));
  // 遍历并更新每个对象的 arm 属性
  if (gameConfigLists.SteamGame && newArm) {
    gameConfigLists.SteamGame.forEach(element => {
      element.ArmviewConfig = newArm
    });
  }
  if (gameConfigLists.CustomGame && newArm) {
    gameConfigLists.CustomGame.forEach(element => {
      element.ArmviewConfig = newArm
    });
  }
  if (gameConfigLists.Default && newArm) {
    gameConfigLists.Default.ArmviewConfig = newArm

  }
  // 更新整个全局游戏配置列表
  await store.dispatch('game/persistGlobalGameConfigs', {
    host,
    gameConfigLists
  })
}


const debouncedSaveHud = debounce(persistHudConfig, 1);
const debouncedSaveArmview = debounce(persistArmviewConfig, 1);

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
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  katTrackerConfig,
  async (newValue, oldValue) => {
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  inputConfig,
  async (newValue, oldValue) => {
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  vehicleSetting,
  async (newValue, oldValue) => {
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  hapticsSetting,
  async (newValue, oldValue) => {
    await settingIsChanged()
  },
  { deep: true }
)

watch(
  gameSetting,
  async (newValue, oldValue) => {
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

//监听hud配置的变化，进行保存
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

    debouncedSaveArmview(raw);
  }, 300),
  { deep: true }
)

onMounted(async () => {
  // console.log('DOM 挂载后执行')
  // await findGameConfig()

  // requestAnimationFrame(() => {
  //   console.log(quickConfiguration.value)
  //   if (quickConfiguration.value) {
  //     onModeChange('quik')
  //   } else {
  //     onModeChange('advanced')
  //   }
  // })

  // await checkDefaultQuikConfig()
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

  // await checkDefaultQuikConfig()
  await setKatVrHudConfig(hudConfig)
  await setKatVrArmviewConfig(armviewConfig)
  console.log('DOM 挂载前执行')
  // 此时无法获取到真实 DOM 元素
})
</script>

<style lang="scss" scoped>
.quik-setup-container {
  min-height: 400px;
}

.is-disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

.preference-setting-container {
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  >div :deep(.el-row) {
    margin-bottom: 10px;

    >div {
      margin-bottom: 10px;
    }
  }

  .preference-row {
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

.panel-tab {
  display: flex;
  align-items: baseline;
  gap: 20px;
}

.panel-tab-nav {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-direction: row;
  padding: 5px 16px;
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

.panel-tips {
  font-size: var(--footnote-font-size);
  color: #AAAAAA;
  // margin-bottom: 10px;
}

.panel-setup {
  :deep(.el-select__wrapper) {
    font-size: 12px;
  }
}

.tab-main-content {
  padding: 5px 16px;
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

  p {
    color: #fcaf1b;
  }
}

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-content .second-describe {
  display: flex;
  flex-direction: row;
  gap: 5px;
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

.tab-main-content .tab-panel .game-config-describe .config-item .config-item-text p {
  margin: 0;
  font-size: 16px;
  text-align: left;
}

.tab-main-content .tab-panel .game-config-thumbnails .osc-setting {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  justify-content: flex-start;
}

.tab-main-content .tab-panel .game-config-thumbnails .osc-setting img {
  max-width: 500px;
  height: auto;
  margin-top: 10px;
}

.tab-main-content .tab-panel .game-config-thumbnails .osc-setting-text {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  justify-content: flex-start;
}

.tab-main-content .tab-panel .game-config-thumbnails .osc-setting-text p {
  text-align: left;
}

.segmented-control {
  display: flex;
  background: #f0f2f5;
  padding: 3px;
  border-radius: 6px;

  button {
    border: none;
    padding: 6px 20px;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
    color: #666;

    &.active {
      background: #3498db;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}

// :deep(.control-setting-panel .el-row) {
//   margin: 0 !important;
//   align-items: center;
// }

// :deep(.walking-setting-panel .el-row) {
//   margin: 0 !important;
//   align-items: center;
// }

// :deep(.actions-setting-panel .el-row) {
//   margin: 0 !important;
//   align-items: center;
// }

// :deep(.vehicle-hub-setting-panel .el-row) {
//   margin: 0 !important;
//   align-items: center;
// }

// :deep(.haptics-setting-panel .el-row) {
//   margin: 0 !important;
//   align-items: center;
// }

// :deep(.controller-mapping-setting-panel .el-row) {
//   margin: 0 !important;
//   align-items: center;
// }

// :deep(.preference-setting-container .el-row) {
//   margin: 0 !important;
//   row-gap: 10px;
// }

.control-setting-property {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.control-setting-property .control-setting-property-key {
  // flex: 2;
  display: flex;
  justify-content: flex-start;
}

.preference-col-label {
  font-size: var(--body-font-size);
  color: var(--text-color);
  text-align: left;
  width: 140px;
  padding-right: 10px;
}

.control-setting-property .control-setting-property-value {
  flex: 3;
  display: flex;
  justify-content: flex-start;
}

.control-setting-property span {
  font-size: 14px;
  font-weight: normal;
  line-height: 17px;
  letter-spacing: 0px;
  color: var(--text-color)
}

.walking-setting-property {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.walking-setting-property .walking-setting-property-key {
  // flex: 4;
  display: flex;
  justify-content: flex-start;
}

.walking-setting-property .walking-setting-property-value {
  flex: 6;
  display: flex;
  justify-content: flex-start;
}

.walking-setting-property span {
  font-size: 14px;
  font-weight: normal;
  line-height: 17px;
  letter-spacing: 0px;
  color: var(--text-color);
}

.walking-setting-last-property {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
}

.walking-setting-last-property .walking-setting-last-property-key {
  // flex: 4;
  display: flex;
  justify-content: flex-start;
}

.walking-setting-last-property .walking-setting-last-property-value {
  flex: 6;
  display: flex;
  justify-content: flex-start;
}

.walking-setting-last-property span {
  font-size: 14px;
  font-weight: normal;
  line-height: 17px;
  letter-spacing: 0px;
  color: var(--text-color);
}

.actions-setting-property {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.actions-setting-property .actions-setting-property-key {
  // flex: 4;
  display: flex;
  justify-content: flex-start;
}

.actions-setting-property .actions-setting-property-value {
  flex: 6;
  display: flex;
  justify-content: flex-start;
}

.actions-setting-property span {
  font-size: 14px;
  font-weight: normal;
  line-height: 17px;
  letter-spacing: 0px;
  color: var(--text-color)
}

.vehicle-hub-setting-property {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.vehicle-hub-setting-property .vehicle-hub-setting-property-key {
  // flex: 2;
  display: flex;
  justify-content: flex-start;
}

.vehicle-hub-setting-property .vehicle-hub-setting-property-value {
  flex: 6;
  display: flex;
  justify-content: flex-start;
}

// .vehicle-hub-setting-property span {
//   font-size: 14px;
//   font-weight: normal;
//   line-height: 17px;
//   letter-spacing: 0px;
//   color: #767676;
// }

.haptics-setting-property {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.haptics-setting-property .haptics-setting-property-key {
  display: flex;
  justify-content: flex-start;
}

.haptics-setting-property .haptics-setting-property-value {
  display: flex;
  justify-content: flex-start;
}

// .haptics-setting-property span {
//   font-size: 14px;
//   font-weight: normal;
//   line-height: 17px;
//   letter-spacing: 0px;
//   color: #767676;
// }

.mapping-setting-property {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

// .mapping-setting-property span {
//   font-size: 14px;
//   font-weight: normal;
//   line-height: 17px;
//   letter-spacing: 0px;
//   color: #767676;
// }

.mapping-setting-property .mapping-setting-property-key {
  // flex: 1;
  display: flex;
  justify-content: flex-start;
}

.mapping-setting-property .mapping-setting-property-value {
  flex: 6;
  display: flex;
  justify-content: flex-start;
}

:deep(.el-divider--horizontal) {
  margin: 0;
  border-top: 1px solid var(--divider-color);
}

.setting-title {
  :deep(.el-divider__text) {
    padding: 2px 10px 2px 0;
    font-size: var(--title-font-size);
    color: var(--title-color);
    left: 0;
    background: var(--main-bg-color);
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
      color: var(--brand-color);
    }

    .global-settings-property {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 5px;

      .el-button {
        padding: 2px 8px;
        background: #4096ff;
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
}
</style>
