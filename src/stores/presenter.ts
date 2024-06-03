import { defineStore } from 'pinia'
import { useUserSessionStore } from '@/stores/userSession'
import { supabase } from '@/lib/supabase'
import type { Presentation } from '@/types/entities'

export interface PresenterState {
  isInitialized: Boolean
  currentPresentationId: Presentation['id'] | null
  myPresentations: Presentation[]
}

export const usePresenterStore = defineStore('presenterStore', {
  state: () =>
    ({
      isInitialized: false,
      currentPresentationId: null,
      myPresentations: [] as Presentation[]
    }) as PresenterState,
  getters: {
    activePresentation: (state) => state.myPresentations[0]
  },
  actions: {
    async initialize() {
      const { session } = useUserSessionStore()
      // this can only be initialized once the user has logged in
      if (session?.user.id) {
        await this.syncMyPresentations()
        this.isInitialized = true
      }
    },

    syncMyPresentations: async function () {
      const { session } = useUserSessionStore()
      if (session?.user.id) {
        const presentations = await supabase
          .from('presentations')
          .select()
          .eq('presenter', session.user.id)
        this.myPresentations = presentations.data || []
      }
    }
  }
})
