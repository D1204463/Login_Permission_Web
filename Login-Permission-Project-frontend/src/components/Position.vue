<template>
    <div class="unit-container">
        <!-- 頁籤 -->
        <ul class="nav nav-tabs mb-2">
            <li class="nav-item">
                <a class="nav-link active" href="#">職位管理</a>
            </li>
        </ul>

        <div class="row g-2 mb-3">
            <!-- 新增職位按鈕 -->
            <div class="col-md-auto d-flex justify-content-center">
                <button class="btn add-btn">
                    <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
                    新增職位
                </button>
            </div>
            <!-- <div class="col-md-auto"> -->
                <div class="col">
                <div class="card w-100" style="margin-top: 1em;">
                    <div class="card-body">
                        <form>
                            <div class="row">
                                <div class="col-md">
                                    <div class="form-floating">
                                        <select class="form-select" id="floatingSelectGrid">
                                            <option selected>選擇科別</option>
                                            <option value="1">台幣科</option>
                                            <option value="2">外幣科</option>
                                            <option value="3">資訊科</option>
                                            <option value="4">財務科</option>
                                        </select>
                                        <label for="floatingSelectGrid">查詢</label>
                                    </div>
                                </div>
                                <div class="col-md">
                                    <div class="form-floating">
                                        <select class="form-select" id="floatingSelectGrid">
                                            <option selected>選擇職位</option>
                                            <option value="1">部長</option>
                                            <option value="2">科長</option>
                                            <option value="3">專員</option>
                                        </select>
                                        <label for="floatingSelectGrid">查詢</label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>



        <!-- 職位資料表格 -->
        <div class="table-responsive">
            <table class="table">
                <thead class="table-secondary">
                    <tr>
                        <th>編輯</th>
                        <th>職位編號</th>
                        <th>職位名稱</th>
                        <th>科別代號</th>
                        <th>科別名稱</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <button class="btn btn-link p-0">
                                <font-awesome-icon :icon="['fas', 'pen-to-square']" size="xl" />
                            </button>
                        </td>
                        <td>001</td>
                        <td>部長</td>
                        <td>01</td>
                        <td>企金科</td>
                        <td>
                            <button class="btn btn-link p-0">
                                <font-awesome-icon :icon="['fas', 'trash-can']" size="xl" />
                            </button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <button class="btn btn-link p-0">
                                <font-awesome-icon :icon="['fas', 'pen-to-square']" size="xl" />
                            </button>
                        </td>
                        <td>002</td>
                        <td>科長</td>
                        <td>01</td>
                        <td>企金科</td>
                        <td>
                            <button class="btn btn-link p-0">
                                <font-awesome-icon :icon="['fas', 'trash-can']" size="xl" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserPlus, faPenToSquare);
</script>

<style scoped>
.unit-container {
    /* padding: 20px; */
}

.nav-tabs .nav-link {
    color: #334255;
    border: none;
    padding: 10px 20px;
}

.nav-tabs .nav-link.active {
    color: #334255;
    font-weight: bold;
    border-bottom: 2px solid #334255;
}

.add-btn {
    background-color: transparent;
    color: #334255;
    border: none;
    display: flex;
    align-items: center;
    /* padding: 8px 16px; */
    font-size: 1rem;
}

.add-btn:hover {
    color: #FFCD50;
}

.table {
    border-collapse: separate;
    border-spacing: 0;
}

.table th {
    background-color: #f0f0f0;
    padding: 12px;
    text-align: center;
    font-weight: normal;
}

.table td {
    padding: 12px;
    text-align: center;
    vertical-align: middle;
}

.btn-link {
    color: #334255;
}

.btn-link:hover {
    color: #FFCD50;
}
</style>