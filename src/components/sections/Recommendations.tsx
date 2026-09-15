'use client';

import { motion } from 'framer-motion';

const recommendations = [
  {
    id: 'kurt-levitan',
    text: "Jason worked with our Endpoint Systems Management team as a co-op. He quickly integrated himself into the team and found several ways to add value. He helped solve a long running problem of automating and standardizing the names for Mac computers. He then switched platforms and coded a solution for a Windows issue. Jason is a strong team player, an inventive problem solver, and an excellent programmer. I am confident that he will add value to any organization he works for.",
    author: 'Kurt Levitan',
    title: 'Microsoft Endpoint Architect & Team Lead',
    company: 'Harvard University',
  },
  {
    id: 'academic-recognition',
    text: "A computer science major with minors in data science, business analytics, applied mathematics, and computer networking, Jason Dank's pursuit of a wide variety of academic knowledge has also led him to be actively engaged in various organizations on campus. Jason serves on the Wentworth Student Government as Executive Vice President and Chair to the Board of Directors, and represents the student body on the university's IT Steering Committee and the School of Computing and Data Sciences AI task force. He is also President and Captain of the Wentworth Sailing Team, competing in yacht racing in Marblehead, MA during the summer.",
    author: 'Academic Recognition',
    title: 'Wentworth Institute of Technology',
    company: 'Official Academic Profile',
  },
];

export default function Recommendations() {
  return (
    <section id="recommendations" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 flex items-baseline gap-4 border-b border-border pb-4"
        >
          <span className="text-sm text-muted">&sect;06</span>
          <h2 className="text-display font-bold">Recommendations</h2>
        </motion.div>

        <div className="space-y-12">
          {recommendations.map((rec, index) => (
            <motion.blockquote
              key={rec.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="border-l-2 border-border pl-6"
            >
              <p className="italic leading-relaxed text-muted">&ldquo;{rec.text}&rdquo;</p>
              <footer className="mt-4 text-sm">
                <span className="font-medium">{rec.author}</span>
                <span className="text-muted"> &mdash; {rec.title}, {rec.company}</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
