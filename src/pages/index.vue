<script setup lang="ts">
import Scene3D from '@/components/Scene3D.vue'
import botImage from '@/assets/groupeBot.webp'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div class="">
    <div class="absolute left-0 bottom-0 w-screen">
      <img :src="botImage" alt="Bot" class="w-full z-0" />
      <p
        class="absolute bottom-10 left-1/6 -translate-x-1/2 text-white font-montserrat font-semibold text-2xl z-10"
      >
        Scroll pour suivre l'aventure
      </p>
    </div>
    <div>
      <Scene3D />
    </div>
    <div class="relative h-screen w-full flex mt-40 justify-left mx-50 overflow-hidden">
      <h1 class="text-white font-montserratAlt font-black text-[175px] relative z-10 animate-float">
        CAPS
      </h1>
    </div>
  </div>
</template>
