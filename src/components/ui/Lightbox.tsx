'use client';

import Image from 'next/image';
import { useEffect } from 'react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox = ({ isOpen, onClose, images, currentIndex, onNext, onPrev }: LightboxProps) => {
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
        <Image
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          fill
          sizes="100vw"
          unoptimized
          className="object-contain"
        />
      </div>

      <div className="photo-lightbox-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default Lightbox;
