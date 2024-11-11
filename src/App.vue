<template>
  <header
    v-if="route.path !== '/login'"
    class="navbar navbar-expand-lg navbar-dark fixed-top"
    style="background-color: #3fb59e"
  >
    <nav class="container">
      <router-link
        class="navbar-brand d-flex align-items-center text-light"
        @click="setActiveRoute('/')"
        to="/"
      >
        <font-awesome-icon icon="home" class="me-2" />
        {{ $t('app.title') }}
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link
              to="/users"
              class="btn btn-outline-light me-2 font-weight-bold"
              :class="{ active: isActiveRoute('/users') }"
              @click="setActiveRoute('/users')"
            >
              <font-awesome-icon icon="user" class="me-2" />
              {{ $t('app.nav.users') }}
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <button
              class="btn btn-outline-light me-2 font-weight-bold dropdown-toggle"
              type="button"
              :class="{
                active:
                  isActiveRoute('/parcels') || isActiveRoute('/parcel-types'),
              }"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <font-awesome-icon icon="box" class="me-2" />
              {{ $t('app.nav.packages') }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <router-link
                  to="/parcels"
                  class="dropdown-item"
                  :class="{ active: isActiveRoute('/parcels') }"
                  @click="setActiveRoute('/parcels')"
                >
                  <font-awesome-icon icon="box" class="me-2" />
                  {{ $t('app.nav.packages') }}
                </router-link>
              </li>
              <li>
                <router-link
                  to="/parcel-types"
                  class="dropdown-item"
                  :class="{ active: isActiveRoute('/parcel-types') }"
                  @click="setActiveRoute('/parcel-types')"
                >
                  <font-awesome-icon icon="tags" class="me-2" />
                  {{ $t('app.nav.packageTypes') }}
                </router-link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <button
              class="btn btn-outline-light me-2 font-weight-bold"
              :class="{ active: isActiveRoute('/shipments') }"
              @click="setActiveRoute('/shipments')"
            >
              <font-awesome-icon icon="truck" class="me-2" />
              {{ $t('app.nav.shipments') }}
            </button>
          </li>
          <li class="nav-item dropdown">
            <button
              class="btn btn-outline-light me-2 font-weight-bold dropdown-toggle"
              type="button"
              :class="{
                active:
                  isActiveRoute('/payments') ||
                  isActiveRoute('/payment-methods'),
              }"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <font-awesome-icon icon="credit-card" class="me-2" />
              {{ $t('app.nav.payments') }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <router-link
                  to="/payments"
                  class="dropdown-item"
                  :class="{ active: isActiveRoute('/payments') }"
                  @click="setActiveRoute('/payments')"
                >
                  <font-awesome-icon icon="money-bill-wave" class="me-2" />
                  {{ $t('app.nav.payments') }}
                </router-link>
              </li>
              <li>
                <router-link
                  to="/payment-methods"
                  class="dropdown-item"
                  :class="{ active: isActiveRoute('/payment-methods') }"
                  @click="setActiveRoute('/payment-methods')"
                >
                  <font-awesome-icon icon="wallet" class="me-2" />
                  {{ $t('app.nav.paymentMethods') }}
                </router-link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <button
              class="btn btn-outline-light me-2 font-weight-bold"
              :class="{ active: isActiveRoute('/delivery') }"
              @click="setActiveRoute('/delivery')"
            >
              <font-awesome-icon icon="envelope" class="me-2" />
              {{ $t('app.nav.deliveries') }}
            </button>
          </li>

          <li class="nav-item ms-5">
            <button
              v-if="isAuthenticated"
              @click="handleLogout"
              class="btn btn-outline-light me-2 font-weight-bold"
            >
              <font-awesome-icon icon="sign-out-alt" class="me-2" />
              Déconnexion
            </button>
            <router-link
              v-else
              to="/login"
              class="btn btn-outline-light me-2 font-weight-bold"
              :class="{ active: activeRoute.value === '/login' }"
              @click="setActiveRoute('/login')"
            >
              <font-awesome-icon icon="sign-in-alt" class="me-2" />
              Connexion
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>

  <div class="container mt-5">
    <router-view />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/authStore.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSignOutAlt,
  faSignInAlt,
  faUser,
  faBox,
  faTags,
  faTruck,
  faCreditCard,
  faMoneyBillWave,
  faWallet,
  faEnvelope,
  faHome,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faSignOutAlt,
  faSignInAlt,
  faUser,
  faBox,
  faTags,
  faTruck,
  faCreditCard,
  faMoneyBillWave,
  faWallet,
  faEnvelope,
  faHome
)

const router = useRouter()
const route = useRoute()
const activeRoute = ref(getBasePath(route.path))

const authStore = useAuthStore()
const isAuthenticated = authStore.isAuthenticated

function getBasePath(path) {
  const segments = path.split('/')
  return segments.length > 1 ? `/${segments[1]}` : path
}

const isActiveRoute = base => {
  return activeRoute.value === base
}

const setActiveRoute = path => {
  activeRoute.value = getBasePath(path)
  router.push(path)
}

watch(
  () => route.path,
  newPath => {
    activeRoute.value = getBasePath(newPath)
  }
)

const { locale } = useI18n()
const changeLanguage = event => {
  locale.value = event.target.value
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.navbar {
  background-color: #3fb59e;
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

.active {
  color: #3fb59e;
  font-weight: bold;
}
</style>
