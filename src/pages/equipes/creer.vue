<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTeamStore } from '@/stores/team'
import { useAuthStore } from '@/stores/auth'

defineOptions({ name: 'CreerEquipePage' })

const router = useRouter()
const teamStore = useTeamStore()
const authStore = useAuthStore()

const { isLoading, error } = storeToRefs(teamStore)
const { isAuthenticated } = storeToRefs(authStore)

const form = reactive({
  name: '',
  description: '',
})
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/auth?mode=login')
    return
  }
  await teamStore.fetchMyTeam()
  if (teamStore.myTeam) {
    router.push(`/equipes/${teamStore.myTeam.id}`)
  }
})

function handleLogoChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  logoFile.value = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    logoPreview.value = null
  }
}

async function handleSubmit() {
  teamStore.clearError()
  if (!form.name.trim()) return

  const team = await teamStore.createTeam({
    name: form.name,
    description: form.description,
    logo: logoFile.value,
  })

  if (team) {
    router.push(`/equipes/${team.id}`)
  }
}
</script>

<template>
  <div class="min-h-screen pt-32 pb-20 px-6 font-montserrat text-white">
    <div class="max-w-xl mx-auto">
      <!-- Back link -->
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"/>
        </svg>
        Retour
      </RouterLink>

      <h1 class="text-4xl font-black font-montserratAlt mb-2">Créer une équipe</h1>
      <p class="text-white/50 mb-10">Créez votre équipe et invitez des membres à vous rejoindre.</p>

      <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
        <!-- Logo -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-white/80">Logo de l'équipe</label>
          <div class="flex items-center gap-5">
            <div class="w-20 h-20 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0">
              <img
                v-if="logoPreview"
                :src="logoPreview"
                alt="Aperçu logo"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-3xl font-black font-montserratAlt text-primary">
                {{ form.name.charAt(0).toUpperCase() || '?' }}
              </span>
            </div>
            <label class="cursor-pointer bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2 text-sm transition-colors">
              Choisir une image
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleLogoChange"
              />
            </label>
          </div>
        </div>

        <!-- Name -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-white/80">
            Nom de l'équipe <span class="text-white/60">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Ex: Les Monteurs Fous"
            maxlength="50"
            required
            class="bg-white rounded-xl py-2 px-4 text-black focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span class="text-white/30 text-xs self-end">{{ form.name.length }}/50</span>
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-white/80">Description</label>
          <textarea
            v-model="form.description"
            placeholder="Décrivez votre équipe en quelques mots..."
            maxlength="500"
            rows="4"
            class="bg-white rounded-xl py-2 px-4 text-black resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span class="text-white/30 text-xs self-end">{{ form.description.length }}/500</span>
        </div>

        <div v-if="error" class="flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-200 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="flex-shrink-0">
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"/>
          </svg>
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isLoading || !form.name.trim()"
          class="group mx-auto flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 text-lg font-bold transition-all duration-200 hover:bg-primary/80 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            class="transition-transform duration-300 group-hover:rotate-45"
            fill="currentColor"
          >
            <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"/>
          </svg>
          <span class="transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-8">
            {{ isLoading ? 'Création...' : 'Créer l\'équipe' }}
          </span>
        </button>
      </form>
    </div>
  </div>
</template>
