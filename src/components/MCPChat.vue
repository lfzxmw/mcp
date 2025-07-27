<script setup>
import { ref, reactive } from 'vue';
import { parseMCPIntent, runMCPTask } from '../services/mcpService';

// 用户输入和聊天历史
const userInput = ref('');
const chatHistory = ref([]);
const isLoading = ref(false);
const bookingState = reactive({
  time: null,
  location: null,
  attendees: null,
  currentField: null
});

// 问题配置
const questions = {
  time: "请问会议时间是什么时候？",
  location: "请问会议在哪个地点？",
  attendees: "请问大约有多少人参加？"
};

const followUps = {
  time: "请明确一下时间，比如“明天上午9点”",
  location: "地点不太清楚，可以告诉我是哪个城市或楼层吗？",
  attendees: "人数不太明确，请尽量给个数字哦～"
};

// 检查是否完成所有必填项
function isBookingComplete() {
  return bookingState.time && bookingState.location && bookingState.attendees;
}

// 调用阿里云百炼API的函数
async function callMCPApi() {
  if (!userInput.value.trim()) return;
  
  isLoading.value = true;
  
  // 添加用户消息到聊天历史
  chatHistory.value.push({
    role: 'user',
    content: userInput.value
  });
  
  try {
    // 调用服务解析用户意图
    const intentResponse = await parseMCPIntent(userInput.value);

    if (!intentResponse.success) {
      throw new Error(intentResponse.error);
    }

    const { field, value, is_uncertain } = intentResponse.intent;

    // 更新预订状态
    if (field && value && !is_uncertain) {
      bookingState[field] = value;
    }

    // 添加解析结果到聊天历史
    let assistantMessage = '';
    if (is_uncertain) {
      assistantMessage = followUps[field] || '请提供更明确的信息';
    } else if (field) {
      assistantMessage = `已确认${field === 'time' ? '时间' : field === 'location' ? '地点' : '参会人数'}: ${value}`;
      
      // 检查是否需要继续提问
      if (!isBookingComplete()) {
        // 找到下一个需要询问的字段
        const fields = ['time', 'location', 'attendees'];
        bookingState.currentField = fields.find(f => !bookingState[f]);
        assistantMessage += `\n${questions[bookingState.currentField]}`;
      } else {
        // 所有信息已收集完成，执行预订
        const bookingResult = `会议预订成功！\n时间：${bookingState.time}\n地点：${bookingState.location}\n参会人数：${bookingState.attendees}`;
        assistantMessage = bookingResult;
      }
    }

    chatHistory.value.push({
      role: 'assistant',
      content: assistantMessage,
      type: isBookingComplete() ? 'result' : 'intent'
    });
    
    // 只有在完成预订时才执行任务
    if (isBookingComplete()) {
      // 执行任务并获取结果
      const result = await runMCPTask(intentResponse.intent);
      
      // 添加任务执行结果到聊天历史
      chatHistory.value.push({
        role: 'assistant',
        content: result,
        type: 'result'
      });
    }
  } catch (error) {
    // 添加错误信息到聊天历史
    chatHistory.value.push({
      role: 'system',
      content: `发生错误：${error.message || '未知错误'}`,
      type: 'error'
    });
  } finally {
    isLoading.value = false;
    userInput.value = ''; // 清空输入框
  }
}
</script>

<template>
  <div class="mcp-chat-container">
    <h2>阿里云百炼 MCP 聊天</h2>
    
    <!-- 聊天历史 -->
    <div class="chat-history">
      <div v-for="(message, index) in chatHistory" :key="index" 
           :class="['message', message.role, message.type]">
        <div class="message-header">
          {{ message.role === 'user' ? '👤 用户' : 
             message.role === 'assistant' && message.type === 'intent' ? '🧠 解析意图' : 
             message.role === 'assistant' && message.type === 'result' ? '⚙️ 任务执行结果' : 
             '🔧 系统' }}
        </div>
        <div class="message-content">
          <pre v-if="message.type === 'intent'">{{ message.content }}</pre>
          <div v-else>{{ message.content }}</div>
        </div>
      </div>
      
      <!-- 加载指示器 -->
      <div v-if="isLoading" class="loading-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-area">
      <input 
        v-model="userInput" 
        @keyup.enter="callMCPApi" 
        placeholder="输入您的问题，例如：查一下明天上海的天气" 
        :disabled="isLoading"
      />
      <button @click="callMCPApi" :disabled="isLoading || !userInput.trim()">
        {{ isLoading ? '处理中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.mcp-chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.chat-history {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 8px;
  max-width: 80%;
  animation: fadeIn 0.3s ease-in-out;
}

.message.user {
  background-color: #e1f5fe;
  margin-left: auto;
}

.message.assistant {
  background-color: #f1f8e9;
}

.message.system {
  background-color: #ffebee;
  width: 100%;
}

.message.intent {
  background-color: #fff8e1;
}

.message.result {
  background-color: #e8f5e9;
}

.message-header {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #555;
}

.message-content {
  word-break: break-word;
}

.message-content pre {
  white-space: pre-wrap;
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 8px;
  border-radius: 4px;
  margin: 0;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #42b883;
}

button {
  padding: 12px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #3aa876;
}

button:disabled {
  background-color: #a8d5c3;
  cursor: not-allowed;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #42b883;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>