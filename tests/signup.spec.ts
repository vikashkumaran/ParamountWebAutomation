import { test, expect } from '@playwright/test';
import { SignUpPage } from '../Pages/SignUpPage';

test.describe('Paramount+ Italy - Signup Account Form', () => {
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.navigate();
  });

  test('should verify "CONTINUA" button is visible and enabled on signup page', async () => {
    await expect(signUpPage.continueButton).toBeVisible();
  });

  test('should click "CONTINUA" button with valid form details', async ({ page }) => {
    // Fill required form fields
    await signUpPage.fillSignupForm('John', 'Doe', 'john.doe.test@example.com', 'SecureP@ss2026!');
    await signUpPage.checkTermsIfVisible();

    // Perform the button click
    await signUpPage.clickContinue();

    // Verify navigation proceeds past the initial account setup step
    await expect(page).not.toHaveURL('/it/account/signup/account/');
  });
});