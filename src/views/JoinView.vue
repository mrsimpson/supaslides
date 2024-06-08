<template>
  <div v-if="presentation">
    <NSpace size="large" vertical>
      <NCard :title="presentation.title || 'an untitled presentation'">
        <template #header><p>Jou are invited to join</p></template>
        <h3 v-if="presenterName">by {{ presenterName }}</h3>
        <p v-if="presentation.description">{{ presentation.description }}</p>
        <template #action>
          <NButton primary type="primary" @click="join()">Join!</NButton>
        </template>
      </NCard>
    </NSpace>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NCard, NSpace } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import type { PresentationPeek } from '@/types/entities'
import { useAudienceStore } from '@/stores/audience'

const router = useRouter()
const joinCode = router.currentRoute.value?.query['code']
const presenterName = router.currentRoute.value?.query['presenter']
const presentation = ref(null as PresentationPeek | null)
onMounted(async () => {
  if (joinCode) {
    const presentationPeek = await supabase.rpc('presentation_peek', { t_join_code: `${joinCode}` })
    if (presentationPeek.data) {
      presentation.value = presentationPeek.data
    }
  }
})

async function join() {
  if (presentation.value) {
    const audienceStore = useAudienceStore()

    await audienceStore.join(joinCode)

    router.push('/feedback')
  }
}
</script>
