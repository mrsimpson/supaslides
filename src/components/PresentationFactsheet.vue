<template>
  <NThing :title="presentation?.title || 'untitled presentation'"></NThing>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { NThing } from 'naive-ui'
import type { Presentation } from '@/types/entities.js'

const props = defineProps({
  presentation: {
    type: Object as () => Presentation,
    required: true
  }
})
</script>
