<template>
  <el-card class="task-card" shadow="hover">
    <!-- 标题 -->
    <div class="task-title">Daily Task</div>

    <!-- 任务列表 -->
    <div class="task-item task-item1">
      <el-row>
        <el-col :span="16" class="ft-row-details">
          <div class="ft-task-icon-div">
            <SvgIcon name="task" class="ft-task-icon" />
          </div>
          <div class="task-name">{{ taskList[0]?.taskName ? taskList[0]?.taskName : 'First Step'}}</div>
          <div>
            ({{ task1steps }}/1)
          </div>
        </el-col>
        <el-col :span="8">
          <div class="task-value">
            {{  task1Points }}/100
          </div>
        </el-col>
      </el-row>
      <el-progress :percentage="task1per" :color="'#05C3DE'" :stroke-width="strokeWidth" :text-inside="true" />
    </div>

    <div class="task-item task-item2">
      <el-row>
        <el-col :span="16" class="ft-row-details">
          <div class="ft-task-icon-div">
            <SvgIcon name="task" class="ft-task-icon" />
          </div>
          <div class="task-name">{{ taskList[1]?.taskName ? taskList[1]?.taskName : 'Daily Steps' }}</div>
        </el-col>
        <el-col :span="8">
          <div class="task-value">
              {{ task2Points }}/500
          </div>
        </el-col>
      </el-row>
      <el-progress :percentage="task2per" :color="'#FAAD14'" :stroke-width="strokeWidth" :text-inside="true" />
    </div>

    <div class="task-item task-item3">
      <el-row>
        <el-col :span="16" class="ft-row-details">
          <div class="ft-task-icon-div">
            <SvgIcon name="task" class="ft-task-icon" />
          </div>
          <div class="task-name">{{ taskList[2]?.taskName ? taskList[2]?.taskName : 'Walking Champion' }}</div>
          <div>
            ({{ task3steps }}/7)
          </div>
        </el-col>
        <el-col :span="8">
          <div class="task-value">
            {{ task3Points }}/7000
          </div>
        </el-col>
      </el-row>
      <el-progress :percentage="task3per" :color="'#FF4D4F'" :stroke-width="strokeWidth" :text-inside="true" />
    </div>

    <!-- 领取奖励按钮 -->
    <el-button type="primary" class="reward-btn" @click="getReward">
       <SvgIcon name="gift" width="16px" height="16px" class="gift-icon" />
      Get Reward
    </el-button>
  </el-card>
</template>

<script lang="js" setup>
import { computed, ref, onMounted, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { dailyTaskList } from '@/api/user'

import { configRead, configWrite } from '@/utils/system'
import { getUserInfo } from '@/utils/global'
import { useRouter } from 'vue-router';

const instance = getCurrentInstance()
const globalProperties = instance ? instance.appContext.config.globalProperties : {}
const host = globalProperties.$host
const store = useStore()

const NAMESPACE = 'device'
let dailySteps = computed(() => store.getters[`${NAMESPACE}/getDailySteps`]?.steps || 0)

const taskList = ref([])
const taskPoints = ref(0)

const task1steps = ref(0)
const task1Points = ref(0)
const task1per = ref(0)

const task2Points = ref(0)
const task2per = ref(0)

const task3steps = ref(0)
const task3Points = ref(0)
const task3per = ref(0)

const getDailyTaskList = async () => {
  const userInfo = await getUserInfo(host)
  const userId = userInfo ? userInfo.userId : null
  if (userId) {
    const res = await dailyTaskList({ userId: userId })
    if (res.code === 20000) {
      taskList.value = res.data.list
      taskPoints.value = res.data.totalPoints
      initTask()
      await saveTaskList(res.data)
    }
  }
  return
}

// 写入本地
const saveTaskList = async (configs) => {
  const folderPath = 'Local/New_Gateway'
  const fileName = 'DailyTaskList.json'
  if (configs) {
    const data = JSON.stringify(configs)
    return await configWrite(host, folderPath, fileName, data)
  }
}

const strokeWidth = 12

const initTask = () => {
  // 限制1次 <100, 进度为0；>100, 进度为1，分数为100，百分比100
  const task1Steps = taskList.value[0]?.taskSteps || 100
  task1steps.value = dailySteps.value >= task1Steps ? 1 : 0
  task1Points.value = dailySteps.value >= task1Steps ? 100 : dailySteps.value
  task1per.value = Math.min(Math.round((dailySteps.value / task1Steps) * 100), 100)
  // 无限制, 非500整倍数取余，取余数/500，取余数百分比向下取整；500整数倍，分数为500，百分比100
  const task2Steps = taskList.value[1]?.taskSteps || 500
  task2Points.value = (dailySteps.value > 0 && dailySteps.value % task2Steps === 0) ? 500 : dailySteps.value % task2Steps
  task2per.value = (dailySteps.value > 0 && dailySteps.value % task2Steps === 0)
    ? 100
    : Math.round((dailySteps.value % task2Steps) / task2Steps * 100) || 0
  // >=7000，进度为7，分数取7000，百分比取100， 否则以整千为节点，进度+1，分数如实，百分比向下取整
  const task3Steps = taskList.value[2]?.taskSteps || 7000
  task3steps.value = dailySteps.value >= task3Steps ? 7 : Math.floor(dailySteps.value / 1000)
  task3Points.value = dailySteps.value >= task3Steps ? task3Steps : dailySteps.value
  if (dailySteps.value >= task3Steps) {
    task3per.value = 100;
  } else {
    const thousands = Math.floor(dailySteps.value / 1000) * 1000;
    task3per.value = Math.round((thousands / task3Steps) * 100);
  }
}

watch(dailySteps, (newVal) => {
  if (newVal) {
    initTask()
  }
  
}, {
  immediate: true,
  deep: true
  }, {
    immediate: true,
    deep: true   
})

const router = useRouter();
const getReward = () => {
  router.push('/settings/rewards');
}

onMounted(() => {
  getDailyTaskList()
})

</script>
<style lang="scss" scoped>
/* 外层卡片样式 */
.task-card {
  // background-color: #e0ebff;
  background-color: var(--nav-bg-color);
  color: var(--text-color);
  border-radius: 12px;
  border: none;

  :deep(.el-progress-bar__innerText) {
    display: block;
  }
}

/* 标题样式 */
.task-title {
  font-size: 20px;
  font-weight: bold;
  // color: #0958d9;
  color: var(--brand-color);
  margin-bottom: 16px;
  text-align: left;
}

/* 单个任务项间距 */
.task-item {
  padding-bottom: 10px;
}

.task-item :deep(.el-row),
.ft-row-details {
  align-items: center;
}

/* 任务名称样式 */
.ft-row-details {
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  gap: 4px;
}

.task-value {
  text-align: right;
  font-size: 12px;
}

.ft-task-icon-div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ft-task-icon {
  width: 24px;
  height: 24px;
}

.task-item1 .ft-task-icon {
  color: #05C3DE;
}
.task-item1 :deep(.el-progress-bar__outer) {
  background-color: #076871;
}
.task-item2 :deep(.el-progress-bar__outer) {
  background-color: #5B4820;
}

.task-item2 .ft-task-icon {
  color: #FAAD14;
}

.task-item3 :deep(.el-progress-bar__outer) {
  background-color: #5D2B32;
}

.task-item3 .ft-task-icon {
  color: #FF4D4F;
}

.reward-btn {
  width: 100%;
  border-radius: 12px;
  font-size: 12px;
  padding: 14px 0;
  // background-color: #409eff;
  background-color: var(--brand-color);
  border: none;
  margin-top: 10px;
}

.gift-icon {
  margin-right: 8px;
}
</style>
