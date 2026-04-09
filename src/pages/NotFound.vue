<script setup lang="ts">
import { useRouter } from 'vue-router'
import Canette1 from '@/assets/canette1.webp'
import Canette2 from '@/assets/canette2.webp'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 font-montserrat text-white text-center">
    <!-- Canettes + 404 -->
    <div class="flex items-center gap-4 mb-6">
      <img :src="Canette1" class="w-20 sm:w-28 -rotate-20 opacity-80" alt="" />
      <h1 class="font-montserratAlt font-black text-[100px] sm:text-[150px] leading-none select-none">
        404
      </h1>
      <img :src="Canette2" class="w-20 sm:w-28 rotate-20 opacity-80" alt="" />
    </div>

    <h2 class="font-montserratAlt font-bold text-2xl sm:text-3xl mb-3">
      Page introuvable
    </h2>
    <p class="text-white/50 text-sm sm:text-base max-w-sm mb-10">
      Cette page n'existe pas ou a été déplacée. Retourne à l'accueil, on t'attend.
    </p>

    <button
      class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
      @click="router.push('/')"
    >
      Retour à l'accueil
    </button>
  </div>
</template>
