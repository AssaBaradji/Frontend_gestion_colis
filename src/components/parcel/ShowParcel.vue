<template>
  <div class="container-fluid">
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
        class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg"
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
                    <label class="form-label">Code Colis:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.code_colis"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Prix:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.prix"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Description:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.description"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Emplacement Colis:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="parcel.emplacement_colis"
                      readonly
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Utilisateur:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="
                        parcel.utilisateur
                          ? parcel.utilisateur.nom
                          : 'Non attribué'
                      "
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Type de Colis:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="
                        parcel.typeColis
                          ? parcel.typeColis.nom
                          : 'Type de colis non défini'
                      "
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Date d'Enregistrement:</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="
                        new Date(
                          parcel.date_enregistrement
                        ).toLocaleDateString()
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
import { useParcelStore } from '@/store/parcelStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useTypeColisStore } from '@/store/parcelTypeStore.js'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from 'bootstrap'

const parcelStore = useParcelStore()
const userStore = useUserStore()
const typeStore = useTypeColisStore()
const router = useRouter()
const route = useRoute()

// Obtenir le colis par ID
const parcel = ref(null)
const parcelModal = ref(null)

const closeModal = () => {
  router.push('/parcels')
}

// Charger les données du colis avec les informations d'utilisateur et de type
onMounted(async () => {
  try {
    // Charger les colis, types et utilisateurs
    await parcelStore.fetchParcels()
    await userStore.fetchUsers()
    await typeStore.fetchTypesColis()

    // Récupérer le colis par ID
    parcel.value = parcelStore.parcelById(route.params.id)

    // Associer les informations utilisateur et typeColis
    if (parcel.value) {
      parcel.value.utilisateur =
        userStore.users.find(user => user.id === parcel.value.utilisateurId) ||
        null
      parcel.value.typeColis =
        typeStore.types.find(type => type.id === parcel.value.typeId) || null

      // Affichez le modal
      const modalElement = parcelModal.value
      const bootstrapModal = new Modal(modalElement)
      bootstrapModal.show()
    } else {
      console.error('Colis non trouvé')
      closeModal()
    }
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données pour le colis :',
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
