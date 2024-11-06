<template>
    <div class="container mt-5">
      <h1 class="mb-4 text-center fw-bold display-4">
        Liste des Types de Colis
      </h1>
  
      <div class="text-end mb-4">
        <router-link
          to="/parcel-types/add"
          class="btn btn- fw-bold"
          style="color: white"
        >
          <i class="fas fa-plus"></i> Ajouter Type de Colis
        </router-link>
      </div>
  
      <div v-if="types.length === 0" class="text-center">
        <p>Aucun type de colis trouvé.</p>
      </div>
  
      <table v-else class="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nom</th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in types" :key="type.id">
            <td>{{ type.id }}</td>
            <td>{{ type.nom }}</td>
            <td class="text-center">
              <router-link
                :to="'/parcel-types/edit/' + type.id"
                class="btn btn-sm btn-outline-secondary me-2"
              >
                <i class="fas fa-edit"></i>
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="() => deleteType(type.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue'
   import { useTypeColisStore } from '@/store/parcelTypeStore.js'
  import { useToast } from 'vue-toastification'
  
  const toast = useToast()
  const store = useTypeColisStore()
  const types = computed(() => store.types)
  
  onMounted(async () => {
    await store.fetchTypesColis()
  })
  
  const deleteType = async id => {
    try {
      await store.deleteTypeColis(id)
      await store.fetchTypesColis()
      toast.success('Type de colis supprimé avec succès !')
    } catch (error) {
      console.error("Erreur lors de la suppression du type de colis :", error)
      toast.error("Erreur lors de la suppression du type de colis.")
    }
  }
  </script>
  
  <style scoped>
  h1 {
    color: #3fb59e;
    margin-block-start: 80px;
  }
  
  .table-striped > tbody > tr:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
  
  .btn- {
    background-color: #3fb59e;
    border-color: #3fb59e;
    color: white;
  }
  
  .btn-outline-secondary {
    border-color: #6c757d;
    color: #6c757d;
  }
  
  .btn-outline-danger {
    border-color: #dc3545;
    color: #dc3545;
  }
  </style>
  