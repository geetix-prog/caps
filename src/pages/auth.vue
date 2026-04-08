<script setup lang="ts">
import Canette1 from '@/assets/canette1.webp'
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const { isLoading, authError } = storeToRefs(authStore)
const route = useRoute()
const buttonStat = ref(route.query.mode !== 'register')
const { login, register, clearError } = authStore

const balayage = () => {
  buttonStat.value = !buttonStat.value
}

const loginForm = reactive({
  identity: '',
  password: '',
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
})
const avatarFile = ref<File | null>(null)

function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  avatarFile.value = target.files?.[0] ?? null
  clearError()
}

async function handleLogin() {
  const isOk = await login(loginForm.identity, loginForm.password)
  if (isOk) {
    router.push('/').then(() => router.go(0))  }
}

async function handleRegister() {
  const isOk = await register(
    registerForm.email,
    registerForm.password,
    registerForm.passwordConfirm,
    registerForm.name,
    avatarFile.value,
  )

  if (isOk) {
    window.location.reload()
    router.push('/').then(() => router.go(0))
  } 
}
</script>

<template>
  <div class="w-full text-white font-montserrat flex">
    <div class="flex flex-col w-1/2 h-screen justify-center space-y-15 items-center">
      <h1 class="font-black text-4xl font-montserratAlt">Login</h1>
      <form class="flex flex-col gap-5" @submit.prevent="handleLogin">
        <div class="label-in flex flex-col gap-5">
          <label>Email ou username</label>
          <input
            v-model="loginForm.identity"
            class="bg-white rounded-xl w-100 py-1 px-3 text-black"
            type="text"
            required
            autocomplete="username"
            @input="clearError"
          />
        </div>
        <div class="label-in flex flex-col gap-2">
          <label>Password</label>
          <input
            v-model="loginForm.password"
            class="bg-white rounded-xl w-100 py-1 px-3 text-black"
            type="password"
            required
            autocomplete="current-password"
            @input="clearError"
          />
        </div>
        <p v-if="authError && buttonStat" class="max-w-100 text-sm text-red-300">{{ authError }}</p>
        <button
          type="submit"
          :disabled="isLoading"
          class="group mx-auto mt-2 flex items-center gap-2 overflow-hidden rounded-full bg-primary px-4 py-3 text-lg text-white transition-all duration-200 hover:bg-primary/85 active:scale-95 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-2/2 group-focus:translate-x-100 group-hover:scale-110"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
          <span
            class="transition-all duration-300 group-hover:translate-x-8 group-focus:translate-x-100 group-hover:opacity-0"
            >{{ isLoading ? 'Connexion...' : 'Connexion' }}</span
          >
        </button>
      </form>
    </div>
    <div class="flex flex-col w-1/2 h-screen justify-center space-y-15 items-center">
      <h1 class="font-black text-4xl font-montserratAlt">Register</h1>
      <form class="flex flex-col gap-5" @submit.prevent="handleRegister">
        <div class="label-in flex flex-col gap-5">
          <label>Username</label>
          <input
            v-model="registerForm.name"
            class="bg-white rounded-xl w-100 py-1 px-3 text-black"
            type="text"
            required
            autocomplete="name"
            @input="clearError"
          />
        </div>
        <div class="label-in flex flex-col gap-2">
          <label>Email</label>
          <input
            v-model="registerForm.email"
            class="bg-white rounded-xl w-100 py-1 px-3 text-black"
            type="email"
            required
            autocomplete="email"
            @input="clearError"
          />
        </div>
        <div class="label-in flex flex-col gap-2">
          <label>Avatar</label>
          <input    
            class="bg-white rounded-xl w-100 py-1 px-3 text-black"
            type="file"
            accept="image/*"
            @change="handleAvatarChange"
          />
        </div>
        <div class="label-in flex flex-col gap-2">
          <label>Password</label>
          <input
            v-model="registerForm.password"
            class="bg-white rounded-xl w-100 py-1 px-3 text-black"
            type="password"
            required
            autocomplete="new-password"
            @input="clearError"
          />
        </div>
        <div class="label-in flex flex-col gap-2">
          <label>Password verif</label>
          <input
            v-model="registerForm.passwordConfirm"
            class="bg-white rounded-xl w-100 py-1 px-3 text-black"
            type="password"
            required
            autocomplete="new-password"
            @input="clearError"
          />
        </div>
        <p v-if="authError && !buttonStat" class="max-w-100 text-sm text-red-300">
          {{ authError }}
        </p>
        <button
          type="submit"
          :disabled="isLoading"
          class="group mx-auto mt-2 flex items-center gap-2 overflow-hidden rounded-full bg-primary px-4 py-3 text-lg text-white transition-all duration-200 hover:bg-primary/85 active:scale-95 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-2/2 group-focus:translate-x-100 group-hover:scale-110"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
          <span
            class="transition-all duration-300 group-hover:translate-x-8 group-focus:translate-x-100 group-hover:opacity-0"
            >{{ isLoading ? 'Inscription...' : 'Inscription' }}</span
          >
        </button>
      </form>
    </div>
    <div
      id="balayage"
      @click="balayage"
      class="absolute h-screen w-1/2 bg-primary transition-all duration-50 top-0 right-0 flex space-y-10 flex-col justify-center items-center hover:cursor-pointer z-5"
      :style="{
        transform: buttonStat ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'all 0.5s ease-in-out',
      }"
    >
      <img :src="Canette1" class="rotate-10 h-50 animate-float" alt="logo caps" />
      <p class="text-white font-black">
        Cliquez ici pour vour {{ buttonStat ? 'inscrire' : 'connecter' }}
      </p>
    </div>
  </div>
</template>
