<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Détails du Paiement
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <div class="mb-3"><strong>Montant :</strong> {{ payment.montant }}</div>
      <div class="mb-3">
        <strong>Date de Paiement :</strong> {{ payment.date_paiement }}
      </div>
      <div class="mb-3">
        <strong>Moment du Paiement :</strong> {{ payment.moment_paiement }}
      </div>
      <div class="mb-3">
        <strong>Utilisateur :</strong>
        {{ payment.utilisateur ? payment.utilisateur.nom : 'N/A' }}
      </div>
      <div class="mb-3">
        <strong>Colis :</strong>
        {{ payment.colis ? payment.colis.code_colis : 'N/A' }}
      </div>
      <div class="mb-3">
        <strong>Méthode de Paiement :</strong>
        {{ payment.methodePaiement ? payment.methodePaiement.nom : 'N/A' }}
      </div>

      <router-link to="/payments" class="btn btn-secondary w-100 mt-4"
        >Retour à la liste des paiements</router-link
      >
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
</style>
  