import type {
    Acknowledgement,
    CreatePresentation,
    CreatePresentationEvent,
    Presentation,
    PresentationChange,
    PresentationEvent,
    PresentationPeek,
    Profile
} from './types/entities'

export interface Backend {
    fetchPresentationById(presentationId: Presentation['id']): Promise<Presentation | null>

    fetchPresentationsOfUser(userId: string): Promise<Presentation[]>

    fetchEventById(eventId: PresentationEvent['id']): Promise<PresentationEvent | null>

    fetchPresentationEvents(presentationId: Presentation['id']): Promise<PresentationEvent[]>

    createBroadcastMessage(
        presentationId: Presentation['id'],
        message: string
    ): Promise<PresentationEvent | undefined>

    createEvent(
        presentationId: Presentation['id'],
        event: CreatePresentationEvent
    ): Promise<PresentationEvent | null>

    createPresentation(presentation: CreatePresentation): Promise<Presentation | null>

    startPresentation(presentationId: Presentation['id']): Promise<Acknowledgement>

    stopPresentation(presentationId: Presentation['id']): Promise<Acknowledgement>

    deletePresentation(presentationId: Presentation['id']): Promise<boolean>

    peekPresentation(joinCode: string): Promise<PresentationPeek>

    notifyAudience(presentationId: Presentation['id'], event: PresentationEvent): Promise<void>

    listenToPresentationEvents(
        presentationId: Presentation['id'],
        callback: (event: PresentationEvent) => void
    ): void

    listenToPresentationChanges(userId: string, callback: (change: PresentationChange) => void): void

    joinPresentation(
        joinCode: string,
        displayName: string,
        userId?: string,
        anonUuid?: string
    ): Promise<PresentationPeek | undefined>

    registerAuthCallback(callback: (event: string, session: any) => void): void

    fetchProfile(userId: Profile['id']): Promise<Profile | null>

    updateProfile(profile: Profile): Promise<boolean>

    signInWithPassword(email: string, password: string): Promise<Error | null>

    signInWithMagicLink(email: string): Promise<Error | null>

    signOut():  Promise<Error | null>
}
