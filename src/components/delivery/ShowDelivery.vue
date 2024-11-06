<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold" style="color: #3fb59e">
      Détails de la Livraison
    </h1>
    <div class="p-4 bg-light rounded shadow-sm">
      <p><strong>Nom :</strong> {{ delivery.nom }}</p>
      <p><strong>Prénom :</strong> {{ delivery.prenom }}</p>
      <p><strong>Date de Livraison :</strong> {{ delivery.date_livraison }}</p>
      <p><strong>Téléphone :</strong> {{ delivery.telephone }}</p>
      <p>
        <strong>Expédition :</strong>
        {{ delivery.expedition ? delivery.expedition.nom_destinataire : 'N/A' }}
      </p>
      <p>
        <strong>Utilisateur :</strong>
        {{ delivery.utilisateur ? delivery.utilisateur.nom : 'N/A' }}
      </p>
      <router-link to="/deliveries" class="btn btn-primary mt-4"
        >Retour</router-link
      >
    </div>
  </div>
</template>
  
  <script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDeliveryStore } from '@/store/deliveryStore.js'

const deliveryStore = useDeliveryStore()
const route = useRoute()
const delivery = computed(() => deliveryStore.deliveryById(route.params.id))

onMounted(() => {
  if (!delivery.value) {
    router.push('/delivery')
  }
})
</script>
  
  <style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}
</style>
  