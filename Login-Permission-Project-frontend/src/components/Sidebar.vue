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
                                    <li class="w-100" v-for="(item, index) in managementItems " :key="index">
                                        <a :href="item.url" class="submenu-link" v-if="isVisible(item.name)">
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
        </div>
    </div>

</template>

<script>
import { mapGetters } from 'vuex'

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
                { name: '員工管理', url: '/employee' },
                { name: '部門管理', url: '/' },
                { name: '科別管理', url: '/unit' },
                { name: '職位管理', url: '/position' },
                { name: '權限管理', url: '/' },
                { name: '員工狀態', url: '/employee-status' },
                { name: '登入記錄', url: '/loginRecord' }
            ],
            currentTime: '',
            currentDate: '',
        }
    },

    computed: {
        ...mapGetters({
            userName: 'auth/userName'
        })
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
        async logout() {
            const token = localStorage.getItem("JWT_Token");
            try {
                const response = await fetch("http://localhost:8085/employee/test/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    localStorage.removeItem("JWT_Token");
                    localStorage.removeItem("userData");
                    this.$store.dispatch('auth/logout'); // 新增：觸發 Vuex 的登出 action
                    this.$router.push("/login");
                } else {
                    const body = await response.json();
                    console.log("Log out failed:" + body)
                }
            } catch (error) {
                console.log("Failed to send log out request")
            }
        },

        isVisible(managementItem) {
            if (!this.userFile || !Array.isArray(this.userFile.permissionId)) {
                return false;
            }
            if (managementItem === "部門管理" || managementItem === "科別管理") {
                return this.userFile.permissionId.includes(4);
            }
            else {
                return true;
            }
        }
    },
    mounted() {
        // this.parseToken();
        this.updateTime() // 初始化時間
        // 每秒更新一次時間
        setInterval(this.updateTime, 1000)

        try {
            const userData = localStorage.getItem("userData");
            if (userData) {
                this.userFile = JSON.parse(userData);
            }
        } catch (error) {
            console.error('解析用戶數據失敗：', error);
        }
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