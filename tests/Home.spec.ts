import { test, expect } from '@playwright/test';
import { HomePage } from '../Pages/HomePage';

test.describe('Paramount+ Italy - Home Page Navigation Buttons', () => {
  let homepage: HomePage;

  test.beforeEach(async ({ page }) => {
    homepage = new HomePage(page);
    await homepage.navigate();
    await homepage.handleCookieBanner();
  });

  test('should verify "ABBONATI A PARAMOUNT+" button functionality', async ({ page }) => {
    await expect(homepage.subscribeButton).toBeVisible();
    await homepage.clickSubscribe();

    await expect(page).toHaveURL(/.*(signup|plan|checkout|account).*/);
  });

  test('should verify "ACCEDI A PARAMOUNT+" button redirects to login page', async ({ page }) => {
    await expect(homepage.loginButton).toBeVisible();
    await homepage.clickLogin();

    // Verifies navigation to the login/sign-in page
    await expect(page).toHaveURL(/.*(login|signin|account).*/);
  });

  test('should verify "ACCEDI CON UN PARTNER" button redirects to partner login flow', async ({ page }) => {
    await expect(homepage.partnerLoginButton).toBeVisible();
    await homepage.clickPartnerLogin();

    // Verifies navigation to partner authentication
    await expect(page).toHaveURL(/.*(partner|link|provider).*/);
  });
});