<template>
  <div class="w-64 h-screen bg-gray-800 text-white fixed shadow-lg pt-20" v-if="logged">
    <ul class="mt-4">
      <li class="p-4 hover:bg-gray-700">
        <router-link to="/dashboard" class="flex items-center"> Dashboard </router-link>
      </li>
      <li class="p-4 hover:bg-gray-700">
        <router-link to="/products" class="flex items-center"> Products </router-link>
      </li>
      <li class="p-4 hover:bg-gray-700">
        <router-link to="/companies" class="flex items-center"> Companies </router-link>
      </li>
      <li class="p-4 hover:bg-gray-700">
        <router-link to="/transactions" class="flex items-center"> Transactions </router-link>
      </li>
      <li class="p-4 hover:bg-gray-700">
        <router-link to="/stores" class="flex items-center"> Stores </router-link>
      </li>
      <li class="p-4 hover:bg-gray-700">
        <router-link to="/Users" class="flex items-center"> Users </router-link>
      </li>
      <!-- <li class="p-4 hover:bg-gray-700" v-if="!logged">
        <router-link to="/" class="flex items-center"> Login </router-link>
      </li> -->
      <li class="p-4 hover:bg-gray-700">
        <button @click="handleLogout" class="flex items-center">logout</button>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted, onUpdated, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logged = ref(true)
onMounted(() => {
  const logged = localStorage.getItem('token') ? true : false
  if (logged) {
    router.push('/dashboard')
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  logged.value = false
}
</script>

<style scoped>
.material-icons {
  font-size: 18px;
}
</style>
