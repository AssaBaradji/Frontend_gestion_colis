<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold" style="color: #3fb59e">
      Liste des Méthodes de Paiement
    </h1>

    <div class="text-end mb-4">
      <router-link
        to="/payment-methods/add"
        class="btn btn-primary fw-bold"
        style="background-color: #3fb59e; color: white"
      >
        <i class="fas fa-plus"></i> Ajouter Méthode de Paiement
      </router-link>
    </div>

    <div v-if="paymentMethods.length === 0" class="text-center">
      <p>Aucune méthode de paiement trouvée.</p>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nom</th>
          <th scope="col" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="method in paymentMethods" :key="method.id">
          <td>{{ method.id }}</td>
          <td>{{ method.nom }}</td>
          <td class="text-center">
            <router-link
              :to="'/payment-methods/show/' + method.id"
              class="btn btn-sm btn-outline-info me-2"
            >
              <i class="fas fa-eye"></i>
            </router-link>
            <router-link
              :to="'/payment-methods/edit/' + method.id"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              <i class="fas fa-edit"></i>
            </router-link>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteMethod(method.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script setup>
import { onMounted, ref } from 'vue'
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const paymentMethodStore = usePaymentMethodStore()
const paymentMethods = ref([])

onMounted(async () => {
  try {
    await paymentMethodStore.fetchPaymentMethods()
    paymentMethods.value = paymentMethodStore.paymentMethods
  } catch (error) {
    toast.error('Erreur lors du chargement des méthodes de paiement.')
  }
})

const deleteMethod = async id => {
  try {
    await paymentMethodStore.deletePaymentMethod(id)
    toast.success('Méthode de paiement supprimée avec succès !')
  } catch (error) {
    toast.error('Erreur lors de la suppression de la méthode de paiement.')
  }
}
</script>
<style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}
</style>


  