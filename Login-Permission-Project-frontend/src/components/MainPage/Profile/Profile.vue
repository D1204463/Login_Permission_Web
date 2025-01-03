<template>
  <div class="profile-container p-4">
    <div class="card" style="margin-bottom: 30px;">
      <!-- 個人資料頁頭部 -->
      <div class="profile-header text-center p-4">
        <div class="avatar-container mb-3">
          <font-awesome-icon 
            :icon="['fas', 'circle-user']" 
            size="5x" 
            class="avatar-icon"
          />
        </div>
        <h4 class="user-name mb-2">{{ userName || '使用者' }}</h4>
        <span class="user-position">{{ employeePosition || '職位未設定' }}</span>
      </div>

      <!-- 分隔線 -->
      <div class="divider">
        <span class="divider-text">個人資料</span>
      </div>

      <!-- 個人資料表單 -->
      <div class="card-body pb-4">
        <div class="row g-4">
          <!-- 左側資料 -->
          <div class="col-md-6">
            <div class="info-group">
              <div class="info-label">
                <font-awesome-icon :icon="['fas', 'id-card']" class="me-2" />
                員工編號
              </div>
              <input type="text" class="form-control custom-input" :value="userId" readonly>
            </div>

            <div class="info-group">
              <div class="info-label">
                <font-awesome-icon :icon="['fas', 'user']" class="me-2" />
                員工姓名
              </div>
              <input type="text" class="form-control custom-input" :value="userName" readonly>
            </div>

            <div class="info-group">
              <div class="info-label">
                <font-awesome-icon :icon="['fas', 'envelope']" class="me-2" />
                電子郵件
              </div>
              <input type="email" class="form-control custom-input" :value="userEmail" readonly>
            </div>
          </div>

          <!-- 右側資料 -->
          <div class="col-md-6">
            <div class="info-group">
              <div class="info-label">
                <font-awesome-icon :icon="['fas', 'building']" class="me-2" />
                部門
              </div>
              <input type="text" class="form-control custom-input" :value="employeeDepartment" readonly>
            </div>

            <div class="info-group">
              <div class="info-label">
                <font-awesome-icon :icon="['fas', 'briefcase']" class="me-2" />
                職位
              </div>
              <input type="text" class="form-control custom-input" :value="employeePosition" readonly>
            </div>

            <div class="info-group">
              <div class="info-label">
                <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />
                聯絡電話
              </div>
              <input type="tel" class="form-control custom-input" :value="userPhone" readonly>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <!-- 新增登入紀錄卡片 -->
    <div class="card">
      <!-- 分隔線 -->
      <div class="divider">
        <span class="divider-text">
          <font-awesome-icon :icon="['fas', 'clock-rotate-left']" class="me-2" />
          最近登入紀錄
        </span>
      </div>

      <!-- 登入紀錄表格 -->
<!--      <div class="card-body pb-4">-->
<!--        <div class="table-responsive">-->
<!--          <table class="table table-hover login-record-table">-->
<!--            <thead>-->
<!--              <tr>-->
<!--                <th class="text-center" style="width: 30%">登入時間</th>-->
<!--                <th class="text-center" style="width: 30%">登出時間</th>-->
<!--                <th class="text-center" style="width: 25%">IP位址</th>-->
<!--                <th class="text-center" style="width: 15%">狀態</th>-->
<!--              </tr>-->
<!--            </thead>-->
<!--            <tbody>-->
<!--              <tr v-for="record in loginRecords" :key="record.record_id">-->
<!--                <td class="text-center">{{ record.login_time }}</td>-->
<!--                <td class="text-center">{{ record.logout_time || '-' }}</td>-->
<!--                <td class="text-center">{{ record.ip_address }}</td>-->
<!--                <td class="text-center">-->
<!--                  <span class="status-badge" :class="record.status === 'success' ? 'success' : 'error'">-->
<!--                    {{ record.status === 'success' ? '成功' : '失敗' }}-->
<!--                  </span>-->
<!--                </td>-->
<!--              </tr>-->
<!--            </tbody>-->
<!--          </table>-->
<!--        </div>-->
<!--      </div>-->
      <div class="card-body pb-4">
        <div class="table-responsive login-record-container">
          <table class="table table-hover login-record-table">
            <thead>
            <tr>
              <th class="text-center" style="width: 30%">登入時間</th>
              <th class="text-center" style="width: 30%">登出時間</th>
              <th class="text-center" style="width: 25%">IP位址</th>
              <th class="text-center" style="width: 15%">狀態</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="record in loginRecords" :key="record.record_id">
              <td class="text-center">{{ record.login_time }}</td>
              <td class="text-center">{{ record.logout_time || '-' }}</td>
              <td class="text-center">{{ record.ip_address }}</td>
              <td class="text-center">
            <span class="status-badge" :class="record.status === 'success' ? 'success' : 'error'">
              {{ record.status === 'success' ? '成功' : '失敗' }}
            </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {computed, onMounted} from 'vue'
import {useStore} from 'vuex'
import {getLoginRecord} from "@/utils/loginRecordUtils.js";

export default {
  name: 'UserInfo',
  setup() {
    const store = useStore();

    // 使用 computed 從 Vuex store 獲取用戶資料
    const userId = computed(() => store.getters['auth/userId']);
    const userName = computed(() => store.getters['auth/userName']);
    const userEmail = computed(() => store.state.auth.userInfo.userEmail);
    const userPhone = computed(() => store.state.auth.userInfo.userPhone);
    const employeeDepartment = computed(() => store.state.auth.userInfo.employeeDepartment);
    const employeePosition = computed(() => store.state.auth.userInfo.employeePosition);
    const loginRecords = computed(() => store.state.auth.userInfo.loginRecords);

    // 在組件掛載時獲取登入紀錄
    onMounted(async () => {
      try {
        await store.dispatch('auth/getLoginRecord');
      } catch (error) {
        console.error('Failed to fetch login records:', error);
      }
    });

    return {
      userId,
      userName,
      userEmail,
      userPhone,
      employeeDepartment,
      employeePosition,
      loginRecords,
    };
  },
  created() {
      this.getLoginRecordById();
  },
  methods: {
    async getLoginRecordById() {
      const token = localStorage.getItem('JWT_Token');
      const employee_id = this.$store.state.auth.userInfo.userId;
      console.log(employee_id)
      try{
        const response = await fetch (`http://localhost:8085/api/loginRecord/getLoginRecord/${employee_id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        });
        //撈取登錄紀錄id
        if(response.ok) {
          const responseBody = await response.json();
          const record = responseBody.data;
          this.$store.commit('auth/setLoginRecord', record);
          console.log("獲取登錄紀錄成功");
        } else {
          const data = await response.json();
          console.log("Data:", data);
        }
      }catch(error) {
        console.error("Request failed:", error);
      }
    }


  }
};




</script>

<style scoped>
.profile-container {
  animation: fadeIn 0.3s ease-out;
  max-width: 1000px;
  margin: 0 auto;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  overflow: hidden;
}

.profile-header {
  background: linear-gradient(135deg, #334255 0%, #2c3a4f 100%);
  color: white;
  padding: 2rem;
  position: relative;
}

.avatar-container {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #FFCD50;
}

.avatar-icon {
  color: #FFCD50;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.user-position {
  font-size: 1rem;
  opacity: 0.9;
}

.divider {
  position: relative;
  text-align: center;
  margin: 2rem 0;
}

.divider-text {
  background: white;
  padding: 0 1rem;
  color: #334255;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 20px;
  right: 20px;
  height: 1px;
  background: #e0e0e0;
  z-index: 0;
}

.info-group {
  margin-bottom: 1.5rem;
}

.info-label {
  color: #334255;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.custom-input {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  color: #495057;
  transition: all 0.3s ease;
}

.custom-input:read-only {
  background-color: #f8f9fa;
  cursor: default;
}

.custom-input:read-only:focus {
  box-shadow: none;
  border-color: #e0e0e0;
}

.btn-edit {
  background-color: #FFCD50;
  color: #334255;
  padding: 0.6rem 2rem;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
}

.btn-edit:hover {
  background-color: #ffd666;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 205, 80, 0.2);
}

/* 新增登入紀錄相關樣式 */
.login-record-table {
  margin-bottom: 0;
  font-size: 0.9rem;
}

.login-record-table thead th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #FFCD50;
  color: #334255;
  font-weight: 500;
  padding: 0.75rem;
}

.login-record-table tbody tr {
  transition: background-color 0.2s ease;
}

.login-record-table tbody tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.success {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.status-badge.error {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.table-responsive {
  max-height: 400px; /* 設置容器的最大高度 */
  overflow-y: auto; /* 啟用垂直滾動條 */
}

thead th {
  position: sticky; /* 固定位置 */
  top: 0; /* 固定在登錄記錄表格頂部 */
  z-index: 99; /* 調整 z-index，確保出現在畫面最頂層 */
}
/* 響應式設計 */
@media (max-width: 768px) {
  .profile-container {
    padding: 1rem !important;
  }

  .avatar-container {
    width: 100px;
    height: 100px;
  }

  .divider {
    margin: 1.5rem 0;
  }

  .card-body {
    padding: 1rem;
  }

  .login-record-table {
    font-size: 0.8rem;
  }

  .status-badge {
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
  }

}
</style>
