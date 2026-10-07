import type { Metadata } from 'next';
import Terminal from '@/components/Terminal';

export const metadata: Metadata = {
  title: 'Terminal — Jason Dank',
  description: 'Browse Jason Dank’s work, projects and sailing from a working shell: ls, cat, cd, open.',
};

export default function TerminalPage() {
  return (
    <main id="main" className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-graph opacity-35"
          style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="mb-4 text-xs uppercase tracking-[0.15em] text-muted">jasondank.com / terminal</p>
          <h1 className="text-display font-bold">Same résumé, more keyboard.</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Everything on the site, as files. Try <code className="text-foreground">ls</code>,{' '}
            <code className="text-foreground">cat about.txt</code> or{' '}
            <code className="text-foreground">cd projects</code>. Tab completes, the arrow keys walk your history,
            and <code className="text-foreground">open</code> follows a file to its repo or page.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Terminal />
      </section>
    </main>
  );
}
