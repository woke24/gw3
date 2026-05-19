<template>
  <div class="dashboard-layout">
    <h2 class="section-title">Recent Games</h2>
    <div class="cards-list">
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

    <h2 class="section-title">Community Activity: Your Recent Played Games</h2>
    <div class="cards-list cards-list--no-interact">
      <div v-for="game in communityGamesData" :key="game.id" class="game-card-wrapper game-card-wrapper--simple">
        <div class="game-card">
          <div class="card-content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const recentGamesData = [
  { id: 1, title: 'Cyberpunk 2077 VR', time: '20.7 hrs', played: true }, // 卡片信息会显示
  { id: 2, title: 'Elden Ring', time: '120.5 hrs', played: true }, // 卡片信息不会显示
  { id: 3, title: 'Starfield', time: '60.1 hrs', played: true }, // 卡片信息会显示 (如果被点击展开)
  { id: 4, title: 'God of War', time: '45.0 hrs', played: true },
  { id: 5, title: 'Hogwarts Legacy', time: '88.3 hrs', played: true },
  { id: 6, title: "Baldur's Gate 3", time: '150.9 hrs', played: true }
]

const communityGamesData = [
  { id: 10, title: 'COD: MW', time: '5.0 hrs', played: false },
  { id: 11, title: 'Apex Legends', time: '12.0 hrs', played: false },
  { id: 12, title: 'Diablo IV', time: '40.0 hrs', played: false },
  { id: 13, title: 'League of Legends', time: '99.0 hrs', played: false },
  { id: 14, title: 'Minecraft', time: '200.0 hrs', played: false },
  { id: 15, title: 'Forza Horizon', time: '30.0 hrs', played: false }
]

const expandedRecentId = ref(1)

const toggleRecentExpansion = (id) => {
  expandedRecentId.value = id
}



</script>

<style scoped>
.dashboard-layout {
  position: relative;
}

.section-title {
  color: #409eff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: left;
}

.section-title--secondary {
  margin-top: 25px;
}

.cards-list {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 10px;
  padding-bottom: 10px;
  scrollbar-width: none;
}

.cards-list::-webkit-scrollbar {
  display: none;
}

.game-card {
  width: 100%;
  height: 160px;
  min-height: 160px;

  background-color: #e6f0ff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
}

.game-card-wrapper--interactive {
  flex: 1 1 60px;
  cursor: pointer;
  transition: flex 0.4s ease-out;
}

.game-card-wrapper--interactive.is-expanded {
  flex-grow: 5;
}

.cards-list--no-interact .game-card-wrapper--simple {
  flex: 1;
  cursor: pointer;
  transition: none;
}

.card-content {
  height: 100%;
  width: 100%;
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  background-color: rgba(100, 100, 100, 0.7);
  color: white;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  font-size: 12px;
}

.card-info .icon-play {
  background-color: #4caf50;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 10px;
  flex-shrink: 0;
}

.card-info .title {
  margin: 0;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info .time {
  margin: 0;
  color: #ccc;
  font-size: 11px;
  white-space: nowrap;
}
</style>
