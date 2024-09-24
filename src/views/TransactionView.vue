<template>
  <div>
    <div class="container min-h-screen mx-auto p-4 ml-20 pt-20">
      <div class="ml-10">
        <div class="relative flex place-content-center mb-10">
          <h1 class="text-4xl text-white font-bold absolute">Transactions</h1>
          <button
            @click="showAddTransaction"
            class="bg-pink-500 mt-20 text-white px-4 py-2 rounded-lg mb-4 hover:bg-pink-300 hover:text-black"
          >
            Add a Transaction
          </button>
        </div>

        <table v-if="!loading" class="w-5/6 bg-white shadow-lg rounded-lg ml-40">
          <thead>
            <tr class="text-center bg-gray-100 border border-slate-700">
              <th class="p-4 justify-center">Company</th>
              <th class="p-4 justify-center">Product</th>
              <th class="p-4 justify-center">Quantity</th>
              <th class="p-4 justify-center">Item Price</th>
              <th class="p-4 justify-center">Total</th>
              <th class="p-4 justify-center">Person</th>
              <th class="p-4 justify-center">Created</th>
              <th class="p-4 justify-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in transactions"
              :key="transaction._id"
              class="border border-slate-700 text-center"
            >
              <td class="p-2">
                {{ showCompany(transaction.companyId) }}
              </td>
              <td class="p-2">
                {{ showProduct(transaction.productId) }}
              </td>
              <td class="p-2">{{ transaction.quantity }}</td>
              <td class="p-2">{{ transaction.price }} /-</td>
              <td class="p-2">{{ transaction.quantity * transaction.price }} /-</td>
              <td class="p-2">{{ transaction.person }}</td>
              <td class="p-2">
                {{ timeCon(transaction.createdAt) }}
              </td>
              <td class="p-2 justify-between flex">
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
// Fetch companies and products
const fetchCompaniesAndProducts = () => {
  authStore.fetchCompanies()
  authStore.fetchProducts()
  companies.value = authStore.companies.value
  products.value = authStore.products.value
}
const timeCon = (time) => {
  const date = new Date(time).toLocaleDateString()
  const yyyyMMdd = date.slice(0, 10)
  return yyyyMMdd
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
      modalMessage.value = 'Failed to update the product!'
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
      console.log(response.data)
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

  // Add Title - "Distributor Management System"
  // doc.setFontSize(22)
  // doc.setTextColor(titleColor)
  // doc.setFont('helvetica', 'bold')
  // doc.text('Distributor Management System', doc.internal.pageSize.getWidth() / 2, 20, {
  //   align: 'center'
  // })

  // Add Voucher Creation Date and Transaction Creation Date
  doc.setFontSize(12)
  doc.setTextColor(subHeaderColor[0], subHeaderColor[1], subHeaderColor[2])
  doc.setFont('helvetica', 'normal')
  doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() / 1.1, 40, {
    align: 'right'
  })
  doc.text(
    `Transaction Created: ${new Date(transaction.createdAt).toLocaleDateString()}`,
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
  doc.text(
    `Company name: ${companies.value.filter((el) => el._id == transaction.companyId)[0].name}`,
    20,
    70
  )
  doc.text(`Dealing with: ${transaction.person}`, 20, 80)

  // Product Details Table
  const tableColumnHeaders = ['Product Name', 'Price', 'Quantity', 'Total']
  const tableRows = products.value
    .filter((el) => el._id == transaction.productId)
    .map((product) => [
      product.name,
      `$${transaction.price.toFixed(2)}`,
      transaction.quantity,
      `$${(transaction.price * transaction.quantity).toFixed(2)}`
    ])

  doc.autoTable({
    head: [tableColumnHeaders],
    body: tableRows,
    startY: 100,
    headStyles: {
      fillColor: headerColor,
      textColor: [255, 255, 255], // White text
      halign: 'center',
      valign: 'middle'
    },
    bodyStyles: {
      halign: 'center'
    },
    theme: 'striped'
  })

  // Calculate the total price
  const totalPrice = transaction.price * transaction.quantity

  // Add Total Amount
  doc.setFontSize(14)
  doc.setTextColor(subHeaderColor[1], subHeaderColor[1], subHeaderColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Amount: $${totalPrice.toFixed(2)}`, 20, doc.autoTable.previous.finalY + 20)

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
  doc.save(
    `voucher_for_${companies.value.filter((el) => el._id == transaction.companyId)[0].name}.pdf`
  )
}

const printExcel = (transaction) => {
  // Define your transactions in an array of objects
  // const companyName = companies.value.filter((el) => el._id == transaction.companyId)[0].name
  // const productName = products.value.filter((el) => el._id == transaction.productId)[0].name
  const data = {
    'Transaction ID': transaction._id,
    Client: transaction.person,
    Company: showCompany(transaction.companyId),
    Product: showProduct(transaction.productId),
    Quantity: transaction.quantity,
    Price: transaction.price,
    Total: transaction.quantity * transaction.price,
    Date: new Date(transaction.createdAt).toLocaleDateString()
  }

  // Create a new workbook and a new sheet
  const ws = XLSX.utils.json_to_sheet([data])
  const wb = XLSX.utils.book_new()

  // Add the sheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions')

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `Transaction_of_${showCompany(transaction.companyId)}.xlsx`)
}

// const printExcel = (transaction) => {
//   const ws = XLSX.utils.json_to_sheet([transaction]) // Export the single transaction as an array of one object
//   const wb = XLSX.utils.book_new()
//   XLSX.utils.book_append_sheet(wb, ws, 'Transaction')
//   XLSX.writeFile(wb, `Transaction_${transaction._id}.xlsx`) // File named with transaction ID
// }

const showCompany = (Id) => {
  if (companies.value.filter((el) => el._id == Id)[0]) {
    return companies.value.filter((el) => el._id == Id)[0].name
  } else {
    return 'Company not found'
  }
}
const showProduct = (Id) => {
  if (products.value.filter((el) => el._id == Id)[0]) {
    return products.value.filter((el) => el._id == Id)[0].name
  } else {
    return 'Product not found'
  }
}

onMounted(async () => {
  loading.value = true
  fetchCompaniesAndProducts()
  await authStore.fetchTransactions()
  if (authStore.transactions) {
    transactions.value = authStore.transactions.value
    loading.value = false
  }
  showCompany()
  showProduct()
})

onUpdated(() => {
  authStore.fetchTransactions()
  transactions.value = authStore.transactions.value
})
</script>
