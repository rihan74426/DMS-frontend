<template>
  <div class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
    <div class="bg-white p-8 rounded-lg h-5/6 shadow-lg overflow-auto w-1/3 mb-5 mt-5">
      <h2 class="text-2xl font-semibold mb-4 text-center">
        {{ order ? 'Edit Order' : 'Add Order' }}
      </h2>
      <p class="font-semibold mb-4">Invoice no: {{ orderData.invoice }}</p>
      <p class="font-semibold mb-4">
        Store:
        {{ orderData.storeName }}
      </p>

      <label class="block mb-2">Select Product</label>
      <select v-model="orderData.productId" class="w-full mb-4 p-2 border rounded">
        <option v-for="product in authStore.products.value" :key="product._id" :value="product._id">
          {{ product.name }}
        </option>
      </select>
      <label class="block mb-2">Quantity:</label>
      <input
        required
        v-model="orderData.quantity"
        type="number"
        class="w-full p-2 border rounded-md mb-4"
      />
      <label v-if="order" class="block mb-2">Status:</label>
      <select
        v-if="order"
        v-model="orderData.status"
        type="text"
        class="w-full p-2 border rounded-md mb-4"
      >
        <option>pending</option>
        <option>completed</option>
      </select>
      <p class="font-semibold mb-4">
        Total Amount:
        {{ orderData.price }}
      </p>

      <div class="flex justify-end">
        <button @click="closeModal" class="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md">
          Cancel
        </button>
        <button @click="saveChanges" class="px-4 py-2 bg-green-600 text-white rounded-md">
          {{ order ? 'Save' : 'Place an Order' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({ order: Object })
const products = ref([]) // Correcting to make 'products' reactive
const orderData = reactive(
  props.order
    ? { ...props.order }
    : {
        storeName: '',
        userId: '',
        invoice: '',
        productId: '',
        quantity: 1,
        price: 0
      }
)
watch(orderData, () => {
  const selected = products.value.filter((el) => el._id == orderData.productId)
  if (selected[0]) {
    orderData.price = selected[0].price * orderData.quantity
  }
})

const emit = defineEmits(['save', 'close'])

// Moved the function definition above the usage
const generateInvoiceNumber = (userId) => {
  const currentTime = new Date().getTime() // Current time in milliseconds
  const userIdPart = userId.toString().slice(-4) // Take the last 4 digits of the user ID
  const timePart = currentTime.toString().slice(-6) // Take the last 6 digits of the current time
  return `${userIdPart}${timePart}` // Combine both parts to form a 10-digit number
}

// Set the initial order data if it exists
if (props.order) {
  orderData.value = props.order
}

// Initialize invoice only after orderData.value.userId is available
const authStore = useAuthStore()
onMounted(() => {
  authStore.fetchProducts()
  authStore.fetchAllStores()
  products.value = authStore.products.value
  orderData.userId = authStore.user._id

  // Generate the invoice number once userId is available
  !props.order
    ? (orderData.invoice = generateInvoiceNumber(orderData.userId))
    : (orderData.invoice = props.order.invoice)
})

// Emit the save event
const saveChanges = () => {
  emit('save', orderData)
}
const closeModal = () => {
  emit('close')
  ;(orderData.storeName = ''),
    (orderData.userId = ''),
    (orderData.invoice = ''),
    (orderData.productId = ''),
    (orderData.quantity = 1),
    (orderData.price = 0)
}
</script>
