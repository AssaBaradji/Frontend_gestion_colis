<template>
  <div
    class="container-fluid"
  >
    <div
      class="modal fade"
      id="parcelModal"
      ref="parcelModal"
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
              Détails du Colis
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
            <form v-if="parcel" class="parcel-details-form">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Nom du Destinataire:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.nom_destinataire"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Prénom du Destinataire:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.prenom_destinataire"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Téléphone:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.telephone_destinataire"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Utilisateur:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.utilisateur ? parcel.utilisateur.nom : 'Non attribué'"
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
                      :value="parcel.destination"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Date d'Expédition:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.date_expedition"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Colis:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.code_colis ? parcel.code_colis : 'Non attribué'"
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
import { ref, computed, onMounted } from 'vue'
import { useParcelStore } from '@/store/parcelStore.js'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from 'bootstrap'

const store = useParcelStore()
const router = useRouter()
const route = useRoute()

const parcel = ref(null)
const parcelModal = ref(null)

const closeModal = () => {
  router.push('/parcels')
}

onMounted(async () => {
  // Chargez les colis et récupérez le colis par ID
  await store.fetchParcels()
  parcel.value = store.parcelById(route.params.id)

  // Vérifiez si le colis est chargé avant d'afficher le modal
  if (parcel.value) {
    const modalElement = parcelModal.value
    const bootstrapModal = new Modal(modalElement)
    bootstrapModal.show()
  } else {
    console.error('Colis non trouvé')
    closeModal() // Ferme le modal si le colis n'est pas trouvé
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

.text-center {
  text-align: center;
}

.parcel-details-form .form-label {
  color: #3fb59e;
  font-weight: bold;
}

.parcel-details-form .form-control {
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
