<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { NMenu } from 'naive-ui'
import { RouterLink, useRoute } from 'vue-router'
import renderIcon from '@/lib/renderIcon'
import { h, ref, watch } from 'vue'
import { Home, Chat, User, PresentationFile } from '@vicons/carbon'

const route = useRoute()
const activeKey = ref<string | undefined>('')
watch(
  () => route.name,
  (name) => {
    activeKey.value = name?.toString()
  }
)

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'intro'
          }
        },
        { default: () => 'Intro' }
      ),
    key: 'intro',
    icon: () => h(Home)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'presenter'
          }
        },
        { default: () => 'My Presentations' }
      ),
    key: 'presenter',
    icon: renderIcon(PresentationFile)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'feedback'
          }
        },
        { default: () => 'Feedback' }
      ),
    key: 'feedback',
    icon: renderIcon(Chat)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'me'
          }
        },
        { default: () => 'My profile' }
      ),
    key: 'me',
    icon: renderIcon(User)
  }
]
</script>

<template>
  <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
</template>
