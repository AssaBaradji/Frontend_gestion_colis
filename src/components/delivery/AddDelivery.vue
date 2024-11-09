<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Ajouter une Livraison
    </h1>
    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="handleAddDelivery">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="nom" class="form-label fw-bold text-primary">
                Nom :
              </label>
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="delivery.nom"
                placeholder="Nom"
                required
              />
            </div>
            <div class="mb-3">
              <label for="prenom" class="form-label fw-bold text-primary">
                Prénom :
              </label>
              <input
                type="text"
                id="prenom"
                class="form-control"
                v-model="delivery.prenom"
                placeholder="Prénom"
                required
              />
            </div>
            <div class="mb-3">
              <label
                for="date_livraison"
                class="form-label fw-bold text-primary"
              >
                Date de Livraison :
              </label>
              <input
                type="date"
                id="date_livraison"
                class="form-control"
                v-model="delivery.date_livraison"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="telephone" class="form-label fw-bold text-primary">
                Téléphone :
              </label>
              <input
                type="tel"
                id="telephone"
                class="form-control"
                v-model="delivery.telephone"
                placeholder="Téléphone"
                required
              />
            </div>
            <div class="mb-3">
              <label for="expeditionId" class="form-label fw-bold text-primary">
                Expédition :
              </label>
              <select
                id="expeditionId"
                class="form-select"
                v-model="delivery.expeditionId"
                required
              >
                <option value="" disabled selected>
                  Choisissez une expédition
                </option>
                <option
                  v-for="expedition in expeditions"
                  :key="expedition.id"
                  :value="expedition.id"
                >
                  {{ expedition.nom_destinataire }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold text-primary">Utilisateur :</label>
              <input
                type="text"
                class="form-control"
                :value="authStore.utilisateurNom"
                readonly
              />
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 fw-bold mt-4">
          <i class="fas fa-save"></i> Ajouter Livraison
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDeliveryStore } from '@/store/deliveryStore.js'
import { useShipmentStore } from '@/store/shipmentStore.js'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const deliveryStore = useDeliveryStore()
const shipmentStore = useShipmentStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const delivery = ref({
  nom: '',
  prenom: '',
  date_livraison: '',
  telephone: '',
  expeditionId: '',
  utilisateurId: authStore.utilisateurId, // Utilisateur connecté
})

const expeditions = ref([])

onMounted(async () => {
  try {
    await shipmentStore.fetchShipments()
    expeditions.value = shipmentStore.shipments
  } catch (error) {
    console.error('Erreur lors du chargement des expéditions.', error)
    toast.error('Erreur lors du chargement des expéditions.')
  }
})

const handleAddDelivery = async () => {
  try {
    const { success } = await deliveryStore.addDelivery(delivery.value)
    if (success) {
      toast.success('Livraison ajoutée avec succès !')
      router.push('/delivery')
    } else {
      toast.error("Erreur lors de l'ajout de la livraison.")
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la livraison :", error)
    toast.error("Erreur lors de l'ajout de la livraison.")
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
