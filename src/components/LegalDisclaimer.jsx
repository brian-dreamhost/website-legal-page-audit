export default function LegalDisclaimer() {
  return (
    <div
      className="mb-8 p-4 rounded-xl border border-tangerine/30 bg-tangerine/5"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg aria-hidden="true" className="w-5 h-5 text-tangerine mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <div>
          <p className="text-tangerine font-semibold text-sm mb-1">Not Legal Advice</p>
          <p className="text-cloudy text-sm leading-relaxed">
            This tool provides general guidance about common legal page requirements. It is not a substitute for professional legal counsel. Laws vary by jurisdiction and specific circumstances. Consult a qualified attorney for advice tailored to your situation.
          </p>
        </div>
      </div>
    </div>
  );
}
