<template>
  <div class="container min-h-screen mx-auto p-4 sm:ml-20 pt-20">
    <div class="sm:ml-40">
      <h1 class="text-2xl text-white font-bold mb-4 ml-10">Companies</h1>
      <div v-if="!loading" class="p-4 overflow-x-auto">
        <tableComp :items="companies" @editItem="edititem" @deleteItem="deleteitem" />
        <div class="m-5">
          <transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="transform opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="transform opacity-0"
            name="fade"
          >
            <EditView
              v-if="isVisible && roleBind()"
              :company="selectedCompany"
              :isEditing="isEditing"
              @add-company="addCompany"
              @update-company="updateCompany"
            />
          </transition>
        </div>
        <button
          class="inline-flex bg-pink-600 mt-10 text-white px-4 py-2 rounded-l-lg mb-4 hover:bg-green-500 overflow-hidden transform hover:scale-105 transition duration-500"
          @click="togglefunc"
          v-if="!isVisible && roleBind()"
        >
          Add a Company
        </button>
        <button
          class="inline-flex bg-purple-500 mt-10 text-white px-4 py-2 rounded-l-lg mb-4 hover:bg-pink-500 hover:text-black"
          @click="togglefunc"
          v-if="isVisible"
        >
          Cancel
        </button>
      </div>
      <div v-else class="fixed inset-0 flex items-center justify-center z-50">
        <l-grid size="80" speed="2" color="blue"></l-grid>
      </div>
      <ModalComp
        :show="showModal"
        :title="modalTitle"
        :message="modalMessage"
        @close="showModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import tableComp from '../components/tableComp.vue'
import { onMounted, ref } from 'vue'
import EditView from './EditView.vue'
import axios from 'axios'
import ModalComp from '../components/ModalComp.vue'
import { grid } from 'ldrs'
import { useAuthStore } from '@/stores/authStore'

grid.register()

const authStore = useAuthStore()
// Default values shown

const companies = ref([
  // Add more companies as needed
])
const isVisible = ref(false)
const togglefunc = () => {
  isVisible.value = !isVisible.value
}
const roleBind = () => {
  if (authStore.user) {
    if (authStore.user.role == 'admin') return true
  } else {
    return false
  }
}

const loading = ref(false)
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

const deleteitem = async (id) => {
  if (confirm('Are you sure you want to delete this company?')) {
    try {
      loading.value = true // Show loading spinner
      await axios.delete(`https://dms-backend-server2.vercel.app/api/companies/${id}`)
      console.log('Company deleted')
      modalTitle.value = 'Success'
      modalMessage.value = 'Company deleted successfully!'
      showModal.value = true
      companies.value.splice(id, 1)
      // Optionally, remove the company from the companies array locally
    } catch (error) {
      modalTitle.value = 'Error'
      modalMessage.value = 'Failed to delete company.'
      showModal.value = true
    } finally {
      loading.value = false // Hide loading spinner
    }
  }
}

onMounted(async () => {
  loading.value = true
  await authStore.fetchCompanies()
  if (authStore.companies) {
    companies.value = authStore.companies.value
    loading.value = false
  }
})

// Define a ref to hold the currently selected company for editing
const selectedCompany = ref(null)
const isEditing = ref(false)

// Function to add a new company to the companies array
const addCompany = async (company) => {
  try {
    loading.value = true // Show loading spinner
    const response = await axios.post(
      'https://dms-backend-server2.vercel.app/api/companies/add',
      company
    )
    companies.value.push(company)
    console.log('Company added:', response.data)
    modalTitle.value = 'Success'
    modalMessage.value = 'Company added successfully!'
    showModal.value = true
    // Handle success, e.g., clear the form or navigate to another page
  } catch (error) {
    modalTitle.value = 'Error'
    modalMessage.value = 'Failed to add company.'
    showModal.value = true
  } finally {
    loading.value = false // Hide loading spinner
  }
}

// Function to update an existing company in the companies array
const updateCompany = async (updatedCompany) => {
  const index = companies.value.findIndex((c) => c.name === selectedCompany.value.name)
  if (index !== -1) {
    try {
      companies.value[index] = updatedCompany
      loading.value = true // Show loading spinner
      const response = await axios.put(
        `https://dms-backend-server2.vercel.app/api/companies/${selectedCompany.value._id}`,
        updatedCompany
      )
      modalTitle.value = 'Success'
      modalMessage.value = 'Company updated successfully!'
      showModal.value = true
      console.log('Company updated:', response.data)
      // Handle success, e.g., navigate to another page
    } catch (error) {
      console.error('Error updating company:', error.response.data.message)
      modalTitle.value = 'Error'
      modalMessage.value = 'Failed to add company.'
      showModal.value = true
      // Handle error, e.g., display a message to the user
    } finally {
      loading.value = false // Hide loading spinner
    }
  }
  selectedCompany.value = null
  isEditing.value = false
}

// Function to populate the form with the selected company's data for editing
function edititem(index) {
  selectedCompany.value = { ...companies.value[index] }
  isEditing.value = true
  isVisible.value = true
}
</script>
<style scoped>
.loader {
  border-top-color: #3490dc;
  animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
