import type { Database, Tables } from './database'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export type Profile = Tables<'profiles'>
export type Presentation = Tables<'presentations'>
export type PresentationEvent = Omit<
  Tables<'presentation_events'>,
  'created_by' | 'created_by_alias' | 'created_by_anon_uuid'
> & {
  created_by?: string
  created_by_alias?: string
  created_by_anon_uuid?: string
}
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
  ? Omit<PresentationEvent, 'value'> & { value: CommentValue }
  : T extends 'reaction'
    ? Omit<PresentationEvent, 'value'> & { value: ReactionValue }
    : Event

export type CreatePresentationEvent = Omit<
  PresentationEvent,
  'presentation' | 'id' | 'is_public'
> & {
  value?: string
}

export type PresentationChange = RealtimePostgresChangesPayload<Presentation>
