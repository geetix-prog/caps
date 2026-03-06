import { ref, onMounted, onUnmounted } from 'vue'

export function useTabAttention(message = '😢 Reviens stp...', originalTitle?: string) {
  const isAway = ref(false)
  const savedTitle = originalTitle ?? document.title

  function onVisibilityChange() {
    if (document.hidden) {
      isAway.value = true
      document.title = message
    } else {
      isAway.value = false
      document.title = savedTitle
    }
  }

  onMounted(() => document.addEventListener('visibilitychange', onVisibilityChange))
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    document.title = savedTitle
  })

  return { isAway }
}
