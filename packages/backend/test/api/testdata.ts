import {Database} from "@/types/database";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Presentation = Database['public']['Tables']['presentations']['Row'];
export type PresentationEvent = Database['public']['Tables']['presentation_events']['Row'];
export type PresentationPeek = Database['public']['CompositeTypes']['presentation_peek_type'];

export const userPresenter = {
    email: process.env.TEST_PRESENTER_EMAIL || 'test-presenter@local',
    password: process.env.TEST_PRESENTER_PASSWORD || 'test-presenter'
}

export function testProfile(userId: Profile['id']): Partial<Profile> {
    return {
        id: userId,
        username: 'vitest-user',
        full_name: 'Test User',
        avatar_url: 'http://example.com/avatar.png',
        website: 'http://example.com'
    }
}

export function testPresentation(): Partial<Presentation> {
    return {
        title: 'Test Presentation',
        description: 'A test presentation',
        join_code: 'JOIN123',
        lc_status: 'prepared'
    }
}