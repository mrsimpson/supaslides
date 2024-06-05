<template>
  <NListItem>
    <template #suffix>
      <NButton secondary size="medium" strong type="primary" @click="setCurrent()">
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
import type { Presentation } from '@/types/entities.js'
import { usePresenterStore } from '@/stores/presenter'
import { NButton, NIcon, NListItem } from 'naive-ui'
import { CheckmarkOutline } from '@vicons/carbon'

const presenterStore = usePresenterStore()

const props = defineProps({
  presentation: {
    type: Object as () => Presentation,
    required: true
  }
})

const setCurrent = () => (presenterStore.currentPresentationId = props.presentation.id)
</script>
