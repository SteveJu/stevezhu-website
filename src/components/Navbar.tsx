'use client';

import { useSiteMode } from '@/contexts/SiteModeContext';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'About', section: 1 },
  { name: 'Experience', section: 2 },
  { name: 'Photography', section: 3 },
  { name: 'Contact', section: 4 }
];
const sectionIds = ['1', '2', '3', '4'];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { mode, isManual, toggleMode } = useSiteMode();
  const activeSection = useScrollSpy(sectionIds);
  const nextMode = mode === 'cyber' ? 'sketch' : 'cyber';

  useEffect(() => {
    const scrollRoot = document.querySelector('[data-scroll-container]');
    if (!scrollRoot) return;

    const handleScroll = () => {
      setIsScrolled(scrollRoot.scrollTop > 50);
    };

    scrollRoot.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => scrollRoot.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`theme-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'is-scrolled' : ''
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/Logo.PNG"
            alt="Steve Zhu signature"
            width={209}
            height={65}
            priority
            className="theme-logo h-10 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex space-x-8 text-sm">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  const section = document.querySelector(`[data-section="${item.section}"]`);
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`theme-nav-link transition-colors duration-200 ${
                  activeSection === item.section.toString()
                    ? 'is-active font-medium'
                    : ''
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleMode}
            className="theme-mode-toggle"
            aria-label={`Switch to ${nextMode} mode`}
            title={`Switch to ${nextMode} mode`}
          >
            <span className="theme-mode-toggle-dot" />
            <span>{mode}</span>
            {isManual && <span className="theme-mode-toggle-mark">manual</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
