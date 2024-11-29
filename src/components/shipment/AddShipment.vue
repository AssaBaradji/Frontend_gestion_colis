<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Ajouter une Expédition
      </h3>
      <form @submit.prevent="addShipment">
        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="nom_destinataire"
                class="form-control"
                v-model="shipment.nom_destinataire"
                placeholder="Nom du destinataire"
                required
              />
              <label for="nom_destinataire">
                <i class="fas fa-user me-2"></i>Nom du Destinataire
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="text"
                id="prenom_destinataire"
                class="form-control"
                v-model="shipment.prenom_destinataire"
                placeholder="Prénom du destinataire"
                required
              />
              <label for="prenom_destinataire">
                <i class="fas fa-user me-2"></i>Prénom du Destinataire
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="tel"
                id="telephone_destinataire"
                class="form-control"
                v-model="shipment.telephone_destinataire"
                placeholder="Téléphone du destinataire"
                required
              />
              <label for="telephone_destinataire">
                <i class="fas fa-phone me-2"></i>Téléphone du Destinataire
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="text"
                id="destination"
                class="form-control"
                v-model="shipment.destination"
                placeholder="Destination"
                required
              />
              <label for="destination">
                <i class="fas fa-map-marker-alt me-2"></i>Destination
              </label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="date"
                id="date_expedition"
                class="form-control"
                v-model="shipment.date_expedition"
                required
              />
              <label for="date_expedition">
                <i class="fas fa-calendar-alt me-2"></i>Date d'Expédition
              </label>
            </div>

            <div class="form-floating mb-4">
              <select
                id="colisId"
                class="form-select"
                v-model="shipment.colisId"
                required
              >
                <option value="" disabled selected>Choisissez un colis</option>
                <option v-for="parcel in parcels" :key="parcel.id" :value="parcel.id">
                  {{ parcel.code_colis }}
                </option>
              </select>
              <label for="colisId">
                <i class="fas fa-box me-2"></i>Colis
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="text"
                class="form-control readonly-input"
                :value="authStore.utilisateurNom"
                readonly
              />
              <label>
                <i class="fas fa-user me-2"></i> Utilisateur
              </label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            @click="cancelAdd"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn w-45 py-2 fw-bold shadow-sm"
            style="background-color: #3fb59e; color: white"
          >
            <i class="fas fa-save"></i> Ajouter Expédition
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useShipmentStore } from '@/store/shipmentStore.js'
import { useParcelStore } from '@/store/parcelStore.js'
import { useAuthStore } from '@/store/authStore.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const shipmentStore = useShipmentStore()
const parcelStore = useParcelStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const shipment = ref({
  nom_destinataire: '',
  prenom_destinataire: '',
  telephone_destinataire: '',
  destination: '',
  date_expedition: '',
  utilisateurId: authStore.currentUser?.id || null,
  colisId: '',
})

const parcels = ref([])

onMounted(async () => {
  try {
    await parcelStore.fetchParcels()
    parcels.value = parcelStore.parcels

    if (!shipment.value.utilisateurId && authStore.currentUser) {
      shipment.value.utilisateurId = authStore.currentUser.id
    }
  } catch (error) {
    console.error('Erreur lors du chargement des colis :', error)
    toast.error('Erreur lors du chargement des colis.')
  }
})

const addShipment = async () => {
  try {
    const result = await shipmentStore.addShipment(shipment.value)
    if (result.success) {
      toast.success('Expédition ajoutée avec succès !')
      router.push('/shipments')
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error("Ce Colis est Déja Enregisté :", error)
    toast.error("Ce Colis est Déja Enregisté.")
  }
}

const cancelAdd = () => {
  toast.info('Ajout d\'expédition annulé.')
  router.push('/shipments')
}

const connectedUser = authStore.currentUser
</script>

<style scoped>
.container {
  min-block-size: 90vh;
}

.form-container {
  max-inline-size: 850px; 
  background-color: #fff;
  padding: 3rem 2.5rem; 
  border-radius: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-floating label {
  color: #6c757d;
  font-size: 1rem; 
}

.form-control,
.form-select {
  border: 2px solid #ddd !important;
  transition: border-color 0.3s ease;
  padding: 1.5rem; 
  font-size: 1.1rem; 
}

.form-control:focus,
.form-select:focus {
  border-color: #3fb59e !important;
  box-shadow: 0 0 0 0.2rem rgba(63, 181, 158, 0.25);
}

.readonly-input {
  background-color: #f8f9fa;
  color: #6c757d;
  font-weight: bold;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #36a290;
}

.w-45 {
  inline-size: 45%;
}
</style>
