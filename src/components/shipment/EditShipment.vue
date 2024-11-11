
<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div v-if="isLoading" class="text-center">
      <i
        class="fas fa-spinner fa-spin fa-2x"
        :style="{ color: primaryColor }"
      ></i>
    </div>

    <div v-else class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" :style="{ color: primaryColor }">
        Modifier l'Expédition
      </h3>
      <form @submit.prevent="updateShipment">
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
              <label for="nom_destinataire"
                ><i class="fas fa-user me-2"></i>Nom du destinataire</label
              >
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
              <label for="prenom_destinataire"
                ><i class="fas fa-user me-2"></i>Prénom du destinataire</label
              >
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
              <label for="telephone_destinataire"
                ><i class="fas fa-phone me-2"></i>Téléphone</label
              >
            </div>
            <div class="form-floating mb-4">
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
              <label for="colisId"><i class="fas fa-box me-2"></i>Colis</label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="destination"
                class="form-control"
                v-model="shipment.destination"
                placeholder="Destination"
                required
              />
              <label for="destination"
                ><i class="fas fa-map-marker-alt me-2"></i>Destination</label
              >
            </div>

            <div class="form-floating mb-4">
              <input
                type="date"
                id="date_expedition"
                class="form-control"
                v-model="shipment.date_expedition"
                required
              />
              <label for="date_expedition"
                ><i class="fas fa-calendar-alt me-2"></i>Date
                d'expédition</label
              >
            </div>
            <div class="form-floating mb-4">
              <input
                type="text"
                class="form-control readonly-input"
                :value="authStore.utilisateurNom"
                readonly
              />
              <label> <i class="fas fa-user me-2"></i> Utilisateur </label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            type="button"
            @click="cancelEdit"
          >
            Annuler
          </button>
          <button
            class="btn w-45 py-2 fw-bold shadow-sm"
            type="submit"
            :style="{ backgroundColor: primaryColor, color: textColor }"
          >
            <i class="fas fa-save me-2"></i> Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useShipmentStore } from '@/store/shipmentStore'
import { useParcelStore } from '@/store/parcelStore'
import { useAuthStore } from '@/store/authStore.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const shipmentStore = useShipmentStore()
const parcelStore = useParcelStore()
const router = useRouter()
const authStore = useAuthStore()
const route = useRoute()

const shipment = ref({})
const parcels = ref([])
const isLoading = ref(true)

const primaryColor = '#3fb59e'
const textColor = '#FFFFFF'

onMounted(async () => {
  try {
    await shipmentStore.fetchShipments()
    await parcelStore.fetchParcels()
    shipment.value = shipmentStore.shipmentById(route.params.id)
    parcels.value = parcelStore.parcels
    if (!shipment.value) {
      toast.error('Expédition introuvable.')
      router.push('/shipments')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    toast.error('Erreur lors du chargement des données.')
  } finally {
    isLoading.value = false
  }
})

const updateShipment = async () => {
  try {
    const result = await shipmentStore.updateShipment(shipment.value)
    if (result.success) {
      toast.success('Expédition mise à jour avec succès.')
      router.push('/shipments')
    } else {
      toast.error("Erreur lors de la mise à jour de l'expédition.")
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'expédition :", error)
    toast.error("Erreur lors de la mise à jour de l'expédition.")
  }
}

const cancelEdit = () => {
  toast.info('Modification annulée.')
  router.push('/shipments')
}
</script>

<style scoped>
.container {
  min-block-size: 100vh;
}

.form-container {
  max-inline-size: 800px;
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.input-group-text {
  background-color: #3fb59e;
  color: white;
  min-inline-size: 160px;
  font-weight: 600;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #36a290;
}

.form-control,
.form-select {
  border: 2px solid #ddd !important;
  transition: border-color 0.3s ease;
}
.readonly-input {
  background-color: #f8f9fa;
  color: #6c757d;
  font-weight: bold;
}

.form-control:focus,
.form-select:focus {
  border-color: #3fb59e !important;
  box-shadow: 0 0 0 0.2rem rgba(63, 181, 158, 0.25);
}
</style>
