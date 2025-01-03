<template>
    <!-- 員工管理內容 -->
    <div class="row g-3 align-items-center">
        <!-- 新增員工按鈕 -->
        <div class="col-auto">
            <button type="button" class="btn add-employee-btn" style="margin-bottom:20px;" data-bs-toggle="modal"
                data-bs-target="#createEmployeeModal" @click="">
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
                                    <input type="text" class="form-control" id="employeeId" v-model="searchByEmployeeId"
                                        placeholder="查詢員工編號">
                                    <label for="employeeId">員工編號查詢</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="employeeName" v-model="searchByName"
                                        placeholder="查詢員工姓名">
                                    <label for="employeeName">員工姓名查詢</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-floating">
                                    <select class="form-select" id="departmentSelect" v-model="searchByDepartmentId">
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
                                    <select class="form-select" id="positionSelect" v-model="searchByPositionId">
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
                                <button type="button" class="btn btn-secondary search-btn" v-on:click="resetSearch">
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
                            data-bs-target="#deleteEmployeeModal" @click="onDeleteEmployee(employee.employee_id)">
                            <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- 編輯員工 Modal -->
    <div class="modal fade" id="editEmployeeModal" tabindex="-1" aria-labelledby="editEmployeeModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editEmployeeModalLabel">編輯員工資料</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-if="selectedEmployee">
                    <!-- 基本資料編輯區 -->
                    <h6 class="mb-3">基本資料</h6>
                    <div class="mb-3">
                        <label for="editName" class="form-label">姓名</label>
                        <input type="text" class="form-control" id="editName" v-model="selectedEmployee.name">
                    </div>
                    <div class="mb-3">
                        <label for="editEmail" class="form-label">電子郵件</label>
                        <input type="email" class="form-control" id="editEmail" v-model="selectedEmployee.email">
                    </div>
                    <div class="mb-3">
                        <label for="editPhone" class="form-label">電話</label>
                        <input type="text" class="form-control" id="editPhone" v-model="selectedEmployee.phoneNumber">
                    </div>

                    <!-- 角色編輯區 -->
                    <h6 class="mb-3 mt-4">角色設定</h6>
                    <div class="permission-checkboxes">
                        <div v-for="role in roles" :key="role.role_id" class="form-check">
                            <input class="form-check-input" type="checkbox" 
                                :id="'role-' + role.role_id"
                                :checked="selectedEmployee && selectedEmployee.roles.some(r => r.role_id === role.role_id)"
                                @change="toggleRole(role)">
                            <label class="form-check-label" :for="'role-' + role.role_id">
                                {{ role.role }}
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="updateEmployee" :disabled="isUpdating">
                        <span v-if="!isUpdating">儲存</span>
                        <span v-else class="d-flex align-items-center">
                            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            儲存中...
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { mapGetters } from 'vuex'
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
            newEmployee: {
                name: '',
                email: '',
                phoneNumber: '',
                status_id: null
            },
            roles: [], // 所有角色列表
            selectedEmployee: {
                name: '',
                email: '',
                phoneNumber: '',
                roles: [],
                department_id: null,
                unit_id: null,
                position_id: null,
                status_id: null
            },
            isUpdating: false,
        };
    },
    methods: {
        async fetchEmployees() {
            try {
                const token = localStorage.getItem('JWT_Token');
                console.log("開始獲取員工資料");
                let response = await fetch("http://localhost:8085/employee/test/get", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                     },
                    //  body: JSON.stringify(this.newEmployee)
                });
                console.log("API 回應:", response);

                if (response.ok) {
                    const data = await response.json();
                    console.log("解析後資料:", data);
                    this.employeeInfo = data['data'];
                    console.log("設置後的 employeeInfo:", this.employeeInfo);
                } else {
                    console.error("API 錯誤回應:", response.statusText);
                }
            } catch (error) {
                console.log("獲取資料錯誤:", error);
            }
        },

        resetSearch() {
            this.searchByEmployeeId = "";
            this.searchByName = "";
            this.searchByDepartmentId = "";
            this.searchByUnitId = "";
            this.searchByPositionId = "";
            this.searchByStatusId = "";
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
            this.selectedEmployee = JSON.parse(JSON.stringify(employee));
        },

        async updateEmployee() {
            if (this.isUpdating) return;
            
            this.isUpdating = true;
            try {
                const token = localStorage.getItem('JWT_Token');
                const employeeData = { ...this.selectedEmployee };
                delete employeeData.password;

                const response = await fetch("http://localhost:8085/employee/test/edit", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(employeeData)
                });
                if (response.ok) {
                    await this.fetchEmployees();
                    document.querySelector('#editEmployeeModal [data-bs-dismiss="modal"]').click();
                    this.selectedEmployee = null;
                } else {
                    throw new Error('Server response was not OK');
                }
            } catch (error) {
                console.error("Error updating employee:", error);
            } finally {
                this.isUpdating = false;
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
        async fetchRoles() {
            try {
                const token = localStorage.getItem('JWT_Token');
                const response = await fetch("http://localhost:8085/role/getAll", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    this.roles = data.data;
                    console.log(this.roles)
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        },

        toggleRole(role) {
            if (!this.selectedEmployee) return;
            
            const index = this.selectedEmployee.roles.findIndex(r => r.role_id === role.role_id);
            if (index === -1) {
                // 如果角色不存在，添加它
                this.selectedEmployee.roles.push({
                    role_id: role.role_id,
                    role: role.role,
                    permissions: role.permissions || []
                });
            } else {
                // 如果角色存在，移除它
                this.selectedEmployee.roles.splice(index, 1);
            }
        }
    },
    async mounted() {
        await this.fetchEmployees();
        await this.fetchRoles();
        this.addDepartments();
        this.addUnits();
        this.addPosition();
        this.addStatus();
    },
    computed: {
        ...mapGetters('auth', ['userId'])
    }
};
</script>

<style scoped>
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
.spinner-border {
    width: 1rem;
    height: 1rem;
    border-width: 0.15em;
}

.btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}
</style>