<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold title-margin" style="color: #4a4a4a">
      Liste des Colis
    </h1>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="input-group" style="max-inline-size: 300px">
        <span class="input-group-text search-icon">
          <i class="fas fa-search"></i>
        </span>
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Rechercher un colis..."
        />
      </div>

      <router-link
        to="/parcels/add"
        class="btn btn- fw-bold"
        style="background-color: #3fb59e; color: white"
      >
        <i class="fas fa-plus"></i> Ajouter Colis
      </router-link>
    </div>

    <div v-if="filteredParcels.length === 0" class="text-center">
      <p>Aucun colis trouvé.</p>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th scope="col">ID Colis</th>
          <th scope="col">Code Colis</th>
          <th scope="col">Prix</th>
          <th scope="col">Date Enregistrement</th>
          <th scope="col">Emplacement</th>
          <th scope="col">Description</th>
          <th scope="col">Utilisateur</th>
          <th scope="col">Type de Colis</th>
          <th scope="col" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="parcel in filteredParcels" :key="parcel.id">
          <td>{{ parcel.id }}</td>
          <td>{{ parcel.code_colis }}</td>
          <td>{{ parcel.prix }}</td>
          <td>{{ parcel.date_enregistrement }}</td>
          <td>{{ parcel.emplacement_colis }}</td>
          <td>{{ parcel.description }}</td>
          <td>
            {{ parcel.utilisateur ? parcel.utilisateur.nom : 'Non attribué' }}
          </td>
          <td>{{ parcel.type ? parcel.type.nom : 'Non attribué' }}</td>
          <td class="text-center">
            <router-link
              :to="'/parcels/show/' + parcel.id"
              class="btn btn-sm btn-outline-info me-2"
            >
              <i class="fas fa-eye"></i>
            </router-link>
            <router-link
              :to="'/parcels/edit/' + parcel.id"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              <i class="fas fa-edit"></i>
            </router-link>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="() => deleteParcel(parcel.id)"
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
import { computed, onMounted, ref } from 'vue'
import { useParcelStore } from '@/store/parcelStore.js'
import { useTypeColisStore } from '@/store/parcelTypeStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const store = useParcelStore()
const typeStore = useTypeColisStore()
const userStore = useUserStore()

const parcels = ref([])
const types = ref([])
const users = ref([])
const searchQuery = ref('')

const fetchAndMapParcels = async () => {
  try {
    await store.fetchParcels()
    await typeStore.fetchTypesColis()
    await userStore.fetchUsers()

    parcels.value = store.parcels.map(parcel => ({
      ...parcel,
      utilisateur: userStore.users.find(
        user => user.id === parcel.utilisateurId
      ),
      type: typeStore.types.find(type => type.id === parcel.typeId),
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    toast.error('Erreur lors du chargement des données.')
  }
}

onMounted(fetchAndMapParcels)

const selectedType = ref('')
const filteredParcels = computed(() =>
  parcels.value.filter(parcel => {
    const matchesType = selectedType.value
      ? parcel.type && parcel.type.id === selectedType.value
      : true
    const matchesSearch = searchQuery.value
      ? parcel.code_colis
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        parcel.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      : true
    return matchesType && matchesSearch
  })
)
const deleteParcel = async id => {
  const result = await store.deleteParcel(id)
  if (result.success) {
    toast.success('Colis supprimé avec succès.')
    await fetchAndMapParcels()
  } else {
    console.error('Erreur lors de la suppression du colis')
    toast.error(`Erreur lors de la suppression du colis`)
  }
}
</script>
  
  <style scoped>
.text-primary {
  color: #4a4a4a;
}

.add-button:hover {
  background-color: #0056b3;
}

.search-icon {
  background-color: #e0e0e0;
  color: #4a4a4a;
}

.input-group-text {
  background-color: #f0f0f0;
  color: #4a4a4a;
  font-weight: bold;
}

.table thead {
  background-color: #f8f9fa;
  color: #4a4a4a;
}

.btn-outline-info {
  border-color: #17a2b8;
  color: #17a2b8;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.title-margin {
  margin-block-start: 80px;
}
</style>
  