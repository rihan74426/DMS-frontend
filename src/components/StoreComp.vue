<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-1/3">
      <h2 class="text-2xl font-semibold mb-4">Edit Store Details</h2>
      <label class="block mb-2">Store Name:</label>
      <input v-model="store.name" type="text" class="w-full p-2 border rounded-md mb-4" />

      <label class="block mb-2">Store Proprietor:</label>
      <input v-model="store.manager" type="text" class="w-full p-2 border rounded-md mb-4" />

      <label class="block mb-2">Store Email:</label>
      <input v-model="store.email" type="text" class="w-full p-2 border rounded-md mb-4" />
      <label class="block mb-2">Store Number:</label>
      <input v-model="store.number" type="text" class="w-full p-2 border rounded-md mb-4" />
      <label class="block mb-2">Store Location:</label>
      <input v-model="store.location" type="text" class="w-full p-2 border rounded-md mb-4" />

      <div class="flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md">
          Cancel
        </button>
        <button @click="saveChanges" class="px-4 py-2 bg-blue-600 text-white rounded-md">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ store: Object })
const store = ref({
  name: props.store.name,
  manager: props.store.manager,
  email: props.store.email,
  number: props.store.number,
  location: props.store.location
})

const emit = defineEmits(['save'])
const saveChanges = () => {
  emit('save', store.value)
}
</script>
