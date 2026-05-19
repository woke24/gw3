<template>
  <div class="electric-panel" :class="bgClass">
    <div class="panel" :style="{ transform: `rotate(${rotate}deg)` }">
      <div class="remainder" :style="{ width: batteryNum + '%' }" />
      <div v-if="proIsCharge" class="lightning-icon">
        <svg t="1761794974436" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="1617" width="8" height="8">
          <path
            d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333zM416.714667 138.666667L270.453333 522.581333h166.869334a32 32 0 0 1 30.933333 40.181334l-61.130667 230.954666 322.176-367.114666H565.312c-22.72 0-38.208-23.018667-29.632-44.064l99.36-243.882667H416.714667z"
            fill="#ffffff" p-id="1618"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  // 电池显示的数值
  quantity: {
    type: Number,
    default: 0,
  },
  // 是否显示电量百分比
  showText: {
    type: Boolean,
    default: false,
  },
  // 是否展示充电状态
  proIsCharge: {
    type: Boolean,
    default: false,
  },
  // 旋转角度：270度使水平电池变为垂直，电极朝上
  rotate: {
    type: String,
    default: '270', // 默认旋转 270 度
  },
});

// 电池电量百分比
const batteryNum = ref(props.quantity);
const bgClass = computed(() => {
  if (props.proIsCharge) return 'primary';
  if (batteryNum.value >= 30) {
    return 'success';
  } else if (batteryNum.value >= 15) {
    return 'warning';
  } else if (batteryNum.value >= 5) {
    return 'danger';
  } else {
    return 'danger';
  }
});

let myInterval = null;

// 充电
const drawCharge = () => {
  batteryNum.value += 20;
  if (batteryNum.value > 100) {
    batteryNum.value = 0;
  }
};
// 充电
const handleRecharge = () => {
  clearInterval(myInterval);
  batteryNum.value = 0;
  if (props.proIsCharge) {
    myInterval = setInterval(() => {
      drawCharge();
    }, 500);
  }
};

watch(() => props.quantity, (newQuantity) => {
  if (!props.proIsCharge) {
    if (myInterval) {
      clearInterval(myInterval);
    }
    batteryNum.value = newQuantity;
  }
});

watch(() => props.proIsCharge, (isCharging) => {
  if (isCharging) {
    handleRecharge();
  } else {
    clearInterval(myInterval);
    myInterval = null;
    batteryNum.value = props.quantity;
  }
});

onMounted(() => {
  if (props.proIsCharge) {
    handleRecharge();
  } else {
    batteryNum.value = props.quantity;
  }
});

onBeforeUnmount(() => {
  if (myInterval) {
    clearInterval(myInterval);
  }
});
</script>

<style lang="scss" scoped>
// custom theme color
$color-primary: #13ce66;
$color-success: #13ce66;
$color-warning: #ffba00;
$color-danger: #ff4949;
$color-info: #909399;
$color-white: #fff;

@mixin panel-style($color) {
  .panel {
    border-color: $color;

    &::before {
      background: $color;
    }

    .remainder {
      background: $color;
    }
  }

  .text {
    color: $color;
  }

  .lightning-icon {
    color: $color;
  }
}

.electric-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20px;

  &.primary {
    @include panel-style($color-primary);
  }

  &.success {
    @include panel-style($color-success);
  }

  &.warning {
    @include panel-style($color-warning);
  }

  &.danger {
    @include panel-style($color-danger);
  }

  .panel {
    box-sizing: border-box;
    width: 18px;
    height: 10px;
    position: relative;
    border: 1px solid #ccc;
    padding: 1px;
    border-radius: 2px;

    // 保持电极样式不变 (它会随着 panel 一起旋转 270 度，出现在底部)
    &::before {
      content: "";
      border-radius: 0 1px 1px 0;
      height: 4px;
      background: #ccc;
      width: 2px;
      position: absolute;
      top: 50%;
      right: -4px;
      transform: translateY(-50%);
    }

    .remainder {
      border-radius: 1px;
      position: relative;
      height: 100%;
      // 保持 width 绑定不变
      width: 0%;
      left: 0;
      top: 0;
      background: #fff;
      z-index: 1;
    }
  }

  // 新增文本位置调整样式
  .vertical-text-position {
    // 垂直布局下，文本放在电池下方，增加上边距
    margin-top: 5px;
    text-align: center;
  }

  .text {
    text-align: left;
    width: auto;
    font-size: 13px;
    // 移除原有 margin-left
  }

  .lightning-icon {
    transform: rotate(90deg);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 8px;
    line-height: 1;
    color: $color-white;
    z-index: 2;
  }
}
</style>