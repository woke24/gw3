<template>
  <el-container class="settings-container-main">
    <!-- 左侧导航 -->
    <el-aside class="settings-aside">
      <div class="settings-menu-title">Settings</div>
      <el-menu
        :default-active="currentTab"
        class="el-menu-vertical-demo"
        @select="handleTabChange"
      >
        <el-menu-item index="account">
           <SvgIcon name="account" height="20px" width="20px" />
          <span class="itme-title">Account</span>
        </el-menu-item>
        <el-menu-item index="general">
          <SvgIcon name="general" height="20px" width="20px" />
          <span class="itme-title">General</span>
        </el-menu-item>
        <el-menu-item index="about">
          <SvgIcon name="about" height="20px" width="20px" />
          <span class="itme-title">About</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容区 -->
    <el-container>
      <el-main class="settings-right">
        <keep-alive>
          <component :is="currentComponent" />
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'

// 导入子组件
import account from '@/views/settings/components/account.vue'
import general from '@/views/settings/components/general.vue'
import about from '@/views/settings/components/about.vue'

// 当前激活的标签
const currentTab = ref('account')

// 根据当前标签切换对应的组件
const currentComponent = computed(() => {
  switch (currentTab.value) {
    case 'account':
      return account
    case 'general':
      return general
    case 'about':
      return about
    default:
      return account
  }
})

// 处理标签切换
const handleTabChange = (val) => {
  currentTab.value = val
}
</script>

<style lang="scss" scoped>
.settings-container-main {
  background: var(--main-bg-color);
  color: var(--text-color);
  font-family: var(--text-family);
  height: 100%;
  .settings-aside {
    width: 200px;
    background: var(--sidebar-bg-color);
    border-right: 1px solid rgba(103, 112, 123, 0.3);
  }
  .settings-menu-title {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    text-align: left;
    font-weight: 600;
    // font-size: 18px;
    color: var(--title-color);
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    background: var(--sidebar-bg-color);
  }
  .el-menu-item {
    color: var(--text-color);
    height: 30px;
    margin-bottom: 12px;
    font-size: 12px;
  }
  .el-menu-item.is-active, .el-menu-item:hover {
    background: #3E4E69;
    color: var(--brand-color);
  }
  .itme-title {
    margin-left: 8px;
  }
}
.settings-right {
  background: var(--main-bg-color);
}
// .el-main-box> .el-container{
//   height: 100% !important;
// }
// .el-menu-item.is-active {
//   background: #ededed;
// }
// :deep(.el-aside) {
//   border-right: 1px solid #dcdfe6;
//   background-color: #fff !important;
// }


// .el-main-box> .el-container>.el-container :deep(.el-main) {
//   background: #fafafa !important;
// }
</style>