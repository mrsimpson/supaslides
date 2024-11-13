<template>
  <div class="audience-view">
    <div class="header">
      <NCard v-if="!currentPresentationId" :title="t('join_a_presentation_card_title')" embedded>
        <p>{{ t('join_a_presentation_card_content_1') }}</p>
        <p>{{ t('join_a_presentation_card_content_2') }}</p>
      </NCard>
      <NCard v-if="currentPresentation" :class="{ mobile: isNarrowScreen }" embedded>
        <h1 data-testid="heading-current-presentation">
          {{ currentPresentation?.title || t('an_untitled_presentation') }}
        </h1>
        <h2 v-if="currentPresentation.presenter_fullname">
          by {{ currentPresentation?.presenter_fullname }}
        </h2>
      </NCard>
      <DisplayNameForm/>
    </div>
    <div class="events-container">
      <PresentationEventsTimeline
          :events="currentPresentationEvents()"
          :my-anon-uuid="anonUuid"
          :my-user-id="session?.user.id"
          :sorting="Sorting.NewestBottom"
      />
    </div>
    <div v-if="currentPresentation && displayName" class="interaction-panel">
      <n-divider/>
      <ReactionsPanel :presentation="currentPresentation"/>
      <CommentForm :presentation="currentPresentation"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {storeToRefs} from 'pinia'
import {NCard} from 'naive-ui'
import {useUserSessionStore} from '@/stores/userSession'
import {useAudienceStore} from '@/stores/audience'
import ReactionsPanel from '@/components/ReactionsPanel.vue'
import PresentationEventsTimeline from '@/components/PresentationEventsTimeline.vue'
import {useI18n} from 'vue-i18n'
import DisplayNameForm from '@/components/DisplayNameForm.vue'
import CommentForm from '@/components/CommentForm.vue'
import Sorting from '@/types/Sorting'
import {isNarrowScreen} from '@/lib/responsiveness'
import type {PresentationEvent} from '@/api/types/entities'

const {anonUuid, session, displayName} = storeToRefs(useUserSessionStore())
const {currentPresentationId, currentPresentation, myEvents, publicEvents} =
    storeToRefs(useAudienceStore())
const {t} = useI18n()

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

<style scoped>
hr {
  margin: 12px 0;
}

.audience-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  width: 100%;
}

.header {
  flex: 0 0 auto;
  padding: 1rem;
}

.events-container {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1rem;
}

.interaction-panel {
  flex: 0 0 auto;
  padding: 0.5rem;
}

.mobile {
  margin: 0;
  border-radius: 0;
}

@media (max-width: 640px) {
  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.25rem;
  }
}
</style>