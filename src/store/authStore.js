// import { defineStore } from 'pinia'
// import axios from 'axios'
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'

// export const useAuthStore = defineStore('auth', () => {
//   const user = ref(null)
//   const token = ref(localStorage.getItem('token') || '')
//   const isAuthenticated = ref(!!token.value)
//   const router = useRouter()

//   // Méthode pour se connecter
//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('http://localhost:3000/login', {
//         email,
//         mot_de_passe: password,
//       })
//       token.value = response.data.token
//       isAuthenticated.value = true
//       localStorage.setItem('token', token.value)
//       await fetchUserProfile()
//       router.push({ name: 'Home' }) // Redirection vers la page d'accueil
//     } catch (error) {
//       console.error("Erreur lors de l'authentification :", error)
//       throw new Error(
//         "Échec de l'authentification. Veuillez vérifier vos identifiants.",
//       )
//     }
//   }

//   // Méthode pour récupérer les informations de l'utilisateur connecté
//   const fetchUserProfile = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/user', {
//         headers: { Authorization: `Bearer ${token.value}` },
//       })
//       user.value = response.data
//     } catch (error) {
//       console.error(
//         'Erreur lors de la récupération du profil utilisateur :',
//         error,
//       )
//     }
//   }

//   // Méthode pour se déconnecter
//   const logout = () => {
//     token.value = ''
//     user.value = null
//     isAuthenticated.value = false
//     localStorage.removeItem('token')
//     router.push({ name: 'Login' }) // Redirection vers la page de connexion
//   }

//   return {
//     user,
//     token,
//     isAuthenticated,
//     login,
//     logout,
//     fetchUserProfile,
//   }
// })
import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const isAuthenticated = ref(!!token.value)
  const router = useRouter()

  // Alias pour `user`, utilisé comme `currentUser` dans les composants
  const currentUser = computed(() => user.value)

  // Configure Axios pour inclure automatiquement le token
  axios.interceptors.request.use(config => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  // Méthode pour se connecter
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        mot_de_passe: password,
      })
      token.value = response.data.token
      isAuthenticated.value = true
      localStorage.setItem('token', token.value)
      await fetchUserProfile()
      router.push({ name: 'Home' }) // Redirection vers la page d'accueil
    } catch (error) {
      console.error("Erreur lors de l'authentification :", error)
      throw new Error("Échec de l'authentification. Veuillez vérifier vos identifiants.")
    }
  }

  // Méthode pour récupérer les informations de l'utilisateur connecté
  const fetchUserProfile = async () => {
    if (!token.value) return // Ne pas tenter la requête si le token n'est pas présent
    try {
      const response = await axios.get('http://localhost:3000/utilisateurs/')
      user.value = response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur :', error)
      logout() // Se déconnecter en cas d'erreur d'authentification
    }
  }

  // Méthode pour se déconnecter
  const logout = () => {
    token.value = ''
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    router.push({ name: 'Login' }) // Redirection vers la page de connexion
  }

 
  onMounted(() => {
    if (token.value) {
      fetchUserProfile()
    }
  })

  return {
    currentUser, // Utilisez `currentUser` dans vos composants
    token,
    isAuthenticated,
    login,
    logout,
    fetchUserProfile,
  }
})
