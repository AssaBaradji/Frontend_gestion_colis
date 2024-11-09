<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
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
                required
              />
              <label for="nom">Nom</label>
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
                required
              />
              <label for="email">Email</label>
            </div>
          </div>
        </div>

        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="password"
                id="mot_de_passe"
                class="form-control"
                v-model="user.mot_de_passe"
                placeholder="Mot de passe"
                :class="{ 'is-invalid': passwordError }"
                @blur="validatePassword"
                required
              />
              <label for="mot_de_passe">Mot de Passe</label>
              <span v-if="passwordError" class="error-text">{{
                passwordError
              }}</span>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <select
                id="role"
                class="form-select"
                v-model="user.role"
                required
              >
                <option value="" disabled selected>Choisissez un rôle</option>
                <option value="Admis">Admis</option>
                <option value="Agent">Agent</option>
              </select>
              <label for="role">Rôle</label>
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
          <label for="statut">Statut</label>
        </div>

        <div class="d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            @click="cancelAdd "
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn w-45 py-2 fw-bold shadow-sm"
            style="background-color: #3fb59e; color: white"
          >
            Ajouter Utilisateur
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

const passwordError = ref('')

const validatePassword = () => {
  if (user.value.mot_de_passe.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères.'
  } else {
    passwordError.value = ''
  }
}

const addUser = async () => {
  validatePassword()
  if (passwordError.value) return

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
    if (!toast.isActive('error-add-user')) {
      toast.error("Erreur lors de l'ajout de l'utilisateur.", {
        id: 'error-add-user',
      })
    }
  }
}
const cancelAdd = () => {
  toast.info('cancel-add-user')
  router.push('/users')
}
</script>

<style scoped>
.container {
  min-block-size: 100vh;
}

.form-container {
  max-inline-size: 800px;
  background-color: #fff;
  padding: 3rem 2rem;
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

.form-control,
.form-select {
  border: 2px solid #ddd !important;
  transition: border-color 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #3fb59e !important;
  box-shadow: 0 0 0 0.2rem rgba(63, 181, 158, 0.25);
}

.w-45 {
  inline-size: 45%;
}

.error-text {
  color: #dc3545;
  font-size: 0.8rem;
  margin-block-start: 4px;
}
</style>
