<template>
  <div class="container-fluid">
    <div
      class="modal fade"
      id="userModal"
      ref="userModal"
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
              Détails de l'Utilisateur
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
            <form v-if="user" class="user-details-form">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="user.id"
                      readonly
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Nom :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="user.nom"
                      readonly
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Rôle :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="user.role"
                      readonly
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Email :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="user.email"
                      readonly
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Statut :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="user.statut === 'Actif' ? 'Actif' : 'Bloqué'"
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
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/store/userStore'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from 'bootstrap'

const store = useUserStore()
const router = useRouter()
const route = useRoute()

const userModal = ref(null)
const user = ref(null)

const loadUser = async () => {
  user.value = await store.userById(route.params.id)
  if (!user.value) {
    router.push('/users')
  }
}

const closeModal = () => {
  router.push('/users')
}

watch(user, newUser => {
  if (newUser) {
    const modalElement = userModal.value
    const bootstrapModal = new Modal(modalElement)
    bootstrapModal.show()
  }
})

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.modal-content {
  max-inline-size: 600px;
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

.user-details-form .form-label {
  color: #3fb59e;
  font-weight: bold;
}

.user-details-form .form-control {
  background-color: #f7f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #333;
  padding: 10px;
  inline-size: 100%;
}

.btn-secondary {
  background-color: #3fb59e;
  border: none;
}

.btn-secondary:hover {
  background-color: #36a290;
}
</style>
