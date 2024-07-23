import type {
  Acknowledgement,
  CreatePresentation,
  CreatePresentationEvent,
  Presentation,
  PresentationChange,
  PresentationEvent,
  PresentationPeek
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
}
