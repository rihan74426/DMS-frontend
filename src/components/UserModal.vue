<template>
  <div class="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg sm:w-1/3 overflow-auto m-5">
      <h2 class="text-xl font-semibold mb-4">Edit User</h2>
      <form @submit.prevent="updateUser">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input
            type="text"
            v-model="user.username"
            class="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input
            type="email"
            v-model="user.email"
            class="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Phone</label>
          <input
            type="email"
            v-model="user.phone"
            class="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Address</label>
          <input
            type="email"
            v-model="user.address"
            class="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Role</label>
          <select v-model="user.role" class="w-full p-2 border border-gray-300 rounded mt-2">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  user: Object
})

const user = ref({ ...props.user })

watch(
  () => props.user,
  (newVal) => {
    user.value = { ...newVal }
  }
)
const emit = defineEmits('update')

function updateUser() {
  emit('update', user.value)
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
