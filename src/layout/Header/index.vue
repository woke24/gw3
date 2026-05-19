<template>
  <header class="gw3-header">
    <div class="left-container">
      <el-icon style="font-size: 28px; cursor: pointer" @click="handleBack()">
        <Back />
      </el-icon>
    </div>
    <div class="logo-container">
      <img src="@/assets/images/nav_logo.png" alt="logo" @click="goIndex" />
    </div>
    <div class="middle-container">
      <TopNav />
    </div>
    <div class="right-container">
      <!-- 用户信息 -->
      <div class="user-info">
        <el-dropdown>
          <span class="el-dropdown-link">
            {{ userInfo?.userName }}
            <i class="sfont system-xiala"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div>
                  <!-- <div>
                    <el-avatar
                      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                    />
                  </div> -->
                  <router-link to="/settings/personalCenter">
                    <div>{{ userInfo?.userName }}</div>
                    <div>{{ userInfo?.email }}</div>
                  </router-link>
                </div>
              </el-dropdown-item>
              <el-divider />
              <el-dropdown-item>View my profile</el-dropdown-item>
              <el-divider />
              <el-dropdown-item>
                <router-link to="/settings/index">
                  <div>Settings</div>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>Guides</el-dropdown-item>
              <el-dropdown-item>Help & Feedback</el-dropdown-item>
              <el-dropdown-item>Check for Updates</el-dropdown-item>
              <el-divider />
              <el-dropdown-item @click="showPasswordLayer">
                {{ $t('message.system.changePassword') }}
              </el-dropdown-item>
              <el-dropdown-item @click="loginOut">
                {{ $t('message.system.loginOut') }}
              </el-dropdown-item>
              <el-dropdown-item @click="handleClose">Exit</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 快捷功能按钮 -->
      <div class="function-list">
        <div class="function-list-item hidden-sm-and-down" @click="handleMinimized">
          <Minus />
        </div>
        <div class="function-list-item hidden-sm-and-down" @click="handleMaximized"><Full-screen /></div>
        <!-- <div class="function-list-item">
          <Word />
        </div> -->
        <div class="function-list-item">
          <Close @click="dialogVisible = true" />
        </div>
      </div>
    </div>
  </header>
  <el-dialog v-model="dialogVisible" title="Are you sure to exit?" destroy-on-close width="500" draggable
    class="gw-dialaog">
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" class="cancel-btn">Cancel</el-button>
        <el-button @click="confirmClose" class="confirm-btn" type="primary">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="js" setup>
import { ref, computed, reactive, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { Back, Minus, Close } from '@element-plus/icons'
import FullScreen from './functionList/fullscreen.vue'
import TopNav from '@/components/topNav/index.vue'
import Word from './functionList/word.vue'
import { setFormState, getFormState, formClose } from '@/utils/system'
// import SizeChange from './functionList/sizeChange.vue'
// import Github from './functionList/github.vue'
import Theme from './functionList/theme.vue'
// import Breadcrumb from './Breadcrumb.vue'
import PasswordLayer from './passwordLayer.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const layer = reactive({
  show: false,
  showButton: true
})
// const isCollapse = computed(() => store.state.app.isCollapse)
// isCollapse change to hide/show the sidebar
// const opendStateChange = () => {
//   store.commit('app/isCollapseChange', !isCollapse.value)
// }

const NAMESPACE = 'user'
const userInfo = computed(() => store.getters[`${NAMESPACE}/getUserInfo`])

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host

const windowState = ref('Normal')

// login out the system
const loginOut = () => {
  store.dispatch('user/loginOut')
}

const showPasswordLayer = () => {
  layer.show = true
}
const handleBack = () => {
  router.back()
}

const handleMinimized = async () => {
  await setFormState(host, 1)
}

const handleMaximized = async () => {
  windowState.value = windowState.value === 'Maximized' ? 'Normal' : 'Maximized'
  await setFormState(host, windowState.value === 'Maximized' ? 2 : 0)
}

const dialogVisible = ref(false)

const handleClose = async () => {
  await formClose(host)
}

const confirmClose = async () => {
  await formClose(host)
  dialogVisible.value = false
}

const goIndex = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  // background-color: var(--system-header-background);
  background: var(--nav-bg-color);
  color: var(--title-color);
  font-family: var(--text-family);
  border-bottom: 1px solid var(--divider-color);
  padding: 0 20px;
  -webkit-app-region: drag;

  .middle-container {
    :deep(.el-tabs__item) {
      color: var(--title-color);
      font-size: var(--title-font-size);
    }

    :deep(.el-tabs__item.is-active),
    :deep(.el-tabs__item:hover) {
      color: var(--brand-color);
    }

    :deep(.el-tabs__active-bar) {
      background-color: var(--brand-color);
    }
  }


}

.left-container {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.middle-container {
  display: flex;
  align-items: center;
  flex-basis: 66%;
  cursor: pointer;
}

.right-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .function-list {
    display: flex;

    .function-list-item {
      width: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 15px;

      :deep(i) {
        color: var(--system-header-text-color);
      }
    }
  }

  .user-info {
    margin-left: 15px;
    padding: 7px;
    background: #272D37;
    border-radius: 5px;

    .el-dropdown-link {
      // color: var(--system-header-breadcrumb-text-color);
      color: var(--brand-color);
      font-size: 12px;
    }
  }
}

.head-fold {
  font-size: 20px;
}

.el-divider--horizontal {
  margin: 4px 0;
}

.dialog-footer {
  text-align: right;
}
</style>
