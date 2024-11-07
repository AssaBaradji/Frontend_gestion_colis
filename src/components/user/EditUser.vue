<template>
      <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div v-if="isLoading" class="text-center">
          <i class="fas fa-spinner fa-spin fa-2x" :style="{ color: primaryColor }"></i>
        </div>
    
        <div v-else class="p-5 bg-white rounded-4 shadow-lg form-container">
          <h3 class="text-center mb-4 fw-bold" :style="{ color: primaryColor }">
            Modifier l'utilisateur
          </h3>
          <form @submit.prevent="updateUser">
            <div class="row gx-5">
              <div class="col-md-6">
                <div class="form-floating mb-4">
                  <input
                    type="text"
                    id="nom"
                    class="form-control"
                    v-model="user.nom"
                    placeholder="Nom de l'utilisateur"
                    required
                  />
                  <label for="nom">
                    <i class="fas fa-user me-2"></i>Nom
                  </label>
                </div>
    
                <div class="form-floating mb-4">
                  <input
                    type="email"
                    id="email"
                    class="form-control"
                    v-model="user.email"
                    placeholder="Adresse email"
                    required
                  />
                  <label for="email">
                    <i class="fas fa-envelope me-2"></i>Email
                  </label>
                </div>
              </div>
    
              <div class="col-md-6">
                <div class="form-floating mb-4">
                  <input
                    type="password"
                    id="mot_de_passe"
                    class="form-control"
                    v-model="user.mot_de_passe"
                    placeholder="Mot de passe"
                    required
                  />
                  <label for="mot_de_passe">
                    <i class="fas fa-lock me-2"></i>Mot de passe
                  </label>
                </div>
    
                <div class="form-floating mb-4">
                  <select
                    id="role"
                    class="form-select"
                    v-model="user.role"
                    required
                  >
                    <option value="" disabled selected>Choisissez un rôle</option>
                    <option value="Admis">Admis</option>
                    <option value="Agent">Agent</option>
                  </select>
                  <label for="role">
                    <i class="fas fa-user-tag me-2"></i>Rôle
                  </label>
                </div>
              </div>
            </div>
    
            <div class="form-check mb-4">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="user.statut"
                id="statutCheck"
              />
              <label class="form-check-label" for="statutCheck" :style="{ color: primaryColor }">
                Statut actif
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
                <i class="fas fa-save me-2"></i>Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
    
    <script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useUserStore } from '@/store/userStore'
    
    const store = useUserStore()
    const router = useRouter()
    const route = useRoute()
    const user = ref({})
    const isLoading = ref(true)
    
    const primaryColor = '#3fb59e'
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
        router.push('/users')
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
      }
    }
    
    const cancelEdit = () => {
      router.push('/users')
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
    
    .w-45 {
      inline-size: 45%;
    }
    </style>
    