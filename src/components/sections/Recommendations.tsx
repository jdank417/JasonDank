'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionHeading from '../SectionHeading';

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
  return (
    <section id="recommendations" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="06" title="Recommendations" />

        <div className="grid gap-4 lg:grid-cols-2">
          {recommendations.map((rec, index) => (
            <motion.blockquote
              key={rec.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true, margin: '-40px' }}
              className="flex flex-col rounded-md border border-border bg-card p-5 transition-colors hover:border-foreground sm:p-6"
            >
              <Quote className="h-5 w-5 flex-shrink-0 text-accent" aria-hidden />
              <p className="mt-4 flex-1 text-sm italic leading-relaxed text-muted sm:text-base">
                {rec.text}
              </p>
              <footer className="mt-5 border-t border-border pt-4 text-sm">
                <span className="font-medium">{rec.author}</span>
                <span className="mt-0.5 block text-muted">
                  {rec.title} — {rec.company}
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
