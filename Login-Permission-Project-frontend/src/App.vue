<script   >

// import {ref, provide} from "vue";

// export  default {
//   data(){
//     return {
//       userData:{}
//     }
//   },
//   provide() {
//     return{
//        userData :() => this.userData,
//        parseToken :this.parseToken
//     }
//   }
// ,
//   methods:{
//      parseToken() {
//   if(!localStorage.getItem("JWT_Token")) {
//     return "No Jwt Token founded.";
//   }
//   const payloadBase64Code = localStorage.getItem("JWT_Token").split(".")[1];
//   this.userData  =  JSON.parse(atob(payloadBase64Code.replace(/-/g, "+").replace(/_/g, "/")));
//   console.log("Token 解析成功:", this.userData );
// }
//   }
// }






</script>

<template>
  <router-view></router-view>
</template>

<style scoped>

</style>
