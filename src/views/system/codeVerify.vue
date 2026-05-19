<template>
  <div class="gateway-code-page">
    <div class="gateway-code-head">
      <div class="gateway-code-icon">
        <img :src="verify" alt="Email Icon" width="50" height="50" v-nodrag />
      </div>
      <div class="gateway-code-title">
        <span>Email Has Been Sent</span>
      </div>
    </div>
    <div class="gateway-code-divider">
      <span class="code-tips">We have sent an email to your email address</span>
    </div>
    <div class="gateway-code-form">
      <el-form ref="codeFormRef" :model="codeForm" :rules="codeRules" size="large" label-position="right"
        :label-width="formLabelWidth">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Code" prop="code" required>
              <el-input v-model="codeForm.code" autocomplete="off" placeholder="Enter Code" clearable
                style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="gateway-code-footer">
      <div :class="['code-button', isValidCode ? 'active' : 'inactive']">
        <el-button type="primary" @click="handleVerify">
          Verify
          <span v-show="countDown > 0" style="margin-left: 6px;font-size: 14px;" class="count-down">({{ countDown
            }}s)</span>
        </el-button>
      </div>
      <div class="gateway-code-tips">
        <div class="code-text">
          <span style="color: var(--text-color);">Don't receive an email?</span>
        </div>
        <div class="resent-btn">
          <el-button type="text" :disabled="!canResend" @click="handleResend">Resend Code</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElButton, ElDivider, ElMessage } from 'element-plus'
import verify from '@/assets/register/verify.png'

const store = useStore()
const router = useRouter()
const route = useRoute()

const formLabelWidth = '60px'
const codeFormRef = ref(null)

const isValidCode = ref(false)

const canResend = computed(() => countDown.value <= 0)

const props = defineProps({
  sendCode: {
    type: Boolean,
    default: false
  }
})

// Count Down
const countDown = ref(60)
const startCountdown = () => {
  countDown.value = 60
  const timer = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) {
      clearInterval(timer)
      // 倒计时结束，可以启用重新发送
    }
  }, 1000)
}

watch(
  () => props.sendCode,
  (val) => {
    if (val) {
      startCountdown()
    }
  },
  { immediate: true }
)
// Form
const codeForm = reactive({
  code: ''
})

const emit = defineEmits(['switch-to-verify'])

const validateCode = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please Enter Code'))
  } else {
    callback()
  }
}

const codeRules = reactive({
  code: [{ validator: validateCode, trigger: 'blur' }]
})

const handleVerify = () => {
  codeFormRef.value.validate((valid) => {
    if (valid) {
      console.log('form is valid:', codeForm)
      isValidCode.value = true
      emit('switch-to-verify', codeForm.code)
    } else {
      isValidCode.value = false
      return false
    }
  })
}

const handleResend = () => {
  emit('switch-to-resend')
}

const handleFormReset = async () => {
  await nextTick()

  if (codeFormRef.value) {
    codeFormRef.value.resetFields()
  }
}



watch(
  () => codeForm.code,
  async () => {
    if (!codeFormRef.value) return
    try {
      await codeFormRef.value.validateField('code')
      isValidCode.value = true
    } catch {
      isValidCode.value = false
    }
  }
)

onMounted(() => {
  handleFormReset()
})
</script>

<style scoped>
.gateway-code-head {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.gateway-code-divider {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.gateway-code-divider .code-tips {
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0em;
  color: #ffcc00;
}

.gateway-code-form {
  margin-top: 10px;
}

.gateway-code-head .gateway-code-title {
  font-size: 24px;
  font-weight: bold;
  line-height: 28.08px;
  letter-spacing: 0em;
  /* color: var(--title-color); */
  color: var(--title-color);
}

:deep(.el-form-item__label) {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0em;
  color: var(--title-color);
}

.gateway-code-footer .code-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1em;
}

.gateway-code-footer .code-button button {
  padding: 10px 50px;
  width: calc(100%);
  height: 44px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  text-transform: capitalize;
  letter-spacing: 0em;
  cursor: pointer;
}

.gateway-code-footer .code-button.inactive button {
  max-width: 100%;
  background-color: #aaaaaa;
  color: #ffffff;
  border-color: #aaaaaa;
  cursor: pointer;
}

.gateway-code-footer .code-button.active button {
  background-color: #05c3de;
  color: #ffffff;
  border-color: #05c3de;
  cursor: pointer;
}

.gateway-code-footer .gateway-code-tips {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.gateway-verify-footer .gateway-code-tips .code-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0em;
  /* color: var(--title-color); */
}

.gateway-verify-footer .gateway-code-tips .resent-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.gateway-verify-footer .gateway-code-tips .resent-btn button {
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0em;
  color: #05c3de;
}
</style>

<style></style>
