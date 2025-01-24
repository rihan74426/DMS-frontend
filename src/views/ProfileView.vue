<template>
  <div class="min-h-screen container mx-auto p-4 pt-20">
    <div class="place-content-center" :class="{ 'sm:ml-40': roleBind() }">
      <h1 class="text-2xl text-center font-bold mb-4 text-white block mt-10 mr-20">
        {{ roleBind() ? 'Admin' : 'User' }} Profile
      </h1>
      <div class="place-content-center">
        <div class="grid grid-cols-2 gap-4 mb-4 sm:ml-40">
          <div>
            <img :src="profileData.profileImage" class="m-4 w-48 h-48 rounded-full object-cover" />
            <label
              class="text-white place-content-center ml-20 font-bold text-center"
              for="profileImage"
              >Profile Image</label
            >
          </div>
          <div class="mt-10">
            <h2 class="block text-white text-lg font-bold mb-4">Name: {{ profileData.name }}</h2>
            <h2 class="block text-white text-lg font-bold mb-4">Email: {{ profileData.email }}</h2>
            <h2 class="block text-white text-lg font-bold mb-4">
              Address: {{ profileData.address }}
            </h2>
            <h2 class="block text-white text-lg font-bold mb-4">Phone: {{ profileData.phone }}</h2>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button
          @click="showModal = true"
          class="bg-blue-800 rounded-md p-2 text-white hover:bg-purple-700 hover:text-white"
        >
          Edit Profile
        </button>
      </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-md sm:w-1/2 overflow-auto mb-5 m-5">
        <h2 class="text-2xl font-bold mb-4 absolute block ml-10">Profile Update</h2>

        <form v-if="!loading" @submit.prevent="updateProfile">
          <div class="mb-4">
            <div class="mb-4 m-5 w-1/2 ml-40">
              <label class="ml-20 text-gray-700 text-sm font-bold" for="profileImage"
                >Profile Image</label
              >
              <img
                :src="profileData.profileImage"
                class="m-4 w-32 h-32 rounded-full object-cover ml-20"
              />
              <input
                type="file"
                @change="onFileChange"
                class="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none"
                title="File size must be less than 1MB"
              />
            </div>
            <div class="grid grid-cols-2">
              <div class="m-5">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
                <input
                  v-model="profileData.name"
                  type="text"
                  id="name"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div class="m-5">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                <input
                  v-model="profileData.email"
                  type="email"
                  id="email"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div class="m-5">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="address"
                  >Address</label
                >
                <textarea
                  v-model="profileData.address"
                  type="text"
                  id="address"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
              </div>

              <div class="m-5">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">Phone</label>
                <input
                  v-model="profileData.phone"
                  type="text"
                  id="phone"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>

          <div class="items-center place-content-right">
            <button
              class="bg-blue-500 m-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              @click="showModal = false"
            >
              Cancel
            </button>
            <button
              class="bg-blue-500 m-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update Profile
            </button>
          </div>
        </form>
        <div v-else class="fixed inset-0 flex items-center z-50 justify-center">
          <l-grid size="80" speed="2" color="purple"></l-grid>
        </div>
      </div>
    </div>
    <ModalComp
      :show="showResModal"
      :title="modalTitle"
      :message="modalMessage"
      @close="showResModal = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import ModalComp from '@/components/ModalComp.vue'

const profileData = reactive({
  name: '',
  email: '',
  address: '',
  phone: '',
  profileImage: ''
})

const showModal = ref(false)

const showResModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

const profileImageChanged = ref(false)
const authStore = useAuthStore()
const loading = ref(false)
// const user = authStore.user
const userMail = localStorage.getItem('email')
onMounted(async () => {
  try {
    loading.value = true
    await authStore.fetchUser()
    const user = authStore.users.filter((user) => user.email.includes(userMail))[0]
    if (user) {
      profileData.name = user.username
      profileData.email = user.email
      profileData.address = user.address
      profileData.phone = user.phone
      profileData.profileImage = user.profileImage
    } else {
      profileData.profileImage = `https://dms-backend-server2.vercel.app/${profileImageUrl.value}`
    }
  } catch (err) {
    loading.value = false
    console.log('error fetching user:', err)
  }
  loading.value = false
})

const roleBind = () => {
  if (authStore.user) {
    if (authStore.user.role == 'admin') return true
  } else {
    return false
  }
}

// Convert the image path to a usable URL
const profileImageUrl = computed(() => {
  return profileData.profileImage.replace(/\\/g, '/') // Replace backslashes with forward slashes
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  profileData.profileImage = file
  profileImageChanged.value = true
}

const updateProfile = async () => {
  try {
    const token = localStorage.getItem('token') // Get token from local storage
    const formData = new FormData()

    // Append form data (fields: name, phone, address, profileImage)
    if (profileData.name) formData.append('username', profileData.name)
    if (profileData.phone) formData.append('phone', profileData.phone)
    if (profileData.address) formData.append('address', profileData.address)
    if (profileData.profileImage && profileImageChanged)
      formData.append('profileImage', profileData.profileImage)
    // Send request to the backend
    const response = await axios.put(
      'https://dms-backend-server2.vercel.app/api/auth/profile',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file upload
          Authorization: `Bearer ${token}` // Bearer token for authentication
        }
      }
    )
    // Update the local storage with the new username if updated
    localStorage.setItem('username', response.data.username) // Update local storage with the new username
    authStore.userUpdated = true
    showModal.value = false
    modalTitle.value = 'Success'
    modalMessage.value = 'Profile updated successfully!'
    showResModal.value = true
    return response.data // Return updated user data
  } catch (error) {
    showModal.value = false
    modalTitle.value = 'failure'
    modalMessage.value = 'Failed to update the profile!'
    showResModal.value = true
    console.error('Error updating profile:', error.response?.data || error.message)
    throw error
  }
}
</script>
