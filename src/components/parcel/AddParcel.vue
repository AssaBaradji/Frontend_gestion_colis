<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Ajouter un Colis
    </h1>

    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="addParcel">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="code_colis" class="form-label fw-bold text-primary"
                >Code Colis:</label
              >
              <input
                type="text"
                id="code_colis"
                class="form-control"
                v-model="parcel.code_colis"
                placeholder="Entrez le code du colis"
                required
              />
            </div>

            <div class="mb-3">
              <label for="prix" class="form-label fw-bold text-primary"
                >Prix:</label
              >
              <input
                type="number"
                id="prix"
                class="form-control"
                v-model="parcel.prix"
                placeholder="Entrez le prix"
                required
              />
            </div>

            <div class="mb-3">
              <label
                for="date_enregistrement"
                class="form-label fw-bold text-primary"
                >Date d'Enregistrement:</label
              >
              <input
                type="date"
                id="date_enregistrement"
                class="form-control"
                v-model="parcel.date_enregistrement"
                required
              />
            </div>

            <div class="mb-3">
              <label
                for="emplacement_colis"
                class="form-label fw-bold text-primary"
                >Emplacement:</label
              >
              <input
                type="text"
                id="emplacement_colis"
                class="form-control"
                v-model="parcel.emplacement_colis"
                placeholder="Entrez l'emplacement du colis"
                required
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="mb-3">
              <label for="description" class="form-label fw-bold text-primary"
                >Description:</label
              >
              <textarea
                id="description"
                class="form-control"
                v-model="parcel.description"
                placeholder="Entrez une description"
                required
              ></textarea>
            </div>

            <div class="mb-3">
              <label for="utilisateurId" class="form-label fw-bold text-primary"
                >Utilisateur:</label
              >
              <select
                id="utilisateurId"
                class="form-select"
                v-model="parcel.utilisateurId"
                required
              >
                <option value="" disabled selected>
                  Choisissez un utilisateur
                </option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.nom }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="typeId" class="form-label fw-bold text-primary"
                >Type de Colis:</label
              >
              <select
                id="typeId"
                class="form-select"
                v-model="parcel.typeId"
                required
              >
                <option value="" disabled selected>
                  Choisissez un type de colis
                </option>
                <option v-for="type in types" :key="type.id" :value="type.id">
                  {{ type.nom }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 fw-bold mt-4">
          <i class="fas fa-save"></i> Ajouter Colis
        </button>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useParcelStore } from '@/store/parcelStore.js'
import { useTypeColisStore } from '@/store/parcelTypeStore.js'
import { useUserStore } from '@/store/userStore.js'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const parcelStore = useParcelStore()
const userStore = useUserStore()
const typeStore = useTypeColisStore()
const router = useRouter()
const toast = useToast()

const parcel = ref({
  code_colis: '',
  prix: '',
  date_enregistrement: '',
  emplacement_colis: '',
  description: '',
  utilisateurId: '',
  typeId: '',
})

const users = ref([])
const types = ref([])

onMounted(async () => {
  try {
    await userStore.fetchUsers()
    await typeStore.fetchTypesColis()
    users.value = userStore.users
    types.value = typeStore.types
  } catch (error) {
    console.error(
      'Erreur lors du chargement des utilisateurs ou des types :',
      error
    )
    toast.error('Erreur lors du chargement des utilisateurs ou des types.')
  }
})

const addParcel = async () => {
  try {
    await parcelStore.addParcel(parcel.value)
    router.push('/parcels')
    toast.success('Colis ajouté avec succès !')
  } catch (error) {
    console.error("Erreur lors de l'ajout du colis :", error)
    toast.error(
      "Erreur lors de l'ajout du colis. Vérifiez les champs et réessayez."
    )
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

.text-primary {
  color: #3fb59e !important;
}
</style>
  