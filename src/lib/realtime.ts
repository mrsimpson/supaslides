import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES,
  SupabaseClient
} from '@supabase/supabase-js'
import type { Presentation, PresentationEvent } from '@/types/entities'

export function getChannelName(presentationId: Presentation['id']) {
  return `presentation-${presentationId}`
}

export default function (supabase: SupabaseClient) {
  return {
    sendEvent: async (presentationId: Presentation['id'], event: PresentationEvent) =>
      await supabase.channel(getChannelName(presentationId)).send({
        type: REALTIME_LISTEN_TYPES.BROADCAST,
        event: 'presentation_event',
        payload: event
      }),
    onPresentationEvent: async (
      presentationId: Presentation['id'],
      callback: (event: PresentationEvent) => void
    ) => {
      const presentationChannel = supabase.channel(getChannelName(presentationId))
      presentationChannel.subscribe((status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          presentationChannel.on(
            REALTIME_LISTEN_TYPES.BROADCAST,
            { event: 'presentation_event' },
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
  }
}
