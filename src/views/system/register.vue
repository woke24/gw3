<template>
  <div class="gateway-register-page">
    <div class="gateway-register-head">
      <div class="gateway-register-icon">
        <img :src="hi" alt="hi" width="50" height="50" v-nodrag />
      </div>
      <div class="gateway-register-title">
        <span>Welcome KAT Walker</span>
      </div>
    </div>
    <div class="gateway-register-form">
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" :inline="true" size="large"
        label-position="right" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="24">
            <div class="gateway-register-avatar">
              <div class="user-avatar" @click="handleAvatarChange">
                <el-avatar v-if="!imageUrl" :src="head" size="large" fit="cover" />
                <el-image v-else :src="imageUrl" alt="avatar" size="large" fit="cover" />
              </div>
              <div class="avatar-change">
                <el-image :src="avatarEdit" alt="avatar" width="24" height="24" @click="handleAvatarChange" />
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Name" prop="userName" required>
              <el-input v-model="registerForm.userName" placeholder="Public Display Name" autocomplete="off" clearable
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Country" prop="country" required>
              <el-select v-model="registerForm.country" filterable remote :remote-method="handleCustomFilter"
                placeholder="Select Your Country" clearable style="width: 100%" :loading="loading">
                <el-option v-for="item in filteredCountryList" :key="item.countryCode" :label="item.countryName"
                  :value="item.countryCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Gender" prop="gender" required>
              <el-select v-model="registerForm.gender" placeholder="Select Your Gender" clearable style="width: 100%">
                <el-option label="Female" value="0" />
                <el-option label="Male" value="1" />
                <el-option label="Custom" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Birthday" prop="birthday" required>
              <el-date-picker v-model="registerForm.birthday" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                placeholder="Select Your Birthday" clearable style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Shoe Size" prop="shoeSize">
              <el-select v-model="registerForm.shoeSize" placeholder="Select Your Shoe Size" clearable
                style="width: 100%">
                <el-option v-for="item in shoeSizeList" :key="item.shoeSize" :label="item.shoeName"
                  :value="item.shoeSize"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Height" prop="height">
              <el-input v-model="registerForm.height" placeholder="Enter Your Height" autocomplete="off" clearable
                style="width: 100%" @input="(value) => handleNumericInput(value, 'height')">
                <template #append>
                  <span>cm</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Weight" prop="weight">
              <el-input v-model="registerForm.weight" placeholder="Enter Your Weight" autocomplete="off" clearable
                style="width: 100%" @input="(value) => handleNumericInput(value, 'weight')">
                <template #append>
                  <span>kg</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Waistline" prop="waistline">
              <el-input v-model="registerForm.waistline" placeholder="Enter Your Waistline" autocomplete="off" clearable
                style="width: 100%" @input="(value) => handleNumericInput(value, 'waistline')">
                <template #append>
                  <span>cm</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="gateway-register-footer">
      <div class="register-desc">
        <span>
          By clicking "Sign Up" you agree to our
          <a href="https://www.kat-vr.com/pages/terms-of-service" class="terms-of-use" target="_blank">
            [Terms of Use]
          </a>
          and
          <a href="https://www.kat-vr.com/pages/privacy-policy" class="privacy-policy" target="_blank">
            [Privacy Policy]
          </a>
          . Learn how we collect, use, and share your data including how we use Cookies and similar
          technology in our Privacy Policy
        </span>
      </div>
      <div :class="['register-button', isValidate ? 'active' : 'inactive']">
        <el-button type="primary" @click="handleSignUp">Sign Up</el-button>
      </div>
    </div>
    <el-dialog v-model="dialogTableVisible" title="Avatar List" width="460" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="avatar-list">
        <div class="avatar-item" v-for="(item, index) in avatarList" :key="index" @click="handleAvatarClick(item)">
          <div class="avatar-item-img">
            <el-image :src="item.avatarUrl" alt="avatar" fit="cover"
              :class="[item.unlocked || item.special ? 'unlocked' : 'locked']" />
          </div>
          <div class="avatar-lock">
            <el-image v-if="!item.unlocked || item.special" :src="lock" alt="lock" fit="cover" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import { getCountryList, getShoeSizeList, getAvatarList } from '@/api/user'
import { useRouter, useRoute } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElButton, ElDivider, ElMessage } from 'element-plus'
import hi from '@/assets/register/hi.png'
import head from '@/assets/register/head.png'
import avatarEdit from '@/assets/register/user_head_edit_img.png'
import lock from '@/assets/register/avatar_lock.png'

const store = useStore()
const router = useRouter()
const route = useRoute()

const imageUrl = ref('')
const avatarList = ref([])
const dialogTableVisible = ref(false)

const emit = defineEmits(['switch-user-register'])

const formLabelWidth = '80px'
const registerFormRef = ref(null)
const isValidate = computed(() => {
  return (
    registerForm.userName && registerForm.country && registerForm.gender && registerForm.birthday
  )
})

// Form
const registerForm = reactive({
  userName: '',
  country: '',
  gender: '',
  avatar: '',
  birthday: '',
  height: '',
  weight: '',
  waistline: '',
  unitType: 0,
  shoeSize: ''
})

const countryList = ref([])
const shoeSizeList = ref([])
const filteredCountryList = ref([])
const loading = ref(false)

const validateUserName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please enter a name'))
  } else if (value.length < 3) {
    callback(new Error('Minimum 3 chars.'))
  } else if (/[\u4e00-\u9fff]/.test(value)) {
    callback(new Error('Name invalid'))
  } else {
    callback()
  }
}

const validateCountry = (rule, value, callback) => {
  if (!value) callback(new Error('Please select a country'))
  else callback()
}

const validateGender = (rule, value, callback) => {
  if (!value) callback(new Error('Please select a gender'))
  else callback()
}

const validateBirthday = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please select a birthday'));
  } else {
    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 13) {
      callback(new Error('At least 13 years old'));
    } else {
      callback();
    }
  }
}

const registerRules = reactive({
  userName: [{ validator: validateUserName, trigger: 'blur' }],
  country: [{ validator: validateCountry, trigger: 'change' }],
  gender: [{ validator: validateGender, trigger: 'change' }],
  birthday: [{ validator: validateBirthday, trigger: 'change' }]
})

const handleSignUp = () => {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      console.log('Registration form is valid:', registerForm)
      isValidate.value = true
      registerForm.birthday = moment(registerForm.birthday).format('YYYY-MM-DD')
      emit('switch-user-register', registerForm)
    } else {
      console.log('Registration form is invalid')
      return false
    }
  })
}

Object.keys(registerForm).forEach((key) => {
  watch(
    () => registerForm[key],
    async () => {
      if (!registerFormRef.value) return
      try {
        await registerFormRef.value.validateField(key)
      } catch (_) { }
    }
  )
})

const handleNumericInput = (value, key) => {
  let cleanedValue = value.toString()

  cleanedValue = cleanedValue.replace(/[^\d.]/g, '')

  cleanedValue = cleanedValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')

  if (cleanedValue.includes('.')) {
    cleanedValue = cleanedValue.replace(/^(\d+\.\d{2}).*$/, '$1')
  }

  registerForm[key] = cleanedValue
}

const initCountryList = async () => {
  const res = await getCountryList()
  if (res.code !== 20000) return
  const list = res.data.map((item) => ({
    ...item,
    countryCode: String(item.countryCode)
  }))
  countryList.value = list
  filteredCountryList.value = list
}

const initShoeSizeList = async () => {
  const res = await getShoeSizeList()
  if (res.code !== 20000) return
  shoeSizeList.value = res.data
}

const initAvatarList = async () => {
  const res = await getAvatarList()
  if (res.code !== 20000) return
  avatarList.value = res.data
}

const handleAvatarChange = () => {
  dialogTableVisible.value = true
}

const handleAvatarClick = (item) => {
  if (!item.unlocked || item.special) {
    ElMessage.warning('Please unlock the avatar first')
  } else {
    registerForm.avatar = item.avatarId
    imageUrl.value = item.avatarUrl
    dialogTableVisible.value = false
  }
}

const handleCustomFilter = (query) => {
  if (!query || query.trim() === '') {
    filteredCountryList.value = countryList.value
    return
  }

  const lowerCaseQuery = query.trim().toLowerCase()

  if (countryList.value.length > 0) {
    loading.value = true

    setTimeout(() => {
      filteredCountryList.value = countryList.value.filter((item) => {
        const countryNameLower = item.countryName ? item.countryName.toLowerCase() : ''

        return countryNameLower.includes(lowerCaseQuery)
      })

      loading.value = false
    }, 100)
  }
}

onMounted(() => {
  initCountryList()
  initShoeSizeList()
  initAvatarList()
})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 75px;
  height: 75px;
  display: block;
}

.gateway-register-head {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.gateway-register-avatar {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 16px;
}

.gateway-register-avatar .user-avatar {
  width: 60px;
  height: 60px;
}

.avatar-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.avatar-list .avatar-item {
  position: relative;
  width: 60px;
  height: 60px;
}

:deep(.avatar-list .avatar-item-img .el-image__inner) {
  width: 60px;
  height: 60px;
}

.avatar-list .avatar-item-img .locked {
  opacity: 0.6;
}

.avatar-list .avatar-item-img .unlocked {
  opacity: 1;
}

.avatar-list .avatar-item .avatar-lock {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.gateway-register-avatar .avatar-change {
  position: absolute;
  top: 51%;
  left: 51%;
}

.gateway-register-avatar .avatar-change img {
  width: 24px;
  height: 24px;
}

.el-dialog__header {
  margin-bottom: 0;
}

.el-form--inline .el-form-item {
  display: flex;
  margin-top: 5px;
  margin-bottom: 15px;
  margin-right: 10px;
}

.gateway-register-footer .register-desc {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  /* color: var(--title-color); */
  color: var(--text-color);
  padding-left: 40px;
  padding-right: 40px;
  margin-bottom: 15px;
}

.gateway-register-footer .register-desc .terms-of-use {
  color: var(--brand-color);
}

.gateway-register-footer .register-desc .terms-of-use:hover {
  color: var(--brand-color);
}

.gateway-register-footer .register-desc .privacy-policy {
  color: var(--brand-color);
}

.gateway-register-footer .register-desc .privacy-policy:hover {
  color: var(--brand-color);
}

.gateway-register-footer .register-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.gateway-register-footer .register-button button {
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

.gateway-register-footer .register-button.inactive button {
  max-width: 100%;
  background-color: #aaaaaa;
  color: #ffffff;
  border-color: #aaaaaa;
  cursor: pointer;
}

.gateway-register-footer .register-button.active button {
  background-color: var(--brand-color);
  color: #ffffff;
  border-color: var(--brand-color);
  cursor: pointer;
}

.gateway-register-title {
  font-size: 24px;
  color: var(--title-color);
}

:deep(.el-input-group__append) {
  background-color: #2A2D34;
  color: var(--title-color);
  box-shadow: none;
}

:deep(.el-select__wrapper) {
  background-color: #2A2D34;
  box-shadow: unset;
}

:deep(.el-select),
:deep(.el-select__placeholder) {
  --el-select-input-color: var(--text-color);
  color: var(--text-color);
}
</style>

<style>
.el-avatar>img {
  background: #ffffff;
}
</style>
