import { BasePage } from './base-page.js'
import { Locator, Page } from '@playwright/test'

export class PresentationsPage extends BasePage {
  readonly newPresentationButton: Locator
  readonly newPresentationTitleInput: Locator
  readonly newPresentationDescriptionInput: Locator
  readonly createPresentationButton: Locator
  readonly deletePresentationButton: Locator
  readonly startPresentationButton: Locator
  readonly stopPresentationButton: Locator
  readonly qrCodeButton: Locator
  readonly currentPresentationTitle: Locator
  readonly currentPresentationDescription: Locator
  readonly eventsList: Locator
  readonly broadcastInput: Locator
  readonly broadcastButton: Locator

  constructor(page: Page) {
    super(page)
    this.newPresentationButton = page.getByTestId('button-new-presentation')
    this.newPresentationTitleInput = page
      .getByTestId('input-presentation-title')
      .getByRole('textbox')
    this.newPresentationDescriptionInput = page
      .getByTestId('input-presentation-description')
      .getByRole('textbox')
    this.createPresentationButton = page.getByTestId('button-create-presentation')
    this.deletePresentationButton = page.getByTestId('button-delete-presentation')
    this.startPresentationButton = page.getByTestId('button-start-presentation')
    this.stopPresentationButton = page.getByTestId('button-stop-presentation')
    this.qrCodeButton = page.getByTestId('button-qrcode')
    this.currentPresentationTitle = page
      .getByTestId('thing-presentation-factsheet')
      .locator('.n-thing-header__title')
    this.currentPresentationDescription = page
      .getByTestId('thing-presentation-factsheet')
      .locator('.n-thing-main__description')
    this.eventsList = page.getByTestId('container-event-list')
    this.broadcastInput = page.getByTestId('input-send-broadcast').getByRole('textbox')
    this.broadcastButton = page.getByTestId('button-send-broadcast')
  }

  public async goto(): Promise<void> {
    await super.goto('/presentations')
  }

  public async gotoPresentation(presentationId: string) {
    await super.goto(`/presentations/${presentationId}`)
  }
}
