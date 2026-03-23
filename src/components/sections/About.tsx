'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Users, Heart, Code, Brain, Target } from 'lucide-react';

const values = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Ethics',
    description: 'Building responsible AI systems that prioritize human welfare and fairness in every decision.'
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Systems Design',
    description: 'Crafting scalable, maintainable architectures that stand the test of time and growth.'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Real-World Impact',
    description: 'Creating technology that solves genuine problems and improves people\'s lives meaningfully.'
  }
];

const highlights = [
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Executive Vice President',
    description: 'Wentworth Student Government - Chair to the Board of Directors, representing the student body and driving strategic initiatives.',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'IT Steering Committee',
    description: 'University representative on Information Technology Steering Committee, shaping technology decisions at institutional level.',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'AI Task Force',
    description: 'School of Computing and Data Sciences AI Task Force member, contributing to AI strategy and implementation.',
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Sailing Team Captain',
    description: 'President and Captain of Wentworth Sailing Team, competing in large yacht racing in Marblehead, MA during summers.',
    gradient: 'from-green-500 to-emerald-600'
  }
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
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
          <h2 className="font-hero text-display font-black text-white mb-8 leading-tight tracking-tight">
            ABOUT
          </h2>
          <p className="font-editorial text-large text-gray-300 max-w-2xl leading-relaxed">
            Technical leader. Product builder. Systems thinker.
          </p>
        </motion.div>

        {/* Bio Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-8">
              <p className="font-editorial text-large text-gray-300 leading-relaxed">
                Full Stack Software Engineer at <span className="font-heading text-white font-semibold">Fidelity Investments</span>, 
                building scalable solutions for private market investments. Computer Science major with minors in 
                data science, business analytics, applied mathematics, and computer networking at Wentworth Institute of Technology.
              </p>
              
              <p className="font-editorial text-large text-gray-300 leading-relaxed">
                My experience spans enterprise IT operations at Harvard University, AI systems development, 
                and financial technology. I've built everything from fine-tuned language models for sailing rules 
                to real-time stock tickers for macOS, always focusing on systems that solve real problems.
              </p>
              
              <p className="font-editorial text-large text-gray-300 leading-relaxed">
                As <span className="font-heading text-white font-semibold">Executive Vice President</span> of Wentworth Student Government 
                and member of the IT Steering Committee and AI Task Force, I bridge technical excellence with leadership 
                and strategic thinking.
              </p>
            </div>
            
            {/* Stats Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h3 className="font-accent text-sm text-gray-400 font-medium tracking-[0.2em] uppercase mb-6">
                  Experience
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline border-b border-gray-800 pb-2">
                    <span className="font-body text-gray-300">Years</span>
                    <span className="font-heading text-2xl text-green-400 font-bold">4+</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-gray-800 pb-2">
                    <span className="font-body text-gray-300">Projects</span>
                    <span className="font-heading text-2xl text-green-400 font-bold">15+</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-gray-800 pb-2">
                    <span className="font-body text-gray-300">GPA</span>
                    <span className="font-heading text-2xl text-green-400 font-bold">3.7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leadership */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h3 className="font-display text-subhead font-bold text-white mb-16 leading-tight">
            Leadership & Impact
          </h3>
          
          <div className="space-y-16">
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`group ${index % 2 === 1 ? 'lg:ml-24' : ''}`}
              >
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-3">
                    <h4 className="font-heading text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                      {highlight.title}
                    </h4>
                    <div className="w-12 h-px bg-green-400"></div>
                  </div>
                  <div className="lg:col-span-9">
                    <p className="font-body text-lg text-gray-300 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-16"
        >
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h3 className="font-display text-subhead font-bold text-white mb-8 leading-tight">
                What drives me
              </h3>
              <p className="font-editorial text-large text-gray-400 leading-relaxed italic">
                Technology should serve humanity, not the other way around.
              </p>
            </div>
            
            <div className="lg:col-span-8 space-y-12">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-3"></div>
                    <div>
                      <h4 className="font-heading text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                        {value.title}
                      </h4>
                      <p className="font-editorial text-large text-gray-300 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}