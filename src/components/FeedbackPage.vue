<template>
  <NCard :title="presentation.title || ''">
    <template #header> by </template>
  </NCard>
</template>

<script lang="ts" setup>
import type { Presentation } from '@/types/entities'
import type { PropType } from 'vue'
import { NCard } from 'naive-ui'

const props = defineProps({
  presentation: { type: Object as PropType<Presentation>, required: true }
})
</script>
