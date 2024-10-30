<template>
    <div class="unit-container">
        <!-- 頁籤 -->
        <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
                <a class="nav-link active" href="#">科別管理</a>
            </li>
        </ul>

        <div class="content-wrapper">
            <div class="row g-3 align-items-center">
                <!-- 新增科別按鈕 -->
                <div class="col-auto">
                    <button class="btn add-unit-btn" style="margin-bottom:20px;">
                        <font-awesome-icon :icon="['fas', 'plus']" size="xl" class="me-2" />
                        新增科別
                    </button>
                </div>
                <!-- 搜尋區塊 -->
                <div class="col">
                    <div class="card w-100 mb-4 border-0">
                        <div class="card-body">
                            <!-- 搜尋表單 -->
                            <div class="col">
                                <form @submit.prevent="handleSearch">
                                    <div class="row g-3 align-items-center">
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <select class="form-select" id="unitSelect" v-model="searchForm.unit">
                                                    <option value="">選擇科別</option>
                                                    <option v-for="unit in unitOptions" :key="unit.value"
                                                        :value="unit.value">
                                                        {{ unit.label }}
                                                    </option>
                                                </select>
                                                <label for="unitSelect">科別</label>
                                            </div>
                                        </div>
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <select class="form-select" id="codeSelect" v-model="searchForm.code">
                                                    <option value="">選擇科別代碼</option>
                                                    <option v-for="code in codeOptions" :key="code.value"
                                                        :value="code.value">
                                                        {{ code.label }}
                                                    </option>
                                                </select>
                                                <label for="codeSelect">科別代碼</label>
                                            </div>
                                        </div>
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <select class="form-select" id="deptSelect"
                                                    v-model="searchForm.department">
                                                    <option value="">選擇部門</option>
                                                    <option v-for="dept in deptOptions" :key="dept.value"
                                                        :value="dept.value">
                                                        {{ dept.label }}
                                                    </option>
                                                </select>
                                                <label for="deptSelect">部門</label>
                                            </div>
                                        </div>
                                        <div class="col-auto d-flex align-items-center">
                                            <button type="submit" class="btn btn-primary search-btn">
                                                <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="lg"/>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 資料表格 -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th class="text-center" style="width: 80px">編輯</th>
                            <th class="text-center">科別代號</th>
                            <th class="text-center">科別</th>
                            <th class="text-center">科別代碼</th>
                            <th class="text-center">部門</th>
                            <th class="text-center" style="width: 80px">刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="unit in units" :key="unit.id">
                            <td class="text-center">
                                <button class="btn btn-link" @click="handleEdit(unit)">
                                    <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg"/>
                                </button>
                            </td>
                            <td class="text-center">{{ unit.id }}</td>
                            <td class="text-center">{{ unit.name }}</td>
                            <td class="text-center">{{ unit.code }}</td>
                            <td class="text-center">{{ unit.department }}</td>
                            <td class="text-center">
                                <button class="btn btn-link text-danger" @click="handleDelete(unit)">
                                    <font-awesome-icon :icon="['fas', 'trash-can']" size="lg"/>
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

// 搜尋表單數據
const searchForm = ref({
    unit: '',
    code: '',
    department: ''
})

// 下拉選項數據
const unitOptions = ref([
    { value: '1', label: '企金科' },
    { value: '2', label: '個金科' },
    { value: '3', label: '資訊科' },
    { value: '4', label: '財務科' },
    { value: '5', label: '總務科' }
])

const codeOptions = ref([
    { value: '1', label: 'CF' },
    { value: '2', label: 'PF' },
    { value: '3', label: 'IT' },
    { value: '4', label: 'FN' },
    { value: '5', label: 'GA' }
])

const deptOptions = ref([
    { value: '1', label: '消金部' },
    { value: '2', label: '管理部' }
])

// 表格數據
const units = ref([
    {
        id: '001',
        name: '企金科',
        code: 'CF',
        department: '消金部'
    }
])

// 處理搜尋
const handleSearch = () => {
    console.log('搜尋條件：', searchForm.value)
}

// 處理編輯
const handleEdit = (unit) => {
    console.log('編輯單位：', unit)
}

// 處理刪除
const handleDelete = (unit) => {
    console.log('刪除單位：', unit)
}
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