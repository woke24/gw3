<template>
  <el-tabs v-model="activeTab" @tab-click="handleTabClick">
    <el-tab-pane :label="$t('message.menu.library.name')" name="/library/index"></el-tab-pane>
    <el-tab-pane :label="$t('message.menu.fitness.name')" name="/fitness/index"></el-tab-pane>
    <el-tab-pane :label="$t('message.menu.device.name')" name="/device/index"></el-tab-pane>
    <el-tab-pane :label="$t('message.menu.community.name')" name="/community/index"></el-tab-pane>
    <el-tab-pane :label="$t('message.menu.application.name')" name="/application/index"></el-tab-pane>
  </el-tabs>
</template>

<script lang="js" setup>
import { ref, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeTab = ref(route.path)

watch(() => route.path, (newPath) => {
  let newPathVal = newPath
  if (newPath.includes('/library')) {
    newPathVal = '/library/index'
  }
  if (newPath.includes('/device')) {
    newPathVal = '/device/index'
  }
  if (newPath.includes('/fitness')) {
    newPathVal = '/fitness/index'
  }
  if (newPath.includes('/community')) {
    newPathVal = '/community/index'
  }
  if (newPath.includes('/application')) {
    newPathVal = '/application/index'
  }
  activeTab.value = newPathVal
})

// const activeTab = ref('/library/index')
const handleTabClick = (tab) => {
  activeTab.value = tab.props.name
  router.push(tab.props.name)
}
</script>
<style lang="scss" scoped>
:deep(.el-tabs__item) {
  font-size: var(--el-font-size-large);
  font-weight: 600;
  text-transform: uppercase;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: unset;
}
</style>
