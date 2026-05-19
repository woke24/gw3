<template>
  <div class="main-container">
    <component :is="currentView" @switch-view="handleViewSwitch"></component>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import main from './main.vue';
import pair from './detection.vue';
import sensorPair from './walkc2/pair.vue';

const route = useRoute();
const currentView = ref(main);

const componentMap = {
  'main': main,
  'pair': pair,
  'sensorPair': sensorPair
};

const handleViewSwitch = (targetName) => {
  if (componentMap[targetName]) {
    // 切换组件
    currentView.value = componentMap[targetName];
  }
};

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath.startsWith('/device/index') && currentView.value !== main) {
      currentView.value = main;
    }
  },
  {
    immediate: true
  }
);

</script>