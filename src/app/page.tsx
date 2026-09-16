import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Work from '@/components/sections/Work';
import Projects from '@/components/sections/Projects';
import Certifications from '@/components/sections/Certifications';
import Education from '@/components/sections/Education';
import Skills from '@/components/sections/Skills';
import Recommendations from '@/components/sections/Recommendations';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main id="main" className="min-h-screen">
      <Hero />
      <About />
      <Work />
      <Projects />
      <Certifications />
      <Education />
      <Skills />
      <Recommendations />
      <Contact />
    </main>
  );
}
