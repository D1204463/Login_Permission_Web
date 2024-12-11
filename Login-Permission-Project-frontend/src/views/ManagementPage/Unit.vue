<template>
    <div class="row">
        <div class="col-3">
            <Sidebar />
        </div>
        <div class="col-9">
            <div class="unit-container">
                <!-- 頁籤 -->
                <ul class="nav nav-tabs mb-4">
                    <li class="nav-item">
                        <a class="nav-link" 
                        :class="{ active: activeTab === 'unit' }" 
                        @click.prevent="switchTab('unit')">科別管理</a>
                    </li>
                </ul>
                <unitComponent v-if="activeTab === 'unit'" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue';
import unitComponent from '@/components/ManagementPage/Unit/Unit.vue';

export default {
    components: {
        unitComponent,
        Sidebar,
    },
    setup() {
        const activeTab = ref('unit')
        
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

<style scoped></style>