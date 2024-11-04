<template>
    <div class="container">
        <!-- 員工管理頁籤 -->
        <ul class="nav nav-tabs mb-2">
            <li class="nav-item">
                <a class="nav-link active">員工管理</a>
            </li>
        </ul>

        <div class="content-wrapper">
            <div class="row g-3 align-items-center">
                <!-- 新增員工按鈕 -->
                <div class="col-auto">
                    <button type="button" class="btn add-employee-btn" style="margin-bottom:20px;"
                        data-bs-toggle="modal" data-bs-target="#createEmployeeModal">
                        <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
                        新增員工
                    </button>
                </div>

                <!-- 搜尋欄位 -->
                <div class="col">
                    <div class="card w-100 mb-4 border-0">
                        <div class="card-body">
                            <form>
                                <div class="row g-3 align-items-center">
                                    <div class="col-md">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="employeeIdSelect" v-model="searchByEmployeeId" placeholder="查詢員工編號">
                                            <label for="employeeIdSelect">員工編號查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="employeeName" v-model="searchByName" placeholder="查詢員工姓名">
                                            <label for="employeeName">員工姓名查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md">
                                        <div class="form-floating">
                                            <select class="form-select" id="departmentSelect" v-model="searchByDepartmentId">
                                                <option selected value="">選擇部門</option>
                                                <option v-for="department in departments" :key="department.department_id" :value="department.department_id">
                                                    ({{ department.department_id }}) {{ department.department_name }}
                                                </option>
                                            </select>
                                            <label for="departmentSelect">部門查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md">
                                        <div class="form-floating">
                                            <select class="form-select" id="unitSelect" v-model="searchByUnitId">
                                                <option selected value="">選擇科別</option>
                                                <option v-for="unit in units" :key="unit.unit_id" :value="unit.unit_id">
                                                    ({{ unit.unit_id }}) {{ unit.unit_name }}
                                                </option>
                                            </select>
                                            <label for="unitSelect">科別查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md">
                                        <div class="form-floating">
                                            <select class="form-select" id="positionSelect" v-model="searchByPositionId">
                                                <option selected value="">選擇職位</option>
                                                <option v-for="position in positions" :key="position.position_id" :value="position.position_id">
                                                    ({{ position.position_id }}) {{ position.position }}
                                                </option>
                                            </select>
                                            <label for="positionSelect">職位查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md">
                                        <div class="form-floating">
                                            <select class="form-select" id="statusSelect" v-model="searchByStatusId">
                                                <option selected value="">選擇狀態</option>
                                                <option v-for="status in statusOptions" :key="status.status_id" :value="status.status_id">
                                                    ({{ status.status_id }}) {{ status.name }}
                                                </option>
                                            </select>
                                            <label for="statusSelect">狀態查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-auto d-flex align-items-center">
                                        <button type="button" class="btn btn-primary search-btn me-2" v-on:click="search">
                                            <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="lg" />
                                        </button>
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
                        <tr v-for="employee in employees" :key="employee.employee_id">
                            <td class="text-center">
                                <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                    data-bs-target="#editEmployeeModal" v-on:click="onUpdateEmployee(employee)">
                                    <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                </button>
                            </td>
                            <td class="text-center">{{ employee.employee_id }}</td>
                            <td class="text-center">{{ employee.name }}</td>
                            <td class="text-center">{{ employee.email }}</td>
                            <td class="text-center">{{ employee.phoneNumber }}</td>
                            <td class="text-center">{{ employee.positions[0]?.unit?.department?.department_name || 'N/A' }}</td>
                            <td class="text-center">{{ employee.positions[0]?.unit?.unit_name || 'N/A' }}</td>
                            <td class="text-center">
                                <span v-for="position in employee.positions" :key="position.position_id">
                                    {{ position.position }}
                                </span>
                            </td>
                            <td class="text-center">{{ employee.employeeStatus ? employee.employeeStatus.name : 'N/A' }}</td>

                            <!-- <td class="text-center">{{ employee.status.name }}</td> -->
                            <td class="text-center">
                                <button type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                                    data-bs-target="#deleteEmployeeModal" v-on:click="onSelectEmployee(employee)">
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

<script>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlus, faPenToSquare, faTrashCan, faMagnifyingGlass, faRotate } from '@fortawesome/free-solid-svg-icons';

export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            employees: [],
            employeeOptions: [],
            departments: [],
            units: [],
            positionOptions: [],
            statusOptions: [],
            searchByEmployeeId: "",
            searchByName: "",
            searchByDepartmentId: "",
            searchByUnitId: "",
            searchByPositionId: "",
            searchByStatusId: "",
        };
    },
    methods: {
        async fetchEmployees() {
            try {
                let response = await fetch("http://localhost:8085/employee/test/get");
                this.employees = await response.json();
            } catch (error) {
                console.log("Error fetching employees:", error);
            }
        },
        async fetchStatusOptions() {
            try {
                let response = await fetch("http://localhost:8085/status/test/get");
                this.statusOptions = await response.json();
            } catch (error) {
                console.log("Error fetching statuses:", error);
            }
        },
        async fetchDepartments() {
            try {
                let response = await fetch("http://localhost:8085/department/test/get");
                this.departments = await response.json();
            } catch (error) {
                console.log("Error fetching departments:", error);
            }
        },
        async fetchUnits() {
            try {
                let response = await fetch("http://localhost:8085/unit/test/get");
                this.units = await response.json();
            } catch (error) {
                console.log("Error fetching units:", error);
            }
        },
        async fetchPositions() {
            try {
                let response = await fetch("http://localhost:8085/position/get");
                this.positionOptions = await response.json();
            } catch (error) {
                console.log("Error fetching positions:", error);
            }
        },
        search() {
            this.employees = this.employees.filter(employee => {
                const matchesEmployeeId = !this.searchByEmployeeId || employee.employee_id == this.searchByEmployeeId;
                const matchesName = !this.searchByName || employee.name.includes(this.searchByName);
                const matchesDepartment = !this.searchByDepartmentId || (employee.positions[0]?.unit?.department?.department_id == this.searchByDepartmentId);
                const matchesUnit = !this.searchByUnitId || (employee.positions[0]?.unit?.unit_id == this.searchByUnitId);
                const matchesPosition = !this.searchByPositionId || employee.positions.some(pos => pos.position_id == this.searchByPositionId);
                const matchesStatus = !this.searchByStatusId || (employee.employeeStatus?.status_id == this.searchByStatusId);
                return matchesEmployeeId && matchesName && matchesDepartment && matchesUnit && matchesPosition && matchesStatus;
            });
        },
        resetSearch() {
            this.searchByEmployeeId = "";
            this.searchByName = "";
            this.searchByDepartmentId = "";
            this.searchByUnitId = "";
            this.searchByPositionId = "";
            this.searchByStatusId = "";
            this.fetchEmployees();
        }
    },
    mounted() {
        this.fetchEmployees();
        this.fetchStatusOptions();
        this.fetchDepartments();
        this.fetchUnits();
        this.fetchPositions();
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
}

.nav-tabs .nav-link.active {
    color: #334255;
    font-weight: 600;
    border-bottom: 2px solid #334255;
    background: none;
}

.add-employee-btn {
    color: #334255;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border: 2px solid #334255;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.add-employee-btn:hover {
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

    .add-employee-btn {
        width: 100%;
        margin-bottom: 1rem;
    }
}
</style>
