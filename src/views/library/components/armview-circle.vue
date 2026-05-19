<template>
  <div class="vsv-direction-cirle">
    <svg width="75" height="75" viewBox="0 0 75 75">
      <!-- 背景圆 -->
      <circle cx="37.5" cy="37.5" r="27" fill="none" stroke="#00C0FF" stroke-width="4" />

      <!-- 刻度线 -->
      <g v-for="tick in ticks" :key="tick.angle">
        <line
          :x1="tick.x1"
          :y1="tick.y1"
          :x2="tick.x2"
          :y2="tick.y2"
          stroke="#00C0FF"
          stroke-width="2"
        />
      </g>

      <!-- 扇形区域 -->
      <path :d="sectorPath" fill="rgba(0, 0, 0, 0.15)" stroke="#00C0FF" stroke-width="0" />

      <!-- 边线上的图标 -->
      <image width="15" height="15" :href="footerImg" :transform="startIconTransform" />
      <image width="15" height="15" :href="footerImg" :transform="endIconTransform" />
    </svg>
  </div>
</template>

<script lang="js" setup>
import { ref, computed, watch } from 'vue'
import footerImg from '@/assets/icons/footer.png'
const props = defineProps({
  deviceDirectionX: {
    type: Number,
    default: 0.03
  },
  deviceDirectionY: {
    type: Number,
    default: 0.12
  }
})

watch([() => props.deviceDirectionX, () => props.deviceDirectionY], ([newXval, newYval]) => {
  startAngle.value = Math.round(360 * newXval)
  endAngle.value = Math.round(360 * newYval)
})
const startAngle = ref(0)
const endAngle = ref(75)

// 计算刻度
const ticks = computed(() => {
  const ticksArray = []
  const centerX = 37.5
  const centerY = 37.5
  const radius = 21
  for (let i = 0; i < 360; i += 30) {
    const angle = ((i - 90) * Math.PI) / 180

    const innerRadius = 25 // 内圆半径，控制刻度线长度
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
  const centerX = 37.5
  const centerY = 37.5
  const radius = 30

  const startAngleRad = ((startAngle.value - 90) * Math.PI) / 180
  const endAngleRad = ((endAngle.value - 90) * Math.PI) / 180

  const x1 = centerX + radius * Math.cos(startAngleRad)
  const y1 = centerY + radius * Math.sin(startAngleRad)
  const x2 = centerX + radius * Math.cos(endAngleRad)
  const y2 = centerY + radius * Math.sin(endAngleRad)

  const largeArcFlag = endAngle.value - startAngle.value > 180 ? 1 : 0

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
})

// 计算扇形边线上的图标位置和旋转角度
const startIconTransform = computed(() => {
  const centerX = 37.5
  const centerY = 37.5
  const radius = 15 // 使用半径的一半作为图标位置

  const startAngleRad = ((startAngle.value - 90) * Math.PI) / 180
  const x = centerX + radius * Math.cos(startAngleRad) - 7.5 // 减去图标宽度的一半
  const y = centerY + radius * Math.sin(startAngleRad) - 7.5 // 减去图标高度的一半

  // 计算旋转角度，使图标朝外
  const rotation = startAngle.value

  return `translate(${x}, ${y}) rotate(${rotation} 7.5 7.5)` // 图标的中心点
})

const endIconTransform = computed(() => {
  const centerX = 37.5
  const centerY = 37.5
  const radius = 15 // 使用半径的一半作为图标位置

  const endAngleRad = ((endAngle.value - 90) * Math.PI) / 180
  const x = centerX + radius * Math.cos(endAngleRad) - 7.5 // 减去图标宽度的一半
  const y = centerY + radius * Math.sin(endAngleRad) - 7.5 // 减去图标高度的一半

  // 计算旋转角度，使图标朝外
  const rotation = endAngle.value

  return `translate(${x}, ${y}) rotate(${rotation} 7.5 7.5)` // 图标的中心点
})
</script>
<style lang="scss" scoped></style>
