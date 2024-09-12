<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 pt-10">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Register</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block text-gray-700" for="name">Name</label>
          <input
            v-model="name"
            id="name"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700" for="email">Email</label>
          <input
            v-model="email"
            id="email"
            type="email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700" for="password">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Register
        </button>
      </form>
      <p class="mt-6 text-gray-600 text-center">
        Already have an account?
        <button @click="emit('show')" class="text-blue-500 hover:underline">Login</button>
      </p>
      <p v-if="resMessage" class="text-${color}-500 mt-4">{{ resMessage }}</p>
    </div>
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <l-grid size="60" speed="1.5" color="black"></l-grid>
    </div>
    <ModalComp
      :show="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ModalComp from '@/components/ModalComp.vue'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const authStore = useAuthStore()

const resMessage = ref('')
const loading = ref(false)
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

const emit = defineEmits('show')

const register = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      username: name.value,
      email: email.value,
      password: password.value
    })
    showModal.value = true
    modalTitle.value = 'Success'
    modalMessage.value = 'Registration Success'
    loading.value = true
    await authStore.login({ email: email.value, password: password.value })
    router.push('/dashboard')
    console.log('Registration successful:', response.data)
    resMessage.value = 'Registration Successful!'
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message)
    resMessage.value = error.response.data.message
    showModal.value = true
    modalTitle.value = 'Failure'
    modalMessage.value = 'Registration failed. Please try again...'
  } finally {
    loading.value = false
  }
}
</script>
