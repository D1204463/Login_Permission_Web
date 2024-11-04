import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/LoginView.vue'
import Unit from '../views/Unit.vue'
import Register from '../components/Register.vue'
import LoginRecord from "../views/LoginRecord.vue";
import Employee from "../views/Employee.vue";
import Employee1 from "../views/Employee1.vue";
import EmployeeStatusView from '../views/EmployeeStatusView.vue';
import EmployeeManagement1 from '../views/EmployeeManagement1.vue' // 新增這行
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
        path: '/employee',
        name: 'Employee',
        component: Employee
    },
    {
        path: '/employee1',
        name: 'Employee1',
        component: Employee1
    },
    {
        path: '/employee-status',
        name: 'EmployeeStatus',
        component: EmployeeStatusView
    },
    {
        path: '/employee-management',
        name: 'EmployeeManagement1', // 新增這行
        component: EmployeeManagement1 // 新增這行
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

export default router;