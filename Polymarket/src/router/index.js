import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '../views/SignUp.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import CreateBet from '../views/CreateBet.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', redirect: { name: 'Dashboard' } },
    { path: '/sign-up', name: 'SignUp', component: SignUp },
    { path: '/login', name: 'Login', component: Login },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/create-bet', name: 'CreateBet', component: CreateBet },
  ]
})

export default router
