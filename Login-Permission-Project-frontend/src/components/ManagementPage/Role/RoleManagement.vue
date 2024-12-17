<template>
        <!-- 角色管理內容 -->
        <div class="row g-3 align-items-center">
            <!-- 新增角色按鈕 -->
            <div class="col-auto">
                <button type="button" class="btn add-role-btn" style="margin-bottom:20px;" data-bs-toggle="modal"
                    data-bs-target="#createRoleModal">
                    <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
                    新增角色
                </button>
            </div>

            <!-- 角色搜尋欄位 -->
            <div class="col">
                <div class="card w-100 mb-4 border-0">
                    <div class="card-body">
                        <form>
                            <div class="row g-3 align-items-center">
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="roleId" v-model="searchByRoleId"
                                            placeholder="查詢角色編號">
                                        <label for="roleId">角色編號查詢</label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="roleName"
                                            v-model="searchByRoleName" placeholder="查詢角色名稱">
                                        <label for="roleName">角色名稱查詢</label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <select class="form-select" id="roleDepartmentSelect"
                                            v-model="searchByRoleDepartment">
                                            <option selected value="">選擇部門</option>
                                            <option v-for="dept in roleDepartments" :key="dept">{{ dept }}</option>
                                        </select>
                                        <label for="roleDepartmentSelect">部門查詢</label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- 角色資料表格 -->
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th class="text-center" style="width: 80px">編輯</th>
                        <th class="text-center">角色編號</th>
                        <th class="text-center">角色名稱</th>
                        <th class="text-center">所屬部門</th>
                        <th class="text-center">權限列表</th>
                        <th class="text-center" style="width: 80px">刪除</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="role in filteredRoles" :key="role.id">
                        <td class="text-center">
                            <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                data-bs-target="#editRoleModal" @click="onEditRole(role)">
                                <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                            </button>
                        </td>
                        <td class="text-center">{{ role.id }}</td>
                        <td class="text-center">{{ role.name }}</td>
                        <td class="text-center">{{ role.department }}</td>
                        <td class="text-center">
                            <span v-for="(permission, index) in role.permissions" :key="index"
                                class="badge bg-secondary me-1">
                                {{ permission }}
                            </span>
                        </td>
                        <td class="text-center">
                            <button type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                                data-bs-target="#deleteRoleModal" @click="onDeleteRole(role.id)">
                                <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 新增角色 Modal -->
        <div class="modal fade" id="createRoleModal" tabindex="-1" aria-labelledby="createRoleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createRoleModalLabel">新增角色</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="newRoleName" class="form-label">角色名稱</label>
                                <input type="text" class="form-control" id="newRoleName" v-model="newRole.name"
                                    required>
                            </div>
                            <div class="mb-3">
                                <label for="newRoleDepartment" class="form-label">所屬部門</label>
                                <select class="form-select" id="newRoleDepartment" v-model="newRole.department"
                                    required>
                                    <option value="">請選擇部門</option>
                                    <option v-for="dept in roleDepartments" :key="dept">{{ dept }}</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">權限設定</label>
                                <div class="permission-checkboxes">
                                    <div class="form-check" v-for="perm in availablePermissions" :key="perm">
                                        <input class="form-check-input" type="checkbox" :id="'perm-' + perm"
                                            :value="perm" v-model="newRole.permissions">
                                        <label class="form-check-label" :for="'perm-' + perm">
                                            {{ perm }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="addRole" data-bs-dismiss="modal">確認新增</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 編輯角色 Modal -->
        <div class="modal fade" id="editRoleModal" tabindex="-1" aria-labelledby="editRoleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editRoleModalLabel">編輯角色</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form v-if="selectedRole">
                            <div class="mb-3">
                                <label for="editRoleName" class="form-label">角色名稱</label>
                                <input type="text" class="form-control" id="editRoleName" v-model="selectedRole.name"
                                    required>
                            </div>
                            <div class="mb-3">
                                <label for="editRoleDepartment" class="form-label">所屬部門</label>
                                <select class="form-select" id="editRoleDepartment" v-model="selectedRole.department"
                                    required>
                                    <option value="">請選擇部門</option>
                                    <option v-for="dept in roleDepartments" :key="dept">{{ dept }}</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">權限設定</label>
                                <div class="permission-checkboxes">
                                    <div class="form-check" v-for="perm in availablePermissions" :key="perm">
                                        <input class="form-check-input" type="checkbox" :id="'edit-perm-' + perm"
                                            :value="perm" v-model="selectedRole.permissions">
                                        <label class="form-check-label" :for="'edit-perm-' + perm">
                                            {{ perm }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateRole" data-bs-dismiss="modal">確認修改</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 刪除角色確認 Modal -->
        <div class="modal fade" id="deleteRoleModal" tabindex="-1" aria-labelledby="deleteRoleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteRoleModalLabel">確認刪除</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        確定要刪除這個角色嗎？此操作無法復原。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="deleteRole" data-bs-dismiss="modal">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faPlus,
    faPenToSquare,
    faTrashCan,
    faMagnifyingGlass,
    faRotate
} from '@fortawesome/free-solid-svg-icons';
import { roleService } from '@/services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

library.add(
    faPlus,
    faPenToSquare,
    faTrashCan,
    faMagnifyingGlass,
    faRotate
);

export default {
    components: {
        FontAwesomeIcon
    },
    setup() {
        // 響應式狀態
        const roles = ref([]);
        const availablePermissions = ref([]);
        const isLoading = ref(false);
        const errorMessage = ref('');
        
        // 搜索條件
        const searchByRoleId = ref('');
        const searchByRoleName = ref('');
        const searchByRoleDepartment = ref('');
        
        // 表單數據
        const newRole = ref({
            name: '',
            department: '',
            permissions: []
        });
        const selectedRole = ref(null);
        const roleToDelete = ref(null);

        // 初始化數據
        const initializeData = async () => {
            try {
                isLoading.value = true;
                const [rolesData, permissionsData] = await Promise.all([
                    roleService.getAllRoles(),
                    roleService.getAllPermissions()
                ]);
                roles.value = rolesData;
                availablePermissions.value = permissionsData;
            } catch (error) {
                console.error('Failed to initialize data:', error);
                errorMessage.value = '載入數據失敗';
            } finally {
                isLoading.value = false;
            }
        };

        // 重置搜索
        const resetSearch = () => {
            searchByRoleId.value = '';
            searchByRoleName.value = '';
            searchByRoleDepartment.value = '';
        };

        // 添加角色
        const addRole = async () => {
            try {
                isLoading.value = true;
                const response = await roleService.createRole(newRole.value);
                roles.value.push(response);
                resetNewRole();
            } catch (error) {
                console.error('Failed to add role:', error);
                errorMessage.value = '新增角色失敗';
            } finally {
                isLoading.value = false;
            }
        };

        // 更新角色
        const updateRole = async () => {
            if (!selectedRole.value) return;
            
            try {
                isLoading.value = true;
                const updatedRole = await roleService.updateRole(
                    selectedRole.value.id,
                    selectedRole.value
                );
                const index = roles.value.findIndex(r => r.id === updatedRole.id);
                if (index !== -1) {
                    roles.value[index] = updatedRole;
                }
                selectedRole.value = null;
            } catch (error) {
                console.error('Failed to update role:', error);
                errorMessage.value = '更新角色失敗';
            } finally {
                isLoading.value = false;
            }
        };

        // 刪除角色
        const deleteRole = async () => {
            if (!roleToDelete.value) return;
            
            try {
                isLoading.value = true;
                await roleService.deleteRole(roleToDelete.value);
                roles.value = roles.value.filter(r => r.id !== roleToDelete.value);
                roleToDelete.value = null;
            } catch (error) {
                console.error('Failed to delete role:', error);
                errorMessage.value = '刪除角色失敗';
            } finally {
                isLoading.value = false;
            }
        };

        // 重置新角色表單
        const resetNewRole = () => {
            newRole.value = {
                name: '',
                department: '',
                permissions: []
            };
        };

        // 編輯角色
        const onEditRole = (role) => {
            selectedRole.value = { ...role };
        };

        // 準備刪除角色
        const onDeleteRole = (roleId) => {
            roleToDelete.value = roleId;
        };

        // 計算屬性
        const roleDepartments = computed(() => {
            // 確保 roles.value 是陣列
            console.log(roles.value)
            if (!Array.isArray(roles.value)) {
                console.warn('roles.value is not an array:', roles.value);
                return [];
            }
            return [...new Set(roles.value.map(role => role.department))];
        });

        const filteredRoles = computed(() => {
            return roles.value.filter(role => {
                const roleIdMatch = role.id.toLowerCase().includes(searchByRoleId.value.toLowerCase());
                const roleNameMatch = role.name.toLowerCase().includes(searchByRoleName.value.toLowerCase());
                const departmentMatch = !searchByRoleDepartment.value || role.department === searchByRoleDepartment.value;
                return roleIdMatch && roleNameMatch && departmentMatch;
            });
        });

        // 生命週期掛載
        onMounted(() => {
            initializeData();
            
            // 監聽 modal 的顯示和隱藏
            const modals = ['createRoleModal', 'editRoleModal', 'deleteRoleModal'];
            modals.forEach(modalId => {
                const modalElement = document.getElementById(modalId);
                if (modalElement) {
                    modalElement.addEventListener('show.bs.modal', () => {
                        modalElement.removeAttribute('inert');
                    });
                    modalElement.addEventListener('hidden.bs.modal', () => {
                        modalElement.setAttribute('inert', '');
                    });
                }
            });
        });

        // 返回要在模板中使用的屬性和方法
        return {
            // 狀態
            roles,
            availablePermissions,
            isLoading,
            errorMessage,
            
            // 搜索相關
            searchByRoleId,
            searchByRoleName,
            searchByRoleDepartment,
            
            // 表單數據
            newRole,
            selectedRole,
            roleToDelete,
            
            // 計算屬性
            roleDepartments,
            filteredRoles,
            
            // 方法
            resetSearch,
            addRole,
            updateRole,
            deleteRole,
            resetNewRole,
            onEditRole,
            onDeleteRole
        };
    }
};
</script>

<style scoped>
.container {
    padding: 20px;
}

.content-wrapper {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-tabs .nav-link {
    color: #334255;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    cursor: pointer;
}

.nav-tabs .nav-link.active {
    color: #334255;
    font-weight: 600;
    border-bottom: 2px solid #334255;
    background: none;
}

.add-employee-btn,
.add-role-btn {
    color: #334255;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border: 2px solid #334255;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.add-employee-btn:hover,
.add-role-btn:hover {
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

.form-floating>.form-select,
.form-floating>.form-control {
    padding-top: 1.625rem;
    padding-bottom: 0.625rem;
    height: 100%;
}

.form-floating label {
    color: #334255;
    font-weight: 500;
}

.table {
    margin-bottom: 0;
    white-space: nowrap;
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

.badge {
    font-size: 0.8rem;
    padding: 0.5em 0.7em;
    margin: 0.2em;
    background-color: #6c757d;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .content-wrapper {
        padding: 1rem;
    }

    .form-floating {
        margin-bottom: 1rem;
    }

    .add-employee-btn,
    .add-role-btn {
        width: 100%;
        margin-bottom: 1rem;
    }

    .table th,
    .table td {
        font-size: 0.9rem;
        padding: 0.5rem;
    }
}

/* Modal 樣式 */
.modal-content {
    border-radius: 8px;
    border: none;
}

.modal-header {
    background-color: #f8f9fa;
    border-bottom: 2px solid #FFCD50;
}

.modal-header .modal-title {
    color: #334255;
    font-weight: 600;
}

.modal-footer {
    border-top: 1px solid #dee2e6;
    padding: 1rem;
}

.permission-checkboxes {
    max-height: 200px;
    overflow-y: auto;
    padding: 0.5rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
}

.form-check {
    margin-bottom: 0.5rem;
}

.form-check-input:checked {
    background-color: #334255;
    border-color: #334255;
}

.btn-primary {
    background-color: #334255;
    border-color: #334255;
}

.btn-primary:hover {
    background-color: #FFCD50;
    border-color: #FFCD50;
    color: #334255;
}

.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
}

.btn-danger:hover {
    background-color: #bb2d3b;
    border-color: #b02a37;
}
</style>