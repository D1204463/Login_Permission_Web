<template>
    <div class="row">
        <div class="col-3">
        <Sidebar />
        </div>
        <div class="col-9">
            <PermissionComponent />
        </div>
    </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue';
import PermissionComponent from '@/components/ManagementPage/Permission//Permission.vue';
</script>

<style scoped>
</style>