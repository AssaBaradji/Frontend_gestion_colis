<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold title-margin" style="color: #3fb59e">
      Liste des Expéditions
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
          placeholder="Rechercher une expédition..."
        />
      </div>

      <router-link
        to="/shipments/add"
        class="btn btn-primary fw-bold add-button"
        style="background-color: #3fb59e; color: white"
      >
        <i class="fas fa-plus"></i> Ajouter Expédition
      </router-link>
    </div>

    <div v-if="paginatedShipments.length === 0" class="text-center">
      <p>Aucune expédition trouvée.</p>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th @click="toggleSortOrder('id')" style="cursor: pointer">
            ID 
            <span v-if="sortBy === 'id'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th
            @click="toggleSortOrder('nom_destinataire')"
            style="cursor: pointer"
          >
            Nom Destinataire
            <span v-if="sortBy === 'nom_destinataire'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th
            @click="toggleSortOrder('prenom_destinataire')"
            style="cursor: pointer"
          >
            Prénom Destinataire
            <span v-if="sortBy === 'prenom_destinataire'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th @click="toggleSortOrder('destination')" style="cursor: pointer">
            Téléphone
            <span v-if="sortBy === 'destination'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th
            @click="toggleSortOrder('destination')"
            style="cursor: pointer"
          >
            Destination
            <span v-if="sortBy === 'destination'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th
            @click="toggleSortOrder('date_expedition')"
            style="cursor: pointer"
          >
            Date Expédition
            <span v-if="sortBy === 'date_expedition'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>

          <th scope="col">Utilisateur</th>
          <th scope="col">Colis</th>
          <th scope="col" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="shipment in paginatedShipments" :key="shipment.id">
          <td>{{ shipment.id }}</td>
          <td>{{ shipment.nom_destinataire }}</td>
          <td>{{ shipment.prenom_destinataire }}</td>
          <td>{{ shipment.telephone_destinataire }}</td>
          <td>{{ shipment.destination }}</td>
          <td>{{ new Date(shipment.date_expedition).toLocaleDateString() }}</td>
          <td>
            {{
              shipment.utilisateur ? shipment.utilisateur.nom : 'Non attribué'
            }}
          </td>
          <td>
            {{ shipment.colis ? shipment.colis.code_colis : 'Non attribué' }}
          </td>
          <td class="text-center">
            <router-link
              :to="'/shipments/show/' + shipment.id"
              class="btn btn-sm btn-outline-info me-2"
            >
              <i class="fas fa-eye"></i>
            </router-link>
            <router-link
              :to="'/shipments/edit/' + shipment.id"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              <i class="fas fa-edit"></i>
            </router-link>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="() => deleteShipment(shipment.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>


    <div class="d-flex justify-content-center mt-4">
      <button
        class="btn btn-outline-secondary"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        <i class="fas fa-chevron-left"></i> Précédent
      </button>
      <span class="mx-3">Page {{ currentPage }} sur {{ totalPages }}</span>
      <button
        class="btn btn-outline-secondary"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Suivant <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useShipmentStore } from '@/store/shipmentStore.js'
import { useParcelStore } from '@/store/parcelStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const shipmentStore = useShipmentStore()
const parcelStore = useParcelStore()
const userStore = useUserStore()

const shipments = ref([])
const searchQuery = ref('')
const sortBy = ref('id') 
const sortOrder = ref('asc') 

const currentPage = ref(1)
const itemsPerPage = 4

const fetchAndMapShipments = async () => {
  try {
    await shipmentStore.fetchShipments()
    await parcelStore.fetchParcels()
    await userStore.fetchUsers()

    shipments.value = shipmentStore.shipments.map(shipment => ({
      ...shipment,
      utilisateur: userStore.users.find(
        user => user.id === shipment.utilisateurId
      ),
      colis: parcelStore.parcels.find(parcel => parcel.id === shipment.colisId),
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    toast.error('Erreur lors du chargement des données.')
  }
}

onMounted(fetchAndMapShipments)

const toggleSortOrder = field => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const filteredShipments = computed(() => {
  return shipments.value.filter(shipment => {
    const matchesSearch = searchQuery.value
      ? shipment.nom_destinataire
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        shipment.prenom_destinataire
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        shipment.destination
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      : true
    return matchesSearch
  })
})

const sortedShipments = computed(() => {
  return [...filteredShipments.value].sort((a, b) => {
    const fieldA = a[sortBy.value] || ''
    const fieldB = b[sortBy.value] || ''
    if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedShipments = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return sortedShipments.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  return Math.ceil(sortedShipments.value.length / itemsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const deleteShipment = async id => {
  const confirmation = confirm('Voulez-vous vraiment supprimer cette expédition ?')
  if (confirmation) {
    const result = await shipmentStore.deleteShipment(id)
    if (result.success) {
      toast.success('Expédition supprimée avec succès.')
    } else {
      toast.error('imposible de supprimer cette expedition est lié à colis')
    }
  } else {
    toast.warning('Suppression annulée.')
  }
}
</script>

<style scoped>
.text-primary {
  color: #3fb59e;
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
