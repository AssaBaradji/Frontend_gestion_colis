<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="container">
    <div class="text-center mt-5 mb-5">
      <h1 class="display-4 fw-bold mb-4">{{ t('home_page.welcome') }}</h1>
      <p class="lead mb-5">{{ t('home_page.description') }}</p>
      <div class="row mt-5">
        <div class="col-md-4 mb-4">
          <img src="../assets/images/livraison.avif" class="img-fluid img-large rounded" alt="Utilisateurs" />
          <h5 class="mt-3">{{ t('home_page.user_management') }}</h5>
          <p>{{ t('home_page.user_management_description') }}</p>
          <router-link to="/users" class="btn btn-primary">{{ t('home_page.view_users') }}</router-link>
        </div>

        <div class="col-md-4 mb-4">
          <img src="../assets/images/expedition.jpg" class="img-fluid img-milieu rounded" alt="Expéditions" />
          <h5 class="mt-3">{{ t('home_page.expedition_management') }}</h5>
          <p>{{ t('home_page.expedition_management_description') }}</p>
          <router-link to="/expeditions" class="btn btn-primary">{{ t('home_page.view_expeditions') }}</router-link>
        </div>

        <div class="col-md-4 mb-4">
          <img src="../assets/images/colis.jpg" class="img-fluid img-large rounded" alt="Paiements" />
          <h5 class="mt-3">{{ t('home_page.payment_management') }}</h5>
          <p>{{ t('home_page.payment_management_description') }}</p>
          <router-link to="/payments" class="btn btn-primary">{{ t('home_page.view_payments') }}</router-link>
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

