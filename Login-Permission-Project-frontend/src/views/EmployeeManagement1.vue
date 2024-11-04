<template>
    <div class="employee-management">
        <!-- 頁籤 -->
        <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
                <a class="nav-link active">員工管理</a>
            </li>
        </ul>

        <div class="content-wrapper">
            <div class="row g-3 align-items-center">
                <!-- 新增員工按鈕 -->
                <div class="col-auto">
                    <button class="btn add-employee-btn" style="margin-bottom:20px;" @click="openAddModal">
                        <font-awesome-icon :icon="['fas', 'plus']" size="xl" class="me-2" />
                        新增員工
                    </button>
                </div>

                <!-- 搜尋區塊 -->
                <div class="col">
                    <div class="card w-100 mb-4 border-0">
                        <div class="card-body">
                            <form @submit.prevent="handleSearch">
                                <div class="row g-3 align-items-center">
                                    <div class="col-md">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="employeeId"
                                                v-model="searchForm.employeeId" placeholder="請輸入員工編號">
                                            <label for="employeeId">員工編號</label>
                                        </div>
                                    </div>
                                    <div class="col-md">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="employeeName"
                                                v-model="searchForm.name" placeholder="請輸入姓名">
                                            <label for="employeeName">員工姓名</label>
                                        </div>
                                    </div>
                                    <div class="col-auto d-flex align-items-center">
                                        <button type="submit" class="btn search-btn">
                                            <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="lg" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 加載指示器 -->
            <div v-if="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">載入中...</span>
                </div>
            </div>

            <!-- 員工列表 -->
            <div class="table-responsive" v-else>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th class="text-center">編輯</th>
                            <th class="text-center">員工編號</th>
                            <th class="text-center">員工姓名</th>
                            <th class="text-center">電子郵件</th>
                            <th class="text-center">電話</th>
                            <th class="text-center">職位</th>
                            <th class="text-center">狀態</th>
                            <th class="text-center">刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="employee in employees" :key="employee.employee_id">
                            <td class="text-center">
                                <button class="btn btn-link" @click="openEditModal(employee)">
                                    <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                </button>
                            </td>
                            <td class="text-center">{{ employee.employee_id }}</td>
                            <td class="text-center">{{ employee.name }}</td>
                            <td class="text-center">{{ employee.email }}</td>
                            <td class="text-center">{{ employee.phone_number }}</td>
                            <td class="text-center">{{ employee.position_id }}</td>
                            <td class="text-center">{{ employee.status_id }}</td>
                            <td class="text-center">
                                <button class="btn btn-danger" @click="deleteEmployee(employee.employee_id)">
                                    <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- 無資料提示 -->
                <div v-if="!isLoading && employees.length === 0" class="text-center py-4">
                    <p class="text-muted">暫無資料</p>
                </div>
            </div>
        </div>

        <!-- 新增/編輯員工 Modal -->
        <div class="modal fade" :class="{ show: showModal }" v-if="showModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEditing ? '編輯員工資料' : '新增員工' }}</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleSubmit" class="row g-3">
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="text" class="form-control" v-model="formData.name" required>
                                    <label>員工姓名</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="email" class="form-control" v-model="formData.email" required>
                                    <label>電子郵件</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="tel" class="form-control" v-model="formData.phone_number" required>
                                    <label>電話</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                        <button type="button" class="btn btn-primary" @click="handleSubmit">
                            {{ isSubmitting ? '處理中...' : '確認' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const employees = ref([])
const searchForm = reactive({
    employeeId: '',
    name: ''
})
const formData = reactive({
    employee_id: '',
    name: '',
    email: '',
    phone_number: '',
    position_id: '',
    status_id: ''
})
const showModal = ref(false)
const isEditing = ref(false)

const fetchEmployees = async () => {
    try {
        const response = await axios.get('http://localhost:8085/employee/test/get')
        employees.value = response.data
    } catch (error) {
        console.error('獲取員工列表失敗:', error)
    }
}

const handleSearch = async () => {
    await fetchEmployees()
}

const openAddModal = () => {
    isEditing.value = false
    resetFormData()
    showModal.value = true
}

const openEditModal = (employee) => {
    isEditing.value = true
    Object.assign(formData, employee)
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            await axios.put('http://localhost:8085/employee/test/edit', formData)
        } else {
            await axios.post('http://localhost:8085/employee/test/add', formData)
        }
        await fetchEmployees()
        closeModal()
    } catch (error) {
        console.error('提交失敗:', error)
    }
}

const deleteEmployee = async (id) => {
    try {
        await axios.delete(`http://localhost:8085/employee/test/delete/${id}`)
        await fetchEmployees()
    } catch (error) {
        console.error('刪除失敗:', error)
    }
}

const resetFormData = () => {
    formData.employee_id = ''
    formData.name = ''
    formData.email = ''
    formData.phone_number = ''
    formData.position_id = ''
    formData.status_id = ''
}

onMounted(fetchEmployees)
</script>

<style scoped>
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
    height: 58px;
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

/* .btn-danger {
    color: #ffffff;
    background-color: #dc3545;
    border-color: #dc3545; 
} */
.btn-link.text-danger:hover {
    color: #dc3545;
}

/* .btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
} */

.modal-dialog {
    max-width: 800px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
