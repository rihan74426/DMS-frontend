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
          <div class="flex space-x-2 grid grid-cols-2">
            <button
              class="bg-blue-500 m-2 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              @click="viewOrder(order)"
            >
              View
            </button>
            <button
              class="bg-yellow-500 m-2 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
              @click="openOrderModal({ ...order, storeName: filterStore(order.userId).storeName })"
            >
              Edit
            </button>
            <button
              class="bg-red-500 m-2 text-white py-2 px-4 rounded-md hover:bg-red-600"
              @click="deleteOrder(order._id)"
            >
              Delete
            </button>
            <button
              class="bg-red-500 m-2 text-white py-2 px-4 rounded-md hover:bg-red-600"
              @click="generatePDF(filterStore(order.userId), order, authStore.user)"
            >
              Print Voucher
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
    <Transition name="modal">
      <OrderViewComp
        v-if="ShowView"
        :show-modal="ShowView"
        :order="selectedOrder"
        :store="filterStore(selectedOrder.userId)"
        :user="filterUser(selectedOrder.userId)"
        @close="closeViewModal"
        @save="editOrder"
      />
    </Transition>
  </div>
</template>
<script setup>
import ModalComp from '@/components/ModalComp.vue'
import OrderComp from '@/components/OrderComp.vue'
import OrderViewComp from '@/components/OrderViewComp.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

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

const ShowView = ref(false)

// Fetching orders from the stor
onMounted(async () => {
  await authStore.fetchAllOrders()
  await authStore.fetchUser()
  await authStore.fetchProducts()
  await authStore.fetchAllStores()
  users.value = authStore.users
  orders.value = authStore.allOrders.toReversed()
  products.value = authStore.products.value
  stores.value = authStore.allStores

  console.log(orders.value)
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
  selectedOrder.value = order
  ShowView.value = true
  // Add navigation to the order details page or show modal
}

const openOrderModal = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
}
const closeViewModal = () => {
  ShowView.value = false
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

function generatePDF(store, order, user) {
  // Create a new jsPDF instance
  const doc = new jsPDF()

  // Add the blue-purple gradient background
  // const gradientSteps = 20 // Number of steps for the gradient effect
  // const startColor = [76, 110, 245] // Blue color (RGB)
  // const endColor = [106, 0, 244] // Purple color (RGB)
  // const pageHeight = 297 // A4 height in mm
  // const stepHeight = pageHeight / gradientSteps // Height of each gradient step

  // for (let i = 0; i <= gradientSteps; i++) {
  //   const ratio = i / gradientSteps
  //   const red = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]))
  //   const green = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]))
  //   const blue = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]))

  //   doc.setFillColor(red, green, blue)
  //   doc.rect(0, i * stepHeight, 210, stepHeight, 'F')
  // }

  // // Set white text color for better readability on gradient
  // doc.setTextColor('#ffffff')

  // Store Details (left column)
  doc.setFontSize(14)
  doc.text('Store Details', 15, 20)
  doc.setFontSize(12)
  doc.text(`Store Name: ${store.storeName}`, 15, 30)
  doc.text(`Location: ${store.storeAddress}`, 15, 40)
  doc.text(`Contact: ${store.storePhone}`, 15, 50)

  // Order and User Details (right column)
  doc.setFontSize(14)
  doc.text(`Invoice #: ${order.invoice}`, 110, 20)
  doc.setFontSize(12)
  doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 110, 30)
  doc.text(`Prepared by: ${user.username}`, 110, 40)
  doc.text(`Order ID: ${order._id}`, 110, 50)
  doc.text(`Order Status: ${order.status}`, 110, 60)

  // Fetch product details
  const orderItems = filterProduct(order.productId)
  const product = [
    orderItems.name,
    `${order.quantity} pcs`,
    `${orderItems.price.toFixed(2)}/- tk`,
    `${orderItems.packSize}`,
    `${order.price}/- tk`
  ]

  // The key fix: Wrap the product array inside another array to create a row
  doc.autoTable({
    startY: 70, // Position after header content
    head: [['Product', 'Quantity', 'Price', 'Pack Size', 'Total']],
    body: [product], // This should be a 2D array
    styles: {
      fillColor: [34, 34, 34], // Dark background for table rows
      textColor: [255, 255, 255] // White text color for table content
    },
    headStyles: {
      fillColor: [29, 78, 216],
      textColor: [255, 255, 255] // Blue for table header
    },
    alternateRowStyles: {
      // Disable alternating row styles
      fillColor: false,
      textColor: false
    }
  })

  // Display total at the bottom of the table
  doc.setFontSize(14)
  doc.text(`Total: ${order.price.toFixed(2)}/- tk`, 150, doc.lastAutoTable.finalY + 10)

  // Save the PDF
  doc.save(`Order_${order.invoice}.pdf`)
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
