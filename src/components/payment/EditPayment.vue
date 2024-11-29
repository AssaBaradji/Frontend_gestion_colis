<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Modifier un Paiement
      </h3>
      <form @submit.prevent="updatePayment">
        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="number"
                id="montant"
                class="form-control"
                v-model="payment.montant"
                placeholder="Entrez le montant"
                @input="validateMontant"
                required
              />
              <label for="montant">
                <i class="fas fa-dollar-sign me-2"></i>Montant
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="text"
                id="moment_paiement"
                class="form-control"
                v-model="payment.moment_paiement"
                placeholder="Moment du paiement"
                required
              />
              <label for="moment_paiement">
                <i class="fas fa-clock me-2"></i>Moment du Paiement
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="date"
                id="date_paiement"
                class="form-control"
                v-model="payment.date_paiement"
                required
              />
              <label for="date_paiement">
                <i class="fas fa-calendar-alt me-2"></i>Date de Paiement
              </label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <select
                id="colisId"
                class="form-select"
                v-model="payment.colisId"
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
              <label for="colisId">
                <i class="fas fa-box me-2"></i>Colis
              </label>
            </div>

            <div class="form-floating mb-4">
              <select
                id="methodeId"
                class="form-select"
                v-model="payment.methodeId"
                required
              >
                <option value="" disabled selected>
                  Choisissez une méthode de paiement
                </option>
                <option
                  v-for="method in methods"
                  :key="method.id"
                  :value="method.id"
                >
                  {{ method.nom }}
                </option>
              </select>
              <label for="methodeId">
                <i class="fas fa-credit-card me-2"></i>Méthode de Paiement
              </label>
            </div>
            <div class="form-floating mb-4">
              <input
                type="text"
                class="form-control readonly-input"
                :value="authStore.utilisateurNom"
                readonly
              />
              <label> <i class="fas fa-user me-2"></i> Utilisateur </label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            @click="cancelEdit"
          >
            Annuler
          </button>

          <button
            class="btn w-45 py-2 fw-bold shadow-sm"
            type="submit"
            style="background-color: #3fb59e; color: white"
          >
            <i class="fas fa-save me-2"></i>Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePaymentStore } from '@/store/paymentStore.js'
import { useParcelStore } from '@/store/parcelStore.js'
import { useAuthStore } from '@/store/authStore.js'
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const paymentStore = usePaymentStore()
const parcelStore = useParcelStore()
const paymentMethodStore = usePaymentMethodStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const payment = ref({})
const parcels = ref([])
const methods = ref([])

onMounted(async () => {
  try {
    const id = route.params.id
    await paymentStore.fetchPayments()
    await parcelStore.fetchParcels()
    await paymentMethodStore.fetchPaymentMethods()
    payment.value = paymentStore.paymentById(id)
    parcels.value = parcelStore.parcels
    methods.value = paymentMethodStore.paymentMethods
  } catch (error) {
    toast.error('Erreur lors du chargement des données.')
  }
})
const validateMontant = () => {
  if (payment.value.montant < 0) {
    payment.value.montant = 0
    toast.error('Le montant ne peut pas être négatif.')
  }
}

const updatePayment = async () => {
  if (payment.value.montant <= 0) {
    toast.error('Le montant doit être supérieur à 0.')
    return
  }
  try {
    await paymentStore.updatePayment(payment.value)
    toast.success('Paiement mis à jour avec succès !')
    router.push('/payments')
  } catch (error) {
    toast.error('Erreur lors de la mise à jour du paiement.')
  }
}

const cancelEdit = () => {
  toast.info('Modification annulée.')
  router.push('/payments')
}
</script>

<style scoped>
.container {
  min-block-size: 90vh;
}

.form-container {
  max-inline-size: 850px; /* Légèrement plus large */
  background-color: #fff;
  padding: 3rem 2.5rem; /* Ajout de plus d'espace interne */
  border-radius: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-floating label {
  color: #6c757d;
  font-size: 1rem; /* Taille légèrement augmentée */
}

.form-control,
.form-select {
  border: 2px solid #ddd !important;
  transition: border-color 0.3s ease;
  padding: 1.5rem; /* Augmente la hauteur des champs */
  font-size: 1.1rem; /* Augmente la taille du texte */
}

.form-control:focus,
.form-select:focus {
  border-color: #3fb59e !important;
  box-shadow: 0 0 0 0.2rem rgba(63, 181, 158, 0.25);
}

.readonly-input {
  background-color: #f8f9fa;
  color: #6c757d;
  font-weight: bold;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #36a290;
}

.w-45 {
  inline-size: 45%;
}
</style>
