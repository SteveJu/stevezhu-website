'use client';

import { useEffect, useState } from 'react';

export const useSectionScroll = () => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = document.querySelectorAll('[data-section]');
          const scrollY = window.scrollY;
          const viewportHeight = window.innerHeight;
          
          sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            
            if (Math.abs(sectionCenter - viewportHeight / 2) < viewportHeight / 4) {
              setCurrentSection(index);
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionIndex: number) => {
    const section = document.querySelector(`[data-section="${sectionIndex}"]`);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  return { currentSection, scrollToSection };
};