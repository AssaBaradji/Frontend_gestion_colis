<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Ajouter un Type de Colis
      </h3>
      <form @submit.prevent="addParcelType">
        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="type.nom"
                placeholder="Nom du type de colis"
                required
              />
              <label for="nom"
                ><i class="fas fa-box me-2"></i>Nom du Type de Colis</label
              >
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
              <label><i class="fas fa-user me-2"></i>Utilisateur</label>
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
            <i class="fas fa-save me-2"></i> Ajouter Type de Colis
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTypeColisStore } from '@/store/parcelTypeStore.js'
import { useAuthStore } from '@/store/authStore.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const typeStore = useTypeColisStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const type = ref({
  nom: '',
  utilisateurId: authStore.utilisateurId,
})

onMounted(() => {
  if (!type.value.utilisateurId && authStore.currentUser) {
    type.value.utilisateurId = authStore.currentUser.id
  }
})

const addParcelType = async () => {
  try {
    const result = await typeStore.addTypeColis(type.value)
    if (result.success) {
      toast.success('Type de colis ajouté avec succès !')
      router.push('/parcel-types')
    } else {
      toast.error("Ce Type de Colis existe Déja.")
      throw new Error(result.error)
    }
  } catch (error) {
    console.error("Ce Type de Colis existe Déja :", error)
  }
}

const cancelAdd = () => {
  toast.info('Ajout du type de colis annulé.')
  router.push('/parcel-types')
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
