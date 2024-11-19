<template>
  <div class="forbidden">
    <h1>403 - Accès interdit</h1>
    <p>
      Vous n'avez pas les permissions nécessaires pour accéder à cette page.
    </p>
    <router-link to="/users">Retour à la Liste</router-link>
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
