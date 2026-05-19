<template>
    <div class="redemption-page">
        <!-- 顶部信息栏 -->
        <div class="top-bar">
            <div class="points-info">
                <span class="points-icon">
                    <img src="@/assets/icons/cat.webp" alt="cat">
                </span>
                <span class="points-num">1568</span>
            </div>
            <div class="top-actions">
                <el-button class="action-btn" @click="goEditAddress">
                    <el-icon size="16">
                        <Edit />
                    </el-icon>
                    <span style="margin-left: 4px;">Edit Address</span>
                </el-button>
                <el-button class="action-btn" @click="goPointsHistory">
                    <span>
                        <SvgIcon name="viewHistory" width="16px" height="16px" />
                    </span>
                    <span style="margin-left: 4px;">
                        View Points History
                    </span>

                </el-button>
                <el-button class="refresh-btn" @click="getList">
                    <el-icon color="#fff" size="16">
                        <Refresh />
                    </el-icon>
                </el-button>
            </div>
        </div>

        <!-- 商品网格 -->
        <div class="goods-grid">
            <div class="goods-card" v-for="(item, index) in exchangeList" :key="index">
                <!-- 库存/时效标签 -->
                <div class="card-tags" v-if="item.productTag">
                    <span :class="['tag']" :style="{ backgroundColor: item.productTagColor }">{{ item.productTag
                        }}</span>
                </div>
                <!-- 图片占位 -->
                <div class="goods-img-placeholder">
                    <img :src="item.productIcon">
                </div>
                <!-- 商品信息 -->
                <div class="goods-info">
                    <h3 class="goods-title">{{ item.productName }}</h3>
                    <p class="goods-desc">
                        <span>Description: </span>
                        {{ item.productDesc }}
                    </p>
                    <div class="purchase-limit">
                        <span>Purchase Limit:</span>
                        <span class="limit-num">{{ item.redemptionCount }}/{{ item.exchangeRestrictions }}</span>
                    </div>
                    <div class="points-required">
                        <span>Points Required:</span>
                        <span class="points">
                            <span>
                                <img src="@/assets/icons/cat.webp" alt="cat">
                            </span>
                            <span>{{ item.redeemPoints }}</span>
                        </span>
                    </div>
                </div>
                <!-- 兑换按钮 -->
                <el-button class="redeem-btn" type="primary" block @click="exchangeProduct(item)">
                    <span>
                        <SvgIcon name="discount" width="14.4px" height="14.4px" />
                    </span>
                    <span style="margin-left: 4px;">Redeem</span>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance } from 'vue'
import { Edit, Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getExchangeList, productExchange } from '@/api/exchange'
import { getTimeZone } from '@/utils/system'
import { ElMessage } from 'element-plus'


const router = useRouter();
const store = useStore();

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host
const timeZone = ref('')
const getTimeZoneValue = async () => {
    timeZone.value = await getTimeZone(host)
    console.log('timeZone', timeZone.value)
}

const userId = computed(() => store.state.user.info.userId)
const exchangeList = ref([])

const getList = async () => {
    const msg = {
        userId: userId.value
    }
    const res = await getExchangeList(msg)
    exchangeList.value = res.data
    console.log(exchangeList.value)
    // productType，avatarId，totalInventory，redemptionCodeValidity，isActive作用?
}
const exchangeProduct = async (item) => {
    const msg = {
        userId: userId.value,
        productId: item.productId,
        timeZone: timeZone.value
    }
    const res = await productExchange(msg)
    console.log(res)
    if (res.code == 20000) {
        ElMessage({
            message: res.data.message,
            type: 'success',
        });
        getList()
    } else {
        ElMessage({
            message: res.data.message,
            type: 'error',
        });
    }
}

const goEditAddress = () => {
    router.push('/settings/editAddress')
}
const goPointsHistory = () => {
    router.push('/settings/pointsHistory')
}

onMounted(() => {
    getTimeZoneValue()
    getList()
})
</script>

<style scoped>
/* 页面容器 */
.redemption-page {
    margin: 0 auto;
    padding: 20px;
    background: #FAFAFA;
    text-align: left;
    font-size: 12px;
    color: var(--title-color);

    * {
        margin: 0;
        padding: 0;
        font-family: Inter;
    }
}

/* 顶部栏 */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.points-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
}

.points-num {
    background-image: linear-gradient(90deg,
            #1EC9E2 0%,
            #0A80BF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    display: inline-block;
    color: transparent;
}

.top-actions {
    display: flex;
    gap: 12px;
}

.action-btn {
    border: 1px solid #05C3DE;
    color: #05C3DE;
    background: #fff;
    padding: 5px 10px;
    border-radius: 5px;
}

.refresh-btn {
    width: 26px;
    height: 26px;
    background: #05C3DE;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 商品网格 */
.goods-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
}

/* 商品卡片 */
.goods-card {
    position: relative;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-tags {
    position: absolute;
    top: 12px;
    right: 12px;
}

.tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
}

.tag.stock-tight {
    background: #f53f3f;
}

.tag.expire {
    background: #409eff;
}

.goods-img-placeholder {
    width: 100%;
    aspect-ratio: 3 / 2;
    background: #f5f7fa;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    >img {
        width: auto;
        height: 120px;
        object-fit: cover;
    }
}

.goods-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.goods-title {
    font-size: 16px;
}

.goods-desc {
    color: 100%;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.goods-desc span {
    font-weight: 600;
    color: var(--title-color);
}

.purchase-limit,
.points-required {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.points {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #05C3DE;
}

.points img {
    width: 19px;
}

.redeem-btn {
    background: #05C3DE;
    border: none;
}
</style>