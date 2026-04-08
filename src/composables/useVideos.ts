import { ref } from 'vue'
import { pb } from '@/plugins/pocketbase'

export interface Video {
  id: string
  videoId: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  channelTitle: string
}

export function useVideos() {
  const videos = ref<Video[]>([])
  const isLoading = ref(false)
  const error = ref('')

  async function fetchVideos(page = 1, perPage = 12) {
    isLoading.value = true
    error.value = ''
    try {
      const result = await pb.collection('videos').getList<Video>(page, perPage, {
        sort: '-publishedAt',
      })
      videos.value = result.items
      return result // contient totalPages, totalItems pour la pagination
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des vidéos'
      console.error('Erreur fetch vidéos:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchLatest(count = 3) {
    isLoading.value = true
    try {
      const result = await pb.collection('videos').getList<Video>(1, count, {
        sort: '-publishedAt',
      })
      videos.value = result.items
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Temps réel — les nouvelles vidéos apparaissent sans refresh
  function subscribeToVideos() {
    pb.collection('videos').subscribe('*', (e) => {
      if (e.action === 'create') {
        videos.value.unshift(e.record as unknown as Video)
      }
    })
  }

  function unsubscribeFromVideos() {
    pb.collection('videos').unsubscribe('*')
  }

  return {
    videos,
    isLoading,
    error,
    fetchVideos,
    fetchLatest,
    subscribeToVideos,
    unsubscribeFromVideos,
  }
}