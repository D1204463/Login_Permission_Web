<script setup>
import Sidebar from '@/components/layout/Sidebar.vue';
import LoginRecordComponet from "@/components/HumanResourcesPage/LoginRecord/LoginRecordComponet.vue";

</script>

<template>



  <div class="row">
    <div class="col-3">
      <Sidebar />
    </div>
    <div class="col-8">
       <LoginRecordComponet/>
    </div>
  </div>



</template>

<style scoped>
.ctest{
  border: solid;
}
</style>