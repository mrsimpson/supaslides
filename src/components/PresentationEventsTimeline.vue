<template>
  <NDivider>What happened so far</NDivider>
  <NTimeline
    v-for="event in sortedEvents()"
    :item-placement="isMyEvent(event) ? 'right' : 'left'"
    :theme-overrides="{ circleBorder: 'none' }"
    size="large"
  >
    <NTimelineItem
      :key="event.id"
      :class="`${event.type}`"
      :content="getContent(event)"
      :style="getItemStyle(event)"
      :time="new Date(event.created_at).toLocaleString()"
      :title="event.created_by_alias"
      line-type="dashed"
    />
  </NTimeline>
</template>

<script lang="ts" setup>
import type { PresentationEvent } from '@/types/entities'

const props = defineProps({
  events: { type: Object as () => PresentationEvent[], required: true },
  myUserId: { type: String, required: false },
  myAnonUuid: { type: String, required: false }
})

function isMyEvent(event: PresentationEvent) {
  return event.created_by_anon_uuid === props.myAnonUuid || event.created_by === props.myUserId
}

function getContent(event: PresentationEvent) {
  // noinspection FallThroughInSwitchStatementJS
  switch (event.type) {
    case 'comment':
      if (event.value && typeof event.value === 'string') {
        return event.value
      }
    case 'slide_change':
      return 'Presenter switched to slide ' + event.value
    case 'presentation_start':
      return 'presentation was started'
    case 'presentation_stop':
      return 'presentation was stopped'
    case 'reaction':
      let reaction
      if (event.value && typeof event.value === 'string') {
        try {
          reaction = JSON.parse(event.value)
        } catch (e) {
          console.error(e)
        }
      } else if (event.value && typeof event.value === 'object') {
        // this happens in realtime updates: They don't need to be parsed again
        reaction = event.value
      }
      return reaction['emoticon']
    case 'user_joined':
      return `User ${event.created_by_alias} joined`
    default:
      return 'Some strange thing happened here'
  }
}

function getItemStyle(event: PresentationEvent) {
  return {
    paddingBottom: '1.5rem',
    '--n-content-font-size': event.type === 'reaction' ? '300%' : '100%',
    '--n-title-font-size': '0.8rem',
    '--n-title-display': event.type == 'user_joined' ? 'none' : 'unset'
  }
}

function sortedEvents() {
  return props.events.sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
}
</script>
