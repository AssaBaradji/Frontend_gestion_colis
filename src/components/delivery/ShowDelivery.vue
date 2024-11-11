<template>
  <div class="container-fluid">
    <div
      class="modal fade"
      id="deliveryModal"
      ref="deliveryModal"
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
              Détails de la Livraison
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
            <form v-if="delivery" class="delivery-details-form">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Nom :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="delivery.nom"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Prénom :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="delivery.prenom"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Date de Livraison :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="delivery.date_livraison"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Expédition :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="
                        delivery.expedition
                          ? delivery.expedition.nom_destinataire
                          : 'N/A'
                      "
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Utilisateur :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="
                        delivery.utilisateur ? delivery.utilisateur.nom : 'N/A'
                      "
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Téléphone :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="delivery.telephone"
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeliveryStore } from '@/store/deliveryStore.js'
import { Modal } from 'bootstrap'
import { useToast } from 'vue-toastification'

const deliveryStore = useDeliveryStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const delivery = computed(() => deliveryStore.deliveryById(route.params.id))
const deliveryModal = ref(null)

const closeModal = () => {
  router.push('/delivery')
}

onMounted(async () => {
  try {
    await deliveryStore.fetchDeliveries()

    if (delivery.value) {
      const modalElement = deliveryModal.value
      const bootstrapModal = new Modal(modalElement)
      bootstrapModal.show()
    } else {
      toast.error('Erreur lors du chargement de la livraison.')
      closeModal()
    }
  } catch (error) {
    toast.error('Erreur lors du chargement de la livraison.')
    closeModal()
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

.delivery-details-form .form-label {
  color: #3fb59e;
  font-weight: bold;
}

.delivery-details-form .form-control {
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
