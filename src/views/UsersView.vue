<template>
  <div class="p-4 ml-20 flex flex-wrap pt-20 left-40 place-content-center">
    <h1 class="text-2xl font-bold mb-4 absolute block ml-10">Users Management</h1>
    <!-- Users Table -->
    <div class="overflow-x-auto mt-20">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr class="bg-gray-100 text-dark uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">Name</th>
            <th class="py-3 px-6 text-left">Email</th>
            <th class="py-3 px-6 text-center">Role</th>
            <th class="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="text-dark font-light">
          <tr
            v-for="user in users"
            :key="user._id"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6 text-left">{{ user.username }}</td>
            <td class="py-3 px-6 text-left">{{ user.email }}</td>
            <td class="py-3 px-6 text-center">{{ user.role }}</td>
            <td class="py-3 px-6 text-center">
              <button @click="editUser(user)" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Edit
              </button>
              <button @click="deleteUser(user._id)" class="bg-red-500 text-white px-4 py-2 rounded">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Editing User -->
    <UserModal
      v-if="showModal"
      :user="selectedUser"
      @close="showModal = false"
      @update="updateUser"
    />
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <l-grid size="60" speed="1.5" color="black"></l-grid>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import UserModal from '@/components/UserModal.vue'
import ModalComp from '@/components/ModalComp.vue'
import { grid } from 'ldrs'

grid.register()

const users = ref([])
const selectedUser = ref(null)
const showModal = ref(false)

const loading = ref(false)
const showResModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

onMounted(() => {
  fetchUser()
})

const fetchUser = async () => {
  try {
    loading.value = true // Show loading spinner
    const response = await axios.get('http://localhost:5000/api/auth/profile')
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

async function deleteUser(userId) {
  if (confirm('Are you serious? You want to delete a user!')) {
    try {
      await axios.delete(`http://localhost:5000/api/auth/profile/${userId}`)
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
      `http://localhost:5000/api/auth/profile/${updatedUser._id}`,
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
