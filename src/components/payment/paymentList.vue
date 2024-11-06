<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center display-4 fw-bold" style="color: #3fb59e">
      Liste des Paiements
    </h1>

    <div class="text-end mb-4">
      <router-link
        to="/payments/add"
        class="btn btn- fw-bold"
        style="background-color: #3fb59e; color: white"
      >
        <i class="fas fa-plus"></i> Ajouter Paiement
      </router-link>
    </div>

    <div v-if="loading" class="text-center">
      <i class="fas fa-spinner fa-spin fa-2x" style="color: #3fb59e"></i>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Montant</th>
          <th>Date Paiement</th>
          <th>Moment Paiement</th>
          <th>Utilisateur</th>
          <th>Colis</th>
          <th>Méthode de Paiement</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in payments" :key="payment.id">
          <td>{{ payment.id }}</td>
          <td>{{ payment.montant }}</td>
          <td>{{ payment.date_paiement }}</td>
          <td>{{ payment.moment_paiement }}</td>
          <td>{{ payment.utilisateur ? payment.utilisateur.nom : 'N/A' }}</td>
          <td>{{ payment.colis ? payment.colis.code_colis : 'N/A' }}</td>
          <td>
            {{ payment.methodePaiement ? payment.methodePaiement.nom : 'N/A' }}
          </td>
          <td class="text-center">
            <router-link
              :to="'/payments/show/' + payment.id"
              class="btn btn-sm btn-outline-info me-2"
            >
              <i class="fas fa-eye"></i>
            </router-link>
            <router-link
              :to="'/payments/edit/' + payment.id"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              <i class="fas fa-edit"></i>
            </router-link>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deletePayment(payment.id)"
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
import { usePaymentStore } from '@/store/paymentStore.js'
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'
import { useToast } from 'vue-toastification'

const paymentStore = usePaymentStore()
const paymentMethodStore = usePaymentMethodStore()
const { payments, loading, fetchPayments, deletePayment } = paymentStore
const toast = useToast()

const methods = ref([])

onMounted(async () => {
  try {
    await fetchPayments()
    await paymentMethodStore.fetchPaymentMethods()
    methods.value = paymentMethodStore.methods
  } catch (error) {
    toast.error(
      'Erreur lors du chargement des paiements ou des méthodes de paiement.'
    )
  }
})
</script>
  
  <style scoped>
h1 {
  color: #3fb59e;
  margin-block-start: 80px;
}

.btn- {
  background-color: #3fb59e;
  border-color: #3fb59e;
}

.btn-outline-info {
  border-color: #17a2b8;
  color: #17a2b8;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}
</style>
  