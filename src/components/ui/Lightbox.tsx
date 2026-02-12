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
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
      >
        ✕
      </button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className="absolute left-4 text-white text-3xl hover:text-gray-300"
        >
          ‹
        </button>
      )}

      {/* Next button */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 text-white text-3xl hover:text-gray-300"
        >
          ›
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <img
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default Lightbox;