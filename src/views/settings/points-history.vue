<template>
    <div class="point-history-page">
        <!-- 标题栏 -->
        <div class="header" ref="headerArea">
            <div class="title">
                <span class="clock-icon">
                    <SvgIcon name="pointHistory" width="32px" height="32px" />
                </span>
                <div>Point History</div>
            </div>
            <el-select class="type-select" v-model="pointType" placeholder="All Type" @change="getList">
                <el-option label="All Type" value="all" />
                <el-option label="Earned" value="Earned" />
                <el-option label="Consumed" value="Consumed" />
            </el-select>
        </div>

        <!-- 表格 -->
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" :height="tableHeight" border
            :header-cell-style="{ backgroundColor: '#f2f3f5', color: '#333' }">
            <el-table-column prop="date" label="Date" width="120" />
            <el-table-column prop="type" label="Type" width="120">
                <template #default="{ row }">
                    <span :class="row.type === 'Earned' ? 'text-earned' : 'text-consumed'">
                        {{ row.type }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="event" label="Event" min-width="280" />
            <el-table-column prop="point" label="Point" width="60">
                <template #default="{ row }">
                    <span :class="row.point.startsWith('+') ? 'text-earned' : 'text-consumed'">
                        {{ row.point }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="code" label="Code" width="200" />
            <el-table-column prop="status" label="Status" width="100" />
            <el-table-column prop="expiration" label="Expiration Time" width="160" />
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
            <el-pagination v-model:current-page="currentPage" :page-size="pageSize" layout="prev, pager, next"
                :total="tableData.length" />
        </div>

        <!-- 底部说明 -->
        <div class="footer" ref="footerArea">
            <p>
                Click to visit <a href="#" class="link">Points Redemption Rules</a> for details. Our Company reserves
                the final
                right to interpret the points rules and related terms.
            </p>
            <p class="copyright">© 2025, KATVR</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from 'vue'
import { deepClone } from '@/utils/function/deepclone'
import { getPointsHistory } from '@/api/exchange'
import { useStore } from 'vuex';

const store = useStore();
const userId = computed(() => store.state.user.info.userId)
const currentPage = ref(1)
const pageSize = ref(20)
const pointType = ref('all')
const headerArea = ref(null)
const multipleTable = ref(null)
const footerArea = ref(null)
const tableHeight = ref(300)

const getPointsList = async () => {
    const msg = {
        userId: userId.value,
        page: currentPage.value,
        size: pageSize.value
    }
    const res = await getPointsHistory(msg)
    console.log(res)
    if (res.code == 20000) {
        if (res.data.length) {
            tableData.value = res.data
        }
        setTableHeight()
        nextTick(() => {
            multipleTable.value.doLayout()
        })
    }
}

const setTableHeight = () => {
    tableHeight.value = window.innerHeight - 148 - Math.ceil(headerArea.value.clientHeight) - Math.ceil(footerArea.value.clientHeight)
}

// 表格数据（和截图完全一致）
const tableData = ref([
    { date: '2025-04-04', type: 'Earned', event: 'Step Reward', point: '+10', code: '', status: '', expiration: '' },
    { date: '2025-04-04', type: 'Consumed', event: 'Redeem Reward: VR Smart Armband', point: '-20', code: 'a3f7c21e8d4b6590', status: 'unused', expiration: '2026-04-04' },
    { date: '2025-04-04', type: 'Earned', event: 'Ranking Reward', point: '+30', code: '', status: '', expiration: '' },
    { date: '2025-04-04', type: 'Consumed', event: 'Exchange Reward: KAT Nexus', point: '-50', code: '21e8d4b6590a3f7c', status: 'used', expiration: '2026-04-04' },
    { date: '2025-04-04', type: 'Earned', event: 'Step Reward', point: '+30', code: '', status: '', expiration: '' },
    { date: '2025-04-04', type: 'Consumed', event: 'Redeem Reward: Avatar: Calico Cat', point: '-10', code: '8d4b6590a3f7c21e', status: 'used', expiration: '2026-04-04' },
    { date: '2025-04-04', type: 'Earned', event: 'Step Reward', point: '+30', code: '', status: '', expiration: '' },
    { date: '2025-04-04', type: 'Earned', event: 'Device Pair', point: '+200', code: '', status: '', expiration: '' },
    { date: '2025-04-04', type: 'Earned', event: 'Device Pair', point: '+100', code: '', status: '', expiration: '' },
    { date: '2025-04-04', type: 'Earned', event: 'Device Pair', point: '+100', code: '', status: '', expiration: '' },
])
const tableClone = deepClone(tableData.value)
const getList = () => {
    if (pointType.value === 'all') {
        tableData.value = [...tableClone]
    } else {
        tableData.value = tableClone.filter(item => {
            return item.type === pointType.value
        })
    }
}
onMounted(() => {
    getPointsList()
    window.addEventListener('resize', setTableHeight)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setTableHeight)
})
</script>

<style scoped>
.point-history-page {
    height: 100%;
    box-sizing: border-box;
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

/* 标题栏 */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}

.title {
    display: flex;
    align-items: center;
    gap: 8px;
    width: calc(100% - 140px);
    justify-content: center;
}


.title div {
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.type-select {
    width: 140px;
}

/* 表格样式 */
.text-earned {
    color: #00b42a;
    font-weight: 500;
}

.text-consumed {
    color: #f53f3f;
    font-weight: 500;
}

/* 分页 */
.pagination-wrapper {
    display: flex;
    justify-content: center;
}

/* 底部 */
.footer {
    text-align: center;
    font-size: 14px;
    color: #666;
    padding: 12px 0;
}

.link {
    color: #409eff;
    text-decoration: underline;
}

.copyright {
    margin-top: 16px;
    font-size: 13px;
}
</style>