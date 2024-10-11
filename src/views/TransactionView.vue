<template>
  <div>
    <div class="container min-h-screen p-4 pt-20 sm:ml-16">
      <div class="sm:ml-48 flex-wrap">
        <div class="text-center">
          <h1 class="text-4xl text-white font-bold">Transactions</h1>
          <button
            @click="showAddTransaction"
            v-if="roleBind()"
            class="bg-pink-500 m-5 place-content-center text-white px-4 py-2 rounded-lg mb-4 hover:bg-pink-300 hover:text-black"
          >
            Add a Transaction
          </button>
        </div>
        <div v-if="!loading" class="overflow-x-auto">
          <table class="bg-white shadow-lg rounded-lg">
            <thead>
              <tr class="text-center bg-gray-100 border border-slate-700">
                <th class="p-4 justify-center">Trans Id</th>
                <th class="p-4 justify-center">Order</th>
                <th class="p-4 justify-center">Status</th>
                <th class="p-4 justify-center">Product</th>
                <th class="p-4 justify-center">Quantity</th>
                <th class="p-4 justify-center">Total</th>
                <th class="p-4 justify-center">Created</th>
                <th class="p-4 justify-center" v-if="roleBind()">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in transactions"
                :key="transaction._id"
                class="border border-slate-700 text-center"
              >
                <td class="p-2">tx{{ transaction._id }}</td>
                <td class="p-2">#{{ transaction.order }}</td>
                <td class="p-2">
                  {{ transaction.status }}
                  <button
                    :class="
                      transaction.status == 'pending'
                        ? 'bg-green-500 p-1 text-white'
                        : 'bg-red-500 p-1 text-white'
                    "
                    @click="
                      markTransaction({
                        ...transaction,
                        status: transaction.status == 'pending' ? 'completed' : 'pending'
                      })
                    "
                  >
                    Mark {{ transaction.status == 'pending' ? 'comp' : 'pend' }}
                  </button>
                </td>
                <td class="p-2">
                  {{ transaction.products.map((el) => showProduct(el.productId).name).join(' + ') }}
                </td>
                <td class="p-2">{{ transaction.products.map((el) => el.quantity).join(' + ') }}</td>

                <td class="p-2">{{ transaction.total }} /-</td>
                <td class="p-2">
                  {{ timeCon(transaction.createdAt) }}
                </td>
                <td class="p-2 justify-between flex" v-if="roleBind()">
                  <button
                    @click="editTransaction(transaction)"
                    class="bg-blue-500 text-white px-2 py-2 rounded m-1"
                  >
                    <PencilSquareIcon class="size-6 text-white" />
                  </button>
                  <button
                    @click="deleteTransaction(transaction._id)"
                    class="bg-red-500 text-white p-2 rounded m-1"
                  >
                    <TrashIcon class="size-6 text-white" />
                  </button>
                  <button
                    @click="printVoucher(transaction)"
                    class="bg-green-500 text-white px-2 py-2 rounded block m-1"
                  >
                    PDF
                  </button>
                  <button
                    @click="printExcel(transaction)"
                    class="bg-green-500 text-white px-2 py-2 rounded block m-1"
                  >
                    Exel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="inset-0 flex items-center z-50 justify-center">
          <l-grid size="80" speed="2" color="purple"></l-grid>
        </div>
        <!-- Add/Edit Transaction Modal -->
        <EditTransModal
          :show-modal="showModal"
          :is-edit-mode="isEditMode"
          :transactionData="selectedTransaction"
          :companies="companies"
          :products="products"
          @close="showModal = false"
          @save="handleSaveTransaction"
        />
        <ModalComp
          :show="showResModal"
          :title="modalTitle"
          :message="modalMessage"
          @close="showResModal = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import axios from 'axios'
import EditTransModal from '@/components/EditTransModal.vue'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import ModalComp from '@/components/ModalComp.vue'
import { useAuthStore } from '@/stores/authStore'
import { grid } from 'ldrs'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import * as XLSX from 'xlsx'

grid.register()

const authStore = useAuthStore()

const showModal = ref(false)
const isEditMode = ref(false)
const selectedTransaction = ref(null)
const transactions = ref([])
const companies = ref([])
const products = ref([])

const loading = ref(false)
const showResModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const roleBind = () => {
  if (authStore.user) {
    if (authStore.user.role == 'admin') return true
  } else {
    return false
  }
}
// Fetch companies and products
const timeCon = (time) => {
  const date = new Date(time).toLocaleString()
  return date
}

// Fetch transactions

const showAddTransaction = () => {
  isEditMode.value = false
  selectedTransaction.value = null
  showModal.value = true
}

const editTransaction = (transaction) => {
  isEditMode.value = true
  selectedTransaction.value = transaction
  showModal.value = true
}

const handleSaveTransaction = async (transactionData) => {
  if (isEditMode.value) {
    try {
      loading.value = true
      await axios.put(
        `http://localhost:5000/api/transactions/${transactionData._id}`,
        transactionData
      )
      modalTitle.value = 'Success'
      modalMessage.value = 'Transaction updated successfully!'
      showResModal.value = true
    } catch (error) {
      console.log('error updating data', error)
      modalTitle.value = 'Failed'
      modalMessage.value = 'Failed to update the transaction!'
      showResModal.value = true
    } finally {
      loading.value = false
      showModal.value = false
      authStore.fetchTransactions()
    }
  } else {
    try {
      const response = await axios.post('http://localhost:5000/api/transactions', transactionData)
      transactions.value.push(response.data)
      modalTitle.value = 'Success'
      modalMessage.value = 'Transaction added successfully!'
      showResModal.value = true
    } catch (error) {
      console.error('Error saving transaction:', error)
      modalTitle.value = 'Failed'
      modalMessage.value = `Failed to add Transaction!`
      showResModal.value = true
    } finally {
      showModal.value = false
      authStore.fetchTransactions()
    }
  }
}
const markTransaction = async (transaction) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/transactions/${transaction._id}`,
      transaction
    )
    const index = transactions.value.findIndex((t) => t._id === transaction._id)
    transactions.value[index] = response.data
    console.log(index)
    modalTitle.value = 'Success'
    modalMessage.value = `Transaction marked as ${response.data.status}!`
    showResModal.value = true
  } catch (error) {
    console.log('error updating data', error)
    modalTitle.value = 'Failed'
    modalMessage.value = 'Failed to mark the transaction!'
    showResModal.value = true
  }
}

const deleteTransaction = async (id) => {
  if (confirm(`Are you sure you want to delete this item from transaction list?`)) {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`)
      modalTitle.value = 'Success'
      modalMessage.value = 'Transaction deleted successfully!'
      showResModal.value = true
      transactions.value.splice(id, 1)
    } catch (error) {
      console.error('Error deleting transaction:', error)
      modalTitle.value = 'Failure'
      modalMessage.value = 'Failed to delete the transation!'
      showModal.value = true
    }
    authStore.fetchTransactions()
  }
}

const printVoucher = (transaction) => {
  const doc = new jsPDF()

  // Colors
  const headerColor = [50, 50, 255] // RGB values for color
  const titleColor = [0, 0, 0] // RGB values for black
  const subHeaderColor = [100, 100, 100] // RGB for gray

  // Ensure you're passing valid colors
  doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]) // Correct usage of RGB
  doc.setFont('helvetica', 'bold')
  doc.text('Distribution Management System', doc.internal.pageSize.getWidth() / 2, 20, {
    align: 'center'
  })

  // Add Voucher Creation Date and Transaction Creation Date
  doc.setFontSize(12)
  doc.setTextColor(subHeaderColor[0], subHeaderColor[1], subHeaderColor[2])
  doc.setFont('helvetica', 'normal')
  doc.text(`Date: ${new Date().toLocaleString()}`, doc.internal.pageSize.getWidth() / 1.1, 40, {
    align: 'right'
  })
  doc.text(
    `Transaction Created: ${new Date(transaction.createdAt).toLocaleString()}`,
    doc.internal.pageSize.getWidth() / 1.1,
    50,
    {
      align: 'right'
    }
  )

  // Add company and person details
  doc.setFontSize(14)
  doc.setTextColor(headerColor[0], headerColor[1], headerColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text(`Order Invoice: #${transaction.order}`, 20, 70)
  doc.text(`Dealing with: ${findUser(transaction.client).username}`, 20, 80)

  // Product Details Table
  const productsData = transaction.products.map((productItem) => {
    const orderItem = showProduct(productItem.productId)
    return [
      orderItem.name, // Product name
      `${productItem.quantity} pcs`, // Quantity
      `${orderItem.packSize}`, // Pack size
      `${orderItem.group}`, // Pack size
      `${orderItem.price.toFixed(2)}/- tk`, // Price per unit
      `${(orderItem.price * productItem.quantity).toFixed(2)}/- tk` // Total for that product
    ]
  })

  // Generate the product table with multiple products
  doc.autoTable({
    startY: 90, // Position after header content
    head: [['Product', 'Quantity', 'Pack Size', 'group', 'MRP', 'Total']],
    body: productsData, // 2D array containing product details
    styles: {
      textColor: [34, 34, 34] // White text color for table content
    },
    headStyles: {
      fillColor: [29, 78, 216], // Blue for table header
      textColor: [255, 255, 255]
    }
  })

  // Add Total Amount
  doc.setFontSize(14)
  doc.setTextColor(subHeaderColor[1], subHeaderColor[1], subHeaderColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Amount: $${transaction.total.toFixed(2)}`, 20, doc.autoTable.previous.finalY + 20)

  // Signature
  doc.setFontSize(12)
  doc.setTextColor(subHeaderColor[0], subHeaderColor[1], subHeaderColor[2])
  doc.setFont('helvetica', 'normal')
  doc.text(
    `Printed By: ${localStorage.getItem('username')}`,
    20,
    doc.autoTable.previous.finalY + 40
  )

  // Save or Download the PDF
  doc.save(`voucher_for_${transaction.client}.pdf`)
}
const findUser = (id) => {
  const user = authStore.users.find((user) => user._id === id)
  return user
}

const printExcel = (transaction) => {
  // Transaction metadata (details that aren't product-specific)
  const transactionData = [
    ['Transaction', transaction._id],
    ['Client', findUser(transaction.client).username],
    ['Order Invoice', '#' + transaction.order],
    ['Total', transaction.total],
    ['Date', new Date(transaction.createdAt).toLocaleString()]
  ]

  // Prepare product details for the separate table
  const productDetailsHeader = ['S/N', 'Product Name', 'Quantity', 'Price', 'Total Price']

  const productDetails = transaction.products.map((el, index) => [
    index + 1,
    showProduct(el.productId).name,
    el.quantity,
    showProduct(el.productId).price,
    el.quantity * showProduct(el.productId).price
  ])

  // Create a new workbook and a new sheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([]) // Start with an empty sheet

  // Append transaction metadata at the top of the sheet
  XLSX.utils.sheet_add_aoa(ws, transactionData, { origin: 'D5' })

  // Append product details header right below the transaction metadata
  XLSX.utils.sheet_add_aoa(ws, [productDetailsHeader], { origin: `D${transactionData.length + 6}` })

  // Append product details below the header
  XLSX.utils.sheet_add_aoa(ws, productDetails, { origin: `D${transactionData.length + 7}` })

  // Apply black background and white text to product header row
  const headerRowStart = transactionData.length + 6
  const range = XLSX.utils.decode_range(`D${headerRowStart}:H${headerRowStart}`)

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell_address = XLSX.utils.encode_cell({ r: range.s.r, c: C })
    if (!ws[cell_address]) continue

    // Apply black background and white text color to header cells
    ws[cell_address].s = {
      fill: { fgColor: { rgb: '000000' } }, // Black background
      font: { color: { rgb: 'FFFFFF' }, bold: true } // White text, bold
    }
  }

  // Add the sheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Transaction & Products')

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `Transaction_of_${findUser(transaction.client).username}.xlsx`)
}

// const printExcel = (transaction) => {
//   const ws = XLSX.utils.json_to_sheet([transaction]) // Export the single transaction as an array of one object
//   const wb = XLSX.utils.book_new()
//   XLSX.utils.book_append_sheet(wb, ws, 'Transaction')
//   XLSX.writeFile(wb, `Transaction_${transaction._id}.xlsx`) // File named with transaction ID
// }

const showProduct = (Id) => {
  if (products.value) {
    const product = products.value.find((el) => el._id === Id)
    return product ? product : 'Product not found!'
  } else {
    return 'Products not fetched!'
  }
}

onMounted(async () => {
  loading.value = true
  await authStore.fetchCompanies()
  await authStore.fetchProducts()
  await authStore.fetchTransactions()
  if (authStore.transactions) {
    transactions.value = authStore.transactions.value.toReversed()
    loading.value = false
  }
  companies.value = authStore.companies.value
  products.value = authStore.products.value
})

onUpdated(() => {
  authStore.fetchTransactions()
  // transactions.value = authStore.transactions.value
})
</script>
