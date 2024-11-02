<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const activeRoute = ref(route.path);

const setActiveRoute = (path) => {
  activeRoute.value = path;
};

const { locale } = useI18n();
const changeLanguage = (event) => {
  locale.value = event.target.value;
};
</script>

<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <nav class="container">
      <router-link
  class="navbar-brand d-flex align-items-center text-light"
  @click="setActiveRoute('/')"
  to="/"
>
  <i class="fas fa-utensils me-2"></i> {{ $t("app.title") }}
</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link
              to="/users"
              class="btn btn-outline-light me-2 font-weight-bold"
              :class="{ active: activeRoute.value === '/users' }"
              @click="setActiveRoute('/users')"
            >
              {{ $t("app.nav.users") }}
            </router-link>
          </li>

          <li class="nav-item dropdown">
            <button
              class="btn btn-outline-light me-2 font-weight-bold dropdown-toggle"
              :class="{ active: activeRoute.value === '/packages' }"
              aria-expanded="false"
              data-bs-toggle="dropdown"
            >
              {{ $t("app.nav.packages") }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <button
                  class="dropdown-item"
                  :class="{ active: activeRoute.value === '/packages' }"
                  @click="setActiveRoute('/packages'); router.push({ name: 'packages' })"
                >
                  {{ $t("app.nav.packages") }}
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item"
                  :class="{ active: activeRoute.value === '/package-types' }"
                  @click="setActiveRoute('/package-types'); router.push({ name: 'package-types' })"
                >
                  {{ $t("app.nav.packageTypes") }}
                </button>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <button
              class="btn btn-outline-light me-2 font-weight-bold"
              :class="{ active: activeRoute.value === '/shipments' }"
              @click="setActiveRoute('/shipments'); router.push({ name: 'shipments' })"
            >
              {{ $t("app.nav.shipments") }}
            </button>
          </li>

          <li class="nav-item dropdown">
            <button
              class="btn btn-outline-light me-2 font-weight-bold dropdown-toggle"
              :class="{ active: activeRoute.value === '/payments' }"
              aria-expanded="false"
              data-bs-toggle="dropdown"
            >
              {{ $t("app.nav.payments") }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <button
                  class="dropdown-item"
                  :class="{ active: activeRoute.value === '/payments' }"
                  @click="setActiveRoute('/payments'); router.push({ name: 'payments' })"
                >
                  {{ $t("app.nav.payments") }}
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item"
                  :class="{ active: activeRoute.value === '/payment-methods' }"
                  @click="setActiveRoute('/payment-methods'); router.push({ name: 'payment-methods' })"
                >
                  {{ $t("app.nav.paymentMethods") }}
                </button>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <button
              class="btn btn-outline-light me-2 font-weight-bold"
              :class="{ active: activeRoute.value === '/delivery' }"
              @click="setActiveRoute('/delivery'); router.push({ name: 'delivery' })"
            >
              {{ $t("app.nav.deliveries") }}
            </button>
          </li>

          <li class="nav-item">
            <select class="form-select" @change="changeLanguage">
              <option value="fr" selected>Français</option>
              <option value="en">English</option>
            </select>
          </li>
        </ul>
      </div>
    </nav>
  </header>

  <div class="container mt-5">
    <router-view />
  </div>
</template>

<style scoped>
.navbar {
  background-color: #007bff;
}

.navbar img {
  inline-size: 60px;
  block-size: auto;
  margin-inline-end: 10px;
}

.navbar .navbar-brand {
  font-size: 1.5rem;
  color: #ffffff;
}

.navbar .nav-item .btn {
  transition: background-color 0.3s, color 0.3s;
}

.navbar .nav-item .btn:hover,
.navbar .nav-item .btn.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.navbar .form-select {
  background-color: transparent;
  border: 1px solid white;
  color: white;
  margin-inline-start: 15px;
}

.navbar .form-select:focus {
  border-color: white;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>

