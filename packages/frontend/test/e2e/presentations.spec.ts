import { expect, test } from '@playwright/test'
import { presenterCredentialsFile } from './helpers.js'
import { PresentationsPage } from './presentations.page.js'

test.use({ storageState: presenterCredentialsFile })

test.describe('Presentation handling', async () => {
  const now = new Date()
  const presentationTitle = `Playwright rules on ${now.toISOString()}`
  const presentationDescription = `We've come a long way.\nThis test started at ${now.toISOString()}`
  let createdPresentationId: string

  test.beforeEach(async ({ page }) => {
    const presentationsPage = new PresentationsPage(page)

    await presentationsPage.goto()
    await presentationsPage.newPresentationButton.click()
    await presentationsPage.newPresentationTitleInput.fill(presentationTitle)
    await presentationsPage.newPresentationDescriptionInput.click()
    await presentationsPage.newPresentationDescriptionInput.fill(presentationDescription)
    await presentationsPage.createPresentationButton.click()

    await presentationsPage.page.waitForURL(new RegExp(/\/presentations\/\d+/))
    createdPresentationId = page.url().slice(page.url().lastIndexOf('/') + 1)
  })

  test('Should have created the presentation with basic properties', async ({ page }) => {
    const presentationsPage = new PresentationsPage(page)
    await expect(presentationsPage.currentPresentationTitle).toHaveText(presentationTitle)
    await expect(presentationsPage.currentPresentationDescription).toHaveText(
      presentationDescription
    )
    await expect(presentationsPage.startPresentationButton).toBeEnabled()
    await expect(presentationsPage.stopPresentationButton).toBeDisabled()
    await expect(presentationsPage.qrCodeButton).toBeEnabled()
  })

  test('Should be able to start and stop the presentation', async ({ page }) => {
    const presentationsPage = new PresentationsPage(page)

    await presentationsPage.startPresentationButton.click()
    await expect(presentationsPage.stopPresentationButton).toBeEnabled()
    await expect(presentationsPage.eventsList.locator('.presentation_start')).toHaveText(/start/)

    await presentationsPage.stopPresentationButton.click()
    await expect(presentationsPage.startPresentationButton).toBeEnabled()
    await expect(presentationsPage.eventsList.locator('.presentation_stop')).toHaveText(/stop/)
  })

  test('Should be able to send broadcast messages', async ({ page }) => {
    const presentationsPage = new PresentationsPage(page)
    const textClick = `clicked a broadcast on ${new Date().toISOString()}`

    await presentationsPage.broadcastInput.fill(textClick)
    await presentationsPage.broadcastButton.click()
    await expect(presentationsPage.eventsList.getByText(textClick)).toBeVisible()
    await expect(presentationsPage.broadcastInput).toBeEmpty()

    const textEnter = `entered a broadcast on ${new Date().toISOString()}`
    await presentationsPage.broadcastInput.fill(textEnter)
    await presentationsPage.broadcastInput.press('Enter')
    await expect(presentationsPage.eventsList.getByText(textEnter)).toBeVisible()
    await expect(presentationsPage.broadcastInput).toBeEmpty()
  })

  test.afterEach(async ({ page }) => {
    const presentationsPage = new PresentationsPage(page)

    await presentationsPage.gotoPresentation(createdPresentationId)

    // the deletion button is hidden, so we need to force the click
    await presentationsPage.deletePresentationButton.click({ force: true })
  })
})
