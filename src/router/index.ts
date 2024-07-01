import { createRouter, createWebHistory } from 'vue-router'
import IntroView from '@/views/IntroView.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import { useUserSessionStore } from '@/stores/userSession'
import AccountView from '@/views/ProfileView.vue'
import PresenterView from '@/views/PresenterView.vue'
import JoinView from '@/views/JoinView.vue'
import FeedbackView from '@/views/FeedbackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld,
      props: { msg: '🏠' },
      meta: { needsAuth: true }
    },
    {
      path: '/intro',
      name: 'intro',
      component: IntroView,
      meta: { needsAuth: false }
    },
    { path: '/join', name: 'join', component: JoinView },
    {
      path: '/feedback',
      name: 'feedback',
      component: FeedbackView,
      meta: { needsAuth: false }
    },
    {
      path: '/presentations/:presentationId',
      name: 'presentation',
      component: PresenterView,
      meta: { needsAuth: true }
    },
    {
      path: '/presentations',
      name: 'presentations',
      component: PresenterView,
      meta: { needsAuth: true }
    },
    { path: '/me', name: 'me', component: AccountView },
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
  const userSession = useUserSessionStore()

  if (to?.meta.needsAuth) {
    if (userSession.session) {
      return next()
    } else {
      return next('/me')
    }
  }
  return next()
})

export default router
