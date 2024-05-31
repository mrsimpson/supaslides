<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { NMenu } from 'naive-ui'
import { RouterLink, useRoute } from 'vue-router'
import renderIcon from '@/lib/renderIcon'
import { h, ref, watch } from 'vue'
import { Home, Chat } from '@vicons/carbon'

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
        { default: () => 'Einführung' }
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
            name: 'feedback'
          }
        },
        { default: () => 'Feedback' }
      ),
    key: 'feedback',
    icon: renderIcon(Chat)
  }
]
</script>

<template>
  <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
</template>
