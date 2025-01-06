<template>

    <div class="sidebar-wrapper">
        <!-- 手機版導航按鈕 -->
        <button class="navbar-toggler d-lg-none" type="button" @click="toggleMobileNav">
            <font-awesome-icon :icon="['fas', 'bars']" />
        </button>

        <!-- 添加遮罩層 -->
        <div v-if="isMobileNavOpen" class="sidebar-overlay" @click="closeMobileNav">
        </div>

        <div :class="['sidebar-container', { 'mobile-active': isMobileNavOpen }]">
            <div class="sidebar-content">
                <!-- Logo -->
                <a href="/Home"
                    class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span class="fs-5">逢大銀行</span>
                </a>

                <!-- User Profile -->
                <div class="dropdown pb-4">
                    <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                        @click.prevent="toggleDropdown" ref="dropdownToggle">
                        <font-awesome-icon :icon="['fas', 'circle-user']" size="2xl" />
                        <span class="mx-3">{{ userName || 'User' }}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark text-small shadow" :class="{ 'show': isDropdownOpen }">
                        <li><a class="dropdown-item" href="#">設定</a></li>
                        <li><router-link to="/profile" class="dropdown-item">個人資料</router-link></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><router-link to="/" class="dropdown-item" @click="logout">登出</router-link></li>
                    </ul>
                </div>

                <!-- Navigation Menu -->
                <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
                    id="menu">
                    <!-- 主頁面 -->
                    <li class="nav-item w-100">
                        <router-link to="/Home" class="nav-link menu-link" @click="closeMobileNav">
                            <div class="d-flex align-items-center">
                                <font-awesome-icon :icon="['fas', 'house']" size="xl" />
                                <span class="ms-3">主頁面</span>
                            </div>
                        </router-link>
                    </li>

                    <!-- 管理系統 -->
                    <template v-for="(section, key) in sections" :key="key">
                        <li v-if="visibleSections[key]" class="nav-item w-100">
                            <a href="#" class="nav-link menu-link" @click.prevent="toggleSubmenu(section.submenuId)"
                                :aria-expanded="isSubmenuOpen[section.submenuId]">
                                <div class="d-flex align-items-center justify-content-between w-100">
                                    <div class="d-flex align-items-center">
                                        <font-awesome-icon :icon="section.icon" size="xl" />
                                        <span class="ms-3">{{ section.title }}</span>
                                    </div>
                                    <font-awesome-icon :icon="['fas', 'chevron-down']" size="xs" class="submenu-icon"
                                        :class="{ 'rotated': isSubmenuOpen[section.submenuId] }" />
                                </div>
                            </a>
                            <div class="submenu-container" :class="{ 'show': isSubmenuOpen[section.submenuId] }">
                                <ul class="nav flex-column ms-4 submenu-items">
                                    <li class="w-100" v-for="item in filteredSectionItems[key]" :key="item.name">
                                        <router-link :to="item.url" class="submenu-link"
                                            :class="{ 'active': $route.path === item.url }">
                                            <span>{{ item.name }}</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </template>
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
import { PERMISSIONS } from '@/constants/permissions';

export default {
    name: 'MyComponent',

    data() {
        return {
            userFile: null,
            isDropdownOpen: false,
            isMobileNavOpen: false,
            isSubmenuOpen: {
                submenu1: false,
                submenu2: false,
                submenu3: false
            },
            submenuRoutes: {
                submenu1: ['/role', '/Department', '/unit', '/position', '/permission', '/employee-status'],
                submenu2: ['/employee', '/loginRecord'],
                submenu3: [] // 會計總帳系統
            },
            sections: {
                management: {
                    title: '管理維護系統',
                    icon: ['fas', 'computer'],
                    submenuId: 'submenu1',
                    items: [
                        {
                            name: '角色管理',
                            url: '/role',
                            requiredPermissions: [
                                PERMISSIONS.ROLE.READ,
                                PERMISSIONS.ROLE.UPDATE,
                                PERMISSIONS.ROLE.CREATE,
                                PERMISSIONS.ROLE.DELETE,
                            ]
                        },
                        {
                            name: '部門管理',
                            url: '/Department',
                            requiredPermissions: [
                                PERMISSIONS.DEPT.READ,
                                PERMISSIONS.DEPT.UPDATE,
                                PERMISSIONS.DEPT.CREATE,
                                PERMISSIONS.DEPT.DELETE,
                                PERMISSIONS.DEPT.CB.READ,
                                PERMISSIONS.DEPT.CB.UPDATE,
                                PERMISSIONS.DEPT.CB.CREATE,
                                PERMISSIONS.DEPT.CB.DELETE
                            ]
                        },
                        {
                            name: '科別管理',
                            url: '/unit',
                            requiredPermissions: [
                                PERMISSIONS.UNIT.READ,
                                PERMISSIONS.UNIT.UPDATE,
                                PERMISSIONS.UNIT.CREATE,
                                PERMISSIONS.UNIT.DELETE
                            ]
                        },
                        {
                            name: '職位管理',
                            url: '/position',
                            requiredPermissions: [
                                PERMISSIONS.POS.READ,
                                PERMISSIONS.POS.UPDATE,
                                PERMISSIONS.POS.CREATE,
                                PERMISSIONS.POS.DELETE
                            ]
                        },
                        {
                            name: '權限管理',
                            url: '/permission',
                            requiredPermissions: [
                                PERMISSIONS.PERM.READ,
                                PERMISSIONS.PERM.UPDATE,
                                PERMISSIONS.PERM.CREATE,
                                PERMISSIONS.PERM.DELETE
                            ]
                        },
                        {
                            name: '狀態管理',
                            url: '/employee-status',
                            requiredPermissions: [
                                PERMISSIONS.STATUS.READ,
                                PERMISSIONS.STATUS.UPDATE,
                                PERMISSIONS.STATUS.CREATE,
                                PERMISSIONS.STATUS.DELETE
                            ]
                        },
                    ]
                },
                hr: {
                    title: '人事管理系統',
                    icon: ['fas', 'people-group'],
                    submenuId: 'submenu2',
                    items: [
                        {
                            name: '員工管理',
                            url: '/employee',
                            requiredPermissions: [
                                PERMISSIONS.EMP.READ,
                                PERMISSIONS.EMP.UPDATE,
                                PERMISSIONS.EMP.CREATE,
                                PERMISSIONS.EMP.DELETE
                            ]
                        },
                        {
                            name: '登入記錄',
                            url: '/loginRecord',
                            requiredPermissions: [
                                PERMISSIONS.RECORD.READ
                            ]
                        }
                    ]
                },
                accounting: {
                    title: '會計總帳系統',
                    icon: ['fas', 'piggy-bank'],
                    submenuId: 'submenu3',
                    items: []
                }
            },
            currentTime: '',
            currentDate: '',
            timer: null, // 保存計時器 ID
        };
    },
    watch: {
        // Watch for route changes
        '$route': {
            immediate: true,
            handler(newRoute) {
                this.updateSubmenuState(newRoute.path);
            }
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
        filteredHumanResourcesItems() {
            return this.hrItems.filter(item => {
                if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
                    return true;
                }
                return this.hasAnyPermission(item.requiredPermissions);
            });
        },
        // 確定每個部分是否應該顯示
        visibleSections() {
            const result = {};

            Object.entries(this.sections).forEach(([key, section]) => {
                // 檢查該部分是否有任何可見的項目
                const hasVisibleItems = section.items.some(item => {
                    // 如果項目沒有必要權限，或用戶有任一必要權限，則項目可見
                    return !item.requiredPermissions.length ||
                        this.hasAnyPermission(item.requiredPermissions);
                });

                result[key] = hasVisibleItems;
            });

            return result;
        },
        // 為每個部分提供過濾後的項目
        filteredSectionItems() {
            const result = {};

            Object.entries(this.sections).forEach(([key, section]) => {
                result[key] = section.items.filter(item => {
                    return !item.requiredPermissions.length ||
                        this.hasAnyPermission(item.requiredPermissions);
                });
            });

            return result;
        }
    },

    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        closeDropdown(e) {
            if (!this.$refs.dropdownToggle.contains(e.target)) {
                this.isDropdownOpen = false;
            }
        },
        toggleSubmenu(menuId) {
            // Only toggle if clicking on a different route than current
            if (!this.submenuRoutes[menuId].includes(this.$route.path)) {
                this.isSubmenuOpen[menuId] = !this.isSubmenuOpen[menuId];
            }
        },
        toggleMobileNav() {
            this.isMobileNavOpen = !this.isMobileNavOpen;
        },
        closeMobileNav() {
            this.isMobileNavOpen = false;
        },
        updateSubmenuState(currentPath) {
            // Check each submenu's routes and update its state
            Object.keys(this.submenuRoutes).forEach(submenuKey => {
                if (this.submenuRoutes[submenuKey].includes(currentPath)) {
                    this.isSubmenuOpen[submenuKey] = true;
                }
            });
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
            // 使用 Vuex 的 getter
            return this.hasAnyPermission(item.requiredPermissions);
        },
        async initializeUserPermissions() {
            if (!this.userPermissions || this.userPermissions.length === 0) {
                try {
                    const permissions = await this.$store.dispatch('auth/refreshPermissions');
                    console.log('Permissions refreshed:', permissions);
                } catch (error) {
                    console.error('Failed to initialize permissions:', error);
                }
            } else {
                console.log('Using existing permissions:', this.userPermissions);
            }
        },
        async logout() {
            await this.$store.dispatch('auth/logout')
        }
    },
    mounted() {
        document.addEventListener('click', this.closeDropdown);
        this.initializeUserPermissions();
        this.updateTime() // 初始化時間
        // 每秒更新一次時間
        this.timer = setInterval(this.updateTime, 1000);
        this.updateSubmenuState(this.$route.path);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.closeDropdown);
        clearInterval(this.timer); // 清除計時器
    },
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
    width: 250px;
    /* 固定寬度 */
    overflow-y: auto;
    transition: all 0.3s ease;
}

.sidebar-content {
    padding: 1.5rem;
    min-height: 100vh;
    /* 最小高度設為視窗高度 */
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
    z-index: 1054;
    /* 比 sidebar-container 的 z-index 小 1 */
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