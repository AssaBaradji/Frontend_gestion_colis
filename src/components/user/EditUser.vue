   <template>
  <div class="container mt-5">
    <div v-if="isLoading" class="text-center">
      <i class="fas fa-spinner fa-spin fa-2x"></i>
    </div>

    <div v-else class="p-4 bg-light rounded shadow-sm">
      <h3 :style="{ color: primaryColor }">{{ t('users.editTitle') }}</h3>
      <form @submit.prevent="updateUser">
        <div class="input-group mb-4">
          <span
            class="input-group-text"
            :style="{ backgroundColor: primaryColor, color: textColor }"
          >
            <i class="fas fa-user"></i>&nbsp;{{ t('users.editForm.name') }}
          </span>
          <input
            type="text"
            class="form-control"
            v-model="user.nom"
            placeholder="Nom de l'utilisateur"
            :style="{ borderColor: primaryColor }"
            required
          />
        </div>

        <div class="input-group mb-4">
          <span
            class="input-group-text"
            :style="{ backgroundColor: primaryColor, color: textColor }"
          >
            <i class="fas fa-envelope"></i>&nbsp;{{ t('users.editForm.email') }}
          </span>
          <input
            type="email"
            class="form-control"
            v-model="user.email"
            placeholder="Adresse email"
            :style="{ borderColor: primaryColor }"
            required
          />
        </div>

        <div class="input-group mb-4">
          <span
            class="input-group-text"
            :style="{ backgroundColor: primaryColor, color: textColor }"
          >
            <i class="fas fa-lock"></i>&nbsp;{{ t('users.editForm.password') }}
          </span>
          <input
            type="password"
            class="form-control"
            v-model="user.mot_de_passe"
            placeholder="Mot de passe"
            :style="{ borderColor: primaryColor }"
            required
          />
        </div>

        <div class="input-group mb-4">
          <span
            class="input-group-text"
            :style="{ backgroundColor: primaryColor, color: textColor }"
          >
            <i class="fas fa-user-tag"></i>&nbsp;{{ t('users.editForm.role') }}
          </span>
          <select
            class="form-select"
            v-model="user.role"
            :style="{ borderColor: primaryColor }"
            required
          >
            <option value="" disabled selected>Choisissez un rôle</option>
            <option value="Admis">Admis</option>
            <option value="Agent">Agent</option>
          </select>
        </div>

        <div class="form-check mb-4">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="user.statut"
            id="statutCheck"
          />
          <label
            class="form-check-label"
            for="statutCheck"
            :style="{ color: primaryColor }"
          >
            {{ t('users.editForm.activeStatus') }}
          </label>
        </div>

        <button
          class="btn w-100 fw-bold"
          type="submit"
          :style="{ backgroundColor: primaryColor, color: textColor }"
        >
          <i class="fas fa-save"></i> {{ t('users.editForm.save') }}
        </button>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useUserStore()
const router = useRouter()
const route = useRoute()
const user = ref({})
const isLoading = ref(true)


const primaryColor = '#007BFF' 
const textColor = '#FFFFFF' 

const loadUser = async () => {
  try {
    user.value = await store.userById(route.params.id)
    if (!user.value) {
      router.push('/users')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUser()
})

const updateUser = async () => {
  try {
    await store.updateUser(user.value)
    alert('Utilisateur mis à jour avec succès !')
    router.push('/users')
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
  }
}
</script>
  
  <style scoped>

</style>
  
  
  