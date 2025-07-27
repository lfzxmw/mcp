// mcpService.js - 阿里云百炼API服务

// API基础URL
const API_BASE_URL = 'http://localhost:3003/api';

/**
 * 调用阿里云百炼API解析用户意图
 * 通过后端API调用阿里云百炼，保护API密钥
 */
export async function parseMCPIntent (userInput) {
  try {
    console.log('发送用户输入到后端:', userInput);

    // 调用后端API解析意图
    const response = await fetch(`${API_BASE_URL}/parse-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userInput })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '服务器错误');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || '解析意图失败');
    }

    return {
      success: true,
      intent: data.intent
    };
  } catch (error) {
    console.error('解析意图出错:', error);
    return {
      success: false,
      error: error.message || '解析意图时发生未知错误'
    };
  }
}

/**
 * 执行MCP任务
 */
export async function runMCPTask (intent) {
  try {
    console.log('发送意图到后端执行任务:', intent);

    // 调用后端API执行任务
    const response = await fetch(`${API_BASE_URL}/run-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ intent })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '服务器错误');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || '执行任务失败');
    }

    // 返回任务执行结果
    return data.result;
  } catch (error) {
    console.error('执行任务出错:', error);
    return `执行任务时发生错误: ${error.message || '未知错误'}`;
  }
}