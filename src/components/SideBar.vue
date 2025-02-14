<template>
  <div
    class="w-64 h-screen text-white fixed shadow-lg pt-20 z-10"
    v-if="logged && roleBind()"
    :class="
      roleBind()
        ? 'bg-gradient-to-r from-blue-800 to-blue-400'
        : 'bg-gradient-to-r to-purple-400 from-blue-500'
    "
  >
    <nav class="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-4 py-2 transition-colors duration-200 rounded-lg group hover:bg-white/10"
        :class="{ 'bg-white/20': isActive(item.path) }"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="transition-opacity duration-200 py-2 ml-2">
          {{ item.name }}
        </span>
      </router-link>
      <button
        @click="handleLogout"
        class="w-full flex items-center px-4 py-2 transition-colors duration-200 rounded-lg group hover:bg-white/10"
      >
        <component :is="LogOutIcon" class="h-6 w-6" />
        <span class="transition-opacity duration-200 py-2 ml-2">logout</span>
      </button>
    </nav>
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  UsersIcon,
  CompassIcon,
  PyramidIcon,
  TerminalSquareIcon,
  LogOutIcon,
  ListCheck
} from 'lucide-vue-next'

const authStore = useAuthStore()

const navItems = ref([
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Users', path: '/users', icon: UsersIcon },
  { name: 'Companies', path: '/companies', icon: CompassIcon },
  { name: 'Products', path: '/products', icon: PyramidIcon },
  { name: 'Transactions', path: '/transactions', icon: TerminalSquareIcon },
  { name: 'Orders', path: '/orders', icon: ListCheck }
])

const roleBind = () => {
  return authStore.user && authStore.user.role === 'admin'
}

onBeforeMount(async () => {
  await authStore.fetchUser()

  if (roleBind()) {
    // Add the "Orders" item for admins
    // Remove the "My Store" item (based on path or name) for admins
    const storeIndex = navItems.value.findIndex((item) => item.name === 'My Store')
    if (storeIndex !== -1) {
      navItems.value.splice(storeIndex, 1) // Remove "My Store"
    }
  }
})

const logged = ref(true)
const handleLogout = () => {
  authStore.logout()
  logged.value = false
}
const route = useRoute()
const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.router-link-active {
  @apply bg-white/20;
}

/* Animation for expanding/collapsing sidebar */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: width 0.3s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  width: 5rem;
}

/* Animation for nav items */
.router-link-enter-active,
.router-link-leave-active {
  transition: all 0.3s ease-in-out;
}

.router-link-enter-from,
.router-link-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
