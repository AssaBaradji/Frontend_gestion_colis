<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div v-if="isLoading" class="text-center">
      <i
        class="fas fa-spinner fa-spin fa-2x"
        :style="{ color: primaryColor }"
      ></i>
    </div>

    <div
      v-else
      class="p-4 bg-light rounded shadow-sm form-container"
      style="max-inline-size: 800px; inline-size: 100%"
    >
      <h3 class="text-center mb-4" :style="{ color: primaryColor }">
        {{ t('parcels.editTitle') }}
      </h3>
      <form @submit.prevent="updateParcel">
        <div class="row">
          <div class="col-md-6">
            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-box"></i>&nbsp;{{ t('parcels.editForm.code') }}
              </span>
              <input
                type="text"
                class="form-control"
                v-model="parcel.code_colis"
                placeholder="Code du colis"
                :style="{ borderColor: primaryColor }"
                required
              />
            </div>

            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-dollar-sign"></i>&nbsp;{{
                  t('parcels.editForm.price')
                }}
              </span>
              <input
                type="number"
                class="form-control"
                v-model="parcel.prix"
                placeholder="Prix"
                step="0.01"
                :style="{ borderColor: primaryColor }"
                required
              />
            </div>

            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-calendar-alt"></i>&nbsp;{{
                  t('parcels.editForm.date')
                }}
              </span>
              <input
                type="date"
                class="form-control"
                v-model="parcel.date_enregistrement"
                :style="{ borderColor: primaryColor }"
                required
              />
            </div>

            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-user"></i>&nbsp;{{
                  t('parcels.editForm.user')
                }}
              </span>
              <select
                class="form-select"
                v-model="parcel.utilisateurId"
                :style="{ borderColor: primaryColor }"
                required
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

          <div class="col-md-6">
            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-align-left"></i>&nbsp;{{
                  t('parcels.editForm.description')
                }}
              </span>
              <textarea
                class="form-control"
                v-model="parcel.description"
                placeholder="Description"
                :style="{ borderColor: primaryColor }"
                required
              ></textarea>
            </div>

            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-map-marker-alt"></i>&nbsp;{{
                  t('parcels.editForm.location')
                }}
              </span>
              <input
                type="text"
                class="form-control"
                v-model="parcel.emplacement_colis"
                placeholder="Emplacement"
                :style="{ borderColor: primaryColor }"
                required
              />
            </div>

            <div class="input-group mb-4">
              <span
                class="input-group-text"
                :style="{ backgroundColor: primaryColor, color: textColor }"
              >
                <i class="fas fa-tags"></i>&nbsp;{{
                  t('parcels.editForm.type')
                }}
              </span>
              <select
                class="form-select"
                v-model="parcel.typeId"
                :style="{ borderColor: primaryColor }"
                required
              >
                <option value="" disabled selected>
                  Choisissez un type de colis
                </option>
                <option v-for="type in types" :key="type.id" :value="type.id">
                  {{ type.nom }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <button
          class="btn w-100 fw-bold mt-4"
          type="submit"
          :style="{ backgroundColor: primaryColor, color: textColor }"
        >
          <i class="fas fa-save"></i> {{ t('parcels.editForm.save') }}
        </button>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
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
const isLoading = ref(true)

const primaryColor = '#3fb59e'
const textColor = '#FFFFFF'

onMounted(async () => {
  try {
    await parcelStore.fetchParcels()
    await typeColisStore.fetchTypesColis()
    await userStore.fetchUsers()

    parcel.value = parcelStore.parcelById(route.params.id)
    users.value = userStore.users
    types.value = typeColisStore.types

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
</script>
  
  <style scoped>
.container {
  min-block-size: 100vh;
}

.form-container {
  max-inline-size: 800px;
}

.input-group-text {
  min-inline-size: 150px;
}
</style>
  