<template>
  <NSpace vertical>
    <NCard v-if="currentPresentation" :bordered="false" title="Current presentation">
      <NCard bordered embedded size="large">
        <PresentationFactsheet :presentation="currentPresentation" :show-start-stop="false" />
      </NCard>
    </NCard>
    <NCard v-if="nonCurrentPresentations?.length" :bordered="false" title="Other presentations">
      <NList v-for="presentation in nonCurrentPresentations" :key="presentation.id" bordered>
        <PresentationListItem :presentation="presentation" :show-start-stop="false" />
      </NList>
    </NCard>
  </NSpace>
</template>

<script lang="ts" setup>
import PresentationFactsheet from '@/components/PresentationFactsheet.vue'
import { NCard, NList, NSpace } from 'naive-ui'
import { usePresenterStore } from '@/stores/presenter'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useUserSessionStore } from '@/stores/userSession'
import PresentationListItem from '@/components/PresentationListItem.vue'

const { isSignedIn, anonUuid, session } = storeToRefs(useUserSessionStore())
let presenterStore = usePresenterStore()
const { currentPresentation, nonCurrentPresentations, isInitialized, myPresentationEvents } =
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
