<template>
  <div v-if="showModal" class="fixed z-20 inset-0 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
        >&#8203;</span
      >
      <div
        ref="clickOutside"
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <!-- Icon or image here -->
              <!-- <img
                :src="filterProduct(order.productId).image"
                alt="product Image"
                class="object-container"
              /> -->
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-xl leading-6 font-medium text-gray-900" id="modal-headline">
                Order Details
              </h3>
              <div class="mt-2">
                <p class="text-gray-500"><strong>Order ID:</strong> {{ order._id }}</p>
                <p class="text-gray-500"><strong>Invoice:</strong> {{ order.invoice }}</p>
                <p class="text-gray-500"><strong>Status:</strong> {{ order.status }}</p>
                <p class="text-gray-500"><strong>Total to be paid:</strong> {{ order.price }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-wrap sm:justify-center">
          <div class="w-full sm:w-1/2 sm:pr-4">
            <h4 class="text-xl leading-6 font-medium text-gray-900">Store Details</h4>
            <p class="text-gray-500"><strong>Store Name:</strong> {{ store.storeName }}</p>
            <p class="text-gray-500"><strong>Store Address:</strong> {{ store.storeAddress }}</p>
            <p class="text-gray-500"><strong>Store Proprietor:</strong> {{ store.storeManager }}</p>
            <p class="text-gray-500"><strong>Phone Number:</strong> {{ store.storePhone }}</p>
          </div>
          <div class="w-full sm:w-1/2 sm:pl-4">
            <h4 class="text-xl leading-6 font-medium text-gray-900">User Details</h4>
            <p class="text-gray-500"><strong>Username:</strong> {{ user.username }}</p>
            <p class="text-gray-500"><strong>Email:</strong> {{ user.email }}</p>
            <p class="text-gray-500"><strong>Phone:</strong> {{ user.phone }}</p>
            <p class="text-gray-500"><strong>Address:</strong> {{ user.address }}</p>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-wrap sm:justify-center">
          <button
            class="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            @click="emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const clickOutside = ref(null)

onClickOutside(clickOutside, () => {
  emit('close')
})
const authStore = useAuthStore()
const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  store: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  showModal: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['close'])

const filterProduct = (id) => {
  if (authStore.products) {
    return authStore.products.filter((el) => el._id == id)[0]
  }
}
</script>
