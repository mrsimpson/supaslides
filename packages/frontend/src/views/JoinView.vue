<template>
  <div v-if="presentation">
    <NSpace size="large" vertical>
      <NCard :title="presentation.title || 'an untitled presentation'" embedded>
        <template #header><p>Jou are invited to join</p></template>
        <h3 v-if="presenterName">by {{ presenterName }}</h3>
        <p v-if="presentation.description">{{ presentation.description }}</p>
        <template #action>
          <DisplayNameForm />
          <NButton :disabled="!displayName" primary type="primary" @click="handleJoin()">Join!</NButton>
        </template>
      </NCard>
    </NSpace>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NCard, NSpace } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { PresentationPeek } from 'src/api/types/entities'
import { useAudienceStore } from '@/stores/audience'
import { useUserSessionStore } from '@/stores/userSession'
import { storeToRefs } from 'pinia'
import DisplayNameForm from '@/components/DisplayNameForm.vue'

const router = useRouter()
const joinCode = router.currentRoute.value?.query['code']?.toString()
const presenterName = router.currentRoute.value?.query['presenter']
const presentation = ref(null as PresentationPeek | null)

const { displayName } = storeToRefs(useUserSessionStore())
const {peekPresentation, join} = useAudienceStore()

onMounted(async () => {
  if (joinCode) {
    const presentationPeek = await peekPresentation(joinCode)
    if (presentationPeek) {
      presentation.value = presentationPeek
    }
  }
})

async function handleJoin() {
  if (presentation.value && joinCode) {

    await join(joinCode)

    router.push('/feedback')
  }
}
</script>
