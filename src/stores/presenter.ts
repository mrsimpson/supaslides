import { defineStore } from 'pinia'
import { useUserSessionStore } from '@/stores/userSession'
import { supabase } from '@/lib/supabase'
import type { Presentation, PresentationEvent } from '@/types/entities'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { upsertObjectInArray } from '@/lib/array'
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

export interface PresenterState {
  isInitialized: Boolean
  currentPresentationId: RemovableRef<Presentation['id']>
  myPresentations: Presentation[]
  myPresentationEvents: PresentationEvent[]
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
        await this.syncPresentationEvents(this.currentPresentationId)
        this.isInitialized = true
      }
    },
    setActivePresentation(presentationId: Presentation['id']) {
      this.currentPresentationId = presentationId
      this.syncPresentationEvents(presentationId).then(() => console.log('Events synced'))
    },
    async startPresentation(presentationId: Presentation['id']) {
      const response = await supabase.rpc('presentation_start', { n_presentation: presentationId })
      this.currentPresentationId = presentationId
      return response.data
    },
    async stopPresentation(presentationId: Presentation['id']) {
      const response = await supabase.rpc('presentation_stop', { n_presentation: presentationId })
      this.currentPresentationId = presentationId
      return response.data
    },
    async syncMyPresentations() {
      const { session } = useUserSessionStore()
      if (session?.user.id) {
        const presentations = await supabase
          .from('presentations')
          .select()
          .eq('presenter', session.user.id)
        this.myPresentations = presentations.data || []

        // set up reactivity
        const handlePresentationChanges = (
          payload: RealtimePostgresChangesPayload<Presentation>
        ) => {
          switch (payload.eventType) {
            case 'INSERT':
              this.myPresentations.push(payload.new)
              break
            case 'UPDATE':
              this.myPresentations = upsertObjectInArray(this.myPresentations, payload.new, 'id')
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
      }
    },
    async syncPresentationEvents(presentationId: Presentation['id']) {
      const { session } = useUserSessionStore()
      if (session) {
        const { data: presentation, error } = await supabase
          .from('presentations')
          .select()
          .eq('presenter', session.user.id)
          .eq('id', presentationId)
          .single()
        if (error) {
          console.error('Presentation', presentationId, 'was not found with this presenter')
          return
        } else if (presentation) {
          const { data: presentationEvents } = await supabase
            .from('presentation_events')
            .select()
            .eq('presentation', presentationId)
            .order('created_at', { ascending: false })
          if (presentationEvents) {
            this.myPresentationEvents = presentationEvents
          }
          // set up reactivity for events of the current presentation
          const handlePresentationEvents = (
            payload: RealtimePostgresChangesPayload<PresentationEvent>
          ) => {
            switch (payload.eventType) {
              case 'INSERT':
                this.myPresentationEvents.push(payload.new)
                break
              case 'UPDATE':
                this.myPresentationEvents = upsertObjectInArray(
                  this.myPresentationEvents,
                  payload.new,
                  'id'
                )
                break
              case 'DELETE':
                this.myPresentationEvents = this.myPresentationEvents.filter(
                  (ev) => ev.id !== payload.old.id
                )
                break
            }
          }
          supabase
            .channel('presentation_events')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'presentation_events',
                filter: `presentation=eq.${presentationId}`
              },
              handlePresentationEvents
            )
            .subscribe()
        }
      }
    }
  }
})
