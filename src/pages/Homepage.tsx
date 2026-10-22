import Hero from '../components/homepage/Hero';
import About from '../components/homepage/About';
import Collaborations from '../components/homepage/Collaborations';
import MissionBanner from '../components/homepage/MissionBanner';
import CtaSection from '../components/homepage/CtaSection';

/**
 * Homepage — renders the five homepage sections in order inside a
 * centered, contained column over the mat backdrop.
 */
export default function Homepage() {
  return (
    <div style={{ background: 'var(--mat)' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'var(--mat)',
        }}
      >
        <Hero />
        <About />
        <Collaborations />
        <MissionBanner />
        <CtaSection />
      </div>
    </div>
  );
}
