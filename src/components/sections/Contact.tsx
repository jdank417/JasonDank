'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

const contactLinks = [
  {
    label: 'Email',
    value: 'jasondank@yahoo.com',
    href: 'mailto:jasondank@yahoo.com',
    icon: <Mail className="h-5 w-5" />
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/jason-dank',
    href: 'https://www.linkedin.com/in/jason-dank',
    icon: <Linkedin className="h-5 w-5" />
  },
  {
    label: 'GitHub',
    value: 'github.com/jdank417',
    href: 'https://github.com/jdank417',
    icon: <Github className="h-5 w-5" />
  }
];

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#05070f] px-6 py-24 sm:px-8 lg:px-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_25%,rgba(20,220,255,0.12)_0%,transparent_28%),radial-gradient(circle_at_20%_80%,rgba(84,99,255,0.16)_0%,transparent_32%)]" />

      <div className="mx-auto max-w-5xl rounded-3xl border border-white/15 bg-slate-950/60 p-8 backdrop-blur sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Contact</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Let’s build something meaningful.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Open to software engineering opportunities, consulting projects, and collaborations across product, automation, and
            systems engineering.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {contactLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-300/50"
            >
              <div className="flex items-center gap-2 text-cyan-200">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              <p className="mt-3 text-slate-200">{item.value}</p>
            </a>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <MapPin className="h-4 w-4" />
          Boston, Massachusetts
        </div>
      </div>
    </section>
  );
}
