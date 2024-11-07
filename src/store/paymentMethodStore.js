import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useAuthStore } from './authStore'

const toast = useToast()

const showToast = (type, message) => {
  if (type === 'success') {
    toast.success(message)
  } else if (type === 'error') {
    toast.error(message)
  }
}

export const usePaymentMethodStore = defineStore('paymentMethodStore', () => {
  const paymentMethods = ref([])
  const loading = ref(false)
  const auth = useAuthStore();

  const fetchPaymentMethods = async () => {
    const auth = useAuthStore();
    loading.value = true
    try {
      const response = await axios.get(
        'http://localhost:3000/methodes-paiement',{
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      )
      paymentMethods.value = response.data
      console.log('Méthodes de paiement chargées :', paymentMethods.value)
    } catch (error) {
      console.error(
        'Erreur lors du chargement des méthodes de paiement :',
        error,
      )
      showToast('error', 'Erreur lors du chargement des méthodes de paiement.')
    } finally {
      loading.value = false
    }
  }

  const addPaymentMethod = async method => {
    const auth = useAuthStore();
    try {
      const response = await axios.post(
        'http://localhost:3000/methodes-paiement',
        method,{
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      )
      paymentMethods.value.push(response.data)
      showToast('success', 'Méthode de paiement ajoutée avec succès !')
    } catch (error) {
      console.error("Erreur lors de l'ajout de la méthode de paiement :", error)
      showToast('error', "Erreur lors de l'ajout de la méthode de paiement.")
    }
  }

  const updatePaymentMethod = async updatedMethod => {
    const auth = useAuthStore();
    try {
      const response = await axios.put(
        `http://localhost:3000/methodes-paiement/${updatedMethod.id}`,
        updatedMethod,{
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      )
      const index = paymentMethods.value.findIndex(
        method => method.id === updatedMethod.id,
      )
      if (index !== -1) {
        paymentMethods.value[index] = response.data
        console.log('Méthode de paiement modifiée :', response.data)
        showToast('success', 'Méthode de paiement modifiée avec succès !')
      }
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de la méthode de paiement :',
        error,
      )
      showToast(
        'error',
        'Erreur lors de la mise à jour de la méthode de paiement.',
      )
    }
  }

  const deletePaymentMethod = async id => {
    const auth = useAuthStore();
    try {
      await axios.delete(`http://localhost:3000/methodes-paiement/${id}`,{
        headers:{
          Authorization:`Barear ${auth.token}`
        }
      })
      paymentMethods.value = paymentMethods.value.filter(
        method => method.id !== id,
      )
      console.log('Méthode de paiement supprimée :', id)
      showToast('success', 'Méthode de paiement supprimée avec succès !')
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de la méthode de paiement :',
        error,
      )
      showToast(
        'error',
        'Erreur lors de la suppression de la méthode de paiement.',
      )
    }
  }

  const getPaymentMethodById = id => {
    return paymentMethods.value.find(method => method.id === parseInt(id))
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
