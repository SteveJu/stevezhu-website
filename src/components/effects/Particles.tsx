'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      const particleCount = Math.min(28, Math.floor(window.innerWidth / 48));
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
    };

    const startAnimation = () => {
      if (animationRef.current === undefined && !document.hidden && isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      animationRef.current = undefined;

      if (document.hidden || !isVisibleRef.current) {
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.y > window.innerHeight) particle.y = 0;
        if (particle.y < 0) particle.y = window.innerHeight;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      startAnimation();
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resizeCanvas();
      return;
    }

    resizeCanvas();
    createParticles();
    startAnimation();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    const handleVisibilityChange = () => {
      startAnimation();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = Boolean(entry?.isIntersecting);
        startAnimation();
      },
      { threshold: 0 },
    );

    observer.observe(canvas);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default Particles;
