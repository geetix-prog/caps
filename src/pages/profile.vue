<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const auth = useAuthStore();
const { userName, userEmail, userAvatar, isLoading } = storeToRefs(auth);

// Refs locales pour le formulaire
const form = ref({
  username: '',
  email: '',
  avatar: null as File | null,
  password:'',
  passwordConfirm:''
})
const avatarPreview = ref('');
const isSaving = ref(false);

onMounted(() => {
  form.value.username = userName.value
  form.value.email = userEmail.value
  avatarPreview.value = userAvatar.value
})

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    form.value.avatar = file
    avatarPreview.value = URL.createObjectURL(file)
  }
}

async function updateProfile() {
  isSaving.value = true
  try {
    await auth.updateProfile(form.value)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full min-h-screen pt-28 pb-16 px-6 font-montserrat text-white gap-8">
    <h1 class="font-montserratAlt font-bold text-3xl sm:text-5xl text-center">
      Profil de <span class="capitalize text-primary">{{ userName }}</span>
    </h1>

    <form @submit.prevent="updateProfile" class="flex flex-col gap-5 w-full max-w-lg">

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-white/70">Votre Username</label>
        <input
          v-model="form.username"
          class="bg-white rounded-xl w-full py-2 px-4 text-black focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-white/70">Votre Email</label>
        <input
          v-model="form.email"
          type="email"
          class="bg-white rounded-xl w-full py-2 px-4 text-black focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div v-if="form.email !== userEmail" class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-white/70">Mot de passe actuel</label>
        <input
          v-model="form.password"
          class="bg-white rounded-xl w-full py-2 px-4 text-black focus:outline-none focus:ring-2 focus:ring-primary"
          type="password"
          required
          placeholder="Requis pour changer l'email"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold text-white/70">Votre Avatar</label>
        <div class="flex items-center gap-4">
          <img :src="avatarPreview" class="w-16 h-16 object-cover rounded-full flex-shrink-0 border-2 border-white/20" alt="Votre avatar" />
          <label class="cursor-pointer bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2 text-sm transition-colors">
            Choisir une image
            <input type="file" accept="image/*" @change="onAvatarChange" class="hidden" />
          </label>
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSaving"
        class="bg-primary hover:bg-primary/80 px-6 py-2.5 rounded-full font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
      >
        {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder' }}
      </button>
    </form>

    <button @click="auth.logout()" class="text-secondary bg-white px-5 py-2 rounded-full font-bold cursor-pointer border-b-4 hover:border-b-6 transition-all ease duration-150">
      {{ isLoading ? 'Déconnexion...' : 'Déconnexion' }}
    </button>
  </div>
</template>