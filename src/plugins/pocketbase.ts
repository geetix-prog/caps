import PocketBase from 'pocketbase'
import { ref } from 'vue'
import type { App } from 'vue'

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL ?? 'http://localhost:8081')

// Persistance via cookie PocketBase natif (déjà géré par le SDK)
// + refresh au démarrage
async function initAuth() {
  try {
    if (pb.authStore.isValid) {
      await pb.collection('users').authRefresh()
    }
  } catch (_) {
    pb.authStore.clear()
  }
}

const currentUser = ref(pb.authStore.record)
pb.authStore.onChange((_token, record) => {
  currentUser.value = record
})

export { pb, currentUser, initAuth }

// Plugin Vue optionnel si tu veux injecter via app.use()
export default {
  install(app: App) {
    app.provide('pb', pb)
    app.provide('currentUser', currentUser)
  },
}
