import { notFound } from 'next/navigation';
import AlbumClient from '@/components/AlbumClient';
import { loadPhotographyPayload } from '@/lib/photographyState';

interface AlbumPageProps {
  params: Promise<{ album: string }>;
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { album: albumSlug } = await params;
  const payload = await loadPhotographyPayload();
  const album = payload.albums.find((candidate) => candidate.slug === albumSlug && candidate.isPublished);

  if (!album) {
    notFound();
  }

  const photos = payload.photos
    .filter((photo) => photo.albumId === album.id && photo.isPublished)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.createdAt.localeCompare(right.createdAt));

  return (
    <AlbumClient
      album={{
        title: album.title,
        subtitle: album.subtitle,
        photos: photos.map((photo) => photo.url),
      }}
    />
  );
}
