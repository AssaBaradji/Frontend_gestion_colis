import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore'
import { useUserStore } from './userStore'

export const usePaymentMethodStore = defineStore('paymentMethodStore', () => {
  const paymentMethods = ref([])
  const loading = ref(false)
  const auth = useAuthStore()
  const userStore = useUserStore()
  const authToken = `Bearer ${auth.token}`

  const fetchPaymentMethods = async () => {
    loading.value = true
    try {
      await userStore.fetchUsers()
      const response = await axios.get(
        'http://localhost:3000/methodes-paiement',
        {
          headers: {
            Authorization: authToken,
          },
        },
      )

      paymentMethods.value = response.data.map(method => ({
        ...method,
        utilisateur: userStore.users.find(
          user => user.id === method.utilisateurId,
        ) || { nom: 'Non attribué' },
      }))
      return { success: true }
    } catch (error) {
      console.error(
        'Erreur lors du chargement des méthodes de paiement :',
        error,
      )
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const addPaymentMethod = async method => {
    try {
      const response = await axios.post(
        'http://localhost:3000/methodes-paiement',
        method,
        {
          headers: {
            Authorization: authToken,
          },
        },
      )

      paymentMethods.value.push({
        ...response.data,
        utilisateur: userStore.users.find(
          user => user.id === response.data.utilisateurId,
        ) || { nom: 'Non attribué' },
      })
      await fetchPaymentMethods()
      return { success: true }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la méthode de paiement :", error)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  const updatePaymentMethod = async updatedMethod => {
    try {
      const response = await axios.put(
        `http://localhost:3000/methodes-paiement/${updatedMethod.id}`,
        updatedMethod,
        {
          headers: {
            Authorization: authToken,
          },
        },
      )
      const index = paymentMethods.value.findIndex(
        method => method.id === updatedMethod.id,
      )
      if (index !== -1) {
        paymentMethods.value[index] = {
          ...response.data,
          utilisateur: userStore.users.find(
            user => user.id === response.data.utilisateurId,
          ) || { nom: 'Non attribué' },
        }
        return { success: true }
      }
      return { success: false, error: 'Méthode de paiement non trouvée' }
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de la méthode de paiement :',
        error,
      )
      return { success: false, error: error.response?.data || error.message }
    }
  }

  const deletePaymentMethod = async id => {
    try {
      await axios.delete(`http://localhost:3000/methodes-paiement/${id}`, {
        headers: {
          Authorization: authToken,
        },
      })
      paymentMethods.value = paymentMethods.value.filter(
        method => method.id !== id,
      )
      return { success: true }
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de la méthode de paiement :',
        error,
      )
      return {
        success: false,
        error:
          error.response?.data?.message || 'Erreur lors de la suppression.',
      }
    }
  }

  const getPaymentMethodById = id => {
    const method = paymentMethods.value.find(
      method => method.id === parseInt(id),
    )
    if (method) {
      return {
        ...method,
        utilisateur: userStore.users.find(
          user => user.id === method.utilisateurId,
        ) || { nom: 'Non attribué' },
      }
    }
    return null
  }

  return {
    paymentMethods,
    loading,
    fetchPaymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getPaymentMethodById,
  }
})
