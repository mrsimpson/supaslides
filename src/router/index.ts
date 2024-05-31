import { createRouter, createWebHistory } from 'vue-router'
import IntroView from '@/views/IntroView.vue'
import ImprintView from '@/views/ImprintView.vue'
import DataProtectionView from '@/views/DataProtectionView.vue'
import HelloWorld from '@/components/HelloWorld.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/intro',
      name: 'intro',
      component: IntroView
    },
    {
      path: '/',
      name: 'feedback',
      component: HelloWorld
    },
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

export default router
