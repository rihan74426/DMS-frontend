<template>
  <div class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
    <div class="bg-white p-8 rounded-lg shadow-lg w-1/3 overflow-auto mb-5 mt-5">
      <h2 class="text-2xl font-semibold mb-4">Edit Store Details</h2>
      <label class="block mb-2">Store Name:</label>
      <input v-model="store.storeName" type="text" class="w-full p-2 border rounded-md mb-4" />

      <label class="block mb-2">Store Proprietor:</label>
      <input v-model="store.storeManager" type="text" class="w-full p-2 border rounded-md mb-4" />

      <label class="block mb-2">Store Email:</label>
      <input v-model="store.storeEmail" type="text" class="w-full p-2 border rounded-md mb-4" />
      <label class="block mb-2">Store Contact:</label>
      <input v-model="store.storePhone" class="w-full p-2 border rounded-md mb-4" />
      <label class="block mb-2">Store Location:</label>
      <input v-model="store.storeAddress" type="text" class="w-full p-2 border rounded-md mb-4" />

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
const store = ref({ ...props.store })

const emit = defineEmits(['save'])
const saveChanges = () => {
  emit('save', store.value)
}
</script>
