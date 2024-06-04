<template>
  <PresentationFactsheet v-if="currentPresentation" :presentation="currentPresentation" />

  <NList v-for="(presentation, index) in nonCurrentPresentations" :key="presentation.id">
    <NListItem>
      <PresentationFactsheet :presentation="presentation" />
    </NListItem>
  </NList>
</template>

<script lang="ts" setup>
import PresentationFactsheet from '@/components/PresentationFactsheet.vue'
import { NList, NListItem } from 'naive-ui'
import { usePresenterStore } from '@/stores/presenter'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

import { useUserSessionStore } from '@/stores/userSession'

const { isSignedIn } = storeToRefs(useUserSessionStore())
let presenterStore = usePresenterStore()
const { currentPresentation, nonCurrentPresentations, isInitialized, myPresentations } =
  storeToRefs(presenterStore)

watch(
  isSignedIn,
  async () => {
    if (!isInitialized.value) await presenterStore.initialize()
    else if (!isSignedIn) presenterStore.$reset()
  },
  { immediate: true }
)
</script>
