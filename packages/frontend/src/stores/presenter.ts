import { defineStore } from 'pinia'
import { useUserSessionStore } from '@/stores/userSession'
import type { Backend } from '@/api/Backend'
import { createBackend } from '@/api/supabaseBackend'
import type {
  Acknowledgement,
  CreatePresentation,
  Presentation,
  PresentationChange,
  PresentationEvent
} from 'src/api/types/entities'
import { upsertObjectInArray } from '@/lib/array'
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

const backend: Backend = createBackend()

export interface PresenterState {
  isInitialized: boolean
  currentPresentationId: RemovableRef<Presentation['id']>
  myPresentations: Presentation[]
  myPresentationEvents: PresentationEvent[]
}

async function handleAcknowledgement<Database, SchemaName>(
  acknowledgment: Acknowledgement,
  presentationId: number
) {
  if (acknowledgment && acknowledgment.id) {
    if (acknowledgment.entity === 'presentation_events') {
      const event = await backend.fetchEventById(acknowledgment.id)
      if (event) {
        //TODO: Encrypt payload with joinCode
        if (event && event.is_public) await backend.notifyAudience(presentationId, event)
      }
    }
  }
}

export const usePresenterStore = defineStore('presenterStore', {
  state: () =>
    ({
      isInitialized: false,
      currentPresentationId: useStorage('pinia/presenter/currentPresentationId', 0),
      myPresentations: [] as Presentation[],
      myPresentationEvents: [] as PresentationEvent[]
    }) as PresenterState,
  getters: {
    currentPresentation: (state) => {
      return state.currentPresentationId
        ? state.myPresentations.find((p) => p.id === state.currentPresentationId)
        : null
    },
    nonCurrentPresentations: (state) => {
      return state.currentPresentationId
        ? state.myPresentations.filter((p) => p.id !== state.currentPresentationId)
        : []
    }
  },
  actions: {
    async initialize() {
      const { session } = useUserSessionStore()
      // this can only be initialized once the user has logged in
      if (session?.user.id) {
        await this.syncMyPresentations()
        if (!this.currentPresentationId && this.myPresentations.length) {
          this.currentPresentationId = this.myPresentations[0].id
        }
        this.setActivePresentation(this.currentPresentationId)
        this.isInitialized = true
      }
    },
    setActivePresentation(presentationId: Presentation['id']) {
      this.currentPresentationId = presentationId
      this.syncPresentationEvents(presentationId).then(() => console.log('Events synced'))
    },
    async startPresentation(presentationId: Presentation['id']) {
      const acknowledgment = await backend.startPresentation(presentationId)
      return handleAcknowledgement(acknowledgment, presentationId)
    },
    async stopPresentation(presentationId: Presentation['id']) {
      const acknowledgment = await backend.stopPresentation(presentationId)
      return handleAcknowledgement(acknowledgment, presentationId)
    },
    async deletePresentation(presentationId: Presentation['id']) {
      return backend.deletePresentation(presentationId)
    },
    async broadcast(presentationId: Presentation['id'], message: string) {
      await backend.createBroadcastMessage(presentationId, message)
    },
    async createPresentation(presentation: CreatePresentation): Promise<Presentation | null> {
      return backend.createPresentation(presentation)
      // we don't need to handle anything as we've subscribed to the presentation change notifications
    },
    async syncMyPresentations() {
      const { session } = useUserSessionStore()
      if (session?.user.id) {
        this.myPresentations = await backend.fetchPresentationsOfUser(session.user.id)

        // set up reactivity
        const handlePresentationChanges = (payload: PresentationChange) => {
          switch (payload.eventType) {
            case 'INSERT':
              this.myPresentations.push(payload.new)
              break
            case 'UPDATE':
              this.myPresentations = upsertObjectInArray(this.myPresentations, payload.new, 'id')
              break
            case 'DELETE':
              this.myPresentations = this.myPresentations.filter((p) => p.id !== payload.old.id)
              break
          }
        }
        backend.listenToPresentationChanges(session.user.id, handlePresentationChanges)
      }
    },
    async syncPresentationEvents(presentationId: Presentation['id']) {
      const { session } = useUserSessionStore()
      if (session && presentationId) {
        const presentation = await backend.fetchPresentationById(presentationId)
        if (!presentation) {
          console.error('Presentation', presentationId, 'was not found with this presenter')
          return
        } else {
          const presentationEvents = await backend.fetchPresentationEvents(presentationId)

          if (presentationEvents) {
            // @ts-ignore – PresentationEvent is potentially deep due to the generic value.
            this.myPresentationEvents = presentationEvents
          }

          // set up reactivity for events of the current presentation
          const handlePresentationEvents = (event: PresentationEvent) => {
            //we're effectively listening on public broadcasts and postgres updates, to we might get the presenter's own events twice
            // @ts-ignore – PresentationEvent is potentially deep due to the generic value.
            if (!this.myPresentationEvents.find((e) => e.id === event.id))
              this.myPresentationEvents.push(event)
          }
          backend.listenToPresentationEvents(presentationId, handlePresentationEvents)
        }
      }
    }
  }
})
