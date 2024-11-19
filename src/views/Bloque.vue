<template>
  <div class="forbidden">
    <h1>403 - Accès interdit</h1>
    <p>Votre compte est bloqué. Veuillez contacter l'administrateur.</p>
    <router-link to="/Login">Retour</router-link>
  </div>
</template>
  
  <script setup>
</script>
  
  <style scoped>
.forbidden {
  text-align: center;
  margin-block-start: 100px;
}
h1 {
  font-size: 2rem;
  color: #ff4d4f;
}
p {
  margin-block-start: 10px;
  color: #666;
}
</style>
  