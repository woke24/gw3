<template>
  <div class="app-container pd20">
    <div class="fitness-left">
      <div class="fitness-sports-container">
        <fitnessSports :task-data="taskData"></fitnessSports>
      </div>
      <div class="fitness-bottom-data">
        <div class="fitness-data">
          <fitnessData @sendData="handleSendData"></fitnessData>
        </div>
        <div class="fitness-task-armview">
          <div class="fitness-task">
            <fitnessTask></fitnessTask>
          </div>
          <div class="fitness-armview">
            <fitnessArmview></fitnessArmview>
          </div>
        </div>
      </div>
    </div>
    <div class="fitness-right">
      <fitnessHeartRate></fitnessHeartRate>
    </div>
    <!-- <el-row class="pd20" style="gap: 20px;">
      <el-col :span="18">
        
      </el-col>
      <el-col :span="5" class="ft-container">
        
      </el-col>
    </el-row> -->

    <!-- <div class="pd20">
      <el-row>
        <el-col :span="16">
         
          <el-row>
            <el-col :span="12"></el-col>
            <el-col :span="11" :offset="1"></el-col>
          </el-row>
        </el-col>
      </el-row>
    </div> -->
  </div>
</template>

<script lang="js" setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import fitnessSports from '@/views/fitness/components/fitness-sports.vue'
import fitnessData from '@/views/fitness/components/fitness-data.vue'
import fitnessTask from '@/views/fitness/components/fitness-task.vue'
import fitnessArmview from '@/views/fitness/components/fitness-armview.vue'
import fitnessHeartRate from '@/views/fitness/components/fitness-heart-rate.vue'
import { getDaySteps, watchWalkingData, saveWalkingDatas } from '@/utils/global'

// const store = useStore()
// const instance = getCurrentInstance()
// const globalProperties = instance ? instance.appContext.config.globalProperties : {}
// const host = globalProperties.$host
// const fsRef = ref(0)
// fitness data变化时，通知fitness sports更新（如果调用接口的话）
// setTimeout(() => {
//   fsRef.value?.changeVal()
// }, 5000)
// const loadFromJson = async () => {
//   try {
//     const userSteps = await getDaySteps(host)
//     store.commit('user/fitnessDatasChange', userSteps)

//   } catch (err) {
//     console.error('读取本地文件失败:', err)
//   }
// }
// loadFromJson()
const taskData = ref({})
const handleSendData = (data) => {
  taskData.value = data
}


onMounted(() => {

})
</script>
<style lang="scss" scoped>
.app-container {
  display: flex;
  gap: 20px;
  box-sizing: border-box;
  height: auto;
  background: var(--main-bg-color);
  color: var(--text-color);
  font-family: var(--text-family);
}

.fitness-left {
  width: calc(100% - 200px);
}

.fitness-right {
  width: 200px;
  // background: #e0ebff;
  border-radius: 10px;
}

.fitness-bottom-data {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.fitness-data {
  width: 60%;
  // background: #e0ebff;
  background: var(--nav-bg-color);
  padding: 16px 16px 0 16px;
  border-radius: 12px;
}

.fitness-task-armview {
  width: 40%;
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: space-between;
}

.fitness-armview {
  aspect-ratio: 100/50;
}
</style>
