import { BasePage } from './base-page.js'
import { Locator, Page } from '@playwright/test'

export class JoinPage extends BasePage {
  readonly displayName: Locator
  readonly joinButton: Locator
  readonly presentationTitle: Locator
  readonly presentationDescription: Locator
  readonly presentationPresenter: Locator

  constructor(page: Page) {
    super(page)
    this.displayName = page.getByTestId('input-display-name').getByRole('textbox')
    this.joinButton = page.getByTestId('button-join')
    this.presentationTitle = page.getByTestId('text-presentation-title').locator('.n-card-header__main')
    this.presentationDescription = page.getByTestId('text-presentation-description')
    this.presentationPresenter = page.getByTestId('text-presentation-presenter')
  }

  public async goto(joinCode: string): Promise<void> {
    await super.goto(`/#/join/?code=${joinCode}`)
  }
}
