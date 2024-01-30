import './index.css'
import 'primevue/resources/themes/lara-light-green/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
}

app.use(PrimeVue, {})
app.use(ToastService)
app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, {
  queryClientConfig: queryClientConfig
})

// eslint-disable-next-line vue/multi-word-component-names
app.component('Toast', Toast)

app.mount('#app')

export { app }
