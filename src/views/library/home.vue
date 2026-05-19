<template>
  <div class="right-panel">
    <div class="game-news-container">
      <div class="gnc-header">
        <div class="game-news-title">What's New</div>
        <div class="gnc-more">
          More&nbsp;&nbsp;>
        </div>
      </div>

      <div class="game-news-lists" ref="newsListRef">
        <div v-for="i in 5" :key="i" class="game-news-item">
          <div class="game-news-item-wrapper">
            <div class="news-thumbnails">
              <img :src="newsImg" alt="" v-nodrag>
            </div>
            <div class="news-title">
              <p>Hollow Knight: Silksong now supports VRify !!!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="recent-games-container">
      <div class="recent-games-title">Recent Games</div>
      <div class="recent-games-lists" ref="recentRef">
        <div v-for="game in recentGamesData" :key="game.id" class="game-card-wrapper game-card-wrapper--interactive"
          :class="{ 'is-expanded': expandedRecentId === game.id }" @click="toggleRecentExpansion(game.id)">
          <div class="game-card">
            <div class="card-content"></div>
            <div v-if="expandedRecentId === game.id && game.played" class="card-info">
              <span class="icon-play">▶</span>
              <div class="text">
                <p class="title">{{ game.title }}</p>
                <p class="time">Time Played: {{ game.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="favorite-container">
      <div class="favorite-title">Favorite</div>
      <div class="favorite-lists" ref="favoriteRef">
        <div v-for="game in recentGamesData" :key="game.id" class="favorite-item">
          <div class="favorite-item-wrapper">
            <div class="favorite-item-thumbnails">
              <img :src="newsImg" alt="" v-nodrag>
            </div>
            <div class="favorite-item-title">
              <p>{{ game.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue'
import { newGameConfiguration } from '@/api/gateway'
import { gameCategoryLists } from '@/api/game'
import { configRead, configWrite, getGameInstalledStatus } from '@/utils/system'
import { ArrowRight } from '@element-plus/icons-vue'

import newsImg from '@/assets/game/game.jpg'

const expandedRecentId = ref(1)
const newsListRef = ref(null)
const favoriteRef = ref(null)
const recentRef = ref(null)

const gameConfig = ref({})
const gameLists = ref([])
const installed = ref([])

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const recentGamesData = [
  { id: 1, title: 'Cyberpunk 2077 VR', time: '20.7 hrs', played: true },
  { id: 2, title: 'Elden Ring', time: '120.5 hrs', played: true },
  { id: 3, title: 'Starfield', time: '60.1 hrs', played: true },
  { id: 4, title: 'God of War', time: '45.0 hrs', played: true },
  { id: 5, title: 'Hogwarts Legacy', time: '88.3 hrs', played: true },
  { id: 6, title: "Baldur's Gate 3", time: '150.9 hrs', played: true }
]

const toggleRecentExpansion = (id) => {
  expandedRecentId.value = id
}

const listScroll = (target) => {
  const el = target.value;
  if (!el) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  el.addEventListener('mousedown', (e) => {
    isDown = true;
    el.classList.add('active');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });

  el.addEventListener('mouseleave', () => {
    isDown = false;
  });

  el.addEventListener('mouseup', () => {
    isDown = false;
  });

  el.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度
    el.scrollLeft = scrollLeft - walk;
  });
}

const generateHash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return hash.toString()
}

onMounted(() => {
  listScroll(newsListRef);
  listScroll(favoriteRef);
  listScroll(recentRef);
});
</script>

<style lang="scss" scoped>
.right-panel {
  background: var(--main-bg-color);
  color: var(--text-color);
  font-family: var(--text-family);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 20px 0 20px;
  overflow-y: auto;
}

.gnc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .gnc-more {
    font-size: 12px;
    cursor: pointer;
  }
}

.game-news-container,
.recent-games-container,
.favorite-container {
  width: 100%;
  margin-bottom: 20px;
}

.game-news-title,
.recent-games-title,
.favorite-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: normal;
  line-height: 23px;
  font-weight: 600;
  color: var(--title-color);
  letter-spacing: 0px;
}

.game-news-container .game-news-item-wrapper {
  position: relative;
}

.game-news-container .game-news-item-wrapper .news-title {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  // background: rgba(0, 0, 0, 0.3);
  background: #20232E;

  width: -webkit-fill-available;
  height: auto;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.game-news-container .game-news-item-wrapper .news-title p {
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-weight: normal;
  line-height: 15px;
  letter-spacing: 0px;
  color: #FFFFFF;
  text-align: left;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.game-news-container .game-news-lists {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  .news-thumbnails {
    width: 250px;
    height: 135px;
  }

  .news-thumbnails img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
}

.recent-games-lists {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}


.recent-games-container .game-card-wrapper {
  flex: 0 0 auto;
  height: 160px;
  width: 120px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);

  &.is-expanded {
    width: 240px;
  }
}

.recent-games-container .game-card {
  width: 100%;
  height: 160px;
  background-color: #e6f0ff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.recent-games-container .card-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 10px;

  .icon-play {
    background: #4caf50;
    padding: 4px 8px;
    border-radius: 4px;
    margin-right: 10px;
  }

  .title {
    font-size: 14px;
    margin: 0;
  }

  .time {
    font-size: 12px;
    opacity: 0.8;
    margin: 0;
  }
}

.favorite-container .favorite-lists {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  scrollbar-width: none;
  color: var(--title-color);

  &::-webkit-scrollbar {
    display: none;
  }

  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  .favorite-item .favorite-item-wrapper img {
    width: 240px;
    height: 132px;
    object-fit: cover;
    border-radius: 5px;
  }
}
</style>