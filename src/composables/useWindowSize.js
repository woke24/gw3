import { ref, onMounted, onUnmounted } from 'vue';

function throttle (fn, delay) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, delay);
    }
  };
}

export function useWindowSize (throttleDelay = 100) {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const updateSize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    const throttledUpdate = throttle(updateSize, throttleDelay);
    window.addEventListener('resize', throttledUpdate);

    onUnmounted(() => {
      window.removeEventListener('resize', throttledUpdate);
    });
  });

  return { width, height };
}