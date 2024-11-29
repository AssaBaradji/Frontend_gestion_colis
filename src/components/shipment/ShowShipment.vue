<template>
  <div class="container-fluid">
    <div
      class="modal fade"
      id="shipmentModal"
      ref="shipmentModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-labelledby="modalTitleId"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="text-center fw-bold" id="modalTitleId">
              Détails de l'Expédition
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form v-if="shipment" class="shipment-details-form">
              <div class="row">
                
                <div class="col-md-6">
                  <div class="mb-3">
                  <label class="form-label">ID :</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="shipment.id"
                    readonly
                  />
                </div>
                  <div class="mb-3">
                    <label class="form-label">Nom du Destinataire:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="shipment.nom_destinataire"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Prénom du Destinataire:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="shipment.prenom_destinataire"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Téléphone:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="shipment.telephone_destinataire"
                      readonly
                    />
                  </div>
                  
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Destination:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="shipment.destination"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Date d'Expédition:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="
                        new Date(shipment.date_expedition).toLocaleDateString()
                      "
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Colis:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="
                        shipment.colis
                          ? shipment.colis.code_colis
                          : 'Non attribué'
                      "
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Utilisateur:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="
                        shipment.utilisateur
                          ? shipment.utilisateur.nom
                          : 'Non attribué'
                      "
                      readonly
                    />
                  </div>
                </div>
              </div>
            </form>
            <p v-else>Chargement...</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary w-100"
              data-bs-dismiss="modal"
              @click="closeModal"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useShipmentStore } from '@/store/shipmentStore.js'
import { useParcelStore } from '@/store/parcelStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from 'bootstrap'

const shipmentStore = useShipmentStore()
const parcelStore = useParcelStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const shipment = ref(null)
const shipmentModal = ref(null)

const closeModal = () => {
  router.push('/shipments')
}

onMounted(async () => {
  try {
    await shipmentStore.fetchShipments()
    await parcelStore.fetchParcels()
    await userStore.fetchUsers()

    shipment.value = shipmentStore.shipmentById(route.params.id)

    if (shipment.value) {
      shipment.value.utilisateur =
        userStore.users.find(
          user => user.id === shipment.value.utilisateurId
        ) || null
      shipment.value.colis =
        parcelStore.parcels.find(
          parcel => parcel.id === shipment.value.colisId
        ) || null

      const modalElement = shipmentModal.value
      const bootstrapModal = new Modal(modalElement)
      bootstrapModal.show()
    } else {
      console.error('Expédition non trouvée')
      closeModal()
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données pour l'expédition:",
      error
    )
  }
})
</script>

<style scoped>
.modal-content {
  max-inline-size: 800px;
  margin: auto;
  border: 2px solid #3fb59e;
}

.modal-header {
  background-color: #3fb59e;
  color: white;
  border-start-start-radius: 10px;
  border-start-end-radius: 10px;
}

.modal-footer {
  border: none;
}

.shipment-details-form .form-label {
  color: #3fb59e;
  font-weight: bold;
}

.shipment-details-form .form-control {
  background-color: #f7f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #333;
  padding: 10px;
}

.btn-secondary {
  background-color: #3fb59e;
  border: none;
}

.btn-secondary:hover {
  background-color: #36a290;
}
</style>
