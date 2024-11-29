import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore'

export const useShipmentStore = defineStore('shipmentStore', () => {
  const shipments = ref([])
  const loading = ref(false)
  const auth = useAuthStore()
  const authToken = `Bearer ${auth.token}`

  const fetchShipments = async () => {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/expeditions', {
        headers: {
          Authorization: authToken,
        },
      })
      shipments.value = response.data
      console.log('Expéditions chargées :', shipments.value)
      return { success: true }
    } catch (error) {
      console.error('Erreur lors du chargement des expéditions :', error)
      return { success: false, error: error.response?.data || error.message }
    } finally {
      loading.value = false
    }
  }

  const addShipment = async shipment => {
    try {
      const response = await axios.post(
        'http://localhost:3000/expeditions',
        shipment,
        {
          headers: {
            Authorization: authToken,
          },
        },
      )
      shipments.value.push(response.data)
      return { success: true }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'expédition :", error)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  const updateShipment = async updatedShipment => {
    try {
      const response = await axios.put(
        `http://localhost:3000/expeditions/${updatedShipment.id}`,
        updatedShipment,
        {
          headers: {
            Authorization: authToken,
          },
        },
      )
      const index = shipments.value.findIndex(
        shipment => shipment.id === updatedShipment.id,
      )
      if (index !== -1) {
        shipments.value[index] = response.data
        console.log('Expédition modifiée :', response.data)
        return { success: true }
      }
      return { success: false, error: 'Expédition non trouvée' }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'expédition :", error)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  const deleteShipment = async id => {
    try {
      await axios.delete(`http://localhost:3000/expeditions/${id}`, {
        headers: {
          Authorization: authToken,
        },
      })
      shipments.value = shipments.value.filter(shipment => shipment.id !== id)
      console.log('Expédition supprimée :', id)
      return { success: true }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'expédition :", error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }
  const shipmentById = id => {
    return shipments.value.find(shipment => shipment.id === parseInt(id))
  }

  return {
    shipments,
    loading,
    fetchShipments,
    addShipment,
    updateShipment,
    deleteShipment,
    shipmentById,
  }
})
