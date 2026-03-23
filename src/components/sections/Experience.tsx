'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, TrendingUp, Users, Server, Code2 } from 'lucide-react';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  type: 'current' | 'past';
  description: string;
  achievements: string[];
  technologies?: string[];
  icon: React.ReactNode;
  gradient: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 'fidelity',
    title: 'Incoming Full Stack Engineer',
    company: 'Fidelity Investments',
    location: 'Boston, MA',
    period: 'Starting 2024',
    type: 'current',
    description: 'Joining Fidelity as a full-stack engineer to build scalable financial technology solutions serving millions of customers.',
    achievements: [
      'Selected for competitive full-stack engineering role',
      'Will contribute to mission-critical financial systems',
      'Focus on building customer-facing applications',
      'Part of next-generation fintech development team'
    ],
    technologies: ['React', 'Java', 'Spring Boot', 'AWS', 'Microservices'],
    icon: <Code2 className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'harvard-it',
    title: 'Endpoint Systems Engineer',
    company: 'Harvard University IT',
    location: 'Cambridge, MA',
    period: '2023 - Present',
    type: 'current',
    description: 'Leading enterprise endpoint management and infrastructure projects, designing scalable solutions for thousands of university devices.',
    achievements: [
      'Designed and deployed CrashPlan remediation systems',
      'Built automation for macOS and Windows environments',
      'Created scalable workflows for technicians and self-service',
      'Improved backup system reliability across enterprise infrastructure'
    ],
    technologies: ['PowerShell', 'Python', 'Bash', 'Enterprise IT Systems', 'macOS', 'Windows'],
    icon: <Server className="w-6 h-6" />,
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'student-government',
    title: 'Executive Vice President',
    company: 'Harvard Student Government',
    location: 'Cambridge, MA',
    period: '2022 - Present',
    type: 'current',
    description: 'Driving strategic initiatives and representing student interests at the highest levels of university governance.',
    achievements: [
      'Spearheaded policy changes affecting 20,000+ undergraduate students',
      'Managed $2M+ annual budget for student programs and initiatives',
      'Built coalition partnerships with 50+ student organizations',
      'Launched mental health and academic support programs'
    ],
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'engineering-hope',
    title: 'Tech Leadership',
    company: 'Engineering Hope',
    location: 'Cambridge, MA',
    period: '2021 - Present',
    type: 'current',
    description: 'Leading technical initiatives and mentoring students in engineering and technology, fostering innovation and community impact.',
    achievements: [
      'Mentored 20+ students in technical skills and career development',
      'Led workshops on software engineering and AI systems',
      'Built partnerships with tech companies for student opportunities',
      'Developed curriculum for emerging technology education'
    ],
    technologies: ['Python', 'JavaScript', 'AI/ML', 'Web Development', 'Mentorship'],
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: 'from-orange-500 to-red-600'
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Experience
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A journey of building impactful systems, leading teams, and creating meaningful change through technology and leadership.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 opacity-30" />

          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative flex items-start gap-8"
              >
                {/* Timeline dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${experience.gradient} flex items-center justify-center text-white shadow-lg`}>
                    {experience.icon}
                  </div>
                  {experience.type === 'current' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-black/50">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {experience.title}
                      </h3>
                      <p className="text-lg text-green-400 font-semibold">
                        {experience.company}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end text-sm text-gray-400 mt-2 sm:mt-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>{experience.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {experience.description}
                  </p>

                  {/* Achievements */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {experience.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  {experience.technologies && (
                    <div>
                      <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700 hover:border-green-500 hover:text-green-400 transition-colors duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-gray-400 text-lg mb-8">
            Want to learn more about my professional journey?
          </p>
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
            Download Resume
            <Calendar className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}