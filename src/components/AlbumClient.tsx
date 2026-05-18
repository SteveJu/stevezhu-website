'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Lightbox from '@/components/ui/Lightbox';

interface AlbumClientProps {
  album: {
    title: string;
    subtitle: string;
    description: string;
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
    <main className="photo-album-page">
      <div className="photo-album-shell">
        <nav className="photo-album-nav" aria-label="Photography navigation">
          <Link href="/">返回主页</Link>
          <Link href="/#photography">Photography</Link>
        </nav>

        <div className="photo-album-hero">
          <div>
            <p>Photo Album</p>
            <h1>{album.title}</h1>
          </div>
          <div>
            {album.subtitle && <strong>{album.subtitle}</strong>}
            {album.description && <span>{album.description}</span>}
            <small>{album.photos.length} photos</small>
          </div>
        </div>

        {album.photos.length > 0 ? (
          <div className="photo-album-grid">
            {album.photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                className="photo-album-tile"
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
        ) : (
          <div className="photo-album-empty">
            <span>No photos published yet</span>
          </div>
        )}

        <Lightbox
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          images={album.photos}
          currentIndex={currentImageIndex}
          onNext={nextImage}
          onPrev={prevImage}
        />
      </div>
    </main>
  );
};

export default AlbumClient;
