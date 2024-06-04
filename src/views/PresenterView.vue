<template>
  <NCard v-if="!isSignedIn" bordered title="Present something">
    <p>Here, you get an overview of your presentations.</p>
    <p>However, you need to be signed in in order to do that</p>
    <NButton>
      <router-link to="/me">Sign In</router-link>
    </NButton>
  </NCard>
  <ThePresenterPage v-else />
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { NButton, NCard } from 'naive-ui'
import { useUserSessionStore } from '@/stores/userSession'
import ThePresenterPage from '@/components/ThePresenterPage.vue'

const { isSignedIn } = storeToRefs(useUserSessionStore())
</script>
