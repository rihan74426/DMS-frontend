<script setup>
import navbarView from './views/navbarView.vue'
import SideBar from './components/SideBar.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchUser()
})
</script>

<template>
  <div v-if="!authStore.logged"><LoginView /></div>
  <div v-else>
    <navbarView />
    <SideBar />
    <RouterView />
  </div>
</template>

<style scoped></style>
