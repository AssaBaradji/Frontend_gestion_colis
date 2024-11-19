import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')
  const isAuthenticated = ref(!!token.value)
  const router = useRouter()
  const userObject = ref()
  const userRole = computed(() => userObject.value.role || '')

  const currentUser = computed(() => user.value)

  axios.interceptors.request.use(
    async config => {
      if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}`
      }
      return config
    },
    error => Promise.reject(error),
  )

  axios.interceptors.response.use(
    response => response,
    async error => {
      if (error.response && error.response.status === 401) {
        try {
          await refreshAccessToken()
          error.config.headers.Authorization = `Bearer ${token.value}`
          return axios(error.config)
        } catch (refreshError) {
          logout()
          throw refreshError
        }
      }
      return Promise.reject(error)
    },
  )

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        mot_de_passe: password,
      })

      userObject.value = response.data.utilisateur
      if (userObject.value.statut === false) {
        router.push('/Bloque')
      } else {
        token.value = response.data.token
        refreshToken.value = response.data.refreshToken
        isAuthenticated.value = true
        localStorage.setItem('userNewObject', response.data.utilisateur.role)
        localStorage.setItem('token', token.value)
        localStorage.setItem('refreshToken', refreshToken.value)
        await fetchUserProfile()
        router.push({ name: 'Home' })
      }
    } catch (error) {
      console.error("Erreur lors de l'authentification :", error)
      throw new Error(
        "Échec de l'authentification. Veuillez vérifier vos identifiants.",
      )
    }
  }

  const fetchUserProfile = async () => {
    if (!token.value) return
    try {
      const response = await axios.get('http://localhost:3000/utilisateurs/')
      user.value = response.data
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du profil utilisateur :',
        error,
      )
      logout()
    }
  }

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:3000/refresh-token', {
        refreshToken: refreshToken.value,
      })
      token.value = response.data.token
      localStorage.setItem('token', token.value)
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du jeton :', error)
      logout()
      throw new Error('Session expirée. Veuillez vous reconnecter.')
    }
  }

  const logout = () => {
    token.value = ''
    refreshToken.value = ''
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    router.push({ name: 'Login' })
  }

  return {
    currentUser,
    token,
    isAuthenticated,
    userRole,
    login,
    logout,
    fetchUserProfile,
  }
})
