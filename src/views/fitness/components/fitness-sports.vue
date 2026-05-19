<template>
  <el-row :gutter="20">

    <el-col :span="6">
      <el-card class="data-card">
        <div class="fs-value">
          <div>
            <el-statistic :value="stepsVal" />
          </div>
          <div class="fs-label-icon">
            <img src="@/assets/icons/walking_big.webp" class="fs-icon" />
          </div>
        </div>
        <div class="fs-label">Walking</div>
      </el-card>
    </el-col>

     <el-col :span="6">
      <el-card class="data-card">
        <div class="fs-value">
          <div>
            <el-statistic :value="durationVal" :precision="2" />
            <span class="unit">KM</span>
          </div>
          <div class="fs-label-icon">
            <img src="@/assets/icons/mileage_big.webp" class="fs-icon" />
          </div>
        </div>
        <div class="fs-label">Mileage</div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card class="data-card">
        <div class="fs-value">
          <div>
            <el-statistic :value="caloriesVal" />
            <span class="unit">Kcal</span>
          </div>
          <div class="fs-label-icon">
            <img src="@/assets/icons/consume_big.webp" class="fs-icon" />
          </div>
        </div>
        <div class="fs-label">Consume</div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card class="data-card">
        <div class="fs-value">
          <div>
            <el-statistic :value="timesVal" :precision="2" />
            <span class="unit">hrs</span>
          </div>
          <div class="fs-label-icon">
            <img src="@/assets/icons/active_time_big.webp" class="fs-icon" />
          </div>
        </div>
        <div class="fs-label">Active Time</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="js" setup>
import { ref, reactive, computed, watch } from 'vue'
import { useTransition } from '@vueuse/core'
import { useStore } from 'vuex'

const props = defineProps({
  taskData: {
    type: Object,
    default: () => ({})
  }
})

const stepsInit = ref(0)
const stepsVal = useTransition(stepsInit, {
  duration: 100
})

const durationInit = ref(0.0)
const durationVal = useTransition(durationInit, {
  duration: 100
})

const caloriesInit = ref(0)
const caloriesVal = useTransition(caloriesInit, {
  duration: 100
})

const timesInit = ref(0.0)
const timesVal = useTransition(timesInit, {
  duration: 100
})

watch(() => props.taskData, (newVal) => {
  stepsInit.value = newVal.totalSteps || 0
  durationInit.value = newVal.kilometers || 0
  caloriesInit.value = newVal.calories || 0
  timesInit.value = newVal.hours || 0.0
}, { immediate: true, deep: true })


// const store = useStore()

// const fitnessDatas = computed(() => store.state.user.fitnessDatas);
// console.log('fitnessDatas.value:', fitnessDatas.value);

// watch(fitnessDatas, (newVal, oldVal) => {
//   console.log('fitnessDatas 变化了:', newVal, '旧值:', oldVal, '时间:', new Date().toLocaleTimeString());
// }, { immediate: true });

// const sumFields = (list, keys) => {
//   if (!Array.isArray(list)) return {};

//   return list.reduce((acc, curr) => {
//     keys.forEach(key => {
//       const val = parseFloat(curr[key]) || 0;
//       acc[key] = (acc[key] || 0) + val;
//     });
//     return acc;
//   }, {});
// };

// const totals = computed(() => {
//   const keys = ['calories', 'hours', 'kilometers', 'totalSteps'];
//   return sumFields(fitnessDatas.value, keys);
// });

// import { Steps, Location, Fire, Clock, HomeFilled } from '@element-plus/icons-vue'
// const sportsData = ref({
//   steps: 50004,
//   duration: 40.61,
//   calories: 1857,
//   times: 5.6
// })





// // 更新值
// const changeVal = () => {
//   sportsData.value.steps = 100000
//   stepsInit.value = sportsData.value.steps
// }

// watch(() => totals.value.totalSteps, (newVal) => {
//   stepsInit.value = newVal || 0
// }, { immediate: true })

// defineExpose({ changeVal })
</script>
<style lang="scss" scoped>
.data-card {
  background-color: var(--nav-bg-color);
  color: #fff;
  border-radius: 12px;
  border: none;
  //   text-align: center;
  //   padding: 8px 0;
}

.data-card :deep(.el-statistic__content) {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: left;
}

.data-card :deep(.el-card__body) {
  padding: 10px;
}

.data-card :deep(.el-statistic) {
  display: inline-block;
}

.data-card:hover {
  transform: translateY(-4px);
}

.fs-value {
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fs-label {
  font-size: 12px;
  color: var(--text-color);
  // opacity: 0.9;
  text-align: left;
}

.fs-label-icon {
  width: 36px;
  height: 36px;
  // background: #0958d9;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  .fs-icon {
    width: 36px;
    height: 36px;
  }
}

.unit {
  font-size: 14px;
  margin-left: 4px;
  opacity: 0.9;
  font-weight: 400;
}

.data-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
}
</style>
