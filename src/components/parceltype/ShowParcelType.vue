<template>
  <div class="container-fluid">
    <div
      class="modal fade"
      id="parcelTypeModal"
      ref="parcelTypeModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-labelledby="modalTitleId"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="text-center fw-bold" id="modalTitleId">
              Détails du Type de Colis
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
            <form v-if="type" class="parcel-type-details-form">
              <div class="mb-3">
                <label class="form-label">ID:</label>
                <input
                  type="text"
                  class="form-control"
                  :value="type.id"
                  readonly
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Nom:</label>
                <input
                  type="text"
                  class="form-control"
                  :value="type.nom"
                  readonly
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Utilisateur:</label>
                <input
                  type="text"
                  class="form-control"
                  :value="
                    type.utilisateur ? type.utilisateur.nom : 'Non attribué'
                  "
                  readonly
                />
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
import { useTypeColisStore } from '@/store/parcelTypeStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from 'bootstrap'

const typeStore = useTypeColisStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const parcelTypeModal = ref(null)
const type = ref(null)

const closeModal = () => {
  router.push('/parcel-types')
}

onMounted(async () => {
  try {
    await typeStore.fetchTypesColis()
    await userStore.fetchUsers()

    const fetchedType = typeStore.typeColisById(route.params.id)
    const utilisateur = userStore.users.find(
      user => user.id === fetchedType.utilisateurId
    )

    type.value = { ...fetchedType, utilisateur }

    if (type.value) {
      const modalElement = parcelTypeModal.value
      const bootstrapModal = new Modal(modalElement)
      bootstrapModal.show()
    }
  } catch (error) {
    console.error(
      'Erreur lors du chargement des données du type de colis :',
      error
    )
    closeModal()
  }
})
</script>

<style scoped>
.modal-content {
  max-inline-size: 500px;
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

.parcel-type-details-form .form-label {
  color: #3fb59e;
  font-weight: bold;
}

.parcel-type-details-form .form-control {
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
