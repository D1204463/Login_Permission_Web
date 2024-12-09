<template>
    <div class="container">
        <!-- 權限管理頁籤 -->
        <ul class="nav nav-tabs mb-2">
            <li class="nav-item">
                <a class="nav-link active" href="#">權限管理</a>
            </li>
        </ul>

        <div class="content-wrapper">
            <div class="row g-3 align-items-center">
                <div v-if="canReadPerm">
                    <!-- 新增權限按鈕，點擊會出現Model -->
                    <div class="col-auto">
                        <button type="button" class="btn add-permission-btn" style="margin-bottom:20px;"
                            data-bs-toggle="modal" data-bs-target="#createPermissionModal" v-if="canCreatePerm">
                            <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
                            新增權限
                        </button>
                    </div>

                    <div class="col">
                        <div class="card w-100 mb-4 border-0">
                            <div class="card-body">
                                <!-- 搜尋表單，用於搜尋權限 -->
                                <div class="col">
                                    <form>
                                        <div class="row g-3 align-items-center">
                                            <div class="col-md">
                                                <div class="form-floating">
                                                    <!-- 搜尋權限 -->
                                                    <select class="form-select" id="permissionSelect"
                                                        v-model="searchByPermissionId">
                                                        <option selected value="">選擇權限 / 權限代碼</option>
                                                        <option v-for="permission in permissionOptions"
                                                            :key="permission.permission_id"
                                                            :value="permission.permission_id">
                                                            ({{ permission.permission_id }}) {{
                                                            permission.permission_name }} / {{
                                                            permission.permission_code }}
                                                        </option>
                                                    </select>
                                                    <label for="permissionSelect">權限查詢</label>
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
                </div>

                <!-- 部門資料表格 -->
                <div class="table-responsive">
                    <table class="table table-hover">
                        <!-- 表頭 -->
                        <thead>
                            <tr>
                                <th class="text-center" style="width: 80px">編輯</th>
                                <th class="text-center">權限代號</th>
                                <th class="text-center">權限功能名稱</th>
                                <th class="text-center">權限</th>
                                <th class="text-center">權限代碼</th>
                                <th class="text-center" style="width: 80px">刪除</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="permission in filteredPermissions" v-bind:key="permission.permission_id">
                                <td class="text-center">
                                    <!-- 點擊 Button 出現 Edit Permission Modal -->
                                    <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                        data-bs-target="#editPermissionModal"
                                        v-on:click="onUpdatePermission(permission)" v-if="canUpdatePerm">
                                        <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                    </button>
                                </td>
                                <td class="text-center">{{ permission.permission_id }}</td>
                                <td class="text-center">{{ permission.permission_name }}</td>
                                <td class="text-center">{{ permission.description }}</td>
                                <td class="text-center">{{ permission.permission_code }}</td>
                                <td class="text-center">
                                    <!-- 點擊 Button 出現 Delete Permission Modal -->
                                    <button type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                                        data-bs-target="#deletePermissionModal"
                                        v-on:click="onSelectPermission(permission)" v-if="canDeletePerm">
                                        <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 新增權限 Modal -->
        <div class="modal fade" id="createPermissionModal" tabindex="-1" aria-labelledby="createPermissionModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createPermissionModalLabel">Add Permission</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- 權限名稱 Permission Name -->
                        <div class="mb-3 row">
                            <label for="addPermissionName" class="col-sm-3 col-form-label">Permission Name</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" id="addPermissionName"
                                    v-model="newPermission.permission_name" aria-label="PermissionName">
                            </div>
                        </div>
                        <!-- 權限 description -->
                        <div class="mb-3 row">
                            <label for="addDescription" class="col-sm-3 col-form-label">Description</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" id="addDescription"
                                    v-model="newPermission.description" aria-label="Description">
                            </div>
                        </div>
                        <!-- 權限代碼 Permission Code -->
                        <div class="mb-3 row">
                            <label for="addPermissionCode" class="col-sm-3 col-form-label">Permission Code</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control" id="addPermissionCode"
                                    v-model="newPermission.permission_code" aria-label="PermissionCode">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                                v-on:click="createPermission">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 修改權限 Modal -->
    <div class="modal fade" id="editPermissionModal" tabindex="-1" aria-labelledby="editPermissionModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editPermissionModalLabel">Edit Permission</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- 權限名稱 Permission Name -->
                    <div class="mb-3 row">
                        <label for="editPermissionName" class="col-sm-3 col-form-label">Permission Name</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="editPermissionName"
                                v-model="editPermission.permission_name" aria-label="PermissionName">
                        </div>
                    </div>
                    <!-- 權限 description -->
                    <div class="mb-3 row">
                        <label for="editDescription" class="col-sm-3 col-form-label">Description</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="editDescription"
                                v-model="editPermission.description" aria-label="Description">
                        </div>
                    </div>
                    <!-- 權限代碼 Permission Code -->
                    <div class="mb-3 row">
                        <label for="editPermissionCode" class="col-sm-3 col-form-label">Permission Code</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="editPermissionCode"
                                v-model="editPermission.permission_code" aria-label="PermissionCode">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-warning" data-bs-dismiss="modal"
                            v-on:click="updatePermission">Update</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 刪除職位 Modal -->
    <div class="modal fade" id="deletePermissionModal" tabindex="-1" aria-labelledby="deletePermissionModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deletePermissionModalLabel">Delete Permission</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this Permission?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                        v-on:click="deletePermission">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import圖標的路徑
import { popScopeId, ref } from 'vue'
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

import { PERMISSIONS } from '../utils/jwt';

export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            permissions: [], //用於顯示搜尋結果，Table用的
            permissionOptions: [], //搜尋權限時需要的，用於下拉式選單
            searchByPermissionId: "", //用於儲存所選權限的ID
            selectedPermission: {
                permission_id: "",
                permission_name: "",
                description: "",
                permission_code: "",
            },
            newPermission: {
                permission_id: "",
                permission_name: "",
                description: "",
                permission_code: "",
            },
            editPermission: {
                permission_id: "",
                permission_name: "",
                description: "",
                permission_code: "",
            },
        }
    },
    methods: {
        async getPermissionData() { //get 權限(Permission)的資料
            try {
                let response = await fetch("http://localhost:8085/Permission/test/get");
                const data = await response.json();
                this.permissions = data;
                this.permissionOptions = data; //設置下拉式選單選項
                console.log(this.permissions);
            } catch (error) {
                console.log('Error Get Permission:', error);
            }
        },
        resetSearch() { //重置搜尋
            this.searchByPermissionId = "";
            this.getPermissionData(); //重新Get所有資料
        },
        async createPermission() { //新增Permission的方法
            try {
                const response = await fetch("http://localhost:8085/Permission/test/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.newPermission),
                });
                console.log("Add response:", response.json);
                if (response.ok) {
                    this.getPermissionData(); //重新載入資料
                    this.newPermission = { permission_id: "", permission_name: "", description: "", permission_code: "" };
                } else {
                    console.log("Error adding Permission:", response.statusText);
                }
            } catch (error) {
                console.log('Error Add Permission:', error);
            }
        },

        onSelectPermission(permission) {  //選到要刪除的permission
            this.selectedPermission = permission;
        },
        async deletePermission() { //刪除Permission的方法
            let permissionId = this.selectedPermission.permission_id;
            try {
                const response = await fetch("http://localhost:8085/Permission/test/delete/" + permissionId, {
                    method: "DELETE",
                });
                if (response.ok) {
                    this.getPermissionData();
                }
            } catch (error) {
                console.log('Error Delete Permission:', error);
            }
        },

        onUpdatePermission(permission) { //選到要修改的permission，資料要帶入updatePermission方法
            this.editPermission = { ...permission };
        },
        async updatePermission() { //修改Permission的方法
            try {
                const response = await fetch("http://localhost:8085/Permission/test/edit", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.editPermission),
                });
                if (response.ok) {
                    this.getPermissionData();
                }
            } catch (error) {
                console.log('Error Update Permission:', error);
            }
        },
    },
    created() {
        this.getPermissionData();
    },
    computed: {  //Vue 的響應式系統和計算屬性的緩存機制
        filteredPermissions() {
            // 如果沒有選擇權限，返回所有權限
            if (!this.searchByPermissionId) {
                return this.permissions;
            }
            // 如果有選擇權限，進行過濾
            return this.permissions.filter(permission => {
                return (
                    permission.permission_id === this.searchByPermissionId
                );
            });
        },
        canReadPerm() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.PERM_READ);
        },
        canCreatePerm() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.PERM_CREATE);
        },
        canUpdatePerm() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.PERM_UPDATE);
        },
        canDeletePerm() {
            return this.$store.getters['auth/hasPermission'](PERMISSIONS.PERM_DELETE);
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

.add-permission-btn {
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

.add-permission-btn:hover {
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

    .add-permission-btn {
        width: 100%;
        margin-bottom: 1rem;
    }
}
</style>