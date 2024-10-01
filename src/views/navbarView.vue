<script setup>
import SideBar from '@/components/SideBar.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import {
  HomeIcon,
  UsersIcon,
  CompassIcon,
  PyramidIcon,
  TerminalSquareIcon,
  LogOutIcon,
  StoreIcon,
  ListCheck
} from 'lucide-vue-next'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const user = ref(null)
const profileImagePreview = ref('')

onMounted(() => {
  fetchUser()
})
const fetchUser = async () => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/auth/profile')
    const userMail = localStorage.getItem('email')
    user.value = data.filter((user) => user.email.includes(userMail))[0]
    profileImagePreview.value = `http://localhost:5000/${user.value.profileImage}`
    console.log(profileImagePreview.value)
  } catch (error) {
    // this.logout()
    console.log('error fetching data: ', error)
  }
}

watch(
  () => useAuthStore().userUpdated,
  (newVal) => {
    if (newVal == true) {
      fetchUser()
    }
  }
)
watch(
  () => useAuthStore().user,
  (newVal) => {
    user.value = newVal
  }
)
watch(
  () => useAuthStore().logged,
  () => {
    fetchUser()
  }
)
const navItems = ref([
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Products', path: '/products', icon: PyramidIcon },
  { name: 'My Store', path: '/stores', icon: StoreIcon } // My Store item to be removed for admin
])

const roleBind = () => {
  return authStore.user && authStore.user.role === 'admin'
}

const authStore = useAuthStore()
const logged = ref(true)
const route = useRoute()

const handleLogout = () => {
  authStore.logout()
  logged.value = false
}
const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.router-link-active {
  @apply bg-white/20;
}
</style>

<template>
  <nav class="max-h-15 mt-0 fixed w-full top-0 z-10 bg-gradient-to-r from-purple-500 to-blue-500">
    <div class="relative max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 justify-between">
        <div
          class="grid grid-cols-5 items-center text-white justify-center sm:items-stretch sm:justify-start"
        >
          <div class="col-span-2 mt-2 hidden sm:ml-6 sm:block">
            <div class="flex place-content-center relative">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <a href="/" class="w-full rounded-md px-3 py-2 text-lg font-bold"
                >Distribution Management System</a
              >
            </div>
          </div>
          <div
            v-if="!roleBind() && authStore.logged"
            class="flex place-content-center col-span-3 sm:ml-6 sm:block"
          >
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
          </div>
          <div v-if="useAuthStore().logged" class="right-0 absolute grid grid-cols-4 mt-2 gap-1">
            <h1
              class="relative col-span-3 text-right rounded-md px-3 py-2 text-lg font-medium text-white"
            >
              Hello {{ user ? user.username : 'User' }}, Welcome!
            </h1>
            <RouterLink
              to="/profile"
              title="Goes to your Profile"
              class="rounded-md px-3 py-2 relative"
            >
              <img
                :src="profileImagePreview"
                class="absolute top-0 w-12 h-12 rounded-full object-cover"
              />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
