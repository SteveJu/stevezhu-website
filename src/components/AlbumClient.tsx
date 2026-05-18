'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from '@/components/ui/Lightbox';

interface AlbumClientProps {
  album: {
    title: string;
    subtitle: string;
    photos: string[];
  };
}

const AlbumClient = ({ album }: AlbumClientProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < album.photos.length - 1 ? prev + 1 : prev
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-light mb-4">{album.title}</h1>
          <p className="text-xl text-gray-400">{album.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {album.photos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
              onClick={() => openLightbox(index)}
              aria-label={`Open ${album.title} photo ${index + 1}`}
            >
              <Image
                src={photo}
                alt={`${album.title} photo ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                unoptimized
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </button>
          ))}
        </div>

        <Lightbox
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          images={album.photos}
          currentIndex={currentImageIndex}
          onNext={nextImage}
          onPrev={prevImage}
        />
      </div>
    </div>
  );
};

export default AlbumClient;
