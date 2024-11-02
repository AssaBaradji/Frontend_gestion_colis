import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

const showToast = (type, message) => {
  if (type === 'success') {
    toast.success(message)
  } else if (type === 'error') {
    toast.error(message)
  }
}

export const useUserStore = defineStore('userStore', () => {
  const users = ref([])
  const loading = ref(false)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/utilisateurs')
      users.value = response.data
      console.log('Utilisateurs chargés :', users.value)
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs :', error)
      showToast('error', 'Erreur lors du chargement des utilisateurs.')
    } finally {
      loading.value = false
    }
  }

  const addUser = async user => {
    try {
      const response = await axios.post(
        'http://localhost:3000/utilisateurs/register',
        user,
      )
      users.value.push(response.data)
      showToast('success', 'Utilisateur ajouté avec succès !')
    } catch (error) {
      showToast('error', "Erreur lors de l'ajout de l'utilisateur.")
    }
  }

  const updateUser = async updatedUser => {
    try {
      const response = await axios.put(
        `http://localhost:3000/utilisateurs/${updatedUser.id}`,
        updatedUser,
      )
      const index = users.value.findIndex(user => user.id === updatedUser.id)
      if (index !== -1) {
        users.value[index] = response.data
        console.log('Utilisateur modifié :', response.data)
        showToast('success', 'Utilisateur modifié avec succès !')
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
      showToast('error', "Erreur lors de la mise à jour de l'utilisateur.")
    }
  }

  const deleteUser = async id => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`http://localhost:3000/utilisateurs/${id}`)
        users.value = users.value.filter(user => user.id !== id)
        console.log('Utilisateur supprimé :', id)
        showToast('success', 'Utilisateur supprimé avec succès !')
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error)
        showToast('error', "Erreur lors de la suppression de l'utilisateur.")
      }
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
