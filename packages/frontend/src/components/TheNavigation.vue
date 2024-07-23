<script lang="ts" setup>
import { type MenuOption, NMenu } from 'naive-ui'
import { RouterLink, useRoute } from 'vue-router'
import renderIcon from '@/lib/renderIcon'
import { h, ref, watch } from 'vue'
import { Chat, PresentationFile, User } from '@vicons/carbon'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const activeKey = ref<string | undefined>('')
watch(
  () => route.name,
  (name) => {
    activeKey.value = name?.toString()
  }
)

const menuOptions: MenuOption[] = [
  // {
  //   label: () =>
  //     h(
  //       RouterLink,
  //       {
  //         to: {
  //           name: 'intro'
  //         }
  //       },
  //       { default: () => 'Intro' }
  //     ),
  //   key: 'intro',
  //   icon: () => h(Home)
  // },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'presentations'
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
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'imprint'
          }
        },
        { default: () => t('imprint') }
      ),
    key: 'imprint'
    // icon: renderIcon(ParagraphIcon)
  }
  // {
  //   label: () => 'https://github.com/mrsimpson/slideshow-frontend/',
  //   // h(
  //   //     HTMLAnchorElement,
  //   //     // {
  //   //     //   href: "https://github.com/mrsimpson/slideshow-frontend/",
  //   //     //   target: "_blank"
  //   //     // },
  //   //     {},
  //   //     { default: () => 'Github' }
  //   // ),
  //   key: 'github'
  //   // icon: renderIcon("@/assets/GitHubIcon.svg")
  // },
  // {
  //   label: () =>
  //     h(
  //       RouterLink,
  //       {
  //         to: {
  //           name: 'github'
  //         }
  //       },
  //       { default: () => 'Github' }
  //     ),
  //   key: 'github'
  //   // icon: renderIcon("@/assets/GitHubIcon.svg")
  // }
  //   <div class="menu-bar">
  //       <RouterLink :to="{ name: 'imprint' }">
  // <img alt="paragraph-icon" src="@/assets/ParagraphIcon.svg" />
  //     Impressum
  //     </RouterLink>
  //
  //     <a href="https://github.com/mrsimpson/slideshow-frontend/" target="_blank">
  // <img alt="github-icon" src="@/assets/GitHubIcon.svg" />
  //     GitHub
  //     </a>
  //
  //     <RouterLink :to="{ name: 'data-protection' }">
  //     <n-icon>
  //     <DataProtectionIcon />
  //     </n-icon>
  // Datenschutz
  // </RouterLink>
  // </div>
]
</script>

<template>
  <n-menu v-model:value="activeKey" :options="menuOptions" mode="vertical" />
</template>
