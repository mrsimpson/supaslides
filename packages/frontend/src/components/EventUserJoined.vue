<template>
  <EventWithIconWrapper :is-mine="isMine" event-type="user_joined">
    <template #icon>
      <UserIcon />
    </template>
    <template #content>
      <span>{{ displayName }} {{ t('user_joined') }}</span>
    </template>
  </EventWithIconWrapper>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PresentationEvent } from 'src/api/types/entities.js'
import { UserAvatar as UserIcon } from '@vicons/carbon'
import EventWithIconWrapper from '@/components/EventWithIconWrapper.vue'
import { getAuthorDisplayName } from '@/lib/event'

const props = defineProps<{
  event: PresentationEvent
  isMine: boolean
}>()

const { t } = useI18n()

let displayName = ref<string | undefined>(undefined)

onMounted(async () => {
  displayName.value = await getAuthorDisplayName(props.event)
})
</script>
