<template>
  <div class="flex place-content-center relative space-x-4">
    <!-- Loop through navigation items -->
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="flex flex-col sm:ml-5 items-center font-semibold justify-center p-2 transition-colors duration-200 rounded-lg group hover:bg-white/10"
      :class="{ 'bg-white/20': isActive(item.path) }"
    >
      <!-- Display icon for each nav item -->
      <component :is="item.icon" class="h-6 w-6" />

      <!-- Show label on medium and larger screens, hide on small screens -->
      <span class="transition-opacity duration-200 md:w-max mt-1 hidden md:block">
        {{ item.name }}
      </span>
    </router-link>

    <!-- Logout button -->
    <button
      @click="handleLogout"
      class="flex flex-col items-center font-semibold justify-center p-2 transition-colors duration-200 rounded-lg group hover:bg-white/10"
    >
      <component :is="LogOutIcon" class="h-6 w-6" />
      <span class="transition-opacity duration-200 mt-1 hidden md:block">Logout</span>
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
}
const isActive = (path) => {
  return route.path === path
}

const route = useRoute()
const authStore = useAuthStore()
</script>

<style scoped>
/* Apply background to active links */
.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Responsive visibility for labels */
.hidden.md\\:block {
  display: none;
}

@media (min-width: 768px) {
  .hidden.md\\:block {
    display: block;
  }
}
</style>
