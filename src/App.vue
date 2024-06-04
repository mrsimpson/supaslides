<script lang="ts" setup>
import { ref } from 'vue'
import type { GlobalTheme } from 'naive-ui'
import {
  NCard,
  NConfigProvider,
  NLayout,
  NLayoutContent,
  NLayoutFooter,
  NLayoutHeader,
  NMessageProvider,
  NSpace,
  NThemeEditor
} from 'naive-ui'
import TheNavigation from '@/components/TheNavigation.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useUserSessionStore } from '@/stores/userSession'

// const osThemeRef = useOsTheme()
//const theme = ref((osThemeRef.value === 'dark' ? darkTheme : null) as GlobalTheme | null)
const theme = ref(null as GlobalTheme | null)

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
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-theme-editor :style="themeEditorStyle">
      <n-layout>
        <n-layout-header>
          <TheNavigation />
        </n-layout-header>
        <n-layout-content class="full-height">
          <n-message-provider>
            <n-space vertical>
              <n-card centered>
                <RouterView />
              </n-card>
            </n-space>
          </n-message-provider>
        </n-layout-content>
        <n-layout-footer>
          <TheFooter />
        </n-layout-footer>
      </n-layout>
    </n-theme-editor>
  </n-config-provider>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1024px;
  margin: 0 auto;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.layout-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.layout-footer {
  position: sticky;
  bottom: 0;
  z-index: 100;
}
</style>

<!-- Global styles -->
<style>
:root {
  --primary-color: #00aae8ff;
}

a {
  color: var(--primary-color);
  cursor: pointer;
}

a:hover {
  background-color: unset;
}

p {
  margin-block-end: 0.5rem;
  margin-block-start: 0.5rem;
}
</style>
