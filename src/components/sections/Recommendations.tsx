'use client';

import { useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionHeading from '../SectionHeading';
import { CarouselControls, useCarousel } from '../mobile/Carousel';

const recommendations = [
  {
    id: 'kurt-levitan',
    text: "Jason worked with our Endpoint Systems Management team as a coop. He quickly integrated himself into the team and found several ways to add value. He helped solve a long running problem of automating and standardizing the names for Mac computers. He then switched platforms and coded a solution for a Windows issue. Jason is a strong team player, an inventive problem solver, and an excellent programmer. I am confident that he will add value to any organization he works for.",
    author: 'Kurt Levitan',
    title: 'Technical Architect, Endpoint Systems Management',
    company: 'Harvard University',
  },
  {
    id: 'academic-recognition',
    text: "Jason Dank's pursuit of a wide variety of academic knowledge has also led him to be actively engaged in various organizations on campus. Jason serves on the Wentworth Student Government as Executive Vice President and Chair to the Board of Directors. He represents the student body on the university's Information Technology Steering Committee and the School of Computing and Data Sciences AI task force. He is also president and captain of the Wentworth Sailing Team, and during the summer he competes in large yacht racing in Marblehead, MA. Jason is passionate about developing resources for artificial intelligence, specifically in fine-tuning AI modeling and application development.",
    author: 'Wentworth Institute of Technology',
    title: '2025–2026 Scholarship Report Recognition',
    company: 'Official academic profile',
  },
];

export default function Recommendations() {
  const rowRef = useRef<HTMLDivElement>(null);
  const { index, goTo } = useCarousel(rowRef);

  return (
    <section id="recommendations" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="06" title="Recommendations" />

        {/* Below md: a swipeable row. From md up: the original stacked/two-column grid. */}
        <div
          ref={rowRef}
          role="region"
          aria-label="Recommendations"
          className="no-scrollbar relative -mx-5 flex snap-x snap-mandatory scroll-px-5 items-start gap-3 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:snap-none md:items-stretch md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-2"
        >
          {recommendations.map((rec, index) => (
            <motion.blockquote
              key={rec.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true, margin: '-40px' }}
              className="flex w-[88%] shrink-0 snap-start flex-col rounded-md border border-border bg-card p-5 transition-colors hover:border-foreground sm:w-[75%] sm:p-6 md:w-auto"
            >
              <Quote className="h-5 w-5 flex-shrink-0 text-accent" aria-hidden />
              <QuoteText text={rec.text} />
              <footer className="mt-5 border-t border-border pt-4 text-sm">
                <span className="font-medium">{rec.author}</span>
                <span className="mt-0.5 block text-muted">
                  {rec.title} — {rec.company}
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
        <CarouselControls index={index} count={recommendations.length} onGo={goTo} label="quotes" />
      </div>
    </section>
  );
}

/** On phones a long quote is clamped to eight lines with a "read more". */
function QuoteText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <>
      <p
        id={id}
        className={`mt-4 flex-1 text-sm italic leading-relaxed text-muted sm:text-base ${
          expanded ? '' : 'line-clamp-[8] md:line-clamp-none'
        }`}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls={id}
        className="press mt-3 self-start rounded border border-border px-2.5 py-1.5 text-xs uppercase tracking-[0.1em] text-foreground md:hidden"
      >
        {expanded ? 'show less' : 'read more'}
      </button>
    </>
  );
}
