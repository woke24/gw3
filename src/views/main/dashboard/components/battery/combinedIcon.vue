<template>
  <div v-if="capacity > 0" class="combined-icon-container">
    <i :class="['main-icon fas', iconClass]"></i>

    <BatteryBar :capacity="capacity" :isCharging="isCharging" :isVertical="isVertical" class="battery-overlay" />
  </div>
</template>

<script>
import BatteryBar from './batteryBar.vue';

export default {
  name: 'CombinedIcon',
  components: {
    BatteryBar
  },
  props: {
    isCharging: {
      type: Boolean,
      default: false
    },
    iconType: {
      type: String,
      required: true,
      validator: (value) => ['clock', 'steps', 'watch'].includes(value)
    },
    capacity: {
      type: [Number, String],
      default: 100
    },
    isVertical: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    iconClass () {
      switch (this.iconType) {
        case 'clock':
          return 'fa-clock';
        case 'steps':
          return 'fa-shoe-prints';
        case 'watch':
          return 'fa-watch-heart';
        default:
          return 'fa-question-circle';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.combined-icon-container {
  position: relative;
  font-size: 5em;
  color: #00bcd4;
}

.main-icon {
  z-index: 1;
}

.battery-overlay {
  position: absolute;
  z-index: 2;
  bottom: 2px;
  left: 8px;
  transform: scale(0.35);
}
</style>