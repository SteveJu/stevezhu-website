'use client';

import Particles from '@/components/effects/Particles';

const Hero = () => {
  return (
    <section data-section="0" className="theme-section theme-hero relative min-h-screen flex items-center justify-center snap-start overflow-hidden px-6">
      <Particles />
      <div className="theme-scan" />
      <div className="sketch-lines" aria-hidden="true">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path d="M80 160 C180 70 300 110 390 180 S590 260 720 150 S890 90 950 210" />
          <path d="M60 470 C220 385 360 500 515 410 S770 315 945 430" />
          <circle cx="820" cy="210" r="58" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="theme-kicker mb-6">
          <span>Steve Zhu</span>
          <span className="theme-mode-copy">Auto mode</span>
        </div>

        <h1 className="theme-title max-w-5xl">
          AI Product Engineer.
          <span> Software Engineer.</span>
        </h1>

        <div className="theme-actions flex flex-wrap gap-3 mt-10">
          {[
            { name: 'About', section: 1 },
            { name: 'Experience', section: 2 },
            { name: 'Education', section: 3 },
            { name: 'Skills', section: 4 },
            { name: 'Photography', section: 5 },
            { name: 'Contact', section: 6 }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                const section = document.querySelector(`[data-section="${item.section}"]`);
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="theme-button"
            >
              {item.name}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;
