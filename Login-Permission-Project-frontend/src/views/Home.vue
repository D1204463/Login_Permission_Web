<template>
    <div class="container-fluid">
        <div class="row">
        <div class="col-3">
        <!-- 左側 Sidebar -->
        <Sidebar />
        </div>
        <div class="col-9">
            <HomePage />
        </div>
    </div>
    </div>

</template>


<script setup>
import Sidebar from '../components/Sidebar.vue';
import HomePage from '../components/homePage/HomePage.vue'
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