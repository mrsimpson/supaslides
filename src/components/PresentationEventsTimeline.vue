<template>
  <n-divider />
  <div ref="listContainer" class="list-container">
    <div
      v-for="event in sortedEvents"
      :key="event.id"
      :class="`list-item`"
      :style="{ flexDirection: isMyEvent(event) ? 'row-reverse' : 'row' }"
    >
      <EventRenderer :event="event" :is-mine="isMyEvent(event)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PresentationEvent } from '@/types/entities'
import { computed, nextTick, ref, watch } from 'vue'
import EventRenderer from '@/components/EventRenderer.vue'

const props = defineProps({
  events: { type: Array as () => PresentationEvent[], required: true },
  myUserId: { type: String, required: false },
  myAnonUuid: { type: String, required: false }
})

const listContainer = ref<HTMLElement | null>(null)

watch(
  () => props.events,
  async () => {
    await nextTick()
    const container = listContainer.value
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  },
  { deep: true }
)

function isMyEvent(event: PresentationEvent) {
  return event.created_by_anon_uuid === props.myAnonUuid || event.created_by === props.myUserId
}

const sortedEvents = computed(() => {
  return [...props.events].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
})
</script>

<style scoped>
.list-container {
  height: 300px; /* Adjust as needed */
  overflow-y: auto;
}

.list-item {
  display: flex;
  margin-bottom: 4px;
}
</style>
