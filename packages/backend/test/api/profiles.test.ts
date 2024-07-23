import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {ensureSignIn, session, signOut} from './auth';
import {baseUrl, supabaseAnonKey} from "./config";
import {Profile, testProfile, userPresenter} from "./testdata";

describe('Profiles API', () => {
    const startOfTest = new Date()
    let authToken: string

    beforeAll(async () => {
        const session = await ensureSignIn(userPresenter)
        authToken = session.access_token
    })

    afterAll(async () => {
        await signOut(authToken)
    })

    it('should create a profile', async () => {
        const response = await fetch(`${baseUrl}/rest/v1/profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'apikey': supabaseAnonKey
            },
            body: JSON.stringify(testProfile(session.user.id))
        });
        expect(response.status).toBe(201);
    });

    it('should get profiles', async () => {
        const response = await fetch(`${baseUrl}/rest/v1/profiles?id=eq.${session.user.id}&select=*`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'apikey': supabaseAnonKey
            }
        });
        expect(response.status).toBe(200);
        const profiles = await response.json() as Profile[];
        expect(profiles).toBeInstanceOf(Array);
        expect(profiles.length).gte(1)
        const profile = profiles.find(p => p.id === session.user.id)
        expect(profile).includes(testProfile(session.user.id))
        expect(new Date(profile!.updated_at!)).greaterThan(startOfTest)
    });

    it('should update a profile', async () => {
        const response = await fetch(`${baseUrl}/rest/v1/profiles?id=eq.${session.user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'apikey': supabaseAnonKey
            },
            body: JSON.stringify({full_name: 'Updated User'})
        });
        expect(response.status).toBe(204);
    });

    it('should delete a profile', async () => {
        const response = await fetch(`${baseUrl}/rest/v1/profiles?id=eq.${session.user.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'apikey': supabaseAnonKey
            }
        });
        expect(response.status).toBe(204);
    });

    afterAll(async () => {
        // Cleanup profile for repeatability
        const response = await fetch(`${baseUrl}/rest/v1/profiles?id=eq.${session.user.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'apikey': supabaseAnonKey
            }
        });

        if (!response.ok) {
            throw new Error('Profile failed to clean up')
        }
    })
});
