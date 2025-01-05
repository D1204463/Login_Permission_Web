<template>
  <div class="layout-container">
    <Sidebar />
    <div class="main-content">
      <div class="unit-container">
        <!-- 將頁籤移到這裡 -->
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'login' }" 
               @click="activeTab = 'login'" href="#">
               登錄紀錄管理
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'operation' }" 
               @click="activeTab = 'operation'" href="#">
               操作紀錄管理
            </a>
          </li>
        </ul>

        <!-- 根據activeTab切換顯示的組件 -->
        <LoginRecordComponent v-if="activeTab === 'login'" />
        <OperationRecordComponent v-if="activeTab === 'operation'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import LoginRecordComponent from "@/components/HumanResourcesPage/LoginRecord/LoginRecordComponent.vue";

import OperationRecordComponent from "@/components/HumanResourcesPage/LoginRecord/OperationRecordComponent.vue";

const activeTab = ref('login');
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
  position: relative; 
}

.main-content {
  position: relative;
  background: #f8f9fa;
  flex: 1;
  padding: 1rem;
  margin-left: 260px;
  min-height: 100vh;
  overflow-x: hidden;
}

.nav-tabs .nav-link {
  color: #334255;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.nav-tabs .nav-link.active {
  color: #334255;
  font-weight: bold;
  border-bottom: 2px solid #334255;
}

@media (max-width: 991.98px) {
  .main-content {
    margin-left: 0;
    padding-top: 4rem;
  }
}
</style>
