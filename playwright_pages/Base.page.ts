import { Page, expect } from "@playwright/test";
import { ENV } from "../global.setup";

export class BasePage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getSpfToolName = {
    spfToolName: "SPF Record Generator",
  };

  async navigate() {
    await this.page.goto(`${ENV.globalUrl}`);
  }
  async navigateToSection(toolName: string, endpoint: string) {
    await this.navigate();
    await this.page.getByRole("link", { name: "Tools", exact: true }).hover();
    await this.page
      .locator("#spfMenu")
      .getByRole("link", { name: toolName })
      .click();
    await expect(this.page).toHaveURL(`${ENV.globalUrl}` + endpoint);
  }
}
