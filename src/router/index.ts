import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '../pages/index.vue'
import AuthPage from '../pages/auth.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexPage,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPage,
    },
    {
      path: '/profile',
      component: () => import('@/pages/profile.vue'),
    },
    {
      path: '/redif',
      component: () => import('@/pages/redif.vue'),
    },
    {
      path: '/equipes',
      component: () => import('@/pages/equipes/index.vue'),
    },
    {
      path: '/equipes/creer',
      component: () => import('@/pages/equipes/creer.vue'),
    },
    {
      path: '/equipes/:id',
      component: () => import('@/pages/equipes/detail.vue'),
    },
  ],
})

export default router
