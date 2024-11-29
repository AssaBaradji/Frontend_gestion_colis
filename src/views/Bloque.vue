<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-75"
  >
    <div class="p-5 bg-white rounded-4 shadow-lg forbidden-container">
      <h1 class="text-danger mb-4">403 - Accès interdit</h1>
      <p class="text-muted mb-4">
        Votre compte est bloqué. Veuillez contacter l'administrateur.
      </p>
      <router-link
        to="/Login"
        class="btn btn-outline-secondary fw-bold shadow-sm"
      >
        Retour à la connexion
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  min-block-size: 90vh;
  background-color: #f8f9fa;
}

.forbidden-container {
  max-inline-size: 500px;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
}

p {
  font-size: 1rem;
  color: #6c757d;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #36a290;
  color: #ffffff;
}
</style>
