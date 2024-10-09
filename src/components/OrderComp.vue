<template>
  <div class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg h-5/6 shadow-lg overflow-auto sm:w-1/3 w-full mb-5 m-5">
      <h2 class="text-2xl font-semibold mb-4 text-center">
        {{ order ? 'Edit Order' : 'Place an Order' }}
      </h2>
      <p class="font-semibold mb-4">Invoice no: {{ orderData.invoice }}</p>
      <p class="font-semibold mb-4">
        Store:
        {{ props.store ? props.store : orderData.storeName }}
      </p>
      <div>
        <p v-if="selectedProduct.length > 0">Cart:</p>
        <ul>
          <li
            v-for="product in orderData.products"
            :key="product.productId"
            class="grid grid-cols-3 w-full p-2 border border-gray-200"
          >
            <p>
              <strong>Name:</strong>
              {{ filterProduct(product.productId).name }}
            </p>
            <p><strong>Quantity:</strong> {{ product.quantity }}</p>
            <p>
              <strong>Total:</strong>
              {{ filterProduct(product.productId).price * product.quantity }}
              <button class="px-2 border" @click="removeItem(product)">x</button>
            </p>
          </li>
        </ul>
      </div>
      <label class="block mb-2"
        ><strong
          >1) Select {{ orderData.products.length > 0 ? 'Another' : 'a' }} Product</strong
        ></label
      >
      <select v-model="selectedProduct.productId" class="w-full mb-4 p-2 border rounded">
        <option v-for="product in products.value" :key="product._id" :value="product._id">
          {{ product.name }}
        </option>
      </select>
      <label class="block mb-2 ml-10">Quantity:</label>
      <input
        v-model="selectedProduct.quantity"
        type="number"
        class="p-2 border ml-10 w-3/4 rounded-md mb-4"
      />
      <button
        @click="addProduct(selectedProduct.productId, selectedProduct.quantity)"
        class="px-4 py-2 ml-28 bg-gray-600 text-white rounded-md hover:bg-blue-700"
      >
        Add product
      </button>
      <form @submit.prevent="saveChanges">
        <label class="block mb-2"
          ><strong>2) Shipping address:</strong> (try to be specific as possible)</label
        >
        <div class="place-content-center flex">
          <input type="checkbox" class="h-4 w-4 m-1" id="checkbox" v-model="sameAs" />
          <ArrowDown class="h-5 w-5 mt-1" /><label for="checkbox">Same as Store Address</label>
        </div>
        <textarea
          required
          v-model="orderData.address"
          type="text"
          class="w-full p-2 border rounded-md mb-4"
        >
        </textarea>
        <p><strong>3) Payment Method:</strong></p>

        <label class="m-2 block">
          <input type="radio" v-model="orderData.paymentMethod" value="Bkash" />
          Bkash/Nagad
        </label>
        <label class="m-2 block">
          <input type="radio" v-model="orderData.paymentMethod" value="Bank Transfer" />
          Bank Transfer
        </label>
        <label class="m-2 block">
          <input type="radio" v-model="orderData.paymentMethod" value="Cash On Delivery" />
          Cash On Delivery
        </label>
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
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-md">
            {{ order ? 'Save' : 'Place Order' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { ArrowDown } from 'lucide-vue-next'
import { onMounted, reactive, ref, watch } from 'vue'

const props = defineProps(['order', 'product', 'store'])
const products = ref([]) // Correcting to make 'products' reactive
const sameAs = ref(false)
const selectedProduct = ref({
  productId: '',
  quantity: 1
})
const orderData = reactive(
  props.order
    ? { ...props.order }
    : {
        storeName: props.store ? props.store : '',
        userId: '',
        invoice: '',
        products: [],
        price: 0,
        address: sameAs.value ? authStore.store.storeAddress : '',
        status: 'pending',
        payment: 'Unpaid',
        paymentMethod: 'Cash On Delivery'
      }
)

const authStore = useAuthStore()
onMounted(async () => {
  await authStore.fetchProducts()
  await authStore.fetchAllStores()
  await authStore.fetchStore()
  products.value = authStore.products
  orderData.userId = authStore.user._id
  orderData.storeName = authStore.store.storeName
  // Generate the invoice number once userId is available
  !props.order || !props.product
    ? (orderData.invoice = generateInvoiceNumber(orderData.userId))
    : (orderData.invoice = props.order.invoice)

  if (props.order) {
    orderData.value = props.order
  } else if (props.product) {
    selectedProduct.value = props.product
  }
})

watch(
  () => sameAs.value,
  () => {
    if (sameAs.value) orderData.address = authStore.store.storeAddress
  }
)
const filterProduct = (id) => {
  return authStore.products.value.filter((el) => el._id == id)[0]
}

watch(orderData, () => {
  const tablePrice = orderData.products.map((val) => {
    return filterProduct(val.productId).price * val.quantity
  })
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

const addProduct = (product, quantity) => {
  orderData.products.push({ productId: product, quantity: quantity })
  ;(selectedProduct.value.productId = ''), (selectedProduct.value.quantity = 1)
}
// Initialize invoice only after orderData.value.userId is available

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
