<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-1/3">
      <h2 class="text-2xl font-semibold mb-4">{{ product ? 'Edit Product' : 'Add Product' }}</h2>
      <label class="block mb-2">Product Name:</label>
      <input v-model="productData.name" type="text" class="w-full p-2 border rounded-md mb-4" />

      <label class="block mb-2">Quantity:</label>
      <input
        v-model="productData.quantity"
        type="number"
        class="w-full p-2 border rounded-md mb-4"
      />

      <div class="flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md">
          Cancel
        </button>
        <button @click="saveChanges" class="px-4 py-2 bg-green-600 text-white rounded-md">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ product: Object })
const productData = ref({ ...props.product })

const emit = defineEmits(['save'])
const saveChanges = () => {
  emit('save', productData.value)
}
</script>
