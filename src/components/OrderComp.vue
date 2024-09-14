<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-1/3">
      <h2 class="text-2xl font-semibold mb-4">{{ order ? 'Edit Order' : 'Add Order' }}</h2>
      <h4 class="text-2xl font-semibold mb-4">{{ orderData.invoice }}</h4>
      <label class="block mb-2">Order Details:</label>
      <input v-model="orderData.details" type="text" class="w-full p-2 border rounded-md mb-4" />
      <label class="block mb-2">Select Product</label>
      <select v-model="orderData.productId" class="w-full mb-4 p-2 border rounded">
        <option v-for="product in products" :key="product._id" :value="product._id">
          {{ product.name }}
        </option>
      </select>
      <label class="block mb-2">Quantity:</label>
      <input v-model="orderData.quantity" type="number" class="w-full p-2 border rounded-md mb-4" />

      <div class="flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md">
          Cancel
        </button>
        <button @click="saveChanges" class="px-4 py-2 bg-green-600 text-white rounded-md">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'
const props = defineProps({ order: Object })
const products = []
const orderData = ref(
  props.order
    ? { ...props.order }
    : {
        userId: '',
        invoice: invoice,
        productId: '',
        quantity: ''
      }
)
const invoice = generateInvoiceNumber(orderData.value.userId)
const generateInvoiceNumber = (userId) => {
  const currentTime = new Date().getTime() // Current time in milliseconds
  const userIdPart = userId.toString().slice(-4) // Take the last 4 digits of the user ID
  const timePart = currentTime.toString().slice(-6) // Take the last 6 digits of the current time

  const invoiceNumber = `${userIdPart}${timePart}` // Combine both parts to form a 10-digit number
  return invoiceNumber
}

const emit = defineEmits(['save'])
const saveChanges = () => {
  emit('save', orderData.value)
}
onMounted(() => {
  products.value = useAuthStore().products
  orderData.value.userId = useAuthStore().user._id
})
</script>
