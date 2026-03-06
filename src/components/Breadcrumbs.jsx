export default function Breadcrumbs() {
  return (
    <nav className="mb-8 text-sm text-galactic" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-y-1">
        <li>
          <a
            href="https://seo-tools-tau.vercel.app/"
            className="text-azure hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss rounded"
          >
            Free Tools
          </a>
        </li>
        <li aria-hidden="true"><span className="mx-2 text-metal">/</span></li>
        <li>
          <a
            href="https://seo-tools-tau.vercel.app/legal-compliance/"
            className="text-azure hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss rounded"
          >
            Legal &amp; Compliance
          </a>
        </li>
        <li aria-hidden="true"><span className="mx-2 text-metal">/</span></li>
        <li>
          <span className="text-cloudy" aria-current="page">Website Legal Page Audit</span>
        </li>
      </ol>
    </nav>
  );
}
