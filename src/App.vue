<script setup>
import navbarView from './views/navbarView.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'
import LoginView from './views/LoginView.vue'

const authStore = useAuthStore()

onMounted(() => {
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
    <navbarView />
    <div v-if="!authStore.logged"><LoginView /></div>
    <div v-else>
      <router-view v-slot="{ Component }">
        <transition name="scroll" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped></style>
