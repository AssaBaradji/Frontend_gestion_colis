<!-- <template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Détails du Paiement
    </h1>

    <div class="p-4 bg-light rounded shadow-sm payment-details-form">
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Montant :</label>
            <input
              type="text"
              class="form-control"
              :value="payment.montant"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Date de Paiement :</label>
            <input
              type="text"
              class="form-control"
              :value="payment.date_paiement"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Moment du Paiement :</label>
            <input
              type="text"
              class="form-control"
              :value="payment.moment_paiement"
              readonly
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Utilisateur :</label>
            <input
              type="text"
              class="form-control"
              :value="payment.utilisateur ? payment.utilisateur.nom : 'N/A'"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Colis :</label>
            <input
              type="text"
              class="form-control"
              :value="payment.colis ? payment.colis.code_colis : 'N/A'"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Méthode de Paiement :</label>
            <input
              type="text"
              class="form-control"
              :value="payment.methodePaiement ? payment.methodePaiement.nom : 'N/A'"
              readonly
            />
          </div>
        </div>
      </div>

      <router-link to="/payments" class="btn btn-secondary w-100 mt-4">
        Retour à la liste des paiements
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePaymentStore } from '@/store/paymentStore.js'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const paymentStore = usePaymentStore()
const route = useRoute()
const toast = useToast()

const payment = ref({})

onMounted(async () => {
  try {
    await paymentStore.fetchPayments()
    payment.value = paymentStore.paymentById(route.params.id)
  } catch (error) {
    toast.error('Erreur lors du chargement du paiement.')
  }
})
</script>

<style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}

.payment-details-form {
  max-inline-size: 800px;
  margin: auto;
  border: 2px solid #3fb59e;
  padding: 20px;
  background-color: #f7f9fa;
}

.payment-details-form .form-label {
  color: #3fb59e;
  font-weight: bold;
}

.payment-details-form .form-control {
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
</style> -->
<template>
  <div class="container-fluid">
    <div
      class="modal fade"
      id="paymentModal"
      ref="paymentModal"
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
              Détails du Paiement
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
            <form v-if="payment" class="payment-details-form">
              <div class="row">
                
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">ID :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="payment.id"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Montant :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="payment.montant"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Date de Paiement :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="new Date(payment.date_paiement).toLocaleDateString()"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Moment du Paiement :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="payment.moment_paiement"
                      readonly
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Utilisateur :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="payment.utilisateur ? payment.utilisateur.nom : 'N/A'"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Colis :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="payment.colis ? payment.colis.code_colis : 'N/A'"
                      readonly
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Méthode de Paiement :</label>
                    <input
                      type="text"
                      class="form-control"
                      :value="payment.methodePaiement ? payment.methodePaiement.nom : 'N/A'"
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
import { usePaymentStore } from '@/store/paymentStore.js'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { useToast } from 'vue-toastification'

const paymentStore = usePaymentStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const payment = ref(null)
const paymentModal = ref(null)

const closeModal = () => {
  router.push('/payments')
}

onMounted(async () => {
  try {
    await paymentStore.fetchPayments()
    payment.value = paymentStore.paymentById(route.params.id)

    // Vérifiez si le paiement existe
    if (payment.value) {
      // Afficher le modal
      const modalElement = paymentModal.value
      const bootstrapModal = new Modal(modalElement)
      bootstrapModal.show()
    } else {
      toast.error('Paiement non trouvé.')
      closeModal()
    }
  } catch (error) {
    console.error('Erreur lors du chargement du paiement :', error)
    toast.error('Erreur lors du chargement du paiement.')
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

.payment-details-form .form-label {
  color: #3fb59e;
  font-weight: bold;
}

.payment-details-form .form-control {
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
