<template>
    <div class="row">
        <div class="col-3">
            <Sidebar />
        </div>
        <div class="col-9">
            <div class="container">
                <!-- 職位管理頁籤 -->
                <ul class="nav nav-tabs mb-2">
                    <li class="nav-item">
                        <a class="nav-link" 
                        :class="{ active: activeTab === 'position' }" 
                        @click.prevent="switchTab('position')">職位管理</a>
                    </li>
                </ul>
                <positionComponent v-if="activeTab === 'position'"/>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue';
import positionComponent from '@/components/ManagementPage/Position/Position.vue';

export default {
    components: {
        positionComponent,
        Sidebar,
    },
    setup() {
        const activeTab = ref('position')
        
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