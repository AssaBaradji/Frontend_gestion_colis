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

    <div
      v-else
      class="p-4 bg-light rounded shadow-sm form-container"
      style="max-inline-size: 800px; inline-size: 100%"
    >
      <h3 class="text-center mb-4" :style="{ color: primaryColor }">
        {{ t('shipments.editTitle') }}
      </h3>
      <form @submit.prevent="updateShipment">
        <div class="row">
          <div class="col-md-6">
            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-user"></i>&nbsp;{{
                  t('shipments.editForm.recipientName')
                }}
              </span>
              <input
                type="text"
                class="form-control"
                v-model="shipment.nom_destinataire"
                placeholder="Nom du destinataire"
                :style="{ borderColor: primaryColor }"
                required
              />
            </div>

            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-user"></i>&nbsp;{{
                  t('shipments.editForm.recipientSurname')
                }}
              </span>
              <input
                type="text"
                class="form-control"
                v-model="shipment.prenom_destinataire"
                placeholder="Prénom du destinataire"
                :style="{ borderColor: primaryColor }"
                required
              />
            </div>

            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-phone"></i>&nbsp;{{
                  t('shipments.editForm.recipientPhone')
                }}
              </span>
              <input
                type="tel"
                class="form-control"
                v-model="shipment.telephone_destinataire"
                placeholder="Téléphone du destinataire"
                :style="{ borderColor: primaryColor }"
                required
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-map-marker-alt"></i>&nbsp;{{
                  t('shipments.editForm.destination')
                }}
              </span>
              <input
                type="text"
                class="form-control"
                v-model="shipment.destination"
                placeholder="Destination"
                :style="{ borderColor: primaryColor }"
                required
              />
            </div>

            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-calendar-alt"></i>&nbsp;{{
                  t('shipments.editForm.date')
                }}
              </span>
              <input
                type="date"
                class="form-control"
                v-model="shipment.date_expedition"
                :style="{ borderColor: primaryColor }"
                required
              />
            </div>

            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-box"></i>&nbsp;{{
                  t('shipments.editForm.parcel')
                }}
              </span>
              <select
                class="form-select"
                v-model="shipment.colisId"
                :style="{ borderColor: primaryColor }"
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
          </div>
        </div>

        <button
          class="btn w-100 fw-bold mt-4"
          type="submit"
          :style="{ backgroundColor: primaryColor, color: textColor }"
        >
          <i class="fas fa-save"></i> {{ t('shipments.editForm.save') }}
        </button>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useShipmentStore } from '@/store/shipmentStore'
import { useParcelStore } from '@/store/parcelStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const shipmentStore = useShipmentStore()
const parcelStore = useParcelStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

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
    await shipmentStore.updateShipment(shipment.value)
    toast.success('Expédition mise à jour avec succès !')
    router.push('/shipments')
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'expédition :", error)
    toast.error("Erreur lors de la mise à jour de l'expédition.")
  }
}
</script>
  
  <style scoped>
.container {
  min-block-size: 100vh;
}

.form-container {
  max-inline-size: 800px;
}

.input-group-text {
  min-inline-size: 150px;
}
</style>
  