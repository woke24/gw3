<template>
  <div class="library-container">
    <el-row style="height: 100%">
      <el-col :span="24" style="height: 100%">
        <div class="right-panel-container">
          <router-view v-slot="{ Component }">
            <keep-alive :include="keepAliveComponentsName">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useStore()

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const keepAliveComponentsName = store.getters['keepAlive/keepAliveComponentsName']

// 监听运行中的游戏变化，用于自动切换到对应游戏详情页
watch(() => store.getters['game/getRunningGameData'], (newrunningGames) => {
  if (newrunningGames && newrunningGames.GameId) {
    if (!oldRunningGames || oldRunningGames != newrunningGames.GameId) {
      oldRunningGames = newrunningGames.GameId;
      console.log('游戏列表生改变:', newrunningGames.GameId)
      console.log('当前正在运行的游戏id:', store.getters['game/getRunningGameData'].GameId)
    }
  } else {
    oldRunningGames = null;
  }
})

let oldRunningGames = null;

onMounted(() => {
  // 初始化逻辑，如果需要
})
</script>

<style lang="scss" scoped>
.library-container {
  height: calc(100vh - 100px);
  overflow: hidden;
  font-family: var(--text-family);
}

.right-panel-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
}
</style>
