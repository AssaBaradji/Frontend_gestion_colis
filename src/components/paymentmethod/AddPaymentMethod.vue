<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Ajouter une Méthode de Paiement
      </h3>
      <form @submit.prevent="addPaymentMethod">
        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="method.nom"
                placeholder="Nom de la méthode de paiement"
                required
              />
              <label for="nom">
                <i class="fas fa-credit-card me-2"></i> Nom de la Méthode
              </label>
            </div>
          </div>

          <div class="col-md-6">
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

        <div class="d-flex justify-content-between mt-4">
          <button
            type="button"
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            @click="cancelAdd"
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
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'
import { useAuthStore } from '@/store/authStore.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const paymentMethodStore = usePaymentMethodStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const method = ref({
  nom: '',
  utilisateurId: authStore.currentUser?.id || null,
})

onMounted(() => {
  if (!method.value.utilisateurId && authStore.currentUser) {
    method.value.utilisateurId = authStore.currentUser.id
  }
})

const addPaymentMethod = async () => {
  try {
    const result = await paymentMethodStore.addPaymentMethod(method.value)
    if (result.success) {
      toast.success('Méthode de paiement ajoutée avec succès !')
      await paymentMethodStore.fetchPaymentMethods()
      router.push('/payment-methods')
    } else {
      toast.error("Cette Methode de Paiement existe Déja.")
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la méthode de paiement :", error)
    toast.error("Erreur lors de l'ajout de la méthode de paiement.")
  }
}

const cancelAdd = () => {
  toast.info('Ajout de la méthode de paiement annulé.')
  router.push('/payment-methods')
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

