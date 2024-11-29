<template>
    <div class="container mt-5">
      <h1 class="mb-4 text-center fw-bold title-margin" style="color: #3fb59e">
        Liste des Méthodes de Paiement
      </h1>
  
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="input-group" style="max-inline-size: 300px">
          <span class="input-group-text" id="search-addon">
            <i class="fas fa-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="Rechercher une méthode de paiement..."
            aria-label="Search"
            aria-describedby="search-addon"
          />
        </div>
  
        <router-link
          to="/payment-methods/add"
          class="btn btn-add fw-bold"
          style="color: white"
        >
          <i class="fas fa-plus"></i> Ajouter Méthode de Paiement
        </router-link>
      </div>
  
      <div v-if="paginatedMethods.length === 0" class="text-center">
        <p>Aucune méthode de paiement trouvée.</p>
      </div>
  
      <div v-else>
        <div class="row">
          <div
            class="col-md-4 mb-4"
            v-for="method in paginatedMethods"
            :key="method.id"
          >
            <div class="card shadow-sm h-100">
              <div class="card-body d-flex flex-column align-items-center">
                <div class="icon-container mb-3">
                  <i class="fas fa-credit-card fa-2x"></i>
                </div>
                <h5 class="card-title">{{ method.nom }}</h5>
                <div class="d-flex justify-content-between mt-3 w-100">
                  <button
                    class="btn btn-sm btn-outline-info me-2"
                    @click="showMethodDetails(method)"
                  >
                    <i class="fas fa-eye"></i> Détails
                  </button>
                  <router-link
                    :to="'/payment-methods/edit/' + method.id"
                    class="btn btn-sm btn-outline-secondary me-2"
                  >
                    <i class="fas fa-edit"></i> Modifier
                  </router-link>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="confirmDeleteMethod(method.id)"
                  >
                    <i class="fas fa-trash"></i> Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
   
      <div class="d-flex justify-content-center mt-4">
        <button
          class="btn btn-outline-secondary"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <i class="fas fa-chevron-left"></i>Précédent
        </button>
        <span class="mx-3">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        <button
          class="btn btn-outline-secondary"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Suivant<i class="fas fa-chevron-right"></i>
        </button>
      </div>
  
     
      <div
        class="modal fade"
        id="paymentMethodModal"
        ref="paymentMethodModal"
        tabindex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        role="dialog"
        aria-labelledby="modalTitleId"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="text-center fw-bold" id="modalTitleId">
                Détails de la Méthode de Paiement
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">
              <form v-if="selectedMethod" class="payment-method-details-form">
                <div class="mb-3">
                  <label class="form-label">Nom:</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="selectedMethod.nom"
                    readonly
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">ID:</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="selectedMethod.id"
                    readonly
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Utilisateur:</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="
                      selectedMethod.utilisateur
                        ? selectedMethod.utilisateur.nom
                        : 'Non attribué'
                    "
                    readonly
                  />
                </div>
              </form>
              <p v-else>Chargement...</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary w-100"
                data-bs-dismiss="modal"
                @click="closeModal"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { usePaymentMethodStore } from '@/store/paymentMethodStore.js';
  import { useUserStore } from '@/store/userStore.js';
  import { useToast } from 'vue-toastification';
  import { Modal } from 'bootstrap';
  
  const toast = useToast();
  const paymentMethodStore = usePaymentMethodStore();
  const userStore = useUserStore();
  
  const paymentMethodModal = ref(null);
  let bootstrapModalInstance = null; 
  const selectedMethod = ref(null);
  const searchQuery = ref('');
  const sortBy = ref('id'); 
  const sortOrder = ref('asc'); 
  
  
  const currentPage = ref(1);
  const pageSize = ref(6);
  
  onMounted(async () => {
    try {
      await paymentMethodStore.fetchPaymentMethods();
      await userStore.fetchUsers();
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
      toast.error('Erreur lors du chargement des données.');
    }
  });
  
  const showMethodDetails = (method) => {
    const utilisateur = userStore.users.find((user) => user.id === method.utilisateurId);
    selectedMethod.value = { ...method, utilisateur };
  
    if (!bootstrapModalInstance) {
      bootstrapModalInstance = new Modal(paymentMethodModal.value);
    }
    bootstrapModalInstance.show();
  };
  
  const closeModal = () => {
    if (bootstrapModalInstance) {
      bootstrapModalInstance.hide();
    }
    selectedMethod.value = null;
  };
  
  const mappedMethods = computed(() => {
    return paymentMethodStore.paymentMethods.map((method) => ({
      ...method,
      utilisateur: userStore.users.find((user) => user.id === method.utilisateurId),
    }));
  });
  
  const sortedAndFilteredMethods = computed(() => {
    const filtered = mappedMethods.value.filter((method) =>
      method.nom?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  
    return filtered.sort((a, b) => {
      const fieldA = a[sortBy.value]?.toLowerCase?.() || a[sortBy.value] || '';
      const fieldB = b[sortBy.value]?.toLowerCase?.() || b[sortBy.value] || '';
      if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  });
  
  const paginatedMethods = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedAndFilteredMethods.value.slice(start, end);
  });
  
  const totalPages = computed(() => {
    return Math.ceil(sortedAndFilteredMethods.value.length / pageSize.value);
  });
  
  const toggleSortOrder = (field) => {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy.value = field;
      sortOrder.value = 'asc';
    }
  };
  
  const confirmDeleteMethod = async (id) => {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer cette méthode de paiement ?'
    );
    if (confirmed) {
      deleteMethod(id);
    } else {
      toast.warning('Suppression Annulé!');
    }
  };
  
  const deleteMethod = async (id) => {
    const result = await paymentMethodStore.deletePaymentMethod(id);
  
    if (result.success) {
      toast.success('Méthode de paiement supprimée avec succès !');
    } else {
      console.error(
        'Erreur lors de la suppression de la méthode de paiement :',
        result.error
      );
      toast.error("Impossible de supprimer cette methode est lié à un paiement.");;
    }
  };
  </script>
  
  <style scoped>
  h1 {
    color: #3fb59e;
    margin-block-start: 80px;
  }
  
  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    transition: box-shadow 0.3s ease;
    text-align: center;
  }
  
  .card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .icon-container {
    font-size: 1.8rem;
    color: #3fb59e;
  }
  
  .btn-add {
    background-color: #3fb59e;
    border-color: #3fb59e;
    color: white;
  }
  
  .modal-content {
    max-inline-size: 500px;
    margin: auto;
    border: 2px solid #3fb59e;
  }
  
  .modal-header {
    background-color: #3fb59e;
    color: white;
    border-start-start-radius: 10px;
    border-start-end-radius: 10px;
  }
  
  .modal-footer {
    border: none;
  }
  
  .btn-secondary {
    background-color: #3fb59e;
    border: none;
  }
  
  .btn-secondary:hover {
    background-color: #36a290;
  }
  </style>
  