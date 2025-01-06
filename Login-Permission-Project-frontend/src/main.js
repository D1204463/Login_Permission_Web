import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import './assets/styles/main.css' // 全局css
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);
const app = createApp(App)
app.use(store);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,  // 3秒後自動關閉
    position: "top-center"  // 顯示在右上角
})
app.mount('#app')

