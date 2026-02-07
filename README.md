# 🎭 Playwright Test Automation -- Project Setup

This project contains automated end-to-end tests built using
**Playwright** with **TypeScript**. It is designed for fast, reliable,
and maintainable UI testing.

------------------------------------------------------------------------

## 📌 Requirements

Make sure you have the following installed:

-   Node.js (version 18+ recommended)
-   npm or yarn
-   Git

Check versions:

``` bash
node -v
npm -v
git --version
```

------------------------------------------------------------------------

## 🚀 Project Setup

### 1️⃣ Clone the repository

``` bash
git clone <repository-url>
cd <project-folder>
```

------------------------------------------------------------------------

### 2️⃣ Install dependencies

``` bash
npm install
```

------------------------------------------------------------------------

### 3️⃣ Install Playwright browsers

``` bash
npx playwright install
```

------------------------------------------------------------------------

## ▶️ Running Tests

### Run all tests

``` bash
npx playwright test
```

### Run tests in headed mode

``` bash
npx playwright test --headed
```

### Run a specific test file

``` bash
npx playwright test  playwright_tests/spf-record-generator-validation.spec.ts
```

### Run tests with UI mode

``` bash
npx playwright test --ui
```

------------------------------------------------------------------------

## 📊 Test Reports

``` bash
npx playwright show-report
```

------------------------------------------------------------------------

## 📁 Project Structure

    .
    ├── playwright_pages/
    ├── playwright_tests/
    ├── playwright_utils/
    ├── global.setup
    ├── playwright.config.ts
    ├── package.json
    └── README.md

------------------------------------------------------------------------


## 🛠 Useful Commands

  Command                                 Description
  --------------------------------------- --------------------
  npx playwright test                     Run all tests
  npx playwright test --ui                UI mode
  npx playwright test --debug             Debug mode
  npx playwright codegen `<url>`{=html}   Generate test code
