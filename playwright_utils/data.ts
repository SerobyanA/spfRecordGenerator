export const DATA = {
  endpoints: {
    spfRecordGenerator: "tools/spf-record-generator",
  },

  spfOptions: {
    aRecord: "a",
    mxRecord: "mx",
    redirect: "redirect",
    include: "include",
    exists: "exists",
  },

  domains: {
    valid: "example.com",
    invalid: "-website.com",
  },

  validSpfIncludes: {
    google: "_spf.google.com",
    outlook: "spf.protection.outlook.com",
    zendesk: "mail.zendesk.com",
    amazonSes: "amazonses.com",
  },

  validAandMXvalues: {
    easydmarc: "easydmarc.com",
    google: "google.com",
  },

  validExistsValues: {
    salesforce: "%{i}._spf.mta.salesforce.com",
  },

  messages: {
    spfNoneWarning:
      "The 'all' tag is missing from the record which is equivalent to '?all' (neutral) or the absence of an SPF record. Ensure the mechanism is either '-all' (hard fail) or '~all' (soft fail). and update your record.",

    spfNeutralWarning:
      "To have maximum security, ensure the mechanism is either '~all' (soft fail) or '-all' (hard fail) and update your record",

    invalidSpfIncludes: (domain: string) =>
      `Invalid SPF domain: "${domain}". Make sure the domain has a valid "SPF" record.`,
  },
};
