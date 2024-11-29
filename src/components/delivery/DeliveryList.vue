<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold" style="color: #3fb59e">
      Liste des Livraisons
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
          placeholder="Rechercher une livraison..."
        />
      </div>

      <router-link
        to="/delivery/add"
        class="btn btn-primary fw-bold"
        style="background-color: #3fb59e; color: white"
      >
        <i class="fas fa-plus"></i> Ajouter Livraison
      </router-link>
    </div>

    <div
      v-if="paginatedDeliveries.length === 0 && !loading"
      class="text-center"
    >
      <p>Aucune livraison trouvée.</p>
    </div>

    <div v-if="loading" class="text-center">
      <i class="fas fa-spinner fa-spin fa-2x" style="color: #3fb59e"></i>
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
          <th @click="toggleSortOrder('nom')" style="cursor: pointer">
            Nom
            <span v-if="sortBy === 'nom'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th @click="toggleSortOrder('prenom')" style="cursor: pointer">
            Prénom
            <span v-if="sortBy === 'prenom'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th>Date de Livraison</th>
          <th>Téléphone</th>
          <th>Utilisateur</th>
          <th>Expédition</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="delivery in paginatedDeliveries" :key="delivery.id">
          <td>{{ delivery.id }}</td>
          <td>{{ delivery.nom }}</td>
          <td>{{ delivery.prenom }}</td>
          <td>{{ new Date(delivery.date_livraison).toLocaleDateString() }}</td>
          <td>{{ delivery.telephone }}</td>
          <td>{{ delivery.utilisateur ? delivery.utilisateur.nom : 'N/A' }}</td>
          <td>
            {{
              delivery.expedition ? delivery.expedition.colis.code_colis : 'N/A'
            }}
          </td>
          <td class="text-center">
            <router-link
              :to="'/delivery/show/' + delivery.id"
              class="btn btn-sm btn-outline-info me-2"
            >
              <i class="fas fa-eye"></i>
            </router-link>
            <router-link
              :to="'/delivery/edit/' + delivery.id"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              <i class="fas fa-edit"></i>
            </router-link>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="confirmDelete(delivery.id)"
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
import { ref, computed, onMounted } from 'vue'
import { useDeliveryStore } from '@/store/deliveryStore.js'
import { useShipmentStore } from '@/store/shipmentStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useToast } from 'vue-toastification'

const deliveryStore = useDeliveryStore()
const shipmentStore = useShipmentStore()
const userStore = useUserStore()
const toast = useToast()

const deliveries = ref([])
const loading = ref(false)
const searchQuery = ref('')
const sortBy = ref('id')
const sortOrder = ref('asc')

const currentPage = ref(1)
const itemsPerPage = 5

onMounted(async () => {
  loading.value = true
  try {
    await deliveryStore.fetchDeliveries()
    await shipmentStore.fetchShipments()
    await userStore.fetchUsers()

    deliveries.value = deliveryStore.deliveries.map(delivery => ({
      ...delivery,
      utilisateur: userStore.users.find(
        user => user.id === delivery.utilisateurId
      ),
      expedition: shipmentStore.shipments.find(
        shipment => shipment.id === delivery.expeditionId
      ),
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    toast.error('Erreur lors du chargement des données.')
  } finally {
    loading.value = false
  }
})

const filteredDeliveries = computed(() =>
  deliveries.value.filter(
    delivery =>
      (delivery.nom || '')
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      (delivery.prenom || '')
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      (delivery.utilisateur?.nom || '')
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      (delivery.expedition?.nom_destinataire || '')
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
  )
)

const sortedDeliveries = computed(() => {
  const filtered = filteredDeliveries.value
  return filtered.sort((a, b) => {
    const fieldA = a[sortBy.value]?.toLowerCase?.() || a[sortBy.value] || ''
    const fieldB = b[sortBy.value]?.toLowerCase?.() || b[sortBy.value] || ''
    if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const totalPages = computed(() =>
  Math.ceil(sortedDeliveries.value.length / itemsPerPage)
)

const paginatedDeliveries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedDeliveries.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const toggleSortOrder = field => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const confirmDelete = async id => {
  const confirmation = confirm(
    'Voulez-vous vraiment supprimer cette livraison ?'
  )
  if (confirmation) {
    await deleteDelivery(id)
  } else {
    toast.warning('Suppression Annulé!')
  }
}

const deleteDelivery = async id => {
  try {
    await deliveryStore.deleteDelivery(id)
    toast.success('Livraison supprimée avec succès.')
    deliveries.value = deliveries.value.filter(delivery => delivery.id !== id)
  } catch (error) {
    console.error('Erreur lors de la suppression de la livraison :', error)
    toast.error('Erreur lors de la suppression de la livraison.')
  }
}
</script>

<style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}
.btn-primary {
  background-color: #3fb59e;
  border-color: #3fb59e;
}
.search-icon {
  background-color: #e0e0e0;
}

.table-bordered thead {
  background-color: #3fb59e;
  color: white;
}

.table-bordered th {
  font-weight: bold;
  padding: 12px;
}

.table-hover tbody tr:hover {
  background-color: #f9f9f9;
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
</style>
