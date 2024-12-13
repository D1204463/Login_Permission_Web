import { createWebHistory, createRouter } from 'vue-router'
import Home from '@/views/MainPage/Home.vue'
import ProfileView from '@/views/MainPage/Profile.vue';
import Login from '@/views/auth/LoginView.vue'
import Register from '@/components/auth/Register.vue'
import Unit from '@/views/ManagementPage/Unit.vue'
import RoleView from '@/views/ManagementPage/RoleView.vue'
import Position from '@/views/ManagementPage/Position.vue'
import Permission from '@/views/ManagementPage/Permission.vue';
import Department from '@/views/ManagementPage/Department.vue';
import EmployeeStatusView from '@/views/ManagementPage/EmployeeStatusView.vue';
import Employee from "@/views/HumanResourcesPage/EmployeeView.vue";
import LoginRecord from "@/views/HumanResourcesPage/LoginRecord.vue";

import store from '@/store';
import { PERMISSIONS } from "@/utils/jwt";


const routes = [
    {
        path: '/Home',
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
        path: '/',
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
        path: '/permission',
        name: 'Permission',
        component: Permission
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
    },
    {
        path: '/Role',
        name: 'Role',
        component: RoleView
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

//路由守衛
router.beforeEach((to, from, next) => {
    // store.commit('auth/setUserInfo', localStorage.getItem('JWT_Token'));
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