import type { PresentationEvent } from 'src/api/types/entities'
import { useUserSessionStore } from '@/stores/userSession'

export async function getAuthorDisplayName(event: PresentationEvent) {
  const registeredUsers = new Map<PresentationEvent['created_by'], string>()
  const { fetchProfile } = useUserSessionStore()

  if (event.created_by_alias) {
    return event.created_by_alias
  } else {
    if (event.created_by && !registeredUsers.has(event.created_by)) {
      // buffer it
      const profile = await fetchProfile(event.created_by)

      if (profile) {
        const displayName = profile.full_name || profile.username
        if (displayName) registeredUsers.set(event.created_by, displayName)
      }
    }
    if (registeredUsers.has(event.created_by)) {
      return registeredUsers.get(event.created_by)
    }
  }
  return 'anonymous'
}
