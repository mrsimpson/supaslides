import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Presentation, PresentationEvent, PresentationPeek } from '@/types/entities'
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { useUserSessionStore } from '@/stores/userSession'
import realtime from '@/lib/realtime'

export interface PresenterState {
  isInitialized: Boolean
  currentPresentationId: RemovableRef<Presentation['id']>
  joinedPresentations: RemovableRef<PresentationPeek[]>
  myEvents: RemovableRef<PresentationEvent[]>
  publicEvents: RemovableRef<PresentationEvent[]>
}

export const useAudienceStore = defineStore('audienceStore', {
  state: () =>
    ({
      isInitialized: false,
      currentPresentationId: useStorage('pinia/audience/currentPresentationId', 0),
      joinedPresentations: useStorage('pinia/audience/joinedPresentations', []),
      myEvents: useStorage('pinia/audience/myEvents', []),
      publicEvents: useStorage('pinia/audience/publicEvents', [])
    }) as PresenterState,
  getters: {
    currentPresentation: (state) => {
      return state.currentPresentationId
        ? state.joinedPresentations.filter((p) => p.id === state.currentPresentationId)[0]
        : null
    }
  },
  actions: {
    async listenToPresentationEvents() {
      await realtime(supabase).onPresentationEvent(this.currentPresentationId, (event) => {
        this.publicEvents.push(event)
      })
    },
    async initialize() {
      const { session } = useUserSessionStore()
      // this can only be initialized once the user has logged in
      if (session?.user.id) {
        // await this.syncMyPresentations()
        this.isInitialized = true
      }
      if (this.currentPresentationId) {
        await this.listenToPresentationEvents()
      }
    },
    async join(joinCode: Presentation['join_code']) {
      if (!joinCode) {
        throw new Error('No join code provided')
      }
      const { displayName, session, anonUuid } = useUserSessionStore()
      const { data: presentationPeek } = await supabase.rpc('presentation_peek', {
        t_join_code: joinCode
      })
      if (presentationPeek) {
        const { error } = await supabase.rpc('join_presentation', {
          t_join_code: joinCode,
          t_user_alias: displayName,
          u_user_uuid: session?.user.id,
          u_user_anon_uuid: anonUuid
        })

        if (!error && presentationPeek.id) {
          this.currentPresentationId = presentationPeek.id
          this.joinedPresentations.push(presentationPeek)
          await this.listenToPresentationEvents()
        }
      }
    },

    async insertEvent(eventType: PresentationEvent['type'], value: any) {
      const { displayName, anonUuid, session } = useUserSessionStore()

      const event: Partial<PresentationEvent> = {
        presentation: this.currentPresentationId,
        type: eventType,
        created_at: new Date().toISOString(),
        value: JSON.stringify(value),
        created_by: session?.user.id,
        created_by_alias: displayName,
        created_by_anon_uuid: anonUuid
      }
      const { error } = await supabase
        .from('presentation_events')
        .insert(event as PresentationEvent)

      if (error) {
        throw error
      }
      this.myEvents.push(event as PresentationEvent)
    },

    async react(emoticon: string, emojiText: string) {
      await this.insertEvent('reaction', { emoticon, emojiText })
    },

    async comment(commentText: string) {
      await this.insertEvent('comment', { commentText })
    }
  }
})
