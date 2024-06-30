<template>
  <NSpace vertical>
    <NCard v-if="!currentPresentationId" :title="t('join_a_presentation_card_title')" embedded>
      <p>{{ t('join_a_presentation_card_content_1') }}</p>
      <p>{{ t('join_a_presentation_card_content_2') }}</p>
    </NCard>
    <NCard v-if="currentPresentation" embedded>
      <h1>{{ currentPresentation?.title || t('an_untitled_presentation') }}</h1>
      <h2 v-if="currentPresentation.presenter_fullname">
        by {{ currentPresentation?.presenter_fullname }}
      </h2>
    </NCard>
    <DisplayNameForm />
    <PresentationEventsTimeline
      :events="currentPresentationEvents()"
      :my-anon-uuid="anonUuid"
      :my-user-id="session?.user.id"
    />
    <div v-if="currentPresentation && displayName">
      <n-divider />
      <ReactionsPanel :presentation="currentPresentation" />
      <CommentForm :presentation="currentPresentation" />
    </div>
  </NSpace>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { NCard, NSpace } from 'naive-ui'
import { useUserSessionStore } from '@/stores/userSession'
import { useAudienceStore } from '@/stores/audience'
import ReactionsPanel from '@/components/ReactionsPanel.vue'
import PresentationEventsTimeline from '@/components/PresentationEventsTimeline.vue'
import type { PresentationEvent } from '@/types/entities'
import { useI18n } from 'vue-i18n'
import DisplayNameForm from '@/components/DisplayNameForm.vue'
import CommentForm from '@/components/CommentForm.vue'

const { anonUuid, session, displayName } = storeToRefs(useUserSessionStore())
const { currentPresentationId, currentPresentation, myEvents, publicEvents } =
  storeToRefs(useAudienceStore())
const { t } = useI18n()

useAudienceStore().initialize()

function currentPresentationEvents(): PresentationEvent[] {
  return [
    ...(myEvents.value || []).filter((event) => event.presentation === currentPresentationId.value),
    ...(publicEvents.value || []).filter(
      (event) => event.presentation === currentPresentationId.value
    )
  ]
}
</script>
