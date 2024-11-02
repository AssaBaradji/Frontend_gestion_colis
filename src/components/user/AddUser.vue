   <template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold text-primary">
      Ajouter un Utilisateur
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="addUser">
        <div class="mb-3">
          <label for="nom" class="form-label fw-bold text-primary">Nom:</label>
          <input
            type="text"
            id="nom"
            class="form-control"
            v-model="user.nom"
            placeholder="Entrez le nom"
            required
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label fw-bold text-primary"
            >Email:</label
          >
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="user.email"
            placeholder="Entrez l'email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="mot_de_passe" class="form-label fw-bold text-primary"
            >Mot de Passe:</label
          >
          <input
            type="password"
            id="mot_de_passe"
            class="form-control"
            v-model="user.mot_de_passe"
            placeholder="Entrez le mot de passe"
            required
          />
        </div>

        <div class="mb-3">
          <label for="role" class="form-label fw-bold text-primary"
            >Rôle:</label
          >
          <select id="role" class="form-select" v-model="user.role" required>
            <option value="" disabled selected>Choisissez un rôle</option>
            <option value="Admis">Admis</option>
            <option value="Agent">Agent</option>
          </select>
        </div>
        <div class="form-check mb-4">
          <input
            type="checkbox"
            id="statut"
            class="form-check-input"
            v-model="user.statut"
          />
          <label for="statut" class="form-check-label text-primary"
            >Statut actif</label
          >
        </div>

        <button type="submit" class="btn btn-primary w-100 fw-bold">
          <i class="fas fa-save"></i> Ajouter Utilisateur
        </button>
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
    toast.success('Utilisateur ajouté avec succès !')
    await store.fetchUsers()
    router.push('/users')
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error)
    toast.error(
      "Erreur lors de l'ajout de l'utilisateur. Vérifiez les champs et réessayez."
    )
  }
}
</script>
  
  <style scoped>
h1 {
  color: #007bff;
}

.form-label {
  color: #007bff;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
  