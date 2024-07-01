<template>
  <div :style="{ flexDirection: isMine ? 'row-reverse' : 'row' }" class="event-wrapper">
    <n-icon class="type-icon" size="1.5rem">
      <slot name="icon" />
    </n-icon>
    <div>
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ isMine: boolean }>()
</script>

<style lang="css" scoped>
.event-wrapper {
  display: flex;
  align-items: center;
}

.type-icon {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
