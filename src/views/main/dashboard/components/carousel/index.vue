<template>
  <el-carousel class="carousel-container" :height="carouselHeight" arrow="always">
    <el-carousel-item v-for="item in 4" :key="item">
      <h3 text="2xl" justify="center" :style="{ lineHeight: carouselHeight }">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'Carousel',
  setup () {
    const carouselHeight = ref('240px');

    const setCarouselHeight = () => {
      const windowHeight = window.innerHeight;
      const newHeight = Math.floor(windowHeight * 0.34);
      carouselHeight.value = `${newHeight}px`;
    };

    onMounted(() => {
      setCarouselHeight();
      window.addEventListener('resize', setCarouselHeight);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', setCarouselHeight);
    });

    return {
      carouselHeight
    };
  }
}
</script>

<style scoped>
.el-carousel__container {
  overflow: hidden;
}

.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  margin: 0;
  justify-content: center;
  align-items: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>