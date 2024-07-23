<template>
  <EventWithIconWrapper :event-type="event.type" :is-mine="isMine">
    <template #icon>
      <PresentationIcon />
    </template>
    <template #content>
      <span v-if="event.type === 'presentation_start'">{{ t('presentation_was_started') }}</span>
      <span v-else-if="event.type === 'presentation_stop'">{{
        t('presentation_was_stopped')
      }}</span>
    </template>
  </EventWithIconWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PresentationEvent } from 'src/api/types/entities.js'
import { PresentationFile as PresentationIcon } from '@vicons/carbon'
import EventWithIconWrapper from '@/components/EventWithIconWrapper.vue'

const props = defineProps<{
  event: PresentationEvent
  isMine: boolean
}>()

const { t } = useI18n()
const event = ref(props.event)
</script>
