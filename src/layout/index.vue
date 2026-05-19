<template>
  <el-container style="height: 100vh">
    <el-container>
      <el-header v-show="!contentFullScreen">
        <Header />
      </el-header>
      <Tabs v-show="showTabs" />
      <el-main>
        <div v-if="isLibraryRoute" class="library-layout">
          <div class="left-panel-div">
            <LibraryLeftPanel />
          </div>
          <div class="right-router-view">
            <router-view v-slot="{ Component, route }">
              <!-- <transition :name="route.meta.transition || 'fade-transform'" mode="out-in"> -->
                <keep-alive v-if="keepAliveComponentsName" :include="keepAliveComponentsName">
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
                <component v-else :is="Component" :key="route.fullPath" />
              <!-- </transition> -->
            </router-view>
          </div>
        </div>
        <div v-else style="height: 100%;">
          <router-view v-slot="{ Component, route }">
            <!-- <transition :name="route.meta.transition || 'fade-transform'" mode="out-in"> -->
              <keep-alive v-if="keepAliveComponentsName" :include="keepAliveComponentsName">
                <component :is="Component" :key="route.fullPath" />
              </keep-alive>
              <component v-else :is="Component" :key="route.fullPath" />
            <!-- </transition> -->
          </router-view>
        </div>
      </el-main>
      <el-footer v-if="showFooter" class="el-footer">
        <BottomData :key="route.fullPath" />
      </el-footer>
    </el-container>
    <el-dialog v-model="addDialogVisible" width="586" center :show-close="false" :before-close="handleClose"
      class="add-game-dialog">
      <template #header>
        <div class="custom-dialog-header">
          <span class="header-title">Add a Game</span>
          <div class="header-close-icon" @click="addDialogVisible = false">
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </div>
      </template>

      <div class="dialog-body-content">
        <div class="game-type-list">
          <el-radio-group v-model="gameType">
            <el-radio :value="1">Steam</el-radio>
            <el-radio :value="2">Other Platform</el-radio>
          </el-radio-group>
        </div>
        <div class="game-add-tip">
          <p>For multi-platform games, it is recommended to open them through Steam.</p>
        </div>
        <div v-if="gameType === 1" class="game-add-func">
          <div class="game-add-func-item">
            <div class="game-container">
              <div class="search-game-text">
                <el-input placeholder="Search Game" class="search-input dark-input" v-model="searchAddGame"
                  @input="handleSearchGame" clearable>
                  <template #append>
                    <el-button :icon="Search" @click="handleSearchGame" />
                  </template>
                </el-input>
              </div>
              <div class="search-game-list">
                <el-scrollbar height="100%">
                  <ul :infinite-scroll-disabled="disabledGameScroll" :infinite-scroll-distance="20"
                    :infinite-scroll-immediate="false" style="list-style: none; padding: 0; margin: 0">
                    <li v-for="game in searchGameList" :key="game.ID" :value="game.ID" @click="handleGameClick(game)"
                      class="scrollbar-demo-item clickable-item">
                      <el-tooltip effect="dark" :content="game.Name" placement="top">
                        <span class="game-name">{{ game.Name }}</span>
                      </el-tooltip>
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
            </div>
          </div>
          <div class="game-add-func-item">
            <div class="search-game-result">
              <div class="gameName">Game name:</div>
              <div class="search-game-result-text">
                <span>{{ addGameConfig?.gameName || 'Game not found' }}</span>
              </div>
            </div>
            <div class="save-game-btn">
              <el-button class="custom-ok-btn" @click="handleSaveGame">OK</el-button>
            </div>
          </div>
        </div>
        <div v-else class="game-func-other">
          <div class="choose-game-file">
            <div class="choose-game-file-text">Game file</div>
            <div class="choose-game-control">
              <el-upload v-model:file-list="fileList" ref="uploadRef" class="game-file" action="#" :auto-upload="false"
                :show-file-list="false" :on-change="handleChange" accept=".exe">
                <template #trigger>
                  <el-button type="primary">Choose *.exe file from drive</el-button>
                </template>
              </el-upload>
            </div>
          </div>
          <div class="choose-game-name">
            <div class="choose-game-name-text">Game name</div>
            <div class="choose-game-name-input">
              <el-input v-model="selectGameName" placeholder="Game name" class="dark-input" />
            </div>
          </div>
          <div class="save-game-btn">
            <el-button class="custom-ok-btn" @click="handleSaveGame">OK</el-button>
          </div>
        </div>
      </div>
      <template #footer>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="js" setup>
import { computed, onBeforeMount, onMounted, ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute, routerKey } from "vue-router";
import { useEventListener } from "@vueuse/core";
import { Search, Filter, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import Menu from "./Menu/index.vue";
// import Logo from "./Logo/index.vue";
import Header from "./Header/index.vue";
import Tabs from "./Tabs/index.vue";
import BottomData from "@/components/bottomData/index.vue";
import LibraryLeftPanel from "@/views/library/components/LibraryLeftPanel.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
// computed
// const isCollapse = computed(() => store.state.app.isCollapse);
const contentFullScreen = computed(() => store.state.app.contentFullScreen);
const showLogo = computed(() => store.state.app.showLogo);
const showTabs = computed(() => store.state.app.showTabs);

const showFooter = computed(() => {
  const defaultVisibility = store.state.app.showFooter;
  const routeMeta = route.meta.showFooter;
  return routeMeta !== undefined ? routeMeta : defaultVisibility;
});

const keepAliveComponentsName = computed(() => store.getters['keepAlive/keepAliveComponentsName']);
// library时左公共右路由结构, 其它时路由结构
const isLibraryRoute = computed(() => route.name === 'GameDetail' || route.name === 'LibraryHome');

const addDialogVisible = computed({
  get: () => store.getters['game/getAddDialogVisible'],
  set: (value) => store.commit('game/setAddDialogVisible', value)
});

const steamGameList = computed(() => store.getters['game/getSteamGameList']);
const searchGameList = computed(() => store.getters['game/getSearchGameList']);
const gameType = computed({
  get: () => store.getters['game/getGameType'],
  set: (value) => store.commit('game/setGameType', value)
});
const addGameConfig = computed(() => store.getters['game/getAddGameConfig']);
const selectGameName = computed({
  get: () => store.getters['game/getSelectGameName'],
  set: (value) => store.commit('game/setSelectGameName', value)
});
const fileList = computed({
  get: () => store.getters['game/getFileList'],
  set: (value) => store.commit('game/setFileList', value)
});
const searchAddGame = computed({
  get: () => store.getters['game/getSearchAddGame'],
  set: (value) => store.commit('game/setSearchAddGame', value)
});

const disabledGameScroll = ref(false);
const uploadRef = ref(null);

console.log('isLibraryRoute',isLibraryRoute.value)
// 页面宽度变化监听后执行的方法
// const resizeHandler = () => {
//   if (document.body.clientWidth <= 1000 && !isCollapse.value) {
//     store.commit("app/isCollapseChange", true);
//   } else if (document.body.clientWidth > 1000 && isCollapse.value) {
//     store.commit("app/isCollapseChange", false);
//   }
// };
onMounted(() => {
  console.log('router', router)
  // 初始化调用
  // resizeHandler();
})

// beforeMount
onBeforeMount(() => {
  // 监听页面变化
  // useEventListener("resize", resizeHandler);
});
// methods
const handleClose = (done) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const handleSearchGame = () => {
  const gameName = searchAddGame.value
  if (gameName) {
    const keyword = gameName.trim().toLowerCase();
    const list = steamGameList.value.filter(game =>
      game.Name?.toLowerCase().includes(keyword)
    );
    store.commit('game/setSearchGameList', list);
  } else {
    store.commit('game/setSearchGameList', steamGameList.value);
  }
}

const handleGameClick = (game) => {
  console.log('点击游戏:', game)
  store.commit('game/setAddGameConfig', { gameId: game.ID, gameName: game.Name });
};

const handleChange = (uploadFile, uploadFiles) => {
  // 直接获取文件名
  const fileName = uploadFile.name
  selectGameName.value = fileName
  console.log('当前选择的文件名:', fileName)
}

const handleSaveGame = () => {
  console.log('保存游戏')
}

// 隐藏菜单
// const hideMenu = () => {
//   store.commit("app/isCollapseChange", true);  
// };
</script>

<style lang="scss" scoped>
.el-header {
  padding-left: 0;
  padding-right: 0;
  height: 50px;
}

.el-aside {
  display: flex;
  flex-direction: column;
  transition: 0.2s;
  overflow-x: hidden;
  transition: 0.3s;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
}

.el-footer {
  background: var(--nav-bg-color);
  color: var(--title-color);
  font-family: var(--text-family);
  border-top: 1px solid var(--divider-color);
  height: 50px;
}

.el-main {
  background-color: var(--system-container-background);
  height: 100%;
  padding: 0;
  overflow-x: hidden;
  color: var(--text-color);
}

.library-layout {
  display: flex;
  height: 100%;
}

.left-panel-div {
  width: 200px;
  background: var(--nav-bg-color);
  border-right: 1px solid var(--divider-color);
  padding: 10px;
  box-sizing: border-box;
}

.right-router-view {
  flex: 1;
  overflow: hidden;
}

:deep(.el-main-box) {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: var(--main-bg-color);
}

@media screen and (max-width: 1000px) {
  .el-aside {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;

    &.hide-aside {
      left: -250px;
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
  }
}
// 添加游戏弹窗
:deep(.add-game-dialog){
  background-color: #1a2b36 !important;
  border: 1px solid #00acc1;
  padding: 0;
}
.custom-dialog-header {
  background-color: #264653;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  font-weight: bold;
}
.header-title {
  font-size: 18px;
}
.header-close-icon {
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s;
}
.header-close-icon:hover {
  color: #00acc1;
}
:deep(.dialog-body-content) {
  padding: 0px 40px;
  color: #fff;
  line-height: 1.6;
}
.game-add-func {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.game-add-func .game-add-func-item {
  flex: 1.5;
}
.game-add-func .game-add-func-item:last-child {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .custom-ok-btn {
    --el-button-bg-color: #123d4d;
    --el-button-border-color: #00ccff;
    --el-button-text-color: #ffffff;

    --el-button-hover-bg-color: #1a566c;
    --el-button-hover-border-color: #33d6ff;
    --el-button-hover-text-color: #ffffff;

    border-width: 2px;
    border-radius: 2px;
    padding: 10px 40px;
    margin-bottom: 10px;
  }
}

.game-func-other {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .custom-ok-btn {
    --el-button-bg-color: #123d4d;
    --el-button-border-color: #00ccff;
    --el-button-text-color: #ffffff;

    --el-button-hover-bg-color: #1a566c;
    --el-button-hover-border-color: #33d6ff;
    --el-button-hover-text-color: #ffffff;

    border-width: 2px;
    border-radius: 2px;
    padding: 10px 40px;
    margin-bottom: 10px;
  }
}

.game-container {
  height: 260px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.search-game-list {
  border: 1px solid var(--divider-color);
  height: calc(100% - 50px);
  margin-top: 12px;
  border-radius: 8px;
}

.game-name {
  display: inline-block;
  vertical-align: middle;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-game-result {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .gameName {
    font-size: 16px;
    font-weight: 700;
    color: #FFFFFF;
  }

  .search-game-result-text {
    font-size: 14px;
    color: var(--text-color);
  }
}
</style>
