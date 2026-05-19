<template>
  <div class="fitness-armview-container">
    <div v-if="armbandConnectedInfo.connected" class="fa-linked">
      <div class="fa-title">VR Armband</div>
      <div class="fa-battery">
        <span>Battery</span>
        <div class="sensor-armband-battery">
          <div class="sensor-status">
            <div v-if="armbandConnectedInfo.connected" class="connected"></div>
            <div v-else class="disconnected"></div>
          </div>
          <div class="sensor-battery">
            <Battery v-if="armbandConnectedInfo.connected" :quantity="armbandConnectedInfo.battery"
              :proIsCharge="false" />
          </div>
          <div class="battery-quatity" v-if="armbandConnectedInfo.connected && armbandConnectedInfo.battery > 0">
            <span v-if="parseInt(armbandConnectedInfo.battery) >= 30" class="battery-quatity-text"
              style="color: #13ce66">
              {{ parseInt(armbandConnectedInfo.battery) }}%
            </span>
            <span v-else-if="parseInt(armbandConnectedInfo.battery) >= 15" class="battery-quatity-text"
              style="color: #ffba00">
              {{ parseInt(armbandConnectedInfo.battery) }}%
            </span>
            <span v-else-if="parseInt(armbandConnectedInfo.battery) >= 1" class="battery-quatity-text"
              style="color: #ff4949">
              {{ parseInt(armbandConnectedInfo.battery) }}%
            </span>
          </div>
        </div>
      </div>
      <div class="fa-hr">
        <span>Heart Rate</span>
        <span :style="{ color: currentStatus.color, fontWeight: 600 }">
          {{ armbandConnectedInfo.heartRate }}
        </span>
      </div>
      <div :style="{ color: currentStatus.color }" class="fa-heart-status">
        <SvgIcon name="heartStatus" width="20px" height="20px" />
        <span>{{ currentStatus.text }}</span>
      </div>

    </div>
    <div v-else class="fa-unlink" @click="faToSite">
      <div>Get the</div>
      <div>VR Armband,</div>
      <div>unlock</div>
      <div>VR Armview!</div>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, shallowRef, reactive, computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const armbandConnectedInfo = computed(() => store.state.device.armbandInfo)

const HEART_ZONES = [
  { max: 0, text: 'No Device', class: 'status-no-device', color: '#87939e' },
  { max: 108, text: 'Warm up', class: 'status-warm-up', color: '#31aee6' },
  { max: 126, text: 'Fat burning', class: 'status-fat-burn', color: '#34c55b' },
  { max: 144, text: 'Aerobic', class: 'status-aerobic', color: '#ffcb01' },
  { max: 162, text: 'Anaerobic', class: 'status-anaerobic', color: '#fe9601' },
  { max: 999, text: 'Extreme', class: 'status-extreme', color: '#ff2e56' }
];


const currentStatus = computed(() => {
  const hr = armbandConnectedInfo.value?.heartRate ?? 0;
  const zone = HEART_ZONES.find(zone => hr <= zone.max) || HEART_ZONES[0]
  return {
    text: zone.text,
    color: zone.color
  }
});

const faToSite = () => {
  window.open('https://www.kat-vr.com/products/kat-smart-armband', '_blank')
}
</script>
<style lang="scss" scoped>
.fitness-armview-container {
  // background-color: #e0ebff;
  background-color: var(--nav-bg-color);
  color: var(--text-color);
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  text-align: left;
}

.fa-linked>div {
  margin-bottom: 10px;
}

.fa-linked .fa-title {
  font-weight: 600;
  color: #0066ff;
}

.fa-battery,
.fa-hr {
  display: flex;
  width: 50%;
  justify-content: space-between;

  span:nth-of-type(1) {
    color: #87939e;
    font-size: 14px;
  }
}

.fa-unlink {
  cursor: pointer;
}

.fa-unlink>div {
  line-height: 26px;
}

.fa-unlink>div:nth-of-type(even) {
  // color: #0066ff;
  color: var(--brand-color);
  font-weight: 600;
}

.fa-heart-status {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
}

.sensor-armband-battery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
}
.battery-quatity {
  width: 36px;
}
.connected {
  width: 7.38px;
  height: 7.38px;
  opacity: 1;
  background: #13ce66;
  border-radius: 8px;
}
.disconnected {
  width: 7.38px;
  height: 7.38px;
  opacity: 1;
  background: #ff3b30;
  border-radius: 8px;
}
.sensor-battery {
  transform: rotate(90deg);
}
.battery-quatity {
  width: 36px;
}
</style>
