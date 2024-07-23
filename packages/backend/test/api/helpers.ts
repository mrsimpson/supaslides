import {supabaseAnonKey} from "@/test/api/config";

export function authenticatedHeaders(authToken: string) {
    return {
        ...anonymousHeaders(),
        'Authorization': `Bearer ${authToken}`,
    }
}

export function anonymousHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
    }
}