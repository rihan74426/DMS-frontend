<script setup>
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const user = ref([])
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
      console.log(newVal)
    }
  }
)

// const username = localStorage.getItem('username')
</script>

<template>
  <nav class="bg-gray-800 p-1 mt-0 fixed w-full top-0 z-10">
    <div class="mx-auto relative max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4 place-content-center relative">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <RouterLink
                to="/dashboard"
                class="rounded-md px-3 py-2 text-lg font-bold text-gray-300"
                >Distribution Management System</RouterLink
              >
            </div>
          </div>
          <div class="right-0 absolute grid grid-cols-4 gap-1">
            <h1
              class="relative col-span-3 text-right rounded-md px-3 py-2 text-lg font-medium text-gray-300"
            >
              Hello {{ user.username ? user.username : 'User' }}, Welcome!
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
