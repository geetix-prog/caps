<script setup lang="ts">
import Header from './components/Header.vue'
import { useTabAttention } from '@/composables/useTabAttention'

const { isAway } = useTabAttention('😢 Reviens stp !')
</script>

<template>
  <Header />
  <RouterView />

  <div
    :class="[
      'fixed inset-0 z-[9999] flex items-center justify-center',
      'bg-black/70 backdrop-blur-md',
      'transition-opacity duration-500 ease-in-out',
      isAway ? 'opacity-100' : 'opacity-0 pointer-events-none',
    ]"
  >
    <div class="text-center text-white animate-pulse">
      <p class="text-7xl mb-6">😢</p>
      <p class="text-3xl font-bold tracking-wide">Reviens stp...</p>
      <p class="text-sm text-white/50 mt-3">Tu nous manques déjà</p>
    </div>
  </div>
</template>
