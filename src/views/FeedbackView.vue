<template>
  <NSpace vertical>
    <NCard v-if="!currentPresentationId" bordered title="Join a presentation">
      <p>You have not joined a conversation yet.</p>
      <p>Get the join link from your presenter or scan the QR-Code to start.</p>
    </NCard>
    <NCard v-if="currentPresentation" title="You are participating in">
      <h1>{{ currentPresentation?.title || 'an untitled presentation' }}</h1>
      <h2 v-if="currentPresentation.presenter_fullname">
        by {{ currentPresentation?.presenter_fullname }}
      </h2>
    </NCard>
    <div v-if="currentPresentation">
      <ReactionsPanel :presentation="currentPresentation" />
      <PresentationEventsTimeline
        :events="currentPresentationEvents()"
      ></PresentationEventsTimeline>
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

const { isSignedIn } = storeToRefs(useUserSessionStore())
const { currentPresentationId, currentPresentation, myEvents, publicEvents } =
  storeToRefs(useAudienceStore())

function currentPresentationEvents(): PresentationEvent[] {
  const allEvents: PresentationEvent[] = [
    ...(myEvents.value || []).filter((event) => event.presentation === currentPresentationId.value),
    ...(publicEvents.value || []).filter(
      (event) => event.presentation === currentPresentationId.value
    )
  ]
  return allEvents.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}
</script>
