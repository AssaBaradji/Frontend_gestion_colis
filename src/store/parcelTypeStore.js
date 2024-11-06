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

export const useTypeColisStore = defineStore('typeColisStore', () => {
  const types = ref([])
  const loading = ref(false)

  // Récupère la liste des types de colis
  const fetchTypesColis = async () => {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/types-colis')
      types.value = response.data
      console.log('Types de colis chargés :', types.value)
    } catch (error) {
      console.error('Erreur lors du chargement des types de colis :', error)
      showToast('error', 'Erreur lors du chargement des types de colis.')
    } finally {
      loading.value = false
    }
  }

  // Ajoute un nouveau type de colis
  const addTypeColis = async type => {
    try {
      const response = await axios.post('http://localhost:3000/types-colis', type)
      types.value.push(response.data)
      showToast('success', 'Type de colis ajouté avec succès !')
    } catch (error) {
      console.error("Erreur lors de l'ajout du type de colis :", error)
      showToast('error', "Erreur lors de l'ajout du type de colis.")
    }
  }

  // Met à jour un type de colis existant
  const updateTypeColis = async updatedType => {
    try {
      const response = await axios.put(`http://localhost:3000/types-colis/${updatedType.id}`, updatedType)
      const index = types.value.findIndex(type => type.id === updatedType.id)
      if (index !== -1) {
        types.value[index] = response.data
        console.log('Type de colis modifié :', response.data)
        showToast('success', 'Type de colis modifié avec succès !')
      }
    } catch (error) {
      console.error("Erreur lors de la modification du type de colis :", error)
      showToast('error', "Erreur lors de la modification du type de colis.")
    }
  }

  // Supprime un type de colis
  const deleteTypeColis = async id => {
    try {
      await axios.delete(`http://localhost:3000/types-colis/${id}`)
      types.value = types.value.filter(type => type.id !== id)
      console.log('Type de colis supprimé :', id)
      showToast('success', 'Type de colis supprimé avec succès !')
    } catch (error) {
      console.error("Erreur lors de la suppression du type de colis :", error)
      showToast('error', "Erreur lors de la suppression du type de colis.")
    }
  }

  // Récupère un type de colis par ID
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
