import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/LoginView.vue'
import Register from '../components/Register.vue'


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
    }
]

const router =  createRouter({
    history: createWebHistory(),
    routes,
  })

export default router;