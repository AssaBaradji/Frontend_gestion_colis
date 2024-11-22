import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore'

export const useParcelStore = defineStore('parcelStore', () => {
  const parcels = ref([])
  const loading = ref(false)
  const auth = useAuthStore()
  const authToken = `Bearer ${auth.token}`

  const fetchParcels = async () => {
    loading.value = true
    console.log('token valide', auth.token)
    try {
      const response = await axios.get('http://localhost:3000/colis', {
        headers: {
          Authorization: authToken,
        },
      })
      parcels.value = response.data
      console.log('Colis chargés :', parcels.value)
      return { success: true }
    } catch (error) {
      console.error('Erreur lors du chargement des colis :', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  const addParcel = async parcel => {
    try {
      const response = await axios.post('http://localhost:3000/colis', parcel, {
        headers: {
          Authorization: authToken,
        },
      })
      parcels.value.push(response.data)
      return { success: true }
    } catch (error) {
      console.error("Erreur lors de l'ajout du colis :", error)
      return { success: false, error }
    }
  }

  const updateParcel = async updatedParcel => {
    try {
      const response = await axios.put(
        `http://localhost:3000/colis/${updatedParcel.id}`,
        updatedParcel,
        {
          headers: {
            Authorization: authToken,
          },
        },
      )
      const index = parcels.value.findIndex(
        parcel => parcel.id === updatedParcel.id,
      )
      if (index !== -1) {
        parcels.value[index] = response.data
        console.log('Colis modifié :', response.data)
        return { success: true }
      }
      return { success: false, error: 'Colis non trouvé' }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du colis :', error)
      return { success: false, error }
    }
  }

  const deleteParcel = async id => {
    try {
      await axios.delete(`http://localhost:3000/colis/${id}`, {
        headers: {
          Authorization: authToken,
        },
      })
      parcels.value = parcels.value.filter(parcel => parcel.id !== id)
      console.log('Colis supprimé :', id)
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la suppression du colis :', error)
      return { success: false, error }
    }
  }

  const parcelById = id => {
    return parcels.value.find(parcel => parcel.id === parseInt(id))
  }

  return {
    parcels,
    loading,
    fetchParcels,
    addParcel,
    updateParcel,
    deleteParcel,
    parcelById,
  }
})
