import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly subscribeButton: Locator;
  readonly loginButton: Locator;
  readonly partnerLoginButton: Locator;
  readonly acceptCookiesButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Accessible, non-brittle locators matching the Paramount+ IT home page
    this.subscribeButton = page.getByRole('link', { name: /ABBONATI A PARAMOUNT\+/i }).first();
    this.loginButton = page.getByRole('link', { name: /ACCEDI A PARAMOUNT\+/i }).first();
    this.partnerLoginButton = page.getByRole('link', { name: /ACCEDI CON UN PARTNER/i }).first();
    this.acceptCookiesButton = page.getByRole('button', { name: /^(accetta|accept)$/i });
  }

  async navigate(): Promise<void> {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await this.page.goto('https://www.paramountplus.com/it/', {
        waitUntil: 'commit',
        timeout: 15000,
      });

      if (await this.subscribeButton.isVisible({ timeout: 10000 }).catch(() => false)) {
        return;
      }
    }

    await this.subscribeButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  async handleCookieBanner(): Promise<void> {
    if (await this.acceptCookiesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.acceptCookiesButton.click();
      await this.subscribeButton.waitFor({ state: 'visible', timeout: 10000 });
    }
  }

  async clickSubscribe(): Promise<void> {
    await this.subscribeButton.waitFor({ state: 'visible' });
    await this.navigateToLink(this.subscribeButton);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.navigateToLink(this.loginButton);
  }

  async clickPartnerLogin(): Promise<void> {
    await this.partnerLoginButton.waitFor({ state: 'visible' });
    await this.navigateToLink(this.partnerLoginButton);
  }

  private async navigateToLink(link: Locator): Promise<void> {
    const href = await link.getAttribute('href');

    if (!href) {
      throw new Error('Home page navigation link has no href.');
    }

    await this.page.goto(new URL(href, this.page.url()).toString(), {
      waitUntil: 'commit',
      timeout: 15000,
    });
  }
}