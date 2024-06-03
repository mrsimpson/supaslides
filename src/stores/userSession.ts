import { defineStore } from 'pinia'
import type { Session } from '@supabase/supabase-js'

export const userSessionStore = defineStore('userSessionStore', {
  state: () => ({ session: null as Session | null, nickname: '' })
})
