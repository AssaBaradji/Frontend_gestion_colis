<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold" style="color: #3fb59e">
      Détails de la Méthode de Paiement
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <div class="mb-3">
        <label class="form-label fw-bold text-primary">Nom :</label>
        <p>{{ method.nom }}</p>
      </div>
    </div>

    <div class="text-center mt-4">
      <button class="btn btn-secondary" @click="goBack">
        Retour à la liste
      </button>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'

const paymentMethodStore = usePaymentMethodStore()
const route = useRoute()
const router = useRouter()

const method = ref({})

onMounted(() => {
  const id = route.params.id
  method.value = paymentMethodStore.getPaymentMethodById(id)
  if (!method.value) {
    router.push('/payment-methods')
  }
})

const goBack = () => {
  router.push('/payment-methods')
}
</script>
  