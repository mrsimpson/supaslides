<template>
  <EventWithIconWrapper>
    <template #icon>
      <UserIcon />
    </template>
    <template #content>
      <span>{{ t('user_joined') }}</span>
    </template>
  </EventWithIconWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PresentationEvent } from '@/types/entities.js'
import { UserAvatar as UserIcon } from '@vicons/carbon'
import EventWithIconWrapper from '@/components/EventWithIconWrapper.vue'

const props = defineProps<{
  event: PresentationEvent
  isMine: boolean
}>()

const { t } = useI18n()
const event = ref(props.event)
</script>
