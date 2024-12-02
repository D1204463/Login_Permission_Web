import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import MyNotifications from '../views/HomePageButton/MyNotificationsView.vue'
import DepartmentAnnouncements from '../views/HomePageButton/DepartmentAnnouncementsView.vue'
import CompanyAnnouncements from '../views/HomePageButton/CompanyAnnouncementsView.vue'
import Login from '../views/LoginView.vue'
import Unit from '../views/Unit.vue'
import Position from '../views/Position.vue'
import Register from '../components/Register.vue'
import LoginRecord from "../views/LoginRecord.vue";
import Employee from "../views/Employee.vue";
import EmployeeStatusView from '../views/EmployeeStatusView.vue';
import Department from '../views/Department.vue';
import ProfileView from '../views/Profile.vue'

import store from '../store';
import { PERMISSIONS } from "../utils/jwt";

// import UnitComponents from '../components/Unit.vue'
// import Sidebar from '../components/Sidebar.vue'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/MyNotifications',
        name: 'MyNotifications',
        component: Home
    },
    {
        path: '/department-announcements',
        name: 'DepartmentAnnouncements',
        component: Home
    },
    {
        path: '/company-announcements',
        name: 'CompanyAnnouncements',
        component: Home
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/unit',
        name: 'Unit',
        component: Unit,
        meta: {
            requiresAuth: true,
            permissions: [
                PERMISSIONS.UNIT_READ,
                PERMISSIONS.UNIT_UPDATE,
                PERMISSIONS.UNIT_CREATE,
                PERMISSIONS.UNIT_DELETE
            ]
        }
    },
    {
        path: '/loginRecord',
        name: 'LoginRecordPage',
        component: LoginRecord
    },
    {
        path: '/position',
        name: 'Position',
        component: Position
    },
    {
        path: '/employee',
        name: 'Employee',
        component: Employee,
    },
    {
        path: '/employee-status',
        name: 'EmployeeStatus',
        component: EmployeeStatusView
    },
    {
        path: '/Department',
        name: 'Department',
        component: Department,
        meta: {
            requiresAuth: true,
            permissions: [
                PERMISSIONS.DEPT_READ,
                PERMISSIONS.DEPT_UPDATE,
                PERMISSIONS.DEPT_CREATE,
                PERMISSIONS.DEPT_DELETE
            ]
        }
    },
    {
        path: '/Profile',
        name: 'Profile',
        component: ProfileView
    }


    // {
    //     path: '/sidebar',
    //     name: 'Sidebar',
    //     component: Sidebar
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

//路由守衛
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = store.state.auth.isAuthenticated;

    // 調試訊息
    console.log('Route authentication:', {
        path: to.path,
        requiresAuth,
        isAuthenticated,
        permissions: to.meta.permissions
    });

    // 檢查認證
    if (requiresAuth && !isAuthenticated) {
        console.log('Authentication required, redirecting to login');
        //如果沒有 admin 權限，就跳轉到其他頁面
        next('/login');
        return;
    }

    // 檢查權限
    if (to.meta.permissions) {
        // 使用命名空間的 getter
        const hasRequiredPermission = store.getters['auth/hasAnyPermission'](to.meta.permissions);
        console.log('Permission check:', {
            required: to.meta.permissions,
            has: hasRequiredPermission,
            userPermissions: store.state.auth.userInfo.permissionCode
        });

        if (!hasRequiredPermission) {
            next('/403');
            return;
        }
    }
    next();
});

//全局錯誤處理
router.onError((error) => {
    console.error('Router error:', error);
});


export default router;