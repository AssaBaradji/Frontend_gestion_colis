<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Modifier la Livraison
      </h3>
      <form @submit.prevent="updateDelivery">
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
              <label for="nom">
                <i class="fas fa-user me-2"></i>Nom
              </label>
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
                <i class="fas fa-user me-2"></i>Prénom
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
                <i class="fas fa-calendar-alt me-2"></i>Date de Livraison
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
                <i class="fas fa-phone me-2"></i>Téléphone
              </label>
            </div>

            <div class="form-floating mb-4">
              <select
                id="expeditionId"
                class="form-select"
                v-model="delivery.expeditionId"
                required
              >
                <option value="" disabled selected>Choisissez une expédition</option>
                <option
                  v-for="expedition in expeditions"
                  :key="expedition.id"
                  :value="expedition.id"
                >
                  {{ expedition.nom_destinataire }}
                </option>
              </select>
              <label for="expeditionId">
                <i class="fas fa-truck me-2"></i>Expédition
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="text"
                id="utilisateur"
                class="form-control"
                :value="authStore.utilisateurNom"
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
            @click="cancelEdit"
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
import { useRoute, useRouter } from 'vue-router'
import { useDeliveryStore } from '@/store/deliveryStore.js'
import { useShipmentStore } from '@/store/shipmentStore.js'
import { useAuthStore } from '@/store/authStore'
import { useToast } from 'vue-toastification'

const deliveryStore = useDeliveryStore()
const shipmentStore = useShipmentStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const delivery = ref({})
const expeditions = ref([])

onMounted(async () => {
  const id = route.params.id
  try {
    delivery.value = deliveryStore.deliveryById(id)
    if (!delivery.value) router.push('/delivery')

    await shipmentStore.fetchShipments()
    expeditions.value = shipmentStore.shipments
  } catch (error) {
    toast.error('Erreur lors du chargement des données.')
  }
})

const updateDelivery = async () => {
  try {
    await deliveryStore.updateDelivery(delivery.value)
    toast.success('Livraison modifiée avec succès !')
    router.push('/delivery')
  } catch (error) {
    toast.error('Erreur lors de la modification de la livraison.')
  }
}

const cancelEdit = () => {
  toast.info('Modification annulée.')
  router.push('/delivery')
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
</style>
