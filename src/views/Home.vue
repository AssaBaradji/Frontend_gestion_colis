<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="container">
    <div class="text-center mt-5 mb-5">
      <h1 class="display-4 fw-bold mb-4">{{ t('home_page.welcome') }}</h1>
      <p class="lead mb-5">{{ t('home_page.description') }}</p>
      <div class="row mt-5">
        <div class="col-md-4 mb-4">
          <img
            src="../assets/images/livraison.avif"
            class="img-fluid img-large rounded"
            alt="Utilisateurs"
          />
        </div>

        <div class="col-md-4 mb-4">
          <img
            src="../assets/images/expedition.jpg"
            class="img-fluid img-milieu rounded"
            alt="Expéditions"
          />
        </div>

        <div class="col-md-4 mb-4">
          <img
            src="../assets/images/colis.jpg"
            class="img-fluid img-large rounded"
            alt="Paiements"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container h1 {
  margin-block-start: 80px;
}

.img-fluid {
  max-block-size: 200px;
  object-fit: cover;
}

.img-large {
  max-block-size: 600px;
}

.img-milieu {
  max-block-size: 500px;
}
</style>

 