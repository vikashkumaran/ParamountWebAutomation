# Paramount+ Italy Automation Suite

## Project Overview
This automated test suite validates the core onboarding and subscription user journeys for **Paramount+ Italy**. Built with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern, it is engineered specifically to handle strict anti-bot measures (Cloudflare/Akamai), dynamic Single-Page Application (SPA) routing, and consent overlays.

---

## Key Technical Architecture & Strategy

### 1. Page Object Model (POM)
* Test assertions (`tests/Home.spec.ts`) are decoupled from page interactions and locator definitions (`Pages/HomePage.ts`).
* All asynchronous methods explicitly return `Promise<void>` to enforce strong typing and prevent unhandled promise rejections.

### 2. Anti-Bot (403 Forbidden) & SPA Bypass (`navigateToLink`)
* **The Problem:** Standard Playwright click events (`page.click()`) fire synthetic pointer events. Anti-bot scripts intercept these events, flag the runner as automated, and throw **403 Forbidden** errors.
* **The Solution:** Rather than triggering pointer events on navigation links, the `navigateToLink()` helper extracts the `href` attribute directly from the DOM locator, resolves the full destination URL, and triggers a clean, browser-level `page.goto()`. This bypasses JavaScript event listeners while maintaining full automation stability.

### 3. Execution Speed & Network Resilience (`waitUntil: 'commit'`)
* Media-heavy streaming applications constantly download background tracking assets and video manifests, causing default `waitUntil: 'load'` settings to hit standard 30-second timeouts.
* Setting `waitUntil: 'commit'` resolves the navigation step as soon as the first byte of HTML is returned from the server. DOM elements are then safely targeted using Playwright's built-in auto-waiting locators (`waitFor({ state: 'visible' })`).

### 4. Dynamic Overlay Mitigation (`handleCookieBanner`)
* OneTrust cookie/consent banners block UI pointer events on core call-to-action (CTA) buttons.
* A resilient overlay check detects and accepts the cookie modal conditionally within a tight 3-second window, preventing visual interception during test execution.

---

## Code Structure for Team Reference

```text
Paramount_Automation/
├── Pages/
│   ├── HomePage.ts          # Page Object: Locators, anti-bot navigation, overlay handlers
│   └── SignUpPage.ts        # Page Object: Registration flow & step verification
├── tests/
│   └── Home.spec.ts         # Test Suites: Functional specs & assertion logic
├── playwright.config.ts     # Global configuration: Headless settings, workers, tracing
└── tsconfig.json            # TypeScript build & type definition setup