// Legal page definitions with sub-checks, conditions, and priority logic

export const WEBSITE_TYPES = [
  { id: 'blog', label: 'Blog / Content Site' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'saas', label: 'SaaS / Web App' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'service', label: 'Service Business' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'forum', label: 'Forum / Community' },
  { id: 'nonprofit', label: 'Non-profit' },
];

export const REGIONS = [
  { id: 'us', label: 'United States' },
  { id: 'eu', label: 'European Union' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'ca', label: 'Canada' },
  { id: 'au', label: 'Australia' },
  { id: 'global', label: 'Global' },
];

export const PAGE_STATUSES = [
  { id: 'current', label: 'Have it and it\'s current', icon: 'check', color: 'turtle' },
  { id: 'outdated', label: 'Have it but outdated', icon: 'warning', color: 'tangerine' },
  { id: 'missing', label: 'Don\'t have it', icon: 'x', color: 'coral' },
  { id: 'na', label: 'Not applicable', icon: 'minus', color: 'galactic' },
];

// Determine if a legal page is required, recommended, or optional based on profile
function getPageRequirement(page, profile) {
  const { websiteType, collectsData, usesCookies, acceptsPayments, hasAccounts, hasUGC, hasAffiliates, regions } = profile;
  const isEU = regions.includes('eu') || regions.includes('uk') || regions.includes('global');
  const isUS = regions.includes('us') || regions.includes('global');
  const isEcommerce = websiteType === 'ecommerce' || websiteType === 'marketplace';
  const isSaaS = websiteType === 'saas';
  const hasContent = websiteType === 'blog' || websiteType === 'forum';

  switch (page.id) {
    case 'privacy-policy':
      return collectsData || hasAccounts || usesCookies ? 'required' : 'recommended';
    case 'terms-of-service':
      return hasAccounts || isSaaS || isEcommerce ? 'required' : 'recommended';
    case 'cookie-policy':
      if (usesCookies && isEU) return 'required';
      if (usesCookies) return 'recommended';
      return 'optional';
    case 'return-refund':
      if (isEcommerce) return 'required';
      if (acceptsPayments) return 'recommended';
      return 'optional';
    case 'shipping-policy':
      if (websiteType === 'ecommerce') return 'recommended';
      return 'optional';
    case 'accessibility':
      if (isEU || regions.includes('us')) return 'recommended';
      return 'optional';
    case 'disclaimers':
      if (hasAffiliates && isUS) return 'required';
      if (hasContent) return 'recommended';
      return 'optional';
    case 'dmca':
      if (hasUGC || websiteType === 'forum' || websiteType === 'marketplace') return 'required';
      if (hasContent) return 'recommended';
      return 'optional';
    case 'coppa':
      return 'optional'; // Only if audience includes children
    case 'dpa':
      if (isSaaS) return 'required';
      if (acceptsPayments && hasAccounts) return 'recommended';
      return 'optional';
    default:
      return 'optional';
  }
}

export const LEGAL_PAGES = [
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    category: 'core',
    description: 'Discloses how your website collects, uses, shares, and protects personal data.',
    regulations: ['GDPR', 'CCPA', 'CalOPPA', 'PIPEDA', 'Australian Privacy Act'],
    missingPriority: 'critical',
    subChecks: [
      { id: 'pp-data-listed', label: 'Lists all types of data you collect', tip: 'Include name, email, IP address, cookies, analytics data, payment info, and any other personal data.' },
      { id: 'pp-third-parties', label: 'Names third-party services that receive data', tip: 'Google Analytics, payment processors, email services, ad networks, etc.' },
      { id: 'pp-contact-info', label: 'Includes contact information for privacy inquiries', tip: 'An email address or contact form specifically for privacy-related requests.' },
      { id: 'pp-updated-date', label: 'Shows a last-updated date', tip: 'Regulators and users look for this. Should be within the last 12 months.' },
      { id: 'pp-footer-link', label: 'Accessible from every page (footer link)', tip: 'Must be reachable from any page on the site, typically via footer navigation.' },
      { id: 'pp-user-rights', label: 'Describes user rights (access, delete, opt-out)', tip: 'GDPR requires right to access, rectify, erase, and port data. CCPA requires right to know, delete, and opt-out.' },
      { id: 'pp-legal-basis', label: 'States legal basis for processing (for EU)', tip: 'Consent, legitimate interest, contract fulfillment, or legal obligation.' },
    ],
  },
  {
    id: 'terms-of-service',
    name: 'Terms of Service / Terms of Use',
    category: 'core',
    description: 'Governs the rules and guidelines for using your website or service.',
    regulations: ['Contract Law', 'UCC (for e-commerce)', 'Consumer Protection Laws'],
    missingPriority: 'high',
    subChecks: [
      { id: 'tos-acceptable-use', label: 'Describes acceptable use / prohibited conduct', tip: 'What users can and cannot do on your site.' },
      { id: 'tos-liability', label: 'Includes liability limitations', tip: 'Limits your legal exposure for issues arising from use of the service.' },
      { id: 'tos-ip', label: 'Addresses intellectual property ownership', tip: 'Who owns content created on or uploaded to the platform.' },
      { id: 'tos-governing-law', label: 'Specifies governing law / jurisdiction', tip: 'Which state/country laws apply and where disputes are resolved.' },
      { id: 'tos-termination', label: 'Includes termination conditions', tip: 'Under what conditions accounts can be suspended or terminated.' },
      { id: 'tos-disputes', label: 'Describes dispute resolution process', tip: 'Arbitration, mediation, or court proceedings.' },
    ],
  },
  {
    id: 'cookie-policy',
    name: 'Cookie Policy / Cookie Banner',
    category: 'core',
    description: 'Explains what cookies your site uses and gives users control over tracking.',
    regulations: ['ePrivacy Directive', 'GDPR', 'PECR (UK)', 'CCPA'],
    missingPriority: 'critical',
    subChecks: [
      { id: 'ck-banner', label: 'Cookie consent banner is present', tip: 'Must appear before non-essential cookies are set, especially for EU visitors.' },
      { id: 'ck-categories', label: 'Lists cookie categories (essential, analytics, marketing)', tip: 'Users need to understand what each type does.' },
      { id: 'ck-opt-out', label: 'Allows opt-out of non-essential cookies', tip: 'EU law requires opt-in; US typically requires opt-out.' },
      { id: 'ck-full-policy', label: 'Links to full cookie policy from banner', tip: 'Banner should summarize, but link to the complete policy.' },
      { id: 'ck-no-prechecked', label: 'No pre-checked consent boxes', tip: 'Pre-checked boxes are a GDPR violation (Planet49 ruling).' },
      { id: 'ck-third-party', label: 'Lists third-party cookies and their purpose', tip: 'Google Analytics, Facebook Pixel, ad networks, etc.' },
    ],
  },
  {
    id: 'return-refund',
    name: 'Return & Refund Policy',
    category: 'conditional',
    description: 'States your return window, refund process, and exceptions for product purchases.',
    regulations: ['FTC (US)', 'Consumer Rights Act (UK)', 'EU Consumer Directive'],
    missingPriority: 'high',
    condition: (profile) => profile.acceptsPayments || profile.websiteType === 'ecommerce' || profile.websiteType === 'marketplace',
    subChecks: [
      { id: 'rr-window', label: 'Return window is clearly stated', tip: 'e.g., 30 days from delivery. EU requires minimum 14-day cooling-off period.' },
      { id: 'rr-method', label: 'Refund method is explained (original payment, store credit)', tip: 'How and when the customer gets their money back.' },
      { id: 'rr-exceptions', label: 'Non-returnable items are listed', tip: 'Digital products, perishables, personalized items, etc.' },
      { id: 'rr-shipping', label: 'Return shipping costs are clarified', tip: 'Who pays for return shipping? Some jurisdictions require seller to cover it.' },
      { id: 'rr-visible', label: 'Visible before checkout (linked in footer + checkout page)', tip: 'Customers must be able to find it before making a purchase.' },
    ],
  },
  {
    id: 'shipping-policy',
    name: 'Shipping Policy',
    category: 'conditional',
    description: 'Covers shipping timeframes, costs, international options, and lost package procedures.',
    regulations: ['FTC Mail Order Rule', 'Consumer Contracts Regulations (UK)'],
    missingPriority: 'medium',
    condition: (profile) => profile.websiteType === 'ecommerce',
    subChecks: [
      { id: 'sp-timeframes', label: 'Shipping timeframes are stated', tip: 'Estimated delivery times for each shipping method.' },
      { id: 'sp-international', label: 'International shipping addressed', tip: 'Whether you ship internationally and any restrictions.' },
      { id: 'sp-costs', label: 'Shipping costs are clear', tip: 'Free shipping thresholds, flat rates, or calculated at checkout.' },
      { id: 'sp-lost', label: 'Lost/damaged package process described', tip: 'What happens if a package is lost or arrives damaged.' },
    ],
  },
  {
    id: 'accessibility',
    name: 'Accessibility Statement',
    category: 'conditional',
    description: 'Declares your commitment to web accessibility and current compliance level.',
    regulations: ['ADA (US)', 'EAA (EU)', 'AODA (Canada)', 'Equality Act (UK)', 'Section 508'],
    missingPriority: 'high',
    subChecks: [
      { id: 'ax-standard', label: 'References WCAG standard and conformance level', tip: 'e.g., "We aim to conform to WCAG 2.1 Level AA."' },
      { id: 'ax-contact', label: 'Provides contact method for accessibility issues', tip: 'Email, phone, or form for reporting barriers.' },
      { id: 'ax-limitations', label: 'Discloses known accessibility limitations', tip: 'Transparency about areas that are still being improved.' },
      { id: 'ax-timeline', label: 'Includes remediation timeline or commitment', tip: 'When known issues will be fixed or next audit date.' },
    ],
  },
  {
    id: 'disclaimers',
    name: 'Disclaimers',
    category: 'conditional',
    description: 'Covers affiliate disclosures, professional advice disclaimers, and FTC compliance.',
    regulations: ['FTC Endorsement Guidelines', 'SEC (financial)', 'State Bar (legal)', 'FDA (health)'],
    missingPriority: 'high',
    condition: (profile) => profile.hasAffiliates || profile.websiteType === 'blog',
    subChecks: [
      { id: 'dc-affiliate', label: 'Affiliate disclosure present (if affiliate links)', tip: 'FTC requires clear disclosure near affiliate links. "As an Amazon Associate, I earn from qualifying purchases."' },
      { id: 'dc-professional', label: 'Professional advice disclaimer (if applicable)', tip: '"This content is for informational purposes only and does not constitute legal/medical/financial advice."' },
      { id: 'dc-testimonials', label: 'Testimonials/results disclaimer (if case studies)', tip: '"Results may vary. Past performance does not guarantee future results."' },
      { id: 'dc-ftc', label: 'FTC compliance disclosure is clear and conspicuous', tip: 'Must be near the endorsement, not buried in a separate page.' },
    ],
  },
  {
    id: 'dmca',
    name: 'DMCA / Copyright Policy',
    category: 'conditional',
    description: 'Provides a process for reporting and removing infringing content.',
    regulations: ['DMCA (US)', 'Copyright Directive (EU)', 'Copyright Act (Canada)'],
    missingPriority: 'medium',
    condition: (profile) => profile.hasUGC || profile.websiteType === 'forum' || profile.websiteType === 'marketplace',
    subChecks: [
      { id: 'dm-agent', label: 'Designated DMCA agent is listed', tip: 'Name, address, phone, and email of the person who handles takedown requests.' },
      { id: 'dm-procedure', label: 'Takedown procedure is described', tip: 'Step-by-step process for submitting a copyright complaint.' },
      { id: 'dm-counter', label: 'Counter-notice process is included', tip: 'How alleged infringers can dispute a takedown.' },
      { id: 'dm-registered', label: 'Agent registered with Copyright Office', tip: 'Required for DMCA safe harbor protection (file at copyright.gov).' },
    ],
  },
  {
    id: 'coppa',
    name: 'Children\'s Privacy / COPPA Notice',
    category: 'conditional',
    description: 'Addresses data collection from children under 13 (or 16 in EU).',
    regulations: ['COPPA (US)', 'GDPR Article 8 (EU)', 'Age Appropriate Design Code (UK)'],
    missingPriority: 'critical',
    condition: () => true, // Always show but let user mark N/A
    subChecks: [
      { id: 'cp-verification', label: 'Age verification mechanism is in place', tip: 'Age gate, date of birth check, or similar mechanism.' },
      { id: 'cp-consent', label: 'Parental consent mechanism exists', tip: 'Verifiable parental consent before collecting data from children.' },
      { id: 'cp-limits', label: 'Data collection limits for minors are documented', tip: 'Minimize data collected from children; no behavioral advertising.' },
    ],
  },
  {
    id: 'dpa',
    name: 'Data Processing Agreement',
    category: 'conditional',
    description: 'Contract for B2B data processing relationships, required under GDPR.',
    regulations: ['GDPR Article 28', 'CCPA Service Provider Agreement', 'UK GDPR'],
    missingPriority: 'high',
    condition: (profile) => profile.websiteType === 'saas' || profile.websiteType === 'marketplace',
    subChecks: [
      { id: 'dpa-available', label: 'DPA is available to customers on request', tip: 'Many B2B customers will ask for this before signing up.' },
      { id: 'dpa-subprocessors', label: 'Sub-processor list is maintained', tip: 'List of all third parties that process data on your behalf.' },
      { id: 'dpa-security', label: 'Security measures are documented', tip: 'Technical and organizational measures to protect data.' },
      { id: 'dpa-breach', label: 'Breach notification process defined', tip: 'GDPR requires notification within 72 hours of becoming aware.' },
    ],
  },
];

// Quality checks applied to all existing pages
export const QUALITY_CHECKS = [
  { id: 'q-footer-link', label: 'Linked from every page (usually footer)', tip: 'Legal pages should be accessible from every page on your site.' },
  { id: 'q-plain-language', label: 'Written in plain, understandable language', tip: 'Avoid dense legalese. Users should be able to understand your policies.' },
  { id: 'q-updated-12mo', label: 'Updated within the last 12 months', tip: 'Laws change frequently. Annual review is a minimum best practice.' },
  { id: 'q-effective-date', label: 'Includes an effective date', tip: 'Shows when the current version took effect.' },
  { id: 'q-no-paywall', label: 'Not behind a paywall or login', tip: 'Legal pages must be freely accessible to all visitors.' },
  { id: 'q-readable-size', label: 'Displayed in a readable font size', tip: 'No tiny text or low-contrast styling that discourages reading.' },
];

// Calculate requirement level for each page based on profile
export function getRequirements(profile) {
  const requirements = {};
  LEGAL_PAGES.forEach((page) => {
    requirements[page.id] = getPageRequirement(page, profile);
  });
  return requirements;
}

// Determine which pages are applicable based on profile conditions
export function getApplicablePages(profile) {
  return LEGAL_PAGES.filter((page) => {
    if (!page.condition) return true;
    return page.condition(profile);
  });
}

// Calculate overall score and risk level
export function calculateScore(pageStatuses, subCheckStatuses, qualityStatuses, requirements, applicablePages) {
  let totalPoints = 0;
  let earnedPoints = 0;
  let presentCount = 0;
  let missingCount = 0;
  let outdatedCount = 0;
  let criticalMissing = 0;
  let highMissing = 0;

  applicablePages.forEach((page) => {
    const requirement = requirements[page.id];
    if (requirement === 'optional') return; // Don't penalize for optional pages

    const status = pageStatuses[page.id];
    const weight = requirement === 'required' ? 3 : 1; // Required pages weigh more

    // Page status points
    const pagePoints = weight * 10;
    totalPoints += pagePoints;

    if (status === 'current') {
      earnedPoints += pagePoints;
      presentCount++;
    } else if (status === 'outdated') {
      earnedPoints += pagePoints * 0.5;
      outdatedCount++;
    } else if (status === 'missing') {
      missingCount++;
      if (page.missingPriority === 'critical') criticalMissing++;
      if (page.missingPriority === 'high') highMissing++;
    } else if (status === 'na') {
      // Remove from total if N/A
      totalPoints -= pagePoints;
    }

    // Sub-check points (only for pages that are current or outdated)
    if (status === 'current' || status === 'outdated') {
      page.subChecks.forEach((check) => {
        totalPoints += weight;
        if (subCheckStatuses[check.id]) {
          earnedPoints += weight;
        }
      });

      // Quality check points
      QUALITY_CHECKS.forEach((check) => {
        totalPoints += 1;
        if (qualityStatuses[`${page.id}-${check.id}`]) {
          earnedPoints += 1;
        }
      });
    }
  });

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  let riskLevel = 'low';
  if (criticalMissing > 0) riskLevel = 'critical';
  else if (highMissing > 0 || score < 50) riskLevel = 'high';
  else if (outdatedCount > 1 || score < 70) riskLevel = 'medium';

  return {
    score,
    presentCount,
    missingCount,
    outdatedCount,
    riskLevel,
    criticalMissing,
    highMissing,
  };
}

// Generate action plan items sorted by priority
export function generateActionPlan(pageStatuses, subCheckStatuses, qualityStatuses, requirements, applicablePages) {
  const actions = [];
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

  applicablePages.forEach((page) => {
    const status = pageStatuses[page.id];
    const requirement = requirements[page.id];

    if (status === 'missing' && requirement !== 'optional') {
      actions.push({
        type: 'missing-page',
        pageId: page.id,
        pageName: page.name,
        priority: page.missingPriority,
        requirement,
        description: `Create a ${page.name}`,
        reason: `Required by: ${page.regulations.join(', ')}`,
        effort: getEffort(page.id),
        toolLink: getToolLink(page.id),
      });
    }

    if (status === 'outdated') {
      actions.push({
        type: 'outdated-page',
        pageId: page.id,
        pageName: page.name,
        priority: requirement === 'required' ? 'high' : 'medium',
        requirement,
        description: `Update your ${page.name} — it may not reflect current regulations`,
        reason: 'Outdated policies may not comply with recent legal changes',
        effort: 'moderate',
        toolLink: getToolLink(page.id),
      });
    }

    // Missing sub-checks for existing pages
    if (status === 'current' || status === 'outdated') {
      page.subChecks.forEach((check) => {
        if (!subCheckStatuses[check.id]) {
          actions.push({
            type: 'missing-check',
            pageId: page.id,
            pageName: page.name,
            priority: requirement === 'required' ? 'high' : 'medium',
            requirement,
            description: `${page.name}: ${check.label}`,
            reason: check.tip,
            effort: 'quick',
            toolLink: null,
          });
        }
      });

      // Missing quality checks
      QUALITY_CHECKS.forEach((check) => {
        if (!qualityStatuses[`${page.id}-${check.id}`]) {
          actions.push({
            type: 'quality-issue',
            pageId: page.id,
            pageName: page.name,
            priority: 'low',
            requirement,
            description: `${page.name}: ${check.label}`,
            reason: check.tip,
            effort: 'quick',
            toolLink: null,
          });
        }
      });
    }
  });

  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  return actions;
}

function getEffort(pageId) {
  const effortMap = {
    'privacy-policy': 'moderate',
    'terms-of-service': 'significant',
    'cookie-policy': 'moderate',
    'return-refund': 'quick',
    'shipping-policy': 'quick',
    'accessibility': 'quick',
    'disclaimers': 'quick',
    'dmca': 'moderate',
    'coppa': 'significant',
    'dpa': 'significant',
  };
  return effortMap[pageId] || 'moderate';
}

function getToolLink(pageId) {
  const toolLinks = {
    'privacy-policy': { label: 'Privacy Policy Generator', url: 'https://seo-tools-tau.vercel.app/legal-compliance/' },
    'terms-of-service': { label: 'Terms of Service Generator', url: 'https://seo-tools-tau.vercel.app/legal-compliance/' },
    'cookie-policy': { label: 'Cookie Policy Generator', url: 'https://seo-tools-tau.vercel.app/legal-compliance/' },
    'disclaimers': { label: 'Disclaimer Generator', url: 'https://seo-tools-tau.vercel.app/legal-compliance/' },
    'return-refund': { label: 'Return & Refund Policy Generator', url: 'https://seo-tools-tau.vercel.app/legal-compliance/' },
  };
  return toolLinks[pageId] || null;
}

// Test data for "Fill Test Data" button
export const TEST_DATA = {
  profile: {
    websiteUrl: 'https://example-shop.com',
    websiteType: 'ecommerce',
    collectsData: true,
    usesCookies: true,
    acceptsPayments: true,
    hasAccounts: true,
    hasUGC: false,
    hasAffiliates: true,
    regions: ['us', 'eu'],
  },
  pageStatuses: {
    'privacy-policy': 'outdated',
    'terms-of-service': 'current',
    'cookie-policy': 'missing',
    'return-refund': 'current',
    'shipping-policy': 'missing',
    'accessibility': 'missing',
    'disclaimers': 'outdated',
    'dmca': 'na',
    'coppa': 'na',
    'dpa': 'na',
  },
  subCheckStatuses: {
    'pp-data-listed': true,
    'pp-third-parties': false,
    'pp-contact-info': true,
    'pp-updated-date': false,
    'pp-footer-link': true,
    'pp-user-rights': false,
    'pp-legal-basis': false,
    'tos-acceptable-use': true,
    'tos-liability': true,
    'tos-ip': true,
    'tos-governing-law': true,
    'tos-termination': false,
    'tos-disputes': true,
    'rr-window': true,
    'rr-method': true,
    'rr-exceptions': false,
    'rr-shipping': true,
    'rr-visible': false,
    'dc-affiliate': false,
    'dc-professional': false,
    'dc-testimonials': false,
    'dc-ftc': false,
  },
  qualityStatuses: {
    'privacy-policy-q-footer-link': true,
    'privacy-policy-q-plain-language': false,
    'privacy-policy-q-updated-12mo': false,
    'privacy-policy-q-effective-date': true,
    'privacy-policy-q-no-paywall': true,
    'privacy-policy-q-readable-size': true,
    'terms-of-service-q-footer-link': true,
    'terms-of-service-q-plain-language': true,
    'terms-of-service-q-updated-12mo': true,
    'terms-of-service-q-effective-date': true,
    'terms-of-service-q-no-paywall': true,
    'terms-of-service-q-readable-size': true,
    'return-refund-q-footer-link': true,
    'return-refund-q-plain-language': true,
    'return-refund-q-updated-12mo': true,
    'return-refund-q-effective-date': false,
    'return-refund-q-no-paywall': true,
    'return-refund-q-readable-size': true,
    'disclaimers-q-footer-link': false,
    'disclaimers-q-plain-language': false,
    'disclaimers-q-updated-12mo': false,
    'disclaimers-q-effective-date': false,
    'disclaimers-q-no-paywall': true,
    'disclaimers-q-readable-size': true,
  },
};
