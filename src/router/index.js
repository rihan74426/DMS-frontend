import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import UsersView from '../views/UsersView.vue'
import CompaniesView from '@/views/CompaniesView.vue'
import { useAuthStore } from '@/stores/authStore'
import ProductsView from '@/views/ProductsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TransactionView from '@/views/TransactionView.vue'
import StoreView from '@/views/StoreView.vue'

const routes = [
  {
    path: '/dashboard',
    component: DashboardView
  },
  {
    path: '/',
    component: LoginView
  },
  {
    path: '/companies',
    component: CompaniesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    component: UsersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    component: ProductsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/transactions',
    component: TransactionView,
    meta: { requiresAuth: true }
  },
  {
    path: '/stores',
    component: StoreView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  }
  // More routes here
]

const router = new createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

// Vue.use(router)
export default router
