<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Ajouter un Paiement
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="addPayment">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="montant" class="form-label fw-bold text-primary">
                Montant :
              </label>
              <input
                type="number"
                id="montant"
                class="form-control"
                v-model="payment.montant"
                placeholder="Entrez le montant"
                required
                :style="{ borderColor: '#3fb59e' }"
              />
            </div>

            <div class="mb-3">
              <label
                for="moment_paiement"
                class="form-label fw-bold text-primary"
              >
                Moment du Paiement :
              </label>
              <select
                id="moment_paiement"
                class="form-select"
                v-model="payment.moment_paiement"
                required
                :style="{ borderColor: '#3fb59e' }"
              >
                <option value="" disabled selected>
                  Choisissez le moment du paiement
                </option>
                <option value="arrivée">Arrivée</option>
                <option value="départ">Départ</option>
              </select>
            </div>

            <div class="mb-3">
              <label
                for="date_paiement"
                class="form-label fw-bold text-primary"
              >
                Date de Paiement :
              </label>
              <input
                type="date"
                id="date_paiement"
                class="form-control"
                v-model="payment.date_paiement"
                required
                :style="{ borderColor: '#3fb59e' }"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="mb-3">
              <label for="colisId" class="form-label fw-bold text-primary">
                Colis :
              </label>
              <select
                id="colisId"
                class="form-select"
                v-model="payment.colisId"
                required
                :style="{ borderColor: '#3fb59e' }"
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
            </div>

            <div class="mb-3">
              <label for="methodeId" class="form-label fw-bold text-primary">
                Méthode de Paiement :
              </label>
              <select
                id="methodeId"
                class="form-select"
                v-model="payment.methodeId"
                required
                :style="{ borderColor: '#3fb59e' }"
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
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 fw-bold mt-4"
          :style="{
            backgroundColor: '#3fb59e',
            borderColor: '#3fb59e',
            color: '#ffffff',
          }"
        >
          <i class="fas fa-save"></i> Ajouter
        </button>
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
    router.push('/payments')
    toast.success('Paiement ajouté avec succès !')
  } catch (error) {
    toast.error("Erreur lors de l'ajout du paiement.")
  }
}
</script>
  
  <style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}

.form-label {
  color: #3fb59e;
}

.btn-primary {
  background-color: #3fb59e;
  border-color: #3fb59e;
}

.btn-primary:hover {
  background-color: #349d87;
  border-color: #349d87;
}

.text-primary {
  color: #3fb59e !important;
}
</style>
  