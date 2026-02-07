import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./Base.page";

export class SpfRecordGeneratorPage extends BasePage {
  // Selectors
  public readonly getDomainField: Locator;
  public readonly failurePolicyDropdown: Locator;
  public readonly successSummaryValues: Locator;
  public readonly recordContentBlock: Locator;
  public readonly generateButton: Locator;
  public readonly spfLookupTreeTitle: Locator;
  public readonly invalidLocator: Locator;
  public readonly errorContainer: Locator;
  public readonly lookupTreeBody: Locator;
  public readonly domainName: Locator;
  public readonly spfRecord: Locator;
  public readonly getIpList: Locator;
  public readonly warningContainer: Locator;
  public readonly toggleSwitcher: Locator;
  public readonly deleteOptionBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.getDomainField = page.locator("[data-parsley-extract-domain]");
    this.failurePolicyDropdown = page.locator('[data-toggle="dropdown"]');
    this.successSummaryValues = page.locator(".text-status-success");
    this.recordContentBlock = page.locator(".record-content-block");
    this.generateButton = page.locator(".js-spf-generator-submit-form-btn");
    this.spfLookupTreeTitle = page.locator(".float-left");
    this.invalidLocator = page.locator(".text-status-error", {
      hasText: "Invalid",
    });
    this.errorContainer = page.locator(".error-container");
    this.lookupTreeBody = page.locator(".js-spf-tree").first();
    this.domainName = page.locator(".domain-name");
    this.spfRecord = page.locator(".shadow-none").first();
    this.getIpList = page.locator(".js-spf-toggle");
    this.warningContainer = page.locator(".warning-container");
    this.toggleSwitcher = page.locator(".eas-toggle-switcher__slider");
    this.deleteOptionBtn = page.locator(".js-delete-option-btn");
  }
  async expectSummaryValues(values: (string | RegExp)[]) {
    for (const value of values) {
      const locator = this.successSummaryValues
        .filter({
          hasText: value.toString(),
        })
        .last();
      await expect(locator).toBeVisible();
    }
  }
  async expectRecordContent(locator: Locator, values: string[]) {
    for (const value of values) {
      await expect(locator).toContainText(value);
    }
  }

  async selectDropdownItem(text: string) {
    await expect(this.page.locator(".eas-tools__form-container")).toBeVisible();
    const dropdown = this.failurePolicyDropdown.last();
    await expect(dropdown).toBeVisible();
    for (let i = 0; i < 3; i++) {
      const currentText = (await dropdown.textContent())?.trim() || "";

      if (currentText.includes(text)) {
        break;
      }
      await dropdown.click();
      await this.page.locator(".eas-select__item", { hasText: text }).click();
    }
  }

  getLocatorByDataName(name: string) {
    return this.page.locator(`[data-name="${name}"]`);
  }
  async generateSpfRecord(domain: string, method: string, value: string) {
    await this.getDomainField.click();
    await this.getDomainField.fill(domain);
    await this.getLocatorByDataName(method).fill(value);
    await expect(this.generateButton).toBeEnabled();
    await this.generateButton.click();
  }

  async verifyLookupTree(domain: string, record: string) {
    await expect(this.lookupTreeBody).toBeVisible();
    await expect(this.spfLookupTreeTitle).toContainText(
      this.NAMES.spfLookupTree,
    );
    await expect(this.domainName.filter({ hasText: domain })).toBeVisible();
    await expect(this.spfRecord).toContainText(record);
  }

  async selectOptionByName(optionName: string) {
    await this.page
      .locator(`[data-option-name="${optionName}"]`)
      .first()
      .click();
  }

  async deleteAndSelectOption(optionName: string) {
    const deleteBtn = this.page.locator(".js-delete-option-btn");
    if ((await deleteBtn.count()) > 0) {
      await deleteBtn.first().click();
    }
    const showMore = this.page.locator(".show-more-text");
    if ((await showMore.count()) > 0) {
      await showMore.first().click();
    }
    await this.selectOptionByName(optionName);
  }

  NAMES = {
    spfLookupTree: "SPF Lookup Tree",
    aRecord: "A record",
    mxRecord: "MX record",
    redirect: "Redirect",
    include: "Include",
    exists: "Exists",
  };
  failurePolicies = {
    NONE: "None",
    FAIL: "Fail",
    SOFTFAIL: "SoftFail",
    NEUTRAL: "Neutral",
  };
}
