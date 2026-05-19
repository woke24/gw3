<template>
    <div class="container">
        <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" class="contact-form">
            <!-- Contact 部分 -->
            <h2 class="section-title">Contact</h2>
            <el-form-item prop="contactEmail">
                <el-input v-model="formData.contactEmail" placeholder="Email" class="custom-input" size="large" />
            </el-form-item>

            <!-- Delivery 部分 -->
            <h2 class="section-title">Delivery</h2>

            <el-form-item prop="country">
                <el-select v-model="formData.country" placeholder="Country/Region" class="custom-input" size="large"
                    filterable clearable>
                    <el-option v-for="country in countryList" :key="country.countryCode" :label="country.countryName"
                        :value="country.countryCode">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-row :gutter="16">
                <el-col :span="12">
                    <el-form-item prop="firstName">
                        <el-input v-model="formData.firstName" placeholder="First Name" class="custom-input"
                            size="large" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" prop="lastName">
                    <el-form-item>
                        <el-input v-model="formData.lastName" placeholder="Last Name" class="custom-input"
                            size="large" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item prop="address">
                <el-input v-model="formData.address" placeholder="Address" class="custom-input" size="large" />
            </el-form-item>

            <el-form-item prop="apartment">
                <el-input v-model="formData.apartment" placeholder="Apartment, suit, etc (optional)"
                    class="custom-input" size="large" />
            </el-form-item>

            <el-row :gutter="16">
                <el-col :span="12">
                    <el-form-item prop="city">
                        <el-input v-model="formData.city" placeholder="City" class="custom-input" size="large" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="region">
                        <el-input v-model="formData.region" placeholder="Region" class="custom-input" size="large" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item prop="phone">
                <el-input v-model="formData.phone" placeholder="Phone" class="custom-input" size="large" />
            </el-form-item>

            <!-- Save 按钮 -->
            <el-form-item>
                <el-button type="primary" size="large" class="save-btn" @click="handleSave">
                    Save
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';
import { addressChange, getAddress } from '@/api/exchange'
import { getCountryList } from '@/api/user'
import { getTimeZone } from '@/utils/system'
import { deepClone } from '@/utils/function/deepclone.js'


const store = useStore();
const userId = computed(() => store.state.user.info.userId)

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host
const timeZone = ref('')
const getTimeZoneValue = async () => {
    timeZone.value = await getTimeZone(host)
    console.log('timeZone', timeZone.value)
}

const countryList = ref([])
const getCountry = async () => {
    const res = await getCountryList()
    countryList.value = res.data
    console.log('countryList', res.data)
}


// 表单数据
const formData = ref({
    contactEmail: '',
    country: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    region: '',
    phone: ''
})
const formRef = ref(null)
const rules = {
    contactEmail: [
        { required: true, message: 'Please input your email', trigger: 'blur' },
        { type: 'email', message: 'Please input a valid email address', trigger: ['blur', 'change'] }
    ],
    country: [
        { required: true, message: 'Please select your country', trigger: 'change' }
    ],
    firstName: [
        { required: true, message: 'Please input your first name', trigger: 'blur' }
    ],
    lastName: [
        { required: true, message: 'Please input your last name', trigger: 'blur' }
    ],
    address: [
        { required: true, message: 'Please input your address', trigger: 'blur' }
    ],
    city: [
        { required: true, message: 'Please input your city', trigger: 'blur' }
    ],
    region: [
        { required: true, message: 'Please input your region', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: 'Please input your phone number', trigger: 'blur' }
    ]
}

const getAddressInfo = async () => {
    const msg = {
        userId: userId.value
    }
    const res = await getAddress(msg)
    if (res.code == 20000) {
        formData.value = res.data
    }
}


// 保存按钮事件
const handleSave = async () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            const formDataClone = deepClone(formData.value)
            const msg = {
                userId: userId.value,
                contactEmail: formDataClone.contactEmail,
                country: formDataClone.country,
                firstName: formDataClone.firstName,
                lastName: formDataClone.lastName,
                address: formDataClone.address,
                apartment: formDataClone.apartment,
                city: formDataClone.city,
                region: formDataClone.region,
                phone: formDataClone.phone,
                timeZone: timeZone.value
            }
            console.log(msg)
            const res = await addressChange(msg)
            if (res.code == 20000) {
                ElMessage({
                    message: res.msg,
                    type: 'success',
                });
                resetForm()
                getAddressInfo()
            } else {
                ElMessage({
                    message: res.msg,
                    type: 'error',
                });
            }
        }
    })
}
const resetForm = () => {
    formRef.value.resetFields()
}
onMounted(() => {
    getTimeZoneValue()
    getAddressInfo()
    getCountry()
})
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-size: 12px;
    color: var(--title-color);
    font-family: var(--text-family);
    text-align: left;
}

.section-title {
    font-size: 2rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 20px 0;
}

.contact-form {
    width: 100%;
}

.custom-input {
    width: 100%;
    --el-input-border-radius: 6px;
    --el-input-border-color: #dcdfe6;
    --el-input-hover-border-color: #c0c4cc;
    --el-input-focus-border-color: #409eff;
    font-size: 1.1rem;
}

/* 修复下拉框样式 */
:deep(.el-select__wrapper) {
    border-radius: 6px !important;
    border-color: #dcdfe6 !important;
}

.save-btn {
    width: 100%;
    height: 56px;
    font-size: 1.3rem;
    font-weight: 500;
    border-radius: 6px;
    background-color: #00bcd4;
    /* 匹配截图中的青蓝色 */
    border: none;
}

.save-btn:hover {
    background-color: #00acc1 !important;
}
</style>