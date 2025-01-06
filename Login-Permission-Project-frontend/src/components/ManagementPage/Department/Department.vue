<template>
    <div class="container">
        <!-- 部門管理頁籤 -->
        <ul class="nav nav-tabs mb-2">
            <li class="nav-item">
                <a class="nav-link active" href="#">部門管理</a>
            </li>
        </ul>

        <div class="content-wrapper">
            <div class="row g-3 align-items-center">
                <div v-if="canReadDept">
                    <!-- 新增部門按鈕，點擊會出現Model -->
                    <div class="col-auto">
                        <button type="button" class="btn add-department-btn" style="margin-bottom:20px;"
                            data-bs-toggle="modal" data-bs-target="#createDepartmentModal" v-if="canCreateDept">
                            <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
                            新增部門
                        </button>
                    </div>

                    <div class="col">
                        <div class="card w-100 mb-4 border-0">
                            <div class="card-body">
                                <!-- 搜尋表單，用於搜尋部門 -->
                                <div class="col">
                                    <form>
                                        <div class="row g-3 align-items-center">
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <!-- 搜尋部門 -->
                                                    <select class="form-select" id="departmentSelect"
                                                        v-model="searchByDepartmentId">
                                                        <option selected value="">選擇部門 / 部門代碼</option>
                                                        <option v-for="department in departmentOptions"
                                                            :key="department.department_id"
                                                            :value="department.department_id">
                                                            ({{ department.department_id }}) {{
                                                                department.department_name }} / {{
                                                                department.department_code }}
                                                        </option>
                                                    </select>
                                                    <label for="positionSelect">部門查詢</label>
                                                </div>
                                            </div>
                                            <!-- 重置按鈕 -->
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


                    <!-- 部門資料表格 -->
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <!-- 表頭 -->
                            <thead>
                                <tr>
                                    <th class="text-center" style="width: 80px">編輯</th>
                                    <th class="text-center">部門代號</th>
                                    <th class="text-center">部門名稱</th>
                                    <th class="text-center">部門代碼</th>
                                    <th class="text-center" style="width: 80px">刪除</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="department in filteredDepartments" v-bind:key="department.department_id">
                                    <td class="text-center">
                                        <!-- 點擊 Button 出現 Edit Department Modal -->
                                        <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                            data-bs-target="#editDepartmentModal"
                                            v-on:click="onUpdateDepartment(department)" v-if="canUpdateDept">
                                            <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                        </button>
                                    </td>
                                    <td class="text-center">{{ department.department_id }}</td>
                                    <td class="text-center">{{ department.department_name }}</td>
                                    <td class="text-center">{{ department.department_code }}</td>
                                    <td class="text-center">
                                        <!-- 點擊 Button 出現 Delete Department Modal -->
                                        <button type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                                            data-bs-target="#deleteDepartmentModal"
                                            v-on:click="onSelectDepartment(department)" v-if="canDeleteDept">
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

        <!-- 新增部門 Modal -->
        <div class="modal fade" id="createDepartmentModal" tabindex="-1" aria-labelledby="createDepartmentModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createDepartmentModalLabel">新增部門</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- 部門名稱 Department Name -->
                        <div class="mb-3 row">
                            <label for="addDepartmentName" class="col-sm-3 col-form-label">部門名稱</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" :class="{ 'is-invalid': validationErrors.newDepartment.department_name }" id="addDepartmentName"
                                    v-model="newDepartment.department_name" aria-label="DepartmentName">
                                    <div class="invalid-feeback">{{ validationErrors.newDepartment.department_name }}</div>
                            </div>
                        </div>
                        <!-- 部門代碼 Department Code -->
                        <div class="mb-3 row">
                            <label for="addDepartmentCode" class="col-sm-3 col-form-label">部門代碼</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" :class="{ 'is-invalid': validationErrors.newDepartment.department_code }" id="addDepartmentCode"
                                    v-model="newDepartment.department_code" aria-label="DepartmentCode">
                                    <div class="invalid-feeback">{{ validationErrors.newDepartment.department_code }}</div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                                v-on:click="createDepartment">確定新增</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 編輯部門 Modal -->
    <div class="modal fade" id="editDepartmentModal" tabindex="-1" aria-labelledby="editDepartmentModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editDepartmentModalLabel">編輯部門</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- 部門名稱 Department Name -->
                    <div class="mb-3 row">
                        <label for="editDepartmentName" class="col-sm-3 col-form-label">部門名稱</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" :class="{ 'is-invalid': validationErrors.editDepartment.department_name }" id="editDepartmentName"
                                v-model="editDepartment.department_name" aria-label="DepartmentName">
                                <div class="invalid-feedback"> {{ validationErrors.editDepartment.department_name }}</div>
                        </div>
                    </div>
                    <!-- 部門代碼 Department Code -->
                    <div class="mb-3 row">
                        <label for="editDepartmentCode" class="col-sm-3 col-form-label">部門代碼</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" :class="{ 'is-invalid': validationErrors.editDepartment.department_code }" id="editDepartmentCode"
                                v-model="editDepartment.department_code" aria-label="DepartmentCode">
                                <div class="invalid-feedback">{{ validationErrors.editDepartment.department_code }}</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-warning" data-bs-dismiss="modal"
                            v-on:click="updateDepartment">確定修改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 刪除部門 Modal -->
    <div class="modal fade" id="deleteDepartmentModal" tabindex="-1" aria-labelledby="deleteDepartmentModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">刪除部門</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    確定要刪除這個部門嗎？此操作無法復原。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                        v-on:click="deleteDepartment">確定刪除</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import圖標的路徑
import { ref } from 'vue';
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
import 'vue3-toastify/dist/index.css';

export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            departments: [], //用於顯示搜尋結果，Table用的
            departmentOptions: [], //搜尋部門時需要的，用於下拉式選單
            searchByDepartmentId: "", //用於儲存所選部門ID
            selectedDepartment: {
                department_id: "",
                department_name: "",
                department_code: "",
            },
            newDepartment: {
                department_id: "",
                department_name: "",
                department_code: "",
            },
            editDepartment: {
                department_id: "",
                department_name: "",
                department_code: "",
            },
            validationErrors: {
                newDepartment: {
                    department_name: '',
                    department_code: ''
                },
                editDepartment: {
                    department_name: '',
                    department_code: ''
                }
            }
        }
    },
    methods: {
        validateDepartment(type) {
            const department = type === 'new' ? this.newDepartment : this.editDepartment;
            const errors = this.validationErrors[type === 'new' ? 'newDepartment' : 'editDepartment'];
            let isValid = true;

            // 驗證部門名稱
            if (!department.department_name.trim()) {
                errors.department_name = '部門名稱不得為空';
                toast.error('部門名稱不得為空');
                isValid = false;
            } else {
                errors.department_name = '';
            }

            // 驗證部門代碼
            if (!department.department_code) {
                errors.department_code = '部門代碼不得為空';
                toast.error('部門代碼不得為空');
                isValid = false;
            } else if (!/^[A-Z0-9]+$/.test(department.department_code)) {
                errors.department_code = '部門代碼只能包含大寫英文字母和數字';
                toast.error('部門代碼只能包含大寫英文字母和數字');
                isValid = false;
            } else {
                errors.department_code = '';
            }

            return isValid;
        },
        clearValidationErrors() {
            this.validationErrors = {
                newDepartment: {
                    department_name: '',
                    department_code: ''
                },
                editDepartment: {
                    department_name: '',
                    department_code: ''
                }
            };

        },
        async getDepartmentData() { //get 部門(Department)的資料
            try {
                // 檢查讀取權限
                if (!this.canReadDept) {
                    console.error('無權限讀取部門資料');
                    return;
                }

                const token = localStorage.getItem('JWT_Token');
                // 從 Vuex 獲取權限
                const permissions = this.$store.getters['auth/userPermissions'];

                let response = await fetch("http://localhost:8085/department/test/get", {
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

                const data = await response.json();
                this.departments = data;
                this.departmentOptions = data; //設置下拉式選單選項
                console.log(this.departments);
            } catch (error) {
                console.log('Error Get Department:', error);
            }
        },
        resetSearch() { //重置搜尋
            this.searchByDepartmentId = "";
            this.getDepartmentData(); //重新Get所有資料
        },
        async createDepartment() { //新增Department的方法
            if (!this.validateDepartment('new')) {
                return;
            }
            try {
                // 檢查創建權限
                if (!this.canCreateDept) {
                    console.error('無權限新增部門資料');
                    return;
                }

                const token = localStorage.getItem('JWT_Token');
                const permissions = this.$store.getters['auth/userPermissions'];

                const response = await fetch("http://localhost:8085/department/test/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.newDepartment),
                });

                if (response.status === 403) {
                    console.error('權限不足');
                    return;
                }

                console.log("Add response:", response.json);
                if (response.ok) {
                    toast.success('新增部門成功');
                    this.getDepartmentData(); //重新載入資料
                    this.newDepartment = { department_id: "", department_name: "", department_code: "" };
                } else {
                    toast.error('新增部門失敗');
                    console.log("Error adding Department:", response.statusText);
                }
            } catch (error) {
                toast.error('新增部門發生錯誤');
                console.log('Error Add Department:', error);
            }
        },

        onSelectDepartment(department) {  //選到要刪除的department
            this.selectedDepartment = department;
        },
        async deleteDepartment() { //刪除Department的方法
            try {
                // 檢查刪除權限
                if (!this.canDeleteDept) {
                    console.error('無權限刪除部門資料');
                    return;
                }

                const token = localStorage.getItem('JWT_Token');
                const permissions = this.$store.getters['auth/userPermissions'];

                let departmentId = this.selectedDepartment.department_id;

                const response = await fetch("http://localhost:8085/department/test/delete/" + departmentId, {
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
                    this.getDepartmentData();
                }
            } catch (error) {
                console.log('Error Delete Department:', error);
            }
        },

        onUpdateDepartment(department) { //選到要修改的department，資料要帶入updateDepartment方法
            this.clearValidationErrors();
            this.editDepartment = { ...department };
        },
        async updateDepartment() { //修改Department的方法

            if (!this.validateDepartment('edit')) {
                return;
            }
            try {
                // 檢查更新權限
                if (!this.canUpdateDept) {
                    console.error('無權限修改部門資料');
                    return;
                }

                const token = localStorage.getItem('JWT_Token');
                const permissions = this.$store.getters['auth/userPermissions'];

                const response = await fetch("http://localhost:8085/department/test/edit", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.editDepartment),
                });
                if (response.status === 403) {
                    console.error('權限不足');
                    return;
                }

                if (response.ok) {
                    toast.success('修改部門成功');
                    this.getDepartmentData();
                } else {
                    toast.error('修改部門失敗');
                    console.log("Error updating Department:", response.statusText);
                }   
            } catch (error) {
                toast.error('修改部門發生錯誤');
                console.log('Error Update Department:', error);
            }
        },
    },
    created() {
        this.getDepartmentData();
    },
    computed: {  //Vue 的響應式系統和計算屬性的緩存機制
        filteredDepartments() {
            // 如果沒有選擇部門，返回所有部門
            if (!this.searchByDepartmentId) {
                return this.departments;
            }
            // 如果有選擇部門，進行過濾
            return this.departments.filter(department => {
                return (
                    department.department_id === this.searchByDepartmentId
                );
            });
        },
        canReadDept() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.DEPT.READ) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.DEPT.CB.READ);
        },
        canCreateDept() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.DEPT.CREATE) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.DEPT.CB.CREATE);
        },
        canUpdateDept() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.DEPT.UPDATE) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.DEPT.CB.UPDATE);
        },
        canDeleteDept() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.DEPT.DELETE) ||
                this.$store.getters['auth/hasPermission'](PERMISSIONS.DEPT.CB.DELETE);
        },
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
    margin-top: 20px;
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

.add-department-btn {
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

.add-department-btn:hover {
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
    .container {
        padding: 1rem;
    }

    .content-wrapper {
        padding: 1rem;
    }

    .row {
        row-gap: 1rem;
    }

    .add-position-btn {
        width: 100%;
        margin-bottom: 1rem;
    }
}
</style>