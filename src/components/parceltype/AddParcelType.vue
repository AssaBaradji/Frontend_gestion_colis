<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Ajouter un Type de Colis
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="addParcelType">
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

        <button type="submit" class="btn btn-primary w-100 fw-bold mt-4">
          <i class="fas fa-save"></i> Ajouter Type de Colis
        </button>
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
  utilisateurId: authStore.currentUser?.id || null,
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
      toast.error("Erreur lors de l'ajout du type de colis.")
      throw new Error(result.error)
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du type de colis :", error)
  }
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
</style>
