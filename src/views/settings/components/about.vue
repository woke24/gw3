<template>
  <div class="about-container">
    <el-card class="about-card" shadow="hover">
      <!-- 版本信息组 -->
      <div class="version-item">
        <div class="version-label">
          <SvgIcon name="InputVersion" height="24px" width="24px" />
          <span>KAT Input version</span>
        </div>
        <span class="version-value">1.0.0.1</span>
      </div>

      <div class="version-item">
        <div class="version-label">
          <SvgIcon name="GatewayVersion" height="24px" width="24px" />
          <span>Gateway version</span>
        </div>
        <span class="version-value">3.0.0</span>
      </div>

      <div class="version-item">
        <div class="version-label">
          <SvgIcon name="OculusVersion" height="24px" width="24px" />
          <span>Oculus support version</span>
        </div>
        <span class="version-value">1.0.0.1</span>
      </div>

      <div class="version-item">
        <div class="version-label">
          <SvgIcon name="SteamVersion" height="24px" width="24px" />
          <span>Steam support version</span>
        </div>
        <div class="version-actions">
          <span class="version-value">1.0.0.3</span>
          <el-button type="text" size="small" class="reinstall-btn">Reinstall</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="about-card collapse-card" shadow="hover">
      <el-collapse accordion>
        <el-collapse-item name="feedback">
          <template #title>
            <div class="collapse-title">
               <SvgIcon name="Feedback" height="24px" width="24px" />
              <span>Feedback</span>
            </div>
          </template>
          <div class="collapse-content">
            <div class="feedback-container">
              <div style="display: flex; align-items: center">
                <p class="feedback-subtitle feedback-row-title">Share your feedback with us!</p>
                <!-- 反馈类型选择 -->
                <el-select
                  v-model="feedbackType"
                  class="feedback-type-select dark-select"
                  placeholder="Select feedback type"
                >
                  <el-option label="General Feedback" value="general" />
                  <el-option label="Bug" value="bug" />
                  <el-option label="Idea" value="idea" />
                </el-select>
              </div>

              <!-- 反馈内容输入 -->
              <el-input
                v-model="feedbackContent"
                type="textarea"
                :rows="4"
                placeholder="What's on your mind?"
                maxlength="1000"
                show-word-limit
                class="feedback-textarea dark-input"
              />
            </div>
            <!-- 截图上传区 -->
            <div class="upload-section">
              <p class="upload-label">Attach Screenshot (Optional)</p>
              <el-upload
                v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
            <!-- 评分表情 -->
            <div class="rating-section">
              <p class="rating-label feedback-row-title">What are your general thoughts?</p>
              <div class="emoji-group">
                <el-radio-group v-model="thoughts" size="large" class="radio-group" fill="#6c6cff">
                  <el-radio value="like">
                    <SvgIcon name="group_VeryLike" height="25px" width="25px" />
                    <el-icon class="check-mark"><Check /></el-icon>
                  </el-radio>
                  <el-radio value="good">
                    <SvgIcon name="group_like" height="25px" width="25px" />
                    <el-icon class="check-mark"><Check /></el-icon>
                  </el-radio>
                  <el-radio value="upset">
                    <SvgIcon name="group_UnLike" height="25px" width="25px" />
                    <el-icon class="check-mark"><Check /></el-icon>
                  </el-radio>
                  <el-radio value="angry">
                    <SvgIcon name="group_Upset" height="25px" width="25px" />
                    <el-icon class="check-mark"><Check /></el-icon>
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
            <!-- 邮箱输入 -->
            <div class="email-section">
              <p class="email-label feedback-row-title">Your Email Address</p>
              <el-input v-model="email" placeholder="your.email@example.com" class="email-input dark-input" />
            </div>
            <!-- 提交按钮 -->
            <el-button
              type="primary"
              class="submit-btn"
              @click="handleSubmit"
              :disabled="!feedbackContent"
            >
              Send
            </el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card class="about-card collapse-card" shadow="hover">
      <el-collapse accordion>
        <el-collapse-item name="terms">
          <template #title>
            <div class="collapse-title">
              <SvgIcon name="UseTerms" height="24px" width="24px" />
              <span>Terms of use</span>
            </div>
          </template>
          <div class="collapse-content">
            <p>Terms of use</p>
          </div>
        </el-collapse-item>

        <el-collapse-item name="privacy">
          <template #title>
            <div class="collapse-title">
              <SvgIcon name="PrivacyPolicy" height="24px" width="24px" />
              <span>Privacy policy</span>
            </div>
          </template>
          <div class="collapse-content">
            <p>Privacy policy</p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Plus } from '@element-plus/icons-vue'
const feedbackType = ref('general')
const feedbackContent = ref('')
const email = ref('')
const thoughts = ref('like')

const fileList = ref([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  }
])
// 提交反馈
const handleSubmit = () => {
  ElMessage.success('Feedback submitted successfully!')
  // 重置表单
  feedbackContent.value = ''
  // previewImage.value = ''
  // activeEmoji.value = 'happy'
}
</script>

<style scoped>
.about-container {
  font-family: var(--text-family);
}
.about-container > div {
  margin-bottom: 20px;
}
.about-card {
  border-radius: 8px;
  border: 1px solid rgba(103, 112, 123, 0.3);
  color: var(--text-color);
  background: var(--nav-bg-color);
}
.about-card :deep(.el-card__body) {
  padding: 0 20px;
}
.collapse-card :deep(.el-collapse) {
  border: none;
  --el-collapse-border-color: 1px solid rgba(103, 112, 123, 0.3);
}
.version-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}


.version-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  color: #909399;
}

.version-value {
  font-size: 14px;
}

.version-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reinstall-btn {
  color: var(--brand-color);
  padding: 0;
}

.collapse-group {
  margin-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.about-card :deep(.el-collapse-item__header) {
  border-top: none;
  background: var(--nav-bg-color);
  color: var(--text-color);
}
.el-collapse-item__header.is-active {
  border-bottom: none;
}
:deep(.el-collapse-item__wrap) {
  background: var(--nav-bg-color);
  border-bottom: 1px solid rgba(103, 112, 123, 0.3);
}

.collapse-content {
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.6;
  text-align: left;
}

.collapse-content ul {
  margin: 8px 0 16px;
  padding-left: 20px;
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback-container {
  padding: 16px 0;
}

.feedback-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #303133;
}

.feedback-subtitle {
  font-size: 14px;
}

.feedback-type-select {
  width: 200px;
  margin-left: auto;
  display: block;
}

.feedback-textarea {
  margin-bottom: 16px;
  border-radius: 4px;
}


.upload-section {
  margin-bottom: 16px;
}

.upload-label {
  margin: 0 0 8px 0;
}

.upload-container {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.preview-item {
  position: relative;
  width: 180px;
  height: 120px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* .remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  padding: 2px;
  border-radius: 50%;
} */

/* .upload-btn {
  width: 180px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-placeholder {
  color: #c0c4cc;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
} */

.rating-section {
  margin-bottom: 16px;
  :deep(.el-textarea__inner) {
    box-shadow: unset;
  }
  :deep(.el-textarea .el-input__count) {
    background: transparent;
  }
  :deep(.el-radio__input) {
    display: none;
  }
  :deep(.el-radio) {
    position: relative;
    margin-right: 12px;
  }
  .check-mark {
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 16px;
    color: #ffffff;
    background-color: var(--success-bg-color);
    border-radius: 50%;
    padding: 2px;
    display: none;
  }
  :deep(.el-radio.is-checked) .check-mark {
    display: inline-flex;
  }
  :deep(.el-radio.is-checked svg) {
    filter: brightness(1.5);
  }
}

.feedback-row-title {
  font-size: 16px;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.emoji-group {
  display: flex;
  gap: 16px;
}

.emoji {
  font-size: 28px;
  cursor: pointer;
  color: #c0c4cc;
  transition: color 0.2s;
}

.emoji.active {
  color: #409eff;
}

.email-section {
  margin-bottom: 24px;
}

.email-input {
  width: 300px;
}

.submit-btn {
  margin-left: auto;
  display: block;
  background: var(--brand-color);
  border-color: var(--brand-color);
  width: 80px;
  height: 30px;
}
</style>
