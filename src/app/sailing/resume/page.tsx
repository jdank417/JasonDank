import type { Metadata } from 'next';
import Burgee, { BurgeeNames, type BurgeeKey } from '@/components/Burgee';
import PrintButton from '@/components/PrintButton';
import { Bullets, Entry, Section } from '@/components/ResumeSheet';
import { certifications, clubs, highlights, racing } from '@/data/sailing';
import { delivery } from '@/data/voyages';
import { EMAIL } from '@/data/site';

export const metadata: Metadata = {
  title: 'Sailing résumé — Jason Dank',
  description: 'Jason Dank’s sailing résumé: won Figawi 2026, IOD North Americans, Marblehead and Boston Harbor racing, and instructing since 2017.',
};

const stops = delivery.filter((pt) => pt.name);

function Flags({ flags }: { flags: BurgeeKey[] }) {
  return (
    <span className="mr-1.5 inline-flex translate-y-[1px] gap-1 align-baseline">
      {flags.map((f) => (
        <Burgee key={f} name={f} className="h-[11px] w-[17px]" />
      ))}
    </span>
  );
}

/**
 * The sailing résumé, built from the same data as /sailing. "Save as PDF"
 * prints just the sheet, like /resume (see the print rules in globals.css).
 */
export default function SailingResumePage() {
  return (
    <main id="main" className="min-h-screen bg-background py-8 sm:py-12 print:p-0">
      <div className="mx-auto mb-6 flex max-w-[8.5in] flex-wrap items-center justify-between gap-3 px-5 sm:px-0 print:hidden">
        <p className="text-xs uppercase tracking-[0.12em] text-muted">Built from the same data as the sailing page</p>
        <PrintButton />
      </div>

      <article id="resume" className="resume mx-auto max-w-[8.5in] bg-card px-6 py-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] sm:border sm:border-border sm:px-[0.6in] sm:py-[0.55in]">
        <header className="border-b-2 border-foreground pb-3">
          <h1 className="font-display text-[1.65rem] font-extrabold leading-none">Jason Dank</h1>
          <p className="mt-1.5 text-[0.8rem]">Sailing résumé · Boston, MA</p>
          <p className="mt-1 flex flex-wrap gap-x-3 text-[0.72rem] text-muted">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href="https://jasondank.com/sailing">jasondank.com/sailing</a>
          </p>
        </header>

        <Section title="Highlights" columns>
          {highlights.map((h) => (
            <Entry key={h.label} title={h.label} sub={h.detail} stacked />
          ))}
        </Section>

        <Section title="Racing">
          {racing.map((r) => (
            <Entry
              key={r.id}
              title={
                <>
                  <Flags flags={r.flags} />
                  {r.boat}
                </>
              }
              org={r.venue}
              meta={r.period}
              sub={<BurgeeNames names={r.flags} before={r.result} />}
            >
              <Bullets lines={r.bullets} />
            </Entry>
          ))}
        </Section>

        <Section title="Clubs & instructing">
          {clubs.map((c) => (
            <Entry
              key={c.id}
              title={
                <>
                  <Flags flags={[c.flag]} />
                  {c.name}
                </>
              }
              org={c.location}
              meta={c.period}
            >
              <Bullets lines={c.bullets} />
              {c.boats && <p className="text-[0.68rem] text-muted">Boats: {c.boats}</p>}
            </Entry>
          ))}
        </Section>

        <Section title="Passages">
          <Entry
            title="Motor yacht delivery"
            org={`${stops[0].name}, ${stops[0].state} → ${stops[stops.length - 1].name}, ${stops[stops.length - 1].state}`}
            meta="May — Jun 2023"
          >
            <Bullets
              lines={[
                `Moved a motor yacht north from Florida to Long Island, mostly on the Intracoastal Waterway, through ${stops.length} logged stops.`,
              ]}
            />
          </Entry>
        </Section>

        <Section title="Certifications">
          {certifications.map((c) => (
            <Entry key={c.name} title={c.name} sub={c.detail} />
          ))}
        </Section>
      </article>
    </main>
  );
}
