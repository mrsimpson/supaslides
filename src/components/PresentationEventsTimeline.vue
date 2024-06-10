<template>
  <NDivider>What happened so far</NDivider>
  <NTimeline
    v-for="event in sortedEvents()"
    :theme-overrides="{ circleBorder: 'none' }"
    size="large"
  >
    <NTimelineItem
      :key="event.id"
      :class="event.type"
      :style="getItemStyle(event)"
      :time="new Date(event.created_at).toLocaleString()"
      :title="getTitle(event)"
      line-type="dashed"
    />
  </NTimeline>
</template>

<script lang="ts" setup>
import type { PresentationEvent } from '@/types/entities'
import * as emoji from 'node-emoji'

const props = defineProps({
  events: { type: Object as () => PresentationEvent[], required: true }
})

function getTitle(event: PresentationEvent) {
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
      return emoji.get(reaction['emoji'])
    case 'user_joined':
      return `User ${event.value} joined`
    default:
      return 'Some strange thing happened here'
  }
}

function getItemStyle(event: PresentationEvent) {
  return {
    paddingBottom: '1.5rem',
    '--n-title-font-size': event.type === 'reaction' ? '300%' : '100%'
  }
}

function sortedEvents() {
  return props.events.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}
</script>
