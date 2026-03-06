import { useState, useMemo } from 'react';

function PriorityBadge({ priority }) {
  const config = {
    critical: { bg: 'bg-coral/15', border: 'border-coral/30', text: 'text-coral', label: 'Critical' },
    high: { bg: 'bg-tangerine/15', border: 'border-tangerine/30', text: 'text-tangerine', label: 'High' },
    medium: { bg: 'bg-azure/15', border: 'border-azure/30', text: 'text-azure', label: 'Medium' },
    low: { bg: 'bg-galactic/10', border: 'border-galactic/30', text: 'text-galactic', label: 'Low' },
  };
  const c = config[priority] || config.medium;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${c.bg} ${c.border} ${c.text}`}>
      {c.label}
    </span>
  );
}

function EffortBadge({ effort }) {
  const config = {
    quick: { icon: '1', label: 'Quick fix — use our generator tool', color: 'text-turtle' },
    moderate: { icon: '2', label: 'Moderate — customize a template', color: 'text-tangerine' },
    significant: { icon: '3', label: 'Significant — consult an attorney', color: 'text-coral' },
  };
  const c = config[effort] || config.moderate;

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${c.color}`}>
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      {c.label}
    </span>
  );
}

function ActionTypeIcon({ type }) {
  if (type === 'missing-page') {
    return (
      <div className="w-8 h-8 rounded-lg bg-coral/15 flex items-center justify-center shrink-0">
        <svg aria-hidden="true" className="w-4 h-4 text-coral" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    );
  }
  if (type === 'outdated-page') {
    return (
      <div className="w-8 h-8 rounded-lg bg-tangerine/15 flex items-center justify-center shrink-0">
        <svg aria-hidden="true" className="w-4 h-4 text-tangerine" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </svg>
      </div>
    );
  }
  if (type === 'missing-check') {
    return (
      <div className="w-8 h-8 rounded-lg bg-azure/15 flex items-center justify-center shrink-0">
        <svg aria-hidden="true" className="w-4 h-4 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-galactic/10 flex items-center justify-center shrink-0">
      <svg aria-hidden="true" className="w-4 h-4 text-galactic" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    </div>
  );
}

export default function ActionPlan({ actions, onCopy, onExport }) {
  const [filter, setFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredActions = useMemo(() => {
    if (filter === 'all') return actions;
    return actions.filter((a) => a.priority === filter);
  }, [actions, filter]);

  const groupedByPriority = useMemo(() => {
    const groups = { critical: [], high: [], medium: [], low: [] };
    filteredActions.forEach((action) => {
      if (groups[action.priority]) {
        groups[action.priority].push(action);
      }
    });
    return groups;
  }, [filteredActions]);

  if (actions.length === 0) {
    return (
      <section className="card-gradient rounded-2xl border border-turtle/30 p-6 mt-6 animate-fadeIn">
        <div className="flex items-center gap-3">
          <svg aria-hidden="true" className="w-6 h-6 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <div>
            <h2 className="text-lg font-bold text-white">Excellent Legal Coverage</h2>
            <p className="text-sm text-galactic">No action items found. Your legal pages appear to be comprehensive and up to date.</p>
          </div>
        </div>
      </section>
    );
  }

  const counts = {
    all: actions.length,
    critical: actions.filter((a) => a.priority === 'critical').length,
    high: actions.filter((a) => a.priority === 'high').length,
    medium: actions.filter((a) => a.priority === 'medium').length,
    low: actions.filter((a) => a.priority === 'low').length,
  };

  return (
    <section className="mt-6 animate-fadeIn" aria-label="Action plan">
      <div className="card-gradient rounded-2xl border border-metal/20 overflow-hidden overflow-x-hidden">
        {/* Header */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-oblivion rounded"
          >
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
            <h2 className="text-xl font-bold text-white">Action Plan</h2>
            <span className="text-sm text-galactic">({actions.length} items)</span>
          </button>
          <div className="flex items-center gap-2 no-print">
            <button
              type="button"
              onClick={onCopy}
              className="px-3 py-1.5 text-xs font-medium text-azure border border-azure/30 rounded-lg hover:bg-azure/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
            >
              Copy Plan
            </button>
            <button
              type="button"
              onClick={onExport}
              className="px-3 py-1.5 text-xs font-medium text-azure border border-azure/30 rounded-lg hover:bg-azure/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
            >
              Export Report
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-medium text-azure border border-azure/30 rounded-lg hover:bg-azure/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss"
            >
              Print
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="px-5 pb-5">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-5 no-print" role="tablist" aria-label="Filter by priority">
              {['all', 'critical', 'high', 'medium', 'low'].map((level) => (
                <button
                  key={level}
                  type="button"
                  role="tab"
                  aria-selected={filter === level}
                  onClick={() => setFilter(level)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss ${
                    filter === level
                      ? 'bg-azure/15 border-azure/40 text-azure'
                      : 'border-metal/20 text-galactic hover:border-metal/40 hover:text-cloudy'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                  {counts[level] > 0 && <span className="ml-1.5 text-[10px]">({counts[level]})</span>}
                </button>
              ))}
            </div>

            {/* Action items grouped by priority */}
            <div className="space-y-6" role="list" aria-label="Action items">
              {Object.entries(groupedByPriority).map(([priority, items]) => {
                if (items.length === 0) return null;
                const priorityLabels = { critical: 'Critical Priority', high: 'High Priority', medium: 'Medium Priority', low: 'Low Priority' };
                return (
                  <div key={priority}>
                    <h3 className="text-sm font-semibold text-galactic uppercase tracking-wider mb-3">{priorityLabels[priority]}</h3>
                    <div className="space-y-3" role="list">
                      {items.map((action, idx) => (
                        <div
                          key={`${action.pageId}-${action.type}-${idx}`}
                          className="flex items-start gap-3 p-4 bg-abyss/50 rounded-xl border border-metal/10"
                          role="listitem"
                        >
                          <ActionTypeIcon type={action.type} />
                          <div className="flex-1 min-w-0 break-words">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-sm font-medium text-white">{action.description}</span>
                              <PriorityBadge priority={action.priority} />
                            </div>
                            <p className="text-xs text-galactic mb-2">{action.reason}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                              <EffortBadge effort={action.effort} />
                              {action.toolLink && (
                                <a
                                  href={action.toolLink.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-azure hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss rounded"
                                >
                                  <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                  </svg>
                                  {action.toolLink.label}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
