<template>
    <div class="row">
        <div class="col-3">
        <!-- 左側 Sidebar -->
        <Sidebar />
        </div>
        <div class="col-9">
            <HomePage/>
            <DepartmentAnnouncements />
        </div>

    </div>
</template>


<script setup>
import Sidebar from '../../components/Sidebar.vue';
import HomePage from '../../components/homePage/HomePage.vue';
import DepartmentAnnouncements from '../../components/homePage/DepartmentAnnouncements.vue'
</script>

<style scoped>
/* 根據需要添加樣式 */
</style>