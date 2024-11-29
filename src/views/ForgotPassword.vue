<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" :style="{ color: primaryColor }">
        Réinitialisation de mot de passe
      </h3>
      <form @submit.prevent="handleForgotPassword">
        <div class="form-floating mb-4">
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            placeholder="Adresse email"
            required
          />
          <label for="email">
            <i class="fas fa-envelope me-2"></i>Adresse email
          </label>
        </div>

        <div class="d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            @click="cancelReset"
          >
            Annuler
          </button>

          <button
            class="btn w-45 py-2 fw-bold shadow-sm"
            type="submit"
            :style="{ backgroundColor: primaryColor, color: textColor }"
          >
            <i class="fas fa-paper-plane me-2"></i>Envoyer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/authStore.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const email = ref('')
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const primaryColor = '#3fb59e'
const textColor = '#FFFFFF'

const handleForgotPassword = async () => {
  try {
    await authStore.forgotPassword(email.value)
    toast.success('Email de réinitialisation envoyé avec succès.')
  } catch (error) {
    toast.error(error.message || "Une erreur s'est produite.")
  }
}

const cancelReset = () => {
  toast.info('Réinitialisation annulée.')
  router.push('/')
}
</script>
  
  <style scoped>
.container {
  min-block-size: 90vh;
}

.form-container {
  max-inline-size: 500px;
  background-color: #fff;
  padding: 2rem 1.5rem;
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

.form-control {
  border: 2px solid #ddd !important;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #3fb59e !important;
  box-shadow: 0 0 0 0.2rem rgba(63, 181, 158, 0.25);
}

.w-45 {
  inline-size: 45%;
}
</style>
  