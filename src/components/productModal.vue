<template>
  <div class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
    <div class="bg-white p-4 mt-10 rounded shadow-md w-1/3 overflow-auto mb-5 mt-5">
      <h2 class="text-xl font-bold mb-4">{{ props.product ? 'Edit' : 'Add' }} Product</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="name" class="block text-gray-700">Product Name</label>
          <input
            type="text"
            v-model="productData.name"
            id="name"
            class="border px-2 py-1 w-full"
            required
          />
        </div>
        <div class="mb-4">
          <label for="image" class="block text-gray-700">Image URL</label>
          <input
            type="text"
            v-model="productData.image"
            id="image"
            class="border px-2 py-1 w-full"
            required
          />
        </div>
        <div class="mb-4">
          <label for="description" class="block text-gray-700">description</label>
          <textarea
            type="text"
            v-model="productData.description"
            id="description"
            class="border px-2 py-1 w-full"
            required
          ></textarea>
        </div>
        <div class="mb-4">
          <label for="group" class="block text-gray-700">Group:</label>
          <input
            type="text"
            v-model="productData.group"
            id="group"
            class="border px-2 py-1 w-full"
            required
          />
        </div>
        <div class="mb-4">
          <label for="packSize" class="block text-gray-700">Pack Size:</label>
          <input
            type="text"
            v-model="productData.packSize"
            id="packSize"
            class="border px-2 py-1 w-full"
            required
          />
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="mb-4">
            <label for="available" class="inline-block text-gray-700">Product Available</label>
            <input
              type="number"
              v-model="productData.quantityInStore"
              id="available"
              class="border px-2 py-1 w-full"
              required
            />
          </div>
          <div class="mb-4">
            <label for="supplied" class="inline-block text-gray-700">Product Supplied</label>
            <input
              type="number"
              v-model="productData.quantitySupplied"
              id="supplied"
              class="border px-2 py-1 w-full"
              required
            />
          </div>
          <div class="mb-4">
            <label for="sdp" class="inline-block text-gray-700">SDP:</label>
            <input
              type="number"
              v-model="productData.sdp"
              id="sdp"
              class="border px-2 py-1 w-full"
            />
          </div>
          <div class="mb-4">
            <label for="dp" class="inline-block text-gray-700">DP:</label>
            <input type="number" v-model="productData.dp" id="dp" class="border px-2 py-1 w-full" />
          </div>
          <div class="mb-4">
            <label for="tp" class="inline-block text-gray-700">TP:</label>
            <input type="number" v-model="productData.tp" id="tp" class="border px-2 py-1 w-full" />
          </div>
          <div class="mb-4">
            <label for="price" class="inline-block text-gray-700">MRP</label>
            <input
              type="number"
              v-model="productData.price"
              id="price"
              class="border px-2 py-1 w-full"
              required
            />
          </div>
        </div>

        <!-- Add more fields as necessary -->
        <div class="flex justify-end">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
            {{ props.product ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  product: Object
})

const productData = ref({
  name: '',
  image: '',
  description: '',
  quantityInStore: '',
  quantitySupplied: '',
  price: '',
  group: '',
  packSize: '',
  sdp: '',
  dp: '',
  tp: ''
  // Add more fields as necessary
})

watch(
  () => props.product,
  (newVal) => {
    if (newVal) {
      productData.value = { ...newVal }
    } else {
      productData.value = {
        name: '',
        image: '',
        description: '',
        quantityInStore: '',
        quantitySupplied: '',
        price: '',
        group: '',
        packSize: '',
        sdp: '',
        dp: '',
        tp: ''
        // Reset other fields as necessary
      }
    }
  },
  { immediate: true }
)

const emit = defineEmits(['save'])

const submitForm = () => {
  emit('save', productData.value)
  productData.value = {
    name: '',
    image: '',
    description: '',
    quantityInStore: '',
    quantitySupplied: '',
    price: '',
    group: '',
    packSize: '',
    sdp: '',
    dp: '',
    tp: ''
  }
}
</script>

<style scoped>
/* Add any additional styling here */
</style>
