import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-free/css/all.min.css';

import router from './router/index.js'
import { messages } from './Translations/translation.js'

library.add(faEnvelope, faLock)

const i18n = createI18n({
  locale: 'fr',
  messages,
})

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(Toast)
app.use(router)
app.use(createPinia())
app.use(i18n)

app.mount('#app')
