<template>
    <div class="status-management">
      <!-- 標籤 -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link active">員工狀態管理</a>
        </li>
      </ul>
  
      <div class="content-wrapper">
        <div class="row g-3 align-items-center">
          <!-- 新增狀態按鈕 -->
          <div class="col-auto">
            <button class="btn add-status-btn" style="margin-bottom:20px;" @click="openAddModal">
              <font-awesome-icon :icon="['fas', 'plus']" size="xl" class="me-2" />
              新增狀態
            </button>
          </div>
        </div>
  
        <!-- 狀態列表 -->
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th class="text-center">編輯</th>
                <th class="text-center">狀態ID</th>
                <th class="text-center">狀態名稱</th>
                <th class="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="status in statuses" :key="status.status_id">
                <td class="text-center">
                  <button class="btn btn-link" @click="openEditModal(status)">
                    <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                  </button>
                </td>
                <td class="text-center">{{ status.status_id }}</td>
                <td class="text-center">{{ status.name }}</td>
                <td class="text-center">
                    <button class="btn btn-link text-danger" @click="handleDelete(unit)">
                        <font-awesome-icon :icon="['fas', 'trash-can']" size="lg"/>
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 無資料提示 -->
          <div v-if="!isLoading && statuses.length === 0" class="text-center py-4">
            <p class="text-muted">暫無資料</p>
          </div>
        </div>
      </div>
  
      <!-- 新增/編輯狀態 Modal -->
      <div class="modal fade" :class="{ show: showModal }" v-if="showModal">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? '編輯狀態' : '新增狀態' }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" v-model="formData.name" required placeholder="狀態名稱" />
                  <label>狀態名稱</label>
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
  import axios from 'axios'
  
  // 初始化
  const statuses = ref([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const showModal = ref(false)
  const isEditing = ref(false)
  const formData = reactive({ status_id: '', name: '' })
  
  // 通知函數
  const notifySuccess = (message) => alert(message)
  const notifyError = (message) => alert(message)
  
  // 獲取狀態資料
  const fetchStatuses = async () => {
    try {
      isLoading.value = true
      const response = await axios.get('http://localhost:8085/status/test/get')
      statuses.value = response.data
    } catch (error) {
      notifyError('獲取狀態資料失敗')
    } finally {
      isLoading.value = false
    }
  }
  
  // 打開新增視窗
  const openAddModal = () => {
    isEditing.value = false
    formData.name = ''
    showModal.value = true
  }
  
  // 打開編輯視窗
  const openEditModal = (status) => {
    isEditing.value = true
    formData.status_id = status.status_id
    formData.name = status.name
    showModal.value = true
  }
  
  // 關閉視窗
  const closeModal = () => {
    showModal.value = false
    formData.status_id = ''
    formData.name = ''
  }
  
  // 提交表單
  const handleSubmit = async () => {
    if (!formData.name) {
      notifyError('請填寫狀態名稱')
      return
    }
  
    try {
      isSubmitting.value = true
      const url = isEditing.value
        ? `http://localhost:8085/status/test/edit`
        : `http://localhost:8085/status/test/add`
      await axios[isEditing.value ? 'put' : 'post'](url, formData)
      notifySuccess(`${isEditing.value ? '更新' : '新增'}狀態成功`)
      closeModal()
      fetchStatuses()
    } catch (error) {
      notifyError(`${isEditing.value ? '更新' : '新增'}狀態失敗`)
    } finally {
      isSubmitting.value = false
    }
  }
  
  // 刪除狀態
  const deleteStatus = async (statusId) => {
    if (!confirm('確定要刪除此狀態嗎？')) return
  
    try {
      await axios.delete(`http://localhost:8085/status/test/delete/${statusId}`)
      notifySuccess('刪除狀態成功')
      fetchStatuses()
    } catch (error) {
      notifyError('刪除狀態失敗')
    }
  }
  
  onMounted(fetchStatuses)
  </script>
  
  <style scoped>

  .content-wrapper {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 0 1.5rem; /* 只保留左右間距 */
    margin-right: 5%;
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

.add-status-btn {
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

.add-status-btn:hover {
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
    .unit-container {
        padding: 1rem;
    }

    .content-wrapper {
        padding: 1rem;
    }

    .row {
        row-gap: 1rem;
    }

    .add-status-btn {
        width: 100%;
        margin-bottom: 1rem;
    }
}
  </style>
  