<script setup lang="ts">
import { useRouter } from 'vue-router'
import Canette1 from '@/assets/canette1.webp'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 font-montserrat text-white text-center">
    <img :src="Canette1" class="w-24 sm:w-32 mb-6 opacity-80" style="transform: rotate(-45deg) translateY(8px)" alt="" />

    <h1 class="font-montserratAlt font-black text-[90px] sm:text-[130px] leading-none select-none mb-2">
      500
    </h1>
    <h2 class="font-montserratAlt font-bold text-2xl sm:text-3xl mb-3">
      Erreur serveur
    </h2>
    <p class="text-white/50 text-sm sm:text-base max-w-sm mb-10">
      Quelque chose a planté de notre côté. Ce n'est pas ta faute, on règle ça au plus vite.
    </p>

    <div class="flex gap-3 flex-wrap justify-center">
      <button
        class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
        @click="router.push('/')"
      >
        Retour à l'accueil
      </button>
      <button
        class="bg-white/10 hover:bg-white/20 font-montserratAlt font-bold px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
        @click="router.go(0)"
      >
        Réessayer
      </button>
    </div>
  </div>
</template>
