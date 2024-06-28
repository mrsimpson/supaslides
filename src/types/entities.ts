import type { Database, Tables } from './database'

export type Profile = Tables<'profiles'>
export type Presentation = Tables<'presentations'>
export type PresentationEvent = Tables<'presentation_events'>
export type PresentationEventType = Database['public']['Enums']['event_type']
export type PresentationPeek = Database['public']['CompositeTypes']['presentation_peek_type']
export type Acknowledgement = Database['public']['CompositeTypes']['generic_acknowledgement_type']
