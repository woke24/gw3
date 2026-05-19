<template>
  <svg aria-hidden="true" class="SvgIcon" :width="width" :height="height">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
  <!-- 
   引用示例：<SvgIcon name="equipment" width="48px" height="48px" />
  -->
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '1em'
    },
    height: {
      type: String,
      default: '1em'
    }
  }
}
</script>

<style scoped>
.SvgIcon {
  font-size: inherit;
  fill: currentColor;
  text-indent: 0;
}
</style>