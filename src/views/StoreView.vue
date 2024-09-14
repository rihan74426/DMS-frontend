<template>
  <div class="min-h-screen mx-auto p-4 pt-20 bg-gradient-to-r from-purple-500 to-blue-500">
    <div class="ml-60">
      <h1 class="text-4xl font-bold text-white text-center mb-6">{{ storeDetails.name }}</h1>

      <!-- Store Details Section -->

      <div class="bg-white shadow-md rounded-lg p-6 mb-8 m-10">
        <h2 class="text-2xl font-semibold mb-4">Store Details</h2>
        <p class="p-2"><strong>Store Name:</strong> {{ storeDetails.name }}</p>
        <p class="p-2"><strong>Store Proprietor:</strong> {{ storeDetails.manager }}</p>
        <p class="p-2"><strong>Store Email:</strong> {{ storeDetails.email }}</p>
        <p class="p-2"><strong>Store Contact:</strong> {{ storeDetails.number }}</p>
        <p class="p-2"><strong>Store Location:</strong> {{ storeDetails.location }}</p>
        <button
          @click="openStoreDetailsModal"
          class="mt-4 px-4 py-2 bg-purple-600 text-white font-bold rounded-md overflow-hidden transform transition-all hover:scale-105 duration-100"
        >
          Edit Store Details
        </button>
      </div>

      <!-- Orders Section -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-8 m-10">
        <h2 class="text-2xl font-semibold mb-4">Orders</h2>
        <ul>
          <li v-for="order in orders" :key="order.id" class="mb-4">
            <strong>Order #{{ order.id }}:</strong> {{ order.details }}
            <button
              @click="openOrderModal(order)"
              class="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md overflow-hidden transform transition-all hover:scale-105 duration-100 hover:bg-blue-700 transition duration-500"
            >
              Edit
            </button>
            <button
              @click="deleteOrder(order.id)"
              class="ml-2 px-3 py-1 bg-red-600 text-white rounded-md overflow-hidden transform transition-all hover:scale-105 duration-100 hover:bg-red-700 transition duration-500"
            >
              Delete
            </button>
          </li>
        </ul>
        <button
          @click="openOrderModal()"
          class="mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded-md overflow-hidden transform transition-all hover:scale-105 duration-100 hover:bg-green-700 transition duration-500 ease-in-out"
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
import { onMounted, ref } from 'vue'
import StoreComp from '@/components/StoreComp.vue'
import OrderComp from '@/components/OrderComp.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const authStore = useAuthStore()
// Sample store details, products, and orders for demonstration
const storeDetails = ref([])

const orders = ref([])

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
const token = localStorage.getItem('token')
const updateStoreDetails = async (newDetails) => {
  try {
    await axios.put('http://localhost:5000/api/auth/profile/store', newDetails, {
      headers: {
        Authorization: `Bearer ${token}` // Bearer token for authentication
      }
    })
    storeDetails.value = newDetails
  } catch (error) {
    console.log(error)
    console.log(newDetails)
  }
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

const saveOrder = async (order) => {
  if (order.id) {
    try {
      await axios.put('http://localhost:5000/api/auth/profile/order', order)
    } catch (err) {
      console.log(err)
    }
    const index = orders.value.findIndex((o) => o.id === order.id)
    orders.value[index] = order
  } else {
    try {
      await axios.post('http://localhost:5000/api/auth/profile/order', order)
    } catch (err) {
      console.log(err)
    }
    orders.value.push({ ...order, id: orders.value.length + 1 })
  }
  closeOrderModal()
}

const deleteOrder = async (id) => {
  await axios.delete('http://localhost:5000/api/auth/profile/order', id)
  orders.value = orders.value.filter((order) => order.id !== id)
}

onMounted(() => {
  orders.value = authStore.user.orders
  storeDetails.value = authStore.user.store
  console.log(orders.value, storeDetails.value)
})
</script>

<style scoped>
/* Customize styles for smooth animations, transitions, and buttons here */
</style>
