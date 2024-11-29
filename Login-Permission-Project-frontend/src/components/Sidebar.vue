<template>

    <div class="container-fluid">
      <div class="row flex-nowrap">
        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style="background-color: #334255;">
          <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <!-- Logo -->
            <a href="/"
               class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <span class="fs-5 d-none d-sm-inline">Bank</span>
            </a>

                    <!-- User Profile -->
                    <div class="dropdown pb-4">
                        <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                            id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <font-awesome-icon :icon="['fas', 'circle-user']" size="2xl" />
                            <span class="d-none d-sm-inline mx-3">{{ userName || 'User' }}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                            <li><a class="dropdown-item" href="#">Settings</a></li>
                            <li><a class="dropdown-item" href="#">Profile</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#" @click="logout">Sign out</a></li>
                        </ul>
                    </div>

                    <!-- Navigation Menu -->
                    <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
                        id="menu">
                        <!-- 主頁面 -->
                        <li class="nav-item w-100">
                            <router-link to="/" >
                                <a class="nav-link menu-link">
                                    <div class="d-flex align-items-center">
                                        <font-awesome-icon :icon="['fas', 'house']" size="xl" />
                                        <span class="ms-3 d-none d-sm-inline">主頁面</span>
                                    </div>
                                </a>
                            </router-link>
                        </li>

                        <!-- 管理維護系統 -->
                        <li class="nav-item w-100">
                            <a href="#" class="nav-link menu-link" @click.prevent="toggleSubmenu('submenu1')"
                                :aria-expanded="isSubmenuOpen.submenu1">
                                <div class="d-flex align-items-center justify-content-between w-100">
                                    <div class="d-flex align-items-center">
                                        <font-awesome-icon :icon="['fas', 'computer']" size="xl" />
                                        <span class="ms-3 d-none d-sm-inline">管理維護系統</span>
                                    </div>
                                    <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs"
                                        class="d-none d-sm-inline submenu-icon"
                                        :class="{ 'rotated': isSubmenuOpen.submenu1 }" />
                                </div>
                            </a>
                            <div class="submenu-container" :class="{ 'show': isSubmenuOpen.submenu1 }">
                                <ul class="nav flex-column ms-4 submenu-items">
                                    <li class="w-100" v-for="item in filteredManagementItems" :key="item.name">
                                        <router-link :to="item.url" class="submenu-link"  >
                                            <a @click="navigate" class="submenu-link"
                                                :class="{ 'active': $route.path === item.url }">
                                                <span class="d-none d-sm-inline">{{ item.name }}</span>
                                            </a>
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <!-- 人事管理系統 -->
                        <li class="nav-item w-100">
                            <a href="#" class="nav-link menu-link" @click.prevent="toggleSubmenu('submenu2')"
                                :aria-expanded="isSubmenuOpen.submenu2">
                                <div class="d-flex align-items-center justify-content-between w-100">
                                    <div class="d-flex align-items-center">
                                        <font-awesome-icon :icon="['fas', 'people-group']" size="xl" />
                                        <span class="ms-3 d-none d-sm-inline">人事管理系統</span>
                                    </div>
                                    <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs"
                                        class="d-none d-sm-inline submenu-icon"
                                        :class="{ 'rotated': isSubmenuOpen.submenu2 }" />
                                </div>
                            </a>
                        </li>

                        <!-- 會計總帳系統 -->
                        <li class="nav-item w-100">
                            <a href="#" class="nav-link menu-link" @click.prevent="toggleSubmenu('submenu3')"
                                :aria-expanded="isSubmenuOpen.submenu3">
                                <div class="d-flex align-items-center justify-content-between w-100">
                                    <div class="d-flex align-items-center">
                                        <font-awesome-icon :icon="['fas', 'piggy-bank']" size="xl" />
                                        <span class="ms-3 d-none d-sm-inline">會計總帳系統</span>
                                    </div>
                                    <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs"
                                        class="d-none d-sm-inline submenu-icon"
                                        :class="{ 'rotated': isSubmenuOpen.submenu3 }" />
                                </div>
                            </a>
                        </li>
                    </ul>

                    <div class="sidebar-footer w-100">
                        <div class="text-center p-3 small text-white-50">
                            <div class="mb-1">
                                <font-awesome-icon :icon="['far', 'clock']" class="me-2" />
                                {{ currentTime }}
                            </div>
                            <div>
                                {{ currentDate }}
                            </div>
                        </div>
                    </div>

                    <hr>
                </div>
            </div>

            <!-- Navigation Menu -->
            <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
                id="menu">
              <!-- 主頁面 -->
              <li class="nav-item w-100">
                <a href="#" class="nav-link menu-link">
                  <div class="d-flex align-items-center">
                    <font-awesome-icon :icon="['fas', 'house']" size="xl" />
                    <span class="ms-3 d-none d-sm-inline">主頁面</span>
                  </div>
                </a>
              </li>

              <!-- 管理維護系統 -->
              <li class="nav-item w-100">
                <a href="#" class="nav-link menu-link" @click.prevent="toggleSubmenu('submenu1')"
                   :aria-expanded="isSubmenuOpen.submenu1">
                  <div class="d-flex align-items-center justify-content-between w-100">
                    <div class="d-flex align-items-center">
                      <font-awesome-icon :icon="['fas', 'computer']" size="xl" />
                      <span class="ms-3 d-none d-sm-inline">管理維護系統</span>
                    </div>
                    <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs"
                                       class="d-none d-sm-inline submenu-icon"
                                       :class="{ 'rotated': isSubmenuOpen.submenu1 }" />
                  </div>
                </a>
                <div class="submenu-container" :class="{ 'show': isSubmenuOpen.submenu1 }">
                  <ul class="nav flex-column ms-4 submenu-items">
                    <li class="w-100" v-for="(item, index) in managementItems" :key="index">
                      <a :href="item.url" class="submenu-link">
                        <span class="d-none d-sm-inline">{{ item.name }}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

              <!-- 人事管理系統 -->
              <li class="nav-item w-100">
                <a href="#" class="nav-link menu-link" @click.prevent="toggleSubmenu('submenu2')"
                   :aria-expanded="isSubmenuOpen.submenu2">
                  <div class="d-flex align-items-center justify-content-between w-100">
                    <div class="d-flex align-items-center">
                      <font-awesome-icon :icon="['fas', 'people-group']" size="xl" />
                      <span class="ms-3 d-none d-sm-inline">人事管理系統</span>
                    </div>
                    <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs"
                                       class="d-none d-sm-inline submenu-icon"
                                       :class="{ 'rotated': isSubmenuOpen.submenu2 }" />
                  </div>
                </a>
              </li>

              <!-- 會計總帳系統 -->
              <li class="nav-item w-100">
                <a href="#" class="nav-link menu-link" @click.prevent="toggleSubmenu('submenu3')"
                   :aria-expanded="isSubmenuOpen.submenu3">
                  <div class="d-flex align-items-center justify-content-between w-100">
                    <div class="d-flex align-items-center">
                      <font-awesome-icon :icon="['fas', 'piggy-bank']" size="xl" />
                      <span class="ms-3 d-none d-sm-inline">會計總帳系統</span>
                    </div>
                    <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs"
                                       class="d-none d-sm-inline submenu-icon"
                                       :class="{ 'rotated': isSubmenuOpen.submenu3 }" />
                  </div>
                </a>
              </li>
            </ul>

            <div class="sidebar-footer w-100">
              <div class="text-center p-3 small text-white-50">
                <div class="mb-1">
                  <font-awesome-icon :icon="['far', 'clock']" class="me-2" />
                  {{ currentTime }}
                </div>
                <div>
                  {{ currentDate }}
                </div>
              </div>
            </div>

            <hr>
          </div>
        </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { parseJwt, PERMISSIONS } from '../utils/jwt'

export default {
    name: 'MyComponent',

    //   inject: ['userData', 'parseToken'],

    data() {
        return {
            userFile: null,
            isSubmenuOpen: {
                submenu1: false,
                submenu2: false,
                submenu3: false
            },
            managementItems: [
                {
                    name: '員工管理',
                    url: '/employee',
                    requiredPermissions: [] // 所有人都可以看到
                },
                {
                    name: '部門管理',
                    url: '/Department',
                    requiredPermissions: [PERMISSIONS.DEPT_READ, PERMISSIONS.DEPT_UPDATE, PERMISSIONS.DEPT_CREATE, PERMISSIONS.DEPT_DELETE]
                },
                {
                    name: '科別管理',
                    url: '/unit',
                    requiredPermissions: [PERMISSIONS.UNIT_READ, PERMISSIONS.UNIT_UPDATE, PERMISSIONS.UNIT_CREATE, PERMISSIONS.UNIT_DELETE]
                },
                {
                    name: '職位管理',
                    url: '/position',
                    requiredPermissions: []
                },
                {
                    name: '權限管理',
                    url: '/',
                    requiredPermissions: []
                },
                {
                    name: '員工狀態',
                    url: '/employee-status',
                    requiredPermissions: []
                },
                {
                    name: '登入記錄',
                    url: '/loginRecord',
                    requiredPermissions: [PERMISSIONS.LOGIN_RECORD_READ]
                },
            ],
            currentTime: '',
            currentDate: '',
            userPermissions: [],
        }
    },

    computed: {
        ...mapGetters('auth', [
            'userName',
            'userPermissions',
            'hasPermission',
            'hasAnyPermission'
        ]),
        filteredManagementItems() {
            return this.managementItems.filter(item => {
                if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
                    return true;
                }
                return this.hasAnyPermission(item.requiredPermissions);
            });
        },
    },

    methods: {
        toggleSubmenu(menuId) {
            this.isSubmenuOpen[menuId] = !this.isSubmenuOpen[menuId]
        },

        updateTime() {
            const now = new Date()

            // 更新時間 (24小時制)
            this.currentTime = now.toLocaleTimeString('zh-TW', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })

            // 更新日期
            this.currentDate = now.toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                weekday: 'long'
            })
        },
        isVisible(item) {  //基於每個項目的 requiredPermissions 進行判斷
            // 如果沒有設定必要權限，則所有人都可以看到
            if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
                return true;
            }
            // 檢查用戶是否擁有任一必要權限
            return item.requiredPermissions.some(permission =>
                this.userPermissions.includes(permission)
            );
        },
        initializeUserPermissions() {  //在組件掛載時從 JWT 獲取權限
            const token = localStorage.getItem("JWT_Token");
            if (token) {
                const decodedToken = parseJwt(token);
                if (decodedToken && decodedToken.permissionCode) {
                    this.userPermissions = decodedToken.permissionCode;
                    console.log('User permissions:', this.userPermissions);
                    // 同步到 Vuex store
                    this.$store.dispatch('auth/setPermissions', decodedToken.permissionCode);
                    console.log('User permissions initialized:', this.userPermissions);
                }
            }
        },
      async logout(){
          await this.$store.dispatch('auth/logout')
      }
    },
    mounted() {
        // this.parseToken();
        this.initializeUserPermissions();
        this.updateTime() // 初始化時間
        // 每秒更新一次時間
        setInterval(this.updateTime, 1000)

        // try {
        //     const userData = localStorage.getItem("userData");
        //     if (userData) {
        //         this.userFile = JSON.parse(userData);
        //     }
        // } catch (error) {
        //     console.error('解析用戶數據失敗：', error);
        // }
    }
}
</script>

<style scoped>
.menu-link {
    color: #ffffff;
    padding: 12px 15px;
    width: 100%;
    transition: all 0.3s ease;
    border-radius: 6px;
}

.menu-link:hover {
    color: #FFCD50;
    background-color: rgba(255, 255, 255, 0.1);
}

.submenu-link {
    color: #ffffff;
    text-decoration: none;
    padding: 8px 15px;
    display: block;
    transition: all 0.3s ease;
    border-radius: 6px;
    margin: 2px 0;
}

.submenu-link:hover {
    color: #FFCD50;
    background-color: rgba(255, 255, 255, 0.1);
}

.submenu-container {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
}

.submenu-container.show {
    max-height: 500px;
    transition: max-height 0.3s ease-in;
}

.submenu-items {
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.submenu-container.show .submenu-items {
    opacity: 1;
    transform: translateY(0);
}

.submenu-icon {
    transition: transform 0.3s ease;
}

.submenu-icon.rotated {
    transform: rotate(180deg);
}

.dropdown-menu {
    background-color: #334255;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-item {
    color: #ffffff;
}

.dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #FFCD50;
}

hr {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 1rem 0;
}

/* 在原有的 style 中添加 */
.col-auto {
    position: fixed;
    height: 100vh;
    z-index: 1000;
    width: 240px;
    /* 固定寬度 */
}

/* 修改 container-fluid 的樣式 */
.container-fluid {
    padding-left: 0;
    padding-right: 0;
}

/* 確保 row 不會溢出 */
.row {
    margin-left: 0;
    margin-right: 0;
}
</style>