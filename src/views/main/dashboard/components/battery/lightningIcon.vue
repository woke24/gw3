<template>
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="lightning-icon">
    <path d="M13 3.5L4 16.5H12L11 20.5L20 7.5H12L13 3.5Z" fill="white" stroke="none" />
  </svg>
</template>

<script>
export default {
  name: 'LightningIcon',
};
</script>

<style scoped>
.lightning-icon {
  width: 100%;
  height: 100%;
  display: block;
  fill: white;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.6));
}
</style>