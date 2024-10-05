<template>
  <div class="flex place-content-center relative">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="flex w-full items-center font-semibold justify-center transition-colors duration-200 rounded-lg group hover:bg-white/10"
      :class="{ 'bg-white/20': isActive(item.path) }"
    >
      <component :is="item.icon" class="h-4 w-4" />
      <span class="transition-opacity duration-200 ml-2">
        {{ item.name }}
      </span>
    </router-link>
    <button
      @click="handleLogout"
      class="w-full flex justify-center font-semibold items-center p-2 transition-colors duration-200 rounded-lg group hover:bg-white/10"
    >
      <component :is="LogOutIcon" class="h-4 w-4" />
      <span class="transition-opacity duration-200 ml-2">logout</span>
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { HomeIcon, LogOutIcon, PyramidIcon, StoreIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const navItems = ref([
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Products', path: '/products', icon: PyramidIcon },
  { name: 'My Store', path: '/stores', icon: StoreIcon } // My Store item to be removed for admin
])

const handleLogout = () => {
  authStore.logout()
  logged.value = false
}
const isActive = (path) => {
  return route.path === path
}
const logged = ref(true)
const route = useRoute()
const authStore = useAuthStore()
</script>
<style scoped>
.router-link-active {
  @apply bg-white/20;
}
</style>
