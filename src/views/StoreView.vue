<template>
  <div class="">
    <div class="min-h-screen bg-gradient-to-r from-purple-400 to-blue-500 p-8 w-5/6 ml-60 pt-20">
      <h1 class="text-4xl font-bold text-white text-center mb-6">My Store</h1>

      <!-- Store Details Section -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Store Details</h2>
        <p><strong>Store Name:</strong> {{ storeDetails.name }}</p>
        <p><strong>Owner:</strong> {{ storeDetails.owner }}</p>
        <p><strong>Location:</strong> {{ storeDetails.location }}</p>
        <button
          @click="openStoreDetailsModal"
          class="mt-4 px-4 py-2 bg-purple-600 text-white font-bold rounded-md overflow-hidden transform transition-all hover:scale-105 duration-500"
        >
          Edit Store Details
        </button>
      </div>

      <!-- Orders Section -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Orders</h2>
        <ul>
          <li v-for="order in orders" :key="order.id" class="mb-4">
            <strong>Order #{{ order.id }}:</strong> {{ order.details }}
            <button
              @click="openOrderModal(order)"
              class="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md overflow-hidden transform transition-all hover:scale-105 duration-500 hover:bg-blue-700 transition duration-500"
            >
              Edit
            </button>
            <button
              @click="deleteOrder(order.id)"
              class="ml-2 px-3 py-1 bg-red-600 text-white rounded-md overflow-hidden transform transition-all hover:scale-105 duration-300 hover:bg-red-700 transition duration-500"
            >
              Delete
            </button>
          </li>
        </ul>
        <button
          @click="openOrderModal()"
          class="mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded-md overflow-hidden transform transition-all hover:scale-105 duration-300 hover:bg-green-700 transition duration-500 ease-in-out"
        >
          Add New Order
        </button>
      </div>

      <!-- Modals -->
      <Transition name="fade">
        <StoreComp
          v-if="showStoreDetailsModal"
          @close="closeStoreDetailsModal"
          @save="updateStoreDetails"
          :store="storeDetails"
        />
      </Transition>
      <Transition name="fade">
        <OrderComp
          v-if="showOrderModal"
          :order="selectedOrder"
          @close="closeOrderModal"
          @save="saveOrder"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StoreComp from '@/components/StoreComp.vue'
import OrderComp from '@/components/OrderComp.vue'
// Sample store details, products, and orders for demonstration
const storeDetails = ref({
  name: 'Cool Gadgets Store',
  owner: 'John Doe',
  location: '123 Market St, Cityville'
})

const orders = ref([
  { id: 1, details: 'Order 1: 5x Cool Gadget' },
  { id: 2, details: 'Order 2: 3x Awesome Gadget' }
])

const showStoreDetailsModal = ref(false)
const showOrderModal = ref(false)
const selectedOrder = ref(null)

// Store modal controls
const openStoreDetailsModal = () => {
  showStoreDetailsModal.value = true
}

const closeStoreDetailsModal = () => {
  showStoreDetailsModal.value = false
}

const updateStoreDetails = (newDetails) => {
  storeDetails.value = newDetails
  closeStoreDetailsModal()
}

// Order modal controls
const openOrderModal = (order = null) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
}

const saveOrder = (order) => {
  if (order.id) {
    const index = orders.value.findIndex((o) => o.id === order.id)
    orders.value[index] = order
  } else {
    orders.value.push({ ...order, id: orders.value.length + 1 })
  }
  closeOrderModal()
}

const deleteOrder = (id) => {
  orders.value = orders.value.filter((order) => order.id !== id)
}
</script>

<style scoped>
/* Customize styles for smooth animations, transitions, and buttons here */
</style>
