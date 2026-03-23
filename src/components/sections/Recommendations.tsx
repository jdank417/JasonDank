'use client';

import { motion } from 'framer-motion';
import { Quote, Star, Award } from 'lucide-react';

const recommendations = [
  {
    id: 'kurt-levitan',
    text: "Jason worked with our Endpoint Systems Management team as a coop. He quickly integrated himself into the team and found several ways to add value. He helped solve a long running problem of automating and standardizing the names for Mac computers. He then switched platforms and coded a solution for a Windows issue. Jason is a strong team player, an inventive problem solver, and an excellent programmer. I am confident that he will add value to any organization he works for.",
    author: "Kurt Levitan",
    title: "Microsoft Endpoint Architect & Team Lead",
    company: "Harvard University",
    icon: <Quote className="w-6 h-6" />,
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'academic-recognition',
    text: "A computer science major with minors in data science, business analytics, applied mathematics, and computer networking, Jason Dank's pursuit of a wide variety of academic knowledge has also led him to be actively engaged in various organizations on campus. Jason serves on the Wentworth Student Government (WSG) as the Executive Vice President and Chair to the Board of Directors. He represents the student body serving on the universities' Information Technology Steering Committee (ITSC) and the School of Computing and Data Sciences (SCDS) AI task force. He is also the president and captain of the Wentworth Sailing Team, and during the summer, he competes in large yacht racing in Marblehead, MA. Jason is passionate about developing resources for artificial intelligence, specifically in fine-tuning AI modeling and application development. This has led to creating several active AI applications while at Wentworth, including a full-stack web application that enables customers to get real-time price data on items available at the campus grocery store via their cell phones. He also has two others that he has published in the Apple App store. Without the generous scholarship support he has received, Jason believes that the success he has achieved attending Wentworth would not have been possible.",
    author: "Academic Recognition",
    title: "Wentworth Institute of Technology",
    company: "Official Academic Profile",
    icon: <Award className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-600'
  }
];

export default function Recommendations() {
  return (
    <section id="recommendations" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 3px 3px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className="font-display text-display font-bold text-white mb-8 leading-tight">
            Recommendations
          </h2>
          <p className="font-body text-editorial text-gray-300 max-w-2xl leading-relaxed">
            Perspectives from colleagues and institutions on technical expertise and leadership impact.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="space-y-32">
          {recommendations.map((rec, index) => (
            <motion.article
              key={rec.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`group relative ${index % 2 === 1 ? 'lg:ml-24' : ''}`}
            >
              {/* Large Quote Mark */}
              <div className="absolute -left-8 -top-4 text-8xl font-display text-gray-800 leading-none select-none">
                "
              </div>

              <div className="relative max-w-4xl">
                {/* Quote Text */}
                <blockquote className="font-display text-subhead font-medium text-white leading-tight mb-12 italic">
                  {rec.text}
                </blockquote>

                {/* Attribution */}
                <div className="grid lg:grid-cols-12 gap-8 items-end">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-px bg-green-400"></div>
                      <div>
                        <h4 className="font-heading text-xl font-semibold text-white mb-1 group-hover:text-green-400 transition-colors duration-300">
                          {rec.author}
                        </h4>
                        <p className="font-body text-gray-400 mb-1">
                          {rec.title}
                        </p>
                        <p className="font-accent text-sm text-gray-500 tracking-wide">
                          {rec.company}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Source indicator */}
                  <div className="lg:col-span-4 lg:text-right">
                    <span className="font-accent text-xs text-gray-600 tracking-[0.2em] uppercase">
                      {rec.id === 'academic-recognition' ? 'Academic Profile' : 'Professional Reference'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtle separator */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}