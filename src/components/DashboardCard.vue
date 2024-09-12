<template>
  <div class="bg-white shadow-md p-6 rounded-lg">
    <h2 class="text-xl font-bold">{{ myProps.title }}</h2>
    <p class="text-3xl">{{ myProps.count }}</p>
  </div>
</template>

<script setup>
const myProps = defineProps(['title', 'count'])
</script>
