<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'
import PlaceHolder from '@/assets/AvatarPlaceholder.svg'

defineOptions({ name: 'EquipesPage' })

const router = useRouter()
const teamStore = useTeamStore()
const authStore = useAuthStore()

const { teams, isLoading, error, myTeam } = storeToRefs(teamStore)
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
    setTimeout(() => {
      router.push(`/equipes/${team.id}`)
    }, 1200)
  } else {
    joinError.value = teamStore.error
  }
}
</script>

<template>
  <div class="min-h-screen pt-32 pb-20 px-6 font-montserrat text-white">
    <!-- Header section -->
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 class="text-5xl font-black font-montserratAlt mb-3">Équipes pour le tournois</h1>
          <p class="text-white/60 text-lg max-w-xl">
            Rejoignez ou créez une équipe pour collaborer sur des projets avec d'autres membres de
            la communauté CAPS.
          </p>
        </div>
        <RouterLink
          v-if="isAuthenticated && !myTeam"
          to="/equipes/creer"
          class="group flex items-center gap-2 bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
          </svg>
          Créer une équipe
        </RouterLink>
        <RouterLink
          v-else-if="!isAuthenticated"
          to="/auth?mode=register"
          class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105"
        >
          S'inscrire pour créer une équipe
        </RouterLink>
      </div>

      <!-- Déjà dans une équipe -->
      <RouterLink
        v-if="isAuthenticated && myTeam"
        :to="`/equipes/${myTeam.id}`"
        class="flex items-center gap-4 bg-primary/15 border border-primary/30 hover:border-primary/60 rounded-2xl p-5 mb-12 transition-all hover:scale-[1.01] group"
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

      <!-- Join by invite code (seulement si pas dans une équipe) -->
      <div v-if="isAuthenticated && !myTeam" class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
        <h2 class="text-xl font-bold font-montserratAlt mb-4">Rejoindre via un code d'invitation</h2>
        <form class="flex flex-col sm:flex-row gap-3" @submit.prevent="handleJoinByCode">
          <input
            v-model="inviteCode"
            type="text"
            placeholder="Code d'invitation (ex: ABC12345)"
            maxlength="8"
            class="bg-white rounded-xl flex-1 py-2 px-4 text-black font-mono text-lg uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
            @input="inviteCode = inviteCode.toUpperCase(); joinError = ''; joinSuccess = ''"
          />
          <button
            type="submit"
            :disabled="isJoining || !inviteCode.trim()"
            class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ isJoining ? 'Rejoindre...' : 'Rejoindre' }}
          </button>
        </form>
        <p v-if="joinError" class="text-red-400 text-sm mt-2">{{ joinError }}</p>
        <p v-if="joinSuccess" class="text-green-400 text-sm mt-2">{{ joinSuccess }}</p>
      </div>

      <!-- Team list -->
      <div>
        <h2 class="text-2xl font-bold font-montserratAlt mb-6">Équipes</h2>

        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="i in 6"
            :key="i"
            class="bg-white/5 rounded-2xl h-48 animate-pulse"
          />
        </div>

        <div v-else-if="error" class="text-red-400 text-center py-12">
          {{ error }}
        </div>

        <div v-else-if="teams.length === 0" class="text-center py-20 text-white/40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="currentColor" class="mx-auto mb-4 opacity-40">
            <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.4874L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.2608 19 8.5C19 7.11935 18.2016 5.92603 17.031 5.35635L17.5962 3.41321Z"/>
          </svg>
          <p class="text-lg font-montserratAlt font-bold mb-2">Aucune équipe pour l'instant</p>
          <p class="text-sm">Sois le premier à créer une équipe !</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="team in teams"
            :key="team.id"
            :to="`/equipes/${team.id}`"
            class="group bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] cursor-pointer block"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 rounded-full overflow-hidden bg-primary/20 flex-shrink-0 flex items-center justify-center">
                <img
                  v-if="team.logo"
                  :src="teamStore.getLogoUrl(team)"
                  :alt="team.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-2xl font-black font-montserratAlt text-primary">
                  {{ team.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-bold font-montserratAlt text-lg truncate group-hover:text-white transition-colors">
                    {{ team.name }}
                  </h3>
                  <span v-if="(team.memberCount ?? 0) < 2" class="text-xs font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 whitespace-nowrap">
                    1/2 joueurs
                  </span>
                </div>
                <p class="text-white/50 text-sm">
                  par {{ team.expand?.creator?.name || team.expand?.creator?.username || 'Inconnu' }}
                </p>
              </div>
            </div>
            <p v-if="team.description" class="text-white/60 text-sm line-clamp-2">
              {{ team.description }}
            </p>
            <p v-else class="text-white/30 text-sm italic">Aucune description</p>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
