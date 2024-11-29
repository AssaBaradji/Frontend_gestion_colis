<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" :style="{ color: primaryColor }">
        Changer le Mot de Passe
      </h3>
      <form @submit.prevent="changePassword">
        <div class="form-floating mb-4 position-relative">
          <input
            :type="showCurrentPassword ? 'text' : 'password'"
            id="currentPassword"
            class="form-control"
            v-model="currentPassword"
            placeholder="Mot de passe actuel"
            required
            @input="clearError('currentPassword')"
          />
          <label for="currentPassword">
            <i class="fas fa-lock me-2"></i>Mot de passe actuel
          </label>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
            @click="toggleShowCurrentPassword"
          >
            <i
              :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            ></i>
          </button>
          <span class="error">{{ erroFiltere?.currentPassword }}</span>
        </div>

        <div class="form-floating mb-4 position-relative">
          <input
            :type="showNewPassword ? 'text' : 'password'"
            id="newPassword"
            class="form-control"
            v-model="newPassword"
            placeholder="Nouveau mot de passe"
            required
            @input="clearError('newPassword')"
          />
          <label for="newPassword">
            <i class="fas fa-key me-2"></i>Nouveau mot de passe
          </label>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
            @click="toggleShowNewPassword"
          >
            <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
          <span class="error">{{ erroFiltere?.newPassword }}</span>
        </div>

        <div class="form-floating mb-4 position-relative">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            id="confirmPassword"
            class="form-control"
            v-model="confirmPassword"
            placeholder="Confirmer le mot de passe"
            required
            @input="clearError('confirmPassword')"
          />
          <label for="confirmPassword">
            <i class="fas fa-check me-2"></i>Confirmer le mot de passe
          </label>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
            @click="toggleShowConfirmPassword"
          >
            <i
              :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            ></i>
          </button>
          <div class="error" v-if="validPassword">
            Les mots de passe ne correspondent pas.
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            @click="cancelChange"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn w-45 py-2 fw-bold shadow-sm"
            :style="{ backgroundColor: primaryColor, color: textColor }"
          >
            <i class="fas fa-save me-2"></i>Enregistrer
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

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const errors = ref([])
const erroFiltere = ref({})
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const validPassword = ref(false)

const primaryColor = '#3fb59e'
const textColor = '#FFFFFF'

const toggleShowCurrentPassword = () => {
  showCurrentPassword.value = !showCurrentPassword.value
}

const toggleShowNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    validPassword.value = true
    // toast.error('Les mots de passe ne correspondent pas.')
    return
  }
  try {
    validPassword.value = false
    await authStore.changePassword(currentPassword.value, newPassword.value)
    toast.success('Mot de passe mis à jour avec succès !')
    erroFiltere.value = [];
    router.push('/profile')
  } catch (error) {
    if (error.response.data) {
      errors.value = [...error.response.data.errors]

      erroFiltere.value = errors.value.reduce((acc, error) => {
        acc[error.path] = error.msg
        return acc
      }, {})

      console.log('ERRORS DES VALIDATOR', errors.value)
    } else {
      console.error(error)
      toast.error('Erreur lors de la mise à jour du mot de passe.')
    }
  }
}

const clearError = (field) => {
  if (erroFiltere.value[field]) {
    delete erroFiltere.value[field];
  }
  if (field === 'confirmPassword') {
    validPassword.value = false; 
  }
};

const cancelChange = () => {
  toast.info('Changement de mot de passe annulé.')
  router.push('/users')
}
</script>
  
  <style scoped>
.container {
  min-block-size: 90vh;
}

.form-container {
  max-inline-size: 850px;
  background-color: #fff;
  padding: 3rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.error {
  color: red;
  font-size: 13px;
}

.form-floating label {
  color: #6c757d;
  font-size: 1rem;
}

.form-control {
  border: 2px solid #ddd !important;
  transition: border-color 0.3s ease;
  padding: 1.5rem;
  font-size: 1.1rem;
}

.form-control:focus {
  border-color: #3fb59e !important;
  box-shadow: 0 0 0 0.2rem rgba(63, 181, 158, 0.25);
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

.position-relative .btn {
  z-index: 10;
}
</style>
  