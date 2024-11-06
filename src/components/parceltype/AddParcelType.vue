<template>
    <div class="container mt-5">
      <h1 class="mb-4 text-center fw-bold display-4">Ajouter un Type de Colis</h1>
  
      <div class="p-4 bg-light rounded shadow-sm">
        <form @submit.prevent="addParcelType">
          <div class="mb-3">
            <label for="nom" class="form-label fw-bold text-primary">Nom:</label>
            <input
              type="text"
              id="nom"
              class="form-control"
              v-model="type.nom"
              placeholder="Entrez le nom du type de colis"
              required
            />
          </div>
  
          <button type="submit" class="btn btn-primary w-100 fw-bold">
            <i class="fas fa-save"></i> Ajouter Type de Colis
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
   import { useTypeColisStore } from '@/store/parcelTypeStore.js'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vue-toastification'
  
  const store = useTypeColisStore()
  const router = useRouter()
  const toast = useToast()
  
  const type = ref({
    nom: ''
  })
  
  const addParcelType = async () => {
    try {
      await store.addTypeColis(type.value)
      toast.success('Type de colis ajouté avec succès !')
      router.push('/parcel-types')
    } catch (error) {
      console.error("Erreur lors de l'ajout du type de colis :", error)
      toast.error("Erreur lors de l'ajout du type de colis.")
    }
  }
  </script>
  
  <style scoped>
  h1 {
    color: #3fb59e;
    margin-block-start: 80px;
  }
  
  .form-label {
    color: #3fb59e;
  }
  
  .btn-primary {
    background-color: #3fb59e;
    border-color: #3fb59e;
  }
  
  .btn-primary:hover {
    background-color: #349d87;
    border-color: #349d87;
  }
  </style>
  