<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Ajouter une Expédition
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="addShipment">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label
                for="nom_destinataire"
                class="form-label fw-bold text-primary"
              >
                Nom du Destinataire:
              </label>
              <input
                type="text"
                id="nom_destinataire"
                class="form-control"
                v-model="shipment.nom_destinataire"
                placeholder="Entrez le nom du destinataire"
                required
              />
            </div>

            <div class="mb-3">
              <label
                for="prenom_destinataire"
                class="form-label fw-bold text-primary"
              >
                Prénom du Destinataire:
              </label>
              <input
                type="text"
                id="prenom_destinataire"
                class="form-control"
                v-model="shipment.prenom_destinataire"
                placeholder="Entrez le prénom du destinataire"
                required
              />
            </div>

            <div class="mb-3">
              <label
                for="telephone_destinataire"
                class="form-label fw-bold text-primary"
              >
                Téléphone du Destinataire:
              </label>
              <input
                type="tel"
                id="telephone_destinataire"
                class="form-control"
                v-model="shipment.telephone_destinataire"
                placeholder="Entrez le téléphone du destinataire"
                required
              />
            </div>

            <div class="mb-3">
              <label for="destination" class="form-label fw-bold text-primary">
                Destination:
              </label>
              <input
                type="text"
                id="destination"
                class="form-control"
                v-model="shipment.destination"
                placeholder="Entrez la destination"
                required
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="mb-3">
              <label
                for="date_expedition"
                class="form-label fw-bold text-primary"
              >
                Date d'Expédition:
              </label>
              <input
                type="date"
                id="date_expedition"
                class="form-control"
                v-model="shipment.date_expedition"
                required
              />
            </div>

            <div class="mb-3">
              <label for="colisId" class="form-label fw-bold text-primary">
                Colis:
              </label>
              <select
                id="colisId"
                class="form-select"
                v-model="shipment.colisId"
                required
              >
                <option value="" disabled selected>Choisissez un colis</option>
                <option
                  v-for="parcel in parcels"
                  :key="parcel.id"
                  :value="parcel.id"
                >
                  {{ parcel.code_colis }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label
                for="utilisateurId"
                class="form-label fw-bold text-primary"
              >
                Utilisateur:
              </label>
              <select
                id="utilisateurId"
                class="form-select"
                v-model="shipment.utilisateurId"
              >
                <option value="" disabled selected>
                  Choisissez un utilisateur
                </option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.nom }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 fw-bold mt-4">
          <i class="fas fa-save"></i> Ajouter Expédition
        </button>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useShipmentStore } from '@/store/shipmentStore.js'
import { useParcelStore } from '@/store/parcelStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useRouter } from 'vue-router'

const shipmentStore = useShipmentStore()
const parcelStore = useParcelStore()
const userStore = useUserStore()
const router = useRouter()

const shipment = ref({
  nom_destinataire: '',
  prenom_destinataire: '',
  telephone_destinataire: '',
  destination: '',
  date_expedition: '',
  utilisateurId: '',
  colisId: '',
})

const parcels = ref([])
const users = ref([])

onMounted(async () => {
  try {
    await parcelStore.fetchParcels()
    await userStore.fetchUsers()
    parcels.value = parcelStore.parcels
    users.value = userStore.users
  } catch (error) {
    console.error(
      'Erreur lors du chargement des colis ou des utilisateurs :',
      error
    )
  }
})

const addShipment = async () => {
  try {
    await shipmentStore.addShipment(shipment.value)
    router.push('/shipments')
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'expédition :", error)
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

.text-primary {
  color: #3fb59e !important;
}
</style>
  