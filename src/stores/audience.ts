import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Presentation, PresentationEvent, PresentationPeek } from '@/types/entities'
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { useUserSessionStore } from '@/stores/userSession'

export interface PresenterState {
  isInitialized: Boolean
  currentPresentationId: RemovableRef<Presentation['id']>
  joinedPresentations: RemovableRef<PresentationPeek[]>
  myEvents: RemovableRef<PresentationEvent[]>
}

export const useAudienceStore = defineStore('audienceStore', {
  state: () =>
    ({
      isInitialized: false,
      currentPresentationId: useStorage('pinia/audience/currentPresentationId', 0),
      joinedPresentations: useStorage('pinia/audience/joinedPresentations', []),
      myEvents: useStorage('pinia/audience/currentPresentationId', [])
    }) as PresenterState,
  getters: {
    currentPresentation: (state) => {
      return state.currentPresentationId
        ? state.joinedPresentations.filter((p) => p.id === state.currentPresentationId)[0]
        : null
    }
  },
  actions: {
    async initialize() {
      const { session } = useUserSessionStore()
      // this can only be initialized once the user has logged in
      if (session?.user.id) {
        // await this.syncMyPresentations()
        this.isInitialized = true
      }
    },
    async join(joinCode: Presentation['join_code']) {
      if (!joinCode) {
        throw new Error('No join code provided')
      }
      const { nickname } = useUserSessionStore()
      const { data: presentationPeek } = await supabase.rpc('presentation_peek', {
        t_join_code: joinCode
      })
      if (presentationPeek) {
        const { error } = await supabase.rpc('join_presentation', {
          t_join_code: joinCode,
          t_user_alias: nickname
        })

        if (!error) {
          this.currentPresentationId = presentationPeek.id!
          this.joinedPresentations = [...this.joinedPresentations, presentationPeek]
        }
      }
    },

    async react(emoji: String) {
      const { error } = await supabase.from('presentation_events').insert({
        presentation: this.currentPresentationId,
        type: 'reaction',
        created_at: new Date().toISOString(),
        value: JSON.stringify({ emoji })
      } as PresentationEvent)

      if (!error) {
        this.myEvents.push()
      }
    }
  }
})
