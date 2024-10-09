<template>
  <div class="min-h-screen flex flex-wrap place-content-center" :class="{ 'sm:ml-60': roleBind() }">
    <h1 class="text-4xl text-white font-bold m-5">Dashboard</h1>
    <div class="p-10 w-full bg-black">
      <h1 class="text-2xl text-white font-bold">
        Welcome to -> <strong>Distribution Management System</strong>
      </h1>
    </div>
    <div v-if="roleBind()" class="p-4 flex flex-wrap w-full">
      <div class="w-full md:w-1/4 p-4">
        <router-link to="/companies">
          <DashboardCard title="Total Companies" :count="data.totalCompanies" />
        </router-link>
      </div>
      <div class="w-full md:w-1/4 p-4">
        <router-link to="/transactions">
          <DashboardCard title="Total Transactions" :count="data.totalTransactions" />
        </router-link>
      </div>
      <div class="w-full md:w-1/4 p-4">
        <router-link to="/products">
          <DashboardCard title="Total Products" :count="data.totalProducts" />
        </router-link>
      </div>
      <div class="w-full md:w-1/4 p-4">
        <router-link to="/users">
          <DashboardCard title="Total Users" :count="data.totalUsers" />
        </router-link>
      </div>
      <div class="w-full md:w-1/4 p-4">
        <router-link to="/orders">
          <DashboardCard title="Total Orders" :count="data.orders" />
        </router-link>
      </div>
    </div>
    <div v-else>
      <ProductsView />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import DashboardCard from '../components/DashboardCard.vue'
import { onMounted } from 'vue'
import { reactive } from 'vue'
import ProductsView from './ProductsView.vue'

const authStore = useAuthStore()
const data = reactive({
  totalCompanies: 0,
  totalTransactions: 0,
  totalProducts: 0,
  totalUsers: 0,
  orders: 0
})

onMounted(async () => {
  await authStore.fetchCompanies()
  await authStore.fetchUser()
  await authStore.fetchProducts()
  await authStore.fetchTransactions()
  await authStore.fetchAllOrders()
  if (authStore.companies) {
    const length = authStore.companies.value.length
    data.totalCompanies = length
  }
  if (authStore.users) {
    const length = authStore.users.length
    data.totalUsers = length
  }
  if (authStore.products) {
    const length = authStore.products.value.length
    data.totalProducts = length
  }
  if (authStore.transactions) {
    const length = authStore.transactions.value.length
    data.totalTransactions = length
  }
  if (authStore.allOrders) {
    const length = authStore.allOrders.length
    data.orders = length
  }
})

const roleBind = () => {
  return authStore.user && authStore.user.role === 'admin'
}
</script>
