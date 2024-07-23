<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-theme-editor :style="themeEditorStyle">
      <n-layout :has-sider="isSignedIn">
        <n-layout-sider
          v-if="isSignedIn"
          :collapsed="menuCollapsed"
          :collapsed-width="64"
          :onUpdate:collapsed="handleSiderUpdate"
          collapse-mode="width"
          show-trigger
        >
          <TheNavigation />
        </n-layout-sider>
        <n-layout-content class="full-height">
          <n-message-provider>
            <n-space vertical>
              <n-card centered>
                <RouterView />
              </n-card>
            </n-space>
          </n-message-provider>
        </n-layout-content>
      </n-layout>
    </n-theme-editor>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  darkTheme,
  type GlobalTheme,
  type GlobalThemeOverrides,
  NCard,
  NConfigProvider,
  NLayout,
  NLayoutContent,
  NMessageProvider,
  NSpace,
  NThemeEditor,
  useOsTheme
} from 'naive-ui'
import TheNavigation from '@/components/TheNavigation.vue'
import { useUserSessionStore } from '@/stores/userSession'
import { storeToRefs } from 'pinia'

const osThemeRef = useOsTheme()
const theme = ref((osThemeRef.value === 'dark' ? darkTheme : null) as GlobalTheme | null)

const themeOverrides: GlobalThemeOverrides = {
  //   Menu: {
  //     color: '#00000000'
  //   },
  //   common: {
  //     primaryColor: 'rgb(7, 25, 82)',
  //     primaryColorHover: 'rgb(8, 131, 149)',
  //     primaryColorPressed: 'rgb(55, 183, 195)',
  //     primaryColorSuppl: 'rgb(235, 244, 246)',
  //     actionColor: 'rgb(8, 131, 149)'
  //   },
  //   Card: {
  //     colorEmbedded: 'rgba(235, 244, 246, 0.53)'
  //   }
}

const themeEditorStyle = localStorage.getItem('theme') === 'true' ? {} : { display: 'none' }

useUserSessionStore().initialize()
const { menuCollapsed, isSignedIn } = storeToRefs(useUserSessionStore())

function handleSiderUpdate(isCollapsed: boolean) {
  menuCollapsed.value = isCollapsed
}
</script>

<!-- Global styles -->
<style>
a:hover {
  background-color: unset;
}

p {
  margin-block-end: 0.5rem;
  margin-block-start: 0.5rem;
}
</style>
