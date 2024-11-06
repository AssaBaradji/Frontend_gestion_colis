<template>
  <div class="form-wrapper">
    <h1 class="text-center">Ajouter un Utilisateur</h1>
    <div class="form-box">
      <form @submit.prevent="addUser">
        <div class="form-group">
          <label for="nom">Nom</label>
          <input
            type="text"
            id="nom"
            v-model="user.nom"
            placeholder="Nom"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            placeholder="Email"
            required
          />
        </div>

        <div class="form-group">
          <label for="mot_de_passe">Mot de Passe</label>
          <input
            type="password"
            id="mot_de_passe"
            v-model="user.mot_de_passe"
            placeholder="Mot de passe"
            required
          />
        </div>

        <div class="form-group">
          <label for="role">Rôle</label>
          <select id="role" v-model="user.role" required>
            <option value="" disabled selected>Choisissez un rôle</option>
            <option value="Admis">Admis</option>
            <option value="Agent">Agent</option>
          </select>
        </div>

        <div class="form-check">
          <input type="checkbox" id="statut" v-model="user.statut" />
          <label for="statut">Statut actif</label>
        </div>

        <button type="submit" class="submit-btn">Ajouter Utilisateur</button>
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
  statut: true,
})

const addUser = async () => {
  try {
    await store.addUser(user.value)
    await store.fetchUsers()
    router.push('/users')
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error)
    toast.error("Erreur lors de l'ajout de l'utilisateur.")
  }
}
</script>

<style scoped>
.form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-block-size: 100vh;
  background-color: #f4f7f6;
}

h1 {
  color: #3fb59e;
  font-size: 1.5rem;
  margin-block-end: 1rem;
}

.form-box {
  inline-size: 100%;
  max-inline-size: 400px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-block-end: 15px;
}

.form-group label {
  color: #3fb59e;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3fb59e;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(63, 181, 158, 0.25);
}

.form-check {
  display: flex;
  align-items: center;
  margin-block-end: 20px;
}

.form-check input {
  margin-inline-end: 5px;
}

.form-check label {
  color: #959e89;
}

.submit-btn {
  inline-size: 100%;
  padding: 10px;
  background-color: #3fb59e;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #349d87;
}
</style>
