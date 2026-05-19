<template>
  <div class="gateway-sign-page">
    <div class="gateway-sign-head">
      <div class="gateway-sign-icon">
        <img :src="sign" alt="SIGN IN" width="50" height="50" v-nodrag />
      </div>
      <div class="gateway-sign-title">
        <span>{{ $t('message.signIn.headerTitle') }}</span>
      </div>
    </div>
    <div class="gateway-sign-form">
      <el-form ref="signFormRef" :model="signForm" :rules="signRules" size="large" label-position="right"
        :label-width="formLabelWidth">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Email" prop="email" required>
              <el-input v-model="signForm.email" autocomplete="off" placeholder="Enter Your Email Address" clearable
                style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Password" prop="password" required>
              <el-input type="password" v-model="signForm.password" show-password autocomplete="off"
                placeholder="Enter Your Password" clearable style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="remember-info">
              <div class="remember-item">
                <el-checkbox v-model="signForm.rememberMe" @change="handleRemember">{{
                  $t('message.signIn.rememberMe')
                }}</el-checkbox>
              </div>
              <div class="remember-item">
                <el-button type="text" @click="$emit('switch-to-forgot-password', true)">{{
                  $t('message.signIn.forgotPassword')
                }}</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="gateway-sign-footer">
      <div :class="['sign-button', isValidate ? 'active' : 'inactive']">
        <el-button type="primary" @click="handleSignIn">{{ $t('message.signIn.signIn') }}</el-button>
      </div>
      <div class="gateway-create-account">
        <div class="create-tips">
          <span>{{ $t('message.signIn.tips') }}</span>
        </div>
        <div class="create-account-btn">
          <el-button type="text" @click="$emit('switch-to-register')">{{ $t('message.signIn.createAccount')
          }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch, nextTick, getCurrentInstance } from 'vue';
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElButton, ElDivider, ElMessage } from 'element-plus';
import { configWrite } from '@/utils/system';
import CryptoJS from 'crypto-js';
import { encrypt, decrypt } from '@/utils/crypto'
import sign from '@/assets/login/signin.png';

const store = useStore()
const router = useRouter()
const route = useRoute()

const instance = getCurrentInstance();
const globalProperties = instance ? instance.appContext.config.globalProperties : {};
const host = globalProperties.$host;

const formLabelWidth = '80px';
const signFormRef = ref(null);

const isValidate = computed(() => {
  return (
    signForm.email &&
    signForm.password
  )
})

// Form
const signForm = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const validateEmail = (rule, value, callback) => {

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!value) {
    callback(new Error('Please Enter Your Email Address'));
  } else if (!emailRegex.test(value)) {
    callback(new Error('Please enter a valid email'));
  } else {
    callback();
  }
}

const validatePassword = (rule, value, callback) => {
  // if (!value) callback(new Error('Please Enter Your Password'))
  // else callback()
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=.])[A-Za-z\d!@#$%^&*()\-_+=.]{6,}$/;
  // 登录时任意6位
  const passwordRegex = /^[a-zA-Z\d!@#$%^&*()-_+=.]{6,}$/;
  if (!value) {
    const errorMessage = 'Please enter your password';
    callback(new Error(errorMessage));
  } else if (!passwordRegex.test(value)) {
    const errorMessage = 'Minimum 6 chars.';
    callback(new Error(errorMessage));
  } else {
    callback();
  }
}

const signRules = reactive({
  email: [{ validator: validateEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

const handleSignIn = () => {
  signFormRef.value.validate((valid) => {
    if (valid) {

      isValidate.value = true;

      const data = {
        username: signForm.email,
        password: CryptoJS.MD5(signForm.password).toString()
      }

      if (signForm.rememberMe) {
        handleRemember(true);
      }

      store.dispatch('user/login', data).then(async (res) => {

        if (res.code === 20000 && res.data && res.data.flag === 1) {
          // 保存用户信息
          const userInfo = {
            userId: res.data.userId,
            userName: res.data.userName,
            email: res.data.email,
            sex: res.data.sex,
            height: res.data.height,
            weight: res.data.weight,
            waist: res.data.waist
          }
          await saveUserInfo(userInfo)

          ElMessage.success({
            message: 'Login successful',
            type: 'success',
            showClose: true,
            duration: 1000
          })
          router.push('/')
        } else if (res.code === 20000 && res.data.flag === 2) {
          ElMessage.error({
            message: 'User does not exist',
            type: 'error',
            showClose: true,
            duration: 1000
          })
        } else if (res.code === 20000 && res.data.flag === 0) {
          ElMessage.error({
            message: 'Wrong KAT Name or password',
            type: 'error',
            showClose: true,
            duration: 1000
          })
        }
      })
    } else {
      console.log('Sign form is invalid');
      return false;
    }
  });
};

const saveUserInfo = async (userInfo) => {
  const folderPath = `Local/New_Gateway`
  const saveFileName = 'UserInfo.json'
  const content = JSON.stringify(userInfo)
  await configWrite(host, folderPath, saveFileName, content);
};

const handleRemember = (value) => {
  if (value) {
    signFormRef.value.validate((valid) => {
      if (valid) {
        const userpwd = encrypt(signForm.password)
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('email', signForm.email);
        localStorage.setItem('password', userpwd);
      } else {
        localStorage.setItem('rememberMe', 'false');
        signForm.rememberMe = false;
      }
    });
  } else {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
  }
};

const handleFormReset = async () => {
  await nextTick();

  const rememberMe = localStorage.getItem('rememberMe');

  if (rememberMe === 'true') {

    signForm.email = localStorage.getItem('email');
    signForm.password = decrypt(localStorage.getItem('password'));
    signForm.rememberMe = true;

    if (signFormRef.value && signFormRef.value.clearValidate) {
      signFormRef.value.clearValidate();
    }
    return;
  }

  if (signFormRef.value) {
    signFormRef.value.resetFields();
  }
};

Object.keys(signForm).forEach((key) => {
  watch(
    () => signForm[key],
    async () => {
      if (!signFormRef.value) return
      try {
        await signFormRef.value.validateField(key)
      } catch (_) { }
    }
  )
})

onMounted(() => {
  handleFormReset();
});
</script>

<style scoped>
.gateway-sign-head {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.gateway-sign-form {
  margin-top: 10px;
}

.gateway-sign-head .gateway-sign-title {
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
}

.remember-info {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 43px;
}

.remember-info .remember-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-checkbox__label) {
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0em;
  /* color: var(--title-color); */
  color: var(--title-color);
}

:deep(.el-checkbox__input.is-checked+.el-checkbox__label) {
  /* color: var(--title-color); */
  color: var(--title-color);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #05C3DE;
  border-color: #05C3DE;
}

.remember-info .remember-item button {
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0em;
  color: #05C3DE;
}

.gateway-sign-footer .sign-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.gateway-sign-footer .sign-button button {
  padding: 10px 112px;
  height: 44px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  line-height: 23.4px;
  text-transform: capitalize;
  letter-spacing: 0em;
  cursor: pointer;
}

.gateway-sign-footer .sign-button.inactive button {
  max-width: 100%;
  background-color: #AAAAAA;
  color: #FFFFFF;
  border-color: #AAAAAA;
  cursor: pointer;
}

.gateway-sign-footer .sign-button.active button {
  background-color: #05C3DE;
  color: #FFFFFF;
  border-color: #05C3DE;
  cursor: pointer;
}

.gateway-sign-footer .gateway-create-account {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.gateway-sign-footer .gateway-create-account .create-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0em;
  /* color: var(--title-color); */
  color: var(--title-color);
}

.gateway-sign-footer .gateway-create-account .create-account-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.gateway-sign-footer .gateway-create-account .create-account-btn button {
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0em;
  color: #05C3DE;
}
</style>

<style></style>