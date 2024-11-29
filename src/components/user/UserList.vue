<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center fw-bold title-margin" style="color: #3fb59e">
      Liste des Utilisateurs
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
          placeholder="Rechercher un utilisateur..."
        />
      </div>

      <router-link
        to="/users/add"
        class="btn btn- fw-bold"
        style="background-color: #3fb59e; color: white"
      >
        <i class="fas fa-plus"></i> Ajouter Utilisateur
      </router-link>
    </div>

    <div v-if="paginatedUsers.length === 0" class="text-center">
      <p>Aucun utilisateur trouvé.</p>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th @click="toggleSortOrder('id')" style="cursor: pointer">
            ID
            <span v-if="sortBy === 'id'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th @click="toggleSortOrder('nom')" style="cursor: pointer">
            Nom
            <span v-if="sortBy === 'nom'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th @click="toggleSortOrder('email')" style="cursor: pointer">
            Email
            <span v-if="sortBy === 'email'">
              <i
                :class="
                  sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
            </span>
          </th>
          <th scope="col">Rôle</th>
          <th scope="col">Statut</th>
          <th scope="col" class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.nom }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>

          <td class="text-center">
            <input
              type="checkbox"
              class="form-check-input"
              :checked="user.statut === 'Actif'"
              disabled
            />
          </td>

          <td class="text-center">
            <router-link
              :to="'/users/show/' + user.id"
              class="btn btn-sm btn-outline-info me-2"
            >
              <i class="fas fa-eye"></i>
            </router-link>
            <router-link
              :to="'/users/edit/' + user.id"
              class="btn btn-sm btn-outline-secondary me-2"
            >
              <i class="fas fa-edit"></i>
            </router-link>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="() => deleteUser(user.id)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-center mt-4">
      <button
        class="btn btn-outline-secondary"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <i class="fas fa-chevron-left"></i> Précédent
      </button>
      <span class="mx-3">Page {{ currentPage }} sur {{ totalPages }}</span>
      <button
        class="btn btn-outline-secondary"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Suivant <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/store/userStore'
import { useToast } from 'vue-toastification'

const toast = useToast()
const store = useUserStore()
const users = computed(() => store.users)
const searchQuery = ref('')

const sortBy = ref('id')
const sortOrder = ref('asc')

const currentPage = ref(1)
const pageSize = ref(5)

onMounted(async () => {
  await store.fetchUsers()
})

const toggleSortOrder = field => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const sortedUsers = computed(() => {
  const filtered = users.value.filter(
    user =>
      user.nom?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  return filtered.sort((a, b) => {
    const fieldA = a[sortBy.value]?.toLowerCase?.() || a[sortBy.value] || ''
    const fieldB = b[sortBy.value]?.toLowerCase?.() || b[sortBy.value] || ''
    if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(sortedUsers.value.length / pageSize.value)
})

const deleteUser = async id => {
  console.log("ID de l'utilisateur à supprimer :", id)
  try {
    if (confirm('etes vous sur de vouloir supprimé cet utilisateur ?')) {
      await store.deleteUser(id)
      toast.success('Utilisateur supprimé avec succès.')
      await store.fetchUsers()
    } else {
      toast.warning('Suppression Annulé!')
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error)
    toast.error("Erreur lors de la suppression de l'utilisateur.")
  }
}
</script>

<style scoped>
.text-primary {
  color: #0d6efd !important;
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
.title-margin {
  margin-block-start: 80px;
}
.search-icon {
  background-color: #e0e0e0;
}
.form-check-input {
  accent-color: #3fb59e;
  border: 1px solid black;
}
</style>
