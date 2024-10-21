<template>
    <div class="container d-flex align-items-center justify-content-center vh-100" style="background-color: #334255;">
        <form>
            <div class="mb-3 ">
                <label for="exampleInputName" class="lp-form-label">員工姓名：</label>
                <input type="name" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3 ">
                <label for="exampleInputEmail1" class="lp-form-label">Email：</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                <label for="exampleInputPassword1" class="lp-form-label">密碼：</label>
                <input type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <!-- <div class="mb-3">
                <label for="exampleInputPassword1" class="lp-form-label">密碼：</label>
                <input type="password" class="form-control" id="exampleInputPassword1">
            </div> -->
            <div class="mb-3">
                <label for="exampleInputPhone" class="lp-form-label">電話：</label>
                <input type="nember" class="form-control" id="exampleInputPhoneNumber">
            </div>
            <div class="mb-3 ">
                <label for="exampleInputPosition" class="lp-form-label">職位：</label>
                <input type="name" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3 ">
                <label for="exampleInputState" class="lp-form-label">狀態：</label>
                <input type="name" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <button type="submit" class="login-btn btn lp-btn-primary">註冊</button>
        </form>
    </div>
</template>

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
    color: #fbeccb;
}
</style>