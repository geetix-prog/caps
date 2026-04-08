<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PlaceHolder from '@/assets/AvatarPlaceholder.svg'
import { useScrollDirection } from '@/composables/useScrollDirection'

const authStore = useAuthStore()
const router = useRouter()
const { isAuthenticated, userName, userAvatar } = storeToRefs(authStore)
const { isHidden } = useScrollDirection()

function goToLogin() {
  router.push({ path: '/auth', query: { mode: 'login' } })
}

function goToRegister() {
  router.push({ path: '/auth', query: { mode: 'register' } })
}
</script>

<template>
  <header
    class="fixed top-1/30 z-10 flex items-center justify-between px-10 w-full font-montserrat font-medium text-white transition-transform duration-300"
    :class="isHidden ? '-translate-y-100' : 'translate-y-0'"
  >
    <RouterLink to="/">
      <img
        src="/favicon.svg"
        class="rounded-full w-20 h-20 hover:scale-105 transition-all duration-150 ease"
        alt="Logo Caps Officiel"
      />
    </RouterLink>

    <div v-if="isAuthenticated" class="flex items-center gap-3">
      <RouterLink to="/profile">
        <img
          v-if="userAvatar"
          :src="userAvatar"
          :alt="userName"
          class="w-20 h-20 rounded-full object-cover p-1 hover:scale-105 transition-all duration-150 ease"
        />
        <img
          v-else
          :src="PlaceHolder"
          alt="placeholder"
          class="w-20 h-20 rounded-full object-cover p-1 hover:scale-105 transition-all duration-150 ease"
        />
      </RouterLink>
    </div>

    <div v-else class="flex gap-5 items-center">
      <button
        class="bg-white/20 hover:bg-white/30 font-montserratAlt font-bold px-3 py-2 rounded-full hover:scale-105 transition-all duration-100 ease-in-out cursor-pointer"
        @click="goToLogin"
      >
        Connexion
      </button>
      <button
        class="bg-primary hover:bg-purple-900 font-montserratAlt font-bold px-3 py-2 rounded-full hover:scale-105 transition-all duration-100 ease-in-out cursor-pointer"
        @click="goToRegister"
      >
        Inscription
      </button>
    </div>
  </header>
</template>
