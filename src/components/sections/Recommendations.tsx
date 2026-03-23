'use client';

import { motion } from 'framer-motion';
import { Quote, Star, Linkedin } from 'lucide-react';

interface Recommendation {
  id: string;
  text: string;
  name: string;
  role: string;
  company: string;
  gradient: string;
}

const recommendations: Recommendation[] = [
  {
    id: 'tech-lead',
    text: "Jason's ability to architect scalable systems while maintaining code quality is exceptional. His work on our enterprise infrastructure directly improved system reliability by 40%. He combines deep technical knowledge with strategic thinking.",
    name: "Sarah Chen",
    role: "Senior Technical Lead",
    company: "Harvard University IT",
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'product-manager',
    text: "Working with Jason on the HumanAuth project was remarkable. He took a complex AI concept and built a production-ready system that actually works. His attention to user experience while solving technical challenges is rare.",
    name: "Michael Rodriguez",
    role: "Product Manager",
    company: "AI Systems Division",
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'student-leader',
    text: "Jason's leadership as Executive VP transformed how we approach student initiatives. He doesn't just manage — he builds systems that scale. His technical background brings a unique perspective to policy and governance.",
    name: "Emma Thompson",
    role: "Student Body President",
    company: "Harvard Student Government",
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'engineering-mentor',
    text: "Jason's mentorship style is exceptional. He teaches not just what to build, but how to think about systems. Students who work with him consistently deliver higher-quality projects and develop stronger engineering intuition.",
    name: "Dr. James Wilson",
    role: "Faculty Advisor",
    company: "Engineering Hope",
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'team-captain',
    text: "Under Jason's leadership, our sailing team achieved its best performance in years. He applies the same systematic thinking to athletics that he does to engineering — analyzing, optimizing, and executing with precision.",
    name: "Alex Martinez",
    role: "Team Member",
    company: "Harvard Sailing Team",
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'industry-professional',
    text: "Jason's approach to problem-solving is methodical and innovative. He doesn't just implement solutions — he designs systems that anticipate future needs. His work consistently exceeds expectations.",
    name: "Lisa Park",
    role: "Senior Software Engineer",
    company: "Fidelity Investments",
    gradient: 'from-indigo-500 to-purple-600'
  }
];

export default function Recommendations() {
  return (
    <section id="recommendations" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(60deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Recommendations
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            What colleagues, mentors, and collaborators say about working together and the impact of our shared projects.
          </p>
        </motion.div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50 h-full flex flex-col">
                {/* Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${rec.gradient} text-white`}>
                    <Quote className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-300 text-base leading-relaxed mb-6 flex-grow">
                  "{rec.text}"
                </blockquote>

                {/* Author Info */}
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-300">
                        {rec.name}
                      </h4>
                      <p className="text-green-400 font-medium text-sm">
                        {rec.role}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {rec.company}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                      <Linkedin className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${rec.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Quote className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Collaborative Impact</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              These recommendations reflect a consistent pattern: building systems that work, leading teams that deliver, 
              and creating lasting impact through thoughtful engineering and strategic leadership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25">
                View LinkedIn Profile
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="inline-flex items-center gap-3 px-6 py-3 border border-gray-600 hover:border-green-500 text-gray-300 hover:text-green-400 font-semibold rounded-lg transition-all duration-300 hover:bg-gray-800">
                Request Reference
                <Quote className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}