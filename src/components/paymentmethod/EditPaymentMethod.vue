<!-- <template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Modifier la Méthode de Paiement
      </h3>
      <form @submit.prevent="updateMethod">
        <div class="row gx-3">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="method.nom"
                placeholder="Nom de la méthode de paiement"
                required
              />
              <label for="nom">
                <i class="fas fa-credit-card me-2"></i>Nom de la Méthode
              </label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="utilisateur"
                class="form-control"
                :value="connectedUser.nom"
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
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'
import { useAuthStore } from '@/store/authStore.js'
import { useToast } from 'vue-toastification'

const paymentMethodStore = usePaymentMethodStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const method = ref({
  nom: '',
  utilisateurId: authStore.currentUser?.id || null,
})
const connectedUser = ref(authStore.currentUser)

onMounted(async () => {
  try {
    const id = route.params.id
    await paymentMethodStore.fetchPaymentMethods()

    const existingMethod = paymentMethodStore.getPaymentMethodById(id)
    if (existingMethod) {
      method.value = { ...existingMethod }

      method.value.utilisateurId = connectedUser.value.id
    } else {
      toast.error('Méthode de paiement non trouvée.')
      router.push('/payment-methods')
    }
  } catch (error) {
    toast.error('Erreur lors du chargement des données.')
  }
})

const updateMethod = async () => {
  try {
    const result = await paymentMethodStore.updatePaymentMethod(method.value)
    if (result.success) {
      toast.success('Méthode de paiement modifiée avec succès !')
      router.push('/payment-methods')
    } else {
      throw new Error(result.error || 'Erreur inconnue lors de la modification')
    }
  } catch (error) {
    console.error(
      'Erreur lors de la modification de la méthode de paiement :',
      error
    )
    toast.error('Erreur lors de la modification de la méthode de paiement.')
  }
}

const cancelEdit = () => {
  toast.info('Modification annulée.')
  router.push('/payment-methods')
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
</style> -->
<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" style="color: #3fb59e">
        Modifier la Méthode de Paiement
      </h3>
      <form @submit.prevent="updateMethod">
        <div class="row gx-3">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="method.nom"
                placeholder="Nom de la méthode de paiement"
                required
              />
              <label for="nom">
                <i class="fas fa-credit-card me-2"></i>Nom de la Méthode
              </label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="utilisateur"
                class="form-control"
                :value="connectedUser ? connectedUser.nom : ''"
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
import { usePaymentMethodStore } from '@/store/paymentMethodStore.js'
import { useAuthStore } from '@/store/authStore.js'
import { useToast } from 'vue-toastification'

const paymentMethodStore = usePaymentMethodStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const method = ref({
  nom: '',
  utilisateurId: authStore.currentUser?.id || null,
})
const connectedUser = ref(authStore.currentUser)

onMounted(async () => {
  try {
    const id = route.params.id
    await paymentMethodStore.fetchPaymentMethods()

    const existingMethod = paymentMethodStore.getPaymentMethodById(id)
    if (existingMethod) {
      method.value = { ...existingMethod }
    } else {
      toast.error('Méthode de paiement non trouvée.')
      router.push('/payment-methods')
    }
  } catch (error) {
    toast.error('Erreur lors du chargement des données.')
  }
})

const updateMethod = async () => {
  if (!method.value.utilisateurId) {
    method.value.utilisateurId = connectedUser.value?.id || null
  }

  try {
    const result = await paymentMethodStore.updatePaymentMethod(method.value)
    if (result.success) {
      toast.success('Méthode de paiement modifiée avec succès !')
      router.push('/payment-methods')
    } else {
      throw new Error(result.error || 'Erreur inconnue lors de la modification')
    }
  } catch (error) {
    console.error('Erreur lors de la modification de la méthode de paiement :', error)
    toast.error('Erreur lors de la modification de la méthode de paiement.')
  }
}

const cancelEdit = () => {
  toast.info('Modification annulée.')
  router.push('/payment-methods')
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
