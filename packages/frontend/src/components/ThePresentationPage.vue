<template>
  <n-flex v-if="presentation" :style="{ maxHeight: totalHeight }" vertical>
    <NCard bordered embedded size="large">
      <PresentationFactsheet
        :presentation="presentation"
        :show-embedding="false"
        :show-open="false"
      />
    </NCard>
    <BroadcastForm :presentation="presentation" />
    <PresentationEventsTimeline
      :events="myPresentationEvents"
      :my-anon-uuid="anonUuid"
      :my-user-id="session?.user.id"
    />
  </n-flex>
</template>

<script lang="ts" setup>
import PresentationFactsheet from '@/components/PresentationFactsheet.vue'
import { usePresenterStore } from '@/stores/presenter'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useUserSessionStore } from '@/stores/userSession'
import PresentationEventsTimeline from '@/components/PresentationEventsTimeline.vue'
import { useRouter } from 'vue-router'
import type { Presentation } from 'src/api/types/entities'
import BroadcastForm from '@/components/BroadcastForm.vue'
import router from '@/router'

const { isSignedIn, anonUuid, session } = storeToRefs(useUserSessionStore())

let presenterStore = usePresenterStore()
const { currentPresentation, myPresentations, isInitialized, myPresentationEvents } =
  storeToRefs(presenterStore)

const { currentRoute } = useRouter()

const presentationId = () => parseInt(<string>currentRoute.value.params.presentationId)

const isPresentationCurrentOne = () => {
  return currentPresentation.value?.id && presentationId() === currentPresentation?.value.id
}

const totalHeight = computed(() => `${window.innerHeight - 200}px`)

let presentation = ref<Presentation | null>()

function setPresentationFromRoute() {
  presentation.value = myPresentations.value.filter((p) => p.id === presentationId())[0]
  presenterStore.setActivePresentation(presentationId())
}

watch([router.currentRoute, myPresentations], async () => {
  if (presentationId()) {
    setPresentationFromRoute()
  }
})

onMounted(() => {
  setPresentationFromRoute()
})
</script>
