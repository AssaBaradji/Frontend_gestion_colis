<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Modifier le Profil
      </h3>
      <form @submit.prevent="updateProfile">
        <div class="row">
          <div class="col-12">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="name"
                class="form-control form-wide"
                v-model="profile.name"
                placeholder="Nom"
                required
              />
              <label for="name"> <i class="fas fa-user me-2"></i>Nom </label>
              <span class="error">{{ erroFiltere?.name }}</span>
            </div>
          </div>

          <div class="col-12">
            <div class="form-floating mb-4">
              <input
                type="email"
                id="email"
                class="form-control form-wide"
                v-model="profile.email"
                placeholder="Email"
                required
              />
              <label for="email">
                <i class="fas fa-envelope me-2"></i>Email
              </label>
              <span class="error">{{ erroFiltere?.email }}</span>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            @click="cancelEdit"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn w-45 py-2 fw-bold shadow-sm"
            :disabled="isSubmitting"
            style="background-color: #3fb59e; color: white"
          >
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm"
              role="status"
            ></span>
            <span v-else>Enregistrer</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const isLoading = ref(true)
const isSubmitting = ref(false)

const errors = ref([])
const erroFiltere = ref({})
const profile = ref({
  name: localStorage.getItem("userName"),
  email: localStorage.getItem("email"),
})


const updateProfile = async () => {
  if (!profile.value.name || !profile.value.email) {
    toast.error('Tous les champs doivent être remplis.')
    return
  }

  isSubmitting.value = true
  try {
    await authStore.updateProfile(profile.value)
    toast.success('Profil mis à jour avec succès !')
    authStore.logout()
  } catch (error) {
    if (error.response.data) {
      errors.value = [...error.response.data.errors]

      erroFiltere.value = errors.value.reduce((acc, error) => {
        acc[error.path] = error.msg
        return acc
      }, {})

      console.log('ERRORS DES VALIDATOR', errors.value)
    } else {
      console.error('Erreur lors de la mise à jour du profil ')

      toast.error('Erreur lors de la mise à jour du profil.')
    }
  } finally {
    isSubmitting.value = false
  }
}

const cancelEdit = () => {
  toast.info('Modification du profil annulée.')
  router.push('/users')
}
</script>
  
  <style scoped>
.error {
  color: red;
  font-size: 13px;
}
.container {
  min-block-size: 90vh;
}

.form-container {
  max-inline-size: 900px;
  background-color: #fff;
  padding: 3rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-floating {
  max-inline-size: 100%;
}

.form-floating .form-control {
  border: 2px solid #ddd !important;
  transition: border-color 0.3s ease;
  padding: 1.5rem;
  font-size: 1.1rem;
  inline-size: 100%;
}

.form-floating label {
    margin-block-start: -5px;
  font-size: 1rem;
  color: #6c757d;
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
</style>
  