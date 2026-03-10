import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { pb } from '@/plugins/pocketbase'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const isLoading = ref(false)
  const authError = ref('')

  // Source unique de vérité — synchronisée via le callback PocketBase
  const user = ref(pb.authStore.record)

  pb.authStore.onChange((_token, record) => {
    user.value = record
  })

  // Computed dérivés
  const isAuthenticated = computed(() => pb.authStore.isValid && !!user.value)
  const userName = computed(() => user.value?.name || user.value?.username || '')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => {
    if (!user.value?.avatar) return ''
    return pb.files.getURL(user.value, user.value.avatar)
  })

  function clearError() {
    authError.value = ''
  }

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    return 'Une erreur est survenue.'
  }

  async function login(identity: string, password: string): Promise<boolean> {
    isLoading.value = true
    authError.value = ''
    try {
      await pb.collection('users').authWithPassword(identity.trim(), password)
      return true
    } catch (error) {
      authError.value = getErrorMessage(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function register(
    email: string,
    password: string,
    passwordConfirm: string,
    name: string,
  ): Promise<boolean> {
    isLoading.value = true
    authError.value = ''
    try {
      await pb.collection('users').create({
        email: email.trim(),
        password,
        passwordConfirm,
        name: name.trim(),
      })
      await pb.collection('users').authWithPassword(email.trim(), password)
      return true
    } catch (error) {
      authError.value = getErrorMessage(error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function refreshUser() {
    try {
      if (!pb.authStore.isValid) return null
      const authData = await pb.collection('users').authRefresh()
      return authData.record
    } catch {
      pb.authStore.clear()
      return null
    }
  }

  function logout() {
    pb.authStore.clear()
    router.push('/')
  }

  return {
    user,
    isLoading,
    authError,
    isAuthenticated,
    userName,
    userEmail,
    userAvatar,
    clearError,
    login,
    register,
    refreshUser,
    logout,
  }
})
