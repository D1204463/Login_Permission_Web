<template>
  <div class="container" v-if="canReadStatus">
    <!-- 員工狀態管理頁籤 -->
    <ul class="nav nav-tabs mb-2">
      <li class="nav-item">
        <a class="nav-link active">員工狀態管理</a>
      </li>
    </ul>

    <div class="content-wrapper">
      <div class="row g-3 align-items-center">
        <!-- 新增狀態按鈕 -->
        <div class="col-auto">
          <button v-if="canCreateStatus" type="button" class="btn add-status-btn" style="margin-bottom: 20px"
            data-bs-toggle="modal" data-bs-target="#createStatusModal">
            <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
            新增狀態
          </button>
        </div>

        <div class="col">
          <div class="card w-100 mb-4 border-0">
            <div class="card-body">
              <!-- 搜尋表單，用於搜尋狀態 -->
              <div class="col">
                <form>
                  <div class="row g-3 align-items-center">
                    <div class="col-md">
                      <div class="form-floating">
                        <!-- 搜尋狀態 -->
                        <select class="form-select" id="statusSelect" v-model="searchByStatusId">
                          <option selected value="">選擇狀態</option>
                          <option v-for="status in statusOptions" :key="status.status_id" :value="status.status_id">
                            ({{ status.status_id }}) {{ status.name }}
                          </option>
                        </select>
                        <label for="statusSelect">狀態查詢</label>
                      </div>
                    </div>
                    <!-- 搜尋按鈕 -->
                    <div class="col-auto d-flex align-items-center">
                      <button type="button" class="btn btn-primary search-btn me-2" v-on:click="search">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="lg" />
                      </button>
                      <button type="button" class="btn btn-secondary search-btn" v-on:click="resetSearch">
                        <font-awesome-icon :icon="['fas', 'rotate']" size="lg" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 狀態資料表格 -->
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th class="text-center" style="width: 80px">編輯</th>
              <th class="text-center">狀態代號</th>
              <th class="text-center">狀態名稱</th>
              <th class="text-center" style="width: 80px">刪除</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="status in statuses" v-bind:key="status.status_id">
              <td class="text-center">
                <button v-if="canUpdateStatus" type="button" class="btn btn-link" data-bs-toggle="modal"
                  data-bs-target="#editStatusModal" v-on:click="onUpdateStatus(status)">
                  <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                </button>
              </td>
              <td class="text-center">{{ status.status_id }}</td>
              <td class="text-center">{{ status.name }}</td>
              <td class="text-center">
                <button v-if="canDeleteStatus" type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                  data-bs-target="#deleteStatusModal" v-on:click="onSelectStatus(status)">
                  <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- 新增狀態 Modal -->
  <div class="modal fade" id="createStatusModal" tabindex="-1" aria-labelledby="createStatusModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createStatusModalLabel">新增狀態</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <label for="addStatusId" class="form-label">狀態代號</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': validationErrors.newStatus.status_id }"
              id="addStatusId" v-model="newStatus.status_id" />
            <div class="invalid-feedback">{{ validationErrors.newStatus.status_id }}</div>
          </div>
          <div class="mb-3">
            <label for="addStatus" class="form-label">狀態名稱</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': validationErrors.newStatus.name }"
              id="addStatus" v-model="newStatus.name" />
            <div class="invalid-feedback">{{ validationErrors.newStatus.name }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-primary" v-on:click="createStatus">
              確定新增
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 編輯狀態 Modal -->
  <div class="modal fade" id="editStatusModal" tabindex="-1" aria-labelledby="editStatusModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editStatusModalLabel">編輯狀態</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="editStatusId" class="form-label">狀態代號</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': validationErrors.editStatus.status_id }"
              id="editStatusId" v-model="editStatus.status_id" />
            <div class="invalid-feedback">{{ validationErrors.editStatus.status_id }}</div>
          </div>
          <div class="mb-3">
            <label for="editStatus" class="form-label">狀態名稱</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': validationErrors.editStatus.name }"
              id="editStatus" v-model="editStatus.name" />
            <div class="invalid-feedback"> {{ validationErrors.editStatus.name }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-warning" data-bs-dismiss="modal" v-on:click="updateStatus">
              確定修改
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 刪除狀態 Modal -->
  <div class="modal fade" id="deleteStatusModal" tabindex="-1" aria-labelledby="deleteStatusModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteStatusModalLabel">刪除狀態</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">確定要刪除這個狀態嗎？此操作無法復原。</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" v-on:click="deleteStatus">
            確定刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrashCan,
  faMagnifyingGlass,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { PERMISSIONS } from '@/constants/permissions';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      statuses: [],
      statusOptions: [],
      searchByStatusId: "",
      newStatus: { name: "" },
      editStatus: { status_id: "", name: "" },
      selectedStatus: { status_id: "" },
      validationErrors: {
        newStatus: {
          status_id: "",
          name: ""
        },
        editStatus: {
          status_id: "",
          name: ""
        },
      },
    };
  },
  methods: {
    validateStatus(type) {
      const status = type === 'new' ? this.newStatus : this.editStatus;
      const errors = this.validationErrors[type === 'new' ? 'newStatus' : 'editStatus'];
      let isValid = true;

      // 驗證狀態代號
      if ( !status.status_id || !status.status_id.toString().trim()) {
        errors.status_id = '狀態代號不得為空';
        toast.error('狀態代號不得為空', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000
        });
        isValid = false;
      } else if (!/^\d+$/.test(status.status_id)) {
        errors.status_id = '狀態代號只能包含數字';
        toast.error('狀態代號只能包含數字', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000
        });
        isValid = false;
      } else {
        errors.status_id = '';
      }

      // 驗證狀態名稱
      if (!status.name.trim() || !status.name.trim()) {
        errors.name = '狀態名稱不得為空';
        toast.error('狀態名稱不得為空', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000
        });
        isValid = false;
      } else {
        errors.name = '';
      }

      return isValid;
    },

    clearValidationErrors() {
      this.validationErrors = {
        newStatus: {
          status_id: '',
          name: ''
        },
        editStatus: {
          status_id: '',
          name: ''
        }
      };
    },

    async fetchStatuses() {
      try {
        // 檢查讀取權限
        if (!this.canReadStatus) {
          console.error('無權限讀取狀態資料');
          return;
        }

        const token = localStorage.getItem('JWT_Token');
        const permissions = this.$store.getters['auth/userPermissions'];

        let response = await fetch("http://localhost:8085/status/test/get", {
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

        if (response.ok) {
          this.statuses = await response.json();
          this.statusOptions = this.statuses; // 確保選項正確綁定
          console.log("status Options:", this.statuses); // 檢查資料是否正確加載
        } else {
          console.log("failed to fetch status data");
        }
      } catch (error) {
        console.log("Error fetching statuses:", error);
      }
    },
    search() {
      // 根據 searchByStatusId 過濾狀態
      this.statuses = this.statusOptions.filter(
        (status) => status.status_id === this.searchByStatusId
      );
    },
    async resetSearch() {
      this.searchByStatusId = "";
      await this.fetchStatuses();
    },
    // 新增職位的邏輯
    async createStatus() {

      if (!this.validateStatus('new')) {
        console.log('驗證失敗');
        return;
      }

      if (!this.findDuplicateStatusId(this.newStatus)) {
        const requestBody = JSON.stringify(this.newStatus);
        console.log(this.newStatus);
        try {
          // 檢查創建權限
          if (!this.canCreateStatus) {
            toast.error('無權限新增狀態資料');
            return;
          }

          const token = localStorage.getItem('JWT_Token');
          const permissions = this.$store.getters['auth/userPermissions'];

          const response = await fetch("http://localhost:8085/status/test/add", {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: requestBody,
          });

          if (response.status === 403) {
            console.error('權限不足');
            return;
          }

          if (response.ok) {
            toast.success('新增狀態成功');
            await this.fetchStatuses();
            this.clearValidationErrors();
            this.newStatus = { status_id: "", name: "" };
            console.log("Fetch status successfully");
            const modal = document.getElementById('createStatusModal');
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
          } else {
            toast.error('新增狀態失敗');
            console.log("Fail to fetch status");
          }
        } catch (error) {
          toast.error('新增狀態時發生錯誤');
          console.log("Error fetching statuses:", error);
        }
      } else {
        alert("已經存在相同Id的狀態")
      }

    },
    onUpdateStatus(status) {
      this.clearValidationErrors();
      this.editStatus = { ...status };
    },
    async updateStatus() {
      if (!this.validateStatus('edit')) {
        return;
      }
      try {
        // 檢查更新權限
        if (!this.canUpdateStatus) {
          console.error('無權限修改狀態資料');
          return;
        }

        const token = localStorage.getItem('JWT_Token');
        const permissions = this.$store.getters['auth/userPermissions'];

        const response = await fetch("http://localhost:8085/status/test/edit", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.editStatus),
        });

        if (response.status === 403) {
          console.error('權限不足');
          return;
        }

        if (response.ok) {
          toast.success('修改狀態成功');
          await this.fetchStatuses();
        }
      } catch (error) {
        console.log("Error updating status:", error);
      }
    },

    onSelectStatus(status) {
      this.selectedStatus = status;
    },
    async deleteStatus() {
      try {
        // 檢查刪除權限
        if (!this.canDeleteStatus) {
          console.error('無權限刪除狀態資料');
          return;
        }

        const token = localStorage.getItem('JWT_Token');
        const permissions = this.$store.getters['auth/userPermissions'];

        const response = await fetch(
          `http://localhost:8085/status/test/delete/${this.selectedStatus.status_id}`,
          {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.status === 403) {
          console.error('權限不足');
          return;
        }

        if (response.ok) {
          await this.fetchStatuses();
        }
      } catch (error) {
        console.log("Error deleting status:", error);
      }
    },
    findDuplicateStatusId(newStatus) {
      for (let i = 0; i < this.statuses.length; i++) {
        if (String(this.statuses[i].status_id) === String(newStatus.status_id)) {
          console.log("This status id is already exist");
          return true;
        }
      }
      return false;
    }
  },

  mounted() {
    this.fetchStatuses();
  },

  computed: {
    // 權限控制
    canReadStatus() {
      return this.$store.getters['auth/hasPermission'](PERMISSIONS.STATUS.READ);
    },
    canCreateStatus() {
      return this.$store.getters['auth/hasPermission'](PERMISSIONS.STATUS.CREATE);
    },
    canUpdateStatus() {
      return this.$store.getters['auth/hasPermission'](PERMISSIONS.STATUS.UPDATE);
    },
    canDeleteStatus() {
      return this.$store.getters['auth/hasPermission'](PERMISSIONS.STATUS.DELETE);
    }
  },

};
</script>

<style scoped>
.content-wrapper {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0 1.5rem;
  /* 只保留左右間距 */
  margin-right: 5%;
  margin-top: 20px;
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

.btn-link {
  color: #334255;
  padding: 0.375rem;
  transition: all 0.2s ease;
}

.btn-link:hover {
  color: #ffcd50;
  transform: scale(1.1);
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
  background-color: #ffcd50;
  border-color: #ffcd50;
  color: #334255;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}
</style>
