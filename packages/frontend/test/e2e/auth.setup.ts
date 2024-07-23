import { expect, Page, test as setup } from '@playwright/test'
import { audienceCredentialsFile, presenterCredentialsFile } from './helpers.js'

async function signIn(page: Page, email: string, password: string, credentialsFile: string) {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('http://localhost:5173/me')
  await page.getByTestId('input-signin-email').getByRole('textbox').fill(email)
  await page.getByTestId('input-signin-password').getByRole('textbox').fill(password)
  await page.getByTestId('button-signin-submit').click()

  // Once the logout is active, we're surely logged in
  await expect(page.getByTestId('button-account-signOut')).toBeEnabled()

  await page.context().storageState({ path: credentialsFile })
}

setup('authenticate as presenter', async ({ page }) => {
  await signIn(page, 'presenter@local', 'presenter', presenterCredentialsFile)
})

setup('authenticate as audience', async ({ page }) => {
  await signIn(page, 'audience1@local', 'audience1', audienceCredentialsFile)
})
