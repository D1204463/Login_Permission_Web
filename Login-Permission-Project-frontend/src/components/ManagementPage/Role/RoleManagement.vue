<template>
        <!-- 角色管理內容 -->
        <div class="row g-3 align-items-center">
            <!-- 新增角色按鈕 -->
            <div class="col-auto">
                <button type="button" class="btn add-role-btn" style="margin-bottom:20px;" data-bs-toggle="modal"
                    data-bs-target="#createRoleModal">
                    <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
                    新增角色
                </button>
            </div>

            <!-- 角色搜尋欄位 -->
            <div class="col">
                <div class="card w-100 mb-4 border-0">
                    <div class="card-body">
                        <form>
                            <div class="row g-3 align-items-center">
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="roleId" v-model="searchByRoleId"
                                            placeholder="查詢角色編號">
                                        <label for="roleId">角色編號查詢</label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="roleName"
                                            v-model="searchByRoleName" placeholder="查詢角色名稱">
                                        <label for="roleName">角色名稱查詢</label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <select class="form-select" id="roleDepartmentSelect"
                                            v-model="searchByRoleDepartment">
                                            <option selected value="">選擇部門</option>
                                            <option v-for="dept in roleDepartments" :key="dept">{{ dept }}</option>
                                        </select>
                                        <label for="roleDepartmentSelect">部門查詢</label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- 角色資料表格 -->
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th class="text-center" style="width: 80px">編輯</th>
                        <th class="text-center">角色編號</th>
                        <th class="text-center">角色名稱</th>
<!--                    <th class="text-center">所屬部門</th>-->
                        <th class="text-center">權限列表</th>
                        <th class="text-center" style="width: 80px">刪除</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="role in filteredRoles" :key="role.role_id">
                      <td class="text-center">
                        <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                data-bs-target="#editRoleModal" @click="onEditRole(role)">
                          <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                        </button>
                      </td>
                      <td class="text-center">{{ role.role_id }}</td>
                      <td class="text-center">{{ role.role }}</td>
                      <td class="text-center">
                        <div class="dropdown">
                          <button class="btn btn-secondary btn-sm dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  @click="toggleDropdown($event)">
                            權限列表
                          </button>
                          <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <li v-for="(permission, index) in role.permissions" :key="permission.permission_id">
                              <span class="dropdown-item text-white" style="background-color: #334255"> {{ permission.permission_name }}</span>
                            </li>
                          </ul>
                        </div>
                      </td>
                      <td class="text-center">
                        <button type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                                data-bs-target="#deleteRoleModal" @click="onDeleteRole(role.role_id)">
                          <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                        </button>
                      </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 新增角色 Modal -->
        <div class="modal fade" id="createRoleModal" tabindex="-1" aria-labelledby="createRoleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createRoleModalLabel">新增角色</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="newRoleName" class="form-label">角色名稱</label>
                                <input type="text" class="form-control" id="newRoleName" v-model="newRole.name"
                                    required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">權限設定</label>
                                <div class="permission-checkboxes">
                                    <div class="form-check" v-for="perm in availablePermissions" :key="perm.permission_id">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            :id="'perm-' + perm.permission_id"
                                            :value="perm.permission_id"
                                            v-model="newRole.permissions">
                                        <label class="form-check-label" :for="'perm-' + perm">
                                          {{ perm.permission_name }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="createRole" data-bs-dismiss="modal">確認新增</button>
                    </div>
                </div>
            </div>
        </div>




        <!-- 編輯角色 Modal -->
        <div class="modal fade" id="editRoleModal" tabindex="-1" aria-labelledby="editRoleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editRoleModalLabel">編輯角色</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form v-if="selectedRole">

                          <!--head-->
                            <div class="mb-3">
                                <label for="editRoleName" class="form-label">角色名稱</label>
                                <input type="text" class="form-control" id="editRoleName" v-model="selectedRole.role"
                                    required>
                            </div>
                          <!--body-->
                            <div class="mb-3">
                                <label class="form-label">權限設定</label>
                                <div class="permission-checkboxes">
                                    <div class="form-check" v-for="perm in availablePermissions" :key="perm.permission_id">
                                        <input class="form-check-input"
                                               type="checkbox"
                                               :id="'edit-perm-' + perm"
                                               :value="perm"
                                               v-model="selectedRole.permissions">
                                        <label class="form-check-label" :for="'edit-perm-' + perm">
                                            {{ perm.permission_name }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-warning" @click="updateRole" data-bs-dismiss="modal">確認修改</button>
                    </div>
                </div>
            </div>
        </div>




        <!-- 刪除角色確認 Modal -->
        <div class="modal fade" id="deleteRoleModal" tabindex="-1" aria-labelledby="deleteRoleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteRoleModalLabel">確認刪除</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        確定要刪除這個角色嗎？此操作無法復原。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="deleteRole" data-bs-dismiss="modal">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faPlus,
    faPenToSquare,
    faTrashCan,
    faMagnifyingGlass,
    faRotate
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faPlus,
    faPenToSquare,
    faTrashCan,
    faMagnifyingGlass,
    faRotate
);

export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            // 角色管理相關數據
            newRole: {
                name: '',
                department: '',
                permissions: []
            },
            selectedRole: null,
            roleToDelete: null,
            availablePermissions: [],
            // 角色管理数据
            searchByRoleId: '',
            searchByRoleName: '',
            searchByRoleDepartment: '',
            roles: []
        };
    },
    computed: {
        // 角色管理的計算屬性
        roleDepartments() {
            return [...new Set(this.roles.map(role => role.department))];
        },
        filteredRoles() {
          return this.roles.filter(role => {
            // 確保 role_id 是字串類型
            const roleId = role.role_id ? String(role.role_id) : '';
            const roleIdMatch = roleId.toLowerCase().includes(this.searchByRoleId.toLowerCase());

            // 確保 role 是字串類型
            const roleName = role.role ? String(role.role) : '';
            const roleNameMatch = roleName.toLowerCase().includes(this.searchByRoleName.toLowerCase());

            return roleIdMatch && roleNameMatch;
          });
        }
    },
    methods: {
        resetSearch() {
            this.searchByRoleId = "";
            this.searchByRoleName = "";
            this.searchByRoleDepartment = "";
        },

        async createRole() {
            const roleDto = {
                roleName: this.newRole.name,
                permission_id: [...this.newRole.permissions]
            };
            try{
              const response = await  fetch("http://localhost:8085/role/create",{
                method:"POST",
                headers:{
                  "Content-Type":"application/json",
                  "Authorization": "Bearer " + localStorage.getItem("JWT_Token")
                },
                body:JSON.stringify(roleDto)
              });
              if(response.ok) {
                console.log("添加角色成功");
              } else {
                const errorData = await response.json();
                const errorMessage = errorData.message;
                console.log("添加角色失敗: " + errorMessage);
              }
            } catch(error) {
              console.log("送出添加角色請求失敗, 請檢查網路連接");
            }

            this.resetNewRole();
        },

        async updateRole() {
          const roleDto = {
            role_id:this.selectedRole.role_id,
            roleName:this.selectedRole.role,
            permission_id:this.selectedRole.permissions.map(permission => permission.permission_id)
          }
        try{
            const response = await  fetch("http://localhost:8085/role/edit",{
              method:"PUT",
              headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("JWT_Token")
              },
              body:JSON.stringify(roleDto)
            })
          if(response.ok) {
            alert("修改成功");
            await this.getAllRole();
          } else {
            const errorData = await response.json();
            console.log("修改失敗", errorData);
          }
        } catch(error) {
            console.log("發送修改請求失敗, 請檢查網路連接");

        }

            this.selectedRole = null;
        },

        deleteRole() {
            if (this.roleToDelete) {
                const index = this.roles.findIndex(r => r.id === this.roleToDelete);
                if (index !== -1) {
                    this.roles.splice(index, 1);
                }
                this.closeModal('deleteRoleModal');
                this.roleToDelete = null;
            }
        },toggleDropdown(event) {
        const dropdown = new bootstrap.Dropdown(event.target)
        dropdown.toggle()
      },

        resetNewRole() {
            this.newRole = {
                roleName: '',
                department: '',
                permission_id: []
            };
        },

        onEditRole(role) {

            this.selectedRole = { ...role };
        },

        async onDeleteRole(role_id) {
            this.roleToDelete = role_id;
            try{
              const response = await fetch(`http://localhost:8085/role/delete/${role_id}`,{
                method:"DELETE",
                headers:{
                  "Content-Type":"application/json",
                  "Authorization": "Bearer " + localStorage.getItem("JWT_Token")
                }
              });
              if(response.ok) {
                const message = response.message;
                await this.getAllRole();
                console.log(message)
              } else {
                const message = response.message;
                console.log(message)
              }
            } catch (error) {
              console.log("發送刪除請求失敗");
            }
        },
      async getAllPermission () {
        try{
          const response = await fetch("http://localhost:8085/Permission/test/get",{
            method:"GET",
            headers:{
              "Content-Type":"application/json",
              "Authorization": "Bearer " + localStorage.getItem("JWT_Token")
            }
          });
          if(response.ok) {
            const result = await response.json();
            this.availablePermissions = result.data;
            console.log(this.availablePermissions);
            console.log("獲取權限資訊成功");
          } else {
            const errorData = await response.json();
            const errorMessage = errorData.message;
            console.log("獲取權限失敗: " + errorMessage);
          }
        } catch (error) {
          console.log("發送獲取權限請求失敗,請檢查網路");
        }
      },
      async getAllRole () {
          try{
            const response = await fetch("http://localhost:8085/role/getAll",{
              method:"GET",
              headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("JWT_Token")
              }
            });
            if(response.ok) {
              const body = await response.json();
              this.roles = body.data;
              console.log(this.roles);
            } else {
              const body = await response.json();
              const message =body.message;
              console.log("獲取角色資料錯誤：", message);
            }
          } catch (error) {
            console.log("發送獲取權限請求失敗,請檢查網路");
          }

      }
    },
    mounted() {
        // 監聽 modal 的顯示和隱藏
        const modals = ['createRoleModal', 'editRoleModal', 'deleteRoleModal'];
        modals.forEach(modalId => {
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                modalElement.addEventListener('show.bs.modal', () => {
                    modalElement.removeAttribute('inert');
                });
                modalElement.addEventListener('hidden.bs.modal', () => {
                    modalElement.setAttribute('inert', '');
                });
            }
        });
    },

  async created() {
     await this.getAllPermission();
     await this.getAllRole ();
  },

};
</script>

<style scoped>
.container {
    padding: 20px;
}

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
    cursor: pointer;
}

.nav-tabs .nav-link.active {
    color: #334255;
    font-weight: 600;
    border-bottom: 2px solid #334255;
    background: none;
}

.add-employee-btn,
.add-role-btn {
    color: #334255;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border: 2px solid #334255;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.add-employee-btn:hover,
.add-role-btn:hover {
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

.form-floating>.form-select,
.form-floating>.form-control {
    padding-top: 1.625rem;
    padding-bottom: 0.625rem;
    height: 100%;
}

.form-floating label {
    color: #334255;
    font-weight: 500;
}

.table {
    margin-bottom: 0;
    white-space: nowrap;
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

.badge {
    font-size: 0.8rem;
    padding: 0.5em 0.7em;
    margin: 0.2em;
    background-color: #6c757d;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .content-wrapper {
        padding: 1rem;
    }

    .form-floating {
        margin-bottom: 1rem;
    }

    .add-employee-btn,
    .add-role-btn {
        width: 100%;
        margin-bottom: 1rem;
    }

    .table th,
    .table td {
        font-size: 0.9rem;
        padding: 0.5rem;
    }
}

/* Modal 樣式 */
.modal-content {
    border-radius: 8px;
    border: none;
}

.modal-header {
    background-color: #f8f9fa;
    border-bottom: 2px solid #FFCD50;
}

.modal-header .modal-title {
    color: #334255;
    font-weight: 600;
}

.modal-footer {
    border-top: 1px solid #dee2e6;
    padding: 1rem;
}

.permission-checkboxes {
    max-height: 200px;
    overflow-y: auto;
    padding: 0.5rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
}

.form-check {
    margin-bottom: 0.5rem;
}

.form-check-input:checked {
    background-color: #334255;
    border-color: #334255;
}

.btn-primary {
    background-color: #334255;
    border-color: #334255;
}

.btn-primary:hover {
    background-color: #FFCD50;
    border-color: #FFCD50;
    color: #334255;
}

.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
}

.btn-danger:hover {
    background-color: #bb2d3b;
    border-color: #b02a37;
}
</style>