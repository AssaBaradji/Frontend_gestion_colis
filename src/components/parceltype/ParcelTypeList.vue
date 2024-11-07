<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold title-margin" style="color: #3fb59e">
      Liste des Types de Colis
    </h1>

    <div class="text-end mb-4">
      <router-link
        to="/parcel-types/add"
        class="btn btn- fw-bold"
        style="color: white"
      >
        <i class="fas fa-plus"></i> Ajouter Type de Colis
      </router-link>
    </div>

    <div v-if="mappedTypes.length === 0" class="text-center">
      <p>Aucun type de colis trouvé.</p>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nom</th>
          <th scope="col">Utilisateur</th>
          <th scope="col" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="type in mappedTypes" :key="type.id">
          <td>{{ type.id }}</td>
          <td>{{ type.nom }}</td>
          <td>
            {{ type.utilisateur ? type.utilisateur.nom : 'Non attribué' }}
          </td>
          <td class="text-center">
            <button
              class="btn btn-sm btn-outline-info me-2"
              @click="showTypeDetails(type)"
            >
              <i class="fas fa-eye"></i>
            </button>
            <router-link
              :to="'/parcel-types/edit/' + type.id"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              <i class="fas fa-edit"></i>
            </router-link>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="confirmDeleteType(type.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

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
            <form v-if="selectedType" class="parcel-type-details-form">
              <div class="mb-3">
                <label class="form-label">ID:</label>
                <input
                  type="text"
                  class="form-control"
                  :value="selectedType.id"
                  readonly
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Nom:</label>
                <input
                  type="text"
                  class="form-control"
                  :value="selectedType.nom"
                  readonly
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Utilisateur:</label>
                <input
                  type="text"
                  class="form-control"
                  :value="
                    selectedType.utilisateur
                      ? selectedType.utilisateur.nom
                      : 'Non attribué'
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
import { useToast } from 'vue-toastification'
import { Modal } from 'bootstrap'

const toast = useToast()
const typeStore = useTypeColisStore()
const userStore = useUserStore()

const parcelTypeModal = ref(null)
const selectedType = ref(null)

onMounted(async () => {
  try {
    await typeStore.fetchTypesColis()
    await userStore.fetchUsers()
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    toast.error('Erreur lors du chargement des données.')
  }
})

const showTypeDetails = type => {
  const utilisateur = userStore.users.find(
    user => user.id === type.utilisateurId
  )
  selectedType.value = { ...type, utilisateur }
  const modalElement = parcelTypeModal.value
  const bootstrapModal = new Modal(modalElement)
  bootstrapModal.show()
}

const closeModal = () => {
  selectedType.value = null
}

const mappedTypes = computed(() => {
  return typeStore.types.map(type => {
    const utilisateur = userStore.users.find(
      user => user.id === type.utilisateurId
    )
    return { ...type, utilisateur }
  })
})

const confirmDeleteType = async id => {
  const confirmed = window.confirm(
    'Voulez-vous vraiment supprimer ce type de colis ?'
  )
  if (confirmed) {
    deleteType(id)
  }
}

const deleteType = async id => {
  const result = await typeStore.deleteTypeColis(id)

  if (result.success) {
    toast.success('Type de colis supprimé avec succès !')
  } else {
    console.error(
      'Erreur lors de la suppression du type de colis :',
      result.message
    )
    toast.error(result.message)
  }
}
</script>

<style scoped>
</style>


<style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}

.btn- {
  background-color: #3fb59e;
  border-color: #3fb59e;
  color: white;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

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
