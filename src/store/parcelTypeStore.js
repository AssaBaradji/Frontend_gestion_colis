import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './authStore'

export const useTypeColisStore = defineStore('typeColisStore', () => {
  const types = ref([])
  const loading = ref(false)
  const auth = useAuthStore()

  const fetchTypesColis = async () => {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/types-colis', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      types.value = response.data
      console.log('Types de colis chargés :', types.value)
    } catch (error) {
      console.error('Erreur lors du chargement des types de colis :', error)
    } finally {
      loading.value = false
    }
  }

  const addTypeColis = async type => {
    try {
      console.log("Données envoyées pour l'ajout :", type) 
      const response = await axios.post(
        'http://localhost:3000/types-colis',
        type,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      )
      types.value.push(response.data)
      return { success: true }
    } catch (error) {
      console.error("Erreur lors de l'ajout du type de colis :", error)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  const updateTypeColis = async updatedType => {
    try {
      console.log('Données pour la mise à jour :', updatedType)
      const response = await axios.put(
        `http://localhost:3000/types-colis/${updatedType.id}`,
        updatedType,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      )
      console.log('Réponse de mise à jour :', response.data)
      const index = types.value.findIndex(type => type.id === updatedType.id)
      if (index !== -1) {
        types.value[index] = response.data
      }
    } catch (error) {
      console.error('Erreur lors de la modification du type de colis :', error)
    }
  }

  const deleteTypeColis = async id => {
    try {
      await axios.delete(`http://localhost:3000/types-colis/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      types.value = types.value.filter(type => type.id !== id)
      console.log('Type de colis supprimé :', id)
      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la suppression du type de colis :', error)
      return {
        success: false,
        message:
          error.response?.data?.message || 'Erreur lors de la suppression.',
      } // Retourner l'erreur
    }
  }

  const typeColisById = id => {
    return types.value.find(type => type.id === parseInt(id))
  }

  return {
    types,
    loading,
    fetchTypesColis,
    addTypeColis,
    updateTypeColis,
    deleteTypeColis,
    typeColisById,
  }
})
