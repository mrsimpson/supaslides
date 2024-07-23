import { expect, test } from '@playwright/test'
import { presenterCredentialsFile } from './helpers.js'
import { ProfilePage } from './profile.page.js'

test.use({ storageState: presenterCredentialsFile })

test('After sign-in, the profile page should be visible', async ({ page }) => {
  const profilePage = new ProfilePage(page)
  await profilePage.goto()
  await profilePage.isProfileLoaded()

  await expect(profilePage.email).toBeDisabled()
  await expect(profilePage.email).toHaveValue('presenter@local')
  await expect(profilePage.signOutButton).toBeEnabled()
})

test('Should be able to update username ', async ({ page }) => {
  const profilePage = new ProfilePage(page)
  await profilePage.goto()
  await profilePage.isProfileLoaded()

  const newUsername = `presenter-${new Date().toISOString()}`
  await profilePage.username.fill(newUsername)
  await profilePage.updateButton.click()

  await profilePage.page.reload()
  await expect(profilePage.username).toHaveValue(newUsername)
})

test('Should be able to log out', async ({ page }) => {
  const profilePage = new ProfilePage(page)
  await profilePage.goto()
  await profilePage.isProfileLoaded()

  await profilePage.signOutButton.click()
  //should be redirected to root
  await profilePage.page.waitForURL('/')
  await profilePage.goto()
  await expect(profilePage.signInEmail).toBeEditable()
})
