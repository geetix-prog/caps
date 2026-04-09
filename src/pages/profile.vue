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
  <div class="flex flex-col justify-center items-center w-full min-h-screen pt-28 sm:pt-0 pb-16 sm:pb-0 px-6 font-montserrat text-white gap-8">
    <h1 class="font-montserratAlt font-bold text-3xl sm:text-5xl text-center">
      Profil de <span class="capitalize text-primary">{{ userName }}</span>
    </h1>

    <form @submit.prevent="updateProfile" class="flex flex-col gap-4 w-full max-w-sm sm:max-w-none">
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
        <label class="sm:w-4/10">Votre Username :</label>
        <input
          v-model="form.username"
          class="bg-white rounded-xl w-full sm:w-100 py-1 px-3 text-black"
        />
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
        <label class="sm:w-4/10">Votre Email :</label>
        <input
          v-model="form.email"
          type="email"
          class="bg-white rounded-xl w-full sm:w-100 py-1 px-3 text-black"
        />
      </div>
      <div v-if="form.email !== userEmail" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
        <label class="sm:w-4/10">Mot de passe actuel :</label>
        <input
          v-model="form.password"
          class="bg-white rounded-xl w-full sm:w-100 py-1 px-3 text-black"
          type="password"
          required
          placeholder="Requis pour changer l'email"
        />
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
        <label class="sm:w-4/10">Votre Avatar :</label>
        <div class="flex items-center gap-3">
          <img :src="avatarPreview" class="w-15 h-15 object-cover rounded-full flex-shrink-0" alt="Votre avatar" />
          <input type="file" accept="image/*" @change="onAvatarChange" class="text-sm" />
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSaving"
        class="bg-primary px-5 py-2 rounded-full font-bold cursor-pointer"
      >
        {{ isSaving ? 'Sauvegarde...' : 'Sauvegarder' }}
      </button>
    </form>

    <button @click="auth.logout()" class="text-secondary bg-white px-5 py-2 rounded-full font-bold cursor-pointer border-b-4 hover:border-b-6 transition-all ease duration-150">
      {{ isLoading ? 'Déconnexion...' : 'Déconnexion' }}
    </button>
  </div>
</template>