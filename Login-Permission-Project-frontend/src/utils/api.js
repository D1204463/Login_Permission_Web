// src/utils/api.js
import axios from 'axios'

const baseURL = 'http://localhost:8085'

const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 請求攔截器
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 響應攔截器
api.interceptors.response.use(response => {
    return response.data
}, error => {
    if (error.response?.status === 401) {
        // 處理未授權情況
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
    return Promise.reject(error)
})

export const employeeApi = {
    // 獲取員工列表
    getEmployees: (params) => api.get('/employee/test/get', { params }),
    
    // 添加員工
    addEmployee: (data) => api.post('/employee/test/add', data),
    
    // 更新員工資料
    updateEmployee: (data) => api.put('/employee/test/edit', data),
    
    // 刪除員工
    deleteEmployee: (id) => api.delete(`/employee/test/delete/${id}`)
}

export const departmentApi = {
    // 獲取部門列表
    getDepartments: () => api.get('/department/test/get')
}

export const unitApi = {
    // 獲取科別列表
    getUnits: () => api.get('/unit/test/get')
}

export const positionApi = {
    // 獲取職位列表
    getPositions: () => api.get('/Position/get')
}

export default api