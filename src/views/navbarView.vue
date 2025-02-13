<script setup>
import NavComp from '@/components/NavComp.vue'
import SideBar from '@/components/SideBar.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { LucideMenu } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const user = ref(null)
const profileImagePreview = ref('')
const authStore = useAuthStore()
const isSidebarOpen = ref(false)

// Create a ref for the sidebar container
const sidebarRef = ref(null)
const navbar = ref(null)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Use VueUse's onClickOutside on the sidebar container
onClickOutside(
  sidebarRef,
  () => {
    isSidebarOpen.value = false
  },
  { ignore: [navbar, sidebarRef] }
)

// Fetch user data with async/await
onMounted(async () => {
  await fetchUser()
})

const fetchUser = async () => {
  try {
    const { data } = await axios.get('https://dms-backend-server2.vercel.app/api/auth/profile')
    const userMail = localStorage.getItem('email')
    user.value = data.find((user) => user.email.includes(userMail))

    if (user.value) {
      profileImagePreview.value = user.value.profileImage
    } else {
      profileImagePreview.value =
        'https://dms-backend-server2.vercel.app/uploads/profile-pictures/default.png'
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

watch(
  () => useAuthStore().userUpdated,
  (newVal) => {
    if (newVal === true) fetchUser()
  }
)

watch(
  () => useAuthStore().logged,
  (newVal) => {
    isSidebarOpen.value = newVal
    fetchUser()
  }
)

const roleBind = () => {
  return authStore.user && authStore.user.role === 'admin'
}
</script>

<template>
  <!-- Sidebar container with a ref for click-outside detection -->
  <div ref="sidebarRef" class="relative">
    <SideBar
      ref="sidebarRef"
      :isOpen="isSidebarOpen"
      class="hidden sm:block"
      @closeSidebar="toggleSidebar"
    />
  </div>

  <nav
    class="max-h-15 mt-0 fixed w-full top-0 z-20"
    :class="
      roleBind()
        ? 'bg-gradient-to-r from-blue-800 to-blue-400'
        : 'bg-gradient-to-r from-purple-500 to-blue-500'
    "
  >
    <div ref="navbar" class="relative max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 relative h-16 justify-between">
        <!-- Toggle button for smaller screens (admin only) -->
        <div v-if="roleBind()" class="sm:hidden flex items-center">
          <button
            @click="toggleSidebar"
            class="text-white focus:outline-none px-3 py-2 rounded-md"
            aria-label="Toggle Sidebar"
          >
            <LucideMenu />
          </button>
        </div>

        <!-- Title for larger screens -->
        <div class="mt-2 hidden sm:ml-6 sm:block">
          <div class="flex place-content-center relative">
            <RouterLink to="/" class="w-full rounded-md px-3 py-2 text-lg font-bold text-white">
              Distribution Management System
            </RouterLink>
          </div>
        </div>

        <!-- Navigation links for non-admin users -->
        <div v-if="!roleBind() && authStore.logged" class="flex text-white sm:ml-6 sm:block">
          <NavComp />
        </div>

        <!-- User profile -->
        <div v-if="authStore.logged" class="right-0 absolute grid grid-cols-4 mt-2 gap-1">
          <h1
            class="relative col-span-3 mt-3 text-right text-md sm:text-base md:text-lg font-medium text-white"
          >
            Hello {{ user ? user.username : 'User' }}, Welcome!
          </h1>
          <RouterLink
            to="/profile"
            title="Goes to your Profile"
            class="rounded-md px-3 py-2 relative"
          >
            <img
              :src="
                profileImagePreview ||
                'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
              "
              class="absolute top-0 w-12 h-12 rounded-full object-cover"
            />
          </RouterLink>
        </div>
        <div
          v-else
          class="right-0 absolute mt-2 text-lg font-bold text-white px-4 py-2 transition-colors duration-200 rounded-lg group hover:bg-white/10"
        >
          <RouterLink to="/login" class="rounded-md px-3 py-2 relative">Log In</RouterLink>
        </div>
      </div>
    </div>
  </nav>

  <!-- Sidebar transition for smaller screens -->
  <transition name="sidebar">
    <SideBar v-if="isSidebarOpen" @closeSidebar="toggleSidebar" />
  </transition>
</template>

<style scoped>
/* Sidebar transitions */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}
.sidebar-enter,
.sidebar-leave-to {
  transform: translateX(-100%);
}
</style>
