'use client';

import { motion } from 'framer-motion';
import { Users, Shield, Brain, Anchor, TrendingUp, Award } from 'lucide-react';

interface LeadershipRole {
  id: string;
  title: string;
  organization: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
  gradient: string;
}

const leadershipRoles: LeadershipRole[] = [
  {
    id: 'executive-vp',
    title: 'Executive Vice President',
    organization: 'Student Government',
    description: 'Leading university-wide initiatives and working with administration on policy and systems that affect thousands of students.',
    impact: 'Driving strategic change and representing student interests at the highest levels of governance.',
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'it-steering',
    title: 'IT Steering Committee Representative',
    organization: 'Harvard University',
    description: 'Providing strategic input on technology decisions and infrastructure planning for the university.',
    impact: 'Influencing technology policy and ensuring student perspectives are represented in IT decisions.',
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'ai-task-force',
    title: 'AI Academic Integrity Task Force',
    organization: 'Harvard University',
    description: 'Developing policies and frameworks for responsible AI use in academic settings.',
    impact: 'Shaping the future of AI integration in higher education while maintaining academic integrity.',
    icon: <Brain className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'sailing-captain',
    title: 'Sailing Team Captain',
    organization: 'Harvard Sailing',
    description: 'Leading the team to its highest performance season since 2019 through strategic planning and team development.',
    impact: 'Achieved record-breaking performance through leadership, training optimization, and team cohesion.',
    icon: <Anchor className="w-6 h-6" />,
    gradient: 'from-cyan-500 to-blue-600'
  }
];

export default function Leadership() {
  return (
    <section id="leadership" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(30deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
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
          className="text-center mb-20"
        >
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Leadership &
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Differentiation
            </span>
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Beyond technical expertise — driving meaningful change through leadership, ownership, and strategic impact across multiple domains.
          </p>
        </motion.div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {leadershipRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50">
                {/* Role Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${role.gradient} text-white`}>
                    {role.icon}
                  </div>
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Award className="w-5 h-5 text-green-400" />
                  </div>
                </div>

                {/* Role Title & Organization */}
                <div className="mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-300">
                    {role.title}
                  </h3>
                  <p className="text-lg text-green-400 font-semibold">
                    {role.organization}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {role.description}
                </p>

                {/* Impact Statement */}
                <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-1">
                    Leadership Impact
                  </p>
                  <p className="text-white font-medium">
                    {role.impact}
                  </p>
                </div>

                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Leadership Philosophy</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              True leadership means taking ownership, driving meaningful change, and creating systems that outlast individual contributions. 
              These roles represent more than positions — they're platforms for building lasting impact.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}