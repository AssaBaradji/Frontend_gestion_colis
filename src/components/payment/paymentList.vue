<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold title-margin" style="color: #3fb59e">
      Liste des Paiements
    </h1>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="input-group" style="max-inline-size: 300px">
        <span class="input-group-text search-icon">
          <i class="fas fa-search"></i>
        </span>
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Rechercher un paiement..."
        />
      </div>

      <router-link
        to="/payments/add"
        class="btn btn- fw-bold"
        style="background-color: #3fb59e; color: white"
      >
        <i class="fas fa-plus"></i> Ajouter Paiement
      </router-link>
    </div>

    <div v-if="filteredPayments.length === 0" class="text-center">
      <p>Aucun paiement trouvé.</p>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Montant</th>
          <th scope="col">Date Paiement</th>
          <th scope="col">Moment Paiement</th>
          <th scope="col">Utilisateur</th>
          <th scope="col">Colis</th>
          <th scope="col">Méthode de Paiement</th>
          <th scope="col" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in filteredPayments" :key="payment.id">
          <td>{{ payment.id }}</td>
          <td>{{ payment.montant }}</td>
          <td>{{ payment.date_paiement }}</td>
          <td>{{ payment.moment_paiement }}</td>
          <td>{{ payment.utilisateur ? payment.utilisateur.nom : 'N/A' }}</td>
          <td>{{ payment.colis ? payment.colis.code_colis : 'N/A' }}</td>
          <td>{{ payment.methodePaiement ? payment.methodePaiement.nom : 'N/A' }}</td>
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
              @click="confirmDelete(payment.id)"
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
import { computed, onMounted, ref } from 'vue'
import { usePaymentStore } from '@/store/paymentStore.js'
import { useToast } from 'vue-toastification'

const toast = useToast()
const store = usePaymentStore()
const payments = computed(() => store.payments)
const searchQuery = ref('')

onMounted(async () => {
  const { success } = await store.fetchPayments()
  if (success) {
  } else {
    toast.error('Erreur lors du chargement des paiements.')
  }
})

const filteredPayments = computed(() =>
  payments.value.filter(
    payment =>
      (payment.utilisateur?.nom || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (payment.methodePaiement?.nom || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      payment.montant.toString().includes(searchQuery.value)
  )
)

const confirmDelete = async id => {
  const confirmation = confirm("Voulez-vous vraiment supprimer ce paiement ?")
  if (confirmation) {
    await deletePayment(id)
  }
}

const deletePayment = async id => {
  const { success } = await store.deletePayment(id)
  if (success) {
    toast.success('Paiement supprimé avec succès !')
    await store.fetchPayments()
  } else {
    toast.error("Erreur lors de la suppression du paiement.")
  }
}
</script>

<style scoped>
.title-margin {
  margin-block-start: 80px;
}

.btn- {
  background-color: #3fb59e;
  border-color: #3fb59e;
}

.search-icon {
  background-color: #e0e0e0;
}

.table-bordered thead {
  background-color: #3fb59e;
  color: white;
}

.table-bordered th {
  font-weight: bold;
  padding: 12px;
}

.table-hover tbody tr:hover {
  background-color: #f9f9f9;
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
