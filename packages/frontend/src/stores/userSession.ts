// src/stores/userSession.ts
import { defineStore } from 'pinia'
import type { Session } from '@supabase/supabase-js'
import type { Backend } from '@/api/Backend'
import { createBackend } from '@/api/supabaseBackend'
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers'
import type { Profile } from '@/api/types/entities'

const backend: Backend = createBackend()

export interface UserSessionState {
  initialized: boolean
  anonUuid: RemovableRef<string>
  session: RemovableRef<Session | null>
  displayName: RemovableRef<string>
  menuCollapsed: RemovableRef<boolean>
}

export const useUserSessionStore = defineStore('userSessionStore', {
  state: () =>
    ({
      initialized: false,
      anonUuid: useStorage('pinia/userSession/anonUuid', uuid()),
      session: useStorage('pinia/userSession/session', null),
      displayName: useStorage('pinia/userSession/displayName', ''),
      menuCollapsed: useStorage('pinia/userSession/menuCollapsed', false)
    }) as UserSessionState,
  getters: {
    isSignedIn: (state) => !!state.session
  },
  actions: {
    initialize() {
      backend.registerAuthCallback((event, session) => {
        console.log(event)
        this.session = session
      })
      this.initialized = true
    },
    setDisplayName(newDisplayName: string) {
      this.displayName = newDisplayName
    },
    fetchProfile: async (userId: Profile['id']) => {
      return backend.fetchProfile(userId)
    },
    updateProfile: async (profile: Profile) => {
      return backend.updateProfile(profile)
    },
    signInWithPassword: async (email: string, password: string) => {
      return await backend.signInWithPassword(email, password)
    },
    signInWithMagicLink: async (email: string) => {
      return backend.signInWithMagicLink(email)
    },
    signOut: async () => {
      return await backend.signOut()
    }
  }
})
