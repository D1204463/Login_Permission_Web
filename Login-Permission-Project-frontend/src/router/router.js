import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/LoginView.vue'
import Unit from '../views/Unit.vue'
import Position from '../views/Position.vue'
import Register from '../components/Register.vue'
import LoginRecord from "../views/LoginRecord.vue";
import Employee from "../views/Employee.vue";
import EmployeeStatusView from '../views/EmployeeStatusView.vue';
import Department from '../views/Department.vue'

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
        component: Unit
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
        path: '/employee-status',
        name: 'EmployeeStatus',
        component: EmployeeStatusView
    },
    {
        path: '/Department',
        name: 'Department',
        component:Department,
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


    // {
    //     path: '/sidebar',
    //     name: 'Sidebar',
    //     component: Sidebar
    // }
]

const router =  createRouter({
    history: createWebHistory(),
    routes,
  })

//路由守衛
  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = store.getters['auth/isAuthenticated'];

    if(requiresAuth && !isAuthenticated){
        //如果沒有 admin 權限，就跳轉到其他頁面
        next('/login');
        return;
    } 

    if(to.meta.permissions) {
        const hasRequiredPermission = store.getters['auth/hasAnyPermission'](to.meta.permissions);
        if(!hasRequiredPermission) {
            next('/403');
            return;
        }
    }
    next();
  });


export default router;