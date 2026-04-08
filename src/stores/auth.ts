import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { currentUser, pb } from '@/plugins/pocketbase'
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

  async function updateProfile(data: { username: string; email: string; avatar: File | null; password?: string }) {
    if (!pb.authStore.record) return

    try {
      const formData = new FormData()
      formData.append('name', data.username)

      if (data.email !== pb.authStore.record.email && data.password) {
        formData.append('email', data.email)
        formData.append('oldPassword', data.password)
        formData.append('password', data.password)
        formData.append('passwordConfirm', data.password)
      }

      if (data.avatar) {
        formData.append('avatar', data.avatar)
      }

      const record = await pb.collection('users').update(pb.authStore.record.id, formData)
      user.value = record
    } catch (err: any) {
      console.log('Erreur PocketBase:', JSON.stringify(err.data))
      throw err
    }
  }

  async function register(
    email: string,
    password: string,
    passwordConfirm: string,
    name: string,
    avatar?: File | null,
  ): Promise<boolean> {
    isLoading.value = true
    authError.value = ''
    try {
      const payload: {
        email: string
        password: string
        passwordConfirm: string
        name: string
        avatar?: File
      } = {
        email: email.trim(),
        password,
        passwordConfirm,
        name: name.trim(),
      }

      if (avatar) {
        payload.avatar = avatar
      }

      await pb.collection('users').create(payload)
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
    updateProfile,
  }
  })

