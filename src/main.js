import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { createI18n } from "vue-i18n";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import App from './App.vue'
import router from './router'

const app = createApp(App)

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: {
      recette: {
        App_page: {
          titre: "Recipes Management",
        },
      },
    },
    fr: {
      recette: {
        App_page: {
          titre: "Gestion des Recettes",
        },
      },
    },
  },
});


app.use(createPinia())
app.use(router)
app.use(i18n);

app.mount('#app')






