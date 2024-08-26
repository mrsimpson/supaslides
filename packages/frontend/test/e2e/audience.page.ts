import { BasePage } from './base-page.js'
import { Locator, Page } from '@playwright/test'

export class AudiencePage extends BasePage {
  readonly commentButton: Locator
  readonly commentInput: Locator
  readonly thumbsUpEmojiReaction: Locator
  readonly eventsList: Locator
  readonly currentPresentationHeading: Locator
  constructor(page: Page) {
    super(page)
    this.commentButton = page.getByTestId('button-comment-send')
    this.commentInput = page.getByTestId('input-comment').getByRole('textbox')
    this.currentPresentationHeading = page.getByTestId('heading-current-presentation')
    this.thumbsUpEmojiReaction = page.getByTestId('panel-reactions').getByText('👍')
    this.eventsList = page.getByTestId('container-event-list')
  }

  public async goto(): Promise<void> {
    await super.goto('/#/feedback')
  }
}
