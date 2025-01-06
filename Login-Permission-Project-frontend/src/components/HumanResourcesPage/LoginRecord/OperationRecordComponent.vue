<template>
  <div class="content-wrapper">
    <div class="search-section">
      <div v-if="canReadOperationLogs">
        <!-- 搜尋區塊 -->
        <div class="search-card">
          <div class="card w-100 mb-4 border-0">
            <div class="card-body">
              <div class="row g-3">
                <!-- 開始時間 -->
                <div class="col-12 col-md-6 col-lg-3">
                  <div class="form-floating">
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="startTime"
                      v-model="searchParams.startTime"
                    />
                    <label for="startTime">開始時間</label>
                  </div>
                </div>

                <!-- 結束時間 -->
                <div class="col-12 col-md-6 col-lg-3">
                  <div class="form-floating">
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="endTime"
                      v-model="searchParams.endTime"
                    />
                    <label class="flex items-center" for="endTime"
                      >結束時間</label
                    >
                  </div>
                </div>

                <!-- 操作類型 -->
                <div class="col-12 col-md-6 col-lg-2">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="operationType"
                      v-model="searchParams.operationType"
                    >
                      <option value="">全部類型</option>
                      <option value="新增">新增</option>
                      <option value="修改">修改</option>
                      <option value="刪除">刪除</option>
                      <option value="查詢">查詢</option>
                    </select>
                    <label for="operationType">操作類型</label>
                  </div>
                </div>

                <!-- 功能模組 -->
                <div class="col-12 col-md-6 col-lg-2">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="module"
                      v-model="searchParams.module"
                    >
                      <option value="">全部模組</option>
                      <option value="使用者管理">使用者管理</option>
                      <option value="角色管理">角色管理</option>
                      <option value="權限管理">權限管理</option>
                      <option value="操作日誌">操作日誌</option>
                    </select>
                    <label for="module">功能模組</label>
                  </div>
                </div>

                <!-- 按鈕 -->
                <div class="col-12 col-md-auto">
                  <div class="d-flex gap-2">
                    <button
                      type="button"
                      class="btn search-btn"
                      @click="searchLogs"
                    >
                      <font-awesome-icon :icon="['fas', 'search']" />
                    </button>
                    <button
                      type="button"
                      class="btn search-btn"
                      @click="resetSearch"
                    >
                      <font-awesome-icon :icon="['fas', 'rotate']" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作記錄表格 -->
        <div class="table-responsive" style="overflow-x: auto">
          <table class="table">
            <thead class="table-secondary">
              <tr>
                <th>用戶ID</th>
                <th>用戶名稱</th>
                <th>操作類型</th>
                <th>功能模組</th>
                <th>操作描述</th>
                <th>操作結果</th>
                <th>IP位址</th>
                <th>操作時間</th>
                <th>詳細資訊</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in operationLogs" :key="record.id">
                <td>{{ record.userId }}</td>
                <td>{{ record.username }}</td>
                <td>
                  <span
                    class="operation-type"
                    :class="getOperationTypeClass(record.operationType)"
                  >
                    {{ record.operationType }}
                  </span>
                </td>
                <td>{{ record.module }}</td>
                <td>{{ record.description }}</td>
                <td>
                  <span
                    class="status-badge"
                    :class="{
                      'status-success': record.operationResult === '成功',
                      'status-failed': record.operationResult === '失敗',
                    }"
                  >
                    {{ record.operationResult }}
                  </span>
                </td>
                <td>{{ record.ipAddress }}</td>
                <td>{{ formatDateTime(record.operationTime) }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-link p-0"
                    @click="setSelectedRecord(record)"
                    v-if="record.beforeValue || record.afterValue"
                  >
                    <font-awesome-icon :icon="['fas', 'circle-info']" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分頁控制 -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div class="d-flex align-items-center gap-3">
            <!-- 新增顯示行數選擇器 -->
            <div class="d-flex align-items-center">
              <span class="me-2">顯示筆數：</span>
              <select
                class="form-select form-select-sm"
                v-model="pageSize"
                @change="handlePageSizeChange"
                style="width: auto"
              >
                <option
                  v-for="size in pageSizeOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>
            <div class="text-muted">共 {{ totalItems }} 筆資料</div>
          </div>

          <nav aria-label="Page navigation">
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 0 }">
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(currentPage - 1)"
                >
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li
                v-for="page in displayedPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <a class="page-link" href="#" @click.prevent="changePage(page)">
                  {{ page + 1 }}
                </a>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages - 1 }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(currentPage + 1)"
                >
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- 自定義 Modal -->
        <div class="custom-modal" v-if="isShow">
          <!-- 背景遮罩 -->
          <div class="custom-modal-backdrop" @click="closeModal"></div>

          <!-- Modal 內容 -->
          <div
            class="custom-modal-dialog"
            role="dialog"
            aria-labelledby="customModalLabel"
          >
            <div class="custom-modal-content">
              <!-- 標題區 -->
              <div class="custom-modal-header">
                <h5 class="custom-modal-title" id="customModalLabel">
                  操作詳細資訊
                </h5>
                <button
                  type="button"
                  class="custom-modal-close"
                  @click="closeModal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <!-- 內容區 -->
              <div class="custom-modal-body">
                <div v-if="selectedRecord">
                  <div class="mb-4">
                    <h6 class="fw-bold mb-2">變更後:</h6>
                    <div class="bg-light p-3 rounded">
                      <pre v-if="selectedRecord.beforeValue" class="mb-0">
                          <code>{{ formatJson(selectedRecord.beforeValue) }}</code>
                        </pre>
                      <span v-else class="text-muted fst-italic">null</span>
                    </div>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-2">結果訊息:</h6>
                    <div class="bg-light p-3 rounded">
                      <pre v-if="selectedRecord.afterValue" class="mb-0">
                          <code>{{ formatJson(selectedRecord.afterValue) }}</code>
                        </pre>
                      <span v-else class="text-muted fst-italic">null</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 底部按鈕區 -->
              <div class="custom-modal-footer">
                <button
                  type="button"
                  class="custom-btn custom-btn-secondary"
                  @click="closeModal"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faRotate,
  faSearch,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { PERMISSIONS } from "@/constants/permissions";

library.add(faRotate, faSearch, faCircleInfo);

export default {
  name: "OperationRecordComponent",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      operationLogs: [],
      selectedRecord: null,
      currentPage: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      searchParams: {
        startTime: "",
        endTime: "",
        operationType: "",
        module: "",
        userId: "",
      },
      isShow: false,
      pageSizeOptions: [10, 20, 50, 100],
    };
  },
  computed: {
    canReadOperationLogs() {
      return this.$store.getters["auth/hasPermission"]("rec_audit_log_read");
    },
    displayedPages() {
      const pages = [];
      const maxPages = 5; // 最多顯示5個頁碼
      let start = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
      let end = Math.min(this.totalPages, start + maxPages);

      if (end - start < maxPages) {
        start = Math.max(0, end - maxPages);
      }

      for (let i = start; i < end; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    formatDateTime(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Taipei",
      }).format(date);
    },

    getOperationTypeClass(type) {
      const classMap = {
        新增: "type-create",
        修改: "type-update",
        刪除: "type-delete",
        查詢: "type-query",
      };
      return classMap[type] || "";
    },

    formatJson(jsonString) {
      try {
        if (!jsonString) return "";
        const obj =
          typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
        return JSON.stringify(obj, null, 2);
      } catch (e) {
        return jsonString;
      }
    },

    handlePageSizeChange() {
      this.currentPage = 0; // 重置到第一頁
      this.searchLogs(); // 重新獲取數據
    },

    async searchLogs() {
      try {
        const params = new URLSearchParams();

        // 處理時間格式
        if (this.searchParams.startTime) {
          // 確保時間是在正確的時區
          const startTime = new Date(this.searchParams.startTime);
          const timeStr = startTime
            .toLocaleString("sv", { timeZone: "Asia/Taipei" })
            .replace(" ", "T");
          params.append("startTime", timeStr);
        }

        if (this.searchParams.endTime) {
          const endTime = new Date(this.searchParams.endTime);
          const timeStr = endTime
            .toLocaleString("sv", { timeZone: "Asia/Taipei" })
            .replace(" ", "T");
          params.append("endTime", timeStr);
        }

        // 其他參數
        if (this.searchParams.operationType) {
          params.append("operationType", this.searchParams.operationType);
        }
        if (this.searchParams.module) {
          params.append("module", this.searchParams.module);
        }

        params.append("page", this.currentPage);
        params.append("size", this.pageSize);

        const token = localStorage.getItem("JWT_Token");
        const baseUrl = "http://localhost:8085";

        const response = await fetch(
          `${baseUrl}/api/logs/search?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // 添加更詳細的錯誤信息
          const errorBody = await response.text();
          toast.error("Response error:", errorBody);
          throw new Error(
            `HTTP error! status: ${response.status}, body: ${errorBody}`
          );
        }

        const data = await response.json();
        if (data.message === "查詢成功") {
          this.operationLogs = data.data.content;
          this.totalItems = data.data.totalItems;
          this.totalPages = data.data.totalPages;
          this.currentPage = data.data.currentPage;
        } else {
          throw new Error(data.message || "取得數據失敗");
        }
      } catch (error) {
        toast.error("取得數據失敗");
      }
    },

    // 重置搜尋時也要處理時間
    resetSearch() {
      this.searchParams = {
        startTime: "",
        endTime: "",
        operationType: "",
        module: "",
        userId: "",
      };
      this.currentPage = 0;
      this.searchLogs();
    },

    changePage(page) {
      if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
        this.searchLogs();
      }
    },

    showModal() {
      this.isShow = true;
      document.body.style.overflow = "hidden"; // 防止背景滾動
    },
    closeModal() {
      this.isShow = false;
      document.body.style.overflow = ""; // 恢復背景滾動
    },

    setSelectedRecord(record) {
      this.selectedRecord = record;
      this.showModal();
    },
  },
  mounted() {
    this.searchLogs();
  },
  beforeDestroy() {
    // 組件銷毀時確保清理樣式
    document.body.style.overflow = "";
  },
};
</script>

<style scoped>
/* 基礎布局 */
.content-wrapper {
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  position: relative;
  z-index: 0;
}

.search-section {
  position: relative;
  width: 100%;
  z-index: 0;
}

.search-card {
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
}

/* 搜尋按鈕 */
.search-btn {
  background-color: #334255;
  border-color: #334255;
  padding: 0.75rem;
  transition: all 0.2s ease;
  color: #fff;
  height: 42px !important;
  width: 42px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background-color: #ffcd50;
  border-color: #ffcd50;
  color: #334255;
}

/* 表單控制項 */
.form-floating > .form-control,
.form-floating > .form-select {
  height: 42px !important;
  padding-top: 1.625rem !important;
  padding-bottom: 0.625rem !important;
}

.form-floating > label {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.875rem !important;
  transform: translateY(-0.5rem) !important;
}

.form-control:focus,
.form-select:focus {
  border-color: #334255;
  box-shadow: 0 0 0 0.25rem rgba(51, 66, 85, 0.25);
}

/* 表格樣式 */
.table-responsive {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.table {
  margin-bottom: 0;
  width: 100%;
  background-color: #ffffff;
  border-collapse: separate;
  border-spacing: 0;
}

.table thead th {
  background-color: #f8f9fa;
  color: #334255;
  font-weight: 600;
  padding: 1rem;
  text-align: center;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

/* 操作類型標籤 */
.operation-type {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
  min-width: 80px;
}

.type-create {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.type-update {
  background-color: #e3f2fd;
  color: #1565c0;
}

.type-delete {
  background-color: #ffebee;
  color: #c62828;
}

.type-query {
  background-color: #f3e5f5;
  color: #6a1b9a;
}

/* 狀態標籤 */
.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
  min-width: 80px;
}

.status-success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.status-failed {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

/* 分頁控制 */
.pagination {
  margin-bottom: 0;
}

.pagination .page-link {
  color: #334255;
  padding: 0.5rem 0.75rem;
  min-width: 38px;
  text-align: center;
  border: 1px solid #dee2e6;
}

.pagination .page-item.active .page-link {
  background-color: #334255;
  border-color: #334255;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

/* 保持原有的詳細資訊相關樣式 */
.bg-light {
  background-color: #f8f9fa;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

code {
  color: #333;
  font-family: monospace;
}

.content-wrapper {
  position: relative;
  z-index: 1; /* 給定較小的正數值 */
}

/* 詳細資訊內容 */
.details-content {
  background-color: white;
}

.detail-item {
  margin-bottom: 1.5rem;
}

.detail-label {
  color: #333;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.detail-value-wrapper {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 0.75rem;
}

.detail-value {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
  font-size: 0.875rem;
  color: #333;
  background-color: transparent;
  border: none;
  padding: 0;
}

.text-muted {
  color: #6c757d;
  font-style: italic;
}

/* 按鈕樣式 */
.btn-link {
  color: #334255;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
}

.btn-link:hover {
  color: #ffcd50;
}

/* 響應式設計 */
@media (max-width: 991.98px) {
  .content-wrapper {
    padding: 0.75rem;
  }

  .table thead th,
  .table tbody td {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .operation-type,
  .status-badge {
    padding: 0.3rem 0.6rem;
    font-size: 0.8125rem;
    min-width: 70px;
  }
}

@media (max-width: 767.98px) {
  .search-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  .form-floating > label {
    font-size: 0.875rem;
  }

  .pagination .page-link {
    padding: 0.375rem 0.5rem;
    min-width: 32px;
    font-size: 0.875rem;
  }
}

/* 動畫效果 */
.table tbody tr,
.search-btn,
.btn-link,
.page-link {
  transition: all 0.2s ease;
}

.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.custom-modal-dialog {
  position: relative;
  width: auto;
  max-width: 800px; /* 可根據需要調整 */
  margin: 1.75rem;
  z-index: 1050;
}

.custom-modal-content {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: modalShow 0.3s ease-out;
}

.custom-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 2px solid #ffcd50;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.custom-modal-title {
  margin: 0;
  color: #334255;
  font-weight: 600;
  font-size: 1.25rem;
}

.custom-modal-close {
  padding: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #000;
  opacity: 0.5;
  cursor: pointer;
}

.custom-modal-close:hover {
  opacity: 0.75;
}

.custom-modal-body {
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
}

.custom-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.custom-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 400;
  text-align: center;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.custom-btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.custom-btn-secondary:hover {
  background-color: #5c636a;
  border-color: #565e64;
}

/* 動畫效果 */
@keyframes modalShow {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .custom-modal-dialog {
    margin: 0.5rem;
  }

  .custom-modal-content {
    max-height: calc(100vh - 1rem);
  }
}

.form-select-sm {
  padding-right: 2rem;
  background-position: right 0.5rem center;
  min-width: 80px;
}

.form-select-sm:focus {
  border-color: #334255;
  box-shadow: 0 0 0 0.25rem rgba(51, 66, 85, 0.25);
}
</style>
