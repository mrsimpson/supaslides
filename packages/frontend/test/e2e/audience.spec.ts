import { expect, test } from '@playwright/test'
import { audienceCredentialsFile, get, presenterCredentialsFile } from './helpers.js'
import { PresentationsPage } from './presentations.page.js'
import { JoinPage } from './join.page.js'

test.use({ storageState: audienceCredentialsFile })

test.describe('Participating in a presentation', async () => {
  const now = new Date()
  const presentationTitle = `Playwright rules on ${now.toISOString()}`
  const presentationDescription = `We've come a long way.\nThis test started at ${now.toISOString()}`
  let createdPresentationId: string
  let joinCode: string

  test.beforeAll(async ({ browser }) => {
    const presenterContext = await browser.newContext({ storageState: presenterCredentialsFile })
    const page = await presenterContext.newPage()
    const request = await presenterContext.request
    const presentationsPage = new PresentationsPage(page)

    await presentationsPage.goto()
    await presentationsPage.newPresentationButton.click()
    await presentationsPage.newPresentationTitleInput.fill(presentationTitle)
    await presentationsPage.newPresentationDescriptionInput.click()
    await presentationsPage.newPresentationDescriptionInput.fill(presentationDescription)
    await presentationsPage.createPresentationButton.click()

    await presentationsPage.page.waitForURL(new RegExp(/\/presentations\/\d+/))
    createdPresentationId = page.url().slice(page.url().lastIndexOf('/') + 1)

    const createdPresentation = await get(request, `/rest/v1/presentations?select=*&id=eq.${createdPresentationId}`)
    joinCode = createdPresentation[0].join_code
  })

  test('Should be possible to join with the valid join code', async ({ page }) => {
    const joinPage = new JoinPage(page)

    await joinPage.goto(joinCode)

    await expect(joinPage.presentationTitle).toHaveText(presentationTitle)
    await expect(joinPage.presentationDescription).toHaveText(presentationDescription)
    await expect(joinPage.joinButton).toBeDisabled()
    await joinPage.displayName.fill('A good guest')
    await joinPage.page.keyboard.press('Enter')
    await expect(joinPage.joinButton).toBeEnabled()
  })

  test.afterAll(async ({ browser }) => {
    const presenterContext = await browser.newContext({ storageState: presenterCredentialsFile })
    const page = await presenterContext.newPage()
    const presentationsPage = new PresentationsPage(page)

    await presentationsPage.gotoPresentation(createdPresentationId)

    // the deletion button is hidden, so we need to force the click
    await presentationsPage.deletePresentationButton.click({ force: true })
  })
})
