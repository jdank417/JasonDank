import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Experience from '@/components/sections/Experience';
import Hero from '@/components/sections/Hero';
import Work from '@/components/sections/Work';

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' }
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070f]/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <a href="#" className="text-sm font-semibold uppercase tracking-[0.35em] text-white">
            JD
          </a>
          <ul className="flex items-center gap-5 text-sm text-slate-300">
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="transition hover:text-cyan-200">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="min-h-screen">
        <Hero />
        <Work />
        <About />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
