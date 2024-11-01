<template>
    <div class="unit-container">
        <!-- 頁籤 -->
        <ul class="nav nav-tabs mb-2">
            <li class="nav-item">
                <a class="nav-link active" href="#">職位管理</a>
            </li>
        </ul>

        <div class="content-wrapper">
            <div class="row g-3 align-items-center">
                <!-- 新增職位按鈕 -->
                <div class="col-auto">
                    <button class="btn add-unit-btn" style="margin-bottom:20px;">
                        <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
                        新增職位
                    </button>
                </div>
                
                <div class="col">
                    <div class="card w-100 mb-4 border-0">
                        <div class="card-body">
                            <!-- 搜尋表單 -->
                            <div class="col">
                                <form>
                                    <div class="row g-3 align-items-center">
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <select class="form-select" id="unitSelect">
                                                    <option selected>選擇科別</option>
                                                    <option value="1">台幣科</option>
                                                    <option value="2">外幣科</option>
                                                    <option value="3">資訊科</option>
                                                    <option value="4">財務科</option>
                                                </select>
                                                <label for="unitSelect">科別查詢</label>
                                            </div>
                                        </div>
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <select class="form-select" id="positionSelect">
                                                    <option selected>選擇職位</option>
                                                    <option value="1">部長</option>
                                                    <option value="2">科長</option>
                                                    <option value="3">專員</option>
                                                </select>
                                                <label for="positionSelect">職位查詢</label>
                                            </div>
                                        </div>
                                        <div class="col-auto d-flex align-items-center">
                                            <button type="submit" class="btn btn-primary search-btn">
                                                <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="lg" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 職位資料表格 -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-secondary">
                        <tr>
                            <th class="text-center" style="width: 80px">編輯</th>
                            <th class="text-center">職位編號</th>
                            <th class="text-center">職位名稱</th>
                            <th class="text-center">科別代號</th>
                            <th class="text-center">科別名稱</th>
                            <th class="text-center" style="width: 80px">刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center">
                                <button class="btn btn-link">
                                    <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                </button>
                            </td>
                            <td>001</td>
                            <td>部長</td>
                            <td>01</td>
                            <td>企金科</td>
                            <td class="text-center">
                                <button class="btn btn-link text-danger" @click="handleDelete(unit)">
                                    <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td class="text-center">
                                <button class="btn btn-link">
                                    <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                </button>
                            </td>
                            <td>002</td>
                            <td>科長</td>
                            <td>01</td>
                            <td>企金科</td>
                            <td class="text-center">
                                <button class="btn btn-link text-danger" @click="handleDelete(unit)">
                                    <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPlus,
    faPenToSquare,
    faTrashCan,
    faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 添加圖標
library.add(faPlus, faPenToSquare, faTrashCan, faMagnifyingGlass)
</script>


<style scoped>
.content-wrapper {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 0 1.5rem; /* 只保留左右間距 */
    margin-right: 5%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-tabs {
    margin-right: 5%;
    margin-top: 15px;
}

.nav-tabs .nav-link {
    color: #334255;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    position: relative;
}

.nav-tabs .nav-link.active {
    color: #334255;
    font-weight: 600;
    border-bottom: 2px solid #334255;
    background: none;
}

.nav-tabs .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #334255;
}

.add-unit-btn {
    color: #334255;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border: 2px solid #334255;
    border-radius: 6px;
    transition: all 0.3s ease;
    height: 58px;
    /* 與表單元素等高 */
    white-space: nowrap;
}

.add-unit-btn:hover {
    background-color: #334255;
    color: #ffffff;
}

.search-btn {
    background-color: #334255;
    border-color: #334255;
    padding: 0.75rem;
    height: 58px;
    width: 58px;
}

.search-btn:hover {
    background-color: #FFCD50;
    border-color: #FFCD50;
    color: #334255;
}

.form-floating>.form-select {
    padding-top: 1.625rem;
    padding-bottom: 0.625rem;
}

.table {
    margin-bottom: 0;
}

.table th {
    background-color: #f8f9fa;
    font-weight: 600;
    padding: 1rem;
    border-bottom: 2px solid #dee2e6;
}

.table td {
    padding: 1rem;
    vertical-align: middle;
}

.btn-link {
    color: #334255;
    padding: 0.375rem;
    transition: all 0.2s ease;
}

.btn-link:hover {
    color: #FFCD50;
    transform: scale(1.1);
}

.btn-link.text-danger:hover {
    color: #dc3545;
}

/* 響應式調整 */
@media (max-width: 768px) {
    .unit-container {
        padding: 1rem;
    }

    .content-wrapper {
        padding: 1rem;
    }

    .row {
        row-gap: 1rem;
    }

    .add-unit-btn {
        width: 100%;
        margin-bottom: 1rem;
    }
}
</style>