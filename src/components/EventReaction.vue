<template>
  <EventWithIconWrapper :is-mine="isMine">
    <template #icon>
      <AvatarIcon />
    </template>
    <template #content>
      <span class="emoticon">{{ event.value.emoticon }}</span>
    </template>
  </EventWithIconWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SpecificPresentationEvent } from '@/types/entities.js'
import AvatarIcon from '@/components/AvatarIcon.vue'
import EventWithIconWrapper from '@/components/EventWithIconWrapper.vue'

const props = defineProps<{
  event: SpecificPresentationEvent<'reaction'>
  isMine: boolean
}>()

const { t } = useI18n()
const event = ref(props.event)
</script>

<style>
.emoticon {
  font-size: 300%;
}
</style>
