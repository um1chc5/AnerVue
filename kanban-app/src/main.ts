import './index.css'
import 'primevue/resources/themes/lara-light-green/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

const app = createApp(App)

app.use(PrimeVue, {})
app.use(ToastService)
app.use(createPinia())
app.use(router)
// eslint-disable-next-line vue/multi-word-component-names
app.component('Toast', Toast)

app.mount('#app')

export { app }
