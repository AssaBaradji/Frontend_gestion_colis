<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Ajouter un Utilisateur
      </h3>
      <form @submit.prevent="addUser">
        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="user.nom"
                placeholder="Nom"
                :class="{ 'is-invalid': errors.nom }"
                required
                @input="clearError('nom')"
              />
              <label for="nom"> <i class="fas fa-user me-2"></i>Nom </label>
              <span v-if="errors.nom" class="error-text">{{ errors.nom }}</span>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="user.email"
                placeholder="Email"
                :class="{ 'is-invalid': errors.email }"
                required
                @input="clearError('email')"
              />
              <label for="email">
                <i class="fas fa-envelope me-2"></i>Email
              </label>
              <span v-if="errors.email" class="error-text">{{
                errors.email
              }}</span>
            </div>
          </div>
        </div>

        <div class="row gx-5">
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
                @change="clearError('mot_de_passe')"
              />
              <label for="mot_de_passe">
                <i class="fas fa-lock me-2"></i>Mot de Passe
              </label>

              <font-awesome-icon
                :icon="showPassword ? 'eye-slash' : 'eye'"
                class="eye-icon"
                @click="togglePasswordVisibility"
              />
              <span v-if="passwordError" class="error-text">{{
                passwordError
              }}</span>
              <span v-if="errors.mot_de_passe" class="error-text">{{
                errors.mot_de_passe
              }}</span>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <select
                id="role"
                class="form-select"
                v-model="user.role"
                :class="{ 'is-invalid': errors.role }"
                required
                @change="clearError('role')"
              >
                <option value="" disabled selected>Choisissez un rôle</option>
                <option value="Admin">Admin</option>
                <option value="Agent">Agent</option>
              </select>
              <label for="role">
                <i class="fas fa-user-tag me-2"></i>Rôle
              </label>
              <span v-if="errors.role" class="error-text">{{
                errors.role
              }}</span>
            </div>
          </div>
        </div>

        <div class="form-floating mb-4">
          <select
            id="statut"
            class="form-select"
            v-model="user.statut"
            :class="{ 'is-invalid': errors.statut }"
            required
            @change="clearError('statut')"
          >
            <option value="actif">Actif</option>
            <option value="bloqué">Bloqué</option>
          </select>
          <label for="statut">
            <i class="fas fa-toggle-on me-2"></i>Statut
          </label>
          <span v-if="errors.statut" class="error-text">{{
            errors.statut
          }}</span>
        </div>

        <div class="d-flex justify-content-between">
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
            <i class="fas fa-save me-2"></i>Ajouter Utilisateur
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'vue-router'
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
const toast = useToast()

const user = ref({
  nom: '',
  email: '',
  mot_de_passe: '',
  role: '',
  statut: 'actif',
})

const errors = ref({})
const passwordError = ref('')
const showPassword = ref(false)

const validatePassword = () => {
  if (user.value.mot_de_passe.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères.'
  } else {
    passwordError.value = ''
  }
}

const validateFields = () => {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/
  if (!user.value.nom) {
    errors.value.nom = 'Le nom est requis'
  } else if (!nameRegex.test(user.value.nom)) {
    errors.value.nom = 'Le nom ne doit contenir que des lettres'
  } else if (user.value.nom.trim().length === 0) {
    errors.value.nom = 'Le nom ne doit pas contenir uniquement des espaces!'
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!user.value.email) {
    errors.value.email = "L'email est requis"
  } else if (!emailRegex.test(user.value.email)) {
    errors.value.email = 'Email invalide'
  }

  if (!user.value.role) {
    errors.value.role = 'Le rôle est requis'
  }

  if (passwordError.value) errors.value.mot_de_passe = passwordError.value
  if (!user.value.statut) errors.value.statut = 'Le statut est requis'
}

const addUser = async () => {
  validateFields()

  if (Object.keys(errors.value).length) return
  try {
    const formattedUser = {
      ...user.value,
      statut: user.value.statut === 'actif',
    }

    await store.addUser(formattedUser)
    await store.fetchUsers()

    toast.success('Utilisateur ajouté avec succès.')
    router.push('/users')
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error)

    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors.reduce((acc, err) => {
        acc[err.param] = err.msg
        return acc
      }, {})
    } else if (!toast.isActive('error-add-user')) {
      toast.error("Erreur lors de l'ajout de l'utilisateur.", {
        id: 'error-add-user',
      })
    }
  }
}

const clearError = field => {
  if (errors.value[field]) delete errors.value[field]
}

const cancelAdd = () => {
  toast.info("Ajout d'utilisateur annulé.")
  router.push('/users')
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
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
