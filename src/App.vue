<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'
import NavbarView from './views/navbarView.vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.fetchUser() // Ensure user data is loaded
  authStore.fetchUser()
})

const roleBind = () => {
  return authStore.user && authStore.user.role === 'admin'
}
</script>

<template>
  <div
    :class="
      roleBind()
        ? 'bg-gradient-to-r from-blue-800 to-blue-400'
        : 'bg-gradient-to-r from-purple-500 to-blue-500'
    "
  >
    <NavbarView />
    <router-view v-slot="{ Component }">
      <transition name="scroll" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
