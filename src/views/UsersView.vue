<template>
  <div class="p-4 sm:ml-40 mx-auto min-h-screen pt-20">
    <div class="container">
      <h1 class="ml-10 text-4xl font-bold text-white text-center">Users Management</h1>
      <div class="justify-self-center">
        <input
          v-model="searchQuery"
          placeholder="Search User by Name..."
          class="ring-2 px-2 py-2 my-10 rounded-lg w-half"
        />
      </div>
      <!-- Users Table -->
      <div class="sm:ml-20 p-4 overflow-x-auto">
        <table class="bg-white shadow-lg rounded-lg min-w-full">
          <thead>
            <tr class="bg-gray-100 text-dark uppercase text-sm leading-normal">
              <th class="py-3 px-3 text-left">Name</th>
              <th class="py-3 px-3 text-left">Email</th>
              <th class="py-3 px-3 text-left">Phone</th>
              <th class="py-3 px-3 text-center">Address</th>
              <th class="py-3 px-3 text-center">Role</th>
              <th class="py-3 px-3 text-center" v-if="roleBind()">Actions</th>
            </tr>
          </thead>
          <tbody class="text-dark font-light">
            <tr
              v-for="user in users"
              :key="user._id"
              class="border-b border-gray-200 hover:bg-gray-100"
            >
              <td class="py-3 px-3 text-left">{{ user.username }}</td>
              <td class="py-3 px-3 text-left">{{ user.email }}</td>
              <td class="py-3 px-3 text-left">{{ user.phone }}</td>
              <td class="py-3 px-3 w-52 text-left">{{ user.address }}</td>
              <td class="py-3 px-3 text-center">{{ user.role }}</td>
              <td class="py-3 px-3 text-center" v-if="roleBind()">
                <button
                  @click="editUser(user)"
                  class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  @click="deleteUser(user._id)"
                  class="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal for Editing User -->
      <div v-if="loading" class="fixed inset-0 flex items-center z-50 justify-center">
        <l-grid size="80" speed="2" color="blue"></l-grid>
      </div>
      <ModalComp
        :show="showResModal"
        :title="modalTitle"
        :message="modalMessage"
        @close="showResModal = false"
      />
    </div>
    <UserModal
      v-if="showModal"
      :user="selectedUser"
      @close="showModal = false"
      @update="updateUser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, computed, watch } from 'vue'
import axios from 'axios'
import UserModal from '@/components/UserModal.vue'
import ModalComp from '@/components/ModalComp.vue'
import { grid } from 'ldrs'
import { useAuthStore } from '@/stores/authStore'

grid.register()
const authStore = useAuthStore()

const roleBind = () => {
  if (authStore.user) {
    if (authStore.user.role == 'admin') return true
  } else {
    return false
  }
}

const users = ref([])
const selectedUser = ref(null)
const showModal = ref(false)

const loading = ref(false)
const showResModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const searchQuery = ref('')

onMounted(async () => {
  await fetchUser()
  await authStore.fetchUser()
})
onUpdated(async () => {
  await authStore.fetchUser()
})

const fetchUser = async () => {
  try {
    loading.value = true // Show loading spinner
    const response = await axios.get('https://dms-backend-server2.vercel.app/api/auth/profile')
    users.value = response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false // Hide loading spinner
  }
}

function editUser(user) {
  selectedUser.value = user
  showModal.value = true
}

// search functionality from here
const filteredUsers = computed(() =>
  authStore.users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)
watch(searchQuery, () => {
  users.value = filteredUsers.value
})

async function deleteUser(userId) {
  if (confirm('Are you serious? You want to delete a user!')) {
    try {
      await axios.delete(`https://dms-backend-server2.vercel.app/api/auth/profile/${userId}`)
      users.value = users.value.filter((user) => user._id !== userId)
      loading.value = true
      showResModal.value = true
      modalTitle.value = 'Success!'
      modalMessage.value = 'User deleted Successfully'
    } catch (error) {
      console.error('Error deleting user:', error)
      showResModal.value = true
      modalTitle.value = 'Failure'
      modalMessage.value = 'Failed to delete the User'
    } finally {
      loading.value = false
    }
  }
}

async function updateUser(updatedUser) {
  try {
    const response = await axios.put(
      `https://dms-backend-server2.vercel.app/api/auth/profile/${updatedUser._id}`,
      updatedUser
    )
    const index = users.value.findIndex((user) => user._id === updatedUser._id)
    if (index !== -1) {
      users.value[index] = response.data
    }
    showModal.value = false
    loading.value = true
    showResModal.value = true
    modalTitle.value = 'Success'
    modalMessage.value = 'User Updated Successfully!'
  } catch (error) {
    console.error('Error updating user:', error)
    showResModal.value = true
    modalTitle.value = 'Failure'
    modalMessage.value = 'Failed to Update the user!'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
