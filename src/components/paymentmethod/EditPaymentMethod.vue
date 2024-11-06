<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold" style="color: #3fb59e">
      Modifier la Méthode de Paiement
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="updateMethod">
        <div class="mb-3">
          <label for="nom" class="form-label fw-bold text-primary">Nom :</label>
          <input
            type="text"
            id="nom"
            class="form-control"
            v-model="method.nom"
            placeholder="Nom de la méthode de paiement"
            required
            :style="{ borderColor: '#3fb59e' }"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100 fw-bold mt-4" :style="{ backgroundColor: '#3fb59e', borderColor: '#3fb59e', color: '#ffffff' }">
          <i class="fas fa-save"></i> Enregistrer les modifications
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'
import { useToast } from 'vue-toastification'

const paymentMethodStore = usePaymentMethodStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const method = ref({
  nom: '',
})

onMounted(async () => {
  const id = route.params.id
  method.value = paymentMethodStore.getPaymentMethodById(id)
  if (!method.value) {
    router.push('/payment-methods')
  }
})

const updateMethod = async () => {
  try {
    await paymentMethodStore.updatePaymentMethod(method.value)
    router.push('/payment-methods')
    toast.success('Méthode de paiement modifiée avec succès !')
  } catch (error) {
    toast.error('Erreur lors de la modification de la méthode de paiement.')
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
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #349d87;
  border-color: #349d87;
}

.text-primary {
  color: #3fb59e !important;
}
</style>
