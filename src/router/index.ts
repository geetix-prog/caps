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
      meta: {
        title: 'CAPS — Association streaming étudiante MMI Montbéliard',
        description: "CAPS est l'association de streaming et création audiovisuelle des étudiants en MMI à l'IUT de Montbéliard. Émissions, lives, équipes et contenus créatifs.",
      },
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPage,
      meta: {
        title: 'Connexion / Inscription — CAPS',
        description: 'Rejoignez la plateforme CAPS pour accéder aux équipes, émissions et contenus des étudiants MMI de Montbéliard.',
      },
    },
    {
      path: '/profile',
      component: () => import('@/pages/profile.vue'),
      meta: {
        title: 'Mon profil — CAPS',
        description: 'Gérez votre profil sur la plateforme CAPS.',
      },
    },
    {
      path: '/redif',
      component: () => import('@/pages/redif.vue'),
      meta: {
        title: 'Rediffusions — CAPS',
        description: 'Retrouvez toutes les émissions en rediffusion de l\'association CAPS, la plateforme streaming MMI Montbéliard.',
      },
    },
    {
      path: '/equipes',
      component: () => import('@/pages/equipes/index.vue'),
      meta: {
        title: 'Équipes — CAPS',
        description: 'Rejoignez ou créez une équipe sur CAPS, la plateforme des étudiants MMI de Montbéliard.',
      },
    },
    {
      path: '/equipes/creer',
      component: () => import('@/pages/equipes/creer.vue'),
      meta: {
        title: 'Créer une équipe — CAPS',
        description: 'Créez votre équipe sur CAPS et invitez des membres à vous rejoindre.',
      },
    },
    {
      path: '/equipes/:id',
      component: () => import('@/pages/equipes/detail.vue'),
      meta: {
        title: 'Équipe — CAPS',
        description: 'Découvrez cette équipe sur CAPS, la plateforme des étudiants MMI de Montbéliard.',
      },
    },
    {
      path: '/500',
      component: () => import('@/pages/ServerError.vue'),
      meta: { title: 'Erreur serveur — CAPS', description: '' },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/NotFound.vue'),
      meta: { title: 'Page introuvable — CAPS', description: '' },
    },
  ],
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  const description = to.meta.description as string | undefined

  if (title) document.title = title

  const descEl = document.querySelector('meta[name="description"]')
  if (descEl && description) descEl.setAttribute('content', description)

  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle && title) ogTitle.setAttribute('content', title)

  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc && description) ogDesc.setAttribute('content', description)

  const canonicalEl = document.querySelector('link[rel="canonical"]')
  if (canonicalEl) canonicalEl.setAttribute('href', `https://caps.mathis-guellati.fr${to.path}`)
})

export default router
