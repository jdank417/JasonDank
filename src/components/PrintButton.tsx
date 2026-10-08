'use client';

import { Download } from 'lucide-react';

/** Opens the print dialog, where "Save as PDF" produces the résumé file. */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="press inline-flex items-center gap-2 rounded-md border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
    >
      <Download className="h-4 w-4" aria-hidden />
      Save as PDF
    </button>
  );
}
