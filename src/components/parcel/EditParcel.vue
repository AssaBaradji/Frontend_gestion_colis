<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div v-if="isLoading" class="text-center">
      <i
        class="fas fa-spinner fa-spin fa-3x"
        :style="{ color: primaryColor }"
      ></i>
    </div>

    <div v-else class="p-5 bg-white rounded-4 shadow-lg form-container">
      <h3 class="text-center mb-4 fw-bold" :style="{ color: primaryColor }">
        {{ t('parcels.editTitle') }}
      </h3>
      <form @submit.prevent="updateParcel">
        <div class="row gx-5">
          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="code_colis"
                class="form-control"
                v-model="parcel.code_colis"
                placeholder="Code du colis"
                required
              />
              <label for="code_colis">
                <i class="fas fa-box me-2"></i>{{ t('parcels.editForm.code') }}
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="number"
                id="prix"
                class="form-control"
                v-model="parcel.prix"
                placeholder="Prix"
                step="0.01"
                required
              />
              <label for="prix">
                <i class="fas fa-dollar-sign me-2"></i
                >{{ t('parcels.editForm.price') }}
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="date"
                id="date_enregistrement"
                class="form-control"
                v-model="parcel.date_enregistrement"
                required
              />
              <label for="date_enregistrement">
                <i class="fas fa-calendar-alt me-2"></i
                >{{ t('parcels.editForm.date') }}
              </label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-4">
              <input
                type="text"
                id="emplacement_colis"
                class="form-control"
                v-model="parcel.emplacement_colis"
                placeholder="Emplacement"
                required
              />
              <label for="emplacement_colis">
                <i class="fas fa-map-marker-alt me-2"></i
                >{{ t('parcels.editForm.location') }}
              </label>
            </div>

            <div class="form-floating mb-4">
              <select
                id="typeId"
                class="form-select"
                v-model="parcel.typeId"
                required
              >
                <option value="" disabled selected>
                  Choisissez un type de colis
                </option>
                <option v-for="type in types" :key="type.id" :value="type.id">
                  {{ type.nom }}
                </option>
              </select>
              <label for="typeId">
                <i class="fas fa-tags me-2"></i>{{ t('parcels.editForm.type') }}
              </label>
            </div>

            <div class="form-floating mb-4">
              <input
                type="text"
                id="utilisateur"
                class="form-control text-end readonly-input"
                :value="loadedUser.nom"
                placeholder="Utilisateur"
                readonly
              />
              <label for="utilisateur">
                <i class="fas fa-user me-2"></i>{{ t('parcels.editForm.user') }}
              </label>
            </div>
          </div>
        </div>

        <div class="form-floating mb-4">
          <textarea
            id="description"
            class="form-control"
            v-model="parcel.description"
            placeholder="Description"
            style="block-size: 100px"
            required
          ></textarea>
          <label for="description">
            <i class="fas fa-align-left me-2"></i
            >{{ t('parcels.editForm.description') }}
          </label>
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
            :style="{ backgroundColor: primaryColor, color: textColor }"
          >
            <i class="fas fa-save me-2"></i>{{ t('parcels.editForm.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useParcelStore } from '@/store/parcelStore'
import { useUserStore } from '@/store/userStore'
import { useTypeColisStore } from '@/store/parcelTypeStore'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const parcelStore = useParcelStore()
const userStore = useUserStore()
const typeColisStore = useTypeColisStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const parcel = ref({})
const users = ref([])
const types = ref([])
const loadedUser = ref({})
const isLoading = ref(true)

const primaryColor = '#3fb59e'
const textColor = '#FFFFFF'

onMounted(async () => {
  try {
    await parcelStore.fetchParcels()
    await typeColisStore.fetchTypesColis()
    await userStore.fetchUsers()

    parcel.value = parcelStore.parcelById(route.params.id)
    types.value = typeColisStore.types
    loadedUser.value =
      userStore.users.find(user => user.id === parcel.value.utilisateurId) || {}

    if (!parcel.value) {
      router.push('/parcels')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    toast.error('Erreur lors du chargement des données.')
  } finally {
    isLoading.value = false
  }
})

const updateParcel = async () => {
  try {
    await parcelStore.updateParcel(parcel.value)
    toast.success('Colis mis à jour avec succès !')
    router.push('/parcels')
  } catch (error) {
    console.error('Erreur lors de la mise à jour du colis :', error)
    toast.error('Erreur lors de la mise à jour du colis.')
  }
}

const cancelEdit = () => {
  toast.info('Modification annulée.')
  router.push('/parcels')
}
</script>
  
  <style scoped>
.container {
  min-block-size: 100vh;
}

.form-container {
  max-inline-size: 900px;
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

.readonly-input {
  background-color: #f8f9fa;
  color: #6c757d;
  font-weight: bold;
}

.form-floating .readonly-input:focus {
  border-color: #ddd !important;
  box-shadow: none;
}

.w-45 {
  inline-size: 45%;
}
</style>
  