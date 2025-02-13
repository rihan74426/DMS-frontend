import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import UsersView from '../views/UsersView.vue'
import CompaniesView from '@/views/CompaniesView.vue'
import { useAuthStore } from '@/stores/authStore'
import ProductsView from '@/views/ProductsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TransactionView from '@/views/TransactionView.vue'
import StoreView from '@/views/StoreView.vue'
import OrdersView from '@/views/OrdersView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    component: DashboardView
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
    component: ProductsView
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
  },
  {
    path: '/orders',
    component: OrdersView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.fetchUser() // Ensure user data is loaded

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user?.role === 'admin'

  // Allow access to login page even if not authenticated
  if (to.path === '/login' && !isAuthenticated) {
    return next()
  }

  // If trying to access a protected page without authentication, redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Restrict access to admin-only pages
  const adminRoutes = ['/orders', '/transactions', '/companies', '/users']
  if (adminRoutes.includes(to.path) && !isAdmin) {
    return next('/')
  }

  next()
})

export default router
