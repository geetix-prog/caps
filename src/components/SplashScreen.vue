<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Canette1 from '@/assets/canette1.webp'
import Canette2 from '@/assets/canette2.webp'

const visible = ref(true)
const leaving = ref(false)

onMounted(() => {
  setTimeout(() => {
    leaving.value = true
    setTimeout(() => {
      visible.value = false
    }, 600)
  }, 1800)
})
</script>

<template>
  <div v-if="visible" class="splash" :class="{ 'splash--exit': leaving }">
    <div class="splash__grid" />

    <div class="splash__content">
      <img :src="Canette1" class="splash__can splash__can--left" alt="" />

      <div class="splash__center">
        <img src="/favicon.svg" class="splash__logo" alt="CAPS" />
        <h1 class="splash__title">CAPS</h1>
      </div>

      <img :src="Canette2" class="splash__can splash__can--right" alt="" />
    </div>
  </div>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f47632;
  overflow: hidden;
}

.splash__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 75px 75px;
}

.splash__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

/* Center logo + title */
.splash__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.splash__logo {
  width: clamp(50px, 10vw, 80px);
  height: clamp(50px, 10vw, 80px);
  border-radius: 50%;
}

.splash__title {
  font-family: 'Montserrat Alternates', sans-serif;
  font-weight: 900;
  font-size: clamp(48px, 12vw, 80px);
  color: white;
  margin: 0;
  line-height: 1;
}

/* Canettes */
.splash__can {
  width: clamp(60px, 15vw, 120px);
  opacity: 0;
}

.splash__can--left {
  transform: translateX(-120px) rotate(-30deg);
  animation: canLeft 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
  animation-delay: 0.5s;
}

.splash__can--right {
  transform: translateX(120px) rotate(30deg);
  animation: canRight 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
  animation-delay: 0.5s;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes canLeft {
  from { opacity: 0; transform: translateX(-120px) rotate(-40deg); }
  to   { opacity: 1; transform: translateX(0) rotate(-20deg); }
}

@keyframes canRight {
  from { opacity: 0; transform: translateX(120px) rotate(40deg); }
  to   { opacity: 1; transform: translateX(0) rotate(20deg); }
}

/* Exit */
.splash--exit {
  animation: splashOut 0.6s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}

@keyframes splashOut {
  to {
    transform: scale(1.08);
    opacity: 0;
  }
}
</style>
