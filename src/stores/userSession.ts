import { defineStore } from 'pinia'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface UserSessionState {
  initialized: boolean
  session: Session | null
  nickname: ''
}

export const useUserSessionStore = defineStore('userSessionStore', {
  state: () => ({ session: null, nickname: '', initialized: false }) as UserSessionState,
  getters: {
    isSignedIn: (state) => !!state.session
  },
  actions: {
    async initialize() {
      // listen for auth events (e.g. sign in, sign out, refresh)
      // set session based on the auth event
      supabase.auth.onAuthStateChange((event, session) => {
        console.log(event)
        this.session = session
      })

      this.initialized = true
    }
  }
})
