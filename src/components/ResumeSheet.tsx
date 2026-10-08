import type { ReactNode } from 'react';

// Building blocks shared by the printable résumés (/resume and
// /sailing/resume), so both lay out and print the same way. Sizes are in rem
// so the print rules in globals.css can scale a whole sheet at once.

export function Section({ title, columns = false, children }: { title: string; columns?: boolean; children: ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="mb-2 border-b border-border pb-0.5 text-[0.7rem] font-bold uppercase tracking-[0.16em]">{title}</h2>
      <div className={columns ? 'grid gap-x-6 gap-y-2 sm:grid-cols-2 print:grid-cols-2' : 'space-y-2.5'}>{children}</div>
    </section>
  );
}

export function Entry({
  title,
  org,
  meta,
  sub,
  stacked = false,
  children,
}: {
  title: ReactNode;
  org?: string;
  meta?: string;
  sub?: ReactNode;
  /** Date under the title instead of beside it, for narrow columns. */
  stacked?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="resume-entry">
      <div className={stacked ? '' : 'flex flex-wrap items-baseline justify-between gap-x-3'}>
        <p className="text-[0.8rem] font-bold leading-snug">
          {title}
          {org && <span className="font-normal"> · {org}</span>}
        </p>
        {meta && <p className="text-[0.68rem] tabular-nums text-muted">{meta}</p>}
      </div>
      {sub && <p className="text-[0.68rem] text-muted">{sub}</p>}
      {children && <div className="mt-0.5 space-y-0.5">{children}</div>}
    </div>
  );
}

export function Bullets({ lines }: { lines: string[] }) {
  return (
    <ul className="space-y-0.5">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2 text-[0.74rem] leading-snug">
          <span aria-hidden>–</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}
