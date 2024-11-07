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

    <div v-if="filteredShipments.length === 0" class="text-center">
      <p>Aucune expédition trouvée.</p>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th scope="col">ID Expédition</th>
          <th scope="col">Nom Destinataire</th>
          <th scope="col">Prénom Destinataire</th>
          <th scope="col">Téléphone Destinataire</th>
          <th scope="col">Destination</th>
          <th scope="col">Date Expédition</th>
          <th scope="col">Utilisateur</th>
          <th scope="col">Colis</th>
          <th scope="col" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="shipment in filteredShipments" :key="shipment.id">
          <td>{{ shipment.id }}</td>
          <td>{{ shipment.nom_destinataire }}</td>
          <td>{{ shipment.prenom_destinataire }}</td>
          <td>{{ shipment.telephone_destinataire }}</td>
          <td>{{ shipment.destination }}</td>
          <td>{{ shipment.date_expedition }}</td>
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
const parcels = ref([])
const users = ref([])
const searchQuery = ref('')

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

    parcels.value = parcelStore.parcels
    users.value = userStore.users
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    toast.error('Erreur lors du chargement des données.')
  }
}

onMounted(fetchAndMapShipments)

const selectedDestination = ref('')
const filteredShipments = computed(() =>
  shipments.value.filter(shipment => {
    const matchesDestination = selectedDestination.value
      ? shipment.destination === selectedDestination.value
      : true
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
    return matchesDestination && matchesSearch
  })
)

const deleteShipment = async id => {
  const result = await shipmentStore.deleteShipment(id)
  if (result.success) {
    toast.success('Expédition supprimée avec succès.')
    await fetchAndMapShipments()
  } else {
    console.error(
      "Erreur lors de la suppression de l'expédition :",
      result.error
    )
    toast.error(
      `Erreur lors de la suppression de l'expédition : ${result.error}`
    )
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

