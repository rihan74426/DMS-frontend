<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
    <div class="bg-white p-8 rounded-lg shadow-lg sm:w-1/2 overflow-auto mb-5 m-5">
      <h2 class="text-xl font-semibold mb-4">
        {{ isEditMode ? 'Edit Transaction' : 'Add Transaction' }}
      </h2>
      <p>Id: {{ transactionData ? transactionData._id : '' }}</p>
      <!-- Company Selection -->
      <label class="block mb-2">Client:</label>
      <input type="text" v-model="transaction.client" class="w-full mb-4 p-2 border rounded" />
      <label class="block mb-2">Order:</label>
      <input type="text" v-model="transaction.order" class="w-full mb-4 p-2 border rounded" />

      <!-- Product Selection -->
      <label class="block mb-2">Select Product</label>
      <select v-model="transaction.products" class="w-full mb-4 p-2 border rounded">
        <option v-for="product in products" :key="product._id" :value="product._id">
          {{ product.name }}
        </option>
      </select>

      <!-- Quantity -->
      <label class="block mb-2">Quantity</label>
      <input type="number" v-model="transaction.products" class="w-full mb-4 p-2 border rounded" />

      <!-- Price -->
      <label class="block mb-2">Total</label>
      <input type="number" v-model="transaction.total" class="w-full mb-4 p-2 border rounded" />

      <!-- Person -->
      <label class="block mb-2">Status</label>
      <input
        type="text"
        v-model="transaction.status"
        class="w-full mb-4 p-2 border rounded"
        placeholder="ext: Md Irfan Uddin"
      />

      <!-- Actions -->
      <div class="flex justify-end">
        <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded mr-2">
          Cancel
        </button>
        <button @click="submitTransaction" class="bg-blue-500 text-white px-4 py-2 rounded">
          {{ isEditMode ? 'Update' : 'Add' }} Transaction
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['showModal', 'isEditMode', 'transactionData', 'companies', 'products'])
const emit = defineEmits(['close', 'save'])

const transaction = ref({
  client: props.transactionData ? props.transactionData.client : '',
  order: props.transactionData ? props.transactionData.order : '',
  status: props.transactionData ? props.transactionData.status : 'pending',
  products: props.transactionData ? props.transactionData.products : [],
  total: props.transactionData ? props.transactionData.total : 0
})

watch(
  () => props.transactionData,
  (newVal) => {
    transaction.value = { ...newVal }
  }
)

const closeModal = () => {
  emit('close')
}

const submitTransaction = () => {
  emit('save', transaction.value)
  transaction.value = {
    company: '',
    product: '',
    quantity: 1,
    price: 0,
    person: ''
  }
  closeModal()
}

onMounted(() => {
  if (!transaction.value) {
    transaction.value = {
      companyId: '',
      productId: '',
      quantity: 1,
      price: 0,
      person: ''
    }
  }
})
</script>

<style scoped>
/* Add any additional styles here */
</style>
