<template>
  <div class="vsv-direction-cirle">
    <svg width="150" height="150" viewBox="0 0 150 150">
      <!-- 背景圆 -->
      <circle cx="75" cy="75" r="54" fill="none" stroke="#e0e0e0" stroke-width="15" opacity="0.05" />

      <!-- 刻度线 -->
      <g v-for="tick in ticks" :key="tick.angle">
        <line :x1="tick.x1" :y1="tick.y1" :x2="tick.x2" :y2="tick.y2" stroke="#fff" stroke-width="1" />
      </g>

      <!-- 扇形区域 -->

      <path :d="sectorPath" fill="rgba(0, 0, 0, 0.15)" stroke="#409eff" stroke-width="0" />

      <!-- 边线上的图标 -->
      <image width="30" height="30" :href="footerImg" :transform="startIconTransform" />
      <image width="30" height="30" :href="footerImg" :transform="endIconTransform" />

      <g>
        <path :d="getArrowPath(startPoint)" fill="none" stroke="#409eff" stroke-width="2" />
        <path :d="getArrowPath(endPoint)" fill="none" stroke="#67c23a" stroke-width="2" />
      </g>
    </svg>
  </div>
</template>

<script lang="js" setup>
import { ref, computed, watch } from 'vue'
import footerImg from '@/assets/icons/footer.png'
const props = defineProps({
  deviceDirectionLeft: {
    type: Number,
    default: 0
  },
  deviceDirectionRight: {
    type: Number,
    default: 0
  }
})

const startAngle = ref(0)
const endAngle = ref(0)

watch(
  () => props.deviceDirectionRight,
  (newY) => {
    startAngle.value = props.deviceDirectionLeft;
    endAngle.value = newY;
  },
  { immediate: true }
)

// 计算刻度
const ticks = computed(() => {
  const ticksArray = []
  const centerX = 75
  const centerY = 75
  const radius = 60

  for (let i = 0; i < 360; i += 30) {
    const angle = ((i - 90) * Math.PI) / 180

    const innerRadius = 50 // 内圆半径，控制刻度线长度
    const x1 = centerX + innerRadius * Math.cos(angle)
    const y1 = centerY + innerRadius * Math.sin(angle)
    const x2 = centerX + radius * Math.cos(angle)
    const y2 = centerY + radius * Math.sin(angle)

    ticksArray.push({
      angle: i,
      x1,
      y1,
      x2,
      y2
    })
  }

  return ticksArray
})

// 计算扇形路径
const sectorPath = computed(() => {
  const centerX = 75
  const centerY = 75
  const radius = 60

  const startAngleRad = ((startAngle.value - 90) * Math.PI) / 180
  const endAngleRad = ((endAngle.value - 90) * Math.PI) / 180

  const x1 = centerX + radius * Math.cos(startAngleRad)
  const y1 = centerY + radius * Math.sin(startAngleRad)
  const x2 = centerX + radius * Math.cos(endAngleRad)
  const y2 = centerY + radius * Math.sin(endAngleRad)

  const largeArcFlag = endAngle.value - startAngle.value > 180 ? 1 : 0

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
})

// 计算控制点位置
const startPoint = computed(() => {
  const angle = ((startAngle.value - 90) * Math.PI) / 180
  return {
    x: 75 + 60 * Math.cos(angle),
    y: 75 + 60 * Math.sin(angle)
  }
})

const endPoint = computed(() => {
  const angle = ((endAngle.value - 90) * Math.PI) / 180
  return {
    x: 75 + 60 * Math.cos(angle),
    y: 75 + 60 * Math.sin(angle)
  }
})

// 计算扇形边线上的图标位置和旋转角度
const startIconTransform = computed(() => {
  const centerX = 75
  const centerY = 75
  const radius = 30 // 使用半径的一半作为图标位置

  const startAngleRad = ((startAngle.value - 90) * Math.PI) / 180
  const x = centerX + radius * Math.cos(startAngleRad) - 15 // 减去图标宽度的一半
  const y = centerY + radius * Math.sin(startAngleRad) - 15 // 减去图标高度的一半

  // 计算旋转角度，使图标朝外
  const rotation = startAngle.value

  return `translate(${x}, ${y}) rotate(${rotation} 15 15)` // 图标的中心点
})

const endIconTransform = computed(() => {
  const centerX = 75
  const centerY = 75
  const radius = 30 // 使用半径的一半作为图标位置

  const endAngleRad = ((endAngle.value - 90) * Math.PI) / 180
  const x = centerX + radius * Math.cos(endAngleRad) - 15 // 减去图标宽度的一半
  const y = centerY + radius * Math.sin(endAngleRad) - 15 // 减去图标高度的一半

  // 计算旋转角度，使图标朝外
  const rotation = endAngle.value

  return `translate(${x}, ${y}) rotate(${rotation} 15 15)` // 图标的中心点
})

function getArrowPath (point) {
  // 圆心坐标
  const centerX = 75
  const centerY = 75

  // 计算从圆心到当前点的角度
  const angle = Math.atan2(point.y - centerY, point.x - centerX)

  // 箭头的大小参数（增大一倍）
  const arrowLength = 40 // 箭头长度
  const arrowWidth = 20 // 箭头宽度
  const indent = 30 // 内凹深度

  // 计算箭头的三个顶点，确保箭头指向远离圆心的方向
  // 调整起点位置，让箭头贴着圆线
  const basePoint = {
    x: centerX + 30 * Math.cos(angle),
    y: centerY + 30 * Math.sin(angle)
  }

  const tip = {
    x: basePoint.x + Math.cos(angle) * arrowLength,
    y: basePoint.y + Math.sin(angle) * arrowLength
  }

  const left = {
    x: basePoint.x + Math.cos(angle - Math.PI / 6) * arrowWidth,
    y: basePoint.y + Math.sin(angle - Math.PI / 6) * arrowWidth
  }

  const right = {
    x: basePoint.x + Math.cos(angle + Math.PI / 6) * arrowWidth,
    y: basePoint.y + Math.sin(angle + Math.PI / 6) * arrowWidth
  }

  // 生成SVG路径，确保底部内凹
  return `M ${tip.x} ${tip.y}
          L ${left.x} ${left.y}
          Q ${basePoint.x + Math.cos(angle) * indent} ${basePoint.y + Math.sin(angle) * indent}
            ${right.x} ${right.y}
          Z`
}
</script>
<style lang="scss" scoped></style>
