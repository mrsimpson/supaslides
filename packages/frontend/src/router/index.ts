import { createRouter, createWebHashHistory } from 'vue-router'
import IntroView from '@/views/IntroView.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import { useUserSessionStore } from '@/stores/userSession'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld,
      props: { msg: '🏠' },
      meta: { needsAuth: false }
    },
    {
      path: '/intro',
      name: 'intro',
      component: IntroView,
      meta: { needsAuth: false }
    },
    { path: '/join', name: 'join', component: () => import('@/views/JoinView.vue') },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/views/AudienceView.vue'),
      meta: { needsAuth: false }
    },
    {
      path: '/presentations/:presentationId',
      name: 'presentation',
      component: () => import('@/views/PresenterView.vue'),
      meta: { needsAuth: true }
    },
    {
      path: '/presentations/new',
      name: 'newPresentation',
      component: () => import('@/views/PresenterView.vue'),
      meta: { needsAuth: true }
    },
    {
      path: '/presentations',
      name: 'presentations',
      component: () => import('@/views/PresenterView.vue'),
      meta: { needsAuth: true }
    },
    { path: '/me', name: 'me', component: () => import('@/views/ProfileView.vue') },
    {
      path: '/imprint',
      name: 'imprint',
      component: () => import('@/views/ImprintView.vue'),
      meta: { needsAuth: false }
    },
    {
      path: '/data-protection',
      name: 'data-protection',
      component: () => import('@/views/DataProtectionView.vue'),
      meta: { needsAuth: false }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { isSignedIn } = useUserSessionStore()
  console.log(
    'Navigate to: ',
    to.path || to.name,
    `${isSignedIn ? 'authenticated' : 'not authenticated'}`
  )

  if (to?.meta.needsAuth) {
    if (isSignedIn) {
      return next()
    } else {
      return next('/me')
    }
  }
  return next()
})

export default router
