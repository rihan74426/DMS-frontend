<template>
  <div class="min-h-screen mx-auto p-4 pt-20 ml-60 pl-10">
    <h1 class="text-4xl font-bold text-white text-center mb-6">Orders ({{ orders.length }})</h1>
    <h4 class="text-xl font-bold text-white text-center mb-6">
      Completed: {{ authStore.allOrders.filter((el) => el.status == 'completed').length }} -
      Pending: {{ authStore.allOrders.filter((el) => el.status == 'pending').length }} - Canceled:
      {{ authStore.allOrders.filter((el) => el.status == 'canceled').length }}
    </h4>
    <div v-if="!loading">
      <div class="flex place-content-center">
        <div class="text-xl font-bold text-white text-center mb-6 mr-6">
          <input type="checkbox" class="h-5 w-5 m-2" id="checkbox" v-model="showPending" />
          <label for="checkbox">Show only pending </label>
        </div>
        <div class="text-xl font-bold text-white text-center mb-6">
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
              <p class="text-gray-600">Customer email: {{ filterUser(order.userId).email }}</p>
              <!-- <p class="text-gray-600">Product: {{ filterProduct(order.productId).name }}</p> -->

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
              <!-- <p class="text-gray-600">Pack Size: {{ filterProduct(order.productId).packSize }}</p>
            <p class="text-gray-600">Product MRP: {{ filterProduct(order.productId).price }}</p> -->
            </div>
            <div>
              <p class="text-gray-600">
                Total bill: <strong>৳ {{ order.price }}/-</strong>
              </p>
              <p class="text-gray-600">
                Payment status: <strong>৳ {{ order.payment }}</strong>
              </p>
            </div>
            <div class="flex space-x-2 grid grid-cols-2">
              <button
                class="bg-blue-500 m-2 text-white p-2 rounded-md hover:bg-blue-600"
                @click="viewOrder(order)"
              >
                View
              </button>
              <button
                class="bg-yellow-500 m-2 text-white p-2 rounded-md hover:bg-yellow-600"
                @click="
                  openOrderModal({ ...order, storeName: filterStore(order.userId).storeName })
                "
              >
                Edit
              </button>
              <button
                class="bg-red-500 m-2 text-white p-2 rounded-md hover:bg-red-600"
                @click="deleteOrder(order._id)"
              >
                Delete
              </button>
              <button
                class="bg-green-500 m-2 text-white p-2 rounded-md hover:bg-green-600"
                @click="generatePDF(filterStore(order.userId), order, authStore.user)"
              >
                Print Invoice
              </button>
              <button
                :disabled="order.status == 'canceled'"
                class="bg-green-500 m-2 text-white p-2 rounded-md hover:bg-green-600"
                @click="markPaid(order, order.payment == 'Paid' ? 'Unpaid' : 'Paid')"
              >
                Mark {{ order.payment == 'Paid' ? 'unpaid' : 'paid' }}
              </button>
              <button
                :disabled="order.status == 'canceled'"
                class="bg-green-500 text-white p-2 m-2 rounded-md hover:bg-green-600"
                @click="markComplete(order, order.status == 'pending' ? 'completed' : 'pending')"
              >
                Mark {{ order.status == 'pending' ? 'completed' : 'pending' }}
              </button>
            </div>
          </div>
          <table class="min-w-full bg-white mt-4 border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-2 px-2 text-center">Product</th>
                <th class="py-2 px-2 text-center">Pack Size</th>
                <th class="py-2 px-2 text-center">Group</th>
                <th class="py-2 px-2 text-center">MRP</th>
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
                    filterProduct(product.productId)[0]
                      ? filterProduct(product.productId)[0].name
                      : 'loading...'
                  }}
                </td>
                <td class="py-2 px-2 text-center">
                  {{
                    filterProduct(product.productId)[0]
                      ? filterProduct(product.productId)[0].packSize
                      : 'Not set'
                  }}
                </td>
                <td class="py-2 px-2 text-center">
                  {{
                    filterProduct(product.productId)[0]
                      ? filterProduct(product.productId)[0].group
                      : 'Not set'
                  }}
                </td>
                <td class="py-2 px-2 text-center">
                  {{
                    filterProduct(product.productId)[0]
                      ? filterProduct(product.productId)[0].price
                      : 'MRP'
                  }}/-
                </td>
                <td class="py-2 px-2 text-center">{{ product.quantity }}</td>
                <td class="py-2 px-2 text-center">
                  {{
                    filterProduct(product.productId)[0]
                      ? filterProduct(product.productId)[0].price * product.quantity
                      : 'loading...'
                  }}/-
                </td>
              </tr>
            </tbody>
          </table>
        </li>
      </transition-group>
    </div>
    <div v-else class="fixed inset-0 flex items-center z-50 justify-center">
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

const loading = ref(false)

// Fetching orders from the stor
onMounted(async () => {
  try {
    loading.value = true

    await authStore.fetchAllOrders()
    await authStore.fetchUser()
    await authStore.fetchProducts()
    await authStore.fetchAllStores()
    users.value = authStore.users
    orders.value = authStore.allOrders.toReversed()
    products.value = authStore.products.value
    stores.value = authStore.allStores
  } catch (err) {
    loading.value = false
    console.log('error fetching orders:  ', err)
  }
  loading.value = false
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
  const product = products.value.filter((el) => el._id == id)
  if (orders.value && product) return product
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
const markPaid = async (order, status) => {
  try {
    order.payment = status
    const response = await axios.put(`http://localhost:5000/api/auth/orders/${order._id}`, order)
    const index = orders.value.findIndex((o) => o._id === order._id)
    orders.value[index] = response.data
    showModal.value = true
    modalTitle.value = 'Success'
    modalMessage.value = 'Marked as ' + status
  } catch (error) {
    showModal.value = true
    modalTitle.value = 'Failure'
    modalMessage.value = 'Failed to mark as ' + status
    console.log('Error updating Order', error)
  } // Show modal with form to edit the order
}
const markComplete = async (order, status) => {
  try {
    order.status = status
    const response = await axios.put(`http://localhost:5000/api/auth/orders/${order._id}`, order)
    const index = orders.value.findIndex((o) => o._id === order._id)
    orders.value[index] = response.data
    showModal.value = true
    modalTitle.value = 'Success'
    modalMessage.value = 'Marked as ' + status
  } catch (error) {
    showModal.value = true
    modalTitle.value = 'Failure'
    modalMessage.value = 'Failed to mark as ' + status
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
  doc.setFontSize(20)
  doc.text('Distribution Management Software', 50, 20)

  // Store Details (left column)
  doc.setFontSize(12)
  doc.text('Store Details', 15, 40)
  doc.setFontSize(10)
  doc.text(`Customer Name: ${filterUser(order.userId).username}`, 15, 47)
  doc.text(`Customer Contact: ${filterUser(order.userId).phone}`, 15, 54)
  doc.text(`Store Name: ${store.storeName}`, 15, 61)
  doc.text(`Proprietor: ${store.storeManager}`, 15, 68)
  doc.text(`Store Address: ${store.storeAddress}`, 15, 74)
  doc.text(`Store Contact: ${store.storePhone}`, 15, 80)

  // Order and User Details (right column)
  doc.setFontSize(15)
  doc.text(`Invoice #: ${order.invoice}`, 130, 40)
  doc.setFontSize(10)
  doc.text(`Invoice Date: ${new Date().toLocaleString()}`, 130, 47)
  doc.text(`Prepared by: ${user.username}`, 130, 54)
  doc.text(`Order ID: ${order._id}`, 130, 61)
  doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 130, 68)
  doc.text(`Order Status: ${order.status}`, 130, 74)
  doc.text(`Order Bill Total: ${order.price}`, 130, 80)
  doc.text(`Payment Status: ${order.payment}`, 130, 87)

  // Fetch product details for each product in the order
  const productsData = order.products.map((productItem) => {
    const orderItem = filterProduct(productItem.productId)[0]
    return [
      orderItem.name, // Product name
      `${productItem.quantity} pcs`, // Quantity
      `${orderItem.packSize}`, // Pack size
      `${orderItem.group}`, // Pack size
      `${orderItem.price.toFixed(2)}/- tk`, // Price per unit
      `${(orderItem.price * productItem.quantity).toFixed(2)}/- tk` // Total for that product
    ]
  })

  // Generate the product table with multiple products
  doc.autoTable({
    startY: 90, // Position after header content
    head: [['Product', 'Quantity', 'Pack Size', 'group', 'MRP', 'Total']],
    body: productsData, // 2D array containing product details
    styles: {
      textColor: [34, 34, 34] // White text color for table content
    },
    headStyles: {
      fillColor: [29, 78, 216], // Blue for table header
      textColor: [255, 255, 255]
    }
  })

  // Calculate the total amount for the entire order
  const totalAmount = order.products.reduce((total, productItem) => {
    const orderItem = filterProduct(productItem.productId)[0]
    return total + orderItem.price * productItem.quantity
  }, 0)

  // Display total at the bottom of the table
  doc.setFontSize(12)
  doc.text(`Total: ${totalAmount.toFixed(2)}/- tk`, 150, doc.lastAutoTable.finalY + 10)

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
