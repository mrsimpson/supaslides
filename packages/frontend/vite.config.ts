import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

// Load environment variables from.env file
dotenv.config({ path: ['.env.local', '../../.env.local', '.env'] })
process.env.VITE_SUPABASE_URL = process.env.SUPABASE_API_URL
process.env.VITE_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
