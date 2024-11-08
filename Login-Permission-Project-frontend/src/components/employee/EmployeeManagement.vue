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
                        data-bs-toggle="modal" data-bs-target="#createEmployeeModal" @click="">
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
                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="employeeId" v-model="searchByEmployeeId" placeholder="查詢員工編號">
                                            <label for="employeeId">員工編號查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="employeeName" v-model="searchByName" placeholder="查詢員工姓名">
                                            <label for="employeeName">員工姓名查詢</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <select class="form-select" id="departmentSelect" v-model="searchByDepartmentId">
                                                <option selected value="">選擇部門</option>
                                                <option v-for="department in departments" >
                                                      {{ department}}
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
                                                    {{ unit}}
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
                                                     {{ position}}
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
                            <td class="text-center">
                                {{ employee.departmentName? employee.departmentName : 'N/A' }}
                            </td>
                            <td class="text-center"  >
                                {{ employee.unitName ?employee.unitName : 'N/A' }}
                            </td>
                            <td class="text-center">
                                {{employee.positionName ? employee.positionName : 'N/A'}}
                            </td>

                            <td class="text-center">{{ employee.statusName? employee.statusName : 'N/A' }}</td>

                            <!-- <td class="text-center">{{ employee.status.name }}</td> -->
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
            employeeInfo:[],
            departments: [],
            units: [],
            position:[],
            status:[],
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
                position_id: null,
                status_id: null
            }
        };
    },
    methods: {
        async fetchEmployees() {
            try {
                let response = await fetch("http://localhost:8085/employee/test/getAllEmployeeInfo");
                if(response.ok) {
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
                console.log("Add response:", response);
                if (response.ok) {
                    this.fetchEmployees(); // 重新載入資料
                    this.newEmployee = { name: '', email: '', phoneNumber: '', position_id: null, status_id: null };
                }else{
                    console.error("Error adding employee:", response.statusText);
                }
            } catch (error) {
                console.error("Error adding employee:", error);
            }
        },
        filteredEmployeeInfo() {
        return this.employeeInfo.filter(employee => {

          // 檢查每個篩選條件，如果存在就必須匹配
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
            this.selectedEmployee = { ...employee }; // 克隆選擇的員工資料
        },
        async updateEmployee() {
            try {
                const response = await fetch("http://localhost:8085/employee/test/edit", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.selectedEmployee)
                });
                if (response.ok) {
                    this.fetchEmployees();
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
                    this.fetchEmployees();
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
      }


    },
    
    
    async mounted() {
        await this.fetchEmployees();
        this.addDepartments();
        this.addUnits();
        this.addPosition();
        this.addStatus();
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

.form-floating>.form-select, .form-floating>.form-control {
    padding-top: 1.625rem;
    padding-bottom: 0.625rem;
    height: 100%;
    width: 100%;
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
    text-align: center;
}

.table td {
    padding: 1rem;
    vertical-align: middle;
    text-align: center;
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
        
    .form-floating {
        margin-bottom: 1rem;
    }

    .table th, .table td {
        font-size: 0.9rem;
        padding: 0.5rem;
    }
}

/* 調整下拉選單的寬度和樣式 */
.form-select {
    min-width: 150px;
    border-radius: 4px;
    padding: 0.5rem;
}

.form-control {
    border-radius: 4px;
    padding: 0.5rem;
}

.card {
    border: 1px solid #dee2e6;
    border-radius: 8px;
}

.card .card-body {
    padding: 1rem;
}

</style>
