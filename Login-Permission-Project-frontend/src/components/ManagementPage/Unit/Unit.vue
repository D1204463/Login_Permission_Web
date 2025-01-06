<template>
    <div class="unit-container">
        <!-- 頁籤 -->
        <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
                <a class="nav-link active" href="#">科別管理</a>
            </li>
        </ul>
        <div v-if="canReadUnit">
            <div class="content-wrapper">
                <div class="row g-3 align-items-center">
                    <!-- 新增科別按鈕 -->
                    <div class="col-auto">
                        <button class="btn add-unit-btn" style="margin-bottom:20px;" data-bs-toggle="modal"
                            data-bs-target="#createUnitModal" v-if="canCreateUnit">
                            <font-awesome-icon :icon="['fas', 'plus']" size="xl" class="me-2" />
                            新增科別
                        </button>
                    </div>
                    <!-- 搜尋科別的區塊 -->
                    <div class="col">
                        <div class="card w-100 mb-4 border-0">
                            <div class="card-body">
                                <!-- 搜尋條件輸入框 -->
                                <div class="col">
                                    <form @submit.prevent="handleSearch">
                                        <div class="row g-3 align-items-center">
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <select class="form-select" id="unitSelect"
                                                        v-model="searchByUnitId">
                                                        <option value="">選擇科別</option>
                                                        <option v-for="unit in unitOptions" :key="unit.unit_id"
                                                            :value="unit.unit_id">
                                                            {{ unit.unit_name }} / {{ unit.unit_code }}
                                                        </option>
                                                    </select>
                                                    <label for="unitSelect">科別/科別代碼</label>
                                                </div>
                                            </div>
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <select class="form-select" id="deptSelect"
                                                        v-model="searchByDepartmentId">
                                                        <option value="">選擇部門</option>
                                                        <option v-for="dept in departments" :key="dept.department_id"
                                                            :value="dept.department_id">
                                                            {{ dept.department_name }}
                                                        </option>
                                                    </select>
                                                    <label for="deptSelect">部門</label>
                                                </div>
                                            </div>
                                            <div class="col-auto d-flex align-items-center">
                                                <button type="button" class="btn btn-secondary search-btn"
                                                    v-on:click="resetSearch">
                                                    <font-awesome-icon :icon="['fas', 'rotate']" size="lg" />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 資料表格, 用於顯示各科別詳細資訊 -->
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
                            <tr v-for="unit in filteredUnits" :key="unit.unit_id">
                                <td class="text-center">
                                    <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                        data-bs-target="#editUnitModal" v-on:click="onUpdateUnit(unit)"
                                        v-if="canUpdateUnit">
                                        <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                    </button>
                                </td>
                                <td class="text-center">{{ unit.unit_id }}</td>
                                <td class="text-center">{{ unit.unit_name }}</td>
                                <td class="text-center">{{ unit.unit_code }}</td>
                                <td class="text-center">{{ unit.department.department_name }}</td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                                        data-bs-target="#deleteUnit" v-on:click="onSelectUnit(unit)"
                                        v-if="canDeleteUnit">
                                        <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-------------------------------------- 新增科別 Modal ------------------------------------------>
    <div class="modal fade" id="createUnitModal" aria-labelledby="createUnitModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">新增科別</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- 科別 Unit資料填充-->
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">名稱</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="newUnit.unit_name"
                                aria-label="Unit">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">科別代碼</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="newUnit.unit_code"
                                aria-label="Unit">
                        </div>
                    </div>
                    <!-- 部門 Department，從 Departments 資料填充-->
                    <div class="mb-3 row">
                        <label for="chooseDepartmentId" class="col-sm-3 col-form-label">部門</label>
                        <div class="col-sm-9">
                            <select class="form-select" id="chooseDepartmentID" v-model="newUnit.department_id"
                                @change="updateSelectedDepartmentName">
                                <option disabled value="">選擇部門</option>
                                <option v-for="department in departments" :key="department.department_id"
                                    :value="department.department_id">
                                    {{ department.department_id }} ({{ department.department_name }})
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer flex-column">
                        <div class="text-danger w-100 mb-3" v-if="showError">請填妥科別資訊</div>
                        <div class="w-100 d-flex justify-content-end">
                            <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal"
                                v-on:click="resetShowError">取消</button>
                            <button type="button" class="btn btn-primary" v-on:click="createUnit">確定新增</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <!------------------------------------------- 修改科別 Modal ---------------------------------------------------->
    <div class="modal fade" id="editUnitModal" aria-labelledby="editUnitModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModLabel">修改科別</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <!-- 科別 修改資料欄位-->
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">科別名稱</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="editUnit.unit_name"
                                aria-label="Unit">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">科別代號</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="editUnit.unit_code"
                                aria-label="Unit">
                        </div>
                    </div>
                    <!-- 部門 Department，從 Departments 資料填充-->
                    <div class="mb-3 row">
                        <label for="chooseDepartmentId" class="col-sm-3 col-form-label">部門</label>
                        <div class="col-sm-9">
                            <select class="form-select" id="chooseDepartmentID" v-model="editUnit.department_id"
                                @change="updateSelectedDepartmentName">
                                <option disabled value="">選擇部門</option>
                                <option v-for="department in departments" :key="department.department_id"
                                    :value="department.department_id">
                                    {{ department.department_id }} ({{ department.department_name }})
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer flex-column">
                        <div class="text-danger w-100 mb-3" v-if="showError">請填妥科別資訊</div>

                        <div class="w-100 d-flex justify-content-end">
                            <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal"
                                v-on:click="resetShowError">取消</button>
                            <button type="button" class="btn btn-warning" v-on:click="updateUnit">確定修改</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!------------------------------------------- 刪除科別 Modal ---------------------------------------------------->
    <div class="modal fade" id="deleteUnit" aria-labelledby="deleteUnitModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">刪除科別</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    您確定要刪除此科別?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                        v-on:click="deleteUnit">確定刪除</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

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

import { PERMISSIONS } from '@/constants/permissions';
import { toast } from 'vue3-toastify';

export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            units: [],
            unitOptions: [],
            codes: [],
            departments: [],
            selectedDepartmentName: "",
            searchByUnitId: "",
            searchByDepartmentId: "",
            selectedUnit: {
                unit_id: "",
                unit_name: "",
                unit_code: "",
                department_id: "",
            },
            newUnit: {
                unit_name: "",
                unit_code: "",
                department_id: "",
            },
            editUnit: {
                unit_id: "",
                unit_name: "",
                unit_code: "",
                department_id: "",
            },
            showError: false,
            showToast: false,

        }
    },
    methods: {
        async getDepartment() {
            try {
                // 檢查讀取權限
                if (!this.canReadUnit) {
                    console.error('無權限讀取部門資料');
                    return;
                }

                const token = localStorage.getItem('JWT_Token');
                const permissions = this.$store.getters['auth/userPermissions'];

                let response = await fetch("http://localhost:8085/department/test/get", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 403) {
                    console.error('權限不足');
                    return;
                }

                this.departments = await response.json();
                console.log(this.departments);
            } catch (error) {
                console.log('Error Get Departments:', error);
            }
        },
        async getUnitData() {
            try {
                // 檢查讀取權限
                if (!this.canReadUnit) {
                    console.error('無權限讀取科別資料');
                    return;
                }
                const token = localStorage.getItem('JWT_Token');
                const response = await fetch("http://localhost:8085/unit/test/get", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 403) {
                    console.error('權限不足');
                    return;
                }

                const responseBody = await response.json();
                this.units = responseBody.data;
                console.log(this.units);
            } catch (error) {
                console.log('Error Get Unit:', error);
            }
        },

        resetSearch() {
            this.searchByDepartmentId = "";
            this.searchByUnitId = "";
            this.getUnitData();
        },

        async createUnit() {
            if (!this.newUnit.unit_name || !this.newUnit.unit_code || !this.newUnit.department_id) {
                toast.error('欄位請填寫齊全')
                return;
            }
            this.showError = false;
            try {
                // 檢查創建權限
                if (!this.canCreateUnit) {
                    console.error('無權限新增科別資料');
                    return;
                }

                const token = localStorage.getItem('JWT_Token');
                const response = await fetch("http://localhost:8085/unit/test/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.newUnit),
                });

                if (response.status === 403) {
                    console.error('權限不足');
                    return;
                }

                if (response.ok) {
                    toast.success('科別新增成功')
                    const responseBody = await response.json();
                    console.log(responseBody.message);
                    await this.getUnitData();

                    const closeButton = document.querySelector('#createUnitModal .btn-close');
                    if (closeButton) {
                        closeButton.click();
                    }
                } else {
                    console.log("添加科別失敗:", response.statusText);
                }
            } catch (error) {
                console.log('送出添加請求失敗:', error);
            }

        },
        resetShowError() {
            this.showError = false;
        },

        onSelectUnit(unit) {
            this.selectedUnit = unit;
        },
        async deleteUnit() {
            try {
                const token = localStorage.getItem('JWT_Token');
                let unitId = this.selectedUnit.unit_id;
                console.log(unitId);
                const response = await fetch("http://localhost:8085/unit/test/delete/" + unitId, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 403) {
                    console.error('權限不足');
                    return;
                }
                if (response.ok) {
                    await this.getUnitData();
                    const responseBody = await response.json();
                    console.log(responseBody.message);

                    this.showToast = true;
                    setTimeout(() => {
                        this.showToast = false;
                    }, 3000);
                } else {
                    console.log("刪除科別失敗:", response.statusText);
                }
            } catch (error) {
                console.log('發送刪除請求失敗:', error);
            }
        },

        onUpdateUnit(unit) {
            this.editUnit = { ...unit };
        },
        async updateUnit() {
            if (!this.editUnit.unit_name || !this.editUnit.unit_code || !this.editUnit.department_id) {
                toast.error('欄位請填寫齊全');
                return;
            }
            
            try {
                const token = localStorage.getItem('JWT_Token');
                const response = await fetch("http://localhost:8085/unit/test/edit", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.editUnit),
                });

                if (response.status === 403) {
                    console.error('權限不足');
                    return;
                }

                if (response.ok) {
                    toast.success('更新科別成功');
                    const responseBody = await response.json();
                    console.log(responseBody.message);
                    await this.getUnitData();

                    const closeButton = document.querySelector('#editUnitModal .btn-close');
                    if (closeButton) {
                        closeButton.click();
                    }
                } else {
                    const responseBody = await response.json();
                    console.log(responseBody.message);
                }

            } catch (error) {
                toast.error('操作失敗');
                console.log('操作失敗:', error);
            }
        },
        updateSelectedDepartmentName() {
            const selectedDepartment = this.departments.find(department => department.department_id === this.newUnit.department_id);
            this.selectedDepartmentName = selectedDepartment ? selectedDepartment.department_name : "";
        },
    },
    computed: {
        // 將 filteredUnitInfo 改為計算屬性
        filteredUnits() {
            if (!this.searchByUnitId && !this.searchByDepartmentId) {
                return this.units;
            }

            return this.units.filter(unit => {
                const matchUnit = !this.searchByUnitId || unit.unit_id === this.searchByUnitId;
                const matchDepartment = !this.searchByDepartmentId || unit.department_id === this.searchByDepartmentId;
                return matchUnit && matchDepartment;
            });
        },
        canReadUnit() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.READ) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.CF.READ) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.PF.READ);
        },
        canCreateUnit() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.CREATE) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.CF.CREATE) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.PF.CREATE);
        },
        canUpdateUnit() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.UPDATE) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.CF.UPDATE) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.PF.UPDATE);
        },
        canDeleteUnit() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.DELETE) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.CF.DELETE) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT.PF.DELETE);
        },
    },

    created() {
        this.getUnitData();
        this.getDepartment();
    },
}
</script>

<style scoped>
.content-wrapper {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 0 1.5rem;
    /* 只保留左右間距 */
    margin-right: 5%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.toast-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    color: #10b981;
    /* 綠色文字 */
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-size: 16px;
    animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translate(-50%, -20px);
    }

    15% {
        opacity: 1;
        transform: translate(-50%, 0);
    }

    85% {
        opacity: 1;
        transform: translate(-50%, 0);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -20px);
    }
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