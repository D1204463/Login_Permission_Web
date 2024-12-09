<template>
    <div class="row">
        <div class="col-3">
            <Sidebar />
        </div>
        <div class="col-9">
            <div class="container">
                <!-- 管理頁籤 -->
                <ul class="nav nav-tabs mb-2">
                    <li class="nav-item">
                        <a class="nav-link" 
                           :class="{ active: activeTab === 'employee' }"
                           @click.prevent="switchTab('employee')">員工管理</a>
                    </li>
                </ul>

                <EmployeeManagement v-if="activeTab === 'employee'" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue';
import EmployeeManagement from '@/components/HumanResourcesPage/Employee/EmployeeManagement.vue'

export default {
    components: {
        EmployeeManagement,
        Sidebar
    },
    setup() {
        const activeTab = ref('employee')
        
        // 新增切換頁籤的方法
        const switchTab = (tab) => {
            console.log('Switching to tab:', tab)
            activeTab.value = tab
            console.log('Current activeTab:', activeTab.value)
        }
        
        return {
            activeTab,
            switchTab
        }
    }
}
</script>

<style scoped>
.container {
    padding: 20px;
}

.nav-tabs .nav-link {
    color: #334255;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    cursor: pointer;
}

.nav-tabs .nav-link.active {
    color: #334255;
    font-weight: 600;
    border-bottom: 2px solid #334255;
    background: none;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
}
</style>