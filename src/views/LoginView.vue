<template>
  <div>
    <div v-if="!showReg" class="min-h-screen flex items-center justify-center">
      <transition name="login">
        <div v-if="trans" class="bg-white p-8 mt-10 rounded-lg shadow-lg max-w-md w-full">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Login</h2>
          <p class="text-gray-800">
            * For logging as an Admin try email: rihan@gmail.com and password: rihan. You can then
            log out and log in again as an User to see the difference.
          </p>
          <p class="mb-6 text-gray-800">* For testing user experience try registering simply</p>
          <form @submit.prevent="handleLogin">
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
              Login
            </button>
            <p v-if="resMessage" class="text-${color}-500 mt-4">{{ resMessage }}</p>
          </form>
          <p class="mt-6 text-gray-600 text-center">
            Don't have an account?
            <button @click="showReg = true" class="text-blue-500 hover:underline">Register</button>
          </p>
        </div>
      </transition>
    </div>
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50"
    >
      <l-grid size="80" speed="2" color="blue"></l-grid>
    </div>
    <RegisterView v-if="showReg" @show="showReg = false" />
    <ModalComp
      :show="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import ModalComp from '@/components/ModalComp.vue'
import RegisterView from './RegisterView.vue'

const email = ref('')
const password = ref('')
const resMessage = ref('')
const authStore = useAuthStore()
const router = useRouter()

const showReg = ref(false)
const trans = ref(false)

const loading = ref(false)
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

onMounted(() => {
  trans.value = true
})
const handleLogin = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value })
    if (authStore.logged) {
      resMessage.value = 'login succeed'
      showModal.value = true
      modalTitle.value = 'Success'
      modalMessage.value = 'Logged In Successfully'
      email.value = ''
      password.value = ''
      router.push('/')
    } else {
      resMessage.value = 'Wrong credintials'
      showModal.value = true
      modalTitle.value = 'Failure'
      modalMessage.value = 'Credintial Error. Please try again...'
    }
  } catch (error) {
    console.error('Login failed', error)
  }
}
// const handleLogin = async () => {
//   try {
//     const { data } = await axios.post('https://dms-backend-server2.vercel.app/api/auth/login', {
//       email: email.value,
//       password: password.value
//     })

//     localStorage.setItem('token', data.token)
//     localStorage.setItem('user', data.email)
//     axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
//     console.log('succeed:', data)
//     router.push('/dashboard')
//   } catch (error) {
//     errorMessage.value = error.response?.data?.message || 'Login failed'
//     console.log('errror:', error)
//   }
// }
</script>
<style scoped>
.login-enter-active,
.login-leave-active {
  transition: transform 0.5s ease-in-out;
}

.login-enter-from {
  transform: translateY(-150%); /* Slide from bottom */
}
.login-leave-to {
  transform: translateY(100%); /* Slide to top when leaving */
}
</style>
