<template>
  <div class="play-container">
    <div class="play-container-title">
      <div class="play-container-title-text">
        <p>{{ $t('message.device.play') }}</p>
      </div>
    </div>
    <div class="play-container-content">
      <div class="play-container-content-item" :class="{ 'selected-item': selectedItem === 0 }" @click="selectItem(0)">
        <el-image :src="pcvr" alt="pcvr" />
      </div>
      <div class="play-container-content-item" :class="{ 'selected-item': selectedItem === 1 }" @click="selectItem(1)">
        <el-image :src="questGames" alt="questGames" />
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onUnmounted,
  watch,
  getCurrentInstance,
  computed
} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import pcvr from '@/assets/play/pcvr.png'
import questGames from '@/assets/play/quest_games.png'

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const store = useStore()
const router = useRouter()
const route = useRoute()

const selectedItem = ref(null)

const selectItem = (index) => {
  console.log('selectItem', index)
  selectedItem.value = selectedItem.value === index ? null : index
  if (index === 0) {
    router.push('/device/detection')
  } else if (index === 1) {
    router.push({ path: '/device/discover' })
  }
}

onBeforeMount(() => { })
onMounted(() => { })
onUnmounted(() => { })
</script>

<style lang="scss" scoped>
.play-container-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.play-container-title p {
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  color: var(--title-color);
}

.play-container-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  gap: 30px;
}

.play-container-content-item {
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out;
  border-radius: 20px;
  overflow: hidden;
}

:deep(.play-container-content-item .el-image) {
  display: block;
}

.selected-item {
  box-shadow: 0 0 0 5px #007bff;
  border-radius: 20px;
}

:deep(.play-container-content .play-container-content-item img) {
  display: block;
  width: auto;
  height: 400px;
  object-fit: cover;
}
</style>
