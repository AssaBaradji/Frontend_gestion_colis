<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" :style="{ color: primaryColor }">
        Réinitialiser le mot de passe
      </h3>
      <form @submit.prevent="handleResetPassword">
        <div class="form-floating mb-4 position-relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-control"
            v-model="newPassword"
            placeholder="Nouveau mot de passe"
            required
          />
          <label for="password">
            <i class="fas fa-lock me-2"></i>Nouveau mot de passe
          </label>
          <span
            class="password-toggle position-absolute"
            @click="togglePasswordVisibility"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
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
            <i class="fas fa-save me-2"></i>Réinitialiser
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore.js'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const newPassword = ref('')
const authStore = useAuthStore()

const primaryColor = '#3fb59e'
const textColor = '#FFFFFF'

const showPassword = ref(false)

const handleResetPassword = async () => {
  const token = route.params.token
  console.log('Token dans reset_password:', token)

  try {
    await authStore.resetPassword(token, newPassword.value)
    toast.success('Mot de passe réinitialisé avec succès.')
    router.push('/login')
  } catch (error) {
    toast.error(error.message || "Une erreur s'est produite.")
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
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

.position-relative {
  position: relative;
}

.password-toggle {
  cursor: pointer;
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: 10px;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.password-toggle:hover {
  color: #3fb59e;
}
</style>
  