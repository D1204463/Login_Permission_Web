<template>
  <div class="unit-container">
    <!-- 頁籤 -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link active" href="#">登錄紀錄管理</a>
      </li>
    </ul>

    <div class="row g-2 mb-3">
      <div class="col-md">
        <div class="form-floating">
          <select class="form-select" id="floatingSelectGrid">
            <option selected>選擇時間</option>
            <option value="1">一日</option>
            <option value="2">一周</option>
            <option value="2">一周以上</option>
          </select>
          <label for="floatingSelectGrid">查詢</label>
        </div>
      </div>
      <div class="col-md">
        <div class="form-floating">
          <select class="form-select" id="floatingSelectGrid" v-model="loginStatus">
            <!-- <option selected>狀態</option> -->
            <option value="">全部狀態</option>
            <option value="成功">成功</option>
            <option value="失敗">失敗</option>
          </select>
          <label for="floatingSelectGrid">查詢</label>
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
            <td :class="{ 'text-red': record.status === '失敗', 'text-black': record.status === '成功' }">{{ record.status
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mapState } from "vuex";

library.add(faUserPlus, faPenToSquare);

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      loginStatus: "",
      loginDate: ""
    }
  },
  mounted() {
    this.$store.dispatch('auth/getLoginRecord');
    console.log("loginRecords:", this.$store.state.auth.loginRecords);
  },
  methods: {

  },
  computed: {
    ...mapState('auth', ['loginRecords']),

    filteredRecords() {
      if (!this.loginRecords) return [];
      if (!this.loginStatus) return this.loginRecords; // 如果沒選狀態，顯示全部
        return this.loginRecords.filter(record => {
          return record.status === this.loginStatus;
        });
      }
  },
}

</script>

<style scoped>
.unit-container {
  padding: 20px;
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

.text-red {
  color: red;
}

.text-black {
  color: black;
}
</style>