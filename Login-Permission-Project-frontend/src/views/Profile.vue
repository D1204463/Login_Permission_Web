<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-3">
                <Sidebar />
            </div>
            <div class="col-8">
                <!-- 使用 router-view 來顯示路由組件 -->
                <Profile />
            </div>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import Profile from '../components/Profile.vue';
</script>

<style scoped>
.container-fluid {
  padding: 0;
}

.row {
  margin: 0;
}

.col-3, .col-9 {
  padding: 0;
}
</style>