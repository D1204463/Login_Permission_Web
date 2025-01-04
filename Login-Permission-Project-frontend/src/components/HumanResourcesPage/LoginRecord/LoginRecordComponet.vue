<template>
  <div class="unit-container">
    <!-- 頁籤 -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link active" href="#">登錄紀錄管理</a>
      </li>
    </ul>

    <div class="content-wrapper">
      <div class="row g-3 align-items-center">
        <!-- 添加權限檢查 -->
        <div v-if="canReadAllLoginRecords">
          <!-- 搜尋區塊 -->
          <div class="col">
            <div class="card w-100 mb-4 border-0">
              <div class="card-body">
                <div class="row g-3 align-items-center">
                  <div class="col-md">
                    <div class="form-floating">
                      <select class="form-select" id="floatingSelectGrid" v-model="loginDate">
                        <option selected value="">選擇時間</option>
                        <option value="1">一日</option>
                        <option value="7">一周</option>
                        <option value="30">一周以上</option>
                      </select>
                      <label for="floatingSelectGrid">時間查詢</label>
                    </div>
                  </div>
                  <div class="col-md">
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
                  <div class="col-auto d-flex align-items-center">
                    <button type="button" class="btn btn-secondary search-btn" v-on:click="resetSearch">
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
                  <td>{{ record.name }}</td>
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

        let response = await fetch("http://localhost:8085/api/loginRecord/get", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) {
          console.error('權限不足');
          return;
        }

        const data = await response.json();
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
  padding: 20px;
}

.content-wrapper {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0 1.5rem;
  margin-right: 1.5%;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  height: 58px;
  width: 58px;
}

.search-btn:hover {
  background-color: #FFCD50;
  border-color: #FFCD50;
  color: #334255;
}

.add-unit-btn {
  background-color: transparent;
  color: #334255;
  border: none;
  display: flex;
  align-items: center;
  /* padding: 8px 16px; */
  font-size: 1rem;
}

.add-unit-btn:hover {
  color: #FFCD50;
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