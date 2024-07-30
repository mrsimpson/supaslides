import { APIRequestContext } from '@playwright/test'

export const presenterCredentialsFile = '.auth/presenter.json'
export const audienceCredentialsFile = '.auth/audience.json'

async function getHeaders(request: APIRequestContext) {
  let accessToken

  const origin = (await request.storageState()).origins[0]
  if (origin) {
    const { localStorage } = origin
    const authToken = localStorage && localStorage.find((item) => item.name === 'sb-127-auth-token')
    accessToken = authToken ? JSON.parse(authToken.value).access_token : null
  }
  const headers = {
    apikey: process.env.SUPABASE_ANON_KEY!,
    'Content-Type': 'application/json'
  } as any
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  return headers
}

export async function post(request: APIRequestContext, path?: string, data?: any) {
  const response = await request.post(`${process.env.SUPABASE_API_URL}${path}`, {
    headers: await getHeaders(request),
    data
  })
  return response.json()
}

export async function get(request: APIRequestContext, path?: string) {
  const response = await request.get(`${process.env.SUPABASE_API_URL}${path}`, {
    headers: await getHeaders(request)
  })
  return response.json()
}
