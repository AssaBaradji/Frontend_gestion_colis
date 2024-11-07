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

export const useShipmentStore = defineStore('shipmentStore', () => { 
  const shipments = ref([])
  const loading = ref(false)
  const auth = useAuthStore();

  const fetchShipments = async () => {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/expeditions',{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      shipments.value = response.data
      console.log('Expéditions chargées :', shipments.value)
    } catch (error) {
      console.error('Erreur lors du chargement des expéditions :', error)
      showToast('error', 'Erreur lors du chargement des expéditions.')
    } finally {
      loading.value = false
    }
  }

  const addShipment = async shipment => {
    const auth = useAuthStore();
    try {
      const response = await axios.post(
        'http://localhost:3000/expeditions',
        shipment,{
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      )
      shipments.value.push(response.data)
      showToast('success', 'Expédition ajoutée avec succès !')
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'expédition :", error)
      showToast('error', "Erreur lors de l'ajout de l'expédition.")
    }
  }

  const updateShipment = async updatedShipment => {
    const auth = useAuthStore();
    try {
      const response = await axios.put(
        `http://localhost:3000/expeditions/${updatedShipment.id}`,
        updatedShipment,{
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      )
      const index = shipments.value.findIndex(
        shipment => shipment.id === updatedShipment.id,
      )
      if (index !== -1) {
        shipments.value[index] = response.data
        console.log('Expédition modifiée :', response.data)
        showToast('success', 'Expédition modifiée avec succès !')
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'expédition :", error)
      showToast('error', "Erreur lors de la mise à jour de l'expédition.")
    }
  }

  const deleteShipment = async id => {
    const auth = useAuthStore();
    try {
      await axios.delete(`http://localhost:3000/expeditions/${id}`,{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      shipments.value = shipments.value.filter(shipment => shipment.id !== id)
      console.log('Expédition supprimée :', id)
      showToast('success', 'Expédition supprimée avec succès !')
    } catch (error) {
      console.error("Erreur lors de la suppression de l'expédition :", error)
      showToast('error', "Erreur lors de la suppression de l'expédition.")
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
