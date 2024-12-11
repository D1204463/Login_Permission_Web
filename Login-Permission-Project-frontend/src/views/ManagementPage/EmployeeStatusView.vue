<template>
    <div class="row">
        <div class="col-3">
            <!-- 左側 Sidebar -->
            <Sidebar />
        </div>
        <div class="col-9">
            <div class="container">
                <!-- 員工狀態管理頁籤 -->
                <ul class="nav nav-tabs mb-2">
                    <li class="nav-item">
                        <a class="nav-link"
                        :class="{ active: activeTab === 'employeeStatus' }" 
                        @click.prevent="switchTab('employeeStatus')">員工狀態管理</a>
                    </li>
                </ul>
                <EmployeeStatusManagement v-if="activeTab === 'employeeStatus'" />
            </div>
        </div>
    </div>
</template>


<script>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue';
import EmployeeStatusManagement from '@/components/ManagementPage/EmployeeStatus/EmployeeStatusManagement.vue';

export default {
    components: {
        EmployeeStatusManagement,
        Sidebar,
    },
    setup() {
        const activeTab = ref('employeeStatus')
        
        // 新增切換頁籤的方法
        const switchTab = (tab) => {
            activeTab.value = tab
        }
        
        return {
            activeTab,
            switchTab
        }
    }
}
</script>

<style scoped>
/* 根據需要添加樣式 */
</style>