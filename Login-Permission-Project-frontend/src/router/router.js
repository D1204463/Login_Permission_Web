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
        component: Login
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
        component: Employee
    },
    {
        path: '/employee-status',
        name: 'EmployeeStatus',
        component: EmployeeStatusView
    },
    {
        path: '/Department',
        name: 'Department',
        component: Department
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
    const permissions = store.replaceState.permissions;

    if(to.meta.requiresAdmin && !permissions.includes('admin')){
        //如果沒有 admin 權限，就跳轉到其他頁面
        next('/login');
    } else {
        next();
    }
  });


export default router;