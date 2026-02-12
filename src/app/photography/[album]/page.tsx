'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';
import Lightbox from '@/components/ui/Lightbox';

interface AlbumPageProps {
  params: { album: string };
}

// Sample album data - will be replaced with real data
const albumsData: Record<string, {
  title: string;
  subtitle: string;
  photos: string[];
}> = {
  'nyc-friends': {
    title: 'NYC Friends',
    subtitle: 'Portrait Collection',
    photos: [
      'https://images.unsplash.com/photo-1539571696267-84afb9a8772f?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1494790108755-2616c6c66e3f?w=800',
    ]
  },
  'central-park': {
    title: 'Central Park',
    subtitle: 'Autumn Session', 
    photos: [
      'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    ]
  }
};

export default function AlbumPage({ params }: AlbumPageProps) {
  const album = albumsData[params.album];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!album) {
    notFound();
  }

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
    setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : prev);
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
            <div 
              key={index} 
              className="aspect-square overflow-hidden rounded-lg cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <img 
                src={photo}
                alt={`${album.title} photo ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
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
}