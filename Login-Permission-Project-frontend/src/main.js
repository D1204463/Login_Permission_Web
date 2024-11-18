import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index'

import './assets/styles/main.css' // 全局css
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);
const app = createApp(App)
store.dispatch('loadPermissions'); // 初始化 Vuex 權限
app.use(store);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router)

app.mount('#app')

