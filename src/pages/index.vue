<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import botImage from '@/assets/groupeBot.webp'
import Canette1 from '@/assets/canette1.webp'
import Canette2 from '@/assets/canette2.webp'
import Pres from '@/assets/capspress.webp'
import VideoGrid from '@/components/VideoGrid.vue'
import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'

defineOptions({ name: 'IndexPage' })

const router = useRouter()
const teamStore = useTeamStore()
const authStore = useAuthStore()

const { teams, isLoading: teamsLoading, myTeam } = storeToRefs(teamStore)
const { isAuthenticated } = storeToRefs(authStore)

const inviteCode = ref('')
const joinError = ref('')
const joinSuccess = ref('')
const isJoining = ref(false)

onMounted(() => {
  teamStore.fetchTeams()
  if (isAuthenticated.value) teamStore.fetchMyTeam()
})

async function handleJoinByCode() {
  if (!inviteCode.value.trim()) return
  joinError.value = ''
  joinSuccess.value = ''
  isJoining.value = true
  const team = await teamStore.joinByInviteCode(inviteCode.value)
  isJoining.value = false
  if (team) {
    joinSuccess.value = `Vous avez rejoint l'équipe "${team.name}" !`
    inviteCode.value = ''
    setTimeout(() => router.push(`/equipes/${team.id}`), 1200)
  } else {
    joinError.value = teamStore.error
  }
}

const featuresV1 = [
  {
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
    label: 'Comptes & profils',
    description: 'Créez votre profil et personnalisez votre avatar.',
  },
  {
    icon: 'M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.4874L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.2608 19 8.5C19 7.11935 18.2016 5.92603 17.031 5.35635L17.5962 3.41321Z',
    label: "Système d'équipes",
    description: 'Créez et rejoignez des équipes pour collaborer.',
  },
]

const featuresComing = [
  {
    icon: 'M4 6H20V9H4V6ZM4 13H20V16H4V13ZM4 20H20V23H4V20Z',
    label: 'Émissions en replay',
    description: 'Retrouvez toutes nos émissions en rediffusion.',
  },
  {
    icon: 'M17 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9V3H15V1H17V3ZM4 11V19H20V11H4ZM4 5V9H20V5H4ZM6 13H8V15H6V13ZM11 13H13V15H11V13ZM16 13H18V15H16V13Z',
    label: 'Calendrier des programmes',
    description: 'Suivez le planning de toutes nos émissions à venir.',
  },
  {
    icon: 'M10 3H14C14.5523 3 15 3.44772 15 4V10H19.5858L12 17.5858L4.41421 10H9V4C9 3.44772 9.44772 3 10 3ZM3 19H21V21H3V19Z',
    label: 'Chat en direct',
    description: 'Interagissez avec les streamers pendant les lives.',
  },
  {
    icon: 'M5 18H3C2.44772 18 2 17.5523 2 17V7C2 6.44772 2.44772 6 3 6H21C21.5523 6 22 6.44772 22 7V17C22 17.5523 21.5523 18 21 18H19V19.5C19 20.3284 18.3284 21 17.5 21H6.5C5.67157 21 5 20.3284 5 19.5V18ZM4 16H20V8H4V16ZM7 18V19H17V18H7Z',
    label: 'Tableau de bord admin',
    description: "Gestion du contenu et des membres pour l'équipe CAPS.",
  },
  {
    icon: 'M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM13 12V17H11V12H13ZM12 7C12.8284 7 13.5 7.67157 13.5 8.5C13.5 9.32843 12.8284 10 12 10C11.1716 10 10.5 9.32843 10.5 8.5C10.5 7.67157 11.1716 7 12 7Z',
    label: 'Notifications',
    description: 'Soyez alerté des nouveaux contenus et événements.',
  },
]
</script>

<template>
  <!-- Hero -->
  <div class="h-screen flex flex-col justify-center pt-16 md:block md:pt-0">
    <div class="absolute left-0 bottom-0 w-screen">
      <img :src="botImage" alt="" class="w-full z-0" />
      <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-primary to-transparent" />
    </div>
    <div
      class="relative w-full flex justify-center md:px-24 overflow-hidden items-center md:pt-55 animate-float"
    >
      <div class="-rotate-20">
        <img :src="Canette1" alt="Canette" class="w-24 sm:w-36 md:w-50 z-24" />
      </div>
      <h1 class="text-white font-montserratAlt font-black text-[70px] sm:text-[110px] md:text-[175px] relative z-10 animate-float">
        CAPS
      </h1>
      <div class="rotate-20">
        <img :src="Canette2" alt="Canette" class="z-0 w-24 sm:w-36 md:w-50" />
      </div>
    </div>

    <!-- Tagline + CTA (surtout utile sur mobile pour remplir le hero) -->
    <div class="relative z-10 flex flex-col items-center gap-5 mt-6 px-6 text-center md:hidden">
      <p class="text-white/70 font-montserrat text-sm sm:text-base max-w-xs sm:max-w-sm">
        Streams · Équipes · Contenus — la plateforme des étudiants MMI de Montbéliard
      </p>
      <div class="flex gap-3 flex-wrap justify-center">
        <a
          href="#equipes"
          class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-6 py-2.5 rounded-full text-white text-sm transition-all hover:scale-105"
        >
          Voir les équipes
        </a>
        <RouterLink
          v-if="!isAuthenticated"
          to="/auth?mode=register"
          class="bg-white/15 hover:bg-white/25 font-montserratAlt font-bold px-6 py-2.5 rounded-full text-white text-sm transition-all hover:scale-105"
        >
          Rejoindre
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- Qui sommes-nous -->
  <div class="bg-primary py-20 px-6 text-white font-montserrat">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
      <img
        :src="Pres"
        alt="Présentation de l'association CAPS"
        class="w-72 h-72 object-cover rounded-2xl flex-shrink-0 shadow-2xl"
      />
      <div class="flex flex-col space-y-6">
        <h2 class="text-4xl font-bold font-montserratAlt">Qui sommes-nous ?</h2>
        <p class="text-lg leading-relaxed">
          CAPS est une association portée par des étudiants en
          <a
            class="text-white font-semibold underline underline-offset-2"
            href="https://www.iut-nfc.univ-fcomte.fr/b-u-t-metiers-du-multimedia-et-de-linternet/"
            target="_blank"
            rel="noopener"
            >MMI à Montbéliard</a
          >, passionnés par l'audiovisuel, le streaming et la création de contenus. Grâce au
          matériel mis à disposition dans le cadre de notre formation, nous réalisons des émissions,
          des captations et différents projets vidéo autour d'événements, de lives et de productions
          créatives.
        </p>
        <p class="text-lg leading-relaxed text-white/80">
          À travers CAPS, nous mettons en pratique nos compétences techniques et artistiques pour
          proposer des contenus dynamiques, collaboratifs et ambitieux. Ce site est notre espace
          commun : un lieu pour retrouver nos émissions, rejoindre une équipe, et suivre l'actualité
          de l'asso.
        </p>
      </div>
    </div>
  </div>

  <!-- Gradient primary → orange -->
  <div class="h-20 bg-gradient-to-b from-primary to-tertiary" />

  <!-- Séparateur -->
  <div class="h-px bg-white/5 mx-12 my-4" />

  <!-- Équipes -->
  <div id="equipes" class="py-16 px-6 font-montserrat text-white">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 class="text-4xl font-bold font-montserratAlt mb-3">Équipes pour le tournois</h2>
          <p class="text-white/50">Rejoignez ou créez une équipe pour collaborer avec la communauté CAPS.</p>
        </div>
        <!-- Boutons si pas encore dans une équipe -->
        <template v-if="isAuthenticated && !myTeam">
          <RouterLink
            to="/equipes/creer"
            class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-6 py-3 rounded-full transition-all hover:scale-105 whitespace-nowrap"
          >
            + Créer une équipe
          </RouterLink>
        </template>
        <RouterLink
          v-else-if="!isAuthenticated"
          to="/auth?mode=register"
          class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-6 py-3 rounded-full transition-all hover:scale-105 whitespace-nowrap"
        >
          S'inscrire pour créer
        </RouterLink>
      </div>

      <!-- Déjà dans une équipe -->
      <RouterLink
        v-if="isAuthenticated && myTeam"
        :to="`/equipes/${myTeam.id}`"
        class="flex items-center gap-4 bg-primary/15 border border-primary/30 hover:border-primary/60 rounded-2xl p-5 mb-10 transition-all hover:scale-[1.01] group"
      >
        <div class="w-12 h-12 rounded-full overflow-hidden bg-primary/30 flex-shrink-0 flex items-center justify-center">
          <img v-if="myTeam.logo" :src="teamStore.getLogoUrl(myTeam)" :alt="myTeam.name" class="w-full h-full object-cover" />
          <span v-else class="text-xl font-black font-montserratAlt text-white">{{ myTeam.name.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-0.5">Votre équipe</p>
          <p class="font-bold font-montserratAlt text-lg group-hover:text-white transition-colors truncate">{{ myTeam.name }}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-white/40 group-hover:text-white transition-colors flex-shrink-0">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"/>
        </svg>
      </RouterLink>

      <!-- Join by code (seulement si pas encore dans une équipe) -->
      <div v-if="isAuthenticated && !myTeam" class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
        <h3 class="font-bold font-montserratAlt mb-3">Rejoindre via un code d'invitation</h3>
        <form class="flex flex-col sm:flex-row gap-3" @submit.prevent="handleJoinByCode">
          <input
            v-model="inviteCode"
            type="text"
            placeholder="Code d'invitation de l'équipe"
            maxlength="15"
            class="bg-white rounded-xl flex-1 py-2 px-4 text-black font-mono text-lg uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
            @input="joinError = ''; joinSuccess = ''"
          />
          <button
            type="submit"
            :disabled="isJoining || !inviteCode.trim()"
            class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-6 py-2 rounded-full transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            {{ isJoining ? 'Rejoindre...' : 'Rejoindre' }}
          </button>
        </form>
        <p v-if="joinError" class="text-red-300 text-sm mt-2">{{ joinError }}</p>
        <p v-if="joinSuccess" class="text-green-400 text-sm mt-2">{{ joinSuccess }}</p>
      </div>

      <!-- Team grid -->
      <div v-if="teamsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-white/5 rounded-2xl h-40 animate-pulse" />
      </div>

      <div v-else-if="teams.length === 0" class="text-center py-12 text-white/40">
        <p class="font-montserratAlt font-bold text-lg mb-1">Aucune équipe pour l'instant</p>
        <p class="text-sm">Sois le premier à en créer une !</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="team in teams"
          :key="team.id"
          :to="`/equipes/${team.id}`"
          class="group bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] block"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-primary/20 flex-shrink-0 flex items-center justify-center">
              <img
                v-if="team.logo"
                :src="teamStore.getLogoUrl(team)"
                :alt="team.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-xl font-black font-montserratAlt text-primary">
                {{ team.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-bold font-montserratAlt truncate group-hover:text-white transition-colors">
                  {{ team.name }}
                </h3>
                <span v-if="(team.memberCount ?? 0) < 2" class="text-xs font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/30 text-yellow-300 whitespace-nowrap">
                  1/2 joueurs
                </span>
              </div>
              <p class="text-white/40 text-sm">
                par {{ team.expand?.creator?.name || team.expand?.creator?.username || 'Inconnu' }}
              </p>
            </div>
          </div>
          <p v-if="team.description" class="text-white/60 text-sm line-clamp-2">{{ team.description }}</p>
          <p v-else class="text-white/30 text-sm italic">Aucune description</p>
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- Features / Roadmap -->
  <div class="py-24 px-6 font-montserrat text-white">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <span class="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 font-montserratAlt">
          VERSION 1.0
        </span>
        <span class="text-white/40 text-sm">Ce site est encore en construction</span>
      </div>

      <h2 class="text-4xl font-bold font-montserratAlt mb-4">Ce que CAPS vous propose</h2>
      <p class="text-white/60 text-lg mb-14 max-w-2xl">
        Cette première version pose les bases de notre plateforme. De nombreuses fonctionnalités
        arrivent bientôt, voici l'aperçu de ce qui est déjà là et de ce qui vient.
      </p>

      <h3 class="text-xl font-bold font-montserratAlt text-white mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z" />
        </svg>
        Disponible maintenant
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        <div
          v-for="f in featuresV1"
          :key="f.label"
          class="bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col gap-3"
        >
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-white">
              <path :d="f.icon" />
            </svg>
          </div>
          <div>
            <p class="font-bold font-montserratAlt">{{ f.label }}</p>
            <p class="text-white/50 text-sm mt-1">{{ f.description }}</p>
          </div>
        </div>
      </div>

      <h3 class="text-xl font-bold font-montserratAlt text-white/40 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12V17H11V10H16V12H13Z" />
        </svg>
        Bientôt disponible
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="f in featuresComing"
          :key="f.label"
          class="bg-white/3 border border-white/5 rounded-2xl p-6 flex flex-col gap-3 opacity-60"
        >
          <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-white/50">
              <path :d="f.icon" />
            </svg>
          </div>
          <div>
            <p class="font-bold font-montserratAlt text-white/70">{{ f.label }}</p>
            <p class="text-white/40 text-sm mt-1">{{ f.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
