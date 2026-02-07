import { test, expect } from "@playwright/test";
import { BasePage } from "../playwright_pages/Base.page";
import { DATA } from "../playwright_utils/data";
import { SpfRecordGeneratorPage } from "../playwright_pages/SpfRecordGenerator.page";

const inValidSpfIncludeValue = "invalid.include.com";
const summaryValues = ["Valid", "1/10", "1"];
const spfRecordString = (
  type: string,
  value: string,
  failPolicy: string = "~all",
) => `v=spf1 ${type}:${value} ${failPolicy}`;

test.describe("SPF Record Generator", () => {
  let basePage: BasePage;
  let spfRecordGeneratorPage: SpfRecordGeneratorPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    spfRecordGeneratorPage = new SpfRecordGeneratorPage(page);
    await spfRecordGeneratorPage.navigateToSection(
      basePage.getSpfToolName.spfToolName,
      DATA.endpoints.spfRecordGenerator,
    );
  });
  test("Verify SPF Record Generator Lookup Tree with valid Include mechanisms", async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.SOFTFAIL,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.include,
      DATA.validSpfIncludes.google,
    );
    await spfRecordGeneratorPage.expectSummaryValues(summaryValues);
    await spfRecordGeneratorPage.expectRecordContent(
      spfRecordGeneratorPage.recordContentBlock,
      [
        DATA.domains.valid,
        "TXT",
        spfRecordString(DATA.spfOptions.include, DATA.validSpfIncludes.google),
      ],
    );
    await spfRecordGeneratorPage.verifyLookupTree(
      DATA.domains.valid,
      spfRecordString(DATA.spfOptions.include, DATA.validSpfIncludes.google),
    );
    const ipListCount = await spfRecordGeneratorPage.getIpList.count();
    expect(ipListCount).toBeGreaterThan(0);
  });
  test('Verify warning message for SPF failure policy "None" with valid "include" mechanism', async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.NONE,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.include,
      DATA.validSpfIncludes.google,
    );
    await expect(spfRecordGeneratorPage.invalidLocator).toBeVisible();
    await expect(spfRecordGeneratorPage.errorContainer).toContainText(
      DATA.messages.spfNoneWarning,
    );
    await spfRecordGeneratorPage.verifyLookupTree(
      DATA.domains.valid,
      spfRecordString(
        DATA.spfOptions.include,
        DATA.validSpfIncludes.google,
        "",
      ),
    );
    const ipListCount = await spfRecordGeneratorPage.getIpList.count();
    expect(ipListCount).toBeGreaterThan(0);
  });
  test("Verify SPF Record Generation with invalid include value", async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.SOFTFAIL,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.include,
      inValidSpfIncludeValue,
    );
    await expect(spfRecordGeneratorPage.invalidLocator).toBeVisible();
    await expect(spfRecordGeneratorPage.errorContainer).toContainText(
      DATA.messages.invalidSpfIncludes(inValidSpfIncludeValue),
    );
  });
  // BUG ID: 102 – domain format validation issue
  test.skip("Verify SPF Record Generation with invalid domain format", async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.SOFTFAIL,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.invalid,
      DATA.spfOptions.include,
      DATA.validSpfIncludes.google,
    );
    // need to continue this case after bug fix
  });
  test('Verify SPF Record Generator Lookup Tree with valid "A record" mechanisms', async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.SOFTFAIL,
    );
    await spfRecordGeneratorPage.deleteAndSelectOption(
      spfRecordGeneratorPage.NAMES.aRecord,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.aRecord,
      DATA.validAandMXvalues.easydmarc,
    );
    await spfRecordGeneratorPage.expectSummaryValues(summaryValues);
    await spfRecordGeneratorPage.expectRecordContent(
      spfRecordGeneratorPage.recordContentBlock,
      [
        DATA.domains.valid,
        "TXT",
        spfRecordString(
          DATA.spfOptions.aRecord,
          DATA.validAandMXvalues.easydmarc,
        ),
      ],
    );
    await spfRecordGeneratorPage.verifyLookupTree(
      DATA.domains.valid,
      spfRecordString(
        DATA.spfOptions.aRecord,
        DATA.validAandMXvalues.easydmarc,
      ),
    );
    const ipListCount = await spfRecordGeneratorPage.getIpList.count();
    expect(ipListCount).toBeGreaterThan(0);
  });
  test('Verify warning message for SPF failure policy "None" with valid "A record" mechanism', async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.NONE,
    );
    await spfRecordGeneratorPage.deleteAndSelectOption(
      spfRecordGeneratorPage.NAMES.aRecord,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.aRecord,
      DATA.validAandMXvalues.easydmarc,
    );
    await expect(spfRecordGeneratorPage.invalidLocator).toBeVisible();
    await expect(spfRecordGeneratorPage.errorContainer).toContainText(
      DATA.messages.spfNoneWarning,
    );
    await spfRecordGeneratorPage.verifyLookupTree(
      DATA.domains.valid,
      spfRecordString(
        DATA.spfOptions.aRecord,
        DATA.validAandMXvalues.easydmarc,
        "",
      ),
    );
    const ipListCount = await spfRecordGeneratorPage.getIpList.count();
    expect(ipListCount).toBeGreaterThan(0);
  });
  test('Verify SPF Record Generator with valid "MX record" mechanisms', async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.SOFTFAIL,
    );
    await spfRecordGeneratorPage.deleteAndSelectOption(
      spfRecordGeneratorPage.NAMES.mxRecord,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.mxRecord,
      DATA.validAandMXvalues.google,
    );
    await spfRecordGeneratorPage.expectSummaryValues(summaryValues);
    await spfRecordGeneratorPage.expectRecordContent(
      spfRecordGeneratorPage.recordContentBlock,
      [
        DATA.domains.valid,
        "TXT",
        spfRecordString(
          DATA.spfOptions.mxRecord,
          DATA.validAandMXvalues.google,
        ),
      ],
    );
    await spfRecordGeneratorPage.verifyLookupTree(
      DATA.domains.valid,
      spfRecordString(DATA.spfOptions.mxRecord, DATA.validAandMXvalues.google),
    );
    const ipListCount = await spfRecordGeneratorPage.getIpList.count();
    expect(ipListCount).toBeGreaterThan(0);
  });
  test('Verify warning message for SPF failure policy "Neutral" with valid "MX record" mechanism', async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.NEUTRAL,
    );
    await spfRecordGeneratorPage.deleteAndSelectOption(
      spfRecordGeneratorPage.NAMES.mxRecord,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.mxRecord,
      DATA.validAandMXvalues.google,
    );
    await spfRecordGeneratorPage.expectSummaryValues(summaryValues);
    await expect(spfRecordGeneratorPage.warningContainer).toContainText(
      DATA.messages.spfNeutralWarning,
    );
    await spfRecordGeneratorPage.verifyLookupTree(
      DATA.domains.valid,
      spfRecordString(
        DATA.spfOptions.mxRecord,
        DATA.validAandMXvalues.google,
        "?all",
      ),
    );
    const ipListCount = await spfRecordGeneratorPage.getIpList.count();
    expect(ipListCount).toBeGreaterThan(0);
  });
  test('Verify SPF Record Generator Lookup Tree with valid "Exists" mechanisms', async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.SOFTFAIL,
    );
    await spfRecordGeneratorPage.deleteAndSelectOption(
      spfRecordGeneratorPage.NAMES.exists,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.exists,
      DATA.validExistsValues.salesforce,
    );
    await spfRecordGeneratorPage.expectSummaryValues(summaryValues);
    await spfRecordGeneratorPage.expectRecordContent(
      spfRecordGeneratorPage.recordContentBlock,
      [
        DATA.domains.valid,
        "TXT",
        spfRecordString(
          DATA.spfOptions.exists,
          DATA.validExistsValues.salesforce,
        ),
      ],
    );
    await spfRecordGeneratorPage.verifyLookupTree(
      DATA.domains.valid,
      spfRecordString(
        DATA.spfOptions.exists,
        DATA.validExistsValues.salesforce,
      ),
    );
    const ipListCount = await spfRecordGeneratorPage.getIpList.count();
    expect(ipListCount).toBeGreaterThan(0);
  });
  test('Verify warning message for SPF failure policy "Neutral" with valid "Exists" mechanism', async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.NEUTRAL,
    );
    await spfRecordGeneratorPage.deleteAndSelectOption(
      spfRecordGeneratorPage.NAMES.exists,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.exists,
      DATA.validExistsValues.salesforce,
    );
    await spfRecordGeneratorPage.expectSummaryValues(summaryValues);
    await expect(spfRecordGeneratorPage.warningContainer).toContainText(
      DATA.messages.spfNeutralWarning,
    );
    await spfRecordGeneratorPage.verifyLookupTree(
      DATA.domains.valid,
      spfRecordString(
        DATA.spfOptions.exists,
        DATA.validExistsValues.salesforce,
        "?all",
      ),
    );
    const ipListCount = await spfRecordGeneratorPage.getIpList.count();
    expect(ipListCount).toBeGreaterThan(0);
  });
  test('Verify SPF Record Generation with invalid "Exists" value', async () => {
    await spfRecordGeneratorPage.selectDropdownItem(
      spfRecordGeneratorPage.failurePolicies.NEUTRAL,
    );
    await spfRecordGeneratorPage.deleteAndSelectOption(
      spfRecordGeneratorPage.NAMES.exists,
    );
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.exists,
      inValidSpfIncludeValue,
    );
    await expect(spfRecordGeneratorPage.invalidLocator).toBeVisible();
    await expect(spfRecordGeneratorPage.errorContainer).toContainText(
      DATA.messages.invalidSpfIncludes(inValidSpfIncludeValue),
    );
  });
  test('Verify SPF Record Generator  with valid "Redirect" mechanisms', async ({
    page,
  }) => {
    await spfRecordGeneratorPage.deleteOptionBtn.click();
    await spfRecordGeneratorPage.toggleSwitcher.click();
    await spfRecordGeneratorPage.generateSpfRecord(
      DATA.domains.valid,
      DATA.spfOptions.redirect,
      DATA.validSpfIncludes.google,
    );
    await expect(
      spfRecordGeneratorPage.failurePolicyDropdown.last(),
    ).toBeDisabled();
    await spfRecordGeneratorPage.expectSummaryValues(summaryValues);
    await spfRecordGeneratorPage.expectRecordContent(
      spfRecordGeneratorPage.recordContentBlock,
      [
        DATA.domains.valid,
        "TXT",
        `v=spf1 ${DATA.spfOptions.redirect}=${DATA.validSpfIncludes.google}`,
      ],
    );
    await spfRecordGeneratorPage.verifyLookupTree(
      DATA.domains.valid,
      `v=spf1 ${DATA.spfOptions.redirect}=${DATA.validSpfIncludes.google}`,
    );
    const ipListCount = await spfRecordGeneratorPage.getIpList.count();
    expect(ipListCount).toBeGreaterThan(0);
  });
});
