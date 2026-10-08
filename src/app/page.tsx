import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Work from '@/components/sections/Work';
import Projects from '@/components/sections/Projects';
import Certifications from '@/components/sections/Certifications';
import Education from '@/components/sections/Education';
import Skills from '@/components/sections/Skills';
import Recommendations from '@/components/sections/Recommendations';
import Contact from '@/components/sections/Contact';
import LatitudeRuler from '@/components/LatitudeRuler';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '@/data/site';

// Who this page is about, for search engines (schema.org Person).
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jason Dank',
  url: 'https://jasondank.com',
  image: 'https://jasondank.com/opengraph-image.png',
  jobTitle: 'Full Stack Software Engineer',
  worksFor: { '@type': 'Organization', name: 'Fidelity Investments' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Wentworth Institute of Technology' },
  address: { '@type': 'PostalAddress', addressLocality: 'Boston', addressRegion: 'MA', addressCountry: 'US' },
  email: `mailto:${EMAIL}`,
  sameAs: [GITHUB_URL, LINKEDIN_URL],
  knowsAbout: ['Full-stack development', 'Fintech', 'Private markets', 'Machine learning', 'Sailing'],
};

export default function Home() {
  return (
    <main id="main" className="min-h-screen">
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here: it's our own static object.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }}
      />
      <LatitudeRuler />
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
