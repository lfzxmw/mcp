<script setup>
import MCPChat from './components/MCPChat.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <div class="logo-container">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        <h1>阿里云百炼 MCP 交互演示</h1>
      </div>
    </header>
    
    <main>
      <MCPChat />
    </main>
    
    <footer>
      <p>基于 Vue 3 + Vite 构建 | 阿里云百炼 API 演示</p>
    </footer>
  </div>
</template>

<style>
/* 全局样式 */
:root {
  --primary-color: #42b883;
  --secondary-color: #35495e;
  --background-color: #f5f7fa;
  --text-color: #2c3e50;
  --border-color: #e2e8f0;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 3em;
}

h1 {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin: 0;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  text-align: center;
  padding: 1.5rem;
  background-color: white;
  border-top: 1px solid var(--border-color);
  color: #666;
  font-size: 0.9rem;
}
</style>
