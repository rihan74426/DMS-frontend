<template>
  <div class="min-h-screen ml-60 flex flex-wrap place-content-center">
    <h1 class="text-4xl text-white font-bold m-5">Dashboard</h1>
    <div class="p-10 w-full bg-black ml-5">
      <h1 class="text-2xl text-white font-bold">
        Welcome to -> <strong>Distribution Management System</strong>
      </h1>
    </div>
    <div class="p-4 flex flex-wrap w-full">
      <div class="w-full md:w-1/4 p-4">
        <DashboardCard title="Total Companies" :count="data.totalCompanies" />
      </div>
      <div class="w-full md:w-1/4 p-4">
        <DashboardCard title="Total Transactions" :count="data.totalTransactions" />
      </div>
      <div class="w-full md:w-1/4 p-4">
        <DashboardCard title="Total Products" :count="data.totalProducts" />
      </div>
      <div class="w-full md:w-1/4 p-4">
        <DashboardCard title="Total Users" :count="data.totalUsers" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import DashboardCard from '../components/DashboardCard.vue'
import { onMounted } from 'vue'
import { reactive } from 'vue'

const authStore = useAuthStore()
const data = reactive({
  totalCompanies: 0,
  totalTransactions: 0,
  totalProducts: 0,
  totalUsers: 0
})
onMounted(async () => {
  await authStore.fetchCompanies()
  await authStore.fetchUser()
  await authStore.fetchProducts()
  await authStore.fetchTransactions()
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
})
</script>
