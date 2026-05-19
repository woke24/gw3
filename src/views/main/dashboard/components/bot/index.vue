<template>
  <div class="device-container">
    <h2>{{ $t('message.bot.title') }}</h2>
    <div class="robot-dashboard">
      <div class="robot-bg" :style="{ backgroundImage: `url(${robotBg})` }"></div>
      <div class="grids">
        <div class="grid" ref="grid1">
          <div class="cross center-x"></div>
          <div class="cross center-y"></div>
          <div class="dot"
            :style="{ transform: `translate(${leftFooterPosition.x - 5}px, ${leftFooterPosition.y - 5}px)` }">
          </div>
        </div>
        <div class="grid" ref="grid2">
          <div class="cross center-x"></div>
          <div class="cross center-y"></div>
          <div class="dot"
            :style="{ transform: `translate(${rightFooterPosition.x - 5}px, ${rightFooterPosition.y - 5}px)` }">
          </div>
        </div>
      </div>
      <div class="headset">
        <span>{{ headsetAngle }}°</span>
      </div>
      <div class="waist">
        <span>{{ bodyAngle }}°</span>
      </div>
      <div class="heart">
        <span>{{ heartRate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from "vue-router";

import robotBg from '@/assets/images/robot.png'

// Vuex 缓存
const store = useStore();
const NAMESPACE = 'device';

// 响应式获取 Vuex 实时数据
const headsetAngle = computed(() => store.getters[`${NAMESPACE}/getHeadsetAngle`])
const bodyAngle = computed(() => store.getters[`${NAMESPACE}/getBodyAngle`])
const heartRate = computed(() => store.getters[`${NAMESPACE}/getHeartRate`])

// 左脚坐标数据
const leftFooterPosition = computed(() => store.getters[`${NAMESPACE}/getLeftFooterPosition`])
// 右脚坐标数据
const rightFooterPosition = computed(() => store.getters[`${NAMESPACE}/getRightFooterPosition`])

const grid1 = ref(null)
const grid2 = ref(null)

onBeforeUnmount(() => {
})

// watch([leftFooterPosition, rightFooterPosition], ([newLeftPos, newRightPos], [oldLeftPos, oldRightPos]) => {

//   // 检查 leftFooterPosition 是否变化
//   if (newLeftPos !== oldLeftPos) {
//     console.log(`leftFooterPosition 变动：从 ${JSON.stringify(oldLeftPos)} 变为 ${JSON.stringify(newLeftPos)}`);
//   }

//   // 检查 rightFooterPosition 是否变化
//   if (newRightPos !== oldRightPos) {
//     console.log(`rightFooterPosition 变动：从 ${JSON.stringify(oldRightPos)} 变为 ${JSON.stringify(newRightPos)}`);
//   }
// });

</script>

<style lang="scss" scoped>
.device-container h2 {
  color: #409eff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 24px;
  margin-bottom: 24px;
  text-align: left;
}

.device-container .robot-dashboard {
  position: relative;
  min-width: 300px;
  min-height: 490px;
  background-color: #e0eaff;
  border-radius: 12px;
  overflow: hidden;

  .robot-bg {
    position: absolute;
    inset: 0;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    opacity: 1;
  }
}

.robot-dashboard .headset {
  position: absolute;
  top: 5%;
  left: 8%;
  display: flex;
  flex-direction: column;
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  color: var(--brand-color);
  z-index: 2;
}

.robot-dashboard .waist {
  position: absolute;
  top: 22%;
  left: 9%;
  display: flex;
  flex-direction: column;
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  color: var(--brand-color);
  z-index: 2;
}

.robot-dashboard .heart {
  position: absolute;
  top: 22%;
  right: 3%;
  display: flex;
  flex-direction: column;
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  color: #cf1322;
  z-index: 2;
}

/* 左下方坐标格 */
.device-container .grids {
  position: absolute;
  bottom: 106px;
  left: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2;
}

.device-container .grid {
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #6197ff;
  background-image: repeating-linear-gradient(to right, #6197ff 0, #6197ff 1px, transparent 1px, transparent 20px),
    repeating-linear-gradient(to bottom, #6197ff 0, #6197ff 1px, transparent 1px, transparent 20px);
  background-size: 20px 20px;
  border-radius: 4px;
  box-shadow: inset 0 0 6px rgba(100, 150, 255, 0.2);
}

.device-container .grid:last-child {
  margin-top: 7px;
}

/* 中心十字线 */
.device-container .cross {
  position: absolute;
  background-color: #8ab3ff;
  opacity: 0.6;
}

.device-container .center-x {
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
}

.device-container .center-y {
  left: 50%;
  top: 0;
  height: 100%;
  width: 2px;
  transform: translateX(-50%);
}

/* 拖拽点 */
.device-container .dot {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #1e6eff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 50ms linear;

  &:active {
    background-color: #66b1ff;
    cursor: grabbing;
  }
}
</style>
