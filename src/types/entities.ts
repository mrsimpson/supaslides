import type { Database, Tables } from './database'

export type Profile = Tables<'profiles'>
export type Presentation = Tables<'presentations'>
export type PresentationEvent = Tables<'presentation_events'>
export type PresentationEventType = Database['public']['Enums']['event_type']
export type PresentationPeek = Database['public']['CompositeTypes']['presentation_peek_type']
export type Acknowledgement = Database['public']['CompositeTypes']['generic_acknowledgement_type']

// more specific types
type CommentValue = {
  commentText: string
}

type ReactionValue = {
  emoticon: string
  emojiText: string
}

export type SpecificPresentationEvent<T extends PresentationEventType> = T extends 'comment'
  ? Omit<Event, 'value'> & { value: CommentValue }
  : T extends 'reaction'
    ? Omit<Event, 'value'> & { value: ReactionValue }
    : Event
