<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
  >
    <div
      ref="clickOutside"
      class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
    >
      <h2 class="text-lg sm:text-xl md:text-2xl font-semibold mb-4">{{ props.title }}</h2>
      <p class="text-sm sm:text-base">{{ props.message }}</p>
      <div class="flex justify-end mt-4">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
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
