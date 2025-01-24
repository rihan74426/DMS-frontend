<template>
  <div>
    <div class="min-h-screen mx-auto p-4 pt-20">
      <div :class="{ 'ml-60': roleBind() }">
        <h1 class="text-4xl font-bold text-white text-center mb-6">{{ storeDetails.storeName }}</h1>

        <!-- Store Details Section -->

        <div class="bg-white shadow-md rounded-lg p-6 mb-8 m-5 grid sm:grid-cols-2 gap-6">
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
          <div class=" ">
            <h2 class="text-2xl font-semibold mb-4 text-end">Products in the store</h2>
            <div v-if="storeProducts.length > 0" class="flex place-content-end">
              <table v-if="!loading" class="min-w-4/5 bg-white border border-gray-200">
                <thead>
                  <tr class="bg-gray-100 text-dark uppercase text-sm leading-normal">
                    <th class="py-2 px-2 text-center">Img</th>
                    <th class="py-2 px-2 text-center">Name</th>
                    <th class="py-2 px-2 text-center">Pack</th>
                    <th class="py-2 px-2 text-center">group</th>
                    <th class="py-2 px-2 text-center">MRP</th>
                    <th class="py-2 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody class="text-dark font-light">
                  <tr
                    v-for="product in storeProducts"
                    :key="storeProducts.indexOf(product) + Math.random()"
                    class="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td class="px-2 text-center flex place-content-center">
                      <div class="items-center">
                        <img
                          :src="product ? product.image : ''"
                          alt="product image"
                          class="object-contain relative h-12 w-12"
                        />
                      </div>
                    </td>
                    <td v-if="product" class="py-2 px-2 text-center">{{ product.name }}</td>
                    <td v-if="product" class="py-2 px-2 text-center">{{ product.packSize }}</td>
                    <td v-if="product" class="py-2 px-2 text-center">{{ product.group }}</td>
                    <td v-if="product" class="py-2 px-2 text-center">{{ product.price }}/-</td>
                    <td v-if="product" class="py-2 px-2 text-center">
                      <button @click="deleteStoreProduct(product)">
                        <Trash2Icon />
                      </button>
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
        <div class="bg-white shadow-md rounded-lg p-6 mb-5 m-3">
          <h2 class="text-2xl text-center font-semibold mb-4">Your Orders</h2>
          <p
            v-if="!storeCheck() && !userCheck()"
            class="text-center font-semibold m-2 text-red-500"
          >
            You need to set your profile and store completely to make an order!
            <RouterLink to="/profile" class="text-blue-500 underline">
              go to your Profile</RouterLink
            >
          </p>
          <button
            @click="openOrderModal()"
            class="m-4 p-2 bg-green-600 text-white font-bold rounded-md overflow-hidden transform transition-all hover:scale-105 hover:bg-green-700 duration-500 ease-in-out"
          >
            Order Something
          </button>
          <div
            v-for="order in orders"
            :key="order._id"
            class="border border-gray-200 rounded-lg mb-4 shadow-md p-4"
          >
            <div class="flex justify-between">
              <div>
                <h3 class="text-lg font-semibold"><strong>Invoice</strong> #{{ order.invoice }}</h3>
                <p><strong>Order Date:</strong> {{ timeCon(order.orderDate) }}</p>
                <p><strong>Order Status:</strong> {{ order.status }}</p>
              </div>
              <div class="text-right pt-5">
                <p>
                  Total Bill: <strong>{{ order.price }}/-</strong>
                </p>
                <p>
                  Payment Status: <strong>{{ order.payment }}</strong>
                </p>
              </div>
            </div>

            <!-- Products Table -->
            <table class="min-w-full bg-white mt-4 border border-gray-300">
              <thead class="bg-gray-100">
                <tr>
                  <th class="py-2 px-2 text-center">Product</th>
                  <th class="py-2 px-2 text-center">Pack Size</th>
                  <th class="py-2 px-2 text-center">Group</th>
                  <th class="py-2 px-2 text-center">Quantity</th>
                  <th class="py-2 px-2 text-center">Total price</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in order.products"
                  :key="product._id"
                  class="border-b border-gray-200"
                >
                  <td class="py-2 px-2 text-center">
                    {{
                      findThings(product.productId)[0]
                        ? findThings(product.productId)[0].name
                        : 'loading...'
                    }}
                  </td>
                  <td class="py-2 px-2 text-center">
                    {{
                      findThings(product.productId)[0]
                        ? findThings(product.productId)[0].packSize
                        : 'Not set'
                    }}
                  </td>
                  <td class="py-2 px-2 text-center">
                    {{
                      findThings(product.productId)[0]
                        ? findThings(product.productId)[0].group
                        : 'Not set'
                    }}
                  </td>
                  <td class="py-2 px-2 text-center">{{ product.quantity }}</td>
                  <td class="py-2 px-2 text-center">
                    {{
                      findThings(product.productId)[0]
                        ? findThings(product.productId)[0].price * product.quantity
                        : 'loading...'
                    }}/-
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="flex justify-end mt-4">
              <button
                v-if="order.status !== 'canceled'"
                @click="deleteOrder(order)"
                class="ml-2 p-2 bg-red-600 text-white rounded-md overflow-hidden transform transition-all hover:scale-105 duration-100 hover:bg-red-700"
              >
                Cancel Order
              </button>
            </div>
          </div>

          <!-- <h4 v-else>You don't have any Orders yet!</h4> -->
        </div>

        <!-- Modals -->
        <Transition name="modal">
          <StoreComp
            v-if="showStoreDetailsModal"
            @close="closeStoreDetailsModal"
            @save="updateStoreDetails"
            :store="storeDetails"
          />
        </Transition>
        <Transition name="modal">
          <OrderComp
            v-if="showOrderModal"
            :order="selectedOrder"
            @close="closeOrderModal"
            @save="saveOrder"
          />
        </Transition>
      </div>
    </div>
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center bg-black z-50 bg-opacity-50"
    >
      <l-grid size="80" speed="2" color="purple"></l-grid>
    </div>
    <Transition name="modal">
      <ModalComp
        :show="showModal"
        :title="modalTitle"
        :message="modalMessage"
        @close="showModal = false"
      />
    </Transition>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import StoreComp from '@/components/StoreComp.vue'
import OrderComp from '@/components/OrderComp.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import ModalComp from '@/components/ModalComp.vue'
import { Trash2Icon } from 'lucide-vue-next'
import { grid } from 'ldrs'

grid.register()

// Default values shown
onBeforeMount(async () => {
  try {
    loading.value = true // Set loader to true when data fetching starts
    await authStore.fetchStore()
    await authStore.fetchOrders()
    await authStore.fetchProducts()
    await authStore.fetchUser()
    products.value = authStore.products.value
    storeDetails.value = authStore.store
    orders.value = authStore.orders.toReversed()
    console.log(storeDetails.value.products)
  } catch (error) {
    console.error('Failed to fetch store data:', error)
  } finally {
    loading.value = false // Make sure loader is turned off after fetching completes
    storeProd()
  }
})
onMounted(async () => {
  await authStore.fetchStore()
  await authStore.fetchOrders()
  await authStore.fetchUser()
  storeDetails.value = authStore.store
  orders.value = authStore.orders.toReversed()
  storeProd()
  console.log(storeDetails.value)
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
const roleBind = () => {
  if (authStore.user) {
    if (authStore.user.role == 'admin') return true
  } else {
    return false
  }
}
const storeProducts = ref([])
const orders = ref([])
const timeCon = (time) => {
  const date = new Date(time).toLocaleDateString()
  const yyyyMMdd = date.slice(0, 10)
  return yyyyMMdd
}

const findThings = (productId) => {
  const product = products.value.filter((el) => el._id == productId)
  if (orders.value && product) return product

  // productId.map((val, index) => {
  //   return product
  // })
}

const storeProd = () => {
  if (storeDetails.value.products) {
    storeDetails.value.products.forEach((productId, index) => {
      storeProducts.value[index] = products.value.filter((el) => el._id == productId)[0]
    })
  }
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
    const newStore = await axios.put(
      'https://dms-backend-server2.vercel.app/api/auth/store',
      newDetails,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Bearer token for authentication
        }
      }
    )
    storeDetails.value = newStore.data
    showModal.value = true
    modalTitle.value = 'Success'
    modalMessage.value = 'Store Updated Successfully'
  } catch (error) {
    showModal.value = true
    modalTitle.value = 'Failure'
    modalMessage.value = 'Failed to update the Store!'
    console.log(error)
  }
  closeStoreDetailsModal()
}
const deleteStoreProduct = async (product) => {
  try {
    const response = await axios.delete(
      `https://dms-backend-server2.vercel.app/api/auth/store/${product._id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Bearer token for authentication
        }
      }
    )
    console.log('response:', response.data)
    const index = storeDetails.value.products.indexOf(product._id)
    storeProducts.value.splice(index, 1)
    showModal.value = true
    modalTitle.value = 'Success'
    modalMessage.value = 'Store Updated Successfully'
  } catch (error) {
    showModal.value = true
    modalTitle.value = 'Failure'
    modalMessage.value = 'Failed to update the Store!'
    console.log(error)
  }
}
const storeCheck = () => {
  if (
    storeDetails.value.storeName === 'Your Store' &&
    storeDetails.value.storeAddress === 'Ex: Bahaddarhat, Chattogram' &&
    storeDetails.value.storePhone === '01xxx-xxxxxx' &&
    storeDetails.value.storeManager === 'Your Store Manager'
  ) {
    return false // Invalid store details
  }
  return true // Valid store details
}

const userCheck = () => {
  const user = authStore.user
  if (!user.phone || !user.address) {
    return false // Invalid user details
  }
  return true // Valid user details
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
      const response = await axios.put(
        `https://dms-backend-server2.vercel.app/api/auth/orders/${order._id}`,
        order
      )
      const index = orders.value.findIndex((o) => o._id === order._id)
      orders.value[index] = response.data
      showModal.value = true
      modalTitle.value = 'Success'
      modalMessage.value = 'Order updated Successfully! will be transfered to the store'
    } catch (error) {
      showModal.value = true
      modalTitle.value = 'Failure'
      modalMessage.value = 'Failed to place the Order! please try again'
      console.log('Error updating Order', error)
    }
  } else {
    try {
      if (storeCheck() && userCheck()) {
        const { data } = await axios.post(
          'https://dms-backend-server2.vercel.app/api/auth/orders',
          order,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` // Bearer token for authentication
            }
          }
        )
        orders.value.push(data)
        showModal.value = true
        modalTitle.value = 'Success'
        modalMessage.value = 'Order Created Successfully'
      } else {
        showModal.value = true
        modalTitle.value = 'Warning!'
        modalMessage.value = 'Please set up your profile and store details before placing an order'
      }
    } catch (error) {
      showModal.value = true
      modalTitle.value = 'Failure'
      modalMessage.value = 'Failed to create the order! please try again'
      console.log('Error Creating order', error)
    }
  }
  closeOrderModal()
}

const deleteOrder = async (order) => {
  if (confirm('Are you Sure?'))
    try {
      order.status = 'canceled'
      await axios.put(`https://dms-backend-server2.vercel.app/api/auth/orders/${order._id}`, {
        ...order
      })

      showModal.value = true
      modalTitle.value = 'Success'
      modalMessage.value = 'Your Order has canceled'
    } catch (error) {
      showModal.value = true
      modalTitle.value = 'Failure'
      modalMessage.value = 'Failed to cancel the order!'
    }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.modal-enter-from {
  transform: scale(0.5);
  opacity: 0;
}

.modal-enter-to {
  transform: scale(1);
  opacity: 1;
}

.modal-leave-from {
  transform: scale(1);
  opacity: 1;
}

.modal-leave-to {
  transform: scale(0.5);
  opacity: 0;
}

.order-enter-active,
.order-leave-active {
  transition: all 0.5s ease;
}

.order-enter-from {
  opacity: 0;
  transform: translateY(40px);
}

.order-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
</style>
