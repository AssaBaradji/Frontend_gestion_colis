<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div v-if="isLoading" class="text-center">
      <i
        class="fas fa-spinner fa-spin fa-3x"
        :style="{ color: primaryColor }"
      ></i>
    </div>

    <div v-else class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" :style="{ color: primaryColor }">
        Modifier l'utilisateur
      </h3>
      <form @submit.prevent="updateUser">
        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="user.nom"
                placeholder="Nom de l'utilisateur"
                required
              />
              <label for="nom"> <i class="fas fa-user me-2"></i>Nom </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="user.email"
                placeholder="Adresse email"
                required
              />
              <label for="email">
                <i class="fas fa-envelope me-2"></i>Email
              </label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4 position-relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="mot_de_passe"
                class="form-control"
                v-model="user.mot_de_passe"
                placeholder="Mot de passe"
                :class="{ 'is-invalid': passwordError || errors.mot_de_passe }"
                @blur="validatePassword"
                required
              />
              <label for="mot_de_passe">
                <i class="fas fa-lock me-2"></i>Mot de passe
              </label>

              <font-awesome-icon
                :icon="showPassword ? 'eye-slash' : 'eye'"
                class="eye-icon"
                @click="togglePasswordVisibility"
              />
              <span v-if="passwordError" class="error-text">{{
                passwordError
              }}</span>
            </div>

            <div class="form-floating mb-4">
              <select
                id="role"
                class="form-select"
                v-model="user.role"
                required
              >
                <option value="" disabled selected>Choisissez un rôle</option>
                <option value="Admis">Admin</option>
                <option value="Agent">Agent</option>
              </select>
              <label for="role">
                <i class="fas fa-user-tag me-2"></i>Rôle
              </label>
            </div>
          </div>
        </div>

        <div class="form-floating mb-4">
          <select
            id="statut"
            class="form-select"
            v-model="user.statut"
            required
          >
            <option value="actif">Actif</option>
            <option value="bloqué">Bloqué</option>
          </select>
          <label for="statut"
            ><i class="fas fa-toggle-on me-2"></i>Statut</label
          >
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
            class="btn w-45 py-2 fw-bold shadow-sm"
            type="submit"
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import { useToast } from 'vue-toastification'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faToggleOn,
  faUserTag,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faToggleOn,
  faUserTag
)

const store = useUserStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const user = ref({})
const isLoading = ref(true)
const primaryColor = '#3fb59e'
const textColor = '#FFFFFF'
const showPassword = ref(false)

const loadUser = async () => {
  try {
    const loadedUser = await store.userById(route.params.id)
    if (!loadedUser) {
      toast.error('Utilisateur introuvable', { id: 'error-load-user' })
      router.push('/users')
      return
    }

    user.value = {
      ...loadedUser,
      statut: loadedUser.statut ? 'actif' : 'bloqué',
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    toast.error("Erreur lors du chargement de l'utilisateur", {
      id: 'error-load-user',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUser()
})

const updateUser = async () => {
  try {
    const updatedUser = {
      ...user.value,
      statut: user.value.statut === 'actif',
    }
    await store.updateUser(updatedUser)
    toast.success('Utilisateur mis à jour avec succès', {
      id: 'success-update-user',
    })
    router.push('/users')
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
    if (!toast.isActive('error-update-user')) {
      toast.error("Erreur lors de la mise à jour de l'utilisateur.", {
        id: 'error-update-user',
      })
    }
  }
}

const errors = ref({})
const passwordError = ref('')

const validatePassword = () => {
  if (user.value.mot_de_passe.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères.'
  } else {
    passwordError.value = ''
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const cancelEdit = () => {
  toast.info('Modification annulée')
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

.form-floating label {
  color: #6c757d;
  font-size: 1rem; 
}

.form-control,
.form-select {
  border: 2px solid #ddd !important;
  transition: border-color 0.3s ease;
  padding: 1.5rem; 
  font-size: 1.1rem; 
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

.eye-icon {
  position: absolute;
  inset-block-start: 20px;
  inset-inline-end: 15px;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
}

.eye-icon:hover {
  color: #333;
}

.error-text {
  color: #dc3545;
  font-size: 0.8rem;
  margin-block-start: 4px;
}
</style>
