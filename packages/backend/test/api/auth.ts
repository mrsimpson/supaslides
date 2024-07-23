// tests/auth.ts
import {Session} from "@supabase/supabase-js";
import {baseUrl, supabaseAnonKey} from './config'

export let session: Session

export async function signUp(email: string,
                             password: string) {
    await fetch(`${baseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
            email,
            password
        })
    });
}

export async function signIn(email: string,
                             password: string) {
    const response = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    session = await response.json() as Session;

    return session
}

export async function signOut(authToken: string) {
    const response = await fetch(`${baseUrl}/auth/v1/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'apikey': supabaseAnonKey
        }
    });
}

export async function ensureSignIn({
                                       email = 'test-presenter@local',
                                       password = 'test-presenter'
                                   }) {
    // Create the user if it doesn't exist yet
    await signUp(email, password);

    // Authenticate the user to get the token
    return await signIn(email, password);
}