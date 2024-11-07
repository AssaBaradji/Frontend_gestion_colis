import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { useAuthStore } from './authStore'

const toast = useToast()

export const usePaymentStore = defineStore('paymentStore', () => {
  const payments = ref([])
  const loading = ref(false)
  const auth = useAuthStore();


  const fetchPayments = async () => {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/paiements',{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      payments.value = response.data
    } catch (error) {
      toast.error("Erreur lors du chargement des paiements.")
    } finally {
      loading.value = false
    }
  }

  const addPayment = async payment => {
    const auth = useAuthStore();
    try {
      const response = await axios.post('http://localhost:3000/paiements', payment,{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      payments.value.push(response.data)
      toast.success("Paiement ajouté avec succès !")
    } catch (error) {
      toast.error("Erreur lors de l'ajout du paiement.")
    }
  }

  const updatePayment = async updatedPayment => {
    const auth = useAuthStore();
    try {
      const response = await axios.put(`http://localhost:3000/paiements/${updatedPayment.id}`, updatedPayment,{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      const index = payments.value.findIndex(p => p.id === updatedPayment.id)
      if (index !== -1) {
        payments.value[index] = response.data
        toast.success("Paiement mis à jour avec succès !")
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du paiement.")
    }
  }

  const deletePayment = async id => {
    const auth = useAuthStore();
    try {
      await axios.delete(`http://localhost:3000/paiements/${id}`,{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      payments.value = payments.value.filter(payment => payment.id !== id)
      toast.success("Paiement supprimé avec succès !")
    } catch (error) {
      toast.error("Erreur lors de la suppression du paiement.")
    }
  }

  const paymentById = id => payments.value.find(payment => payment.id === parseInt(id))

  return {
    payments,
    loading,
    fetchPayments,
    addPayment,
    updatePayment,
    deletePayment,
    paymentById,
  }
})
