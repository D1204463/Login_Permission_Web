<template>
    <div class="row">
        <div class="col-3">
        <Sidebar />
        </div>
        <div class="col-9">
            <div class="container">
                <!-- 部門管理頁籤 -->
                <ul class="nav nav-tabs mb-2">
                    <li class="nav-item">
                        <a class="nav-link"
                        :class="{active: activeTab === 'department'}"
                        @click.prevent="switchTab('department')">部門管理</a>
                    </li>
                </ul>
                
                <DepartmentComponent v-if="activeTab === 'department'"/>
            </div>
            
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue';
import DepartmentComponent from '@/components/ManagementPage/Department/Department.vue';

export default {
    components: {
        DepartmentComponent,
        Sidebar,
    },
    setup() {
        const activeTab = ref('department')
        
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
</style>