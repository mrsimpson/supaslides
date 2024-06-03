<script setup lang="ts">
import { NCard, NSkeleton } from 'naive-ui'

defineProps<{
  msg: string
}>()
</script>

<template>
  <n-card :title="msg">
    <n-skeleton text :repeat="10" />
    <n-skeleton text style="width: 60%" />
  </n-card>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
