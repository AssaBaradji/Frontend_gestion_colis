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

    <div v-if="filteredDeliveries.length === 0 && !loading" class="text-center">
      <p>Aucune livraison trouvée.</p>
    </div>

    <div v-if="loading" class="text-center">
      <i class="fas fa-spinner fa-spin fa-2x" style="color: #3fb59e"></i>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Date de Livraison</th>
          <th>Téléphone</th>
          <th>Utilisateur</th>
          <th>Expédition</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="delivery in filteredDeliveries" :key="delivery.id">
          <td>{{ delivery.id }}</td>
          <td>{{ delivery.nom }}</td>
          <td>{{ delivery.prenom }}</td>
          <td>{{ delivery.date_livraison }}</td>
          <td>{{ delivery.telephone }}</td>
          <td>{{ delivery.utilisateur ? delivery.utilisateur.nom : 'N/A' }}</td>
          <td>{{ delivery.expedition ? delivery.expedition.nom_destinataire : 'N/A' }}</td>
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

onMounted(async () => {
  loading.value = true
  try {
    await deliveryStore.fetchDeliveries()
    await shipmentStore.fetchShipments()
    await userStore.fetchUsers()

    deliveries.value = deliveryStore.deliveries.map(delivery => ({
      ...delivery,
      utilisateur: userStore.users.find(user => user.id === delivery.utilisateurId),
      expedition: shipmentStore.shipments.find(shipment => shipment.id === delivery.expeditionId),
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
      (delivery.nom || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (delivery.prenom || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (delivery.utilisateur?.nom || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (delivery.expedition?.nom_destinataire || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const confirmDelete = async id => {
  const confirmation = confirm("Voulez-vous vraiment supprimer cette livraison ?")
  if (confirmation) {
    await deleteDelivery(id)
  }
}

const deleteDelivery = async id => {
  try {
    await deliveryStore.deleteDelivery(id)
    toast.success('Livraison supprimée avec succès.')
    await deliveryStore.fetchDeliveries()
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
