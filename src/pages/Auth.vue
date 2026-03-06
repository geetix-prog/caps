<script setup lang="ts">
import { ref } from 'vue'
import A from '../assets/logo.svg'
const buttonStat = ref(true)

function balayage() {
  buttonStat.value = !buttonStat.value
  console.log('Etat du bouton', buttonStat)
}
</script>

<template>
  <div class="w-full text-pink-600 flex">
    <div class="flex flex-col w-1/2 h-screen justify-center space-y-15 items-center">
      <h1 class="font-black text-4xl">Login</h1>
      <form class="flex flex-col gap-5">
        <div class="label-in flex flex-col gap-5">
          <label>Username</label>
          <input
            class="border border-pink-600 rounded-xl w-100 py-1 px-3 text-pink-600"
            type="text"
          />
        </div>
        <div class="label-in flex flex-col gap-2">
          <label>Password</label>
          <input
            class="border border-pink-600 rounded-xl w-100 py-1 px-3 text-pink-600"
            type="password"
          />
        </div>
      </form>
    </div>
    <div class="flex flex-col w-1/2 h-screen justify-center space-y-15 items-center">
      <h1 class="font-black text-4xl">Register</h1>
      <form class="flex flex-col gap-5">
        <div class="label-in flex flex-col gap-5">
          <label>Username</label>
          <input
            class="border border-pink-600 rounded-xl w-100 py-1 px-3 text-pink-600"
            type="text"
          />
        </div>
        <div class="label-in flex flex-col gap-2">
          <label>Password</label>
          <input
            class="border border-pink-600 rounded-xl w-100 py-1 px-3 text-pink-600"
            type="password"
          />
        </div>
        <div class="label-in flex flex-col gap-2">
          <label>Password verif</label>
          <input
            class="border border-pink-600 rounded-xl w-100 py-1 px-3 text-pink-600"
            type="password"
          />
        </div>
        <button
          class="border border-pink-600 mt-10 w-25 py-2 rounded-2xl mx-auto hover:bg-pink-600 cursor-pointer transition-transform"
        >
          Send
        </button>
      </form>
    </div>
    <div
      id="balayage"
      @click="balayage"
      class="absolute h-screen w-1/2 bg-pink-600 hover:bg-pink-500 transition-all duration-50 top-0 right-0 flex flex-col justify-center items-center hover:cursor-pointer"
      :style="{
        transform: buttonStat ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'all 0.5s ease-in-out',
      }"
    >
      <img :src="A" alt="logo" class="w-50 h-50 mb-4" />
      <p class="text-white font-black">
        Cliquez ici pour vour {{ buttonStat ? 'inscrire' : 'connecter' }}
      </p>
    </div>
  </div>
</template>
