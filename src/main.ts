import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura'

// PrimeVue components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import Tag from 'primevue/tag'

// PrimeIcons
import 'primeicons/primeicons.css'

// Mobile styles
import './styles/mobile.css'

// Services
import ApiService from './services/apiService'

// Initialize API service
ApiService.init()

const app = createApp(App)

app.use(createPinia())
app.use(router)

// PrimeVue configuration
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  }
})

app.use(ToastService)

// Register PrimeVue components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('Tag', Tag)

app.mount('#app')