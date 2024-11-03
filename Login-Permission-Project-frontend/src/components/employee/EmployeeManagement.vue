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
                            <!-- 搜尋表單 -->
                            <div class="col">
                                <form @submit.prevent="handleSearch">
                                    <div class="row g-3 align-items-center">
                                        <!-- 員工編號 -->
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <input type="text" class="form-control" id="employeeId"
                                                    v-model="searchForm.employeeId" placeholder="請輸入員工編號">
                                                <label for="employeeId">員工編號</label>
                                            </div>
                                        </div>

                                        <!-- 員工姓名 -->
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <input type="text" class="form-control" id="employeeName"
                                                    v-model="searchForm.name" placeholder="請輸入姓名">
                                                <label for="employeeName">員工姓名</label>
                                            </div>
                                        </div>

                                        <!-- 部門選擇 -->
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <select class="form-select" 
                                                    v-model="searchForm.department">
                                                    <option value="">請選擇部門</option>
                                                    <option v-for="dept in departmentOptions" :key="dept.value"
                                                        :value="dept.value">
                                                        {{ dept.label }}
                                                    </option>
                                                </select>
                                                <label>部門</label>
                                            </div>
                                        </div>

                                        <!-- 科別選擇 -->
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <select class="form-select" v-model="formData.unit_id" required>
                                                    <option value="">請選擇科別</option>
                                                    <option v-for="unit in unitOptions" :key="unit.value"
                                                        :value="unit.value">
                                                        {{ unit.label }}
                                                    </option>
                                                </select>
                                                <label>科別</label>
                                            </div>
                                        </div>

                                        <!-- 職位選擇 -->
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <select class="form-select" 
                                                    v-model="formData.position_id" required>
                                                    <option value="">請選擇職位</option>
                                                    <option v-for="pos in positionOptions" :key="pos.value"
                                                        :value="pos.value">
                                                        {{ pos.label }}
                                                    </option>
                                                </select>
                                                <label>職位</label>
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <div class="form-floating">
                                                <select class="form-select" v-model="formData.status_id" required>
                                                    <option value="">請選擇狀態</option>
                                                    <option v-for="status in statusOptions" 
                                                            :key="status.value" 
                                                            :value="status.value">
                                                        {{ status.label }}
                                                    </option>
                                                </select>
                                                <label>狀態</label>
                                            </div>
                                        </div>

                                        <!-- 搜尋按鈕 -->
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
                            <th class="text-center" style="width: 80px">編輯</th>
                            <th class="text-center">員工編號</th>
                            <th class="text-center">員工姓名</th>
                            <th class="text-center">電子郵件</th>
                            <th class="text-center">電話</th>
                            <th class="text-center">部門</th>
                            <th class="text-center">科別</th>
                            <th class="text-center">職位</th>
                            <th class="text-center">狀態</th>
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
                            <td class="text-center">{{ employee.phoneNumber }}</td>
                            <td class="text-center">{{ employee.department }}</td>
                            <td class="text-center">{{ employee.unit }}</td>
                            <td class="text-center">{{ employee.position }}</td>
                            <td class="text-center">
                                <span :class="['status-badge', getStatusClass(employee.status_id)]">
                                    {{ getStatusText(employee.status_id) }}
                                </span>
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
                            <!-- 員工編號 -->
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="text" class="form-control" v-model="formData.employee_id"
                                        :readonly="isEditing" required>
                                    <label>員工編號</label>
                                </div>
                            </div>

                            <!-- 員工姓名 -->
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="text" class="form-control" v-model="formData.name" required>
                                    <label>員工姓名</label>
                                </div>
                            </div>

                            <!-- 電子郵件 -->
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="email" class="form-control" v-model="formData.email" required>
                                    <label>電子郵件</label>
                                </div>
                            </div>

                             <!-- 密碼 (僅新增時顯示) -->
                            <!-- <div class="col-md-6" v-if="!isEditing">
                                <div class="form-floating">
                                    <input type="password" class="form-control" v-model="formData.password" required>
                                    <label>密碼</label>
                                </div>
                            </div> -->

                            <!-- 電話 -->
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input type="tel" class="form-control" v-model="formData.phoneNumber" required>
                                    <label>電話</label>
                                </div>
                            </div>

                            <!-- 職位 -->
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <select class="form-select" v-model="formData.position_id" required>
                                        <option value="">請選擇職位</option>
                                        <option v-for="pos in positionOptions" :key="pos.value" :value="pos.value">
                                            {{ pos.label }}
                                        </option>
                                    </select>
                                    <label>職位</label>
                                </div>
                            </div>

                            <!-- 狀態 -->
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <select class="form-select" v-model="formData.status_id" required>
                                        <option value="">請選擇狀態</option>
                                        <option v-for="status in statusOptions" 
                                                :key="status.value" 
                                                :value="status.value">
                                            {{ status.label }}
                                        </option>
                                    </select>
                                    <label>狀態</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                        <button type="button" class="btn btn-primary" @click="handleSubmit" :disabled="isSubmitting">
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
// import { useToast } from 'vue-toastification'
import axios from 'axios'

// 初始化

const isLoading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const employees = ref([])

// 搜尋表單
const searchForm = reactive({
    employee_id: '',  // 改成與資料庫欄位名稱一致
    name: '',
    position_id: '', // 改為 position_id
    status_id: ''    // 改為 status_id
})

// 表單數據
const formData = reactive({
    employee_id: '', // 員工編號
    name: '',        // 姓名
    email: '',       // 電子郵件
    password: '',    // 密碼
    phone_number: '', // 電話號碼
    position_id: '', // 職位編號
    status_id: ''    // 狀態編號
})

// 下拉選項
const departmentOptions = ref([])
const unitOptions = ref([])
const positionOptions = ref([])
const statusOptions = ref([])

// 自訂通知函數
const notifySuccess = (message) => alert(message)
const notifyError = (message) => alert(message)

// 獲取所有下拉選項數據
const fetchOptions = async () => {
    try {
        // 獲取部門、科別、職位和狀態選項
        const [departmentResponse, unitResponse, positionResponse, statusResponse] = await Promise.all([
            axios.get('http://localhost:8085/department/test/get'),
            axios.get('http://localhost:8085/unit/test/get'),
            axios.get('http://localhost:8085/Position/get'),
            axios.get('http://localhost:8085/status/test/get')
        ])

        departmentOptions.value = departmentResponse.data.map(dept => ({ value: dept.department_id, label: dept.department_name }))
        unitOptions.value = unitResponse.data.map(unit => ({ value: unit.unit_id, label: unit.unit_name }))
        positionOptions.value = positionResponse.data.map(position => ({ value: position.position_id, label: position.position }))
        statusOptions.value = statusResponse.data.map(status => ({ value: status.status_id, label: status.name }))

    } catch (error) {
        notifyError('獲取選項數據失敗');
    }
}

// 獲取員工列表
const fetchEmployees = async () => {
    try {
        isLoading.value = true
        const response = await axios.get('http://localhost:8085/employee/test/get')
        employees.value = response.data
    } catch (error) {
        notifyError('獲取員工列表失敗');
    } finally {
        isLoading.value = false
    }
}

// 處理搜索
const handleSearch = async () => {
    await fetchEmployees()
}

// 打開新增視窗
const openAddModal = () => {
    isEditing.value = false
    resetFormData()
    showModal.value = true
}

// 打開編輯視窗 - 調整資料映射
const openEditModal = (employee) => {
    isEditing.value = true
    Object.assign(formData, {
        employee_id: employee.employee_id,
        name: employee.name,
        email: employee.email,
        phone_number: employee.phone_number,
        position_id: employee.position_id,
        status_id: employee.status_id
    })
    showModal.value = true
}

// 重置表單
const resetFormData = () => {
    Object.assign(formData, {
        employee_id: '',
        name: '',
        email: '',
        password: '',
        phone_number: '',
        position_id: '',
        status_id: ''
    })
}

// 關閉視窗
const closeModal = () => {
    showModal.value = false;
    resetFormData();
};

// 驗證表單
const validateForm = () => {
    const requiredFields = ['employee_id', 'name', 'email', 'phone_number', 'position_id', 'status_id']
    for (const field of requiredFields) {
        if (!formData[field]) {
            notifyError(`請填寫 ${field}`)
            return false
        }
  }
  return true;
};

// 提交表單
const handleSubmit = async () => {
    if (!validateForm()) return

    try {
        isSubmitting.value = true;
        const url = isEditing.value ? 'http://localhost:8085/employee/test/edit' : 'http://localhost:8085/employee/test/add';
        await axios[isEditing.value ? 'put' : 'post'](url, formData)

        notifySuccess(`${isEditing.value ? '更新' : '新增'}員工成功`);
        closeModal();
        await fetchEmployees();
        
    } catch (error) {
        notifyError(`${isEditing.value ? '更新' : '新增'}員工失敗`)
    } finally {
        isSubmitting.value = false;
    }
}

// On mounted
onMounted(() => {
  fetchOptions();
  fetchEmployees();
});
</script>



