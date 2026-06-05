import Home from '@/views/Home.vue'
import Login from '@/views/login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'Homepage',
      component: Home
    },
    {
      path:'/login',
      name:'login',
      component: Login
    },
  ],
})

export default router
