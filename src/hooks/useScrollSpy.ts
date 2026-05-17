'use client';

import { useEffect, useState } from 'react';

export const useScrollSpy = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const scrollRoot = document.querySelector('[data-scroll-container]');
    const sections = sectionIds
      .map((id) => document.querySelector(`[data-section="${id}"]`))
      .filter((section): section is Element => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const id = visibleSection?.target.getAttribute('data-section');
        if (id) setActiveSection(id);
      },
      {
        root: scrollRoot,
        threshold: [0.45, 0.6, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
};
