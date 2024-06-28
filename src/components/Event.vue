<template>
  <div :style="{ flexDirection: isMine ? 'row-reverse' : 'row' }" class="event">
    <slot name="icon">
      <n-icon class="type-icon" size="1.5rem">
        <UserIcon v-if="event.type === 'user_joined'" />
        <PresentationIcon
          v-else-if="['presentation_start', 'presentation_stop'].includes(event.type)"
        />
        <AvatarIcon v-else :name="event.created_by_alias ?? undefined" />
      </n-icon>
    </slot>
    <slot name="content">
      <div v-if="event.type === 'reaction'">
        <span :style="{ fontSize: '300%' }">{{ getContent(event) }}</span>
      </div>
      <div v-else-if="event.type === 'comment'">
        <SpeechBubble :callout-position="props.isMine ? 'right' : 'left'">
          <template #default> {{ getContent(event) }}</template>
        </SpeechBubble>
      </div>

      <div v-else>{{ getContent(event) }}</div>
    </slot>
    <div class="creation-info">
      {{ event.created_by_alias }}, {{ new Date(event.created_at).toLocaleString() }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PresentationEventType } from '@/types/entities'
import { useI18n } from 'vue-i18n'
import { PresentationFile as PresentationIcon, UserAvatar as UserIcon } from '@vicons/carbon'
import SpeechBubble from '@/components/SpeechBubble.vue'
import AvatarIcon from '@/components/AvatarIcon.vue'

const { t } = useI18n()

const props = defineProps({
  event: { type: Object as () => PresentationEvent, required: true },
  isMine: { type: Boolean, required: true }
})

interface CommentEventValue {
  commentText?: string
}

interface PresentationEvent {
  type: PresentationEventType
  value: string | CommentEventValue | null
}

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
          } else if (typeof event.value === 'object') {
            return event.value.commentText
          }
        } catch (e) {
          // do nothing, just return the raw data
        }
        if (typeof event.value === 'object') {
          return event.value.commentText
        }
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
    display: none;
    padding-left: 10px;
    padding-right: 10px;
  }
}

.event:hover {
  .creation-info {
    display: unset;
  }
}

.type-icon {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
