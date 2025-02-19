<template>
  <div class="bg-white shadow-md p-4 rounded-lg grid grid-cols-6 gap-2 items-center">
    <div class="col-span-5">
      <h2 class="text-xl font-bold">{{ myProps.title }}</h2>
      <p class="text-3xl">{{ myProps.count }}</p>
    </div>
    <div class="">
      <component :is="ArrowRightSquare" class="h-6 w-6" />
    </div>
  </div>
</template>

<script setup>
import { ArrowRightSquare } from 'lucide-vue-next'

const myProps = defineProps(['title', 'count'])
</script>
