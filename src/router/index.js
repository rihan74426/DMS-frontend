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
import NProgress from '@/assets/LoadingBar'
import nProgress from 'nprogress'

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
  NProgress.start()

  const authStore = useAuthStore()

  // Fetch user only if not already loaded
  if (!authStore.user) {
    await authStore.fetchUser()
  }

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user?.role === 'admin'

  // Allow public pages
  if (to.path === '/login' && !isAuthenticated) {
    next()
  }
  // Redirect if authentication is required but user is not authenticated
  else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // Restrict admin-only pages
  else if (to.meta.requiresAdmin && !isAdmin) {
    next('/')
  } else {
    next()
  }
})

// Ensure progress bar stops on navigation completion
router.afterEach(() => {
  NProgress.done()
})

export default router
