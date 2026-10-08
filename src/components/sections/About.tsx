'use client';

import { motion } from 'framer-motion';
import SectionHeading from '../SectionHeading';
import { CollapsePanel, useDisclosure } from '../mobile/Disclosure';

const focusAreas = [
  {
    title: 'Private markets & fintech',
    short: 'Full-stack on Fidelity Private Shares.',
    description:
      'Full-stack work on the Fidelity Private Shares platform — building for private equity and venture transactions end to end.',
  },
  {
    title: 'Systems design',
    short: 'Web, desktop and mobile, data model to deploy.',
    description:
      'Architecting web, desktop, and mobile solutions from data model to deployment, with the operational side handled too.',
  },
  {
    title: 'Automation & AI/ML',
    short: 'Fine-tuning, ML pipelines, scripting.',
    description:
      'Outside the day job: fine-tuning language models, building ML pipelines, and scripting away repetitive operational work.',
  },
  {
    title: 'Leadership in practice',
    short: 'Team captain and board chair.',
    description:
      'Running a 25-member sailing team and chairing a university board taught me the same thing engineering did: process beats improvisation.',
  },
];

export default function About() {
  const { open, toggle, panelId } = useDisclosure(false);

  return (
    <section id="about" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="00" title="About" />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-5 text-base leading-relaxed text-muted sm:text-lg lg:col-span-7"
          >
            <p>
              Full-stack software engineer with experience across fintech, enterprise IT
              operations, and product development. I’m currently a{' '}
              <span className="font-medium text-foreground">Full Stack Software Engineer</span>{' '}
              at Fidelity Investments, working on the{' '}
              <span className="font-medium text-foreground">Fidelity Private Shares</span>{' '}
              platform — building scalable solutions for private market investments
              that serve both institutional and individual investors.
            </p>
            {/* Phones show the first paragraph and a "read more"; from sm up it's all open. */}
            <CollapsePanel open={open} id={panelId} className="mb-0">
              <div className="space-y-5">
                <p>
                  I got here by way of Harvard University Information Technology, where I spent two
                  terms as an Endpoint Systems Engineer across a fleet of 20,000+ macOS, Windows, and
                  Linux devices. Along the way I’ve fine-tuned language models, built CI/CD
                  pipelines, shipped two apps to the Apple App Store, stood up a GPU-accelerated
                  remote compute environment for model training, and published a senior capstone on
                  replacing CAPTCHA with real-time computer vision.
                </p>
                <p>
                  I hold a B.S. in Computer Science — with minors in Data Science, Applied
                  Mathematics, and Business Analytics — from Wentworth
                  Institute of Technology, where I served as{' '}
                  <span className="font-medium text-foreground">Executive Vice President</span>{' '}
                  of Student Government and{' '}
                  <span className="font-medium text-foreground">President & Captain</span>{' '}
                  of the Sailing Team. More on that on the{' '}
                  <a
                    href="/sailing"
                    className="underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-foreground"
                  >
                    sailing page
                  </a>
                  .
                </p>
              </div>
            </CollapsePanel>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={panelId}
              className={`press rounded border border-border px-2.5 py-1.5 text-xs uppercase tracking-[0.1em] text-foreground sm:hidden ${open ? 'mt-5' : ''}`}
            >
              {open ? 'show less' : 'read more'}
            </button>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            {focusAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-md border border-border bg-card p-4 transition-colors hover:border-foreground sm:p-5"
              >
                <h3 className="font-display font-bold max-sm:text-sm max-sm:leading-snug">{area.title}</h3>
                <p className="mt-1.5 text-xs text-muted sm:hidden">{area.short}</p>
                <p className="mt-1.5 hidden text-sm text-muted sm:block sm:text-base">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
