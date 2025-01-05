<template>
  <div class="unit-container">
    <!-- 頁籤 -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link active" href="#">登錄紀錄管理</a>
      </li>
    </ul>

    <div class="content-wrapper">
      <div class="search-section">
        <!-- 添加權限檢查 -->
        <div v-if="canReadAllLoginRecords">
          <!-- 搜尋區塊 -->
          <div class="search-card">
            <div class="card w-100 mb-4 border-0">
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-12 col-md-6 col-lg-4">
                    <div class="form-floating">
                      <select class="form-select" id="floatingSelectGrid" v-model="loginDate">
                        <option selected value="">選擇時間</option>
                        <option value="1">一日</option>
                        <option value="7">一周</option>
                        <option value="30">一個月</option>
                        <option value="90">三個月</option>
                      </select>
                      <label for="floatingSelectGrid">時間查詢</label>
                    </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-4">
                    <div class="form-floating">
                      <select class="form-select" id="statusSelect" v-model="loginStatus">
                        <option value="">全部狀態</option>
                        <option value="成功">成功</option>
                        <option value="失敗">失敗</option>
                      </select>
                      <label for="statusSelect">狀態查詢</label>
                    </div>
                  </div>
                  <!-- 添加重置按鈕 -->
                  <div class="col-12 col-md-auto">
                    <button type="button" class="btn search-btn w-150" v-on:click="resetSearch">
                      <font-awesome-icon :icon="['fas', 'rotate']" size="lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- 員工資料表格 -->
          <div class="table-responsive">
            <table class="table">
              <thead class="table-secondary">
                <tr>
                  <th>員工ID</th>
                  <th>員工姓名</th>
                  <th>登錄ip位址</th>
                  <th>登錄時間</th>
                  <th>登出時間</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in filteredRecords">
                  <td>{{ record.employee_id }}</td>
                  <!-- 後端傳回來的 LoginRecord 沒有employeeName -->
                  <!-- <td>{{ record.name }}</td> -->
                  <td>{{ record.employee && record.employee.name ? record.employee.name : '-' }}</td>
                  <td>{{ record.ip_address }}</td>
                  <td>{{ record.login_time }}</td>
                  <td>{{ record.logout_time }}</td>
                  <td>
                    <span class="status-badge" :class="{
                      'status-success': record.status === '成功',
                      'status-failed': record.status === '失敗'
                    }">
                      {{ record.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { PERMISSIONS } from '@/constants/permissions'

library.add(faUserPlus, faPenToSquare);

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      loginRecords: [],
      loginStatus: "",
      loginDate: "",
      currentUserId: null
    }
  },
  methods: {
    formatDateTime(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    resetSearch() {
      this.loginDate = "";
      this.loginStatus = "";
      this.getLoginRecords();
    },
    async getLoginRecords() {
      try {
        // 檢查權限
        if (!this.canReadAllLoginRecords) {
          console.error('無權限讀取登錄記錄');
          return;
        }

        const token = localStorage.getItem('JWT_Token')
        const permissions = this.$store.getters['auth/userPermissions'];

        if (!token) {
          console.error('找不到登入令牌');
          return;
        }

        let response = await fetch("http://localhost:8085/api/loginRecord/get", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            console.error('權限不足');
          } else {
            console.error('獲取資料失敗:', response.status);
          }
          return;
        }

        const data = await response.json();
        console.log('後端返回的數據:', data);
        this.loginRecords = data;
      } catch (error) {
        console.error('Error fetching login records:', error);
      }
    },
  },
  computed: {
    filteredRecords() {
      if (!this.loginRecords) return [];

      let filtered = [...this.loginRecords];

      // 狀態篩選
      if (this.loginStatus) {
        filtered = filtered.filter(record => record.status === this.loginStatus);
      }

      // 日期篩選
      if (this.loginDate) {
        const now = new Date();
        const days = parseInt(this.loginDate);
        const cutoff = new Date(now - days * 24 * 60 * 60 * 1000);

        filtered = filtered.filter(record => {
          const recordDate = new Date(record.login_time);
          return recordDate >= cutoff;
        });

        // 日期格式化顯示
        filtered = filtered.map(record => ({
          ...record,
          login_time: this.formatDateTime(record.login_time),
          logout_time: record.logout_time ? this.formatDateTime(record.logout_time) : '-'
        }));
      }

      // 按日期降序排序（最新的在上面）
      filtered.sort((a, b) => {
        return new Date(b.login_time) - new Date(a.login_time);
      });

      return filtered;
    },
    // 權限檢查
    canReadAllLoginRecords() {
      return this.$store.getters['auth/hasPermission'](PERMISSIONS.RECORD.READ)
    },
  },
  created() {
    this.getLoginRecords()
  }
}

</script>

<style scoped>
.unit-container {
  position: relative;
  width: 100%;
  overflow-x: hidden;
}

@media (min-width: 768px) {
  .unit-container {
    padding: 20px;
  }
}

.content-wrapper {
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}

@media (min-width: 768px) {
  .content-wrapper {
    padding: 1.5rem;
    margin: 20px 20px 20px 0;
  }
}

.search-section {
  position: relative;
  width: 100%;
  z-index: 1; /* 確保搜尋區域在正確的層級 */
}

.search-card {
  position: relative;
  width: 100%;
}

.content-wrapper {
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}

@media (min-width: 768px) {
  .content-wrapper {
    padding: 1.5rem;
    margin: 20px 20px 20px 0;
  }
}

.search-section {
  position: relative;
  width: 100%;
  z-index: 1; /* 確保搜尋區域在正確的層級 */
}

.search-card {
  position: relative;
  width: 100%;
}

.nav-tabs .nav-link {
  color: #334255;
  border: none;
  padding: 10px 20px;
}

.nav-tabs .nav-link.active {
  color: #334255;
  font-weight: bold;
  border-bottom: 2px solid #334255;
}

.search-btn {
  background-color: #334255;
  border-color: #334255;
  padding: 0.75rem;
  transition: all 0.1s ease;
  color: #fff;
  height: 58px;
}

@media (max-width: 767px) {
  .search-btn {
    width: 100%;
    margin-top: 0.5rem;
  }
}

.search-btn:hover {
  background-color: #FFCD50;
  border-color: #FFCD50;
  color: #334255;
}

.table {
  border-collapse: separate;
  border-spacing: 0;
}

.table th {
  background-color: #f0f0f0;
  padding: 12px;
  text-align: center;
  font-weight: normal;
}

.table td {
  padding: 12px;
  text-align: center;
  vertical-align: middle;
}

/* 表格響應式調整 */
.table-responsive {
  margin-top: 1rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 767px) {
  .table th,
  .table td {
    padding: 8px;
    font-size: 0.9rem;
  }
  
  .status-badge {
    padding: 3px 8px;
    font-size: 0.8rem;
    min-width: 60px;
  }
}

/* 卡片響應式調整 */
.card {
  background: transparent;
}

.card-body {
  padding: 1rem;
}

@media (max-width: 767px) {
  .card-body {
    padding: 0.75rem;
  }
}

/* Form 響應式調整 */
.form-floating {
  margin-bottom: 0;
}

@media (max-width: 767px) {
  .form-floating > label {
    font-size: 0.9rem;
  }
  
  .form-select {
    font-size: 0.9rem;
  }
}

.btn-link {
  color: #334255;
}

.btn-link:hover {
  color: #FFCD50;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 0.9rem;
  display: inline-block;
  min-width: 80px;
}

.status-success {
  background-color: #E8F5E9;
  color: #2E7D32;
  border: 1px solid #A5D6A7;
}

.status-failed {
  background-color: #FFEBEE;
  color: #C62828;
  border: 1px solid #FFCDD2;
}
</style>