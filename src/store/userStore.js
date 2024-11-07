import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('userStore', () => {
  const users = ref([])
  const loading = ref(false)

  const fetchUsers = async () => {
    const auth = useAuthStore()
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/utilisateurs', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      users.value = response.data
      console.log('Utilisateurs chargés :', users.value)
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs :', error)
    } finally {
      loading.value = false
    }
  }

  const addUser = async user => {
    const auth = useAuthStore()
    try {
      const response = await axios.post(
        'http://localhost:3000/utilisateurs/register',
        user,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      )
      users.value.push(response.data)
      console.log('Utilisateur ajouté :', response.data)
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error)
    }
  }

  const updateUser = async updatedUser => {
    const auth = useAuthStore()
    try {
      const response = await axios.put(
        `http://localhost:3000/utilisateurs/${updatedUser.id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      )
      const index = users.value.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        users.value[index] = response.data
        console.log('Utilisateur modifié :', response.data)
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
    }
  }

  const deleteUser = async id => {
    const auth = useAuthStore()
    try {
      await axios.delete(`http://localhost:3000/utilisateurs/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      users.value = users.value.filter(user => user.id !== id)
      console.log('Utilisateur supprimé :', id)
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error)
    }
  }

  const userById = id => {
    return users.value.find(user => user.id === parseInt(id))
  }

  return {
    users,
    loading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    userById,
  }
})
