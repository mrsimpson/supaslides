<template>
  <EventWithIconWrapper>
    <template #icon>
      <AvatarIcon />
    </template>
    <template #content>
      <SpeechBubble :callout-position="props.isMine ? 'right' : 'left'">
        <template #default> {{ event.value.commentText }}</template>
      </SpeechBubble>
    </template>
  </EventWithIconWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SpecificPresentationEvent } from '@/types/entities.js'
import AvatarIcon from '@/components/AvatarIcon.vue'
import SpeechBubble from '@/components/SpeechBubble.vue'
import EventWithIconWrapper from '@/components/EventWithIconWrapper.vue'

const props = defineProps<{
  event: SpecificPresentationEvent<'comment'>
  isMine: boolean
}>()

const { t } = useI18n()
const event = ref(props.event)
</script>
