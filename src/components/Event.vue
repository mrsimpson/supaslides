<template>
  <div :style="{ flexDirection: isMine ? 'row-reverse' : 'row' }" class="event">
    <div v-if="event.type === 'reaction'">
      <span :style="{ fontSize: '300%' }">{{ getContent(event) }}</span>
    </div>
    <div v-else-if="event.type === 'comment'" class="callout">{{ getContent(event) }}</div>

    <div v-else>{{ getContent(event) }}</div>
    <div class="creation-info">
      {{ event.created_by_alias }}, {{ new Date(event.created_at).toLocaleString() }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PresentationEvent } from '@/types/entities'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  event: { type: Object as () => PresentationEvent, required: true },
  isMine: { type: Boolean, required: true }
})

function getContent(event: PresentationEvent) {
  // noinspection FallThroughInSwitchStatementJS
  switch (event.type) {
    case 'comment':
      if (event.value) {
        try {
          if (typeof event.value === 'string') {
            const commentValue = JSON.parse(event.value)
            if (typeof commentValue === 'object' && !Array.isArray(commentValue)) {
              return commentValue?.commentText ?? undefined
            }
          }
        } catch (e) {
          // do nothing, just return the raw data
        }
        return event.value
      }
    case 'slide_change':
      return t('presenter_switched_to_slide') + event.value
    case 'presentation_start':
      return t('presentation_was_started')
    case 'presentation_stop':
      return t('presentation_was_stopped')
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
      return `${event.created_by_alias} ${t('user_joined')}`
    default:
      return t('some_strange_thing_happened_here')
  }
}

function getItemStyle(event: PresentationEvent) {
  return {
    '--n-content-font-size': event.type === 'reaction' ? '300%' : '100%',
    '--n-title-font-size': '0.8rem',
    '--n-title-display': event.type == 'user_joined' ? 'none' : 'unset'
  }
}
</script>

<style lang="css" scoped>
.event {
  display: flex;
  align-items: center;

  .creation-info {
    font-size: 0.75rem;
    margin-top: 4px;
    display: none;
    padding-left: 10px;
    padding-right: 10px;
  }

  .callout {
    padding: 20px;
    border: 1px solid #f2f2f2;
    border-radius: 10px;
  }
}

.event:hover {
  .creation-info {
    display: unset;
  }
}
</style>
