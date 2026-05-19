<template>
  <div ref="chartContainer" class="chart" :style="{ height: height }" />
</template>

<script lang="js" setup>
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
const props = defineProps({
  height: {
    type: String,
    default: '400px'
  },
  options: {
      type: Object,
      required: true
    },
  allowClick: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['chartClick'])
const chartContainer = ref(null);
let chartInstance = null;

const bindChartEvents = () => {
  if (!chartInstance) return
  if(props.allowClick) {
    chartInstance.off('click')
    chartInstance.on('click', (params) => {
      emit('chartClick', params)
    })
  }
}

const initChart = () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
      chartInstance = echarts.init(chartContainer.value);
      props.options && chartInstance.setOption(props.options, true);
      bindChartEvents()
    };

    watch(
      () => props.options,
      (newOptions) => {
        if (chartInstance) {
          // 只更新数据部分，不重新创建图表实例
          chartInstance.setOption(newOptions, false);
          // MD,如果不用initChart，restore后显示空白，因为初始数据为空
          // initChart()
        }
      },
      { deep: true }
    );
  onMounted(() => {
      initChart();
      window.addEventListener('resize', resizeChart);
    });
    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.dispose();
      }
      window.removeEventListener('resize', resizeChart);
    })
    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  // height: 400px;
  display: flex;
  justify-content: center;
}
</style>
