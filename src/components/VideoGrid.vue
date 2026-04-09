<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useVideos } from '@/composables/useVideos'

const props = withDefaults(defineProps<{
  limit?: number
  showPagination?: boolean
}>(), {
  limit: 6,
  showPagination: false,
})

const { videos, isLoading, error, fetchVideos, fetchLatest, subscribeToVideos, unsubscribeFromVideos } = useVideos()
const activeVideo = ref<string | null>(null)

onMounted(async () => {
  if (props.showPagination) {
    await fetchVideos(1, props.limit)
  } else {
    await fetchLatest(props.limit)
  }
  subscribeToVideos()
})

onUnmounted(() => {
  unsubscribeFromVideos()
})

function playVideo(videoId: string) {
  activeVideo.value = videoId
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <section class="w-full">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="text-red-300 text-center py-8">
      {{ error }}
    </div>

    <!-- Grille vidéos -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="video in videos"
        :key="video.videoId"
        class="group rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm
               hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]
               hover:shadow-lg hover:shadow-primary/20"
      >
        <!-- Thumbnail ou Player -->
        <div class="relative aspect-video cursor-pointer" @click="playVideo(video.videoId)">
          <!-- Player YouTube (si cliqué) -->
          <iframe
            v-if="activeVideo === video.videoId"
            :src="`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`"
            class="absolute inset-0 w-full h-full"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          />

          <!-- Thumbnail (par défaut) -->
          <template v-else>
            <img
              :src="video.thumbnail"
              :alt="video.title"
              class="w-full h-full object-cover transition-transform duration-500
                     group-hover:scale-105"
            />
            <!-- Overlay play -->
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center
                          shadow-lg shadow-primary/50 transition-transform duration-300
                          group-hover:scale-110">
                <svg class="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            <!-- Badge "Nouveau" si moins de 7 jours -->
            <div
              v-if="(Date.now() - new Date(video.publishedAt).getTime()) < 7 * 86400000"
              class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold
                     px-2 py-1 rounded-full uppercase tracking-wider animate-pulse"
            >
              Nouveau
            </div>
          </template>
        </div>

        <!-- Info -->
        <div class="p-4">
          <h3 class="text-white font-semibold line-clamp-2 group-hover:text-primary
                     transition-colors duration-300">
            {{ video.title }}
          </h3>
          <p class="text-white/50 text-sm mt-2">
            {{ formatDate(video.publishedAt) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>