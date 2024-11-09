<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Ajouter un Paiement
      </h3>
      <form @submit.prevent="addPayment">
        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="number"
                id="montant"
                class="form-control"
                v-model="payment.montant"
                placeholder="Montant"
                required
              />
              <label for="montant">
                <i class="fas fa-dollar-sign me-2"></i>Montant
              </label>
            </div>

            <div class="form-floating mb-4">
              <select
                id="moment_paiement"
                class="form-select"
                v-model="payment.moment_paiement"
                required
              >
                <option value="" disabled selected>Choisissez le moment</option>
                <option value="arrivée">Arrivée</option>
                <option value="départ">Départ</option>
              </select>
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
                <option v-for="parcel in parcels" :key="parcel.id" :value="parcel.id">
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
                <option value="" disabled selected>Choisissez une méthode</option>
                <option v-for="method in methods" :key="method.id" :value="method.id">
                  {{ method.nom }}
                </option>
              </select>
              <label for="methodeId">
                <i class="fas fa-credit-card me-2"></i>Méthode de Paiement
              </label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button
            type="button"
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            @click="cancelPayment"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn w-45 py-2 fw-bold shadow-sm"
            style="background-color: #3fb59e; color: white"
          >
            <i class="fas fa-save me-2"></i> Ajouter
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
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const paymentStore = usePaymentStore()
const parcelStore = useParcelStore()
const paymentMethodStore = usePaymentMethodStore()
const router = useRouter()
const toast = useToast()

const payment = ref({
  montant: '',
  moment_paiement: '',
  date_paiement: '',
  colisId: '',
  methodeId: '',
})

const parcels = ref([])
const methods = ref([])

onMounted(async () => {
  try {
    await parcelStore.fetchParcels()
    await paymentMethodStore.fetchPaymentMethods()
    parcels.value = parcelStore.parcels
    methods.value = paymentMethodStore.paymentMethods
  } catch (error) {
    toast.error(
      'Erreur lors du chargement des colis ou des méthodes de paiement.'
    )
  }
})

const addPayment = async () => {
  try {
    await paymentStore.addPayment(payment.value)
    toast.success('Paiement ajouté avec succès !')
    router.push('/payments')
  } catch (error) {
    toast.error("Erreur lors de l'ajout du paiement.")
  }
}

const cancelPayment = () => {
  toast.info("Ajout de paiement annulé.")
  router.push('/payments')
}
</script>

<style scoped>
.container {
  min-block-size: 100vh;
}

.form-container {
  max-inline-size: 800px;
  background-color: #fff;
  padding: 3rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-floating label {
  color: #6c757d;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #36a290;
}

.form-control,
.form-select {
  border: 2px solid #ddd !important;
  transition: border-color 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #3fb59e !important;
  box-shadow: 0 0 0 0.2rem rgba(63, 181, 158, 0.25);
}

.w-45 {
  inline-size: 45%;
}
</style>
