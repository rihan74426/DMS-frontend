<template>
  <div class="p-4 bg-white shadow-md rounded-lg">
    <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit' : 'Add New' }} Company</h2>
    <form @submit.prevent="submitForm">
      <div>
        <div class="flex flex-wrap place-content-center -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-first-name"
            >
              Company Name
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-first-name"
              type="text"
              placeholder="RFL, Build best, etc"
              v-model="localCompany.name"
              required
            />
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-last-name"
            >
              Manager Name
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Md Salah Uddin"
              v-model="localCompany.manager"
              required
            />
          </div>
        </div>
        <div class="flex flex-wrap place-content-center -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-last-name"
            >
              Write the Address
            </label>
            <textarea
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Road no, Thana, District, Country"
              v-model="localCompany.address"
              required
            ></textarea>
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="number"
            >
              Manager Phone Number
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="number"
              type="tel"
              placeholder="01x-xxx xxx"
              v-model="localCompany.number"
              required
            />
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-email"
            >
              E-mail
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-email"
              type="e-mail"
              placeholder="company@gmail.com"
              v-model="localCompany.email"
              required
            />
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-notes"
            >
              Add Notes
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-notes"
              type="textbox"
              placeholder="The primary Allias"
              v-model="localCompany.notes"
            />
          </div>
        </div>
        <button
          type="submit"
          class="relative inline-flex items-center m-5 justify-center bg-blue-500 rounded-md p-2 text-white-400 hover:bg-blue-700 hover:text-white"
        >
          {{ isEditing ? 'Update the Company' : 'Add this Company' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

// Define props to receive company data from parent
const props = defineProps({
  company: Object,
  isEditing: Boolean
})

// Create a local reactive copy of the company data to work with in the form
const localCompany = reactive({
  name: '',
  address: '',
  manager: '',
  number: '',
  email: '',
  notes: ''
})

// Sync the localCompany with the incoming props.company when editing
watch(
  () => props.company,
  (newCompany) => {
    if (newCompany) {
      localCompany.name = newCompany.name || ''
      localCompany.manager = newCompany.manager || ''
      localCompany.address = newCompany.address || ''
      localCompany.number = newCompany.number || ''
      localCompany.email = newCompany.email || ''
      localCompany.notes = newCompany.notes || ''
    }
  }
)

// Define emit for sending data back to parent
const emit = defineEmits(['add-company', 'update-company'])

// Function to submit the form data
function submitForm() {
  if (props.isEditing) {
    emit('update-company', { ...localCompany })
  } else {
    emit('add-company', { ...localCompany })
  }
  // Reset the form
  localCompany.name = ''
  localCompany.address = ''
  localCompany.email = ''
  localCompany.manager = ''
  localCompany.number = ''
  localCompany.notes = ''
}
</script>
