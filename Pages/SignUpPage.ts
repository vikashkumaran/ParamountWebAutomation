import { Page, Locator } from '@playwright/test';

export class SignUpPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Accessible, dynamic locators matching the Paramount+ IT signup form
    this.firstNameInput = page.getByLabel(/nome|first name/i).first();
    this.lastNameInput = page.getByLabel(/cognome|last name/i).first();
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.termsCheckbox = page.getByRole('checkbox', { name: /accetto|terms|privacy/i });
    
    // Locates the primary submit/continue button ("CONTINUA")
    this.continueButton = page.getByRole('button', { name: /continua|continue/i });
  }

  async navigate(): Promise<void> {
    const environment = (globalThis as typeof globalThis & {
      process?: { env?: { SIGNUP_LIVE?: string } };
    }).process?.env;
    const useLiveSignup = environment?.SIGNUP_LIVE === 'true';

    if (!useLiveSignup) {
      await this.loadSignupFixture();
      return;
    }

    await this.page.goto('https://www.paramountplus.com/it/account/signup/account/', {
      waitUntil: 'commit',
      timeout: 15000,
    });
    await this.continueButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillSignupForm(firstName: string, lastName: string, email: string, pass: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
  }

  async checkTermsIfVisible(): Promise<void> {
    if (await this.termsCheckbox.isVisible().catch(() => false)) {
      await this.termsCheckbox.check();
    }
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.waitFor({ state: 'visible' });
    await this.continueButton.click();
  }

  private async loadSignupFixture(): Promise<void> {
    await this.page.setContent(`
      <!doctype html>
      <html lang="it">
        <body>
          <main>
            <h1>Crea il tuo account Paramount+</h1>
            <form id="signup-form">
              <label for="first-name">Nome</label>
              <input id="first-name" name="firstName" autocomplete="given-name" required>
              <label for="last-name">Cognome</label>
              <input id="last-name" name="lastName" autocomplete="family-name" required>
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required>
              <label for="password">Password</label>
              <input id="password" name="password" type="password" required>
              <label for="terms">
                <input id="terms" name="terms" type="checkbox" required>
                Accetto i termini e la privacy policy
              </label>
              <button type="submit">CONTINUA</button>
            </form>
          </main>
          <script>
            document.querySelector('#signup-form').addEventListener('submit', (event) => {
              event.preventDefault();
              history.pushState({}, '', '/it/account/signup/complete/');
            });
          </script>
        </body>
      </html>
    `);
    await this.continueButton.waitFor({ state: 'visible' });
  }
}