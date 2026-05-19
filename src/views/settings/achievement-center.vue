<template>
    <div class="achievement-center">
        <div class="top-section">
            <div class="main-title">Achievement Center</div>
            <p class="progress-text">You've unlocked {{ totalUnlocked }}/{{ totalCount }} <span>({{ percent }}%)</span>
            </p>
            <el-progress :percentage="percent" stroke-width="6" :show-text="false" color="#3c7eff" />
        </div>
        <div class="achievement-container">
            <!-- 顶部 -->


            <!-- 成就分组 -->
            <div class="group" v-for="group in groups" :key="group.id">
                <div class="group-header">
                    <div>
                        <span class="group-title">{{ group.title }}</span>
                        ·
                        <span class="group-desc">{{ group.desc }}</span>
                    </div>
                    <span class="group-count">({{ group.unlocked }}/{{ group.total }})</span>
                </div>
                <el-scrollbar>
                    <div class="item-group-wrapper">
                        <div class="item" :class="{ locked: !item.unlocked }" v-for="item in group.items" :key="item.id"
                            @click="toggleLock(item)">
                            <div class="item-icon">
                                <!-- 根据unlocked切换图 -->
                                <img src="@/assets/icons/collection.webp">
                            </div>
                            <div class="item-name">{{ item.name }}</div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const groups = ref([
    {
        id: 1,
        title: 'Device Pioneer',
        desc: 'Unlock Your Gear Collection',
        total: 8,
        unlocked: 3,
        items: [
            { id: 1, name: 'Walk C2 Plus Enhanced', unlocked: true },
            { id: 2, name: 'Vehicle Hub', unlocked: true },
            { id: 3, name: 'VR Armband', unlocked: true },
            { id: 4, name: 'Walk C', unlocked: false },
            { id: 5, name: 'Walk C2', unlocked: false },
            { id: 6, name: 'Walk C2 Core', unlocked: false },
            { id: 7, name: 'Ioco S', unlocked: false },
            { id: 8, name: 'Ioco', unlocked: false },
        ]
    },
    {
        id: 2,
        title: 'Mileage Legends',
        desc: 'Every Step Counts',
        total: 10,
        unlocked: 10,
        items: [
            { id: 9, name: 'LV1: 100 Steps', unlocked: true },
            { id: 10, name: 'LV2: 10,000 Steps', unlocked: true },
            { id: 11, name: 'LV3: 50,000 Steps', unlocked: true },
            { id: 12, name: 'LV4: 100,000 Steps', unlocked: true },
            { id: 13, name: 'LV5: 200,000 Steps', unlocked: true },
            { id: 14, name: 'LV6: 500,000 Steps', unlocked: true },
            { id: 15, name: 'LV7: 1,000,000 Steps', unlocked: true },
            { id: 16, name: 'LV8: 2,000,000 Steps', unlocked: true },
            { id: 17, name: 'LV9: 5,000,000 Steps', unlocked: true },
            { id: 18, name: 'LV10: 10,000,000 Steps', unlocked: true },
            { id: 25, name: 'LV7: 1,000,000 Steps', unlocked: true },
            { id: 26, name: 'LV8: 2,000,000 Steps', unlocked: true },
            { id: 27, name: 'LV9: 5,000,000 Steps', unlocked: true },
            { id: 28, name: 'LV10: 10,000,000 Steps', unlocked: true },
        ]
    },
    {
        id: 3,
        title: 'Time Alchemist',
        desc: 'Turn Minutes into Mastery',
        total: 8,
        unlocked: 3,
        items: [
            { id: 19, name: 'LV1: 10 Min', unlocked: true },
            { id: 20, name: 'LV2: 10 Hours', unlocked: true },
            { id: 21, name: 'LV3: 50 Hours', unlocked: true },
            { id: 22, name: 'LV4: 100 Hours', unlocked: false },
            { id: 23, name: 'LV5: 200 Hours', unlocked: false },
            { id: 24, name: 'LV6: 500 Hours', unlocked: false },
            { id: 25, name: 'LV7: 1000 Hours', unlocked: false },
            { id: 26, name: 'LV8: 5000 Hours', unlocked: false },
        ]
    }
])

const totalUnlocked = computed(() => groups.value.reduce((s, i) => s + i.unlocked, 0))
const totalCount = computed(() => groups.value.reduce((s, i) => s + i.total, 0))
const percent = computed(() => Math.round(totalUnlocked.value / totalCount.value * 100))

const toggleLock = (item) => {
    item.unlocked = !item.unlocked
}
</script>

<style scoped>
.achievement-center {
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

.achievement-container {
    width: 800px;
    margin: 0 auto;
    /* padding: 20px 0; */
}

/* 顶部 */
.top-section {
    width: 800px;
    margin: 0 auto;

    :deep(.el-progress-bar__outer) {
        height: 15px !important;
    }

    :deep(.el-progress-bar__inner) {
        background-color: #05C3DE !important;
    }
}

.main-title {
    font-size: 24px;
    font-weight: 600;
    padding: 20px 0;
    text-align: center;
    color: #05C3DE;
}

.progress-text {
    margin-bottom: 12px;

    span {
        color: #1677FF;
    }
}

.group,
.top-section {
    padding-bottom: 12px;
}

.group-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.item-group-wrapper {
    display: flex;
    gap: 12px;
}

.item {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
    width: 72px;
    height: 100px;
    background: #f2f3f5;
    border-radius: 8px;
    cursor: pointer;
}

.item-icon {
    width: 100%;
    aspect-ratio: 79 / 65;
}

.item-name {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 30px;
}

/* 锁定样式 完全跟图 */
.locked {
    color: #767676;
    background: url('@/assets/icons/locked-bg.png');
}

/* .locked .item-icon {
    background: #e5e6eb;
    opacity: 0.5;
}

.locked .item-name {
    color: #86909c;
} */
</style>