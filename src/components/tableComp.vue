<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr class="bg-blue-200 text-dark text-center">
          <th class="py-3 px-3">#</th>
          <th class="py-3 px-3">Name</th>
          <th class="py-3 px-3">Address</th>
          <th class="py-3 px-3">Manager</th>
          <th class="py-3 px-3">Contact</th>
          <th class="py-3 px-3">Company mail</th>
          <th class="py-3 px-3">Special Note</th>
          <th class="py-3 px-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in props.items" :key="item._id" class="border-b hover:bg-gray-100">
          <td class="py-3 px-3">{{ index + 1 }}</td>
          <td class="py-3 px-3">{{ item.name }}</td>
          <td class="py-3 px-3">{{ item.address }}</td>
          <td class="py-3 px-3">{{ item.manager }}</td>
          <td class="py-3 px-3">{{ item.number }}</td>
          <td class="py-3 px-3">{{ item.email }}</td>
          <td class="py-3 px-3">{{ item.notes }}</td>
          <td class="py-3 px-3 flex">
            <button
              @click="$emit('editItem', index)"
              class="bg-blue-500 text-white px-1 py-1 rounded mr-2"
            >
              <PencilSquareIcon class="size-6 text-white" />
            </button>
            <button
              @click="$emit('deleteItem', item._id)"
              class="bg-red-500 text-white px-1 py-1 rounded"
            >
              <TrashIcon class="size-6 text-white" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps(['items'])

// const deleteitem = (item) => {
//   props.deleteItem(item)
// }
// const deleteItem = (index) => {
//   console.log('Delete item:', index)
//   //   deleteItem()
//   // Implement the delete functionality
//   // eslint-disable-next-line vue/no-mutating-props
//   props.items.splice(index, 1)
//   //    = props.items.filter((i) => i.id !== item.id)

//   // this.$emit('delete-item', item.id)

//   //   props.items = props.items.filter((i) => i.id !== item.id)
// }
</script>
