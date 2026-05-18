'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface AlbumClientProps {
  album: {
    title: string;
    subtitle: string;
    description: string;
    photos: string[];
  };
}

const AlbumClient = ({ album }: AlbumClientProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const selectedPhoto = album.photos[currentImageIndex];
  const photoCount = album.photos.length;

  const goPrev = () => setCurrentImageIndex((index) => (index > 0 ? index - 1 : photoCount - 1));
  const goNext = () => setCurrentImageIndex((index) => (index < photoCount - 1 ? index + 1 : 0));

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
          <section className="photo-album-viewer" aria-label={`${album.title} photos`}>
            <div className="photo-album-info">
              <span>Selected Frame</span>
              <strong>
                {String(currentImageIndex + 1).padStart(2, '0')}
                <small>/ {String(photoCount).padStart(2, '0')}</small>
              </strong>
              <div className="photo-album-actions" aria-label="Photo navigation">
                <button type="button" onClick={goPrev}>Prev</button>
                <button type="button" onClick={goNext}>Next</button>
              </div>
              {selectedPhoto && (
                <a href={selectedPhoto} target="_blank" rel="noreferrer">Open original</a>
              )}
            </div>

            <div className="photo-album-feature">
              {selectedPhoto && (
                <Image
                  key={selectedPhoto}
                  src={selectedPhoto}
                  alt={`${album.title} photo ${currentImageIndex + 1}`}
                  fill
                  sizes="(min-width: 1024px) 72vw, 100vw"
                  priority
                  unoptimized
                  className="object-contain"
                />
              )}
            </div>

            <div className="photo-album-strip" role="list" aria-label="Select photo">
              {album.photos.map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  className={`photo-album-thumb ${index === currentImageIndex ? 'is-active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Show ${album.title} photo ${index + 1}`}
                  aria-pressed={index === currentImageIndex}
                >
                  <Image
                    src={photo}
                    alt={`${album.title} thumbnail ${index + 1}`}
                    fill
                    sizes="8rem"
                    unoptimized
                    className="object-cover"
                  />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <div className="photo-album-empty">
            <span>No photos published yet</span>
          </div>
        )}
      </div>
    </main>
  );
};

export default AlbumClient;
