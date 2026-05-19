<template>
  <div class="kat-gateway-page">
    <div class="top-function-list">

      <div class="function-list">
        <div class="function-list-item hidden-sm-and-down" @click="handleMinimized">
          <Minus />
        </div>
        <div class="function-list-item hidden-sm-and-down" @click="handleMaximized"><Full-screen /></div>
        <div class="function-list-item" @click="handleClose">
          <Close />
        </div>
      </div>
    </div>
    <div class="kat-gateway-container">

      <div class="logo-section">
        <div class="logo-placeholder">
          <img :src="logo" alt="KAT Logo" class="kat-logo" v-nodrag />
        </div>
      </div>

      <div class="form-section">
        <h1 class="header-title">{{ $t('message.login.title') }}</h1>
        <h2 class="subtitle">{{ $t('message.login.subtitle') }}</h2>

        <div class="social-buttons">
          <div id="googleSignInDiv" class="social-btn-container"></div>

          <button @click="handleFacebookLogin" class="social-btn facebook-btn">
            <img :src="meta" alt="Facebook Logo" v-nodrag />
            {{ $t('message.login.meta') }}
          </button>
        </div>

        <el-divider class="or-divider">{{ $t('message.login.or') }}</el-divider>

        <el-button type="primary" size="large" class="create-account-btn" @click="handleCreateAccount">
          {{ $t('message.login.createAccount') }}
        </el-button>

        <p class="terms-text">
          By signing up, you agree to the
          <span @click="goToTermsUrl" class="policy-link">{{
            $t('message.login.termsOfService') }}</span>
          and
          <span @click="goToPrivacyUrl" class="policy-link">{{
            $t('message.login.privacyPolicy') }}</span>, including Cookie
          Use.
        </p>

        <div class="sign-in-section">
          <h3>{{ $t('message.login.haveAccount') }}</h3>
          <el-button size="large" class="sign-in-btn" @click="handleSignIn">
            {{ $t('message.login.signIn') }}
          </el-button>
        </div>
      </div>
      <div class="right-section"></div>
    </div>
    <el-dialog v-model="settingPasswordVisible" title="" width="540" :close-on-click-modal="false"
      :close-on-press-escape="false" draggable>
      <el-form :model="userForm" :rules="rules" ref="userFormRef" class="rule-form">
        <div class="form-top-container">
          <div class="form-top-item">
            <img :src="lock" alt="Lock Icon" class="icon-img" v-nodrag />
          </div>
          <div class="form-top-item">
            <span>{{ $t('message.login.setPassword') }}</span>
          </div>
        </div>
        <el-form-item label="Password" :label-width="formLabelWidth" prop="password">
          <el-input v-model="userForm.password" type="password" size="large" show-password
            placeholder="Enter New Password" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="Password Again" :label-width="formLabelWidth" prop="newPassword">
          <el-input v-model="userForm.newPassword" type="password" size="large" show-password
            placeholder="Enter New Password Again" autocomplete="off" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer footer-container">
          <el-button type="primary" @click="handleVerifyPassword">
            {{ $t('message.login.verify') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="registerDialogVisible" title="" width="760" center :close-on-click-modal="false"
      :close-on-press-escape="false" draggable>
      <Register @switch-user-register="openRegister" />
    </el-dialog>
    <el-dialog v-model="signInDialogVisible" title="" width="440" center :close-on-click-modal="false"
      :close-on-press-escape="false" draggable>
      <SignIn ref="signInComponentRef" @switch-to-register="openCreateAccount"
        @switch-to-forgot-password="openForGotPassword" />
    </el-dialog>
    <el-dialog v-model="verifyDialogVisible" title="" width="440" center :close-on-click-modal="false"
      :close-on-press-escape="false" draggable>
      <Verify @switch-to-sign-in="openSignIn" @switch-to-code-verify="openCodeVerify" />
    </el-dialog>
    <el-dialog v-model="codeDialogVisible" title="" width="440" center :close-on-click-modal="false"
      :close-on-press-escape="false" draggable>
      <CodeVerify :send-code="isCodeSend" @switch-to-verify="openVerify" @switch-to-resend="resendEmail" />
    </el-dialog>
    <el-dialog v-model="resetPwdDialogVisible" title="" width="560" center :close-on-click-modal="false"
      :close-on-press-escape="false" draggable>
      <Reset @switch-to-reset-password="resetPwd" />
    </el-dialog>
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, ref, reactive, onMounted, watch, onBeforeMount } from 'vue';
import { useStore } from 'vuex'
import CryptoJS from 'crypto-js';
import { sendEmailCode, verificationCode, changePwd } from '@/api/user'
import { configWrite, getTimeZone, getDeviceId, getDeviceInfo, openUrl } from '@/utils/system';
import { useRouter, useRoute } from 'vue-router'
import { ElButton, ElDivider, ElMessage } from 'element-plus';
import { loadExternalSDK } from '@/utils/sdkLoader';

import Register from './register.vue';
import SignIn from './signIn.vue';
import Verify from './verify.vue';
import CodeVerify from './codeVerify.vue';
import Reset from './reset.vue';

import logo from '@/assets/login/logo.png';
import meta from '@/assets/login/meta.png';
import lock from '@/assets/login/lock.png';
import { Minus, Close } from '@element-plus/icons'
import FullScreen from '@/layout/Header/functionList/fullscreen.vue'
import { setFormState, formClose } from '@/utils/system'

const instance = getCurrentInstance();
const globalProperties = instance ? instance.appContext.config.globalProperties : {};
const host = globalProperties.$host;

const store = useStore()
const router = useRouter()
const route = useRoute()

const settingPasswordVisible = ref(false);
const formLabelWidth = '120px';
const userFormRef = ref(null);

const registerDialogVisible = ref(false);
const signInDialogVisible = ref(false);
const verifyDialogVisible = ref(false);
const codeDialogVisible = ref(false);
const resetPwdDialogVisible = ref(false);

const isQuickLogin = ref(false);
const isRegisted = ref(false);
const isForgotPassword = ref(false);
// 是否已发送验证码
const isCodeSend = ref(false);

const userInfo = reactive({
  email: '',
});

// Form
const userForm = reactive({
  password: '',
  newPassword: '',
});

const verifyForm = reactive({
  email: '',
  code: '',
});

const registerForm = reactive({
  userName: '',
  email: '',
  password: '',
  gender: '',
  avatar: '',
  birthday: '',
  country: '',
  height: '',
  weight: '',
  waistline: '',
  unitType: '',
  shoeSize: '',
  timeZone: '',
  deviceId: ''
});

const signInComponentRef = ref(null);

const validateNewPassword = (rule, value, callback) => {
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=.])[A-Za-z\d!@#$%^&*()\-_+=.]{8,}$/;
  // 注册时任意8位
  const passwordRegex = /^[a-zA-Z\d!@#$%^&*()-_+=.]{8,}$/;
  if (!value) {
    const errorMessage = 'Please enter your password';
    callback(new Error(errorMessage));
  } else if (!passwordRegex.test(value)) {
    const errorMessage = 'Minimum 8 chars.';
    callback(new Error(errorMessage));
  } else {
    callback();
  }
};

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please enter your password again.'));
  } else if (value !== userForm.password) {
    callback(new Error('The passwords entered twice do not match.'));
  } else {
    callback();
  }
};

// --- Validation Rules ---
const rules = reactive({
  password: [
    { required: true, validator: validateNewPassword, trigger: 'blur' },
  ],
  newPassword: [
    { required: true, validator: validateConfirmPassword, trigger: ['blur', 'change'] }
  ]
});

const goToTermsUrl = async () => {
  const url = 'https://www.kat-vr.com/pages/terms-of-service';
  return await openUrl(host, url);
}

const goToPrivacyUrl = async () => {
  const url = 'https://www.kat-vr.com/pages/privacy-policy';
  return await openUrl(host, url);
}

const handleVerifyPassword = () => {
  userFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success({
        message: 'Password set successfully!',
        type: 'success',
      });

      const userpwd = CryptoJS.MD5(userForm.newPassword).toString();

      registerForm.password = userpwd;

      registerDialogVisible.value = true;

      userForm.password = '';
      userForm.newPassword = '';
      userFormRef.value.resetFields();

    } else {
      ElMessage.error('Please correct the validation errors in the form.');
      console.log('Form validation failed!');
      return false;
    }
  });
};

const sendTokenToBackend = async (provider, credential) => {
  console.log(`发送 ${provider} 凭证到后端...`);

  // 确保在 API 调用成功后才执行路由跳转
  try {
    // 成功后执行跳转
    const data = {
      accessToken: credential
    }

    store.dispatch('user/setQuickLoginChange', true);

    if (provider === 'google') {
      store.dispatch('user/googleLogin', data)
        .then(async (res) => {
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
            await router.push('/')
          } else if (res.code === 20000 && res.data && res.data.flag === 2) {

            ElMessage.warning({
              message: 'Please complete your registration',
              type: 'warning',
              showClose: true,
              duration: 1000
            })

            userInfo.email = res.data.email;
            registerForm.email = res.data.email;
            // 设置密码
            settingPasswordVisible.value = true;
          }
        });
    } else if (provider === 'facebook') {
      store.dispatch('user/facebookLogin', data)
        .then(async (res) => {

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
            await router.push('/')
          } else if (res.code === 20000 && res.data && res.data.flag === 2) {
            ElMessage.warning({
              message: 'Please complete your registration',
              type: 'warning',
              showClose: true,
              duration: 1000
            })

            userInfo.email = res.data.email;
            registerForm.email = res.data.email;
            // 设置密码
            settingPasswordVisible.value = true;
          }
        });
    }

  } catch (error) {
    ElMessage.error(`Authentication failed`);
  }
};

const GOOGLE_CLIENT_ID = "201980548372-3iri2fdt542vr0akmfbrc8qdskur1jmv.apps.googleusercontent.com";


const new_GatewayPath = 'Local/New_Gateway'
const profilePath = 'Profile'

const saveUserInfo = async (userInfo) => {
  const folderPath = new_GatewayPath
  const saveFileName = 'UserInfo.json'
  const content = JSON.stringify(userInfo)
  await configWrite(host, folderPath, saveFileName, content);
};

const handleCredentialResponse = (response) => {
  console.log("Encoded JWT ID token: " + response.credential);
  sendTokenToBackend('google', response.credential);
};
const handleFacebookLogin = () => {
  if (typeof window.FB === 'undefined') {
    console.error('The Facebook SDK has not been loaded or initialized!');
    return;
  }

  FB.login((response) => {
    if (response.authResponse) {
      const accessToken = response.authResponse.accessToken;
      console.log('用户 Access Token:', accessToken);
      FB.api('/me', (response) => {
        console.log('Good to see you, ' + response.name + '.');
      });
      sendTokenToBackend('facebook', accessToken);

    } else {
      console.log('Facebook Login failed or was cancelled.');
    }
  }, { scope: 'public_profile,email' });

};

const handleCreateAccount = () => {
  console.log('Navigating to Create Account form');
  store.dispatch('user/setForgotChange', false);
  verifyDialogVisible.value = true;
};

const handleSignIn = () => {
  console.log('Navigating to standard Sign In form');
  signInDialogVisible.value = true;
};

const openRegister = async (data) => {
  if (data) {
    const timeZone = await getTimeZone(host);
    registerForm.timeZone = timeZone;
    registerForm.deviceId = await getDeviceId(host);
    Object.assign(registerForm, data);
    handleRegister();
  }
}

const openSignIn = () => {
  signInDialogVisible.value = true
  registerDialogVisible.value = false
  verifyDialogVisible.value = false
  codeDialogVisible.value = false
  settingPasswordVisible.value = false
  resetPwdDialogVisible.value = false
}

const openCreateAccount = () => {
  signInDialogVisible.value = false
  registerDialogVisible.value = false
  verifyDialogVisible.value = true
  codeDialogVisible.value = false
  settingPasswordVisible.value = false
  resetPwdDialogVisible.value = false
}

const openCodeVerify = (value) => {
  console.log(value);
  verifyForm.email = value
  registerForm.email = value
  signInDialogVisible.value = false
  registerDialogVisible.value = false
  verifyDialogVisible.value = false
  isCodeSend.value = true
  codeDialogVisible.value = true
  settingPasswordVisible.value = false
  resetPwdDialogVisible.value = false
}

const openForGotPassword = (value) => {
  console.log(value);
  store.dispatch('user/setForgotChange', value);
  isForgotPassword.value = value;
  signInDialogVisible.value = false
  registerDialogVisible.value = false
  verifyDialogVisible.value = true
  codeDialogVisible.value = false
  settingPasswordVisible.value = false
  resetPwdDialogVisible.value = false
}

const openSettingPassword = () => {
  settingPasswordVisible.value = true
  signInDialogVisible.value = false
  registerDialogVisible.value = false
  verifyDialogVisible.value = false
  codeDialogVisible.value = false
  resetPwdDialogVisible.value = false
}

const openResetPassword = () => {
  settingPasswordVisible.value = false
  signInDialogVisible.value = false
  registerDialogVisible.value = false
  verifyDialogVisible.value = false
  codeDialogVisible.value = false
  resetPwdDialogVisible.value = true
}

const openVerify = (value) => {
  console.log(value);
  verifyForm.code = value
  const data = {
    email: verifyForm.email,
    emailCode: verifyForm.code
  }
  verifyCode(data);
}

const verifyCode = async (data) => {
  verificationCode(data).then(res => {
    if (res.code === 20000 && res.data.code === 1) {
      isCodeSend.value = false;
      ElMessage.success('Verification passed');
      if (isForgotPassword.value) {
        openResetPassword();
      } else {
        openSettingPassword();
      }
    } else {
      ElMessage.error(res.data.err_msg);
    }
  })
};

const handleRegister = async () => {
  const data = registerForm;
  store.dispatch('user/register', data).then((res) => {
    if (res.code === 20000 && res.data.code === 1) {
      ElMessage.success({
        message: 'Registered successful',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      router.push('/init/index')
    }
  })
};

const resendEmail = async () => {
  isCodeSend.value = false;
  if (verifyForm.email) {
    try {
      const res = await sendEmailCode({
        recipient: verifyForm.email
      });
      if (res.code === 20000 && res.data) {
        ElMessage.success('Email sent successfully!');
        isCodeSend.value = true;
      }
    } catch (error) {
      ElMessage.error(error.message);
    }
  }
};

const resetPwd = async (value) => {
  const resetPwdForm = value;
  if (verifyForm.email && resetPwdForm) {
    try {
      const data = {
        email: verifyForm.email,
        newPwd: resetPwdForm
      };
      changePwd(data).then(res => {
        if (res.code === 20000 && res.data.code === 1 && res.data.result) {
          ElMessage.success({
            message: res.data.msg,
            type: 'success'
          })
          resetPwdDialogVisible.value = false
          router.push({ path: '/' })
        } else {
          ElMessage.error(res.data.msg);
        }
      })
    } catch (error) {
      ElMessage.error(error.message);
    }
  }
};

const getCurentDeviceInfo = async () => {
  const deviceId = await getDeviceId(host);
  const timeZone = await getTimeZone(host);
  const deviceInfo = await getDeviceInfo(host);

  if (deviceId && timeZone && deviceInfo) {
    const newDeviceInfo = JSON.parse(deviceInfo);
    const newInfo = {
      deviceId: deviceId,
      timeZone: timeZone,
      deviceInfo: newDeviceInfo
    };

    store.dispatch('user/setDeviceInfo', newInfo);

    const folderPath = new_GatewayPath;

    const fileName = 'DeviceInfo.json';

    const fileContent = JSON.stringify(newDeviceInfo);

    await configWrite(host, folderPath, fileName, fileContent);
  }
};

const handleMinimized = async () => {
  await setFormState(host, 1)
}
const windowState = ref('Normal')
const handleMaximized = async () => {
  windowState.value = windowState.value === 'Maximized' ? 'Normal' : 'Maximized'
  await setFormState(host, windowState.value === 'Maximized' ? 2 : 0)
}
const handleClose = async () => {
  await formClose(host)
}

const loadGoogleSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.google) return resolve();

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initGoogleSignIn();
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const initGoogleSignIn = () => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      locale: 'en'
    });

    const googleBtnContainer = document.getElementById("googleSignInDiv");
    if (googleBtnContainer) {
      window.google.accounts.id.renderButton(
        googleBtnContainer,
        { theme: "outline", size: "large", type: "standard", width: "container" }
      );
    }
  }
};

const loadFacebookSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.FB) return resolve();

    // 先定义初始化回调
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '32487512540863116',
        cookie: true,
        xfbml: true,
        version: 'v24.0'
      });
      console.log('Facebook SDK Ready');
      resolve();
    };

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

watch(
  () => userForm.password,
  (newPassword) => {
    // If the main password changes, force re-validation of the confirmation field
    if (userFormRef.value) {
      userFormRef.value.validateField('newPassword', () => {
        // Callback is executed after validation
      });
    }
  }
);

onMounted(async () => {
  getCurentDeviceInfo();

  const idleTask = window.requestIdleCallback || ((handler) => setTimeout(handler, 200));

  idleTask(() => {
    loadGoogleSDK();
    loadFacebookSDK();
  });
});
</script>

<style lang="scss" scoped>
.kat-gateway-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* background-color: #f4f4f4; */
  background: var(--main-bg-color);
  color: var(--text-color);
  font-family: var(--text-family);
  /* box-sizing: border-box; */
}

:deep(.el-dialog__header) {
  margin-bottom: 0;
}

:deep(.el-dialog__body) {
  padding-left: 40px;
  padding-right: 40px;
}

:deep(.el-form-item) {
  align-items: center;
}

:deep(.el-form-item__label) {
  color: var(--text-color);
}

.kat-gateway-container {
  display: flex;
  /* background-color: #fff; */
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.kat-gateway-page .logo-section {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.kat-gateway-page .logo-placeholder {
  width: 100%;
  max-width: 300px;
}

.kat-gateway-page .kat-logo {
  width: 100%;
  height: auto;
  fill: none;
  stroke: #00C4E6;
  stroke-width: 4;
}

.kat-gateway-page .form-section {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.kat-gateway-page .right-section {
  width: 160px;
}

.kat-gateway-page .header-title {
  font-size: 38px;
  font-weight: bold;
  line-height: 70px;
  letter-spacing: 0px;
  color: var(--brand-color);
  margin: 0;
}

.kat-gateway-page .subtitle {
  font-size: 24px;
  font-weight: bold;
  line-height: 35px;
  letter-spacing: 0px;
  /* color: var(--title-color); */
  color: var(--text-color);
  text-align: left;
}

.kat-gateway-page .social-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kat-gateway-page .social-btn-container {
  width: 100%;
  cursor: pointer;
  border-radius: 20px;
}

.kat-gateway-page .social-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  font-weight: bold;
  border: 1px solid #dcdfe6;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 20px;
  margin: 0;
  gap: 5px;
  cursor: pointer;
}

.kat-gateway-page .facebook-btn {
  font-size: 16px;
  font-weight: normal;
  line-height: 23px;
  text-align: center;
  letter-spacing: 0px;
  color: var(--title-color);
}

.kat-gateway-page .icon-img {
  margin-right: 15px;
  width: 18px;
  height: 18px;
}

.kat-gateway-page .or-divider {
  margin: 20px 0;

  :deep(.el-divider__text) {
    background: var(--main-bg-color);
    color: var(--text-color);
  }
}

.kat-gateway-page .create-account-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background-color: #00C4E6;
  border-color: #00C4E6;
  font-weight: bold;
  margin-bottom: 15px;
}

.kat-gateway-page .terms-text {
  font-size: var(--footnote-font-size);
  line-height: 1.4;
  /* color: #606266; */
  color: var(--text-color);
  text-align: left;
  margin-bottom: 30px;
}

.kat-gateway-page .policy-link {
  color: var(--brand-color);
  text-decoration: none;
  cursor: pointer;
}

.kat-gateway-page .sign-in-section h3 {
  font-weight: 500;
  margin-bottom: 15px;
  margin-top: 0;
  font-size: var(--body-font-size);
  text-align: left;
}

.kat-gateway-page .sign-in-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  font-weight: bold;
  border: 1px solid #dcdfe6;
}

.kat-gateway-page .footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.kat-gateway-page .footer-container button {
  width: 320px;
  height: 44px;
  border-radius: 10px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 50px;
  gap: 10px;
  background: var(--brand-color);
}

.kat-gateway-page .form-top-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin-bottom: 40px;
}

.form-top-container {
  font-size: 24px;
  font-weight: bold;
  line-height: 28.08px;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  // color: var(--title-color);
  color: var(--title-color);
}

:deep(.el-dialog) {
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  // margin: 0 !important;
  background: var(--nav-bg-color);
  color: var(--text-color);
}

:deep(.el-overlay) {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-dialog__wrapper) {
  overflow: hidden;

}

:deep(.el-input) {
  --el-input-text-color: var(--text-color);
  --el-input-bg-color: #2A2D34;
  --el-input-border: transparent;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px transparent inset;
}

@media (max-width: 768px) {
  .kat-gateway-page .kat-gateway-container {
    flex-direction: column;
    max-width: 450px;
  }

  .kat-gateway-page .logo-section {
    padding: 20px;
    height: 200px;
  }

  .kat-gateway-page .form-section {
    padding: 20px;
  }
}

.top-function-list {
  position: absolute;
  width: 100%;
  height: 50px;
  left: 0;
  top: 0;
  padding: 10px 20px;
}

.function-list {
  display: flex;
  justify-content: flex-end;

  .function-list-item {
    width: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 15px;
    cursor: pointer;

    :deep(i) {
      color: var(--title-color);
    }
  }
}
</style>