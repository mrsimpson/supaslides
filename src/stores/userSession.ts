import { defineStore } from 'pinia'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers'

export interface UserSessionState {
  initialized: boolean
  anonUuid: RemovableRef<string>
  session: Session | null
  displayName: RemovableRef<string>
}

export const useUserSessionStore = defineStore('userSessionStore', {
  state: () =>
    ({
      session: null,
      anonUuid: useStorage('pinia/userSession/anonUuid', uuid()),
      displayName: useStorage('pinia/userSession/displayName', ''),
      initialized: false
    }) as UserSessionState,
  getters: {
    isSignedIn: (state) => !!state.session
  },
  actions: {
    initialize() {
      // listen for auth events (e.g. sign in, sign out, refresh)
      // set session based on the auth event
      supabase.auth.onAuthStateChange((event, session) => {
        console.log(event)
        this.session = session
      })
      this.initialized = true
    },
    setDisplayName(newDisplayName: string) {
      this.displayName = newDisplayName
    }
  }
})
