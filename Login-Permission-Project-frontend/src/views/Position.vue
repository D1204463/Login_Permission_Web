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
import Sidebar from '../components/Sidebar.vue';
import positionComponent from '../components/Position.vue';
</script>

<style scoped>
</style>