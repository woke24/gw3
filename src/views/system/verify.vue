<template>
  <div class="gateway-verify-page">
    <div class="gateway-verify-head">
      <div class="gateway-verify-icon">
        <img :src="verify" alt="Verify Email" width="50" height="50" v-nodrag />
      </div>
      <div class="gateway-verify-title">
        <span>Verify Email</span>
      </div>
    </div>
    <div class="gateway-verify-divider">
      <span class="verify-tips">Let me verify your email before the next step</span>
    </div>
    <div class="gateway-verify-form">
      <el-form ref="verifyFormRef" :model="verifyForm" :rules="verifyRules" size="large" label-position="right"
        :label-width="formLabelWidth">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Email" prop="email" required>
              <el-input v-model="verifyForm.email" autocomplete="off" placeholder="Enter Your Email Address" clearable
                style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="gateway-verify-footer">
      <div :class="['verify-button', isValidEmail ? 'active' : 'inactive']">
        <el-button type="primary" @click="handleVerify">Get Verification Code</el-button>
      </div>
      <div class="gateway-have-account">
        <div class="have-account-tips">
          <span>Already have KAT account?</span>
        </div>
        <div class="login-btn">
          <el-button type="text" @click="$emit('switch-to-sign-in')">Login</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { checkEmail, sendEmailCode } from '@/api/user'
import { ElButton, ElDivider, ElMessage } from 'element-plus'
import verify from '@/assets/register/verify.png'

const store = useStore()
const router = useRouter()
const route = useRoute()

const formLabelWidth = '60px'
const verifyFormRef = ref(null)

const isValidEmail = ref(false)

// Form
const verifyForm = reactive({
  email: ''
})

const emit = defineEmits(['switch-to-code-verify'])

const validateEmail = async (rule, value, callback) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  if (!value) {
    callback(new Error('Please Enter Your Email Address'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('Please enter a valid email'))
  } else {
    const NAMESPACE = 'user'
    const isForgotPassword = computed(() => store.getters[`${NAMESPACE}/getIsForgot`])

    console.log('isForgotPassword:', isForgotPassword.value)

    if (isForgotPassword.value) {
      const isEmailExist = await checkUserEmail(value)
      if (isEmailExist) {
        callback()
      } else {
        callback(new Error('An account for this email already not exists!'))
      }
    } else {
      const isEmailExist = await checkUserEmail(value)
      if (isEmailExist) {
        callback(new Error('An account for this email already exists!'))
      } else {
        callback()
      }
    }
  }
}

const verifyRules = reactive({
  email: [{ validator: validateEmail, trigger: 'blur' }]
})

const handleVerify = async () => {
  verifyFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('form is valid:', verifyForm)
      isValidEmail.value = true

      await sendEmail()
    } else {
      isValidEmail.value = false
      return false
    }
  })
}

const checkUserEmail = async (email) => {
  try {
    const res = await checkEmail({
      email: email
    })

    if (res.code === 20000 && res.data) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Error checking email existence:', error)
    return false
  }
}

const sendEmail = async () => {
  try {
    const res = await sendEmailCode({
      recipient: verifyForm.email
    })
    if (res.code === 20000 && res.data) {
      ElMessage.success('Email sent successfully!')
      emit('switch-to-code-verify', verifyForm.email)
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

watch(
  () => verifyForm.email,
  async () => {
    if (!verifyFormRef.value) return
    try {
      await verifyFormRef.value.validateField('email')
      isValidEmail.value = true
    } catch {
      isValidEmail.value = false
    }
  }
)

const handleFormReset = async () => {
  await nextTick()

  if (verifyFormRef.value) {
    verifyFormRef.value.resetFields()
  }
}

onMounted(() => {
  handleFormReset()
})
</script>

<style scoped>
.gateway-verify-head {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.gateway-verify-divider {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.gateway-verify-divider .verify-tips {
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0em;
  color: #ffcc00;
}

.gateway-verify-form {
  margin-top: 10px;
}

.gateway-verify-head .gateway-verify-title {
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

:deep(.el-checkbox__label) {
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0em;
  color: var(--title-color);
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: var(--title-color);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #05c3de;
  border-color: #05c3de;
}

.gateway-verify-footer .verify-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1em;
}

.gateway-verify-footer .verify-button button {
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

.gateway-verify-footer .verify-button.inactive button {
  max-width: 100%;
  background-color: #aaaaaa;
  color: #ffffff;
  border-color: #aaaaaa;
  cursor: pointer;
}

.gateway-verify-footer .verify-button.active button {
  background-color: #05c3de;
  color: #ffffff;
  border-color: #05c3de;
  cursor: pointer;
}

.gateway-verify-footer .gateway-have-account {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.gateway-verify-footer .gateway-have-account .have-account-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0em;
  /* color: var(--title-color); */
  color: var(--text-color);
}

.gateway-verify-footer .gateway-have-account .login-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.gateway-verify-footer .gateway-have-account .login-btn button {
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0em;
  color: #05c3de;
}
</style>

<style></style>
