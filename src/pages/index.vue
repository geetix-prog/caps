<script setup lang="ts">
import botImage from '@/assets/groupeBot.webp'
import Canette1 from '@/assets/canette1.webp'
import Canette2 from '@/assets/canette2.webp'
import Pres from '@/assets/capspress.webp'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div class="h-screen">
    <div class="absolute left-0 bottom-0 w-screen">
      <img :src="botImage" alt="" class="w-full z-0" />
    </div>
    <div
      class="relative w-full flex justify-center md:px-24 overflow-hidden items-center pt-55 animate-float"
    >
      <div class="-rotate-20">
        <img :src="Canette1" alt="Canette" class="w-50 z-24" />
      </div>
      <h1 class="text-white font-montserratAlt font-black text-[175px] relative z-10 animate-float">
        CAPS
      </h1>
      <div class="rotate-20">
        <img :src="Canette2" alt="Canette" class="z-0 w-50" />
      </div>
    </div>
  </div>
  <div class="bg-primary h-screen flex text-lg text-white font-montserrat justify-around">
    <img
      :src="Pres"
      alt="Présentation de l'association Caps"
      class="z-0 w-75 h-75 object-cover rounded-2xl"
    />
    <div class="flex flex-col items-center w-1/2 space-y-10">
      <h2 class="text-4xl font-bold font-montserratAlt w-1/2">Qui sommes-nous ?</h2>
      <p>
        CAPS est une association portée par des étudiants en
        <a
          class="text-secondary font-semibold underline"
          href="https://www.iut-nfc.univ-fcomte.fr/b-u-t-metiers-du-multimedia-et-de-linternet/"
          >MMI à Montbéliard</a
        >, passionnés par l’audiovisuel, le streaming et la création de contenus. Grâce au matériel
        mis à disposition dans le cadre de notre formation, nous réalisons des émissions, des
        captations et différents projets vidéo autour d’événements, de lives et de productions
        créatives. À travers CAPS, nous mettons en pratique nos compétences techniques et
        artistiques pour proposer des contenus dynamiques, collaboratifs et ambitieux.
      </p>
    </div>
  </div>
</template>
