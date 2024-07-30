import type {Backend} from './Backend'
import type {
    CreatePresentation,
    CreatePresentationEvent,
    Presentation,
    PresentationChange,
    PresentationEvent,
    PresentationPeek,
    Profile
} from './types/entities'
import type {Database} from './types/database'
import {
    createClient,
    type PostgrestError,
    REALTIME_LISTEN_TYPES,
    REALTIME_SUBSCRIBE_STATES,
    type RealtimePostgresChangesPayload,
    type SupabaseClient
} from '@supabase/supabase-js'
import * as console from "node:console";

class SupabaseBackend implements Backend {
    private static client: SupabaseClient

    constructor(baseUrl: string, apiKey: string) {
        if(!SupabaseBackend.client) SupabaseBackend.client = createClient<Database>(baseUrl, apiKey)
    }

    listenToPresentationEvents(
        presentationId: Presentation['id'],
        callback: (event: PresentationEvent) => void
    ): void {
        SupabaseBackend.client
            .channel('presentation_events')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'presentation_events',
                    filter: `presentation=eq.${presentationId}`
                },
                (payload: RealtimePostgresChangesPayload<PresentationEvent>) =>
                    callback(<PresentationEvent>payload.new)
            )
            .subscribe()
        const presentationBroadcastChannel = SupabaseBackend.client.channel(
            this.getRealtimeChannelName(presentationId)
        )
        presentationBroadcastChannel.subscribe((status) => {
            if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
                presentationBroadcastChannel.on(
                    REALTIME_LISTEN_TYPES.BROADCAST,
                    {event: 'presentation_event'},
                    (event) => {
                        if (event) {
                            callback(event.payload)
                        }
                    }
                )
            } else {
                //TODO: Error handling
            }
        })
    }

    listenToPresentationChanges(userId: string, callback: (change: PresentationChange) => void) {
        SupabaseBackend.client
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

    async joinPresentation(
        joinCode: string,
        displayName: string,
        userId?: string,
        anonUuid?: string
    ): Promise<PresentationPeek | undefined> {
        if (!joinCode) {
            throw new Error('No join code provided')
        }
        const presentationPeek = await this.peekPresentation(joinCode)
        if (presentationPeek) {
            const {error} = await SupabaseBackend.client.rpc('join_presentation', {
                t_join_code: joinCode,
                t_user_alias: displayName,
                u_user_uuid: userId,
                u_user_anon_uuid: anonUuid
            })
            this.handlePostgrestError(error)
            return presentationPeek
        }
    }

    async peekPresentation(joinCode: string): Promise<PresentationPeek> {
        const {data} = await SupabaseBackend.client.rpc('presentation_peek', {
            t_join_code: joinCode
        });

        return data
    }

    registerAuthCallback(callback: (event: string, session: any) => void): void {
        SupabaseBackend.client.auth.onAuthStateChange(callback)
    }

    async fetchPresentationById(presentationId: number): Promise<Presentation | null> {
        const {error, data: presentation} = await SupabaseBackend.client
            .from('presentations')
            .select('*')
            .eq('id', presentationId)
            .single()
        if (error) return null
        return presentation
    }

    async fetchPresentationsOfUser(userId: string): Promise<Presentation[]> {
        const {data: presentations} = await SupabaseBackend.client
            .from('presentations')
            .select('*')
            .eq('presenter', userId)
        return presentations || []
    }

    async fetchPresentationEvents(presentationId: number): Promise<any[]> {
        const {data, error} = await SupabaseBackend.client
            .from('presentation_events')
            .select('*')
            .eq('presentation', presentationId)
            .order('created_at', {ascending: false})

        if (error) {
            throw error
        }
        return data || []
    }

    async fetchEventById(eventId: PresentationEvent['id']): Promise<PresentationEvent> {
        const {data: event, error: eventError} = await SupabaseBackend.client
            .from('presentation_events')
            .select('*')
            .eq('id', eventId)
            .single()
        if (eventError) {
            throw eventError
        }
        return event
    }

    async createPresentation(presentation: CreatePresentation): Promise<Presentation | null> {
        const {error, data} = await SupabaseBackend.client
            .from('presentations')
            .insert(presentation)
            .select()
            .single()

        this.handlePostgrestError(error)
        return data
    }

    async createEvent(
        presentationId: Presentation['id'],
        event: CreatePresentationEvent
    ): Promise<PresentationEvent | null> {
        const newEvent = event as PresentationEvent
        newEvent.presentation = presentationId
        const {error} = await SupabaseBackend.client.from('presentation_events').insert(newEvent)

        this.handlePostgrestError(error)
        return newEvent
    }

    async createBroadcastMessage(
        presentationId: Presentation['id'],
        message: string
    ): Promise<PresentationEvent | undefined> {
        const {error, data} = await SupabaseBackend.client
            .from('presentation_events')
            .insert([
                {
                    presentation: presentationId,
                    is_public: true,
                    type: 'comment',
                    value: {commentText: message}
                }
            ])
            .select()
        if (error) {
            this.handlePostgrestError(error)
        } else if (data) {
            const event = data[0]
            if (event) {
                await this.sendRealtimeEvent(presentationId, event)
                return event
            }
        }
    }

    async startPresentation(presentationId: Presentation['id']) {
        const response = await SupabaseBackend.client.rpc('presentation_start', {n_presentation: presentationId})
        const {error, data: acknowledgment} = response
        this.handlePostgrestError(error)
        return acknowledgment
    }

    async stopPresentation(presentationId: Presentation['id']) {
        const response = await SupabaseBackend.client.rpc('presentation_stop', {n_presentation: presentationId})
        const {error, data: acknowledgment} = response
        this.handlePostgrestError(error)
        return acknowledgment
    }

    async notifyAudience(
        presentationId: Presentation['id'],
        event: PresentationEvent
    ): Promise<void> {
        await this.sendRealtimeEvent(presentationId, event)
    }

    async deletePresentation(presentationId: Presentation['id']): Promise<boolean> {
        const {error} = await SupabaseBackend.client.from('presentations').delete().eq('id', presentationId)
        return !error
    }

    private getRealtimeChannelName(presentationId: Presentation['id']) {
        return `presentation-${presentationId}`
    }

    private async sendRealtimeEvent(presentationId: Presentation['id'], event: PresentationEvent) {
        await SupabaseBackend.client.channel(this.getRealtimeChannelName(presentationId)).send({
            type: REALTIME_LISTEN_TYPES.BROADCAST,
            event: 'presentation_event',
            payload: event
        })
    }

    private handlePostgrestError(error: PostgrestError | null) {
        if (error) {
            console.error(error)
            throw error
        }
    }

    async fetchProfile(userId: Profile["id"]): Promise<Profile | null> {
        const {data, error} = await SupabaseBackend.client
            .from('profiles')
            .select(`*`)
            .eq('id', userId)
            .single()
        this.handlePostgrestError(error)
        return data
    }

    async updateProfile(profile: Profile): Promise<boolean> {
        const {error} = await SupabaseBackend.client.from('profiles').upsert(profile)
        this.handlePostgrestError(error)

        return !!error
    }

    async signInWithMagicLink(email: string): Promise<Error | null> {
        const {error} = await SupabaseBackend.client.auth.signInWithOtp({
            email: email
        })

        return error
    }

    async signInWithPassword(email: string, password: string): Promise<Error | null> {
        const {error} = await SupabaseBackend.client.auth.signInWithPassword({
            email: email,
            password: password
        })
        return error
    }

    async signOut():  Promise<Error | null> {
        const {error} = await SupabaseBackend.client.auth.signOut()
        return error
    }
}

export function createBackend(
    baseUrl = import.meta.env.VITE_SUPABASE_URL,
    apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY
): Backend {
    return new SupabaseBackend(baseUrl, apiKey)
}
