<template>

    <div class="sidebar-wrapper">
        <!-- 手機版導航按鈕 -->
        <button class="navbar-toggler d-lg-none" type="button" @click="toggleMobileNav">
            <font-awesome-icon :icon="['fas', 'bars']" />
        </button>

        <!-- 添加遮罩層 -->
        <div v-if="isMobileNavOpen" 
             class="sidebar-overlay"
             @click="closeMobileNav">
        </div>

        <div :class="['sidebar-container', {'mobile-active': isMobileNavOpen}]">
            <div class="sidebar-content">
                <!-- Logo -->
                <a href="/" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span class="fs-5">Bank</span>
                </a>

                <!-- User Profile -->
                <div class="dropdown pb-4">
                    <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                        id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                        <font-awesome-icon :icon="['fas', 'circle-user']" size="2xl" />
                        <span class="mx-3">{{ userName || 'User' }}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                        <li><a class="dropdown-item" href="#">Settings</a></li>
                        <li><router-link to="/profile" class="dropdown-item">Profile</router-link></li>
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
                        <router-link to="/" class="nav-link menu-link" @click="closeMobileNav">
                            <div class="d-flex align-items-center">
                                <font-awesome-icon :icon="['fas', 'house']" size="xl" />
                                <span class="ms-3">主頁面</span>
                            </div>
                        </router-link>
                    </li>

                    <!-- 管理維護系統 -->
                    <li class="nav-item w-100">
                        <a href="#" class="nav-link menu-link" @click.prevent="toggleSubmenu('submenu1')"
                            :aria-expanded="isSubmenuOpen.submenu1">
                            <div class="d-flex align-items-center justify-content-between w-100">
                                <div class="d-flex align-items-center">
                                    <font-awesome-icon :icon="['fas', 'computer']" size="xl" />
                                    <span class="ms-3">管理維護系統</span>
                                </div>
                                <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs"
                                    class="submenu-icon"
                                    :class="{ 'rotated': isSubmenuOpen.submenu1 }" />
                            </div>
                        </a>
                        <div class="submenu-container" :class="{ 'show': isSubmenuOpen.submenu1 }">
                            <ul class="nav flex-column ms-4 submenu-items">
                                <li class="w-100" v-for="item in filteredManagementItems" :key="item.name">
                                    <router-link :to="item.url" class="submenu-link"
                                        :class="{ 'active': $route.path === item.url }" @click="closeMobileNav">
                                        <span>{{ item.name }}</span>
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
                                    <span class="ms-3">人事管理系統</span>
                                </div>
                                <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs"
                                    class="submenu-icon"
                                    :class="{ 'rotated': isSubmenuOpen.submenu2 }" />
                            </div>
                        </a>
                        <div class="submenu-container" :class="{ 'show': isSubmenuOpen.submenu2 }">
                            <ul class="nav flex-column ms-4 submenu-items">
                                <li class="w-100" v-for="item in filteredHumanResourcesItems" :key="item.name">
                                    <router-link :to="item.url" class="submenu-link"
                                        :class="{ 'active': $route.path === item.url }" @click="closeMobileNav">
                                        <span>{{ item.name }}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <!-- 會計總帳系統 -->
                    <li class="nav-item w-100">
                        <a href="#" class="nav-link menu-link" @click.prevent="toggleSubmenu('submenu3')"
                            :aria-expanded="isSubmenuOpen.submenu3">
                            <div class="d-flex align-items-center justify-content-between w-100">
                                <div class="d-flex align-items-center">
                                    <font-awesome-icon :icon="['fas', 'piggy-bank']" size="xl" />
                                    <span class="ms-3">會計總帳系統</span>
                                </div>
                                <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs"
                                    class="submenu-icon"
                                    :class="{ 'rotated': isSubmenuOpen.submenu3 }" />
                            </div>
                        </a>
                        <div class="submenu-container" :class="{ 'show': isSubmenuOpen.submenu3 }">
                            <ul class="nav flex-column ms-4 submenu-items">
                                <!-- 可以添加會計系統的子選項 -->
                            </ul>
                        </div>
                    </li>
                </ul>

                <!-- Sidebar Footer -->
                <div class="sidebar-footer w-100 mt-auto">
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
    </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { parseJwt, PERMISSIONS } from '@/utils/jwt'

export default {
    name: 'MyComponent',

    data() {
        return {
            userFile: null,
            isMobileNavOpen: false,
            isSubmenuOpen: {
                submenu1: false,
                submenu2: false,
                submenu3: false
            },
            managementItems: [
                {
                    name: '角色管理',
                    url: '/role',
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
                    url: '/permission',
                    requiredPermissions: []
                },
                {
                    name: '狀態管理',
                    url: '/employee-status',
                    requiredPermissions: []
                },
            ],
            hrItems: [
                {
                    name: '員工管理',
                    url: '/employee',
                    requiredPermissions: [] // 所有人都可以看到
                },
                {
                    name: '登入記錄',
                    url: '/loginRecord',
                    requiredPermissions: [PERMISSIONS.LOGIN_RECORD_READ]
                },
            ],
            currentTime: '',
            currentDate: '',
            timer: null, // 保存計時器 ID
            userPermissions: [],
        };
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
        filteredHumanResourcesItems() {
            return this.hrItems.filter(item => {
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
        toggleMobileNav() {
            this.isMobileNavOpen = !this.isMobileNavOpen;
        },
        closeMobileNav() {
            this.isMobileNavOpen = false;
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
        async logout() {
            await this.$store.dispatch('auth/logout')
        }
    },
    mounted() {
        this.initializeUserPermissions();
        this.updateTime() // 初始化時間
        // 每秒更新一次時間
        this.timer = setInterval(this.updateTime, 1000)
    },
    beforeUnmount() {
        clearInterval(this.timer); // 清除計時器
    }
}
</script>

<style scoped>
.sidebar-wrapper {
    position: relative;
    height: 100%;
}

.sidebar-container {
    background-color: #334255;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;  /* 固定寬度 */
    overflow-y: auto;
    transition: all 0.3s ease;
}

.sidebar-content {
    padding: 1.5rem;
    min-height: 100vh; /* 最小高度設為視窗高度 */
    display: flex;
    flex-direction: column;
}

/* 遮罩層樣式 */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1054; /* 比 sidebar-container 的 z-index 小 1 */
    display: none;
}

/* 導航按鈕樣式 */
.navbar-toggler {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1060;
    display: none;
    background-color: #334255;
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
}

/* 選單連結樣式 */
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

/* 子選單連結樣式 */
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

.submenu-link.active {
    background-color: rgba(255, 255, 255, 0.2);
    color: #FFCD50;
}

/* 子選單容器樣式 */
.submenu-container {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
}

.submenu-container.show {
    max-height: max-content;
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

/* 箭頭圖標樣式 */
.submenu-icon {
    transition: transform 0.3s ease;
}

.submenu-icon.rotated {
    transform: rotate(180deg);
}

/* 下拉選單樣式 */
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

/* 分隔線樣式 */
hr {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 1rem 0;
}

/* 頁尾樣式 */
.sidebar-footer {
    margin-top: auto;
    padding-top: 1rem;
}

/* 響應式設計 */
@media (max-width: 991.98px) {
    .navbar-toggler {
        display: block;
    }

    .sidebar-container {
        position: fixed;
        top: 0;
        left: -100%;
        width: 250px;
        z-index: 1055;
        overflow-y: auto;
    }

    .sidebar-container.mobile-active {
        left: 0;
    }

    /* 在小螢幕時顯示遮罩層 */
    .sidebar-overlay {
        display: block;
    }

    .fs-5 {
        margin-top: 30px;
    }
}

.sidebar-container.mobile-active::before {
    display: none;
}

/* 滾動條樣式 */
.sidebar-container::-webkit-scrollbar {
    width: 5px;
}

.sidebar-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

.sidebar-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}

.sidebar-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* 輔助類 */
.w-100 {
    width: 100% !important;
}

.mt-auto {
    margin-top: auto !important;
}
</style>