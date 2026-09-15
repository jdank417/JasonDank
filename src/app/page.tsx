import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Work from '@/components/sections/Work';
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
      <Experience />
      <Work />
      <Certifications />
      <Education />
      <Skills />
      <Recommendations />
      <Contact />
    </main>
  );
}
