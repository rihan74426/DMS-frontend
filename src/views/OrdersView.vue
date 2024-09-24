<template>
  <div class="min-h-screen mx-auto p-4 pt-20 ml-60 pl-10">
    <h1 class="text-4xl font-bold text-white text-center mb-6">Orders ({{ orders.length }})</h1>
    <h4 class="text-2xl font-bold text-white text-center mb-6">
      Completed: {{ authStore.allOrders.filter((el) => el.status == 'completed').length }} pending:
      {{ authStore.allOrders.filter((el) => el.status !== 'completed').length }}
    </h4>
    <div class="flex place-content-center">
      <div class="text-2xl font-bold text-white text-center mb-6">
        <input type="checkbox" class="h-5 w-5 m-2" id="checkbox" v-model="showPending" />
        <label for="checkbox">Show only pending ||</label>
      </div>
      <div class="text-2xl font-bold text-white text-center mb-6">
        <input type="checkbox" class="h-5 w-5 m-2" id="checkbox" v-model="showCompleted" />
        <label for="checkbox">Show only completed</label>
      </div>
    </div>
    <transition-group name="fade" tag="ul" class="space-y-4">
      <li
        v-for="order in orders"
        :key="order._id"
        class="p-4 bg-white shadow rounded-md hover:bg-gray-50 transition-all duration-300"
      >
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-semibold text-xl">Invoice: {{ order.invoice }}</h2>
            <h2 class="font-bold text-xl">Status: {{ order.status }}</h2>
            <p class="text-gray-600">Customer: {{ filterUser(order.userId).username }}</p>
            <p class="text-gray-600">Customer contact: {{ filterUser(order.userId).phone }}</p>
            <p class="text-gray-600">Product: {{ filterProduct(order.productId).name }}</p>
            <p class="text-gray-600">Quantity: {{ order.quantity }}</p>
            <p class="text-gray-600">Total Price: ৳ {{ order.price }}/-</p>
            <p class="text-gray-500">
              Order Date: {{ new Date(order.orderDate).toLocaleDateString() }}
            </p>
          </div>
          <div>
            <h2 class="font-bold text-xl">Store Details:</h2>
            <p class="text-gray-600">Store Name: {{ filterStore(order.userId).storeName }}</p>
            <p class="text-gray-600">
              Delivery Address: {{ filterStore(order.userId).storeAddress }}
            </p>
            <p class="text-gray-600">
              Store proprietor: {{ filterStore(order.userId).storeManager }}
            </p>
            <p class="text-gray-600">Phone Number: {{ filterStore(order.userId).storePhone }}</p>
            <p class="text-gray-600">Email address: {{ filterUser(order.userId).email }}</p>
            <p class="text-gray-600">Pack Size: {{ filterProduct(order.productId).packSize }}</p>
            <p class="text-gray-600">Product MRP: {{ filterProduct(order.productId).price }}</p>
          </div>
          <div class="flex space-x-2">
            <button
              class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              @click="viewOrder(order)"
            >
              View
            </button>
            <button
              class="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
              @click="openOrderModal({ ...order, storeName: filterStore(order.userId).storeName })"
            >
              Edit
            </button>
            <button
              class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              @click="deleteOrder(order._id)"
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    </transition-group>
    <Transition name="modal">
      <ModalComp
        :show="showModal"
        :title="modalTitle"
        :message="modalMessage"
        @close="showModal = false"
      />
    </Transition>
    <Transition name="modal">
      <OrderComp
        v-if="showOrderModal"
        :order="selectedOrder"
        @close="closeOrderModal"
        @save="editOrder"
      />
    </Transition>
  </div>
</template>
<script setup>
import ModalComp from '@/components/ModalComp.vue'
import OrderComp from '@/components/OrderComp.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'

const authStore = useAuthStore()
const orders = ref([])
const products = ref([])
const users = ref([])
const stores = ref([])

const showPending = ref(false)
const showCompleted = ref(false)

const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const showOrderModal = ref(false)
const selectedOrder = ref(null)
// Fetching orders from the stor
onMounted(async () => {
  await authStore.fetchAllOrders()
  await authStore.fetchUser()
  await authStore.fetchProducts()
  await authStore.fetchAllStores()
  users.value = authStore.users
  orders.value = authStore.allOrders
  products.value = authStore.products.value
  stores.value = authStore.allStores
})

watch(
  () => showPending.value,
  (newVal) => {
    if (newVal == true) {
      orders.value = authStore.allOrders.filter((el) => el.status == 'pending')
    } else {
      orders.value = authStore.allOrders
    }
  }
)
watch(
  () => showCompleted.value,
  (newVal) => {
    if (newVal == true) {
      orders.value = authStore.allOrders.filter((el) => el.status == 'completed')
    } else {
      orders.value = authStore.allOrders
    }
  }
)

// onUpdated(() => {
//   if (showPending.value) {
//     orders.value = orders.value.filter((el) => el.status == 'pending')
//   } else {
//     orders.value = authStore.allOrders
//   }
// })

const filterUser = (id) => {
  return users.value.filter((el) => el._id == id)[0]
}
const filterProduct = (id) => {
  if (products.value) {
    return products.value.filter((el) => el._id == id)[0]
  }
}
const filterStore = (id) => {
  const store = stores.value.filter((el) => el.userId == id)[0]
  return store
}

// View order details
const viewOrder = (order) => {
  console.log('View order:', order)
  // Add navigation to the order details page or show modal
}

const openOrderModal = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
}
// Edit order
const editOrder = async (order) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/auth/orders/${order._id}`, order)
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
  } // Show modal with form to edit the order
}

// Delete order
const deleteOrder = async (id) => {
  confirm('Are you Sure?')
  try {
    await axios.delete(`http://localhost:5000/api/auth/orders/${id}`)
    orders.value = orders.value.filter((order) => order.id !== id)
    showModal.value = true
    modalTitle.value = 'Success'
    modalMessage.value = 'Order deleted Successfully'
  } catch (error) {
    showModal.value = true
    modalTitle.value = 'Failure'
    modalMessage.value = 'Failed to delete the order!'
    console.log('error deleting the order', error)
  }
}
</script>
<style lang="css" scoped>
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

.fade-enter-active,
.fade-leave-active {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.fade-enter-from {
  transform: scale(0.5);
  opacity: 0;
}

.fade-enter-to {
  transform: scale(1);
  opacity: 1;
}

.fade-leave-from {
  transform: scale(1);
  opacity: 1;
}

.fade-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
</style>
