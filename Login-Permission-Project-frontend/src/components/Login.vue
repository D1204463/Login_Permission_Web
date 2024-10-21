<template>
    <div class="container d-flex align-items-center justify-content-center vh-100" style="background-color: #334255;">
        <form>
            <div class="user-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-person-circle" style="margin-bottom: 30px;margin-left: 60px;" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>

            </div>
            <div class="mb-3 ">
                <label for="exampleInputEmail1" class="lp-form-label">員工編號：</label>
                <input type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="lp-form-label">密碼：</label>
                <input type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <button type="submit" class="login-btn btn lp-btn-primary">登入</button>
        </form>
    </div>
</template>

<script setup>

</script>

<style scoped>
.login-btn{
    width:100px;
    margin-left: 50px;
    margin-top: 30px;
}
.lp-form-label{
    color: #ffff ;
    margin-bottom: 10px;
}
.user-icon{
    color: #fdf4e0;
}
</style>