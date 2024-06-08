<template>
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
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { NCard } from 'naive-ui'
import { useUserSessionStore } from '@/stores/userSession'
import { useAudienceStore } from '@/stores/audience'

const { isSignedIn } = storeToRefs(useUserSessionStore())
const { currentPresentationId, currentPresentation } = storeToRefs(useAudienceStore())
</script>
