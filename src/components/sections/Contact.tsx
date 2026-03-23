'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Send, ArrowUpRight, Github } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
          backgroundSize: '30px 30px'
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
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8">
            Let's Build Something
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Meaningful
            </span>
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Ready to create impactful technology together? I'm always interested in discussing new opportunities, innovative projects, and meaningful collaborations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Get In Touch</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Whether you're looking to collaborate on a project, discuss opportunities, or just want to connect, I'd love to hear from you.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <motion.a
                href="mailto:jasondank@yahoo.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-4 p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-green-500/50 transition-all duration-300 group"
              >
                <div className="p-3 bg-green-500/20 rounded-lg text-green-400 group-hover:bg-green-500/30 transition-colors duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">Email</h4>
                  <p className="text-gray-400 group-hover:text-green-400 transition-colors duration-300">
                    jasondank@yahoo.com
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-green-400 ml-auto transition-colors duration-300" />
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/jason-dank"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-4 p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">LinkedIn</h4>
                  <p className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                    Connect with me professionally
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 ml-auto transition-colors duration-300" />
              </motion.a>

              <motion.a
                href="https://github.com/jdank417"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-4 p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">GitHub</h4>
                  <p className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300">
                    View my code and projects
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 ml-auto transition-colors duration-300" />
              </motion.a>
            </div>

            {/* Quick Info */}
            <div className="pt-8 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Location</h4>
                  <p className="text-gray-400">Boston</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Status</h4>
                  <p className="text-blue-400">Employed at Fidelity</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors duration-300"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors duration-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-colors duration-300 resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-semibold text-lg rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/25"
              >
                Send Message
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-20 pt-12 border-t border-gray-800"
        >
          <p className="text-gray-400 mb-4">
            © 2024 Jason Dank. Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
          <p className="text-gray-500 text-sm">
            Designed and developed with attention to detail and a focus on user experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}