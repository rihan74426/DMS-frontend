<template>
  <div class="min-h-screen mx-auto p-4 pt-20 bg-gradient-to-r from-purple-500 to-blue-500">
    <div class="ml-60">
      <h1 class="text-4xl font-bold text-white text-center mb-6">{{ storeDetails.storeName }}</h1>

      <!-- Store Details Section -->

      <div class="bg-white shadow-md rounded-lg p-6 mb-8 m-10 grid grid-cols-2 gap-6">
        <div>
          <h2 class="text-2xl font-semibold mb-4">Store Details</h2>
          <p class="p-2"><strong>Store Name:</strong> {{ storeDetails.storeName }}</p>
          <p class="p-2"><strong>Store Proprietor:</strong> {{ storeDetails.storeManager }}</p>
          <p class="p-2"><strong>Store Email:</strong> {{ storeDetails.storeEmail }}</p>
          <p class="p-2"><strong>Store Contact:</strong> {{ storeDetails.storePhone }}</p>
          <p class="p-2"><strong>Store Location:</strong> {{ storeDetails.storeAddress }}</p>
          <button
            @click="openStoreDetailsModal"
            class="mt-4 px-4 py-2 bg-purple-600 text-white font-bold rounded-md overflow-hidden transform transition-all hover:scale-105 duration-100"
          >
            Edit Store Details
          </button>
        </div>
        <div>
          <h2 class="text-2xl font-semibold mb-4 text-end">Products in the store</h2>
          <div v-if="storeDetails.products.length > 0">
            <table class="min-w-full bg-white border border-gray-200">
              <thead>
                <tr class="bg-gray-100 text-dark uppercase text-sm leading-normal">
                  <th class="py-2 px-2 text-center">Pack</th>
                  <th class="py-2 px-2 text-center">group</th>
                  <th class="py-2 px-2 text-center">MRP</th>
                  <th class="py-2 px-2 text-center">Name</th>
                  <th class="py-2 px-2 text-center">No.</th>
                </tr>
              </thead>
              <tbody class="text-dark font-light">
                <tr
                  v-for="product in storeDetails.products"
                  :key="product._id"
                  class="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td class="py-2 px-2 text-center">{{ product.packSize }}</td>
                  <td class="py-2 px-2 text-center">{{ product.group }}</td>
                  <td class="py-2 px-2 text-center">{{ product.price }}</td>
                  <td class="py-2 px-2 text-center">{{ product.name }}</td>
                  <td class="py-2 px-2 text-center">
                    {{ storeDetails.products.indexOf(product) + 1 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4 v-else class="text-end">
            Your products will be listed here after completing an order
          </h4>
        </div>
      </div>

      <!-- Orders Section -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-8 m-10">
        <h2 class="text-2xl font-semibold mb-4">Orders</h2>
        <div v-if="orders.length > 0">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-100 text-dark uppercase text-sm leading-normal">
                <th class="py-2 px-2 text-center">No.</th>
                <th class="py-2 px-2 text-center">Invoice</th>
                <th class="py-2 px-2 text-center">Product</th>
                <th class="py-2 px-2 text-center">Quantity</th>
                <th class="py-2 px-2 text-center">Ordered On</th>
                <th class="py-2 px-2 text-center">Status</th>
                <th class="py-2 px-2 text-center">Total bill</th>
                <th class="py-2 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="text-dark font-light">
              <tr
                v-for="order in orders"
                :key="order._id"
                class="border-b border-gray-200 hover:bg-gray-100"
              >
                <td class="py-2 px-2 text-center">
                  {{ orders.indexOf(order) + 1 }}
                </td>
                <td class="py-2 px-2 text-center">{{ order.invoice }}</td>
                <td class="py-2 px-2 text-center">{{ findThings(order.productId) }}</td>
                <td class="py-2 px-2 text-center">{{ order.quantity }}</td>
                <td class="py-2 px-2 text-center">{{ timeCon(order.orderDate) }}</td>
                <td class="py-2 px-2 text-center">{{ order.status }}</td>
                <td class="py-2 px-2 text-center">{{ order.price }}</td>
                <td class="py-2 px-2 text-center flex">
                  <button
                    @click="openOrderModal(order)"
                    class="ml-4 px-3 py-1 bg-blue-600 text-white rounded-md overflow-hidden transform transition-all hover:scale-105 duration-100 hover:bg-blue-700"
                  >
                    <EditIcon />
                  </button>
                  <button
                    @click="deleteOrder(order._id)"
                    class="ml-2 px-3 py-1 bg-red-600 text-white rounded-md overflow-hidden transform transition-all hover:scale-105 duration-100 hover:bg-red-700"
                  >
                    <Trash2Icon />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4 v-else>You don't have any Orders yet!</h4>
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
      <OrderComp
        v-if="showOrderModal"
        :order="selectedOrder"
        @close="closeOrderModal"
        @save="saveOrder"
      />
    </div>
  </div>
  <div
    v-if="loading"
    class="fixed inset-0 flex items-center justify-center bg-black z-50 bg-opacity-50"
  >
    <l-grid size="80" speed="2" color="purple"></l-grid>
  </div>
  <ModalComp
    :show="showModal"
    :title="modalTitle"
    :message="modalMessage"
    @close="showModal = false"
  />
</template>

<script setup>
import { onMounted, onUpdated, ref } from 'vue'
import StoreComp from '@/components/StoreComp.vue'
import OrderComp from '@/components/OrderComp.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { grid } from 'ldrs'
import ModalComp from '@/components/ModalComp.vue'
import { DeleteIcon, EditIcon, Trash2Icon } from 'lucide-vue-next'

grid.register()
onMounted(async () => {
  loading.value = true // Set loader to true when data fetching starts
  try {
    await authStore.fetchStore()
    await authStore.fetchOrders()
    await authStore.fetchProducts()
    storeDetails.value = authStore.store
    orders.value = authStore.orders
    products.value = authStore.products.value
  } catch (error) {
    console.error('Failed to fetch store data:', error)
  } finally {
    loading.value = false // Make sure loader is turned off after fetching completes
  }
})
onUpdated(async () => {
  await authStore.fetchStore()
  await authStore.fetchOrders()
  storeDetails.value = authStore.store
  orders.value = authStore.orders
})
const authStore = useAuthStore()
const products = ref([])
// Sample store details, products, and orders for demonstration
const storeDetails = ref({
  storeName: '',
  storeManager: '',
  storeEmail: '',
  storePhone: '',
  storeAddress: '',
  products: []
})

const orders = ref([])
const timeCon = (time) => {
  const date = new Date(time).toLocaleDateString()
  const yyyyMMdd = date.slice(0, 10)
  return yyyyMMdd
}

const findThings = (productId) => {
  const product = products.value.filter((el) => el._id == productId)
  if (product[0]) return product[0].name
}
const showStoreDetailsModal = ref(false)
const showOrderModal = ref(false)
const selectedOrder = ref(null)

const loading = ref(false)
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

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
    await axios.put('http://localhost:5000/api/auth/store', newDetails, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // Bearer token for authentication
      }
    })
    showModal.value = true
    modalTitle.value = 'Success'
    modalMessage.value = 'Store Updated Successfully'
  } catch (error) {
    showModal.value = true
    modalTitle.value = 'Failure'
    modalMessage.value = 'Failed to update the Store!'
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
  if (order._id) {
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/orders/${order._id}`, order)
      const index = orders.value.findIndex((o) => o._id === order._id)
      orders.value[index] = response.data
    } catch (err) {
      console.log('Error updating Order', err)
    }
  } else {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/orders', order, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Bearer token for authentication
        }
      })
      orders.value.push(data)
    } catch (err) {
      console.log('Error Creating order', err)
    }
  }
  closeOrderModal()
}

const deleteOrder = async (id) => {
  confirm('Are you Sure?')
  await axios.delete(`http://localhost:5000/api/auth/orders/${id}`)
  orders.value = orders.value.filter((order) => order.id !== id)
}
</script>

<style scoped>
/* Customize styles for smooth animations, transitions, and buttons here */
</style>
