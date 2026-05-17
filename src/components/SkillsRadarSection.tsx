'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const SkillsRadar = dynamic(() => import('./SkillsRadar'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-900 rounded-lg" aria-hidden="true" />,
});

const SkillsRadarSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto">
      {shouldLoad ? <SkillsRadar /> : <div className="h-96 bg-gray-900 rounded-lg" aria-hidden="true" />}
    </div>
  );
};

export default SkillsRadarSection;
