import { useState } from 'react';
import { PAGE_STATUSES, QUALITY_CHECKS } from '../data/legalPages';

function StatusSelector({ pageId, currentStatus, onStatusChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Status for ${pageId}`}>
      {PAGE_STATUSES.map((status) => {
        const isSelected = currentStatus === status.id;
        const colorMap = {
          turtle: isSelected ? 'bg-turtle/15 border-turtle/40 text-turtle' : '',
          tangerine: isSelected ? 'bg-tangerine/15 border-tangerine/40 text-tangerine' : '',
          coral: isSelected ? 'bg-coral/15 border-coral/40 text-coral' : '',
          galactic: isSelected ? 'bg-galactic/15 border-galactic/40 text-galactic' : '',
        };

        return (
          <button
            key={status.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onStatusChange(pageId, status.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss ${
              isSelected
                ? colorMap[status.color]
                : 'bg-transparent border-metal/20 text-galactic hover:border-metal/40 hover:text-cloudy'
            }`}
          >
            {status.label}
          </button>
        );
      })}
    </div>
  );
}

function SubCheck({ check, checked, onChange }) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="flex items-start gap-3 py-1.5">
      <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(check.id, e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 rounded border-metal/30 bg-abyss text-azure focus:ring-azure focus:ring-offset-abyss accent-azure"
        />
        <span className="text-sm text-cloudy">{check.label}</span>
      </label>
      <button
        type="button"
        onClick={() => setShowTip(!showTip)}
        aria-label={`More info about: ${check.label}`}
        aria-expanded={showTip}
        className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-galactic hover:text-azure transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
      >
        <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </button>
      {showTip && (
        <div className="absolute right-0 top-8 z-10 w-64 p-3 text-xs text-cloudy bg-midnight border border-metal/30 rounded-lg shadow-lg">
          {check.tip}
        </div>
      )}
    </div>
  );
}

function QualityChecks({ pageId, qualityStatuses, onQualityChange }) {
  return (
    <div className="mt-4 pt-4 border-t border-metal/15">
      <p className="text-xs font-semibold text-galactic uppercase tracking-wider mb-2">Quality Checks</p>
      <div className="space-y-0.5">
        {QUALITY_CHECKS.map((check) => {
          const key = `${pageId}-${check.id}`;
          return (
            <label key={key} className="flex items-start gap-3 py-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={qualityStatuses[key] || false}
                onChange={(e) => onQualityChange(key, e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0 rounded border-metal/30 bg-abyss text-azure focus:ring-azure focus:ring-offset-abyss accent-azure"
              />
              <span className="text-sm text-cloudy">{check.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function RequirementBadge({ requirement }) {
  const config = {
    required: { bg: 'bg-coral/10', border: 'border-coral/30', text: 'text-coral', label: 'Required' },
    recommended: { bg: 'bg-tangerine/10', border: 'border-tangerine/30', text: 'text-tangerine', label: 'Recommended' },
    optional: { bg: 'bg-galactic/10', border: 'border-galactic/30', text: 'text-galactic', label: 'Optional' },
  };
  const c = config[requirement] || config.optional;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${c.bg} ${c.border} ${c.text}`}>
      {c.label}
    </span>
  );
}

export default function ChecklistSection({
  page,
  requirement,
  pageStatus,
  subCheckStatuses,
  qualityStatuses,
  onStatusChange,
  onSubCheckChange,
  onQualityChange,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasContent = pageStatus === 'current' || pageStatus === 'outdated';

  return (
    <div className="card-gradient rounded-2xl border border-metal/20 overflow-hidden animate-fadeIn">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/[0.02] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-oblivion"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            pageStatus === 'current' ? 'bg-turtle' :
            pageStatus === 'outdated' ? 'bg-tangerine' :
            pageStatus === 'missing' ? 'bg-coral' :
            pageStatus === 'na' ? 'bg-galactic/50' :
            'bg-metal/30'
          }`} />
          <h3 className="text-white font-semibold truncate">{page.name}</h3>
          <RequirementBadge requirement={requirement} />
        </div>
        <svg
          aria-hidden="true"
          className={`w-5 h-5 text-galactic shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-metal/10 break-words">
          <p className="text-sm text-galactic mt-4 mb-2">{page.description}</p>

          {page.regulations && page.regulations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {page.regulations.map((reg) => (
                <span key={reg} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-prince/10 border border-prince/20 text-prince">
                  {reg}
                </span>
              ))}
            </div>
          )}

          {/* Status selection */}
          <div className="mb-4">
            <p className="text-xs font-medium text-galactic mb-2">What is the status of this page?</p>
            <StatusSelector pageId={page.id} currentStatus={pageStatus} onStatusChange={onStatusChange} />
          </div>

          {/* Sub-checks (only if page exists) */}
          {hasContent && (
            <div className="space-y-0">
              <p className="text-xs font-semibold text-galactic uppercase tracking-wider mb-2 mt-4">Content Checks</p>
              {page.subChecks.map((check) => (
                <div key={check.id} className="relative">
                  <SubCheck
                    check={check}
                    checked={subCheckStatuses[check.id] || false}
                    onChange={onSubCheckChange}
                  />
                </div>
              ))}

              {/* Quality checks */}
              <QualityChecks
                pageId={page.id}
                qualityStatuses={qualityStatuses}
                onQualityChange={onQualityChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
