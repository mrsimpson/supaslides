import { defineStore } from 'pinia'
import { useUserSessionStore } from '@/stores/userSession'
import { supabase } from '@/lib/supabase'
import type { Presentation } from '@/types/entities'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

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
    currentPresentation: (state) => {
      return state.currentPresentationId
        ? state.myPresentations.filter((p) => p.id === state.currentPresentationId)[0]
        : null
    },
    nonCurrentPresentations: (state) => {
      return state.currentPresentationId
        ? state.myPresentations.filter((p) => p.id !== state.currentPresentationId)
        : state.myPresentations
    }
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
        this.myPresentations = [...(presentations.data || [])]

        // set up reactivity
        const handlePresentationChanges = (
          payload: RealtimePostgresChangesPayload<Presentation>
        ) => {
          switch (payload.eventType) {
            case 'INSERT':
              this.myPresentations = this.myPresentations.concat(payload.new)
              break
            case 'UPDATE':
              this.myPresentations = this.myPresentations
                .filter((p) => p.id !== payload.old.id)
                .concat(payload.new)
              break
            case 'DELETE':
              this.myPresentations = this.myPresentations = this.myPresentations.filter(
                (p) => p.id !== payload.old.id
              )
              break
          }
        }

        supabase
          .channel('presentations')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'presentations',
              filter: `presenter=eq.${session.user.id}`
            },
            handlePresentationChanges
          )
          .subscribe()

        // set up reactivity for events of the current presentation
        supabase
          .channel('presentation_events')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'presentation_events',
              filter: `presentation=eq.${this.currentPresentationId}`
            },
            (payload) => {
              console.log('PRESENTATION_EVENTS', payload)
            }
          )
          .subscribe()
      }
    }
  }
})
