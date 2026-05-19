<template>
  <div :class="['battery-container', { 'vertical': isVertical, 'isCharging': isCharging }]">
    <div v-if="isVertical" class="battery-cap"></div>

    <div class="shell">
      <div v-for="index in 6" :key="index" class="block" :style="{
        background: (isVertical ? (index <= (6 - batteryChunk) ? 'transparent' : batteryColor) : (index > batteryChunk ? 'transparent' : batteryColor))
      }"></div>
    </div>

    <div v-if="isCharging" class="charging-overlay">
      <LightningIcon class="charging-icon-svg" />
    </div>
  </div>
</template>

<script>
import LightningIcon from './LightningIcon.vue';

export default {
  name: 'BatteryBar',
  components: {
    LightningIcon
  },
  props: {
    capacity: {
      type: [Number, String],
      default: 0
    },
    isCharging: {
      type: Boolean,
      default: false
    },
    isVertical: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    batteryChunk () {
      const num = Math.min(100, Math.max(0, Number(this.capacity)));
      const intervalSize = 100 / 6;
      let interval = Math.floor(num / intervalSize);
      return interval;
    },
    batteryColor () {

      if (this.isCharging) {
        return '#64BA8C';
      }

      const count = this.batteryChunk;

      if (count <= 1) {
        return '#FE5F69';
      } else if (count > 1 && count <= 4) {
        return '#FFC95C';
      } else {
        return '#64BA8C';
      }
    }
  },
}
</script>

<style lang='scss' scoped>
.battery-container {
  width: 48px;
  height: 24px;
  border: 4px solid #DFE6EE;
  border-radius: 4px;
  position: relative;
  transform: scale(0.32);
  transform-origin: left top;

  .shell {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 2px;
    background: #F8FAFC;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-column-gap: 2px;

    .block {
      width: 100%;
      height: 100%;
    }
  }
}

.battery-container:after {
  display: none;
}

.battery-cap {
  display: none;
}

.battery-container.vertical {
  width: 24px;
  height: 48px;
  border: 4px solid #DFE6EE;
  border-radius: 4px;

  transform: scale(0.35);
  transform-origin: 50% 100%;

  .battery-cap {
    display: block;
    content: "";
    width: 12px;
    height: 4px;
    position: absolute;
    background: #DFE6EE;
    left: 0;
    right: 0;
    top: -8px;
    margin: 0 auto;
    border-radius: 1px;
  }

  .shell {
    padding: 2px;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
    grid-row-gap: 2px;
    flex-direction: column-reverse;
  }
}

.battery-container:not(.vertical) {
  .shell {
    display: flex;
    grid-template-columns: none;
    gap: 2px;
  }
}

.charging-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.charging-icon {
  font-size: 1.5em;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.battery-container.vertical {
  .charging-icon {
    font-size: 1em;
  }
}

.battery-container.isCharging {
  animation: pulse-border 1.5s infinite alternate;
}

.charging-icon-svg {
  width: 50%;
  height: 50%;
}

.battery-container.vertical {
  .charging-icon-svg {
    width: 80%;
    height: 80%;
  }
}
</style>