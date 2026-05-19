<template>
  <div class="settings-container">
    <el-form :rules="rules" ref="formRef" :model="formData" label-width="120px" size="default">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Avatar" style="align-items: center;">
              <el-avatar
                :src="formData.avatar"
                :size="80"
                fit="cover"
              />
              <div class="upload-avatar" @click="openAvatar">
                <SvgIcon name="edit-ava" height="24px" width="24px" />
              </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="save-btn-col">
          <el-button type="primary" class="save-btn" :disabled="!isChanged" @click="save" :style="{background: !isChanged ? '#3D3935' : '#05C3DE'}"> Save</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Name" prop="userName">
            <el-input v-model="formData.userName" class="dark-input" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Country" prop="country">
            <el-select v-model="formData.country" clearable filterable class="dark-select">
              <el-option
                  v-for="item in countryList"
                  :key="item.countryCode"
                  :label="item.countryName"
                  :value="item.countryCode"
                ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Gender" prop="sex">
            <el-select v-model="formData.sex" class="dark-select">
              <el-option label="Male" :value="1"></el-option>
              <el-option label="Female" :value="0"></el-option>
              <el-option label="Other" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Birthday" prop="birthday">
            <el-date-picker v-model="formData.birthday" type="date" style="width: 100%" class="dark-input" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Shoe Size" prop="shoeSize">
            <el-select v-model="formData.shoeSize" class="dark-select" clearable>
              <el-option
                  v-for="item in shoeSizeList"
                  :key="item.shoeSize"
                  :label="item.shoeName"
                  :value="item.shoeSize"
                ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Height" prop="height">
            <el-input
              v-model="formData.height"
              class="dark-input"
              @input="formData.height = limitNumber(formData.height, 3)"
              @blur="formData.height = updateNumber(formData.height)"
              >
              <template #suffix>cm</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Weight" prop="weight">
            <el-input
              v-model="formData.weight"
              class="dark-input"
              @input="formData.weight = limitNumber(formData.weight, 3)"
              @blur="formData.weight = updateNumber(formData.weight)"
              >
              <template #suffix>kg</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="waist" prop="waist">
            <el-input
              v-model="formData.waist"
              class="dark-input"
              @input="formData.waist = limitNumber(formData.waist, 3)"
              @blur="formData.waist = updateNumber(formData.waist)"
            >
              <template #suffix>cm</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <div>
        <el-button @click="handleSignOut">
        <!-- <el-icon style="font-size: 20px; margin-right: 4px;"><Switch /></el-icon> -->
          <SvgIcon name="Signout" width="20px" height="20px" />
          <span>Sign out</span>
        </el-button>
      </div>
      <div>
        <el-button @click="handleChangePassword">
          <!-- <el-icon style="font-size: 20px; margin-right: 4px;"><Edit /></el-icon> -->
          <SvgIcon name="ChangePwd" width="20px" height="20px" /> 
          <span>Change password</span>
        </el-button>
      </div>
      <div>
        <el-button @click="handleDeleteAccount" class="action-buttons-delete">
          <!-- <el-icon style="font-size: 20px; margin-right: 4px;"><Delete /></el-icon> -->
            <SvgIcon name="DeleteAccount" width="20px" height="20px" /> 
            <span> Delete account</span>
          </el-button>
        </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogAvatar"
    title="Choose Avatar"
    width="500px"
    center
    draggable
  >
    <div class="avatar-list">
      <!-- 循环头像列表 -->
      <el-avatar
        v-for="(item, index) in avatarList"
        :key="index"
        :src="item.avatarUrl"
        fit="cover"
        :size="50"
        class="avatar-item"
        @click="handleSelectAvatar(item.avatarUrl)"
      />
    </div>
  </el-dialog>
  <el-dialog
    v-model="dialogDelete"
    title=""
    width="500"
    center
    draggable
  >
    <template #header>
      <div class="delete-header">
        <div class="delete-header-title">
          <span>
            <SvgIcon name="WarningNote" width="16px" height="16px" />
          </span>
          <span style="margin-left: 10px;font-size: 18px;">Important Note</span>
        </div>
      </div>
    </template>
    <div class="my-message-box">
      <p>Once you confirm the deletion of your account, all data under the account, including personal information, will be permanently deleted and cannot be restored.</p>
      <p style="margin-top: 16px;">At the same time, the deleted account cannot be used again or restored in any way. Please consider carefully before operating.</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogDelete = false" class="cancel-btn">Cancel</el-button>
        <el-button @click="dialogDelete = false" class="confirm-btn">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="js">
import { onMounted, computed, ref } from 'vue'
// import { Switch,Edit,Delete } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getUserInfo, getCountryList, getShoeSizeList, getAvatarList, changeInfo } from '@/api/user'
import { limitNumber, updateNumber } from '@/utils/inputLimit.js'
import { useRouter } from 'vue-router';
const router = useRouter()
const store = useStore()
// 表单数据
const originalForm = ref({})
const formData = ref({
  // userName: '',
  // gender: '',
  // avatar: '',
  // birthday: '',
  // country: '',
  // height: '',
  // waist: '',
  // weight: '',
  // unitType: '1',
  // shoeSize: '',
  // timeZone: '',
  // deviceId: '',
  // userId: ''
})
const rules = {
  userName:[
    { required: true, message: 'Please enter your username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Name must be 3-20 characters', trigger: 'blur' },
    { 
      pattern: /^[^\u4e00-\u9fa5]+$/, 
      message: 'Name cannot contain Chinese characters', 
      trigger: 'blur' 
    }
  ],
  sex:[
    { required: true, message: 'Please select your gender', trigger: 'change' },
  ],
  birthday:[
    { required: true, message: 'Please select your birthday', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (!value) return callback()
        const today = new Date()
        const birth = new Date(value)
        const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 13))
        
        if (birth > minAgeDate) {
          callback(new Error('Age must be at least 13 years old'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  country:[
    { required: true, message: 'Please select your country', trigger: 'change' },
  ],
  shoeSize:[
    { required: true, message: 'Please select your shoe size', trigger: 'change' },
  ],
  height:[
    { required: true, message: 'Please enter your height', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const num = Number(value)
        if (isNaN(num) || num < 50 || num > 300) {
          return callback(new Error('Height must be between 50 and 300 cm'))
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  weight:[
    { required: true, message: 'Please enter your weight', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const num = Number(value)
        if (isNaN(num) || num < 1 || num > 999) {
          return callback(new Error('Weight must be between 1 and 999 kg'))
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  waist:[
    { required: true, message: 'Please enter your waist', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const num = Number(value)
        if (isNaN(num) || num < 30 || num > 500) {
          return callback(new Error('Waist must be between 30 and 500 cm'))
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
} 

const userInfo = computed(() => store.state.user.info)
const formRef = ref(null)
const getList = async() => {
  const msg = {
    userId: userInfo.value.userId,
    userName: userInfo.value.userName,
  }
  const res = await getUserInfo(msg)
    if (res.code !== 20000) return
    formData.value = res.data
    initAvatarList()
}

// 处理头像
const avatarList = ref([])
const initAvatarList = async () => {
  const res = await getAvatarList()
  if (res.code !== 20000) return
  avatarList.value = res.data
  let defaultUrl = ''
  for(const i of avatarList.value) {
    if(i.isDefault) {
      defaultUrl = i.avatarUrl
      break
    }
  }
  let chooseUrl = ''
  for(const i of avatarList.value) {
    if(i.avatarUrl === userInfo.value.avatar) {
      chooseUrl = i.avatarUrl
      break
    }
  }
  formData.value.avatar = chooseUrl || defaultUrl
  originalForm.value = JSON.parse(JSON.stringify(formData.value))
}

const dialogAvatar = ref(false)
const openAvatar = () => {
  dialogAvatar.value = true
}
const handleSelectAvatar = (url) => {
  formData.value.avatar = url
  dialogAvatar.value = false
}


// 按钮是否可保存
const isChanged = computed(() => {
  return JSON.stringify(formData.value) !== JSON.stringify(originalForm.value)
}) 
// 获取国家
const countryList = ref([])
const initCountryList = async () => {
  const res = await getCountryList()
  if (res.code !== 20000) return
  const list = res.data.map((item) => ({
    ...item,
    countryCode: String(item.countryCode)
  }))
  countryList.value = list
}
// 获取鞋码
const shoeSizeList = ref([])
const initShoeSizeList = async () => {
  const res = await getShoeSizeList()
  if (res.code !== 20000) return
  shoeSizeList.value = res.data
}

// 操作
const save = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const msg = {
      userName: formData.value.userName,
      gender: formData.value.sex + '',
      avatar: formData.value.avatar,
      birthday: formData.value.birthday,
      country: formData.value.country,
      height: formData.value.height,
      waist: formData.value.waist,
      weight: formData.value.weight,
      unitType: formData.value.unitType,
      shoeSize: formData.value.shoeSize,
      timeZone: formData.value.timeZone,
      deviceId: formData.value.deviceId,
      userId: formData.value.userId
    }
    changeInfo(msg).then(res => {
      if (res.code !== 20000) return
      ElMessage.success({
        message: res.msg,
        type: 'success'
      })
      setTimeout(() => {
        getList()
      }, 1000)
    })
  })
}
const handleSignOut = () => {
  store.dispatch('user/loginOut')
}

const handleChangePassword = () => {
  router.push('/settings/changePassword');
}

const dialogDelete = ref(false)
const handleDeleteAccount = () => {
  dialogDelete.value = true
  // ElMessageBox.confirm(
  //   `
    
  //   `,
  //   'Important Note',
  //   {
  //     dangerouslyUseHTMLString: true, 
  //     confirmButtonText: 'I already know and continue',
  //     cancelButtonText: 'Cancel',
  //     type: 'warning',
  //     center: true,
  //   }
  // )
  //   .then(() => {
  //     ElMessage({
  //       type: 'success',
  //       message: 'Delete completed',
  //     })
  //   })
  //   .catch(() => {
  //     ElMessage({
  //       type: 'info',
  //       message: 'Delete canceled',
  //     })
  //   })
}
onMounted(() => {
  getList()
  // initAvatarList()
  initShoeSizeList()
  initCountryList()
})
</script>

<style scoped>
.settings-container {
  .el-form {
    border: 1px solid rgba(103, 112, 123, 0.3);
    padding: 24px 20px;
    border-radius: 10px;
    background: var(--sidebar-bg-color);
  }
  :deep(.el-form-item__label) {
    color: var(--text-color);
    font-weight: 600;
  }
  :deep(.el-form-item__label):before {
    display: none;
  }
  .upload-avatar {
    position: absolute;
    left: 56px;
    top: 56px;
    cursor: pointer;
  }
  .save-btn-col {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .save-btn {
    float: right;
    /* background: var(--brand-color); */
    border: none;
    width: 80px;
    height: 28px;
  }
  .dark-input {
    --el-input-bg-color: #3E4E69;
  }
  :deep(.el-input__wrapper) {
    background-color: #3E4E69;
  }
  .dark-select :deep(.el-select__wrapper) {
    background-color: #3E4E69;
  }
}
.avatar-item {
  cursor: pointer;
  margin: 0 10px 10px 0;
}

.avatar-list {
  display: flex;
  flex-wrap: wrap;
}

.action-buttons {
  margin-top: 20px;
}

.action-buttons>div button {
  padding: 15px;
  width: 100%;
  max-width: 1000px;
  margin-bottom: var(--middle-distance);
  background: #20232E;
  color: var(--text-color);
  font-size: 12px;
  border: 1px solid rgba(103, 112, 123, 0.3);
  height: 40px;
  line-height: 40px;
  span {
    margin-left: var(--mini-distance);
  }
}
.action-buttons>div button:hover {
    transform: translateY(-1px);
  }
.action-buttons>div .action-buttons-delete {
  background: #B30000;
  border: none;
}
.delete-header-title {
  text-align: left;
  color: var(--warning-bg-color);
}

/* .delete-account-box {
  --el-message-box-width: 500px;
} */

.my-message-box p {
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.cancel-btn {
  background: var(--brand-color);
  color: #fff;
  border: none;
}
.dialog-footer {
  display: flex;
  justify-content: space-evenly;
}
.dialog-footer button {
  width: 190px;
}
.confirm-btn {
  background: #171D25;
  color: #fff;
  border: 1px solid rgba(103, 112, 123, 0.3);
}

:deep(.el-message-box__btns) {
  background: red;
}
</style>