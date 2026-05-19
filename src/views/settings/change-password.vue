<template>
    <div class="gw-change-password">
        <div class="gw-cp-head">
            <div class="gw-head">
                <img :src="reset" alt="Reset Password" width="50" height="50" v-nodrag />
                <span class="gw-head-title title">Change Password</span>
            </div>
        </div>
        <div class="gw-cp-form">
            <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" size="large" label-position="right"
                :label-width="formLabelWidth">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="Password" prop="newPassword" required>
                            <el-input class="dark-input" v-model="resetForm.newPassword" type="password" show-password autocomplete="off"
                                placeholder="Enter New Password" clearable style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Password Again" prop="confirmPassword" required>
                            <el-input class="dark-input" v-model="resetForm.confirmPassword" type="password" show-password
                                autocomplete="off" placeholder="Enter New Password Again" clearable
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="gw-password-footer">
            <div :class="['reset-button', isValid ? 'active' : 'inactive']">
                <el-button type="primary" @click="handleReset">Reset</el-button>
            </div>
        </div>
    </div>

</template>
<script setup lang="js">
import { computed, ref, reactive, onMounted, watch, nextTick } from 'vue'
import CryptoJS from 'crypto-js'
import { useStore } from 'vuex'
import { changePwd } from '@/api/user'
import { ElMessage } from 'element-plus'
import reset from '@/assets/login/reset.png'

const store = useStore()
const userInfo = computed(() => store.state.user.info)

const formLabelWidth = '150px'
const resetFormRef = ref(null)
const isValid = ref(false)

const resetForm = reactive({
  newPassword: '',
  confirmPassword: ''
})
const validateNewPassword = (rule, value, callback) => {
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
  newPassword: [
        { validator: validateNewPassword, trigger: 'blur' }
    ],
  confirmPassword: [
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
})
const handleReset = () => {
  resetFormRef.value.validate((valid) => {
    if (valid) {
      isValid.value = true
      const encryptedPassword = CryptoJS.MD5(resetForm.confirmPassword).toString()
      const msg = {
        email: userInfo.value.email,
        newPwd: encryptedPassword
      }
        changePwd(msg).then(res => {
            if( res.code === 20000 ) {
                ElMessage.success({
                    message: res.msg,
                    type: 'success'
                })
                store.dispatch('user/loginOut')
            } else {
                ElMessage.error({
                    message: res.msg,
                    type: 'error'
                })
            }    
        })
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
.gw-change-password {
    width: 500px;
    margin: 100px auto;
    background: var(--nav-bg-color);
    padding: 50px;
    border-radius: 20px;
    color: var(--text-color);
    font-family: var(--text-family);
    .gw-head {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin-bottom: 20px;
    }
    .gw-head-title {
        font-size: 24px;
    }
    .gw-cp-form {
        margin-bottom: 20px;
    }
    .gw-cp-form :deep(.el-form-item__label) {
        color: var(--text-color);
    }
    .gw-password-footer button {
        width: 200px;
        background: var(--brand-color);
        font-size: 16px;
        padding: 15px 20px;
    }
}

</style>