<template>
    <div class="container">
        <!-- 管理頁籤 -->
        <ul class="nav nav-tabs mb-2">
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'employee' }"
                    @click="activeTab = 'employee'">員工管理</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'role' }" @click="activeTab = 'role'">角色管理</a>
            </li>
        </ul>

        <!-- 員工管理內容 -->
        <div v-if="activeTab === 'employee'" class="content-wrapper">
            <div class="row g-3 align-items-center">
                <!-- 新增員工按鈕 -->
                <div class="col-auto">
                    <button type="button" class="btn add-employee-btn" style="margin-bottom:20px;"
                        data-bs-toggle="modal" data-bs-target="#createEmployeeModal" @click="">
                        <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
                        新增員工
                    </button>
                </div>

                <!-- 員工搜尋欄位 -->
                <div class="col">
                    <div class="card w-100 mb-4 border-0">
                        <div class="card-body">
                            <form>
                                <div class="row g-3 align-items-center">
                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="employeeId"
                                                v-model="searchByEmployeeId" placeholder="查詢員工編號">
                                            <label for="employeeId">員工編號查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="employeeName"
                                                v-model="searchByName" placeholder="查詢員工姓名">
                                            <label for="employeeName">員工姓名查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <select class="form-select" id="departmentSelect"
                                                v-model="searchByDepartmentId">
                                                <option selected value="">選擇部門</option>
                                                <option v-for="department in departments">
                                                    {{ department }}
                                                </option>
                                            </select>
                                            <label for="departmentSelect">部門查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <select class="form-select" id="unitSelect" v-model="searchByUnitId">
                                                <option selected value="">選擇科別</option>
                                                <option v-for="unit in units">
                                                    {{ unit }}
                                                </option>
                                            </select>
                                            <label for="unitSelect">科別查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <select class="form-select" id="positionSelect"
                                                v-model="searchByPositionId">
                                                <option selected value="">選擇職位</option>
                                                <option v-for="position in positions">
                                                    {{ position }}
                                                </option>
                                            </select>
                                            <label for="positionSelect">職位查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <select class="form-select" id="statusSelect" v-model="searchByStatusId">
                                                <option selected value="">選擇狀態</option>
                                                <option v-for="statusName in status">
                                                    {{ statusName }}
                                                </option>
                                            </select>
                                            <label for="statusSelect">狀態查詢</label>
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

            <!-- 員工資料表格 -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th class="text-center" style="width: 80px">編輯</th>
                            <th class="text-center">員工編號</th>
                            <th class="text-center">員工姓名</th>
                            <th class="text-center">電子郵件</th>
                            <th class="text-center">電話</th>
                            <th class="text-center">部門</th>
                            <th class="text-center">科別</th>
                            <th class="text-center">職位</th>
                            <th class="text-center">狀態</th>
                            <th class="text-center" style="width: 80px">刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="employee in filteredEmployeeInfo()" :key="employee.employee_id">
                            <td class="text-center">
                                <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                    data-bs-target="#editEmployeeModal" v-on:click="onEditEmployee(employee)">
                                    <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                </button>
                            </td>
                            <td class="text-center">{{ employee.employee_id }}</td>
                            <td class="text-center">{{ employee.name }}</td>
                            <td class="text-center">{{ employee.email }}</td>
                            <td class="text-center">{{ employee.phoneNumber }}</td>
                            <td class="text-center">{{ employee.departmentName ? employee.departmentName : 'N/A' }}</td>
                            <td class="text-center">{{ employee.unitName ? employee.unitName : 'N/A' }}</td>
                            <td class="text-center">{{ employee.positionName ? employee.positionName : 'N/A' }}</td>
                            <td class="text-center">{{ employee.statusName ? employee.statusName : 'N/A' }}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                                    data-bs-target="#deleteEmployeeModal"
                                    @click="onDeleteEmployee(employee.employee_id)">
                                    <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 角色管理內容 -->
        <div v-if="activeTab === 'role'" class="content-wrapper">
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
                        <button type="button" class="btn btn-primary" @click="addRole">確認新增</button>
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
                        <button type="button" class="btn btn-primary" @click="updateRole">確認修改</button>
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
                        <button type="button" class="btn btn-danger" @click="deleteRole">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faPlus,
    faPenToSquare,
    faTrashCan,
    faMagnifyingGlass,
    faRotate
} from '@fortawesome/free-solid-svg-icons';

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
    data() {
        return {
            // 共用数据
            activeTab: 'employee',

            // 员工管理数据
            employees: [],
            employeeInfo: [],
            departments: [],
            units: [],
            positions: [],
            status: [],
            searchByEmployeeId: "",
            searchByName: "",
            searchByDepartmentId: "",
            searchByUnitId: "",
            searchByPositionId: "",
            searchByStatusId: "",
            selectedEmployee: null,
            newEmployee: {
                name: '',
                email: '',
                phoneNumber: '',
                status_id: null
            },
            // 角色管理相關數據
            newRole: {
                name: '',
                department: '',
                permissions: []
            },
            selectedRole: null,
            roleToDelete: null,
            availablePermissions: [
                '系統設定',
                '用戶管理',
                '權限管理',
                '日誌查詢',
                '客戶管理',
                '業務報表',
                '績效查看',
                '帳務處理',
                '報表查詢',
                '員工資料管理',
                '考勤管理',
                '客訴處理',
                '服務品質管理',
                '活動管理',
                '數據分析',
                '程式開發',
                '測試管理',
                '品質檢測',
                '異常通報',
                '採購管理',
                '供應商管理',
                '庫存管理',
                '出貨管理'
            ],

            // 角色管理数据
            searchByRoleId: '',
            searchByRoleName: '',
            searchByRoleDepartment: '',
            roles: [
                {
                    id: 'R001',
                    name: '系統管理人員',
                    department: '資訊部',
                    permissions: ['系統設定', '用戶管理', '權限管理', '日誌查詢']
                },
                {
                    id: 'R002',
                    name: '業務主管',
                    department: '業務部',
                    permissions: ['客戶管理', '業務報表', '績效查看']
                },
                {
                    id: 'R003',
                    name: '財務專員',
                    department: '財務部',
                    permissions: ['帳務處理', '報表查詢']
                },
                {
                    id: 'R004',
                    name: '人資專員',
                    department: '人資部',
                    permissions: ['員工資料管理', '考勤管理']
                },
                {
                    id: 'R005',
                    name: '客服主管',
                    department: '客服部',
                    permissions: ['客訴處理', '服務品質管理']
                },
                {
                    id: 'R006',
                    name: '行銷專員', department: '行銷部',
                    permissions: ['活動管理', '數據分析']
                },
                {
                    id: 'R007',
                    name: '研發工程師',
                    department: '研發部',
                    permissions: ['程式開發', '測試管理']
                },
                {
                    id: 'R008',
                    name: '品管專員',
                    department: '品管部',
                    permissions: ['品質檢測', '異常通報']
                },
                {
                    id: 'R009',
                    name: '採購專員',
                    department: '採購部',
                    permissions: ['採購管理', '供應商管理']
                },
                {
                    id: 'R010',
                    name: '倉管人員',
                    department: '物流部',
                    permissions: ['庫存管理', '出貨管理']
                }
            ]
        };
    },
    computed: {
        // 角色管理的計算屬性
        roleDepartments() {
            return [...new Set(this.roles.map(role => role.department))];
        },
        filteredRoles() {
            return this.roles.filter(role => {
                const roleIdMatch = role.id.toLowerCase().includes(this.searchByRoleId.toLowerCase());
                const roleNameMatch = role.name.toLowerCase().includes(this.searchByRoleName.toLowerCase());
                const departmentMatch = !this.searchByRoleDepartment || role.department === this.searchByRoleDepartment;
                return roleIdMatch && roleNameMatch && departmentMatch;
            });
        }
    },
    methods: {
        // 員工管理方法
        async fetchEmployees() {
            try {
                let response = await fetch("http://localhost:8085/employee/test/getAllEmployeeInfo");
                if (response.ok) {
                    this.employeeInfo = await response.json();
                    console.log(this.employeeInfo);
                } else {
                    console.error("Error fetching employees:", response.statusText);
                }
            } catch (error) {
                console.log("Error fetching employees:", error);
            }
        },

        resetSearch() {
            // 重置員工搜尋
            this.searchByEmployeeId = "";
            this.searchByName = "";
            this.searchByDepartmentId = "";
            this.searchByUnitId = "";
            this.searchByPositionId = "";
            this.searchByStatusId = "";
            // 重置角色搜尋
            this.searchByRoleId = "";
            this.searchByRoleName = "";
            this.searchByRoleDepartment = "";

            this.fetchEmployees();
        },

        async addEmployee() {
            try {
                const response = await fetch("http://localhost:8085/employee/test/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.newEmployee)
                });
                if (response.ok) {
                    await this.fetchEmployees();
                    this.newEmployee = { name: '', email: '', phoneNumber: '', status_id: null };
                }
            } catch (error) {
                console.error("Error adding employee:", error);
            }
        },

        filteredEmployeeInfo() {
            return this.employeeInfo.filter(employee => {
                return (
                    (this.searchByEmployeeId === "" || String(employee.employee_id) === this.searchByEmployeeId) &&
                    (this.searchByName === "" || employee.name.includes(this.searchByName)) &&
                    (this.searchByDepartmentId === "" || employee.departmentName === this.searchByDepartmentId) &&
                    (this.searchByUnitId === "" || employee.unitName === this.searchByUnitId) &&
                    (this.searchByPositionId === "" || employee.positionName === this.searchByPositionId) &&
                    (this.searchByStatusId === "" || employee.statusName === this.searchByStatusId)
                );
            });
        },

        onEditEmployee(employee) {
            this.selectedEmployee = { ...employee };
        },

        async updateEmployee() {
            try {
                const response = await fetch("http://localhost:8085/employee/test/edit", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.selectedEmployee)
                });
                if (response.ok) {
                    await this.fetchEmployees();
                }
            } catch (error) {
                console.error("Error updating employee:", error);
            }
        },

        async onDeleteEmployee(employeeId) {
            try {
                const response = await fetch(`http://localhost:8085/employee/test/delete/${employeeId}`, {
                    method: "DELETE"
                });
                if (response.ok) {
                    await this.fetchEmployees();
                }
            } catch (error) {
                console.error("Error deleting employee:", error);
            }
        },

        addDepartments() {
            this.departments = this.employeeInfo.map(info => info.departmentName);
            this.departments = [...new Set(this.departments)];
        },

        addUnits() {
            this.units = this.employeeInfo.map(info => info.unitName);
            this.units = [...new Set(this.units)];
        },

        addPosition() {
            this.positions = this.employeeInfo.map(info => info.positionName);
            this.positions = [...new Set(this.positions)];
        },

        addStatus() {
            this.status = this.employeeInfo.map(info => info.statusName);
            this.status = [...new Set(this.status)];
        },
        // 角色管理方法
        addRole() {
            // 生成新的角色 ID
            const newId = 'R' + String(this.roles.length + 1).padStart(3, '0');

            const role = {
                id: newId,
                name: this.newRole.name,
                department: this.newRole.department,
                permissions: [...this.newRole.permissions]
            };

            this.roles.push(role);
            this.closeModal('createRoleModal');
            this.resetNewRole();
        },

        updateRole() {
            const index = this.roles.findIndex(r => r.id === this.selectedRole.id);
            if (index !== -1) {
                this.roles[index] = { ...this.selectedRole };
            }
            this.closeModal('editRoleModal');
            this.selectedRole = null;
        },

        deleteRole() {
            if (this.roleToDelete) {
                const index = this.roles.findIndex(r => r.id === this.roleToDelete);
                if (index !== -1) {
                    this.roles.splice(index, 1);
                }
                this.closeModal('deleteRoleModal');
                this.roleToDelete = null;
            }
        },

        resetNewRole() {
            this.newRole = {
                name: '',
                department: '',
                permissions: []
            };
        },

        onEditRole(role) {
            this.selectedRole = { ...role };
        },

        onDeleteRole(roleId) {
            this.roleToDelete = roleId;
        },

        closeModal(modalId) {
            if (window.bootstrap) {
                const modal = window.bootstrap.Modal.getInstance(document.getElementById(modalId));
                if (modal) {
                    modal.hide();
                }
            }
        },
    },
    async mounted() {
        await this.fetchEmployees();
        this.addDepartments();
        this.addUnits();
        this.addPosition();
        this.addStatus();
        if (typeof window !== 'undefined') {
            const bootstrap = require('bootstrap');
            window.bootstrap = bootstrap;
        }
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