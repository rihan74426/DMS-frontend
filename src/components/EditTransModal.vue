<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
    <div class="bg-white p-8 rounded-lg shadow-lg w-1/2 overflow-auto mb-5 mt-5">
      <h2 class="text-xl font-semibold mb-4">
        {{ isEditMode ? 'Edit Transaction' : 'Add Transaction' }}
      </h2>

      <!-- Company Selection -->
      <label class="block mb-2">Select Company</label>
      <select v-model="transaction.companyId" class="w-full mb-4 p-2 border rounded">
        <option v-for="company in companies" :key="company._id" :value="company._id">
          {{ company.name }}
        </option>
      </select>

      <!-- Product Selection -->
      <label class="block mb-2">Select Product</label>
      <select v-model="transaction.productId" class="w-full mb-4 p-2 border rounded">
        <option v-for="product in products" :key="product._id" :value="product._id">
          {{ product.name }}
        </option>
      </select>

      <!-- Quantity -->
      <label class="block mb-2">Quantity</label>
      <input type="number" v-model="transaction.quantity" class="w-full mb-4 p-2 border rounded" />

      <!-- Price -->
      <label class="block mb-2">Price</label>
      <input type="number" v-model="transaction.price" class="w-full mb-4 p-2 border rounded" />

      <!-- Person -->
      <label class="block mb-2">Transaction with</label>
      <input
        type="text"
        v-model="transaction.person"
        class="w-full mb-4 p-2 border rounded"
        placeholder="ext: Md Irfan Uddin"
      />

      <!-- Total -->
      <p class="mb-4 font-bold">
        Total: {{ transactionTotal || 0 }} <span class="font-bold text-xl">৳</span>
      </p>

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
import { computed, ref, watch, onMounted } from 'vue'

const props = defineProps(['showModal', 'isEditMode', 'transactionData', 'companies', 'products'])
const emit = defineEmits(['close', 'save'])

const transaction = ref({
  companyId: '',
  productId: '',
  quantity: 1,
  price: 0,
  person: ''
})

const transactionTotal = computed(() => transaction.value.quantity * transaction.value.price)

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
