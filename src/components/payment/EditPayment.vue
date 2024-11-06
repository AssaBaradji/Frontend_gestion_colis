<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Modifier un Paiement
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="updatePayment">
        <div class="mb-3">
          <label for="montant" class="form-label fw-bold text-primary"
            >Montant :</label
          >
          <input
            type="number"
            id="montant"
            class="form-control"
            v-model="payment.montant"
            placeholder="Entrez le montant"
            required
          />
        </div>

        <div class="mb-3">
          <label for="moment_paiement" class="form-label fw-bold text-primary"
            >Moment du Paiement :</label
          >
          <input
            type="text"
            id="moment_paiement"
            class="form-control"
            v-model="payment.moment_paiement"
            placeholder="Moment du paiement"
            required
          />
        </div>

        <div class="mb-3">
          <label for="date_paiement" class="form-label fw-bold text-primary"
            >Date de Paiement :</label
          >
          <input
            type="date"
            id="date_paiement"
            class="form-control"
            v-model="payment.date_paiement"
            required
          />
        </div>

        <div class="mb-3">
          <label for="colisId" class="form-label fw-bold text-primary"
            >Colis :</label
          >
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
        </div>

        <div class="mb-3">
          <label for="methodeId" class="form-label fw-bold text-primary"
            >Méthode de Paiement :</label
          >
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
        </div>

        <button type="submit" class="btn btn-primary w-100 fw-bold mt-4">
          <i class="fas fa-save"></i> Enregistrer
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
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const paymentStore = usePaymentStore()
const parcelStore = useParcelStore()
const paymentMethodStore = usePaymentMethodStore()
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

const updatePayment = async () => {
  try {
    await paymentStore.updatePayment(payment.value)
    toast.success('Paiement mis à jour avec succès !')
    router.push('/payments')
  } catch (error) {
    toast.error('Erreur lors de la mise à jour du paiement.')
  }
}
</script>
  
  <style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}
</style>
  