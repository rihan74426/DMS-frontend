<script setup>
import NavComp from '@/components/NavComp.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

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

const roleBind = () => {
  return authStore.user && authStore.user.role === 'admin'
}

const authStore = useAuthStore()
</script>

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
              <RouterLink to="/" class="w-full rounded-md px-3 py-2 text-lg font-bold"
                >Distribution Management System</RouterLink
              >
            </div>
          </div>
          <div
            v-if="!roleBind() && authStore.logged"
            class="flex place-content-center col-span-3 sm:ml-6 sm:block"
          >
            <NavComp />
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
                :src="
                  profileImagePreview
                    ? profileImagePreview
                    : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
                "
                class="absolute top-0 w-12 h-12 rounded-full object-cover"
              />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
