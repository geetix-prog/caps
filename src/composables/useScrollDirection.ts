import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollDirection(threshold = 10) {
  const isHidden = ref(false)
  let lastScrollY = 0

  function onScroll() {
    const currentY = window.scrollY
    if (Math.abs(currentY - lastScrollY) < threshold) return

    isHidden.value = currentY > lastScrollY && currentY > 50
    lastScrollY = currentY
  }

  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return { isHidden }
}