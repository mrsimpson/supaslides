<template>
  <div :style="{ flexDirection: isMine ? 'row-reverse' : 'row' }" class="event">
    <component :is="getEventComponent(event.type)" :event="parsed(event)" :isMine="isMine" />
    <span class="creation-info">
      <span v-if="event.created_by_alias">{{ event.created_by_alias }}, </span>
      {{ new Date(event.created_at).toLocaleString() }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, type StyleValue } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PresentationEvent, PresentationEventType } from 'src/api/types/entities'
import EventUserJoined from '@/components/EventUserJoined.vue'
import EventPresentationStartStop from '@/components/EventPresentationStartStop.vue'
import EventComment from '@/components/EventComment.vue'
import EventReaction from '@/components/EventReaction.vue'

const { t } = useI18n()

const props = defineProps<{
  event: PresentationEvent
  isMine: boolean
}>()

const event = ref(props.event)

function parsed(event: PresentationEvent) {
  if (['reaction', 'comment'].includes(event.type)) {
    if (typeof event.value === 'string') {
      return Object.assign({}, event, { value: JSON.parse(event.value) })
    } else if (typeof event.value === 'object') {
      return event
    }
  } else return event
}

function getEventComponent(eventType: PresentationEventType) {
  switch (eventType) {
    case 'user_joined':
      return EventUserJoined
    case 'presentation_start':
    case 'presentation_stop':
      return EventPresentationStartStop
    case 'comment':
      return EventComment
    case 'reaction':
      return EventReaction
    default:
      return null // Handle unknown event types
  }
}

const style = computed(
  (): StyleValue => ({
    display: 'flex',
    flexDirection: props.isMine ? 'row-reverse' : 'row',
    alignItems: 'center'
  })
)
</script>

<style lang="css" scoped>
.event {
  display: flex;
  align-items: center;
}

.creation-info {
  font-size: 0.75rem;
  display: none;
  padding-left: 10px;
  padding-right: 10px;
}

.event:hover .creation-info {
  display: unset;
}
</style>
