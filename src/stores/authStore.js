import { defineStore } from 'pinia'
import axios from 'axios'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    logged: localStorage.getItem('token') ? true : false,
    user: null,
    users: [],
    companies: [],
    products: [],
    transactions: [],
    store: null,
    userUpdated: false
  }),
  actions: {
    async login(credentials) {
      try {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', credentials)
        this.user = data.user
        this.token = data.token
        localStorage.setItem('token', data.token)
        localStorage.setItem('email', data.email)
        localStorage.setItem('username', data.username)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        console.log('Login succeed:', data)
        this.logged = true
        console.log('Logged changed to', this.logged)
      } catch (error) {
        console.log('Login failed: ', error)
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      delete axios.defaults.headers.common['Authorization']
      this.logged = false
      console.log('Logged changed to', this.logged)
    },
    async fetchUser() {
      if (this.token) {
        try {
          const { data } = await axios.get('http://localhost:5000/api/auth/profile')
          this.users = data
          const userMail = localStorage.getItem('email')
          this.user = this.users.filter((user) => user.email.includes(userMail))[0]
        } catch (error) {
          // this.logout()
          console.log('error fetching data: ', error)
        }
      }
    },
    async fetchCompanies() {
      try {
        const response = await axios.get('http://localhost:5000/api/companies')
        this.companies.value = response.data
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/products')
        this.products.value = response.data
      } catch (error) {
        console.log('error fetching data', error)
      }
    },
    async fetchTransactions() {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions')
        this.transactions.value = response.data
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    },
    async fetchStore() {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/store', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
          }
        })
        this.store = { ...response.data }
      } catch (err) {
        console.log('Error fetching Store:', err)
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token
  }
})
