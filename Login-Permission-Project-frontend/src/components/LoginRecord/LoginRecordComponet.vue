<template>
  <div class="unit-container">
    <!-- 頁籤 -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link active" href="#">人員管理</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">權限清單</a>
      </li>
    </ul>

    <div class="row g-2 mb-3">
      <!-- 新增人員按鈕 -->
      <div class="col-md">
        <button class="btn add-unit-btn">
          <font-awesome-icon :icon="['fas', 'user-plus']" class="me-2" />
          新增人員
        </button>
      </div>
      <div class="col-md">
        <div class="form-floating">
          <select class="form-select" id="floatingSelectGrid">
            <option selected>選擇部門</option>
            <option value="1">消金部</option>
            <option value="2">管理部</option>
          </select>
          <label for="floatingSelectGrid">查詢</label>
        </div>
      </div>
      <div class="col-md">
        <div class="form-floating">
          <select class="form-select" id="floatingSelectGrid">
            <option selected>選擇科別</option>
            <option value="1">台幣科</option>
            <option value="2">外幣科</option>
            <option value="3">資訊科</option>
            <option value="4">財務科</option>
          </select>
          <label for="floatingSelectGrid">查詢</label>
        </div>
      </div>
      <div class="col-md">
        <div class="form-floating">
          <select class="form-select" id="floatingSelectGrid">
            <option selected>選擇職位</option>
            <option value="1">部長</option>
            <option value="2">科長</option>
            <option value="3">專員</option>
          </select>
          <label for="floatingSelectGrid">查詢</label>
        </div>
      </div>
      <div class="col-md">
        <div class="form-floating">
          <select class="form-select" id="floatingSelectGrid">
            <option selected>狀態</option>
            <option value="1">在職</option>
            <option value="2">離職</option>
            <option value="3">留職停薪</option>
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
          <th>編輯</th>
          <th>員工編號</th>
          <th>員工姓名</th>
          <th>部門</th>
          <th>科別</th>
          <th>職位</th>
          <th>狀態</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <button class="btn btn-link p-0">
              <font-awesome-icon :icon="['fas', 'pen-to-square']" />
            </button>
          </td>
          <td>001</td>
          <td>王大名</td>
          <td>消金部</td>
          <td>台幣科</td>
          <td>台幣專員</td>
          <td>在職</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script  >

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserPlus, faPenToSquare);

export default {
  components: {
    FontAwesomeIcon
  }
};

</script>

<style scoped>
.unit-container {
  /* padding: 20px; */
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
</style>