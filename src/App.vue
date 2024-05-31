<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Account from './components/TheAccount.vue'
import Auth from './components/Auth.vue'
import { supabase } from '@/lib/supabase'
import type { GlobalTheme, GlobalThemeOverrides } from 'naive-ui'
import TheNavigation from '@/components/TheNavigation.vue'
import TheFooter from '@/components/TheFooter.vue'
import {
  NThemeEditor,
  NConfigProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NMessageProvider,
  NSpace,
  NCard
} from 'naive-ui'

// const osThemeRef = useOsTheme()
//const theme = ref((osThemeRef.value === 'dark' ? darkTheme : null) as GlobalTheme | null)
const theme = ref(null as GlobalTheme | null)

const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontSize: '16px',
    primaryColor: '#00AAE8FF',
    primaryColorHover: '#00BBFFFF',
    primaryColorPressed: '#0B5976FF',
    primaryColorSuppl: '#338FB1FF'
  },
  Card: {
    colorEmbedded: 'rgba(213, 245, 255, 1)'
  }
}

const themeEditorStyle = localStorage.getItem('theme') === 'true' ? {} : { display: 'none' }

const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-theme-editor :style="themeEditorStyle">
      <n-layout>
        <n-layout-header>
          <TheNavigation />
        </n-layout-header>
        <n-layout-content>
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
.n-layout {
  max-width: 1024px;
  margin: auto;
}

.n-layout-content {
  padding-bottom: 1rem;
}

.n-layout-footer.n-layout-footer--static-positioned {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>

<!-- Global styles -->
<style>
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
