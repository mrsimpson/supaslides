<template>
  <div>
    <SignIn v-if="!session" />
    <Account v-else />
  </div>
</template>

<script setup lang="ts">
import { useUserSessionStore } from '@/stores/userSession'
import SignIn from '@/components/SignIn.vue'
import Account from '@/components/AccountForm.vue'
import { storeToRefs } from 'pinia'

const { session } = storeToRefs(useUserSessionStore())
</script>
