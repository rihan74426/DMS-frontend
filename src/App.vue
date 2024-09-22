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

    <router-view v-slot="{ Component }">
      <transition name="scroll" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<style scoped></style>
