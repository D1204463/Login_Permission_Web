<template>
    <div class="layout-container">
        <Sidebar />
        <div class="main-content">
            <positionComponent />
        </div>
    </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue';
import positionComponent from '@/components/ManagementPage/Position/Position.vue';
</script>

<style scoped>
.layout-container {
    display: flex;
    min-height: 100vh;
    background: #f8f9fa;
}

.main-content {
    background: #f8f9fa;
    flex: 1;
    padding: 1rem;
    margin-left: 260px; /* 與 sidebar 寬度相同 */
    min-height: 100vh;
}

/* 響應式設計 */
@media (max-width: 991.98px) {
    .main-content {
        margin-left: 0;
        padding-top: 4rem; /* 為菜單按鈕留出空間 */
    }
}
</style>