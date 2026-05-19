<template>
    <div class="profile-page">
        <!-- 左侧：帖子列表 -->
        <div class="post-list">
            <el-tabs v-model="activeTab" class="profile-tabs">
                <!-- <el-tab-pane v-for="tab in tabList" :key="tab.name" :name="tab.name">
                    <template #label>
                        <span class="custom-tabs-label">
                            <SvgIcon :name="tab.name" width="16px" height="16px" />
                            <span>{{ tab.text }}</span>
                        </span>
                    </template>
</el-tab-pane> -->
                <el-tab-pane name="post">
                    <template #label>
                        <span class="custom-tabs-label">
                            <SvgIcon name="post" width="16px" height="16px" />
                            <span>POST</span>
                        </span>
                    </template>
                    <div class="post-item" v-for="item in postList" :key="item.id">
                        <div class="post-header">
                            <div class="user-info">
                                <div class="avatar-placeholder" aspect-ratio="1/1">
                                    <img :src="userInfo.avatar" alt="avatar"
                                        v-if="userInfo.avatar && userInfo.avatar.indexOf('http') === 0">
                                    <img src="@/assets/icons/avatar.webp" alt="avatar" v-else>
                                </div>
                                <div class="user-meta">
                                    <div class="user-meta-top">
                                        <div class="username">{{ userInfo.userName }}</div>
                                        <el-tag type="info" size="small" effect="light" round class="user-tag">Hermes
                                            Reborn</el-tag>
                                    </div>
                                    <div class="post-rating">
                                        <el-rate v-model="item.rate" allow-half disabled false />
                                    </div>
                                </div>
                            </div>
                            <span class="post-time">{{ item.time }}</span>
                        </div>

                        <div class="post-content">
                            <div>
                                {{ item.content }}
                            </div>
                            <div class="post-tags">
                                <el-tag v-for="tag in item.tags" :key="tag" size="small" class="tag-item">{{ tag
                                    }}</el-tag>
                                <el-tag v-if="item.profile" size="small" class="tag-item tag-item-file">{{ item.profile
                                }}</el-tag>
                            </div>
                            <div class="post-actions">
                                <div class="action-item" @click="handleLike(item)">
                                    <SvgIcon v-show="item.isLike" name="liked" width="16px" height="16px" />
                                    <SvgIcon v-show="!item.isLike" name="nolike" width="16px" height="16px" />
                                    <span>{{ item.like }}</span>
                                </div>
                                <div class="action-item collect" @click="handleCollect(item)">
                                    <el-icon v-show="item.isCollect" color="#05C3DE" size="16">
                                        <StarFilled />
                                    </el-icon>
                                    <el-icon v-show="!item.isCollect" color="#333" size="16">
                                        <Star />
                                    </el-icon>
                                    <span>{{ item.favorite }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-more">No More Results</div>
                </el-tab-pane>

                <el-tab-pane name="profile">
                    <template #label>
                        <span class="custom-tabs-label">
                            <SvgIcon name="profile" width="16px" height="16px" />
                            <span>PROFILE</span>
                        </span>
                    </template>
                    <div class="post-item" v-for="item in postList.filter(item => item.profile)" :key="item.id">
                        <div class="post-header">
                            <div class="user-info">
                                <div class="avatar-placeholder" aspect-ratio="1/1">
                                    <img :src="userInfo.avatar" alt="avatar"
                                        v-if="userInfo.avatar && userInfo.avatar.indexOf('http') === 0">
                                    <img src="@/assets/icons/avatar.webp" alt="avatar" v-else>
                                </div>
                                <div class="user-meta">
                                    <div class="user-meta-top">
                                        <div class="username">{{ userInfo.userName }}</div>
                                        <el-tag type="info" size="small" effect="light" round class="user-tag">Hermes
                                            Reborn</el-tag>
                                    </div>
                                    <div class="post-rating">
                                        <el-rate v-model="item.rate" allow-half disabled false />
                                    </div>
                                </div>
                            </div>
                            <span class="post-time">{{ item.time }}</span>
                        </div>

                        <div class="post-content">
                            <div>
                                {{ item.content }}
                            </div>
                            <div class="post-tags">
                                <el-tag v-for="tag in item.tags" :key="tag" size="small" class="tag-item">{{ tag
                                }}</el-tag>
                                <el-tag v-if="item.profile" size="small" class="tag-item tag-item-file">{{ item.profile
                                    }}</el-tag>
                            </div>
                            <div class="post-actions">
                                <div class="action-item" @click="handleLike(item)">
                                    <SvgIcon v-show="item.isLike" name="liked" width="16px" height="16px" />
                                    <SvgIcon v-show="!item.isLike" name="nolike" width="16px" height="16px" />
                                    <span>{{ item.like }}</span>
                                </div>
                                <div class="action-item collect" @click="handleCollect(item)">
                                    <el-icon v-show="item.isCollect" color="#05C3DE" size="16">
                                        <StarFilled />
                                    </el-icon>
                                    <el-icon v-show="!item.isCollect" color="#333" size="16">
                                        <Star />
                                    </el-icon>
                                    <span>{{ item.favorite }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-more">No More Results</div>
                </el-tab-pane>

                <el-tab-pane name="like">
                    <template #label>
                        <span class="custom-tabs-label">
                            <SvgIcon name="like" width="16px" height="16px" />
                            <span>LIKE</span>
                        </span>
                    </template>
                    <div class="post-item" v-for="item in postList.filter(item => item.isLike)" :key="item.id">
                        <div class="post-header">
                            <div class="user-info">
                                <div class="avatar-placeholder" aspect-ratio="1/1">
                                    <img :src="userInfo.avatar" alt="avatar"
                                        v-if="userInfo.avatar && userInfo.avatar.indexOf('http') === 0">
                                    <img src="@/assets/icons/avatar.webp" alt="avatar" v-else>
                                </div>
                                <div class="user-meta">
                                    <div class="user-meta-top">
                                        <div class="username">{{ userInfo.userName }}</div>
                                        <el-tag type="info" size="small" effect="light" round class="user-tag">Hermes
                                            Reborn</el-tag>
                                    </div>
                                    <div class="post-rating">
                                        <el-rate v-model="item.rate" allow-half disabled false />
                                    </div>
                                </div>
                            </div>
                            <span class="post-time">{{ item.time }}</span>
                        </div>

                        <div class="post-content">
                            <div>
                                {{ item.content }}
                            </div>
                            <div class="post-tags">
                                <el-tag v-for="tag in item.tags" :key="tag" size="small" class="tag-item">{{ tag
                                    }}</el-tag>
                                <el-tag v-if="item.profile" size="small" class="tag-item tag-item-file">{{ item.profile
                                }}</el-tag>
                            </div>
                            <div class="post-actions">
                                <div class="action-item" @click="handleLike(item)">
                                    <SvgIcon v-show="item.isLike" name="liked" width="16px" height="16px" />
                                    <SvgIcon v-show="!item.isLike" name="nolike" width="16px" height="16px" />
                                    <span>{{ item.like }}</span>
                                </div>
                                <div class="action-item collect" @click="handleCollect(item)">
                                    <el-icon v-show="item.isCollect" color="#05C3DE" size="16">
                                        <StarFilled />
                                    </el-icon>
                                    <el-icon v-show="!item.isCollect" color="#333" size="16">
                                        <Star />
                                    </el-icon>
                                    <span>{{ item.favorite }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-more">No More Results</div>
                </el-tab-pane>
                <el-tab-pane name="favorite">
                    <template #label>
                        <span class="custom-tabs-label">
                            <SvgIcon name="favorite" width="16px" height="16px" />
                            <span>FAVORITE</span>
                        </span>
                    </template>
                    <div class="post-item" v-for="item in postList.filter(item => item.isCollect)" :key="item.id">
                        <div class="post-header">
                            <div class="user-info">
                                <div class="avatar-placeholder" aspect-ratio="1/1">
                                    <img :src="userInfo.avatar" alt="avatar"
                                        v-if="userInfo.avatar && userInfo.avatar.indexOf('http') === 0">
                                    <img src="@/assets/icons/avatar.webp" alt="avatar" v-else>
                                </div>
                                <div class="user-meta">
                                    <div class="user-meta-top">
                                        <div class="username">{{ userInfo.userName }}</div>
                                        <el-tag type="info" size="small" effect="light" round class="user-tag">Hermes
                                            Reborn</el-tag>
                                    </div>
                                    <div class="post-rating">
                                        <el-rate v-model="item.rate" allow-half disabled false />
                                    </div>
                                </div>
                            </div>
                            <span class="post-time">{{ item.time }}</span>
                        </div>

                        <div class="post-content">
                            <div>
                                {{ item.content }}
                            </div>
                            <div class="post-tags">
                                <el-tag v-for="tag in item.tags" :key="tag" size="small" class="tag-item">{{ tag
                                }}</el-tag>
                                <el-tag v-if="item.profile" size="small" class="tag-item tag-item-file">{{ item.profile
                                    }}</el-tag>
                            </div>
                            <div class="post-actions">
                                <div class="action-item" @click="handleLike(item)">
                                    <SvgIcon v-show="item.isLike" name="liked" width="16px" height="16px" />
                                    <SvgIcon v-show="!item.isLike" name="nolike" width="16px" height="16px" />
                                    <span>{{ item.like }}</span>
                                </div>
                                <div class="action-item collect" @click="handleCollect(item)">
                                    <el-icon v-show="item.isCollect" color="#05C3DE" size="16">
                                        <StarFilled />
                                    </el-icon>
                                    <el-icon v-show="!item.isCollect" color="#333" size="16">
                                        <Star />
                                    </el-icon>
                                    <span>{{ item.favorite }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-more">No More Results</div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 右侧：个人信息卡片 -->
        <div style="max-width: 400px;">
            <div class="profile-card">
                <div class="banner-placeholder" aspect-ratio="38/9">
                    <img src="@/assets/icons/avatar-bg.webp" alt="avatar-bg">
                </div>
                <div class="avatar-wrapper">
                    <div class="avatar-placeholder large" aspect-ratio="1/1">
                        <img :src="userInfo.avatar" alt="avatar"
                            v-if="userInfo.avatar && userInfo.avatar.indexOf('http') === 0">
                        <img src="@/assets/icons/avatar.webp" alt="avatar" v-else>
                    </div>
                    <el-button class="edit-btn">Edit Profile</el-button>
                </div>
                <div class="profile-basic">
                    <div class="name-row">
                        <div class="username">Elon Musk</div>
                        <el-tag type="success" size="small" class="user-tag">Hermes Reborn</el-tag>
                    </div>
                    <p class="email">elonmusk@katvr.com</p>
                    <div class="stats-row">
                        <span>Height <span>173cm</span></span>
                        <span>Weight <span>58kg</span></span>
                        <span>Age <span>18</span></span>
                        <span>Wastline <span>76cm</span></span>
                    </div>
                    <div class="points-row">
                        <div class="points">
                            <SvgIcon name="point" width="16px" height="16px" />
                            <span>KAT Points: <span>321</span></span>
                            <el-icon>
                                <Refresh />
                            </el-icon>
                        </div>
                        <el-button size="small" round class="rewards-btn">
                            <SvgIcon name="gift" width="12px" height="12px" />
                            <span style="margin-left: 2px;" @click="getRewards">Get Rewards</span>
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="profile-card">
                <div class="achievement-title">
                    Achievement
                </div>
                <div class="achievement-progress">You've unlocked 11/21 <span>(52%)</span></div>
                <el-progress :percentage="52" :show-text="false" />
                <div class="achievement-section">
                    <div class="achievement-list">
                        <div class="achievement-item" v-for="item in achievementList" :key="item.id">
                            <div class="achievement-icon" aspect-ratio="1/1"></div>
                            <span class="achievement-name">{{ item.name }}</span>
                        </div>
                        <div class="achievement-item more" @click="moreAchievements">
                            <span>9+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang='js' setup>
import { ref, reactive, computed } from 'vue'
import { Star, StarFilled, Refresh } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';

const store = useStore()
const userInfo = computed(() => store.state.user.info)
const router = useRouter();
console.log(userInfo.value);

// const tabList = ref([
//     {
//         name: 'post',
//         text: 'POST'
//     },
//     {
//         name: 'profile',
//         text: 'PROFILE'
//     },
//     {
//         name: 'like',
//         text: 'LIKE'
//     },
//     {
//         name: 'favorite',
//         text: 'FAVORITE'
//     }
// ])

const activeTab = ref('post')
const postList = ref([
    {
        id: 1,
        time: '2025/11/29 08:16',
        rate: 4.5,
        content: 'Alyx isn’t just a standout VR game—it’s a masterclass that redefined what virtual reality could be. Valve didn’t just adapt the Half-Life universe for VR; it built an experience that relies on the medium to feel alive: every crate you stack, every door you pry open, and every Combine soldier you outmaneuver feels tactile, urgent, and deeply immersive, turning City 17’s dystopian streets into a world you don’t just explore, but inhabit.',
        tags: ['Steam', 'C3 Ultra', 'Valve Index'],
        profile: 'Half-Life: Alyx',
        isLike: false,
        like: 16,
        isCollect: false,
        favorite: 8
    },
    {
        id: 2,
        time: '2025/10/21 18:07',
        rate: 4,
        content: 'It’s not flawless (some planets blur into familiarity, early-game resource grinding can drag), but those rough edges feel intentional, grounding the vastness of space in something tangible.',
        tags: ['Steam', 'C3 Ultra', 'Valve Index'],
        profile: 'No Man\'s Sky',
        like: 47,
        isLike: true,
        isCollect: true,
        favorite: 9
    },
    {
        id: 3,
        time: '2025/10/21 12:51',
        rate: 5,
        content: 'Fallout 4 VR isn’t the most polished VR title out there, but it’s one of the most unforgettable—because nothing compares to standing in the shoes of a Sole Survivor, staring out at the irradiated',
        tags: ['Quest', 'C3 Ultra', 'Meta Quest3'],
        profile: null,
        isLike: false,
        like: 0,
        isCollect: false,
        favorite: 0
    }
])

const achievementList = ref([
    { id: 1, name: 'LV8: 5000h' },
    { id: 2, name: '10th Anniversary' },
    { id: 3, name: 'Contributor' },
    { id: 4, name: 'Walk C2 Plus Enha...' }
])

const handleCollect = async (item) => {
    item.isCollect = !item.isCollect
    item.favorite += item.isCollect ? 1 : -1
}
const handleLike = async (item) => {
    item.isLike = !item.isLike
    item.like += item.isLike ? 1 : -1
}
const moreAchievements = () => {
    router.push('/settings/achievementCenter')
}
const getRewards = () => {
    console.log('1111')
    router.push('/settings/rewards')
}
</script>
<style lang='scss' scoped>
.profile-page {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: var(--small-distance);
    padding: var(--big-distance);
}

.custom-tabs-label {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
}

/* 左侧帖子列表 */
.post-list {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    text-align: left;
    border: 1px solid #EEEEEE;
    // overflow-y: hidden;
    height: calc(100vh - 148px);
    font-family: Inter;

    :deep(.el-tabs__content) {
        height: calc(100vh - 240px);
        overflow-y: scroll;
    }

    :deep(.el-tabs__nav) {
        width: 100%;
    }

    :deep(.el-tabs__item) {
        flex: 1
    }

    :deep(.el-tabs__active-bar) {
        background: #0256FF;
    }

    :deep(.el-tabs__item.is-active) {
        color: inherit;
        font-weight: 600;
    }

    :deep(.el-tabs__item):hover {
        color: inherit;
        font-weight: 600;
    }

    .user-tag {
        background: linear-gradient(90deg, #FDDAC5 0%, #FABBED 30%, #90C3FF 50%, #A1FCC6 70%, #DAF7E6 100%);
        color: #fff;
    }

    :deep(.el-rate .el-rate__icon) {
        margin-right: 2px;
    }

    :deep(.el-rate .el-rate__icon.is-active) {
        color: #05C3DE;
    }

    :deep(.el-rate .el-rate__icon.el-rate__decimal) {
        color: #05C3DE;
    }

    .no-more {
        text-align: center;
        font-size: 12px;
        color: #AAAAAA;
        line-height: 3;
        padding: 20px 0;
    }
}

.profile-tabs {
    --el-tabs-header-height: 40px;
}

.post-item {
    padding: 16px 0;
    border-bottom: 1px solid #eee;
}

.post-item:last-child {
    border-bottom: none;
}

.post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar-placeholder {
    width: 40px;
    height: 40px;
    background: #f0f0f0;
    border-radius: 50%;

    >img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.avatar-placeholder.large {
    width: 60px;
    height: 60px;
    position: relative;
    top: -30px;
    border: 4px solid #fff;
}

.avatar-placeholder.large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-meta {
    display: flex;
    flex-direction: column;
    // align-items: center;
    // gap: 8px;
}

.user-meta-top {
    display: flex;
    align-items: center;
    gap: 4px;
}

.username {
    font-size: 12px;
    font-weight: 600;
}

.post-time {
    font-size: 14px;
    color: #666;
}

.post-content {
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    padding-left: 52px;
    margin-bottom: 8px;
}

.post-content>div {
    margin-bottom: 8px;
}

.post-tags>span {
    margin-right: 4px;
}

.tag-item {
    background: #e8f3ff;
    color: #1890ff;
    border: none;
}

.tag-item-file {
    background: #EEEEEE;
    color: #767676;
}

.post-actions {
    display: flex;
    gap: 24px;
}

.action-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #666;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
}

/* 右侧个人信息卡片 */
.profile-card {
    background: #fff;
    border-radius: 8px;
    // overflow: hidden;
    padding: var(--small-distance);
    border: 1px solid #eeeeee;
    text-align: left;
    color: #767676;
    font-family: Inter;
    margin-bottom: 10px;

    .username {
        font-size: 20px;
    }

    .user-tag {
        background: linear-gradient(90deg, #FDDAC5 0%, #FABBED 30%, #90C3FF 50%, #A1FCC6 70%, #DAF7E6 100%);
        color: #fff;
        border-radius: 8px;
    }

    .rewards-btn {
        color: var(--title-color);
    }

    .rewards-btn svg {
        position: relative;
        top: -1px;
    }

    .achievement-title {
        font-size: 16px;
        margin-bottom: 12px;
        color: var(--title-color);
    }

    :deep(.el-progress-bar__inner) {
        background-color: #05C3DE;
    }

    :deep(.el-progress-bar__outer) {
        height: 10px !important;
    }
}

.banner-placeholder {
    width: 100%;
    border-radius: 8px;
    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
}

.banner-placeholder>img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
}

.avatar-wrapper {
    padding: 0 16px;
    position: relative;
    height: 45px;
}

.edit-btn {
    position: absolute;
    right: 16px;
    top: 16px;
}

// .profile-basic {
//     padding: 0 16px 16px;
// }

.name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.email {
    font-size: 12px;

    margin: 0 0 8px;
}

.stats-row {
    display: flex;
    gap: 16px;
    font-size: 12px;
    // color: #767676;;
    padding-bottom: 8px;
    border-bottom: 1px solid #EEEEEE;
}

.stats-row span>span {
    color: var(--title-color);
}

.points-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
}

.points {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}

.points span>span {
    color: #05C3DE;
}

// .achievement-section h3 {
//     margin: 0 0 8px;
//     font-size: 18px;
// }

.achievement-progress {
    font-size: 12px;
    color: #767676;
    margin-bottom: 8px;

    span {
        color: #AAAAAA;
    }
}

.achievement-list {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    overflow-x: auto;
}

.achievement-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 72px;
    background: #f0f0f0;
}

.achievement-icon {
    width: 60px;
    height: 60px;
    border-radius: 8px;
}

.achievement-name {
    font-size: 12px;
    color: #666;
    text-align: center;
}

.achievement-item.more {
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    color: #666;
}

// .empty-placeholder {
//     padding: 40px;
//     text-align: center;
//     color: #999;
// }</style>