'use client';

import { useScrollSpy } from '@/hooks/useScrollSpy';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import SiteModeToggle from './SiteModeToggle';

const navItems = [
  { name: 'About', section: 1 },
  { name: 'Experience', section: 2 },
  { name: 'Education', section: 3 },
  { name: 'Skills', section: 4 },
  { name: 'Photography', section: 5 },
  { name: 'Contact', section: 6 }
];
const sectionIds = ['1', '2', '3', '4', '5', '6'];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSection = useScrollSpy(sectionIds);

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

  const scrollToTop = () => {
    const section = document.querySelector('[data-section="0"]');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`theme-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'is-scrolled' : ''
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center cursor-pointer"
          aria-label="Back to top"
        >
          <Image
            src="/Logo.PNG"
            alt="Steve Zhu signature"
            width={209}
            height={65}
            priority
            className="theme-logo h-10 w-auto object-contain"
          />
        </button>

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

          <SiteModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
