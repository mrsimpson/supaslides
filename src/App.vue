<template>
  <n-config-provider :theme="theme" :theme-overrides="null">
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

// const themeOverrides: GlobalThemeOverrides = {
//   common: {
//     fontSize: '16px',
//     primaryColor: '#00AAE8FF',
//     primaryColorHover: '#00BBFFFF',
//     primaryColorPressed: '#0B5976FF',
//     primaryColorSuppl: '#338FB1FF'
//   },
//   Card: {
//     colorEmbedded: 'rgba(213, 245, 255, 1)'
//   }
// }

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
