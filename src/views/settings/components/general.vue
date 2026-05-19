<template>
  <div class="settings-container">
    
    <el-card class="settings-card" shadow="hover">
      <div class="setting-item">
        <div class="setting-label">
          <SvgIcon name="HandMode" height="20px" width="20px" />
          <span>Left handed mode</span>
        </div>
        <el-switch v-model="settings.leftHandedMode" />
      </div>
    </el-card>

    <el-card class="settings-card" shadow="hover">
      <div class="setting-item">
        <div class="setting-label">
          <SvgIcon name="language" height="20px" width="20px" />
          <span>Language</span>
        </div>
        <el-select v-model="settings.language" class="select dark-select">
          <el-option label="English" value="en" />
          <el-option label="Deutsch" value="de" />
          <el-option label="日語" value="ja" />
        </el-select>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <SvgIcon name="DateFormat" height="20px" width="20px" />
          <span>Date format</span>
        </div>
        <el-select v-model="settings.dateFormat" class="select dark-select">
          <el-option label="yyyy-mm-dd" value="yyyy-mm-dd" />
          <el-option label="mm-dd-yyyy" value="mm-dd-yyyy" />
          <el-option label="dd-mm-yyyy" value="dd-mm-yyyy" />
        </el-select>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <SvgIcon name="TimeFormat" height="20px" width="20px" />
          <span>Time format</span>
        </div>
        <el-select v-model="settings.timeFormat" class="select dark-select">
          <el-option label="AM/PM" value="12h" />
          <el-option label="HH:MM" value="24h" />
        </el-select>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <SvgIcon name="UnitSystem" height="20px" width="20px" />
          <span>Unit system</span>
        </div>
        <el-select v-model="settings.unitSystem" class="select dark-select">
          <el-option label="Imperial units" value="imperial" />
          <el-option label="Metric units" value="metric" />
        </el-select>
      </div>
    </el-card>

    <el-card class="settings-card" shadow="hover">
      <div class="setting-item">
        <div class="setting-label">
          <SvgIcon name="OnBoot" height="20px" width="20px" />
          <span>Start on boot</span>
        </div>
        <el-switch v-model="settings.startOnBoot" />
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <SvgIcon name="OnConnect" height="20px" width="20px" />
          <span>Start on connect</span>
        </div>
        <el-switch v-model="settings.startOnConnect" />
      </div>
    </el-card>

    <!-- 恢复默认按钮 -->
    <el-button
      type="default"
      class="restore-btn"
      @click="restoreSettings"
    >
      <SvgIcon name="RestoreAll" height="20px" width="20px" />
      <span style="margin-left: 8px;">Restore all settings</span>
    </el-button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 默认配置
const defaultSettings = {
  leftHandedMode: true,
  language: 'en',
  dateFormat: 'yyyy-mm-dd',
  timeFormat: '12h',
  unitSystem: 'imperial',
  startOnBoot: true,
  startOnConnect: true
}

// 当前配置
const settings = reactive({ ...defaultSettings })

// 恢复默认设置
const restoreSettings = () => {
  Object.assign(settings, defaultSettings)
  ElMessage.success('Settings restored to default')
}
</script>

<style scoped>
.settings-container {
  /* padding: 20px; */
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: var(--text-color);
  .settings-card {
    border-radius: 8px;
    border: 1px solid rgba(103, 112, 123, 0.3);
    color: var(--text-color);
    --el-card-bg-color: rgba(103, 112, 123, 0.3);
  }
  :deep(.el-card__body) {
    padding: 0 20px;
    background: var(--nav-bg-color);
  }
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
  }
  :deep(.el-switch.is-checked .el-switch__core) {
    background-color: var(--brand-color);
    border-color: var(--brand-color);
  }
}


.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.select {
  width: 150px;
}

.restore-btn {
  width: 100%;
  max-width: 1000px;
  padding: 18px;
  border-radius: 8px;
  margin: 0 auto;
  background: var(--nav-bg-color);
  color: var(--text-color);
  border: 1px solid rgba(103, 112, 123, 0.3);
}
</style>