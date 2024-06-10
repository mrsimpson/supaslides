<template>
  <NDivider>What happened so far</NDivider>
  <NTimeline v-for="(event, index) in events">
    <NTimelineItem :time="new Date(event.created_at).toLocaleString()" :title="getTitle(event)" />
  </NTimeline>
</template>

<script lang="ts" setup>
import type { PresentationEvent } from '@/types/entities'
import { NDivider, NTimeline, NTimelineItem } from 'naive-ui'
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
      if (event.value && typeof event.value === 'string') {
        try {
          const reaction = JSON.parse(event.value)
          return emoji.get(reaction['emoji'])
        } catch (e) {
          // do nothing
        }
      }
    case 'user_joined':
      return `User ${event.value} joined`
    default:
      return 'Some strange thing happened here'
  }
}

function getIcon(event: PresentationEvent) {
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
      if (event.value && typeof event.value === 'string') {
        try {
          const reaction = JSON.parse(event.value)
          return ''
        } catch (e) {
          // do nothing
        }
      }
    case 'user_joined':
      return `User ${event.value} joined`
    default:
      return 'Some strange thing happened here'
  }
}
</script>
