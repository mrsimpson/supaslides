import type { Database, Tables } from './database'

export type Profile = Tables<'profiles'>
export type Presentation = Tables<'presentations'>
export type Acknowledgement = Database['public']['CompositeTypes']['generic_acknowledgement_type']
