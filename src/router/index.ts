import { createRouter, createWebHistory } from 'vue-router'
import IntroView from '@/views/IntroView.vue'
import ImprintView from '@/views/ImprintView.vue'
import DataProtectionView from '@/views/DataProtectionView.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import { userSessionStore } from '@/stores/userSession'
import AccountView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld,
      props: { msg: '🏠' }
    },
    {
      path: '/intro',
      name: 'intro',
      component: IntroView
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: HelloWorld,
      props: { msg: 'Feedback' }
    },
    {
      path: '/presenter',
      name: 'presenter',
      component: HelloWorld,
      props: { msg: 'Presenter' },
      meta: { needsAuth: true }
    },
    { path: '/me', name: 'me', component: AccountView },
    {
      path: '/imprint',
      name: 'imprint',
      component: () => import('@/views/ImprintView.vue')
    },
    {
      path: '/data-protection',
      name: 'data-protection',
      component: () => import('@/views/DataProtectionView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userSession = userSessionStore()

  if (to?.meta.needsAuth) {
    if (userSession.session) {
      return next()
    } else {
      return next('/login')
    }
  }
  return next()
})

export default router
