<template>
  <div v-if="presentation" class="presenter-view">
    <div class="header">
      <PresentationFactsheet
          :presentation="presentation"
          :show-embedding="false"
          :show-open="false"
      />
      <BroadcastForm :presentation="presentation"/>
    </div>
    <div class="events-container">
      <PresentationEventsTimeline
          :events="myPresentationEvents"
          :my-anon-uuid="anonUuid"
          :my-user-id="session?.user.id"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PresentationFactsheet from '@/components/PresentationFactsheet.vue'
import {usePresenterStore} from '@/stores/presenter'
import {storeToRefs} from 'pinia'
import {onMounted, ref, watch} from 'vue'
import {useUserSessionStore} from '@/stores/userSession'
import PresentationEventsTimeline from '@/components/PresentationEventsTimeline.vue'
import {useRouter} from 'vue-router'
import type {Presentation} from 'src/api/types/entities'
import BroadcastForm from '@/components/BroadcastForm.vue'
import router from '@/router'

const {isSignedIn, anonUuid, session} = storeToRefs(useUserSessionStore())

let presenterStore = usePresenterStore()
const {currentPresentation, myPresentations, isInitialized, myPresentationEvents} =
    storeToRefs(presenterStore)

const {currentRoute} = useRouter()

const presentationId = () => parseInt(<string>currentRoute.value.params.presentationId)

const isPresentationCurrentOne = () => {
  return currentPresentation.value?.id && presentationId() === currentPresentation?.value.id
}

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

<style scoped>

.presenter-view {
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
</style>
