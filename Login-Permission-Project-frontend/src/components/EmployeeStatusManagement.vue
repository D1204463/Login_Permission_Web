<template>
  <div class="container">
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
          <button
            type="button"
            class="btn add-status-btn"
            style="margin-bottom: 20px"
            data-bs-toggle="modal"
            data-bs-target="#createStatusModal"
          >
            <font-awesome-icon
              :icon="['fas', 'plus']"
              size="2xl"
              class="me-2"
            />
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
                        <select
                          class="form-select"
                          id="statusSelect"
                          v-model="searchByStatusId"
                        >
                          <option selected value="">選擇狀態</option>
                          <option
                            v-for="status in statusOptions"
                            :key="status.status_id"
                            :value="status.status_id"
                          >
                            ({{ status.status_id }}) {{ status.name }}
                          </option>
                        </select>
                        <label for="statusSelect">狀態查詢</label>
                      </div>
                    </div>
                    <!-- 搜尋按鈕 -->
                    <div class="col-auto d-flex align-items-center">
                      <button
                        type="button"
                        class="btn btn-primary search-btn me-2"
                        v-on:click="search"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'magnifying-glass']"
                          size="lg"
                        />
                      </button>
                      <button
                        type="button"
                        class="btn btn-secondary search-btn"
                        v-on:click="resetSearch"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'rotate']"
                          size="lg"
                        />
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
                <button
                  type="button"
                  class="btn btn-link"
                  data-bs-toggle="modal"
                  data-bs-target="#editStatusModal"
                  v-on:click="onUpdateStatus(status)"
                >
                  <font-awesome-icon
                    :icon="['fas', 'pen-to-square']"
                    size="lg"
                  />
                </button>
              </td>
              <td class="text-center">{{ status.status_id }}</td>
              <td class="text-center">{{ status.name }}</td>
              <td class="text-center">
                <button
                  type="button"
                  class="btn btn-link text-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteStatusModal"
                  v-on:click="onSelectStatus(status)"
                >
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
  <div
    class="modal fade"
    id="createStatusModal"
    tabindex="-1"
    aria-labelledby="createStatusModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createStatusModalLabel">新增狀態</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <label for="addStatusId" class="form-label">狀態代號</label>
            <input
              type="text"
              class="form-control"
              id="addStatusId"
              v-model="newStatus.status_id"
            />
          </div>
          <div class="mb-3">
            <label for="addStatus" class="form-label">狀態名稱</label>
            <input
              type="text"
              class="form-control"
              id="addStatus"
              v-model="newStatus.name"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              v-on:click="createStatus"
            >
              新增
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 編輯狀態 Modal -->
  <div
    class="modal fade"
    id="editStatusModal"
    tabindex="-1"
    aria-labelledby="editStatusModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editStatusModalLabel">編輯狀態</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="editStatusId" class="form-label">狀態代號</label>
            <input
              type="text"
              class="form-control"
              id="editStatusId"
              v-model="editStatus.status_id"
            />
          </div>
          <div class="mb-3">
            <label for="editStatus" class="form-label">狀態名稱</label>
            <input
              type="text"
              class="form-control"
              id="editStatus"
              v-model="editStatus.name"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-warning"
              data-bs-dismiss="modal"
              v-on:click="updateStatus"
            >
              更新
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 刪除狀態 Modal -->
  <div
    class="modal fade"
    id="deleteStatusModal"
    tabindex="-1"
    aria-labelledby="deleteStatusModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteStatusModalLabel">刪除狀態</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">確定要刪除此狀態嗎？</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            v-on:click="deleteStatus"
          >
            刪除
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
    };
  },
  methods: {
    async fetchStatuses() {
      try {
        let response = await fetch("http://localhost:8085/status/test/get");
        if(response.ok){
          this.statuses = await response.json();
          this.statusOptions = this.statuses; // 確保選項正確綁定
          console.log("status Options:" , this.statuses); // 檢查資料是否正確加載
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
      if(!this.findDuplicateStatusId(this.newStatus)) {
        const requestBody = JSON.stringify(this.newStatus);
        console.log(this.newStatus);
        try{
          const response = await fetch("http://localhost:8085/status/test/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: requestBody,
          })
          if(response.ok) {
            await this.fetchStatuses;
            console.log("Fetch status successfully");
          } else {
            console.log("Fail to fetch status");
          }
        } catch (error) {
          console.log("Error fetching statuses:", error);
        }
      } else {
        alert("已經存在相同Id的狀態")
      }



    },
    onUpdateStatus(status) {
      this.editStatus = { ...status };
    },
    updateStatus() {
      fetch("http://localhost:8085/status/test/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.editStatus),
      }).then(this.fetchStatuses);
    },
    onSelectStatus(status) {
      this.selectedStatus = status;
    },

    deleteStatus() {
      fetch(
        `http://localhost:8085/status/test/delete/${this.selectedStatus.status_id}`,
        {
          method: "DELETE",
        }
      ).then(this.fetchStatuses);
    },
    findDuplicateStatusId(newStatus){
      for(let i = 0; i < this.statuses.length; i ++) {
        if(String(this.statuses[i].status_id) === String(newStatus.status_id)) {
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
};
</script>

<style scoped>
.content-wrapper {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-tabs .nav-link {
  color: #334255;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}

.nav-tabs .nav-link.active {
  color: #334255;
  font-weight: 600;
  border-bottom: 2px solid #334255;
  background: none;
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
