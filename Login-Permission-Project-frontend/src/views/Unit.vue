<template>
    <div class="row">
        <div class="col-3">
        <Sidebar />
        </div>
        <div class="col-8">
            <unitComponent />
        </div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import unitComponent from '../components/unit/Unit.vue';
</script>

<style scoped>
</style>