<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e; margin-block-start: 80px;">
      Ajouter une Méthode de Paiement
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="addMethod">
        <div class="mb-3">
          <label for="nom" class="form-label fw-bold text-primary">
            Nom :
          </label>
          <input
            type="text"
            id="nom"
            class="form-control"
            v-model="method.nom"
            placeholder="Entrez le nom de la méthode de paiement"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary w-100 fw-bold mt-4">
          <i class="fas fa-save"></i> Ajouter
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const paymentMethodStore = usePaymentMethodStore()
const router = useRouter()
const toast = useToast()

const method = ref({
  nom: '',
})

const addMethod = async () => {
  try {
    await paymentMethodStore.addPaymentMethod(method.value)
    router.push('/payment-methods')
    toast.success('Méthode de paiement ajoutée avec succès !')
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la méthode de paiement :', error)
    toast.error("Erreur lors de l'ajout de la méthode de paiement.")
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
