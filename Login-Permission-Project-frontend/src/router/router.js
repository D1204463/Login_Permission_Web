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
import { PERMISSIONS } from '@/constants/permissions';


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
        component: Register,
        meta: { requiresAuth: false }
    },
    {
        path: '/unit',
        name: 'Unit',
        component: Unit,
        // meta: {
        //     requiresAuth: true,
        //     permissions: [
        //         PERMISSIONS.UNIT.READ,
        //         PERMISSIONS.UNIT.UPDATE,
        //         PERMISSIONS.UNIT.CREATE,
        //         PERMISSIONS.UNIT.DELETE
        //     ]
        // }
    },
    {
        path: '/loginRecord',
        name: 'LoginRecordPage',
        component: LoginRecord,
        // meta: {
        //     requiresAuth: true,
        //     permissions: [
        //         PERMISSIONS.RECORD.READ,
        //     ]
        // }
    },
    {
        path: '/position',
        name: 'Position',
        component: Position,
        // meta: {
        //     requiresAuth: true,
        //     permissions: [
        //         PERMISSIONS.POS.READ,
        //         PERMISSIONS.POS.UPDATE,
        //         PERMISSIONS.POS.CREATE,
        //         PERMISSIONS.POS.DELETE
        //     ]
        // }
    },
    {
        path: '/employee',
        name: 'Employee',
        component: Employee,
        // meta: {
        //     requiresAuth: true,
        //     permissions: [
        //         PERMISSIONS.EMP.READ,
        //         PERMISSIONS.EMP.UPDATE,
        //         PERMISSIONS.EMP.CREATE,
        //         PERMISSIONS.EMP.DELETE
        //     ]
        // }
    },
    {
        path: '/permission',
        name: 'Permission',
        component: Permission,
        // meta: {
        //     requiresAuth: true,
        //     permissions: [
        //         PERMISSIONS.PERM.READ,
        //         PERMISSIONS.PERM.UPDATE,
        //         PERMISSIONS.PERM.CREATE,
        //         PERMISSIONS.PERM.DELETE
        //     ]
        // }
    },
    {
        path: '/employee-status',
        name: 'EmployeeStatus',
        component: EmployeeStatusView,
        // meta: {
        //     requiresAuth: true,
        //     permissions: [
        //         PERMISSIONS.STATUS.READ,
        //         PERMISSIONS.STATUS.UPDATE,
        //         PERMISSIONS.STATUS.CREATE,
        //         PERMISSIONS.STATUS.DELETE
        //     ]
        // }
    },
    {
        path: '/Department',
        name: 'Department',
        component: Department,
        // meta: {
        //     requiresAuth: true,
        //     permissions: [
        //         PERMISSIONS.DEPT.READ,
        //         PERMISSIONS.DEPT.UPDATE,
        //         PERMISSIONS.DEPT.CREATE,
        //         PERMISSIONS.DEPT.DELETE,
        //         // 添加消金部權限
        //         PERMISSIONS.DEPT.CB.READ,
        //         PERMISSIONS.DEPT.CB.UPDATE,
        //         PERMISSIONS.DEPT.CB.CREATE,
        //         PERMISSIONS.DEPT.CB.DELETE
        //     ]
        // }
    },
    {
        path: '/Profile',
        name: 'Profile',
        component: ProfileView
    },
    {
        path: '/Role',
        name: 'Role',
        component: RoleView,
        // meta: {
        //     requiresAuth: true,
        //     permissions: [
        //         PERMISSIONS.ROLE.READ,
        //         PERMISSIONS.ROLE.UPDATE,
        //         PERMISSIONS.ROLE.CREATE,
        //         PERMISSIONS.ROLE.DELETE
        //     ]
        // }
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
        next('/');
        return;
    }

    // 如果已認證但沒有權限，嘗試重新獲取
    // if (isAuthenticated && store.state.auth.userInfo.permissionCode.length === 0) {
    //     try {
    //         await store.dispatch('auth/refreshPermissions');
    //     } catch (error) {
    //         console.error('Failed to refresh permissions:', error);
    //     }
    // }

    // 檢查權限
    if (to.meta.permissions && isAuthenticated) {
        // 使用命名空間的 getter
        const hasRequiredPermission = store.getters['auth/hasAnyPermission'](to.meta.permissions);
        console.log('Permission check:', {
            required: to.meta.permissions,
            has: hasRequiredPermission,
            userPermissions: store.state.auth.userInfo.permissionCode
        });

        if (!hasRequiredPermission) {
            console.log('Permission denied');
            next('/403'); // 要有一個 403 頁面
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