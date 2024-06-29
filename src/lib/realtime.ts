import { REALTIME_LISTEN_TYPES, SupabaseClient } from '@supabase/supabase-js'
import type { Presentation, PresentationEvent } from '@/types/entities'

export function getChannelName(presentationId: Presentation['id']) {
  return `presentation-${presentationId}`
}

export default function (supabase: SupabaseClient) {
  return {
    sendEvent: async (presentationId: Presentation['id'], event: PresentationEvent) =>
      await supabase.channel(getChannelName(presentationId)).send({
        type: 'broadcast',
        event: event.type,
        payload: event
      }),
    onPresentationEvent: async (
      presentationId: Presentation['id'],
      callback: (event: PresentationEvent) => void
    ) => {
      supabase
        .channel(getChannelName(presentationId))
        .on(REALTIME_LISTEN_TYPES.BROADCAST, { event: undefined }, (event) => {
          if (event) {
            callback(event)
          }
        })
    }
  }
}
