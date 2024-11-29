<template>
    <div class="row">
        <div class="col-3">
        <!-- 左側 Sidebar -->
        <Sidebar />
        </div>
        <div class="col-9">
             <HomePage/>
            <Notifications />
        </div>

    </div>
</template>


<script setup>
import Sidebar from '../../components/Sidebar.vue';
import HomePage from '../../components/homePage/HomePage.vue';
import Notifications from '../../components/homePage/MyNotifications.vue'
</script>

<style scoped>
/* 根據需要添加樣式 */
</style>