import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const usePaymentStore = defineStore('paymentStore', () => {
  const payments = ref([])
  const loading = ref(false)

  const fetchPayments = async () => {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/paiements')
      payments.value = response.data
    } catch (error) {
      toast.error("Erreur lors du chargement des paiements.")
    } finally {
      loading.value = false
    }
  }

  const addPayment = async payment => {
    try {
      const response = await axios.post('http://localhost:3000/paiements', payment)
      payments.value.push(response.data)
      toast.success("Paiement ajouté avec succès !")
    } catch (error) {
      toast.error("Erreur lors de l'ajout du paiement.")
    }
  }

  const updatePayment = async updatedPayment => {
    try {
      const response = await axios.put(`http://localhost:3000/paiements/${updatedPayment.id}`, updatedPayment)
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
    try {
      await axios.delete(`http://localhost:3000/paiements/${id}`)
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
