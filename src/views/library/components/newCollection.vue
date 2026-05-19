<template>
  <!-- 抽屉组件 -->
  <el-drawer
    v-model="showDrawer"
    title="New collection"
    direction="btt"
    size="200px"
    @close="handleClose"
    :destory-on-close="true"
  >
    <!-- 内容区域 -->
    <div style="width: 200px; margin: 0 auto;">
      <el-input
        v-model="collectionName"
        placeholder="Collection name"
        clearable
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div style="display:flex;justify-content:center;gap:12px">
        <el-button @click="handleClose">Close</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  gameData: {
    type: Object,
    default: {}
  }
})

// 自定义事件（向父组件发送关闭/保存）
const emit = defineEmits(['close', 'save'])

// 抽屉内部受控显示状态
const showDrawer = ref(false)

// 表单数据
const collectionName = ref('')

// 监听父组件参数，同步显示/隐藏
watch(
  () => props.visible,
  (val) => {
    showDrawer.value = val
    if (val) collectionName.value = ''
  },
  { immediate: true }
)

// 关闭抽屉
const handleClose = () => {
  showDrawer.value = false
  emit('close', false)
}

// 保存
const handleSave = () => {
  showDrawer.value = false
  emit('save')
}
</script>

<style scoped>
</style>