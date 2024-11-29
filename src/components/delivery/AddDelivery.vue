<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Ajouter une Livraison
      </h3>
      <form @submit.prevent="handleAddDelivery">
        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="delivery.nom"
                placeholder="Nom"
                required
              />
              <label for="nom"> <i class="fas fa-user me-2"></i> Nom </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="text"
                id="prenom"
                class="form-control"
                v-model="delivery.prenom"
                placeholder="Prénom"
                required
              />
              <label for="prenom">
                <i class="fas fa-user me-2"></i> Prénom
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="date"
                id="date_livraison"
                class="form-control"
                v-model="delivery.date_livraison"
                required
              />
              <label for="date_livraison">
                <i class="fas fa-calendar-alt me-2"></i> Date de Livraison
              </label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="tel"
                id="telephone"
                class="form-control"
                v-model="delivery.telephone"
                placeholder="Téléphone"
                required
              />
              <label for="telephone">
                <i class="fas fa-phone me-2"></i> Téléphone
              </label>
            </div>

            <div class="form-floating mb-4">
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
                  {{ expedition.colis.code_colis }}
                </option>
              </select>
              <label for="expeditionId">
                <i class="fas fa-truck me-2"></i> Expédition
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="text"
                class="form-control readonly-input"
                :value="authStore.utilisateurNom"
                readonly
              />
              <label> <i class="fas fa-user me-2"></i> Utilisateur </label>
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
            <i class="fas fa-save me-2"></i> Ajouter Livraison
          </button>
        </div>
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
  utilisateurId: authStore.utilisateurId,
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
      toast.error('Cette expédition a déjà une livraison enregistrée .')
    }
  } catch (error) {
    console.error('Cette expédition a déjà une livraison enregistrée :', error)
    toast.error('Cette expédition a déjà une livraison enregistrée.')
  }
}

const cancelAdd = () => {
  toast.info('Ajout de livraison annulé.')
  router.push('/delivery')
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
</style>
