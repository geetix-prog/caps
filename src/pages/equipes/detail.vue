<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'
import PlaceHolder from '@/assets/AvatarPlaceholder.svg'

defineOptions({ name: 'DetailEquipePage' })

const route = useRoute()
const router = useRouter()
const teamStore = useTeamStore()
const authStore = useAuthStore()

const { currentTeam, memberships, isLoading, error } = storeToRefs(teamStore)
const { isAuthenticated, user } = storeToRefs(authStore)

const isMember = ref(false)
const actionLoading = ref(false)
const actionError = ref('')
const codeCopied = ref(false)
const showDeleteConfirm = ref(false)

const isCreator = computed(() =>
  isAuthenticated.value && currentTeam.value?.creator === user.value?.id,
)

onMounted(async () => {
  const id = route.params.id as string
  await teamStore.fetchTeam(id)
  if (isAuthenticated.value) {
    isMember.value = await teamStore.checkMembership(id)
  }
})

async function handleJoin() {
  actionError.value = ''
  actionLoading.value = true
  const ok = await teamStore.joinTeam(currentTeam.value!.id)
  actionLoading.value = false
  if (ok) {
    isMember.value = true
    await teamStore.fetchTeam(currentTeam.value!.id)
  } else {
    actionError.value = teamStore.error
  }
}

async function handleLeave() {
  actionError.value = ''
  actionLoading.value = true
  const ok = await teamStore.leaveTeam(currentTeam.value!.id)
  actionLoading.value = false
  if (ok) {
    isMember.value = false
    await teamStore.fetchTeam(currentTeam.value!.id)
  } else {
    actionError.value = teamStore.error
  }
}

async function handleDelete() {
  actionLoading.value = true
  const ok = await teamStore.deleteTeam(currentTeam.value!.id)
  actionLoading.value = false
  if (ok) {
    router.push('/equipes')
  } else {
    actionError.value = teamStore.error
  }
}

function copyInviteCode() {
  if (!currentTeam.value?.invite_code) return
  navigator.clipboard.writeText(currentTeam.value.invite_code)
  codeCopied.value = true
  setTimeout(() => (codeCopied.value = false), 2000)
}
</script>

<template>
  <div class="min-h-screen pt-32 pb-20 px-6 font-montserrat text-white">
    <div class="max-w-4xl mx-auto">
      <!-- Back -->
      <RouterLink
        to="/equipes"
        class="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"/>
        </svg>
        Retour aux équipes
      </RouterLink>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-6">
        <div class="bg-white/5 rounded-2xl h-40 animate-pulse" />
        <div class="bg-white/5 rounded-2xl h-60 animate-pulse" />
      </div>

      <!-- Error -->
      <div v-else-if="error && !currentTeam" class="text-center py-20">
        <p class="text-red-400 text-xl mb-4">{{ error }}</p>
        <RouterLink to="/equipes" class="text-primary underline">Retour aux équipes</RouterLink>
      </div>

      <!-- Content -->
      <div v-else-if="currentTeam">
        <!-- Team header card -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0">
              <img
                v-if="currentTeam.logo"
                :src="teamStore.getLogoUrl(currentTeam)"
                :alt="currentTeam.name"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-4xl font-black font-montserratAlt text-primary">
                {{ currentTeam.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-3 mb-1">
                <h1 class="text-3xl font-black font-montserratAlt">{{ currentTeam.name }}</h1>
                <span
                  v-if="memberships.length < 2"
                  class="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                >
                  En attente de joueurs
                </span>
              </div>
              <p class="text-white/50 text-sm mb-3">
                Créée par
                <span class="text-white font-semibold">
                  {{ currentTeam.expand?.creator?.name || currentTeam.expand?.creator?.username || 'Inconnu' }}
                </span>
              </p>
              <p v-if="currentTeam.description" class="text-white/70">{{ currentTeam.description }}</p>
              <p v-else class="text-white/30 italic text-sm">Aucune description</p>
            </div>

            <!-- Action buttons -->
            <div v-if="isAuthenticated" class="flex flex-col gap-2 flex-shrink-0">
              <template v-if="!isCreator">
                <button
                  v-if="!isMember"
                  :disabled="actionLoading"
                  class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                  @click="handleJoin"
                >
                  {{ actionLoading ? 'Chargement...' : 'Rejoindre' }}
                </button>
                <button
                  v-else
                  :disabled="actionLoading"
                  class="bg-white/10 hover:bg-red-500/20 hover:text-red-400 font-montserratAlt font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 border border-white/10 hover:border-red-500/30"
                  @click="handleLeave"
                >
                  {{ actionLoading ? 'Chargement...' : 'Quitter' }}
                </button>
              </template>

              <template v-if="isCreator">
                <button
                  v-if="!showDeleteConfirm"
                  class="bg-red-500/20 hover:bg-red-500/40 text-red-400 font-montserratAlt font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 cursor-pointer border border-red-500/20"
                  @click="showDeleteConfirm = true"
                >
                  Supprimer l'équipe
                </button>
                <div v-else class="flex gap-2">
                  <button
                    :disabled="actionLoading"
                    class="bg-red-500 hover:bg-red-600 font-montserratAlt font-bold px-4 py-2 rounded-full transition-all cursor-pointer text-sm disabled:opacity-50"
                    @click="handleDelete"
                  >
                    Confirmer
                  </button>
                  <button
                    class="bg-white/10 hover:bg-white/20 font-montserratAlt font-bold px-4 py-2 rounded-full transition-all cursor-pointer text-sm"
                    @click="showDeleteConfirm = false"
                  >
                    Annuler
                  </button>
                </div>
              </template>
            </div>
            <RouterLink
              v-else
              to="/auth?mode=login"
              class="bg-primary hover:bg-primary/80 font-montserratAlt font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 flex-shrink-0"
            >
              Se connecter pour rejoindre
            </RouterLink>
          </div>

          <p v-if="actionError" class="text-red-400 text-sm mt-4">{{ actionError }}</p>
        </div>

        <!-- Bandeau équipe invalide -->
        <div
          v-if="memberships.length < 2"
          class="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3 text-yellow-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="flex-shrink-0">
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"/>
          </svg>
          <p class="text-sm">
            Cette équipe a besoin d'au moins <strong>2 membres</strong> pour être valide et apparaître dans la liste publique.
            {{ isCreator ? 'Partagez votre code d\'invitation pour recruter des joueurs.' : 'Rejoignez-la pour l\'activer !' }}
          </p>
        </div>

        <!-- Invite code (creator only) -->
        <div v-if="isCreator" class="bg-primary/10 border border-primary/30 rounded-2xl p-6 mb-8">
          <h2 class="text-lg font-bold font-montserratAlt mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-primary">
              <path d="M10 14C8.34315 14 7 15.3431 7 17C7 18.6569 8.34315 20 10 20C11.6569 20 13 18.6569 13 17C13 15.3431 11.6569 14 10 14ZM10 14V11M19 7L17 9M17 7L19 9M14 4H10C7.17157 4 5.75736 4 4.87868 4.87868C4 5.75736 4 7.17157 4 10V14C4 16.8284 4 18.2426 4.87868 19.1213C5.75736 20 7.17157 20 10 20H14C16.8284 20 18.2426 20 19.1213 19.1213C20 18.2426 20 16.8284 20 14V10C20 7.17157 20 5.75736 19.1213 4.87868C18.2426 4 16.8284 4 14 4Z"/>
            </svg>
            Code d'invitation
          </h2>
          <p class="text-white/60 text-sm mb-4">
            Partagez ce code pour que des personnes rejoignent votre équipe privée ou directement via la page équipes.
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <code class="bg-black/30 rounded-xl px-4 py-2 font-mono text-xl sm:text-2xl tracking-widest text-white font-bold">
              {{ currentTeam.invite_code }}
            </code>
            <button
              class="bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2 text-sm transition-all cursor-pointer flex items-center gap-2"
              @click="copyInviteCode"
            >
              <svg v-if="!codeCopied" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00026 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="text-green-400">
                <path d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z"/>
              </svg>
              {{ codeCopied ? 'Copié !' : 'Copier' }}
            </button>
          </div>
        </div>

        <!-- Members section -->
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 class="text-xl font-bold font-montserratAlt mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-primary">
              <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.4874L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.2608 19 8.5C19 7.11935 18.2016 5.92603 17.031 5.35635L17.5962 3.41321Z"/>
            </svg>
            Membres <span class="text-white/40 font-normal text-base">({{ memberships.length }})</span>
          </h2>

          <div v-if="memberships.length === 0" class="text-white/40 text-center py-8">
            Aucun membre pour l'instant.
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
              v-for="membership in memberships"
              :key="membership.id"
              class="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div class="w-14 h-14 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                <img
                  v-if="membership.expand?.user?.avatar"
                  :src="teamStore.getMemberAvatarUrl(membership.expand.user)"
                  :alt="membership.expand?.user?.name"
                  class="w-full h-full object-cover"
                />
                <img v-else :src="PlaceHolder" alt="avatar" class="w-full h-full object-cover" />
              </div>
              <div class="text-center min-w-0 w-full">
                <p class="font-semibold text-sm truncate">
                  {{ membership.expand?.user?.name || membership.expand?.user?.username || 'Membre' }}
                </p>
                <span
                  v-if="membership.user === currentTeam?.creator"
                  class="text-xs text-white/60 font-bold"
                >
                  Créateur
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
