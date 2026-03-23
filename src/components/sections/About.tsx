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
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'Harvard University IT',
    description: 'Leading technical initiatives and infrastructure projects that serve thousands of students and faculty.',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Student Government Executive VP',
    description: 'Driving strategic initiatives and representing student interests at the highest levels of university governance.',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Passion for Innovation',
    description: 'Constantly exploring emerging technologies and their potential to create positive change in the world.',
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
          className="text-center mb-20"
        >
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            About Me
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A technical leader passionate about building systems that bridge the gap between cutting-edge technology and meaningful human impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-24">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Placeholder for professional headshot */}
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20" />
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl font-bold text-black">JD</span>
                  </div>
                  <p className="text-gray-400 text-sm">Professional Photo</p>
                  <p className="text-gray-500 text-xs">Coming Soon</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full opacity-60" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full opacity-40" />
            </div>
          </motion.div>

          {/* Bio Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <p className="text-lg text-gray-300 leading-relaxed">
                I'm a software engineer and technical leader with a passion for building systems that actually matter. Currently working at Harvard University IT, I focus on creating scalable solutions that serve thousands of users while maintaining the highest standards of reliability and performance.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                My journey spans from AI systems and biometric authentication to financial platforms and IoT networks. I believe in the power of thoughtful engineering to solve real-world problems and create meaningful impact.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Beyond technical work, I serve as Executive Vice President of Student Government, where I drive strategic initiatives and advocate for student interests. This role has taught me the importance of balancing technical excellence with human-centered design.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">5+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">10+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Projects Delivered</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            Key Highlights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${highlight.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {highlight.icon}
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">
                  {highlight.title}
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  {highlight.description}
                </p>
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
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            What I Care About
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    {value.title}
                  </h4>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}