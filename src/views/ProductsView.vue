<template>
  <div class="container min-h-screen p-4 sm:ml-16">
    <div
      class="place-content-center flex flex-wrap"
      :class="roleBind() ? 'sm:pl-30 mt-20' : 'pt-20'"
    >
      <h1 class="text-4xl text-white font-bold m-4">Products</h1>
      <div class="container flex place-content-center">
        <button
          @click="showAddProduct"
          v-if="roleBind()"
          class="inline-flex bg-pink-500 mt-10 text-white px-4 py-2 rounded-l-lg mb-4 hover:bg-pink-300 hover:text-black"
        >
          Add New Product
        </button>
        <input
          :class="{ 'rounded-l-lg w-2/5 border-purple-500': !roleBind() }"
          v-model="searchQuery"
          @input="searchProducts"
          placeholder="Search Products..."
          class="ring-2 px-2 mt-10 py-1 mb-4 rounded-r-lg w-half"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-4" :class="{ 'sm:ml-48': roleBind() }">
        <div
          class="bg-white border border-black shadow-md p-6 rounded-lg transform transition-all hover:scale-105 duration-800"
          v-for="product in products"
          :key="product._id"
        >
          <div class="border border-y-2 justify-center flex">
            <img
              :src="product.image"
              alt="product image"
              class="object-contain h-full w-full sm:h-48 sm:w-56"
            />
          </div>
          <h2 class="text-x font-bold flex justify-center p-1">{{ product.name }}</h2>
          <p class="line-clamp-3 hover:line-clamp-none text-justify">{{ product.description }}</p>
          <p class="p-2">ID: {{ product.hashtagSerial }}</p>
          <div class="grid grid-cols-3 items-center gap-0">
            <div class="col-span-2">
              <p class="p-2">Group: {{ product.group }}</p>
              <p class="p-2">Pack Size: {{ product.packSize }}</p>
              <p class="p-2">Available: {{ product.quantityInStore }}</p>
              <p class="p-2">Supplied: {{ product.quantitySupplied }}</p>
            </div>
            <h1 class="font-bold text-center text-lg">
              MRP:- <span>&#2547;</span>{{ product.price }}
            </h1>
          </div>
          <div>
            <strong>Additional info:</strong>
            <p>SDP: {{ product.sdp }}</p>
            <p>DP: {{ product.dp }}</p>
            <p>TP: {{ product.tp }}</p>
          </div>

          <div
            class="m-5 flex absolute justify-center text-center bottom-5 sm:ml-10 right-5"
            v-if="roleBind()"
          >
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
          <div
            v-else-if="authStore.logged"
            class="m-5 flex absolute justify-center text-center bottom-5 ml-16 right-5"
          >
            <button
              class="bg-blue-500 text-white p-1 sm:px-2 sm:py-1 rounded text-center"
              @click="orderNow(product)"
            >
              Order Now!
            </button>
          </div>
          <div v-else class="m-5 flex absolute justify-center text-center bottom-5 ml-16 right-5">
            <RouterLink
              to="/login"
              class="bg-blue-500 text-white p-5 sm:px-2 sm:py-1 rounded text-center"
              >Log In to Order</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
    <Transition name="modal">
      <productModal
        v-show="isModalVisible && roleBind()"
        :product="selectedProduct"
        @close="isModalVisible = false"
        @save="saveProduct"
      />
    </Transition>
    <Transition name="modal">
      <OrderComp
        ref="orderComp"
        v-if="showOrderModal"
        :product="{ productId: selectedProduct._id, quantity: 1 }"
        :store="authStore.store.storeName"
        @close="closeOrderModal"
        @save="saveOrder"
      />
    </Transition>
    <div v-if="loading" class="fixed inset-0 flex items-center z-50 justify-center">
      <l-grid size="80" speed="2" color="blue"></l-grid>
    </div>
    <Transition name="modal">
      <ModalComp
        :show="showModal"
        :title="modalTitle"
        :message="modalMessage"
        @close="showModal = false"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import productModal from '@/components/productModal.vue'
import ModalComp from '@/components/ModalComp.vue'
import { grid } from 'ldrs'
import { useAuthStore } from '@/stores/authStore'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import OrderComp from '@/components/OrderComp.vue'

grid.register()

const products = ref([])
const selectedProduct = ref(null)
const isModalVisible = ref(false)
const searchQuery = ref('')
const showOrderModal = ref(false)

const loading = ref(false)
const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const authStore = useAuthStore()

onMounted(async () => {
  loading.value = true
  await authStore.fetchProducts()
  await authStore.fetchUser()
  if (authStore.logged) await authStore.fetchStore()
  if (authStore.products) {
    products.value = authStore.products.value
    loading.value = false
  }
})
const showAddProduct = () => {
  selectedProduct.value = null
  isModalVisible.value = true
}

const roleBind = () => {
  if (authStore.user) {
    if (authStore.user.role == 'admin') return true
  } else {
    return false
  }
}

const editProduct = (product) => {
  selectedProduct.value = { ...product }
  isModalVisible.value = true
}

const orderNow = (product) => {
  selectedProduct.value = product
  showOrderModal.value = true
}
const closeOrderModal = () => {
  showOrderModal.value = false
}
const storeCheck = () => {
  if (
    authStore.store.storeName === 'Your Store' &&
    authStore.store.storeAddress === 'Ex: Bahaddarhat, Chattogram' &&
    authStore.store.storePhone === '01xxx-xxxxxx' &&
    authStore.store.storeManager === 'Your Store Manager'
  ) {
    return false // Invalid store details
  }
  return true // Valid store details
}

const userCheck = () => {
  const user = authStore.user
  if (!user.phone || !user.address) {
    return false // Invalid user details
  }
  return true // Valid user details
}
const token = localStorage.getItem('token')

const saveOrder = async (order) => {
  try {
    if (storeCheck() && userCheck()) {
      await axios.post('https://dms-backend-server2.vercel.app/api/auth/orders', order, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Bearer token for authentication
        }
      })
      showModal.value = true
      modalTitle.value = 'Success'
      modalMessage.value = 'Order Placed Successfully'
    } else {
      showModal.value = true
      modalTitle.value = 'Warning!'
      modalMessage.value = 'Please set up your profile and store details before placing an order'
    }
  } catch (error) {
    showModal.value = true
    modalTitle.value = 'Failure'
    modalMessage.value = 'Failed to create the order! please try again later'
    console.log('Error Creating order', error)
  }
}
const deleteProduct = async (id) => {
  if (
    confirm(
      'Are you Sure you want to delete this product? If you are click OK. Otherwise, You can cancel it here!'
    )
  ) {
    try {
      loading.value = true
      await axios.delete(`https://dms-backend-server2.vercel.app/api/products/${id}`)

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
      const updatedProduct = await axios.put(
        `https://dms-backend-server2.vercel.app/api/products/${product._id}`,
        product
      )
      const index = products.value.findIndex({ _id: product._id })
      products[index] = updatedProduct.data
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
      const newProduct = await axios.post(
        'https://dms-backend-server2.vercel.app/api/products',
        product
      )

      products.value.push(newProduct)
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
  products.value = filteredProducts.value
})

// refreshing the product after every actions
</script>

<style scoped>
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
</style>
