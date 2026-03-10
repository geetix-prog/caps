import './assets/main.css'

import pocketbasePlugin, { initAuth } from './plugins/pocketbase'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(pocketbasePlugin)

initAuth().then(() => {
  app.mount('#app')
})
