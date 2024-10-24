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
                            <span class="d-none d-sm-inline mx-3">User-name</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                            <li><a class="dropdown-item" href="#">Settings</a></li>
                            <li><a class="dropdown-item" href="#">Profile</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#">Sign out</a></li>
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
                                    <li class="w-100" v-for="(item, index) in managementItems" :key="index">
                                        <a href="#" class="submenu-link">
                                            <span class="d-none d-sm-inline">{{ item }}</span>
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

<script setup>
import { ref, reactive, onMounted } from 'vue'

const isSubmenuOpen = reactive({
    submenu1: false,
    submenu2: false,
    submenu3: false
})

const managementItems = ref([
    '員工管理',
    '部門管理',
    '科別管理',
    '職位管理',
    '權限管理',
    '員工狀態',
    '登入記錄'
])

const toggleSubmenu = (menuId) => {
    isSubmenuOpen[menuId] = !isSubmenuOpen[menuId]
}

// 新增時間相關的程式碼
const currentTime = ref('')
const currentDate = ref('')

const updateTime = () => {
    const now = new Date()
    
    // 更新時間 (24小時制)
    currentTime.value = now.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
    
    // 更新日期
    currentDate.value = now.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long'
    })
}

onMounted(() => {
    updateTime() // 初始化時間
    // 每秒更新一次時間
    setInterval(updateTime, 1000)
})
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
</style>