<template>
  <EventWithIconWrapper :is-mine="isMine">
    <template #icon>
      <AvatarIcon :name="displayName" />
    </template>
    <template #content>
      <SpeechBubble :callout-position="isMine ? 'right' : 'left'">
        <template #default> {{ event.value.commentText }}</template>
      </SpeechBubble>
    </template>
  </EventWithIconWrapper>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SpecificPresentationEvent } from 'src/api/types/entities.js'
import AvatarIcon from '@/components/AvatarIcon.vue'
import SpeechBubble from '@/components/SpeechBubble.vue'
import EventWithIconWrapper from '@/components/EventWithIconWrapper.vue'
import { getAuthorDisplayName } from '@/lib/event'

const props = defineProps<{
  event: SpecificPresentationEvent<'comment'>
  isMine: boolean
}>()

let displayName = ref<string | undefined>(undefined)

onMounted(async () => {
  displayName.value = await getAuthorDisplayName(props.event)
})

const { t } = useI18n()
const event = ref(props.event)
</script>
