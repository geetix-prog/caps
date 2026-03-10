<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const { isAuthenticated, userName, userAvatar } = storeToRefs(authStore)

function goToLogin() {
  router.push({ path: '/auth', query: { mode: 'login' } })
}

function goToRegister() {
  router.push({ path: '/auth', query: { mode: 'register' } })
}
</script>

<template>
  <header
    class="absolute top-1/30 z-10 flex items-center justify-around w-full font-montserrat font-medium text-white"
  >
    <div class="w-1/6">
      <RouterLink to="/">
        <img
          src="/favicon.svg"
          class="rounded-full hover:shadow-xs shadow-secondary transition-all duration-150 ease"
          alt="Logo Caps Officiel"
        />
      </RouterLink>
    </div>

    <nav>
      <ul class="flex gap-30 w-1/3 justify-center">
        <li class="hover:scale-110 hover:text-primary transition-all">
          <RouterLink to="/programmes">Programmes</RouterLink>
        </li>
        <li class="hover:scale-110 hover:text-primary transition-all">
          <RouterLink to="/redif">Rediffusion</RouterLink>
        </li>
        <li class="hover:scale-110 hover:text-primary transition-all">
          <RouterLink to="/equipe">Notre équipe</RouterLink>
        </li>
      </ul>
    </nav>

    <div v-if="isAuthenticated" class="flex items-center w-1/6 gap-3 justify-end">
      <img
        v-if="userAvatar"
        :src="userAvatar"
        :alt="userName"
        class="w-9 h-9 rounded-full object-cover"
      />
    </div>

    <div v-else class="flex gap-5 w-1/6 justify-end items-center">
      <button
        @click="goToLogin"
        class="bg-secondary hover:bg-pink-400 font-montserratAlt font-bold px-3 py-2 rounded-full hover:scale-105 transition-all duration-100 ease-in-out cursor-pointer"
      >
        Connexion
      </button>
      <button
        @click="goToRegister"
        class="bg-primary hover:bg-purple-900 font-montserratAlt font-bold px-3 py-2 rounded-full hover:scale-105 transition-all duration-100 ease-in-out cursor-pointer"
      >
        Inscription
      </button>
    </div>
  </header>
</template>
