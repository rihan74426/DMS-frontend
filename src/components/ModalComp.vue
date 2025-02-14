<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div ref="clickOutside" class="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 class="text-xl font-semibold mb-4">{{ props.title }}</h2>
      <p>{{ props.message }}</p>
      <div class="flex justify-end mt-4">
        <button @click="closeModal" class="px-4 py-2 bg-blue-500 text-white rounded-md">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core'

import { ref } from 'vue'
const clickOutside = ref(null)
const props = defineProps({
  show: Boolean,
  title: String,
  message: String
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

onClickOutside(clickOutside, () => {
  emit('close')
})
</script>
