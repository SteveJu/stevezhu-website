'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { PhotographyPayload } from '@/lib/photographyState';

const emptyPayload: PhotographyPayload = {
  albums: [],
  photos: [],
};

const Photography = () => {
  const [payload, setPayload] = useState<PhotographyPayload>(emptyPayload);

  useEffect(() => {
    const loadPhotography = async () => {
      const response = await fetch('/api/photography', { cache: 'no-store' });
      if (!response.ok) return;

      const result = (await response.json()) as { payload?: PhotographyPayload };
      setPayload(result.payload ?? emptyPayload);
    };

    void loadPhotography();
  }, []);

  const albums = useMemo(() => {
    return payload.albums
      .filter((album) => album.isPublished)
      .sort((left, right) => left.sortOrder - right.sortOrder || left.createdAt.localeCompare(right.createdAt))
      .map((album) => {
        const photos = payload.photos.filter((photo) => photo.albumId === album.id && photo.isPublished);
        const cover = photos.sort((left, right) => left.sortOrder - right.sortOrder)[0];

        return {
          ...album,
          count: `${photos.length} photos`,
          cover: cover?.url,
        };
      })
      .filter((album) => album.cover);
  }, [payload]);

  return (
    <section id="photography" data-section="5" className="theme-section min-h-screen py-20 snap-start">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="theme-kicker mb-4">Frames</p>
          <h2 className="theme-heading">
            Photography
          </h2>
          <p className="theme-copy text-xl max-w-2xl mx-auto mt-4">
            Capturing moments, telling stories through the lens
          </p>
        </div>

        {albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Link key={album.id} href={`/photography/${album.slug}`}>
              <div className="theme-photo-card group relative aspect-[4/3] overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
              >
              <Image
                src={album.cover}
                alt={`${album.title} cover`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-light text-white mb-2">
                  {album.title}
                </h3>
                <p className="text-gray-300 text-lg mb-1">
                  {album.subtitle}
                </p>
                <p className="text-gray-400 text-sm">
                  {album.count}
                </p>
              </div>

              <div className="absolute inset-0 border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
            ))}
          </div>
        ) : (
          <div className="theme-card travel-empty-state">
            <span>No published albums</span>
            <h2>Photography is being curated</h2>
            <p>Published albums from owner mode will appear here automatically.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Photography;
