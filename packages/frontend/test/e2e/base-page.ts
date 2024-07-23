import { Page } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  protected async goto(path: string) {
    // const webSocketPromise = this.page.waitForEvent('websocket', (ws) => {
    //   return ws.url().startsWith(`${process.env.TEST_BASE_URL?.replace(/^http(s?):\/\//, 'wss://')}/socket.io`)
    // })
    await this.page.goto(path)

    // this.socket = await webSocketPromise
  }
}
