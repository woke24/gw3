<template>
  <div class="gateway-reset-page">
    <div class="gateway-reset-head">
      <div class="gateway-reset-icon">
        <img :src="reset" alt="Reset Password" width="50" height="50" v-nodrag />
      </div>
      <div class="gateway-reset-title">
        <span>Reset Password</span>
      </div>
    </div>
    <div class="gateway-reset-divider">
      <span class="reset-tips">Change your password now.</span>
    </div>
    <div class="gateway-reset-form">
      <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" size="large" label-position="right"
        :label-width="formLabelWidth">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Password" prop="newPassword" required>
              <el-input v-model="resetForm.newPassword" type="password" show-password autocomplete="off"
                placeholder="Enter New Password" clearable style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Password Again" prop="confirmPassword" required>
              <el-input v-model="resetForm.confirmPassword" type="password" show-password autocomplete="off"
                placeholder="Enter New Password Again" clearable style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="gateway-password-footer">
      <div :class="['reset-button', isValid ? 'active' : 'inactive']">
        <el-button type="primary" @click="handleReset">Reset</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import CryptoJS from 'crypto-js'
import { useRouter, useRoute } from 'vue-router'
import { ElButton, ElDivider, ElMessage } from 'element-plus'
import reset from '@/assets/login/reset.png'

const store = useStore()
const router = useRouter()
const route = useRoute()

const formLabelWidth = '150px'
const resetFormRef = ref(null)

const isValid = ref(false)

const emit = defineEmits(['switch-to-reset-password'])

// Form
const resetForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

const validateNewPassword = (rule, value, callback) => {
  // const passwordRegex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=.])[A-Za-z\d!@#$%^&*()\-_+=.]{8,}$/
  const passwordRegex = /^[a-zA-Z\d!@#$%^&*()-_+=.]{8,}$/;
  if (!value) {
    const errorMessage = 'Please enter your password'
    callback(new Error(errorMessage))
  } else if (!passwordRegex.test(value)) {
    const errorMessage = 'Minimum 8 chars.'
    callback(new Error(errorMessage))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please enter your password again.'))
  } else if (value !== resetForm.newPassword) {
    callback(new Error('The passwords entered twice do not match.'))
  } else {
    callback()
  }
}

const resetRules = reactive({
  newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
})

const handleReset = () => {
  resetFormRef.value.validate((valid) => {
    if (valid) {
      console.log('form is valid:', resetForm)
      isValid.value = true
      const encryptedPassword = CryptoJS.MD5(resetForm.confirmPassword).toString()
      emit('switch-to-reset-password', encryptedPassword)
    } else {
      isValid.value = false
      return false
    }
  })
}

const handleFormReset = async () => {
  await nextTick()

  if (resetFormRef.value) {
    resetFormRef.value.resetFields()
  }
}

watch(
  () => resetForm.newPassword,
  async () => {
    if (!resetFormRef.value) return
    try {
      await resetFormRef.value.validateField('newPassword')
      isValid.value = true
    } catch {
      isValid.value = false
    }
  }
)

onMounted(() => {
  handleFormReset()
})
</script>

<style scoped>
.gateway-reset-head {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.gateway-reset-divider {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.gateway-reset-divider .reset-tips {
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0em;
  color: #ffcc00;
}

.gateway-reset-form {
  margin-top: 10px;
}

.gateway-reset-head .gateway-reset-title {
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

.gateway-password-footer .reset-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1em;
}

.gateway-password-footer .reset-button button {
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

.gateway-password-footer .reset-button.inactive button {
  max-width: 100%;
  background-color: #aaaaaa;
  color: #ffffff;
  border-color: #aaaaaa;
  cursor: pointer;
}

.gateway-password-footer .reset-button.active button {
  background-color: #05c3de;
  color: #ffffff;
  border-color: #05c3de;
  cursor: pointer;
}
</style>

<style></style>
