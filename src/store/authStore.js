import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')
  const isAuthenticated = ref(!!token.value)
  const router = useRouter()
  const userObject = ref()
  const userRole = computed(() => userObject.value?.role || '')
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
      console.log(userObject.value.email)

      if (userObject.value.statut === false) {
        router.push('/Bloque')
      } else {
        localStorage.setItem('userName', userObject.value.nom)
        localStorage.setItem('email', userObject.value.email)

        token.value = response.data.token
        localStorage.setItem('token', token.value)
        refreshToken.value = response.data.refreshToken
        isAuthenticated.value = true
        localStorage.setItem('userNewObject', response.data.utilisateur.role)
        localStorage.setItem('refreshToken', refreshToken.value)

        if (response.data.utilisateur.role === 'Admin') {
          await fetchUserProfile()
        }
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
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du profil utilisateur :',
        error,
      )
      logout()
    }
  }

  const updateProfile = async profile => {
    try {
      const response = await axios.put(
        'http://localhost:3000/utilisateurs/profile',
        profile,
      )
      user.value = response.data 
      localStorage.setItem('user', JSON.stringify(user.value)) 
      console.log('Profil mis à jour avec succès.')
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour du profil :',
        error.response?.data || error.message,
      )
      throw error
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put('http://localhost:3000/utilisateurs/change-password', {
        currentPassword,
        newPassword,
      })
      console.log('Mot de passe mis à jour avec succès.')
    } catch (error) {
      throw error
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
    localStorage.removeItem('user')
    router.push({ name: 'Login' })
  }

  const forgotPassword = async email => {
    try {
      await axios.post('http://localhost:3000/api/forgot-password', { email })
      console.log('Email de réinitialisation envoyé avec succès.')
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation :', error)
      throw new Error(
        "Impossible d'envoyer l'email de réinitialisation. Veuillez réessayer.",
      )
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post('http://localhost:3000/api/reset-password', {
        token,
        newPassword,
      })
      console.log('Mot de passe réinitialisé avec succès.')
    } catch (error) {
      console.error(
        'Erreur lors de la réinitialisation du mot de passe :',
        error,
      )
      throw new Error(
        'Impossible de réinitialiser le mot de passe. Veuillez réessayer.',
      )
    }
  }

  return {
    currentUser,
    token,
    isAuthenticated,
    userRole,
    user,
    login,
    logout,
    fetchUserProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  }
})
