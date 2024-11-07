<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Modifier le Type de Colis
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="updateParcelType">
        <div class="mb-3">
          <label for="nom" class="form-label fw-bold text-primary">Nom :</label>
          <input
            type="text"
            id="nom"
            class="form-control"
            v-model="type.nom"
            placeholder="Entrez le nom du type de colis"
            required
          />
        </div>

        <div class="mb-3">
          <label for="utilisateur" class="form-label fw-bold text-primary"
            >Utilisateur :</label
          >
          <input
            type="text"
            id="utilisateur"
            class="form-control"
            :value="loadedUser.nom || connectedUser.nom"
            placeholder="Utilisateur"
            readonly
          />
        </div>

        <div class="d-flex gap-3">
          <button type="submit" class="btn btn-primary w-100 fw-bold">
            <i class="fas fa-save"></i> Modifier Type de Colis
          </button>
          <button
            type="button"
            class="btn btn-secondary w-100 fw-bold"
            @click="cancel"
          >
            Annuler
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
const connectedUser = ref(authStore.currentUser)

const loadTypeColis = async () => {
  const id = route.params.id
  const existingType = store.typeColisById(id)
  if (existingType) {
    type.value = { ...existingType }
    loadedUser.value =
      userStore.users.find(user => user.id === type.value.utilisateurId) ||
      connectedUser.value
  } else {
    toast.error('Type de colis non trouvé.')
    router.push('/parcel-types')
  }
}

onMounted(async () => {
  await userStore.fetchUsers()
  loadTypeColis()
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
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}

.form-label {
  color: #3fb59e;
}

.btn-primary {
  background-color: #3fb59e;
  border-color: #3fb59e;
}

.btn-primary:hover {
  background-color: #349d87;
  border-color: #349d87;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #3fb59e;
}

.btn-secondary:hover {
  background-color: #e2e2e2;
}
</style>
