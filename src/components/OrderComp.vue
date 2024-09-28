<template>
  <div class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
    <div class="bg-white p-8 rounded-lg h-5/6 shadow-lg overflow-auto w-1/3 mb-5 mt-5">
      <h2 class="text-2xl font-semibold mb-4 text-center">
        {{ order ? 'Edit Order' : 'Add Order' }}
      </h2>
      <p class="font-semibold mb-4">Invoice no: {{ orderData.invoice }}</p>
      <p class="font-semibold mb-4">
        Store:
        {{ order ? orderData.storeName : authStore.store.storeName }}
      </p>
      <div>
        <ul>
          <li
            v-for="product in orderData.products"
            :key="product.productId"
            class="flex grid grid-cols-3 w-full p-2 border border-gray-200"
          >
            <p>
              <strong>Name:</strong>
              {{ filterProduct(product.productId).name }}
            </p>
            <p><strong>Quantity:</strong> {{ product.quantity }}</p>
            <p>
              <strong>Total:</strong>
              {{ filterProduct(product.productId).price * product.quantity }}
              <button class="ml-5" @click="removeItem(product)">x</button>
            </p>
          </li>
        </ul>
      </div>
      <label class="block mb-2">Select Product</label>
      <select v-model="selectedProduct.productId" class="w-full mb-4 p-2 border rounded">
        <option v-for="product in products.value" :key="product._id" :value="product._id">
          {{ product.name }}
        </option>
      </select>
      <label class="block mb-2">Quantity:</label>
      <input
        required
        v-model="selectedProduct.quantity"
        type="number"
        class="w-full p-2 border rounded-md mb-4"
      />
      <button
        @click="addProduct(selectedProduct.productId, selectedProduct.quantity)"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-blue-700"
      >
        Add product
      </button>
      <label v-if="order" class="block mb-2">Order Status:</label>
      <select
        v-if="order"
        v-model="orderData.status"
        type="text"
        class="w-full p-2 border rounded-md mb-4"
      >
        <option>pending</option>
        <option>completed</option>
      </select>
      <label v-if="order" class="block mb-2">Payment Status:</label>
      <select
        v-if="order"
        v-model="orderData.payment"
        type="text"
        class="w-full p-2 border rounded-md mb-4"
      >
        <option>Paid</option>
        <option>Unpaid</option>
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
const selectedProduct = ref({
  productId: '',
  quantity: 1
})
const orderData = reactive(
  props.order
    ? { ...props.order }
    : {
        storeName: '',
        userId: '',
        invoice: '',
        products: [],
        price: 0,
        status: 'pending',
        payment: 'Unpaid'
      }
)
const filterProduct = (id) => {
  return authStore.products.value.filter((el) => el._id == id)[0]
}
watch(orderData, () => {
  const tablePrice = orderData.products.map((val, arr) => {
    return filterProduct(val.productId).price * val.quantity
  })
  // const selected = products.value.filter((el) => el._id == orderData.products.productId)
  // if (selected[0] && orderData.products.length > 0) {
  //   orderData.price =  selected[0].price * orderData.products.quantity
  // }
  if (tablePrice[0]) orderData.price = tablePrice.reduce((partialSum, a) => partialSum + a, 0)
})

const removeItem = (item) => {
  orderData.products = orderData.products.filter((el) => el.productId != item.productId)
}

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

const addProduct = (product, quantity) => {
  orderData.products.push({ productId: product, quantity: quantity })
  ;(selectedProduct.value.productId = ''), (selectedProduct.value.quantity = 1)
}
// Initialize invoice only after orderData.value.userId is available
const authStore = useAuthStore()
onMounted(async () => {
  await authStore.fetchProducts()
  await authStore.fetchAllStores()
  products.value = authStore.products
  orderData.userId = authStore.user._id

  // Generate the invoice number once userId is available
  !props.order
    ? (orderData.invoice = generateInvoiceNumber(orderData.userId))
    : (orderData.invoice = props.order.invoice)
})

// Emit the save event
const saveChanges = () => {
  emit('save', orderData)
  closeModal()
}
const closeModal = () => {
  emit('close')
  ;(orderData.storeName = ''),
    (orderData.userId = ''),
    (orderData.invoice = ''),
    (orderData.products = []),
    (orderData.quantity = 1),
    (orderData.price = 0)
}
</script>
