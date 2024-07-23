<template>
  <n-divider />
  <div ref="listContainer" class="list-container" data-testid="container-event-list">
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
import type { PresentationEvent } from 'src/api/types/entities'
import { computed, nextTick, onMounted, type PropType, ref, watch } from 'vue'
import EventRenderer from '@/components/EventRenderer.vue'
import Sorting from '@/types/Sorting'

const props = defineProps({
  events: { type: Array as () => PresentationEvent[], required: true },
  myUserId: { type: String, required: false },
  myAnonUuid: { type: String, required: false },
  sorting: {
    type: String as PropType<Sorting>,
    default: Sorting.NewestTop,
    validator: (value: string) => Object.values(Sorting).includes(value as Sorting)
  }
})

const listContainer = ref<HTMLElement | null>(null)

async function scroll() {
  await nextTick()
  const container = listContainer.value
  if (container) {
    container.scrollTop = props.sorting === Sorting.NewestBottom ? container.scrollHeight : 0
  }
}

onMounted(scroll)
watch(() => props.events, scroll, { deep: true })

function isMyEvent(event: PresentationEvent) {
  return event.created_by_anon_uuid === props.myAnonUuid || event.created_by === props.myUserId
}

const sortedEvents = computed(() => {
  return [...props.events].sort(
    (a, b) =>
      (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) *
      (props.sorting === Sorting.NewestBottom ? -1 : 1)
  )
})
</script>

<style scoped>
.list-container {
  flex: 1;
  overflow-y: scroll;
}

.list-item {
  display: flex;
  margin-bottom: 4px;
}
</style>
