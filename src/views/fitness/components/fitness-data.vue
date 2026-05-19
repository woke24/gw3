<template>
  <div class="fitness-data-container">
    <div>
      <div class="chart-div-title">Fitness Data</div>
    </div>
    <div class="fitness-data-controller">
      <div class="chart-div-date">
        <el-select class="dark-select" v-model="fitnessDate" placeholder="Select" style="width: 100px" @change="changeDate">
          <el-option v-for="item in fitnessDateOpt" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div>
        <el-select class="dark-select" v-model="fitnessType" placeholder="Select" style="width: 120px" @change="changeType">
          <el-option v-for="item in fitnessTypeOpt" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="fd-controller-icon">
        <el-icon @click="prevRange" :size="21" style="cursor: pointer;">
          <ArrowLeft />
        </el-icon>
        <el-icon @click="nextRange" :size="21" :style="{ cursor: offset < 0 ? 'pointer' : 'not-allowed'}">
          <ArrowRight />
        </el-icon>
      </div>
    </div>
  </div>
  <div v-if="originalYdata.length">
    <chart ref="chartRef" :height="'400px'" :options="chartOption" :allow-click="allowClick" @chart-click="handleChartClick" />
  </div>
  <div v-else  class="no-data">
    <span>No Data</span>
  </div>
  
</template>

<script lang="js" setup>
import { onMounted, onActivated, computed, ref, reactive, watch, getCurrentInstance, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import chart from '@/components/chartsEc/index.vue'
import { useStore } from 'vuex'
import { fitnessRankingList } from '@/api/fitness.js'
import { getTimeZone } from '@/utils/system'

const store = useStore()

const allowClick = ref(true); // 用来控制echart 是否可点击
const activeIndex = ref(-1); // 用来控制echart 高亮
const emits = defineEmits(['sendData'])

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

// 获取当天数据
const NAMESPACE = 'device'
const dailySteps = computed(() => store.getters[`${NAMESPACE}/getDailySteps`])
const todaySteps = ref({})

const fitnessDate = ref(2)
const fitnessDateOpt = [
  {
    value: 1,
    label: 'Year'
  },
  {
    value: 2,
    label: 'Month'
  },
  {
    value: 3,
    label: 'Week'
  }
]

const fitnessType = ref('totalSteps')
const fitnessTypeOpt = [
  {
    value: 'totalSteps',
    label: 'Walking'
  },
  {
    value: 'kilometers',
    label: 'Mileage'
  },
  {
    value: 'calories',
    label: 'Consume'
  },
  {
    value: 'hours',
    label: 'Sports Time'
  }
]

// 日期范围处理
const getToday = () => {
  const date = new Date()
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const today = ref(getToday());
const offset = ref(0); // 偏移量，用于控制日期范围
const prevRange = () => {
  offset.value--;
  activeIndex.value = -1; // 日期范围更改时，重置高亮为最后一个柱子
  getList();
}
const nextRange = () => {
  if (offset.value >= 0) return;
  offset.value++;
  activeIndex.value = -1;
  getList();
}

const currentRange = computed(() => {
  switch (fitnessDate.value) {
    case 1: return getYearRange(today.value, offset.value);
    case 2: return getMonthRange(today.value, offset.value);
    case 3: return getWeekRange(today.value, offset.value);
    default: return { start: today.value, end: today.value };
  }
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
// 周
function getWeekRange(dateStr, offset) {
  const base = new Date(dateStr);
  // 获取今天是本周的第几天(0-6, 0是周日)
  const dayOfWeek = base.getDay();
  // 计算本周的周一（如果今天是周日，则周一在6天前；否则周一在(dayOfWeek-1)天前）
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  // 计算本周的周日（如果今天是周日，则是今天；否则周日在(6-(dayOfWeek-1))天后）
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  
  // 应用偏移量（offset=0本周，offset=-1上周，offset=1下周）
  const start = new Date(base);
  start.setDate(base.getDate() - daysToMonday + offset * 7);
  
  const end = new Date(base);
  end.setDate(base.getDate() + daysToSunday + offset * 7);
  return { start: formatDate(start), end: formatDate(end) };
}
// 月
function getMonthRange(dateStr, offset) {
  const base = new Date(dateStr);
  base.setMonth(base.getMonth() + offset);
  const y = base.getFullYear();
  const m = base.getMonth();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);
  return { start: formatDate(start), end: formatDate(end) };
}

// 年
function getYearRange(dateStr, offset) {
  const base = new Date(dateStr);
  base.setFullYear(base.getFullYear() + offset);
  const y = base.getFullYear();
  const start = new Date(y, 0, 1);
  const end = new Date(y, 11, 31);
  return { start: formatDate(start), end: formatDate(end) };
}

const changeDate = () => {
  offset.value = 0;
  activeIndex.value = -1;
  getList();
}

const changeType = () => {
  getList()
}

const originalYdata = ref([])

let finalData = reactive([])
// 获取排行榜数据
const getList = async () => {
  // fitness_type: fitnessType.value,
  const timeZone = await getTimeZone(host)
  const msg = {
    condition: fitnessDate.value,
    userId: store.state.user.info.userId,
    timeZone: timeZone
  }
  const res = await fitnessRankingList(msg)
  // 接口数据和本地数据合并
  let allData = []
  if (Array.isArray(res.data) && res.data.length) {
    allData = [...res.data]; 
    let hasToday = false
    for(const i of allData) {
      if(i.day === todaySteps.value.day) {
        hasToday = true
         i.totalSteps = todaySteps.value.totalSteps
         i.calories = todaySteps.value.calories
         i.kilometers = todaySteps.value.kilometers
         i.hours = todaySteps.value.hours
      }
    }
    if(!hasToday) {
      allData.push(todaySteps.value)
    }
  } else {
    allData = [todaySteps.value];
  }
  // 筛选所选日期范围内的数据
  const dateRangeData = allData.filter(item => {
    return item.day >= currentRange.value.start && item.day <= currentRange.value.end;
  });
  finalData = dateRangeData;
  // 如果是年，则按月展示
  if (fitnessDate.value === 1) {
    const monthMap = {};
    dateRangeData.forEach(item => {
      const monthKey = item.day.slice(0, 7);
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          day: monthKey,
          totalSteps: 0,
          calories: 0,
          kilometers: 0,
          hours: 0,
        };
      }
      monthMap[monthKey].totalSteps += item.totalSteps || 0;
      monthMap[monthKey].calories = +((monthMap[monthKey].calories || 0) + (item.calories || 0)).toFixed(2);
      monthMap[monthKey].kilometers = +((monthMap[monthKey].kilometers || 0) + (item.kilometers || 0)).toFixed(2);
      monthMap[monthKey].hours = +((monthMap[monthKey].hours || 0) + (item.hours || 0)).toFixed(2);
    });
    finalData = Object.values(monthMap);
  }

  // 查询类型所需数据
  switch (fitnessType.value) {
    case 'totalSteps':
      // chartOption.value.series[0].data = finalData.map((item) => item.totalSteps)
      originalYdata.value = finalData.map((item) => item.totalSteps) 
      break;
    case 'calories':
      // chartOption.value.series[0].data = finalData.map((item) => item.calories)
      originalYdata.value = finalData.map((item) => item.calories)
      break;
    case 'kilometers':
      // chartOption.value.series[0].data = finalData.map((item) => item.kilometers)
      originalYdata.value = finalData.map((item) => item.kilometers)
      break;
    case 'hours':
      // chartOption.value.series[0].data = finalData.map((item) => item.hours)
      originalYdata.value = finalData.map((item) => item.hours)
      break;
  }
  chartOption.value.xAxis.data = finalData.map((item) => item.day)
  setChartData(chartOption.value.xAxis.data, originalYdata.value)
  // if (fitnessDate.value > 1) {
  //   chartOption.value.xAxis.data = list.map((item) => item.day)
  // } else {
  //   chartOption.value.xAxis.data = list.map((item) => item.year)
  // }
  // chartOption.value.series[0].data = list.map((item) => item.calories)
}

const chartOption = ref({
  title: {
    // subtext: '',
    // left: 'left'
  },
  toolbox: {
    feature: {
      // saveAsImage: { show: true }
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: 30, // 左侧留白（默认约 60）
    right: 30, // 右侧留白（默认约 60）
    top: 60, // 顶部留白（默认约 60）
    bottom: 30, // 底部留白（默认约 60）
    containLabel: true // 关键：防止坐标轴标签被截断，留白减少后必须开启
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      interval: 'auto',
    },
    data: []
  },
  yAxis: {
    splitLine: { show: false },
    axisLine: {
      lineStyle: {
        color: '#ccc'
      }
    }
  },
  series: [
    {
      data: [],
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        borderRadius: 5,
        color: '#0E7082'
      }
    }
  ]
})

watch(dailySteps, (newVal) => {
  todaySteps.value.day = newVal.date
  todaySteps.value.totalSteps = newVal.steps
  todaySteps.value.calories = newVal.calories
  todaySteps.value.kilometers = Number((newVal.meters / 1000).toFixed(2))
  todaySteps.value.hours = newVal.walkingTime
  getList()
}, {
  immediate: true,
  deep: true
  }, {
    immediate: true,
    deep: true   
})


const handleChartClick = (params) => {
  if (params.componentType === 'series') {
    activeIndex.value = params.dataIndex
    setChartData(chartOption.value.xAxis.data, originalYdata.value)
  }
}

function setChartData(xData, yData) {
  if (activeIndex.value === -1) { 
    activeIndex.value = yData.length - 1
  }
  chartOption.value.xAxis.data = xData;
  const seriesData = yData.map((val, index) => {
    const isActive = index === activeIndex.value
    return {
      value: val,
      itemStyle: {
        color: isActive ? '#05C3DE' : '#0E7082'
      }
    };
  });
  chartOption.value.series[0].data = seriesData;
  emits('sendData', finalData[activeIndex.value])
}




onMounted(() => {
  getList()
})
// onUnmounted(() => {

// })
onActivated(() => {
  getList()
})





</script>
<style lang="scss" scoped>
.fitness-data-container {
  display: flex;
  justify-content: space-between;

  :deep(.el-select__placeholder),
  :deep(.el-select__caret) {
    color: #fff;
  }
}

.chart-div-title {
  // color: #0958d9;
  color: var(--brand-color);
  font-weight: 600;
}

.fitness-data-container>div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.fitness-data-controller {
  gap: 10px;
}

.fd-controller-icon {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  gap: 2px;
}

.fd-controller-icon :deep(.el-icon) {
  background: var(--secondary-bg-color);
  color: #fff;
  padding: 3px;
}
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
