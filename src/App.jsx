import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Breadcrumbs from './components/Breadcrumbs';
import LegalDisclaimer from './components/LegalDisclaimer';
import ScoreDashboard from './components/ScoreDashboard';
import WebsiteProfile from './components/WebsiteProfile';
import ChecklistSection from './components/ChecklistSection';
import ActionPlan from './components/ActionPlan';
import Footer from './components/Footer';
import {
  getRequirements,
  getApplicablePages,
  calculateScore,
  generateActionPlan,
  TEST_DATA,
} from './data/legalPages';

const STORAGE_KEY = 'legal-audit-draft';

function loadDraft() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // silently ignore
  }
}

const defaultProfile = {
  websiteUrl: '',
  websiteType: '',
  collectsData: null,
  usesCookies: null,
  acceptsPayments: null,
  hasAccounts: null,
  hasUGC: null,
  hasAffiliates: null,
  regions: [],
};

function App() {
  const draft = useMemo(() => loadDraft(), []);

  const [profile, setProfile] = useState(draft?.profile || { ...defaultProfile });
  const [pageStatuses, setPageStatuses] = useState(draft?.pageStatuses || {});
  const [subCheckStatuses, setSubCheckStatuses] = useState(draft?.subCheckStatuses || {});
  const [qualityStatuses, setQualityStatuses] = useState(draft?.qualityStatuses || {});
  const [showChecklist, setShowChecklist] = useState(draft?.showChecklist || false);
  const [copyMessage, setCopyMessage] = useState('');
  const actionPlanRef = useRef(null);

  // Auto-save on changes
  useEffect(() => {
    saveDraft({ profile, pageStatuses, subCheckStatuses, qualityStatuses, showChecklist });
  }, [profile, pageStatuses, subCheckStatuses, qualityStatuses, showChecklist]);

  const profileComplete = useMemo(() => {
    return (
      profile.websiteType &&
      profile.collectsData !== null &&
      profile.usesCookies !== null &&
      profile.acceptsPayments !== null &&
      profile.hasAccounts !== null &&
      profile.hasUGC !== null &&
      profile.hasAffiliates !== null &&
      profile.regions.length > 0
    );
  }, [profile]);

  const requirements = useMemo(() => {
    if (!profileComplete) return {};
    return getRequirements(profile);
  }, [profile, profileComplete]);

  const applicablePages = useMemo(() => {
    if (!profileComplete) return [];
    return getApplicablePages(profile);
  }, [profile, profileComplete]);

  const scoreData = useMemo(() => {
    if (!profileComplete || !showChecklist) return null;
    return calculateScore(pageStatuses, subCheckStatuses, qualityStatuses, requirements, applicablePages);
  }, [pageStatuses, subCheckStatuses, qualityStatuses, requirements, applicablePages, profileComplete, showChecklist]);

  const actions = useMemo(() => {
    if (!profileComplete || !showChecklist) return [];
    return generateActionPlan(pageStatuses, subCheckStatuses, qualityStatuses, requirements, applicablePages);
  }, [pageStatuses, subCheckStatuses, qualityStatuses, requirements, applicablePages, profileComplete, showChecklist]);

  const hasAnyStatus = useMemo(() => {
    return Object.keys(pageStatuses).length > 0;
  }, [pageStatuses]);

  const handleProfileChange = useCallback((newProfile) => {
    setProfile(newProfile);
  }, []);

  const handleStatusChange = useCallback((pageId, status) => {
    setPageStatuses((prev) => ({ ...prev, [pageId]: status }));
    // Clear sub-checks and quality checks if changed to missing or N/A
    if (status === 'missing' || status === 'na') {
      setSubCheckStatuses((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (key.startsWith(pageId.split('-')[0])) {
            // More precise: match by page's sub-check IDs
          }
        });
        return next;
      });
    }
  }, []);

  const handleSubCheckChange = useCallback((checkId, checked) => {
    setSubCheckStatuses((prev) => ({ ...prev, [checkId]: checked }));
  }, []);

  const handleQualityChange = useCallback((key, checked) => {
    setQualityStatuses((prev) => ({ ...prev, [key]: checked }));
  }, []);

  const startChecklist = useCallback(() => {
    setShowChecklist(true);
  }, []);

  const fillTestData = useCallback(() => {
    setProfile(TEST_DATA.profile);
    setPageStatuses(TEST_DATA.pageStatuses);
    setSubCheckStatuses(TEST_DATA.subCheckStatuses);
    setQualityStatuses(TEST_DATA.qualityStatuses);
    setShowChecklist(true);
  }, []);

  const resetAudit = useCallback(() => {
    setProfile({ ...defaultProfile });
    setPageStatuses({});
    setSubCheckStatuses({});
    setQualityStatuses({});
    setShowChecklist(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const generateReportText = useCallback(() => {
    const lines = [];
    lines.push('WEBSITE LEGAL PAGE AUDIT REPORT');
    lines.push('='.repeat(40));
    lines.push('');
    lines.push(`Website: ${profile.websiteUrl || 'Not specified'}`);
    lines.push(`Website Type: ${profile.websiteType || 'Not specified'}`);
    lines.push(`Regions: ${profile.regions.join(', ') || 'Not specified'}`);
    lines.push(`Date: ${new Date().toLocaleDateString()}`);
    lines.push('');

    if (scoreData) {
      lines.push('SCORE SUMMARY');
      lines.push('-'.repeat(20));
      lines.push(`Overall Coverage: ${scoreData.score}%`);
      lines.push(`Risk Level: ${scoreData.riskLevel.toUpperCase()}`);
      lines.push(`Pages Present: ${scoreData.presentCount}`);
      lines.push(`Pages Missing: ${scoreData.missingCount}`);
      lines.push(`Pages Outdated: ${scoreData.outdatedCount}`);
      lines.push('');
    }

    if (actions.length > 0) {
      lines.push('ACTION PLAN');
      lines.push('-'.repeat(20));
      actions.forEach((action, i) => {
        lines.push(`${i + 1}. [${action.priority.toUpperCase()}] ${action.description}`);
        lines.push(`   Reason: ${action.reason}`);
        lines.push(`   Effort: ${action.effort}`);
        if (action.toolLink) {
          lines.push(`   Tool: ${action.toolLink.label} — ${action.toolLink.url}`);
        }
        lines.push('');
      });
    }

    lines.push('');
    lines.push('---');
    lines.push('Generated by DreamHost Website Legal Page Audit');
    lines.push('https://seo-tools-tau.vercel.app/legal-compliance/');
    lines.push('');
    lines.push('DISCLAIMER: This report provides general guidance and is not legal advice.');
    lines.push('Consult a qualified attorney for advice specific to your situation.');

    return lines.join('\n');
  }, [profile, scoreData, actions]);

  const handleCopy = useCallback(() => {
    const text = generateReportText();
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage('Copied!');
      setTimeout(() => setCopyMessage(''), 2000);
    }).catch(() => {
      setCopyMessage('Copy failed');
      setTimeout(() => setCopyMessage(''), 2000);
    });
  }, [generateReportText]);

  const handleExport = useCallback(() => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-audit-${profile.websiteUrl ? new URL(profile.websiteUrl).hostname : 'report'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateReportText, profile.websiteUrl]);

  // Group applicable pages by category
  const corePages = applicablePages.filter((p) => p.category === 'core');
  const conditionalPages = applicablePages.filter((p) => p.category === 'conditional');

  return (
    <div className="min-h-screen bg-abyss bg-glow bg-grid" id="main">
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <Breadcrumbs />

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Website Legal Page Audit
              </h1>
              <p className="text-cloudy text-base max-w-2xl">
                Check which legal pages your website needs, assess your current coverage, and get a prioritized action plan to close compliance gaps.
              </p>
            </div>
            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={fillTestData}
                className="px-3 py-1.5 text-xs font-mono bg-prince/20 text-prince border border-prince/30 rounded hover:bg-prince/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-prince focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
              >
                Fill Test Data
              </button>
              {(showChecklist || profileComplete) && (
                <button
                  type="button"
                  onClick={resetAudit}
                  className="px-3 py-1.5 text-xs font-mono bg-coral/10 text-coral border border-coral/30 rounded hover:bg-coral/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </header>

        <LegalDisclaimer />

        {/* Score Dashboard (sticky on desktop) */}
        {showChecklist && scoreData && (
          <div className="lg:sticky lg:top-4 lg:z-20 mb-6">
            <ScoreDashboard scoreData={scoreData} hasStarted={hasAnyStatus} />
          </div>
        )}

        {/* Copy confirmation */}
        {copyMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-turtle/20 border border-turtle/40 text-turtle text-sm rounded-lg animate-fadeIn" role="status">
            {copyMessage}
          </div>
        )}

        {/* Step 1: Website Profile */}
        <WebsiteProfile profile={profile} onChange={handleProfileChange} />

        {/* Start Audit Button */}
        {profileComplete && !showChecklist && (
          <div className="flex justify-center mb-8 animate-fadeIn">
            <button
              type="button"
              onClick={startChecklist}
              className="px-8 py-3 bg-azure text-white font-semibold rounded-lg hover:bg-azure-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
            >
              Start Legal Page Audit
            </button>
          </div>
        )}

        {!profileComplete && !showChecklist && (
          <div className="text-center py-6 mb-8">
            <p className="text-galactic text-sm">
              Complete all fields in the website profile above to begin your audit.
            </p>
          </div>
        )}

        {/* Checklist Sections */}
        {showChecklist && (
          <div aria-live="polite" role="region" aria-label="Audit checklist">
            {/* Core Pages */}
            {corePages.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-white mb-1">Core Legal Pages</h2>
                <p className="text-sm text-galactic mb-4">These pages are required or strongly recommended for virtually all websites.</p>
                <div className="space-y-4">
                  {corePages.map((page) => (
                    <ChecklistSection
                      key={page.id}
                      page={page}
                      requirement={requirements[page.id]}
                      pageStatus={pageStatuses[page.id] || ''}
                      subCheckStatuses={subCheckStatuses}
                      qualityStatuses={qualityStatuses}
                      onStatusChange={handleStatusChange}
                      onSubCheckChange={handleSubCheckChange}
                      onQualityChange={handleQualityChange}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Conditional Pages */}
            {conditionalPages.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-white mb-1">Additional Legal Pages</h2>
                <p className="text-sm text-galactic mb-4">Based on your website profile, these additional pages may be required or recommended.</p>
                <div className="space-y-4">
                  {conditionalPages.map((page) => (
                    <ChecklistSection
                      key={page.id}
                      page={page}
                      requirement={requirements[page.id]}
                      pageStatus={pageStatuses[page.id] || ''}
                      subCheckStatuses={subCheckStatuses}
                      qualityStatuses={qualityStatuses}
                      onStatusChange={handleStatusChange}
                      onSubCheckChange={handleSubCheckChange}
                      onQualityChange={handleQualityChange}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Action Plan */}
            {hasAnyStatus && (
              <div ref={actionPlanRef}>
                <ActionPlan
                  actions={actions}
                  onCopy={handleCopy}
                  onExport={handleExport}
                />
              </div>
            )}
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

export default App;
