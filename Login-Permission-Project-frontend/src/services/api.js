import axios from 'axios'

// 創建axios實例
const api = axios.create({
  baseURL: 'http://localhost:8085',
  timeout: 5000
})

// 請求攔截器，加入JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('JWT_Token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const roleService = {
    // 獲取所有角色
    async getAllRoles() {
      try {
        const response = await api.get('/role/getAll');
        console.log("api",response.data)
        return response.data;
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        throw error;
      }
    },
  
    // 創建新角色
    async createRole(roleData) {
      try {
        const response = await api.post('/roles', roleData);
        return response.data;
      } catch (error) {
        console.error('Failed to create role:', error);
        throw error;
      }
    },
  
    // 更新角色
    async updateRole(roleId, roleData) {
      try {
        const response = await api.put(`/roles/${roleId}`, roleData);
        return response.data;
      } catch (error) {
        console.error('Failed to update role:', error);
        throw error;
      }
    },
  
    // 刪除角色
    async deleteRole(roleId) {
      try {
        const response = await api.delete(`/roles/${roleId}`);
        return response.data;
      } catch (error) {
        console.error('Failed to delete role:', error);
        throw error;
      }
    },
  
    // 獲取所有權限
    async getAllPermissions() {
      try {
        const response = await api.get('/Permission/test/get');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        throw error;
      }
    }
  };