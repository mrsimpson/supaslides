<template>
  <NSpace vertical>
    <NCard v-if="presentation" :bordered="false">
      <NCard bordered embedded size="large">
        <PresentationFactsheet
          :presentation="presentation"
          :show-embedding="false"
          :show-open="false"
        />
      </NCard>
      <PresentationEventsTimeline
        :events="myPresentationEvents"
        :my-anon-uuid="anonUuid"
        :my-user-id="session?.user.id"
      />
    </NCard>
  </NSpace>
</template>

<script lang="ts" setup>
import PresentationFactsheet from '@/components/PresentationFactsheet.vue'
import { NCard, NSpace } from 'naive-ui'
import { usePresenterStore } from '@/stores/presenter'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useUserSessionStore } from '@/stores/userSession'
import PresentationEventsTimeline from '@/components/PresentationEventsTimeline.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Presentation } from '@/types/entities'

const { isSignedIn, anonUuid, session } = storeToRefs(useUserSessionStore())

let presenterStore = usePresenterStore()
const { currentPresentation, myPresentations, isInitialized, myPresentationEvents } =
  storeToRefs(presenterStore)

const { currentRoute } = useRouter()
const { t } = useI18n()

const presentationId = () => parseInt(currentRoute.value.params.presentationId[0])

const isPresentationCurrentOne = () => {
  return currentPresentation.value?.id && presentationId() === currentPresentation?.value.id
}

let presentation = ref<Presentation | null>()

watch(
  isSignedIn,
  async () => {
    if (!isInitialized.value) await presenterStore.initialize()
    else if (!isSignedIn) presenterStore.$reset()
  },
  { immediate: true }
)

watch([presentationId(), myPresentations], async () => {
  if (presentationId()) {
    await presenterStore.syncPresentationEvents(presentationId())
    presentation.value = myPresentations.value.filter((p) => p.id === presentationId())[0]
  }
})

onMounted(
  () => (presentation.value = myPresentations.value.filter((p) => p.id === presentationId())[0])
)
</script>
