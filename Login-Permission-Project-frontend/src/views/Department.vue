<template>
    <div class="row">
        <div class="col-3">
        <Sidebar />
        </div>
        <div class="col-9">
            <DepartmentComponent />
        </div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import DepartmentComponent from '../components/Department.vue';
</script>

<style scoped>
</style>