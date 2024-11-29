<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold" style="color: #3fb59e">
      Liste des Types de Colis
    </h1>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="input-group" style="max-inline-size: 300px">
        <span class="input-group-text" id="search-addon">
          <i class="fas fa-search"></i>
        </span>
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Rechercher un type de colis..."
          aria-label="Search"
          aria-describedby="search-addon"
        />
      </div>

      <router-link
        to="/parcel-types/add"
        class="btn btn-add fw-bold"
        style="color: white"
      >
        <i class="fas fa-plus"></i> Ajouter Type de Colis
      </router-link>
    </div>

    <div v-if="paginatedTypes.length === 0" class="text-center">
      <p>Aucun type de colis trouvé.</p>
    </div>

    <div v-else class="row">
      <div class="col-md-4 mb-4" v-for="type in paginatedTypes" :key="type.id">
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex flex-column align-items-center">
            <div class="icon-container mb-3">
              <i :class="getIconClass(type.nom)"></i>
            </div>
            <h5 class="card-title">{{ type.nom }}</h5>
            <div class="d-flex justify-content-between mt-3 w-100">
              <button
                class="btn btn-sm btn-outline-info me-2"
                @click="showTypeDetails(type)"
              >
                <i class="fas fa-eye"></i> Détails
              </button>
              <router-link
                :to="'/parcel-types/edit/' + type.id"
                class="btn btn-sm btn-outline-secondary me-2"
              >
                <i class="fas fa-edit"></i> Modifier
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDeleteType(type.id)"
              >
                <i class="fas fa-trash"></i> Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center mt-4">
      <button
        class="btn btn-outline-secondary"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <i class="fas fa-chevron-left"></i>Précédent
      </button>
      <span class="mx-3"> Page {{ currentPage }} sur {{ totalPages }} </span>
      <button
        class="btn btn-outline-secondary"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Suivant<i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <div
      class="modal fade"
      id="parcelTypeModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      role="dialog"
      aria-labelledby="modalTitleId"
      aria-hidden="true"
      ref="parcelTypeModal"
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
                <label class="form-label">Nom:</label>
                <input
                  type="text"
                  class="form-control"
                  :value="selectedType.nom"
                  readonly
                />
              </div>
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
let bootstrapModalInstance = null
const selectedType = ref(null)
const searchQuery = ref('')

const sortBy = ref('id')
const sortOrder = ref('asc')

const currentPage = ref(1)
const pageSize = ref(6)

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

  if (!bootstrapModalInstance) {
    bootstrapModalInstance = new Modal(parcelTypeModal.value)
  }
  bootstrapModalInstance.show()
}

const closeModal = () => {
  if (bootstrapModalInstance) {
    bootstrapModalInstance.hide()
  }
  selectedType.value = null
}

const mappedTypes = computed(() => {
  return typeStore.types.map(type => ({
    ...type,
    utilisateur: userStore.users.find(user => user.id === type.utilisateurId),
  }))
})

const sortedAndFilteredTypes = computed(() => {
  const filtered = mappedTypes.value.filter(type =>
    type.nom?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  return filtered.sort((a, b) => {
    const fieldA = a[sortBy.value]?.toLowerCase?.() || a[sortBy.value] || ''
    const fieldB = b[sortBy.value]?.toLowerCase?.() || b[sortBy.value] || ''
    if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedTypes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedAndFilteredTypes.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(sortedAndFilteredTypes.value.length / pageSize.value)
})

const confirmDeleteType = async id => {
  const confirmed = window.confirm(
    'Voulez-vous vraiment supprimer ce type de colis ?'
  )
  if (confirmed) {
    deleteType(id)
  } else {
    toast.warning('Suppression Annulé!')
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
   toast.error("Impossible de supprimer ce type est lié à un colis.");
  }
}

const getIconClass = typeName => {
  switch (typeName.toLowerCase()) {
    case 'fragile':
      return 'fas fa-glass-martini-alt fa-2x text-danger'
    case 'documents':
      return 'fas fa-folder-open fa-2x text-primary'
    case 'électronique':
      return 'fas fa-mobile-alt fa-2x text-warning'
    case 'alimentaire':
      return 'fas fa-apple-alt fa-2x text-success'
    case 'vêtements':
      return 'fas fa-tshirt fa-2x text-info'
    default:
      return 'fas fa-cube fa-2x text-secondary'
  }
}
</script>

<style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  text-align: center;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.icon-container {
  font-size: 1.8rem;
  color: #3fb59e;
}

.btn-add {
  background-color: #3fb59e;
  border-color: #3fb59e;
  color: white;
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

.btn-secondary {
  background-color: #3fb59e;
  border: none;
}

.btn-secondary:hover {
  background-color: #36a290;
}
</style>
