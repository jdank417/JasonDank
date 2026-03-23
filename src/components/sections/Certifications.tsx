'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle, Award, ExternalLink } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  description: string;
  skills: string[];
  icon: React.ReactNode;
  gradient: string;
  year: string;
}

const certifications: Certification[] = [
  {
    id: 'jamf-pro',
    title: 'Jamf Certified Associate',
    issuer: 'Jamf Pro',
    description: 'Comprehensive certification in Apple device management, demonstrating expertise in enterprise macOS deployment, configuration, and security management.',
    skills: ['macOS Management', 'Device Deployment', 'Security Policies', 'Enterprise Configuration'],
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-blue-500 to-indigo-600',
    year: '2023'
  },
  {
    id: 'jamf-protect',
    title: 'Jamf Certified Associate',
    issuer: 'Jamf Protect',
    description: 'Advanced certification in endpoint security and threat detection, focusing on proactive security measures and incident response for Apple devices.',
    skills: ['Endpoint Security', 'Threat Detection', 'Incident Response', 'Security Analytics'],
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-600',
    year: '2023'
  }
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 3px 3px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
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
            Certifications
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Professional certifications demonstrating expertise in enterprise systems management and security.
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50">
                {/* Certification Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${cert.gradient} text-white`}>
                    {cert.icon}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-400 mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Certified</span>
                    </div>
                    <div className="text-sm text-gray-500">{cert.year}</div>
                  </div>
                </div>

                {/* Certification Title & Issuer */}
                <div className="mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-300">
                    {cert.title}
                  </h3>
                  <p className="text-lg text-green-400 font-semibold">
                    {cert.issuer}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {cert.description}
                </p>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                    Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700 hover:border-green-500 hover:text-green-400 transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 font-semibold text-sm uppercase tracking-wider">
                      Professional Certification
                    </p>
                  </div>
                  <p className="text-white font-medium text-sm">
                    Verified expertise in enterprise Apple device management and security
                  </p>
                </div>

                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${cert.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certification Value Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Enterprise Expertise</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              These certifications represent deep expertise in enterprise Apple device management and security — 
              critical skills for building and maintaining large-scale IT infrastructure.
            </p>
            <button className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25">
              View Credentials
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}