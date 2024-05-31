<script setup lang="ts">
import { Information as InformationIcon } from '@vicons/carbon'
import { isSmallScreen } from '@/lib/responsiveness'

type displayType = 'inline' | 'icon'

defineProps<{
  text: String
  display: displayType
  size?: number
}>()
</script>

<template>
  <n-tooltip trigger="hover" v-if="display === 'icon'" :width="isSmallScreen ? 300 : 600">
    <template #trigger>
      <n-button
        text
        :style="{
          marginLeft: '8px',
          marginRight: '8px'
        }"
      >
        <template #icon>
          <n-icon
            size="size || 1rem"
            :style="{
              alignBaseline: true
            }"
          >
            <InformationIcon />
          </n-icon>
        </template>
      </n-button>
    </template>
    {{ text }}</n-tooltip
  >
  <small class="inlined" v-if="display === 'inline'">{{ text }}</small>
</template>

<style scoped>
.inlined {
  font-style: italic;
}

.n-icon-slot {
  position-y: 0px;
}
</style>
