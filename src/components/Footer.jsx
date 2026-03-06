export default function Footer() {
  return (
    <footer className="mt-16 border-t border-metal/30 py-8 no-print">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-galactic">
          <p>
            Built by{' '}
            <a
              href="https://www.dreamhost.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-azure hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss rounded"
            >
              DreamHost
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://seo-tools-tau.vercel.app/"
              className="text-azure hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss rounded"
            >
              All Free Tools
            </a>
            <a
              href="https://seo-tools-tau.vercel.app/legal-compliance/"
              className="text-azure hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-2 focus-visible:ring-offset-abyss rounded"
            >
              Legal &amp; Compliance Tools
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
