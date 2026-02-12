'use client';

import { useEffect, useState } from 'react';

export const useScrollSpy = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionIds.map(id => ({
        id,
        element: document.querySelector(`[data-section="${id}"]`),
      }));

      const scrollY = window.scrollY + 100; // Offset for navbar

      let current = '';
      sections.forEach(({ id, element }) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          
          if (scrollY >= top) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
};