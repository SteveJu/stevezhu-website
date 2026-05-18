'use client';

import { useEffect, useState } from 'react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

interface LightboxImageProps {
  src: string;
  alt: string;
}

const LightboxImage = ({ src, alt }: LightboxImageProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <>
      {imageState === 'loading' && (
        <div className="photo-lightbox-status">Loading original image</div>
      )}
      {imageState === 'error' && (
        <div className="photo-lightbox-status is-error">
          <span>Image could not be loaded.</span>
          <a href={src} target="_blank" rel="noreferrer">Open original</a>
        </div>
      )}
      {/* Use the exact R2 object URL here so the lightbox never routes through image optimization. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="photo-lightbox-img"
        decoding="async"
        loading="eager"
        onLoad={() => setImageState('loaded')}
        onError={() => setImageState('error')}
      />
    </>
  );
};

const Lightbox = ({ isOpen, onClose, images, currentIndex, onNext, onPrev }: LightboxProps) => {
  const activeImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent scroll when lightbox is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div className="photo-lightbox">
      <button onClick={onClose} className="photo-lightbox-close" aria-label="Close photo">
        ✕
      </button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className="photo-lightbox-nav is-prev"
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      {/* Next button */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={onNext}
          className="photo-lightbox-nav is-next"
          aria-label="Next photo"
        >
          ›
        </button>
      )}

      <div className="photo-lightbox-image">
        <LightboxImage
          key={activeImage}
          src={activeImage}
          alt={`Photo ${currentIndex + 1}`}
        />
      </div>

      <div className="photo-lightbox-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default Lightbox;
