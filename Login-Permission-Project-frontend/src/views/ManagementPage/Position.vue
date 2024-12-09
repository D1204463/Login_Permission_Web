<template>
    <div class="row">
        <div class="col-3">
        <Sidebar />
        </div>
        <div class="col-9">
            <positionComponent />
        </div>
    </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue';
import positionComponent from '@/components/ManagementPage/Position/Position.vue';
</script>

<style scoped>
</style>