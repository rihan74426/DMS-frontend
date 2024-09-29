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
import { onMounted, ref } from 'vue'

const routes = [
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
  },
  {
    path: '/orders',
    component: OrdersView,
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
const isAdmin = ref(false)

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Fetch the user (if not already fetched)
  await authStore.fetchUser()

  // Check the user role
  if (authStore.user && authStore.user.role === 'admin') {
    isAdmin.value = true
  } else {
    isAdmin.value = false
  }

  // If the user is not an admin and trying to access a restricted route
  if (!isAdmin.value && to.path == '/orders') {
    next('/')
  } else {
    next()
  }
})
// Vue.use(router)
export default router
