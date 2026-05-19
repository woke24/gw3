<template>
  <div class="today-fitness">
    <h2>Today's Fitness</h2>

    <el-row :gutter="20">
      <el-col :span="6">
        <div class="stat-box blue-1">
          <div class="stat-value">66,152</div>
          <div class="stat-icon-wrapper">
            <el-icon :size="24"><DArrowRight /></el-icon>
          </div>
          <div class="stat-label">Walking</div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="stat-box blue-2">
          <div class="stat-value">40.61<span class="unit"> KM</span></div>
          <div class="stat-icon-wrapper">
            <el-icon :size="24"><LocationInformation /></el-icon>
          </div>
          <div class="stat-label">Mileage</div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="stat-box blue-3">
          <div class="stat-value">1856<span class="unit"> Kcal</span></div>
          <div class="stat-icon-wrapper">
            <el-icon :size="24"><GobletSquareFull /></el-icon>
          </div>
          <div class="stat-label">Consume</div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="stat-box blue-4">
          <div class="stat-value">5.6<span class="unit"> hrs</span></div>
          <div class="stat-icon-wrapper">
            <el-icon :size="24"><Timer /></el-icon>
          </div>
          <div class="stat-label">Active Time</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ElIcon } from 'element-plus'
import { DArrowRight, LocationInformation, GobletSquareFull, Timer } from '@element-plus/icons-vue'
</script>

<style scoped>
/* 标题样式 */
.today-fitness h2 {
  color: #409eff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 24px;
  text-align: left;
}

.stat-box {
  background-color: #409eff;
  color: #fff;
  border-radius: 12px;
  padding: 0 12px;
  height: 80px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  order: 1;
  width: 70%;
}

.stat-value .unit {
  font-size: 16px;
  font-weight: normal;
  margin-left: 2px;
}

.stat-label {
  font-size: 14px;
  opacity: 1;
  margin-top: 5px;
  order: 3;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 0 18px;
}

.stat-icon-wrapper {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  order: 2;
  align-self: flex-end;
  margin-left: auto;
}

.stat-icon-wrapper .el-icon {
  color: #fff;
}

.el-row {
  align-items: stretch;
}

.blue-1 {
  background-color: #409eff;
}
/* .blue-2 { background-color: #388ae8; } */
/* .blue-3 { background-color: #2e7bd3; } */
/* .blue-4 { background-color: #216ac2; } */
</style>
