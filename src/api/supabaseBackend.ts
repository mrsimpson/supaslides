import type { Backend } from './Backend'
import type {
  CreatePresentationEvent,
  Presentation,
  PresentationChange,
  PresentationEvent,
  PresentationPeek
} from '@/types/entities'
import type { Database } from '@/types/database'
import realtime from '@/lib/realtime'
import { createClient, type PostgrestError, type SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useUserSessionStore } from '@/stores/userSession'

class SupabaseBackend implements Backend {
  private client: SupabaseClient

  constructor(baseUrl: string, apiKey: string) {
    this.client = createClient<Database>(baseUrl, apiKey)
  }

  listenToPresentationEvents(
    presentationId: Presentation['id'],
    callback: (event: PresentationEvent) => void
  ): void {
    realtime(this.client).onPresentationEvent(presentationId, callback)
  }

  listenToPresentationChanges(userId: string, callback: (change: PresentationChange) => void) {
    this.client
      .channel('presentations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'presentations',
          filter: `presenter=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  async joinPresentation(joinCode: string): Promise<PresentationPeek | undefined> {
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
      this.handlePostgrestError(error)
      return presentationPeek
    }
  }

  registerAuthCallback(callback: (event: string, session: any) => void): void {
    this.client.auth.onAuthStateChange(callback)
  }

  async fetchPresentationById(presentationId: number): Promise<Presentation | null> {
    const { error, data: presentation } = await this.client
      .from('presentations')
      .select('*')
      .eq('id', presentationId)
      .single()
    if (error) return null
    return presentation
  }

  async fetchPresentationsOfUser(userId: string): Promise<Presentation[]> {
    const { data: presentations } = await this.client
      .from('presentations')
      .select('*')
      .eq('presenter', userId)
    return presentations || []
  }

  async fetchPresentationEvents(presentationId: number): Promise<any[]> {
    const { data, error } = await this.client
      .from('presentation_events')
      .select('*')
      .eq('presentation', presentationId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }
    return data || []
  }

  async fetchEventById(eventId: PresentationEvent['id']): Promise<PresentationEvent> {
    const { data: event, error: eventError } = await this.client
      .from('presentation_events')
      .select('*')
      .eq('id', eventId)
      .single()
    if (eventError) {
      throw eventError
    }
    return event
  }

  async createEvent(
    presentationId: Presentation['id'],
    event: CreatePresentationEvent
  ): Promise<PresentationEvent | null> {
    const newEvent = event as PresentationEvent
    newEvent.presentation = presentationId
    const { error } = await supabase.from('presentation_events').insert(newEvent)

    this.handlePostgrestError(error)
    return newEvent
  }

  async createBroadcastMessage(
    presentationId: Presentation['id'],
    message: string
  ): Promise<PresentationEvent | undefined> {
    const { error, data } = await this.client
      .from('presentation_events')
      .insert([
        {
          presentation: presentationId,
          is_public: true,
          type: 'comment',
          value: { commentText: message }
        }
      ])
      .select()
    if (error) {
      this.handlePostgrestError(error)
    } else if (data) {
      const event = data[0]
      if (event) {
        await realtime(this.client).sendEvent(presentationId, event)
        return event
      }
    }
  }

  async startPresentation(presentationId: Presentation['id']) {
    const response = await this.client.rpc('presentation_start', { n_presentation: presentationId })
    const { error, data: acknowledgment } = response
    this.handlePostgrestError(error)
    return acknowledgment
  }

  async stopPresentation(presentationId: Presentation['id']) {
    const response = await this.client.rpc('presentation_stop', { n_presentation: presentationId })
    const { error, data: acknowledgment } = response
    this.handlePostgrestError(error)
    return acknowledgment
  }

  async notifyAudience(
    presentationId: Presentation['id'],
    event: PresentationEvent
  ): Promise<void> {
    await realtime(supabase).sendEvent(presentationId, event)
  }

  private handlePostgrestError(error: PostgrestError | null) {
    if (error) {
      console.error(error)
      throw error
    }
  }
}

export function createBackend(
  baseUrl = import.meta.env.VITE_SUPABASE_URL,
  apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY
): Backend {
  return new SupabaseBackend(baseUrl, apiKey)
}
