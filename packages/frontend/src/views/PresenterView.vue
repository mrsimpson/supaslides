<template>
  <NCard v-if="!isSignedIn" bordered title="Present something">
    <p>Here, you get an overview of your presentations.</p>
    <p>However, you need to be signed in in order to do that</p>
    <NButton>
      <router-link to="/me">Sign In</router-link>
    </NButton>
  </NCard>
  <ThePresentationPage v-else-if="$route.name === 'presentation'" />
  <TheNewPresentationPage v-else-if="$route.name === 'newPresentation'" />
  <ThePresentationsList v-else />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { NButton, NCard } from 'naive-ui'
import { useUserSessionStore } from '@/stores/userSession'
import ThePresentationsList from '@/components/ThePresentationsList.vue'
import ThePresentationPage from '@/components/ThePresentationPage.vue'
import { onMounted, watch } from 'vue'
import { usePresenterStore } from '@/stores/presenter'

const { isSignedIn } = storeToRefs(useUserSessionStore())
const presenterStore = usePresenterStore()

async function ensurePresenterStoreInitialization() {
  if (isSignedIn)
    if (!presenterStore.isInitialized) {
      await presenterStore.initialize()
    } else {
      presenterStore.$reset()
    }
}

onMounted(async () => await ensurePresenterStoreInitialization())

watch(isSignedIn, ensurePresenterStoreInitialization, { immediate: true })
</script>
