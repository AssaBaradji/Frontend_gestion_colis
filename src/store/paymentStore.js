import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore'
import { useUserStore } from './userStore'
import { useParcelStore } from './parcelStore'
import { usePaymentMethodStore } from './paymentMethodStore'

export const usePaymentStore = defineStore('paymentStore', () => {
  const payments = ref([])
  const loading = ref(false)
  const auth = useAuthStore()
  const authToken = `Bearer ${auth.token}`

  const userStore = useUserStore()
  const parcelStore = useParcelStore()
  const paymentMethodStore = usePaymentMethodStore()

  const fetchPayments = async () => {
    loading.value = true
    try {
      await Promise.all([
        userStore.fetchUsers(),
        parcelStore.fetchParcels(),
        paymentMethodStore.fetchPaymentMethods(),
      ])

      const response = await axios.get('http://localhost:3000/paiements', {
        headers: {
          Authorization: authToken,
        },
      })

      payments.value = response.data.map(payment => ({
        ...payment,
        utilisateur: userStore.users.find(
          user => user.id === payment.utilisateurId,
        ) || { nom: 'Non attribué' },
        colis: parcelStore.parcels.find(
          parcel => parcel.id === payment.colisId,
        ) || { code_colis: 'Non attribué' },
        methodePaiement: paymentMethodStore.paymentMethods.find(
          method => method.id === payment.methodeId,
        ) || { nom: 'Non attribué' },
      }))
      return { success: true }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements :', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const addPayment = async payment => {
    try {
      const response = await axios.post(
        'http://localhost:3000/paiements',
        payment,
        {
          headers: {
            Authorization: authToken,
          },
        },
      )

      payments.value.push({
        ...response.data,
        utilisateur: userStore.users.find(
          user => user.id === response.data.utilisateurId,
        ) || { nom: 'Non attribué' },
        colis: parcelStore.parcels.find(
          parcel => parcel.id === response.data.colisId,
        ) || { code_colis: 'Non attribué' },
        methodePaiement: paymentMethodStore.paymentMethods.find(
          method => method.id === response.data.methodeId,
        ) || { nom: 'Non attribué' },
      })

      await fetchPayments()
      return { success: true }
    } catch (error) {
      console.error("Erreur lors de l'ajout du paiement :", error)
      return { success: false, error }
    }
  }

  const updatePayment = async updatedPayment => {
    try {
      const response = await axios.put(
        `http://localhost:3000/paiements/${updatedPayment.id}`,
        updatedPayment,
        {
          headers: {
            Authorization: authToken,
          },
        },
      )
      const index = payments.value.findIndex(
        payment => payment.id === updatedPayment.id,
      )
      if (index !== -1) {
        payments.value[index] = {
          ...response.data,
          utilisateur: userStore.users.find(
            user => user.id === response.data.utilisateurId,
          ) || { nom: 'Non attribué' },
          colis: parcelStore.parcels.find(
            parcel => parcel.id === response.data.colisId,
          ) || { code_colis: 'Non attribué' },
          methodePaiement: paymentMethodStore.paymentMethods.find(
            method => method.id === response.data.methodeId,
          ) || { nom: 'Non attribué' },
        }
        return { success: true }
      }
      return { success: false, error: 'Paiement non trouvé' }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement :', error)
      return { success: false, error }
    }
  }

  const deletePayment = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/paiements/${id}`);
      payments.value = payments.value.filter((payment) => payment.id !== id);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Erreur lors de la suppression du paiement :", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || "Erreur lors de la suppression.",
      };
    }
  };

  const paymentById = id =>
    payments.value.find(payment => payment.id === parseInt(id))

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
