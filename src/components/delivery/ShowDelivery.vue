<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Détails de la Livraison
    </h1>

    <div class="p-4 bg-light rounded shadow-sm delivery-details-form">
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Nom :</label>
            <input
              type="text"
              class="form-control"
              :value="delivery.nom"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Prénom :</label>
            <input
              type="text"
              class="form-control"
              :value="delivery.prenom"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Date de Livraison :</label>
            <input
              type="text"
              class="form-control"
              :value="delivery.date_livraison"
              readonly
            />
          </div>
        
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Expédition :</label>
            <input
              type="text"
              class="form-control"
              :value="delivery.expedition ? delivery.expedition.nom_destinataire : 'N/A'"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Utilisateur :</label>
            <input
              type="text"
              class="form-control"
              :value="delivery.utilisateur ? delivery.utilisateur.nom : 'N/A'"
              readonly
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Téléphone :</label>
            <input
              type="text"
              class="form-control"
              :value="delivery.telephone"
              readonly
            />
          </div>
        </div>
      </div>

      <router-link to="/delivery" class="btn btn-secondary w-100 mt-4">
        Retour à la liste des livraisons
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeliveryStore } from '@/store/deliveryStore.js'
import { useToast } from 'vue-toastification'

const deliveryStore = useDeliveryStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const delivery = computed(() => deliveryStore.deliveryById(route.params.id))

onMounted(() => {
  if (!delivery.value) {
    toast.error("Erreur lors du chargement de la livraison.")
    router.push('/delivery')
  }
})
</script>

<style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}

.delivery-details-form {
  max-inline-size: 800px;
  margin: auto;
  border: 2px solid #3fb59e;
  padding: 20px;
  background-color: #f7f9fa;
}

.delivery-details-form .form-label {
  color: #3fb59e;
  font-weight: bold;
}

.delivery-details-form .form-control {
  background-color: #f7f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #333;
  padding: 10px;
}

.btn-secondary {
  background-color: #3fb59e;
  border: none;
}

.btn-secondary:hover {
  background-color: #36a290;
}
</style>
