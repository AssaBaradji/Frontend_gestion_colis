<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="container mt-5">
    <div class="text-section p-4 mb-5 rounded">
      <h1 class="display-4 fw-bold mb-4 text-gradient">
        {{ t('home_page.welcome') }}
      </h1>
      <p class="lead mb-4">{{ t('home_page.description') }}</p>
    </div>

    <div class="row text-center expanded-cards">
      <div class="col-md-4 mb-4">
        <div class="info-card p-4">
          <i class="fas fa-box fa-3x mb-3" style="color: #3fb59e"></i>
          <h5>Gestion des Colis</h5>
          <p>Suivez et gérez vos colis avec simplicité et efficacité.</p>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="info-card p-4">
          <i class="fas fa-truck-moving fa-3x mb-3" style="color: #3fb59e"></i>
          <h5>Expéditions Rapides</h5>
          <p>Bénéficiez d’un service d’expédition rapide et fiable.</p>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="info-card p-4">
          <i class="fas fa-shipping-fast fa-3x mb-3" style="color: #3fb59e"></i>
          <h5>Livraisons Sécurisées</h5>
          <p>
            Profitez d'une livraison sûre pour vos produits et marchandises.
          </p>
        </div>
      </div>
    </div>
  </div>

  <footer class="footer mt-5">
    <p>&copy; 2024 SécurXpress. Tous droits réservés.</p>
  </footer>
</template>

<style scoped>
.text-section {
  background: #ffffff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  margin-block-start: 100px;
  padding: 30px;
}

.text-section:hover {
  transform: translateY(-10px);
}

.text-gradient {
  background: linear-gradient(45deg, #3fb59e, #36a290);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.expanded-cards {
  max-inline-size: 100%;
  padding: 0 20px;
}

.info-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card i {
  color: #3fb59e;
}

.footer {
  position: relative;
  inline-size: 100%;
  background-color: #3fb59e;
  color: #ffffff;
  text-align: center;
  padding: 20px 0;
}

.footer p {
  margin: 0;
  font-size: 0.9rem;
}
</style>
