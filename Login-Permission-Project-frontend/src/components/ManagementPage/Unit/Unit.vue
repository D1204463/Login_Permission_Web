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
                            <tr v-for="unit in filteredUnits" :key="unit.unit_id">
                                <td class="text-center">
                                    <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                        data-bs-target="#editUnitModal" v-on:click="onUpdateUnit(unit)" v-if="canUpdateUnit">
                                        <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                    </button>
                                </td>
                                <td class="text-center">{{ unit.unit_id }}</td>
                                <td class="text-center">{{ unit.unit_name }}</td>
                                <td class="text-center">{{ unit.unit_code }}</td>
                                <td class="text-center">{{ unit.department_id }}</td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                                        data-bs-target="#deleteUnit" v-on:click="onSelectUnit(unit)" v-if="canDeleteUnit">
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

    <!-- 新增科別 Modal -->
    <div class="modal fade" id="createUnitModal" aria-labelledby="createUnitModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add Unit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- 科別名稱 Unit -->
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">Unit Id</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="newUnit.unit"
                                aria-label="Unit">
                        </div>
                    </div>
                    <!-- 科別 Unit資料填充-->
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">Unit</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="newUnit.unit"
                                aria-label="Unit">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">Unit Code</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="newUnit.unit"
                                aria-label="Unit">
                        </div>
                    </div>
                    <!-- 部門 Department，從 Departments 資料填充-->
                    <div class="mb-3 row">
                        <label for="chooseDepartmentId" class="col-sm-3 col-form-label">Department</label>
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
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                            v-on:click="createPosition">Add</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 修改科別 Modal -->
    <div class="modal fade" id="editUnitModal" aria-labelledby="editUnitModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModLabel">Edit Unit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- 科別名稱 Unit -->
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">Unit Id</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="newUnit.unit"
                                aria-label="Unit">
                        </div>
                    </div>
                    <!-- 科別 Unit資料填充-->
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">Unit</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="newUnit.unit"
                                aria-label="Unit">
                        </div>
                    </div>
                    <div class="mb-3 row">
                        <label for="addUnit" class="col-sm-3 col-form-label">Unit Code</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addUnit" v-model="newUnit.unit"
                                aria-label="Unit">
                        </div>
                    </div>
                    <!-- 部門 Department，從 Departments 資料填充-->
                    <div class="mb-3 row">
                        <label for="chooseDepartmentId" class="col-sm-3 col-form-label">Department</label>
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
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                            v-on:click="createPosition">Add</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 刪除科別 Modal -->
    <div class="modal fade" id="deleteUnit" aria-labelledby="deleteUnitModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete Unit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this Unit?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                        v-on:click="deleteUnit">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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

import { PERMISSIONS } from '@/utils/jwt';

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
                department: "",
            },
            newUnit: {
                nit_id: "",
                unit_name: "",
                unit_code: "",
                department: "",
            },
            edidUnit: {
                nit_id: "",
                unit_name: "",
                unit_code: "",
                department: "",
            },
        }
    },
    methods: {
        async getDepartment() {
            try {
                const token = localStorage.getItem('JWT_Token');
                let response = await fetch("http://localhost:8085/department/test/get", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.departments = await response.json();
                console.log(this.departments);
            } catch (error) {
                console.log('Error Get Departments:', error);
            }
        },
        async getUnitData() {
            try {
                const token = localStorage.getItem('JWT_Token');
                let response = await fetch("http://localhost:8085/unit/test/get", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                this.units = data;
                this.unitOptions = data;
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
            try {
                const token = localStorage.getItem('JWT_Token');
                const response = await fetch("http://localhost:8085/unit/test/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.newUnit),
                }).then(() => {
                    console.log(response.json);
                    this.getUnitData();
                });
            } catch (error) {
                console.log('Error Add Unit:', error);
            }
        },

        onSelectUnit(unit) {
            this.selectedUnit = unit;
        },
        async deleteUnit() {
            const token = localStorage.getItem('JWT_Token');
            let unitId = this.selectedUnit.unit_id;
            try {
                const response = await fetch("http://localhost:8085/unit/test/delete" + unitId, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    this.getUnitData();
                }
            } catch (error) {
                console.log('Error Delete Unit:', error);
            }
        },

        onUpdateUnit(unit) {
            this.edidUnit = { ...unit };
        },
        async updateUnit() {
            try {
                const token = localStorage.getItem('JWT_Token');
                const response = await fetch("http://localhost:8085/unit/test/edit", {
                    method: "PUT",
                    header: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: Json.stringify(this.edidUnit),
                }).then(() => {
                    this.getUnitData();
                });
            } catch (error) {
                console.log('Error Update Unit:', error);
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
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT_READ);
        },
        canCreateUnit() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT_CREATE);
        },
        canUpdateUnit() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT_UPDATE);
        },
        canDeleteUnit() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.UNIT_DELETE);
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