<template>
  <div
    class="container mx-auto p-4 p-4 ml-20 flex flex-wrap pt-20 left-40 place-content-center bg-gradient-to-r from-purple-500 to-blue-500"
  >
    <h1 class="text-4xl text-white font-bold m-4 absolute block ml-10">Products</h1>
    <div class="mt-10 relative inline-flex container flex place-content-center">
      <button
        @click="showAddProduct"
        class="inline-flex bg-pink-500 mt-10 text-white px-4 py-2 rounded-l-lg mb-4 hover:bg-pink-300 hover:text-black"
      >
        Add New Product
      </button>
      <input
        v-model="searchQuery"
        @input="searchProducts"
        placeholder="Search Products..."
        class="ring-2 px-2 mt-10 py-1 mb-4 rounded-r-lg w-half"
      />
    </div>

    <div class="mt-30 ml-40 p-5 grid grid-cols-4 gap-4 relative">
      <div
        class="bg-white shadow-md p-6 rounded-lg overflow-hidden transform transition-all hover:scale-105 duration-100"
        v-for="product in products"
        :key="product._id"
      >
        <div class="">
          <img :src="product.image" alt="product image" class="object-contain h-48 w-56" />
        </div>
        <h2 class="text-x font-bold flex justify-center p-1">{{ product.name }}</h2>
        <p class="line-clamp-3 hover:line-clamp-none text-justify">{{ product.description }}</p>
        <p class="p-2">ID: {{ product.hashtagSerial }}</p>
        <div class="grid grid-cols-3 items-center gap-2">
          <div class="col-span-2">
            <p class="p-2">Group: {{ product.group }}</p>
            <p class="p-2">Pack Size: {{ product.packSize }}</p>
            <p class="p-2">Available: {{ product.quantityInStore }}</p>
            <p class="p-2">Supplied: {{ product.quantitySupplied }}</p>
          </div>
          <h1 class="font-bold text-lg">MRP:- ৳ {{ product.price }}</h1>
        </div>
        <div>
          <strong>Additional info:</strong>
          <p>SDP: {{ product.sdp }}</p>
          <p>DP: {{ product.dp }}</p>
          <p>TP: {{ product.tp }}</p>
        </div>

        <div class="m-5 flex place-content-bottom">
          <button
            @click="editProduct(product)"
            class="bg-blue-500 text-white px-2 py-1 rounded ml-4"
          >
            <PencilSquareIcon class="size-6 text-white" />
          </button>
          <button
            @click="deleteProduct(product._id)"
            class="bg-red-500 text-white px-2 py-1 rounded ml-2"
          >
            <TrashIcon class="size-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <productModal
    v-show="isModalVisible"
    :product="selectedProduct"
    @close="isModalVisible = false"
    @save="saveProduct"
  />
  <div
    v-if="loading"
    class="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50"
  >
    <l-grid size="80" speed="2" color="purple"></l-grid>
  </div>
  <ModalComp
    :show="showModal"
    :title="modalTitle"
    :message="modalMessage"
    @close="showModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, watch } from 'vue'
import axios from 'axios'
import productModal from '@/components/productModal.vue'
import ModalComp from '@/components/ModalComp.vue'
import { grid } from 'ldrs'
import { useAuthStore } from '@/stores/authStore'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

grid.register()

const products = ref([])
const selectedProduct = ref(null)
const isModalVisible = ref(false)
const searchQuery = ref('')

const loading = ref(false)
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

const authStore = useAuthStore()

onMounted(async () => {
  loading.value = true
  await authStore.fetchProducts()
  if (authStore.products) {
    products.value = authStore.products.value
    loading.value = false
  }
})
const showAddProduct = () => {
  selectedProduct.value = null
  isModalVisible.value = true
  console.log('showing')
}

const editProduct = (product) => {
  selectedProduct.value = { ...product }
  isModalVisible.value = true
}

const deleteProduct = async (id) => {
  if (
    confirm(
      'Are you Sure you want to delete this product? If you are click OK. Otherwise, You can cancel it here!'
    )
  ) {
    try {
      loading.value = true
      await axios.delete(`http://localhost:5000/api/products/${id}`)

      showModal.value = true
      modalTitle.value = 'Success'
      modalMessage.value = 'Product deleted successfully!'
    } catch (error) {
      console.log('error fetching data', error)
      modalTitle.value = 'Failed'
      modalMessage.value = 'Failed to delete the product!'
      showModal.value = true
    } finally {
      loading.value = false
    }
  }
}

const saveProduct = async (product) => {
  if (product._id) {
    try {
      loading.value = true
      await axios.put(`http://localhost:5000/api/products/${product._id}`, product)

      showModal.value = true
      modalTitle.value = 'Success'
      modalMessage.value = 'Product updated successfully!'
    } catch (error) {
      console.log('error updating data', error)
      modalTitle.value = 'Failed'
      modalMessage.value = 'Failed to update the product!'
      showModal.value = true
    } finally {
      loading.value = false
      authStore.fetchProducts()
    }
  } else {
    try {
      loading.value = true
      await axios.post('http://localhost:5000/api/products', product)
      console.log(product)
      showModal.value = true
      modalTitle.value = 'Success'
      modalMessage.value = 'Product added successfully!'
    } catch (error) {
      console.log('error fetching data', error)
      modalTitle.value = 'Failed'
      modalMessage.value = 'Failed to add the product!'
      showModal.value = true
    } finally {
      loading.value = false
      authStore.fetchProducts()
    }
  }
  isModalVisible.value = false
  authStore.fetchProducts()
}

const searchProducts = () => {
  // Update this to fetch/search products from the server if needed
}
// search functionality from here
const filteredProducts = computed(() =>
  authStore.products.value.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)
watch(searchQuery, () => {
  console.log(filteredProducts.value)
  authStore.products.value = filteredProducts.value
})

// refreshing the product after every actions
onUpdated(() => {
  authStore.fetchProducts()
  products.value = authStore.products.value
})
</script>

<style scoped>
/* Add any additional styling here */
</style>
