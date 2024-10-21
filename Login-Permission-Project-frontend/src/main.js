import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import './assets/styles/main.css' // 全局css

const app = createApp(App)

app.use(router)

app.mount('#app')
