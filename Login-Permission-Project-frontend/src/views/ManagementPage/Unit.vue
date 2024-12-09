<template>
    <div class="row">
        <div class="col-3">
        <Sidebar />
        </div>
        <div class="col-9">
            <unitComponent />
        </div>
    </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue';
import unitComponent from '@/components/ManagementPage/Unit/Unit.vue';
</script>

<style scoped>
</style>