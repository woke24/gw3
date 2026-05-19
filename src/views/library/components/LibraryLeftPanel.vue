<template>
  <div class="left-panel">
    <div class="search-game">
      <el-input placeholder="Search Game" class="search-input dark-input" :prefix-icon="Search"
        v-model="searchGame">
        <template #append>
          <el-button :icon="Filter" />
        </template>
      </el-input>
    </div>

    <div class="game-library-lists">
      <el-scrollbar height="100%">
        <ul v-infinite-scroll="load" :infinite-scroll-disabled="disabledScroll" :infinite-scroll-distance="20"
          :infinite-scroll-immediate="false" style="list-style: none; padding: 0; margin: 0">
          <router-link v-for="game in gameList" :key="game.ID" :to="getRouteTarget(game)" custom
            v-slot="{ navigate, isActive }">
            <li :id="game.ID" @click.stop="navigate($event)" @contextmenu="onContextMenu($event, game)" class="scrollbar-demo-item clickable-item"
              :class="{ 'is-active': isActive }">
              <span class="game-name">{{ game.Name }}</span>
            </li>
          </router-link>
          <li v-if="loading" class="loading-info">Loading...</li>
          <li v-if="noMore" class="loading-info">No More Games</li>
        </ul>
      </el-scrollbar>
    </div>
    <div class="add-game">
      <el-button type="primary" @click="addGame">Add Game</el-button>
      <el-button type="primary" @click="scanSteamGames">Scan Game</el-button>
      <el-button type="primary">Delete</el-button>
    </div>
  </div>

  <context-menu
    v-model:show="cmishow"
    :options="optionsComponent"
  >
    <!-- 暂用Installed当做收藏测试 -->
    <context-menu-item :label="cmiGame.Installed ? 'Add to Favorite' : 'Remove from Favorite'" @click="CMIfavorite(cmiGame)" />
    <context-menu-group label="Add to" icon="icon-reload-1">
        <context-menu-item 
          v-for="(item,index) of CMIcollection"
          :key="index" 
          :label="item.name" 
          @click="CMIadd(item, cmiGame)" 
        />
        <context-menu-separator />
        <context-menu-item label="New Collection..." @click="CMIaddNewCollection(cmiGame)" />
    </context-menu-group>
    <context-menu-group label="Remove from" icon="icon-reload-1">
        <context-menu-item 
          v-for="(item,index) of CMIcollection"
          :key="index" 
          :label="item.name" 
          @click="CMIremove(item, cmiGame)" 
        />
    </context-menu-group>
    <context-menu-item label="Delete" @click="CMIdelete(cmiGame)" />
  </context-menu>
  <NewCollectionDrawer :visible="showDrawer" :gameData = "cmiGame" @save="saveCollection" @close="closeCollection" />
</template>

<script setup>
import { computed, ref, onMounted, getCurrentInstance, reactive } from 'vue'
import { useStore } from 'vuex'
import { scanGames, readGameControllerOptions, checkSteamGames } from '@/utils/game'
import { openRunGameThread } from '@/utils/system'
import { gameThreads } from '@/api/game'
import { Search, Filter } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import { ContextMenu, ContextMenuGroup, ContextMenuSeparator, ContextMenuItem } from '@imengyu/vue3-context-menu'
import NewCollectionDrawer from '@/views/library/components/newCollection.vue'

const router = useRouter()
const store = useStore()

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const loading = ref(false)
const noMore = ref(false)

const disabledScroll = computed(() => loading.value || noMore.value)

const allGameLists = computed(() => store.getters['game/getGlobalGameConfigs'])

const runningGames = computed(() => store.getters['game/getRunningGameData'])

const searchGame = ref('')

const gameList = ref([])
const steamGameIds = ref([])

// 读取游戏配置表
const getGameConfigList = async () => {
  return allGameLists.value;
}

// 初始化游戏列表
const initGameList = async () => {
  const allGames = await getGameConfigList()
  const defaultList = []

  // 追加默认配置
  if (allGames.Default) {
    defaultList.push(allGames.Default)
  }

  if (allGames.SteamGame && allGames.SteamGame.length > 0) {
    gameList.value = _.unionBy(defaultList, allGames.SteamGame, 'ID')
  } else {
    gameList.value = defaultList
  }
}

// 获取Steam游戏列表（用于添加游戏，但这里不需要，因为dialog在父组件）
const loadSteamGameList = async () => {
  const data = await checkSteamGames(host);
  return data
}

// 添加自定义游戏
const addGame = async () => {
  store.commit('game/setAddDialogVisible', true)
  const steamGames = await loadSteamGameList()
  store.commit('game/setSteamGameList', steamGames)
}

// 扫描游戏列表
const scanSteamGames = async () => {
  const result = await scanGames(host)
  if (result.length > 0) {
    gameList.value = _.unionBy(gameList.value, result, 'ID')
  }
}

// 初始化（启动监控游戏运行的线程）
const initCheckGameThread = async () => {
  if (steamGameIds.value.length > 0) {
    const steamGames = JSON.stringify(steamGameIds.value)
    await openRunGameThread(host, steamGames)
  }
}

const getGameThreads = async () => {
  const res = await gameThreads()
  console.log('游戏线程列表:', res)
  if (res.code === 20000 && res.data.length > 0) {
    steamGameIds.value = res.data
    initCheckGameThread()
  }
}

const getRouteTarget = (game) => {
  const gameId = game.ID
  return { name: 'GameDetail', params: { id: game.ID, name: game.Name } }
}

const load = async () => {
  if (disabledScroll.value) return

  loading.value = true

  try {
    await initGameList()
    noMore.value = true
  } catch (error) {
    console.error('加载游戏列表失败:', error)
  } finally {
    loading.value = false
  }
}
// 右键菜单-开始
const cmishow = ref(false)
const cmiGame = ref(null)
const optionsComponent = reactive({
  iconFontClass: 'iconfont',
  customClass: 'class-a',
  zIndex: 3,
  minWidth: 230,
  x: 500,
  y: 200
})

const onContextMenu = (e, game) => {
  e.preventDefault()
  cmiGame.value = game
  optionsComponent.x = 180
  optionsComponent.y = e.y
  cmishow.value = true
}
const CMIcollection = reactive([
  {name:'RPG', id: 1},
  {name:'SLG', id: 2},
  {name:'FPS', id: 3},
  {name:'HORNOR', id: 4},
])
const CMIfavorite = (game) => {
  console.log('收藏', game)
}
const CMIadd = (collection, game) => {
  console.log('添加到分类', collection, game)
}
const CMIremove = (collection, game) => {
  console.log('从分类删除', collection, game)
}
const CMIdelete = (game) => {
  console.log('删除', game)
}
const showDrawer = ref(false)
const CMIaddNewCollection = (game) => {
  showDrawer.value = true
  console.log('新增分类', game)
}
const saveCollection = () => {
  console.log('save')
  showDrawer.value = false
}
const closeCollection = () => {
  console.log('close')
  showDrawer.value = false
}
// 右键菜单-结束

onMounted(() => {
  initGameList()
  getGameThreads()
})
</script>

<style lang="scss" scoped>
.left-panel {
  background: var(--sidebar-bg-color);
  color: var(--text-color);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

.game-library-lists {
  flex: 1;
  overflow: hidden;
  padding: var(--small-distance) 0;
}

.game-library-lists ul {
  list-style: none;
  margin: 5px 10px;
  padding: 0;
}

.left-panel .search-game {
  padding: 20px 10px 0 10px;
}

.left-panel .add-game {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 6px;
}

.left-panel .add-game button {
  width: 88%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 0px;
  gap: 5px;
  align-self: stretch;
  box-sizing: border-box;
  border: 1px dashed var(--divider-color);
  background: transparent;
  font-size: 12px;
  font-weight: normal;
  line-height: 17px;
  text-align: center;
  letter-spacing: 0px;
  color: var(--text-color);
  margin-left: 10px;
  margin-right: 10px;
}

.clickable-item {
  cursor: pointer;
  transition: all 0.3s;

  &.is-active {
    background: #3E4E69;
    color: var(--brand-color);
  }
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 25px;
  margin-bottom: 5px;
  padding: 0 10px;
  text-align: left;
}

.scrollbar-demo-item:hover {
  color: var(--brand-color);
  background: #3E4E69;
}

.game-name {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-info {
  text-align: center;
  color: #666;
  font-size: 12px;
  padding: 10px 0;
}
</style>