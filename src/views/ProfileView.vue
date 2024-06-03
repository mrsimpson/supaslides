<template>
  <div>
    <SignIn v-if="!session" />
    <Account v-else />
  </div>
</template>

<script setup lang="ts">
import { userSessionStore } from '@/stores/userSession'
import SignIn from '@/components/SignIn.vue'
import Account from '@/components/Account.vue'
import { storeToRefs } from 'pinia'

const { session } = storeToRefs(userSessionStore())
</script>
