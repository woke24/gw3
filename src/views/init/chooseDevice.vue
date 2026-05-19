<template>
  <div class="device-selector">
    <h2>Choose Your Device</h2>

    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.id" :class="{ 'active-tab': activeTab === tab.id }"
        @click="setActiveTab(tab.id)">
        {{ tab.name }}
      </button>
    </div>

    <div class="device-list-container">
      <button class="nav-arrow left-arrow" @click="scrollListLeft" :class="{ 'hidden-arrow': !showLeftArrow }"
        :disabled="!showLeftArrow">
        &lt;
      </button>

      <div class="device-list" ref="deviceListRef" @mousedown="onMouseDown" @mouseup="onMouseUp"
        @mousemove="onMouseMove" @mouseleave="onMouseLeave">
        <div class="device-card" v-for="device in filteredDevices" :key="device.id">
          <div class="image-placeholder">
            <img :src="device.img" alt="" v-nodrag></img>
          </div>
          <div class="device-name">{{ device.name }}</div>
        </div>
      </div>

      <button class="nav-arrow right-arrow" @click="scrollListRight" :class="{ 'hidden-arrow': !showRightArrow }"
        :disabled="!showRightArrow">
        &gt;
      </button>
    </div>

    <div class="actions">
      <button class="continue-button">Continue</button>
      <button class="back-button">Back</button>
    </div>

    <p class="quest-link">
      Do you want to play games on the Quest? <a href="#">Click here.</a>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const scrollPosition = ref(0);

import ultraImg from '@/assets/product/ultra.png';
import enhancedImg from '@/assets/product/plus_enhanced.png';
import plusImg from '@/assets/product/plus.png';
import coreImg from '@/assets/product/core.png';
import walkcImg from '@/assets/product/walk_c.png';
import locosImg from '@/assets/product/loco_s.png';
import locoImg from '@/assets/product/loco.png';
import armbandImg from '@/assets/product/product_armband.png';
import vehicleImg from '@/assets/product/vehicle.png';

const allDevices = [
  { id: 'walk-c3-ultra', name: 'KAT Walk C 3 Ultra', img: ultraImg, series: 'C Series', all: true },
  { id: 'walk-c2-plus-e', name: 'KAT Walk C 2 Plus Enhanced', img: enhancedImg, series: 'C Series', all: true },
  { id: 'walk-c2-plus', name: 'KAT Walk C 2 Plus', img: plusImg, series: 'C Series', all: true },
  { id: 'walk-c2-core', name: 'KAT Walk C 2 Core', img: coreImg, series: 'C Series', all: true },
  { id: 'walk-c', name: 'KAT Walk C', img: walkcImg, series: 'C Series', all: true },
  { id: 'loco-s', name: 'KAT loco S', img: locosImg, series: 'loco Series', all: true },
  { id: 'loco', name: 'KAT loco', img: locoImg, series: 'loco Series', all: true },
  { id: 'vr-armband', name: 'KAT VR Armband', img: armbandImg, series: 'Accessories', all: true },
  { id: 'vehicle-hub', name: 'KAT Vehicle Hub', img: vehicleImg, series: 'Accessories', all: true }
];

const tabs = [
  { id: 'all', name: 'All Device' },
  { id: 'c', name: 'C Series' },
  { id: 'loco', name: 'loco Series' },
  { id: 'accessories', name: 'Accessories' },
];

const activeTab = ref('all');
const deviceListRef = ref(null);
const CARD_WIDTH = ref(180);
let isDragging = false;
let startX = 0;
let scrollStart = 0;

const filteredDevices = computed(() => {
  if (activeTab.value === 'all') {
    return allDevices;
  }
  return allDevices.filter((device) => {
    if (activeTab.value === 'c') return device.series === 'C Series';
    if (activeTab.value === 'loco') return device.series === 'loco Series';
    if (activeTab.value === 'accessories') return device.series === 'Accessories';
    return false;
  });
});

const updateScrollPosition = () => {
  const list = deviceListRef.value;
  if (list) {
    scrollPosition.value = list.scrollLeft;
  }
};

const showLeftArrow = computed(() => {
  const list = deviceListRef.value;
  if (!list || scrollPosition.value === null) return false;

  if (list.scrollWidth <= list.clientWidth) {
    return false;
  }

  return scrollPosition.value > 1;
});

const showRightArrow = computed(() => {
  const list = deviceListRef.value;
  if (!list || scrollPosition.value === null) return false;

  if (list.scrollWidth <= list.clientWidth) {
    return false;
  }

  const maxScroll = list.scrollWidth - list.clientWidth;

  return scrollPosition.value < maxScroll - 1;
});

const scrollListBy = (direction) => {
  const list = deviceListRef.value;
  if (list) {
    list.scrollBy({
      left: direction * CARD_WIDTH.value,
      behavior: 'smooth',
    });
  }
};

const scrollListLeft = () => {
  scrollListBy(-1);
  updateScrollPosition();
};

const scrollListRight = () => {
  scrollListBy(1);
  updateScrollPosition();
};

const onMouseDown = (event) => {
  isDragging = true;
  startX = event.clientX;
  scrollStart = deviceListRef.value.scrollLeft;
};

const onMouseMove = (event) => {
  if (!isDragging) return;

  const dx = event.clientX - startX;
  deviceListRef.value.scrollLeft = scrollStart - dx;
};

const onMouseUp = () => {
  isDragging = false;
};

const onMouseLeave = () => {
  isDragging = false;
};

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

const footerChange = () => {
  store.commit('app/showFooterChange', false)
}

watch(filteredDevices, async () => {
  await nextTick();

  const list = deviceListRef.value;
  if (list) {
    list.scrollLeft = 0;
    updateScrollPosition();
  }
});

onMounted(() => {
  footerChange()
  updateScrollPosition();
});

onUnmounted(() => {
});
</script>

<style scoped>
.device-selector {
  text-align: center;
  max-width: calc(100%) - 160px;
  margin: 0 auto;
  padding-top: 2em;
}

.device-selector h2 {
  margin: 0 0 24px 0;
}

.device-selector .tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}

.device-selector .tabs button {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.device-selector .tabs .active-tab {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.device-selector .device-list-container {
  position: relative;
  margin: 0 80px;
}

.device-selector .device-list {
  display: flex;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  gap: 15px;
  user-select: none;
  cursor: grab;
}

.device-selector .device-list::-webkit-scrollbar {
  display: none;
}

.device-selector .device-card {
  flex-shrink: 0;
  width: calc(100% / 4.6);
  padding: 0;
  border: 1px solid #eee;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  user-select: none;
  -webkit-user-drag: none;
}

.device-selector .image-placeholder {
  width: auto;
  min-height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.device-selector .device-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: 0px;
  color: var(--title-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7.5px;
  background: #EEEEEE;
}

.device-selector .nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.8;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s;
}

.device-selector .nav-arrow.hidden-arrow {
  opacity: 0.6;
  cursor: default;
  background-color: #D8D8D8;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
}

.device-selector .nav-arrow:not([disabled]):hover {
  opacity: 1;
}

.device-selector .left-arrow {
  left: 0;
}

.device-selector .right-arrow {
  right: 0;
}

.device-selector .actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.device-selector .continue-button {
  padding: 10px 40px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
}

.device-selector .back-button {
  padding: 10px 40px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  background-color: #e0e0e0;
  color: #333;
  border: 1px solid #ccc;
}

.device-selector .quest-link {
  margin-top: 20px;
  font-size: small;
}

.device-selector .quest-link a {
  color: #007bff;
}
</style>
