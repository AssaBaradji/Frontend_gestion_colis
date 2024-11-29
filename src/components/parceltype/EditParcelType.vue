<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-75">
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Modifier le Type de Colis
      </h3>
      <form @submit.prevent="updateParcelType">
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
              <label for="nom">
                <i class="fas fa-box me-2"></i>Nom
              </label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="utilisateur"
                class="form-control"
                :value="loadedUser.nom || connectedUser.nom"
                placeholder="Utilisateur"
                readonly
              />
              <label for="utilisateur">
                <i class="fas fa-user me-2"></i>Utilisateur
              </label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-outline-secondary fw-bold w-45 shadow-sm"
            @click="cancel"
          >
            Annuler
          </button>

          <button
            class="btn w-45 py-2 fw-bold shadow-sm"
            type="submit"
            style="background-color: #3fb59e; color: white"
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
import { useTypeColisStore } from '@/store/parcelTypeStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useAuthStore } from '@/store/authStore.js'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const store = useTypeColisStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()


const type = ref({
  nom: '',
  utilisateurId: authStore.currentUser?.id || null,
})
const loadedUser = ref({})
const connectedUser = ref(authStore.currentUser || {})


const loadTypeColis = async () => {
  const id = route.params.id
  const existingType = store.typeColisById(id)

  if (existingType) {
    type.value = { ...existingType }
    loadedUser.value = userStore.users.find(user => user.id === type.value.utilisateurId) || connectedUser.value
  } else {
    toast.error('Type de colis non trouvé.')
    router.push('/parcel-types')
  }
}


onMounted(async () => {
  try {
    await userStore.fetchUsers()
    await loadTypeColis()
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    toast.error('Erreur lors du chargement des données.')
  }
})

const updateParcelType = async () => {
  if (!type.value.utilisateurId) {
    type.value.utilisateurId = connectedUser.value.id
  }

  try {
    await store.updateTypeColis(type.value)
    toast.success('Type de colis modifié avec succès !')
    router.push('/parcel-types')
  } catch (error) {
    console.error('Erreur lors de la modification du type de colis :', error)
    toast.error('Erreur lors de la modification du type de colis.')
  }
}

const cancel = () => {
  toast.info('Modification annulée')
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
