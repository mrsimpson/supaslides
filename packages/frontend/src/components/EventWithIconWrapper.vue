<template>
  <div
      :class="['event-wrapper', eventType]" :style="{ flexDirection: isMine ? 'row-reverse' : 'row' }"
  >
    <n-icon class="type-icon" size="1.5rem">
      <slot name="icon"/>
    </n-icon>
    <div>
      <slot name="content"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {EventType} from '@/api/types/entities'

defineProps<{ isMine: boolean; eventType: EventType }>()
</script>

<style lang="css" scoped>
.event-wrapper {
  display: flex;
  align-items: center;
}

.type-icon {
  margin: 0 20px;
}
</style>