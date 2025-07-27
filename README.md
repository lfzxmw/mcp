# 阿里云百炼 MCP 交互演示

这是一个基于Vue 3和Express的应用，用于演示与阿里云百炼API的交互。应用包含前端界面和后端API服务，实现了自然语言处理和意图解析功能。

## 功能特点

- 用户友好的聊天界面
- 通过阿里云百炼API进行意图解析
- 支持天气查询等任务执行
- 前后端分离架构，保护API密钥

## 技术栈

- 前端：Vue 3 + Vite
- 后端：Express.js
- API调用：Python脚本（通过Node.js子进程调用）
- 大模型：阿里云百炼 Qwen-turbo

## 安装与运行

### 前提条件

- Node.js (v14+)
- npm 或 yarn
- Python 3.6+
- 阿里云百炼API密钥

### 安装依赖

```bash
# 安装Node.js依赖
npm install

# 安装Python依赖
pip install dashscope
`````

## 使用方法

1. 打开浏览器访问 http://localhost:5173
2. 在输入框中输入自然语言查询，例如：
   - "查一下明天上海的天气"
   - "今天北京天气怎么样"
3. 系统会解析您的意图并显示解析结果，然后执行相应任务并返回结果。

## 项目结构

```
├── public/              # 静态资源
├── src/                 # 前端源代码
│   ├── assets/          # 资源文件
│   ├── components/      # Vue组件
│   │   └── MCPChat.vue  # 聊天组件
│   ├── services/        # 服务层
│   │   └── mcpService.js # API服务
│   ├── App.vue          # 主应用组件
│   └── main.js          # 入口文件
├── server.js            # 后端服务
├── mcp_script.py        # Python脚本（自动生成）
└── package.json         # 项目配置
```

## 扩展建议

- 添加用户认证和会话管理
- 扩展支持更多类型的意图和任务
- 添加历史记录保存功能
- 实现语音输入和输出

## 许可证

MIT
