<template>
  <NListItem>
    <template #suffix>
      <NButton primary @click="setCurrent()">
        <template #icon>
          <NIcon>
            <CheckmarkOutline />
          </NIcon>
        </template>
        Select
      </NButton>
    </template>
    <template #default
      ><h3>{{ props.presentation.title }}</h3></template
    >
  </NListItem>
</template>

<script lang="ts" setup>
import type { Presentation } from 'src/api/types/entities.js'
import { usePresenterStore } from '@/stores/presenter'
import { NButton, NIcon, NListItem } from 'naive-ui'
import { CheckmarkOutline } from '@vicons/carbon'
import { useRouter } from 'vue-router'

const presenterStore = usePresenterStore()
const router = useRouter()

const props = defineProps({
  presentation: {
    type: Object as () => Presentation,
    required: true
  }
})

const setCurrent = () => {
  presenterStore.setActivePresentation(props.presentation.id)
  router.push({ name: 'presentation', params: { presentationId: props.presentation?.id } })
}
</script>
