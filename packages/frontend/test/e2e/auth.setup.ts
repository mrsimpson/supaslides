import { expect, Page, test as setup } from '@playwright/test'
import { audienceCredentialsFile, post, presenterCredentialsFile } from './helpers.js'
import * as process from 'node:process'

const presenterEmail = process.env.TEST_PRESENTER_EMAIL!
const presenterPassword = process.env.TEST_PRESENTER_PASSWORD!
const audienceEmail = process.env.TEST_AUDIENCE_EMAIL!
const audiencePassword = process.env.TEST_AUDIENCE_PASSWORD!

async function signIn(page: Page, email: string, password: string, credentialsFile: string) {
  await page.goto('/me')
  await expect(page.getByTestId('input-signin-email')).toBeVisible()
  await page.getByTestId('input-signin-email').getByRole('textbox').fill(email)
  await page.getByTestId('input-signin-password').getByRole('textbox').fill(password)
  await page.getByTestId('button-signin-submit').click()

  // Once the logout is active, we're surely logged in
  await expect(page.getByTestId('button-account-signOut')).toBeEnabled()

  await page.context().storageState({ path: credentialsFile })
}

setup('create the test user accounts if not exists', async ({ request }) => {
  async function signUp(email: string, password: string) {
    await post(request, '/auth/v1/signup', {
      email,
      password
    })
  }

  await signUp(presenterEmail, presenterPassword)
  await signUp(audienceEmail, audiencePassword)
})

setup('authenticate as presenter', async ({ page }) => {
  await signIn(page, presenterEmail, presenterPassword, presenterCredentialsFile)
})

setup('authenticate as audience', async ({ page }) => {
  await signIn(page, audienceEmail, audiencePassword, audienceCredentialsFile)
})
