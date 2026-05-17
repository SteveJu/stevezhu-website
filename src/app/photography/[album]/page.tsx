import { notFound } from 'next/navigation';
import AlbumClient from '@/components/AlbumClient';

interface AlbumPageProps {
  params: Promise<{ album: string }>;
}

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
    ],
  },
  'central-park': {
    title: 'Central Park',
    subtitle: 'Autumn Session',
    photos: [
      'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    ],
  },
};

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { album: albumSlug } = await params;
  const album = albumsData[albumSlug];

  if (!album) {
    notFound();
  }

  return <AlbumClient album={album} />;
}
