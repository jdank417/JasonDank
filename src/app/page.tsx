import Hero from '@/components/sections/Hero';
import Work from '@/components/sections/Work';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Leadership from '@/components/sections/Leadership';
import Certifications from '@/components/sections/Certifications';
import Recommendations from '@/components/sections/Recommendations';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Work />
      <About />
      <Experience />
      <Leadership />
      <Certifications />
      <Recommendations />
      <Contact />
    </main>
  );
}
