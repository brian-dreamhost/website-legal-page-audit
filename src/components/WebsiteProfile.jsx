import { WEBSITE_TYPES, REGIONS } from '../data/legalPages';

export default function WebsiteProfile({ profile, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...profile, [field]: value });
  };

  const toggleRegion = (regionId) => {
    const current = profile.regions || [];
    if (regionId === 'global') {
      // If toggling global, select all or deselect all
      if (current.includes('global')) {
        handleChange('regions', []);
      } else {
        handleChange('regions', REGIONS.map((r) => r.id));
      }
      return;
    }
    const next = current.includes(regionId)
      ? current.filter((r) => r !== regionId && r !== 'global')
      : [...current.filter((r) => r !== 'global'), regionId];
    // If all non-global selected, add global
    const nonGlobal = REGIONS.filter((r) => r.id !== 'global').map((r) => r.id);
    if (nonGlobal.every((r) => next.includes(r))) {
      handleChange('regions', [...next, 'global']);
    } else {
      handleChange('regions', next);
    }
  };

  const booleanField = (field, label, tip) => (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div>
        <span className="text-white text-sm font-medium">{label}</span>
        {tip && <p className="text-galactic text-xs mt-0.5">{tip}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0" role="radiogroup" aria-label={label}>
        <button
          type="button"
          role="radio"
          aria-checked={profile[field] === true}
          onClick={() => handleChange(field, true)}
          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss ${
            profile[field] === true
              ? 'bg-turtle/20 border-turtle/40 text-turtle'
              : 'bg-transparent border-metal/30 text-galactic hover:border-metal/50 hover:text-cloudy'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={profile[field] === false}
          onClick={() => handleChange(field, false)}
          className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss ${
            profile[field] === false
              ? 'bg-coral/15 border-coral/30 text-coral'
              : 'bg-transparent border-metal/30 text-galactic hover:border-metal/50 hover:text-cloudy'
          }`}
        >
          No
        </button>
      </div>
    </div>
  );

  return (
    <section className="card-gradient rounded-2xl border border-metal/20 p-6 mb-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-white mb-1">Website Profile</h2>
      <p className="text-sm text-galactic mb-6">Tell us about your website so we can determine which legal pages you need.</p>

      <div className="space-y-5">
        {/* Website URL */}
        <div>
          <label htmlFor="website-url" className="block text-sm font-medium text-white mb-1.5">
            Website URL
          </label>
          <input
            id="website-url"
            type="url"
            value={profile.websiteUrl || ''}
            onChange={(e) => handleChange('websiteUrl', e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2.5 bg-abyss border border-metal/30 rounded-lg text-white text-sm placeholder:text-galactic focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss transition-colors"
          />
        </div>

        {/* Website Type */}
        <div>
          <label htmlFor="website-type" className="block text-sm font-medium text-white mb-1.5">
            Website Type
          </label>
          <select
            id="website-type"
            value={profile.websiteType || ''}
            onChange={(e) => handleChange('websiteType', e.target.value)}
            className="w-full px-4 py-2.5 bg-abyss border border-metal/30 rounded-lg text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss transition-colors appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237E939F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
          >
            <option value="" className="bg-oblivion">Select your website type...</option>
            {WEBSITE_TYPES.map((type) => (
              <option key={type.id} value={type.id} className="bg-oblivion">{type.label}</option>
            ))}
          </select>
        </div>

        {/* Boolean Questions */}
        <div className="space-y-0 divide-y divide-metal/15">
          {booleanField('collectsData', 'Do you collect user data?', 'Forms, analytics, newsletters, account signups, etc.')}
          {booleanField('usesCookies', 'Do you use cookies?', 'Analytics, advertising, session management, preferences.')}
          {booleanField('acceptsPayments', 'Do you accept payments?', 'Products, services, subscriptions, donations.')}
          {booleanField('hasAccounts', 'Do you have user accounts?', 'Login, registration, profiles.')}
          {booleanField('hasUGC', 'Do you accept user-generated content?', 'Comments, reviews, forum posts, uploads.')}
          {booleanField('hasAffiliates', 'Do you use affiliate links?', 'Amazon Associates, ShareASale, or any referral commissions.')}
        </div>

        {/* Target Regions */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Target Audience Regions
          </label>
          <p className="text-xs text-galactic mb-3">Select all regions where your website targets or serves visitors.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Target audience regions">
            {REGIONS.map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => toggleRegion(region.id)}
                aria-pressed={profile.regions?.includes(region.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss ${
                  profile.regions?.includes(region.id)
                    ? 'bg-azure/15 border-azure/40 text-azure'
                    : 'bg-transparent border-metal/30 text-galactic hover:border-metal/50 hover:text-cloudy'
                }`}
              >
                {region.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
