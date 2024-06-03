<template>
  <PresentationFactsheet v-if="activePresentation" :presentation="activePresentation" />
</template>
<script lang="ts" setup>
import PresentationFactsheet from '@/components/PresentationFactsheet.vue'
import { usePresenterStore } from '@/stores/presenter'
import { storeToRefs } from 'pinia'

const presenterStore = usePresenterStore()
const { isInitialized, activePresentation } = storeToRefs(presenterStore)
if (!isInitialized.value) presenterStore.initialize()
</script>
