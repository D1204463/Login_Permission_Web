<template>
    <div class="row">
        <div class="col-3">
        <!-- 左側 Sidebar -->
        <Sidebar />
        </div>
        <div class="col-9">
            <EmployeeManagement1 />
        </div>
    </div>
</template>


<script setup>
import Sidebar from '../components/Sidebar.vue';
import EmployeeManagement1 from '../components/employee/EmployeeManagement1.vue';
</script>

<style scoped>
/* 根據需要添加樣式 */
</style>