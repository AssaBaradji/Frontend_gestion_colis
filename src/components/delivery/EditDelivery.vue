<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold" style="color: #3fb59e">
      Modifier la Livraison
    </h1>
    <div class="p-4 bg-light rounded shadow-sm">
      <form @submit.prevent="updateDelivery">
        <!-- Champs similaires à AddDelivery.vue avec `v-model` lié à `delivery` -->
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="nom" class="form-label fw-bold text-primary"
                >Nom :</label
              >
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
              <label for="prenom" class="form-label fw-bold text-primary"
                >Prénom :</label
              >
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
                >Date de Livraison :</label
              >
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
              <label for="telephone" class="form-label fw-bold text-primary"
                >Téléphone :</label
              >
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
              <label for="expeditionId" class="form-label fw-bold text-primary"
                >Expédition :</label
              >
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
              <label for="utilisateurId" class="form-label fw-bold text-primary"
                >Utilisateur :</label
              >
              <select
                id="utilisateurId"
                class="form-select"
                v-model="delivery.utilisateurId"
              >
                <option value="" disabled selected>
                  Choisissez un utilisateur
                </option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.nom }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 fw-bold mt-4">
          <i class="fas fa-save"></i> Enregistrer les modifications
        </button>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeliveryStore } from '@/store/deliveryStore.js'
import { useShipmentStore } from '@/store/shipmentStore.js' 
import { useUserStore } from '@/store/userStore.js'
import { useToast } from 'vue-toastification'

const deliveryStore = useDeliveryStore()
const shipmentStore = useShipmentStore() 
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const delivery = ref({})
const expeditions = ref([])
const users = ref([])

onMounted(async () => {
  const id = route.params.id
  try {
    delivery.value = deliveryStore.deliveryById(id)
    if (!delivery.value) router.push('/delivery')

    await shipmentStore.fetchShipments()
    await userStore.fetchUsers()
    expeditions.value = shipmentStore.shipments
    users.value = userStore.users
  } catch (error) {
    // toast.error('Erreur lors du chargement des données.')
  }
})

const updateDelivery = async () => {
  try {
    await deliveryStore.updateDelivery(delivery.value)
    router.push('/delivery')
    // toast.success('Livraison modifiée avec succès !')
  } catch (error) {
    // toast.error('Erreur lors de la modification de la livraison.')
  }
}
</script>
  
  <style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}
</style>
  