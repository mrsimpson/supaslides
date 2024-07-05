// src/stores/audience.ts
import { defineStore } from 'pinia'
import { createBackend } from '@/api/supabaseBackend'
import type {
  CreatePresentationEvent,
  Presentation,
  PresentationEvent,
  PresentationPeek
} from 'src/api/types/entities'
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { useUserSessionStore } from '@/stores/userSession'
import type { Backend } from '@/api/Backend'

const backend: Backend = createBackend()

export interface AudienceState {
  isInitialized: boolean
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
    }) as AudienceState,
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
      if (session?.user.id) {
        this.isInitialized = true
      }
      if (this.currentPresentationId) {
        this.listenToPresentationEvents()
      }
    },
    listenToPresentationEvents() {
      backend.listenToPresentationEvents(this.currentPresentationId, (event) => {
        this.publicEvents.push(event)
      })
    },
    async join(joinCode: Presentation['join_code']) {
      if (!joinCode) {
        throw new Error('No join code provided')
      }

      const presentationPeek = await backend.joinPresentation(joinCode)

      if (presentationPeek?.id) {
        this.currentPresentationId = presentationPeek.id
        this.joinedPresentations.push(presentationPeek)
        this.listenToPresentationEvents()
      }
    },
    async insertEvent(eventType: PresentationEvent['type'], value: any) {
      const { displayName, anonUuid, session } = useUserSessionStore()

      const event: CreatePresentationEvent = {
        type: eventType,
        created_at: new Date().toISOString(),
        value: JSON.stringify(value),
        created_by: session?.user.id,
        created_by_alias: displayName,
        created_by_anon_uuid: anonUuid
      }

      await backend.createEvent(this.currentPresentationId, event)

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
