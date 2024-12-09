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
                           :class="{ active: activeTab === 'role' }" 
                           @click.prevent="switchTab('role')">角色管理</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" 
                           :class="{ active: activeTab === 'onetwothree' }" 
                           @click.prevent="switchTab('onetwothree')">abc</a>
                    </li>
                </ul>

                <RoleManagement v-if="activeTab === 'role'" />
                <onetwothree v-if="activeTab === 'onetwothree'" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue';
import RoleManagement from '@/components/ManagementPage/Role/RoleManagement.vue'
import onetwothree from '@/components/ManagementPage/Role/abc.vue'

export default {
    components: {
        RoleManagement,
        Sidebar,
        onetwothree
    },
    setup() {
        const activeTab = ref('role')
        
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