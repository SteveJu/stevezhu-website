'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { PhotoAlbumRecord, PhotographyPayload, PhotoRecord } from '@/lib/photographyState';

const emptyPayload: PhotographyPayload = {
  albums: [],
  photos: [],
};

const createId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const createSlug = (value: string) => {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `album-${Date.now()}`;
};

const sortByOrder = <T extends { sortOrder: number; createdAt: string }>(items: T[]) => {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder || left.createdAt.localeCompare(right.createdAt));
};

const PhotographyManager = () => {
  const [payload, setPayload] = useState<PhotographyPayload>(emptyPayload);
  const [activeAlbumId, setActiveAlbumId] = useState('');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState<'loading' | 'saved' | 'saving' | 'error'>('loading');
  const [uploadStatus, setUploadStatus] = useState('');

  const activeAlbum = payload.albums.find((album) => album.id === activeAlbumId) ?? payload.albums[0];
  const activePhotos = useMemo(() => {
    if (!activeAlbum) return [];
    return sortByOrder(payload.photos.filter((photo) => photo.albumId === activeAlbum.id));
  }, [activeAlbum, payload.photos]);

  useEffect(() => {
    let isMounted = true;

    const loadPhotography = async () => {
      try {
        const response = await fetch('/api/photography', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load photography.');

        const result = (await response.json()) as { payload?: PhotographyPayload };
        if (!isMounted) return;

        const nextPayload = result.payload ?? emptyPayload;
        setPayload(nextPayload);
        setActiveAlbumId(nextPayload.albums[0]?.id ?? '');
        setSaveStatus('saved');
      } catch {
        if (isMounted) setSaveStatus('error');
      }
    };

    void loadPhotography();

    return () => {
      isMounted = false;
    };
  }, []);

  const savePayload = async (nextPayload: PhotographyPayload) => {
    setPayload(nextPayload);
    setSaveStatus('saving');

    try {
      const response = await fetch('/api/photography', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: nextPayload }),
      });

      setSaveStatus(response.ok ? 'saved' : 'error');
      return response.ok;
    } catch {
      setSaveStatus('error');
      return false;
    }
  };

  const getResponseError = async (response: Response) => {
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    return result?.error || `${response.status} ${response.statusText}`;
  };

  const createAlbum = () => {
    const title = newAlbumTitle.trim();
    if (!title) return;

    const now = new Date().toISOString();
    const album: PhotoAlbumRecord = {
      id: createId('album'),
      slug: createSlug(title),
      title,
      subtitle: '',
      description: '',
      sortOrder: payload.albums.length,
      isPublished: true,
      createdAt: now,
    };
    const nextPayload = {
      ...payload,
      albums: [...payload.albums, album],
    };

    setNewAlbumTitle('');
    setActiveAlbumId(album.id);
    void savePayload(nextPayload);
  };

  const updateAlbum = (albumId: string, updates: Partial<PhotoAlbumRecord>) => {
    void savePayload({
      ...payload,
      albums: payload.albums.map((album) => (album.id === albumId ? { ...album, ...updates } : album)),
    });
  };

  const deleteAlbum = (albumId: string) => {
    const albumPhotos = payload.photos.filter((photo) => photo.albumId === albumId);
    const nextPayload = {
      albums: payload.albums.filter((album) => album.id !== albumId),
      photos: payload.photos.filter((photo) => photo.albumId !== albumId),
    };

    void Promise.all(albumPhotos.map((photo) => deletePhotoFile(photo.storageKey)));
    setActiveAlbumId(nextPayload.albums[0]?.id ?? '');
    void savePayload(nextPayload);
  };

  const deletePhotoFile = async (storageKey: string) => {
    await fetch('/api/photography/file', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storageKey }),
    }).catch(() => undefined);
  };

  const uploadPhoto = async (file: File) => {
    if (!activeAlbum) return;
    if (file.size > 100 * 1024 * 1024) {
      setUploadStatus('图片不能超过 100MB');
      return;
    }

    setUploadStatus('正在上传');

    try {
      const uploadResponse = await fetch('/api/photography/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          albumSlug: activeAlbum.slug,
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error(`生成上传链接失败：${await getResponseError(uploadResponse)}`);
      }

      const upload = (await uploadResponse.json()) as { uploadUrl: string; publicUrl: string; storageKey: string };
      const r2Response = await fetch(upload.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!r2Response.ok) {
        throw new Error(`上传到 R2 失败：${r2Response.status} ${r2Response.statusText}`);
      }

      const now = new Date().toISOString();
      const photo: PhotoRecord = {
        id: createId('photo'),
        albumId: activeAlbum.id,
        title: file.name.replace(/\.[^.]+$/, ''),
        caption: '',
        url: upload.publicUrl,
        storageKey: upload.storageKey,
        sortOrder: activePhotos.length,
        isPublished: true,
        createdAt: now,
      };

      const isSaved = await savePayload({
        ...payload,
        photos: [...payload.photos, photo],
      });

      if (!isSaved) {
        setUploadStatus('照片已上传到 R2，但保存到数据库失败');
        return;
      }

      setUploadStatus('已上传');
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : '上传失败');
    }
  };

  const deletePhoto = (photoId: string) => {
    const photo = payload.photos.find((currentPhoto) => currentPhoto.id === photoId);
    if (photo) {
      void deletePhotoFile(photo.storageKey);
    }

    void savePayload({
      ...payload,
      photos: payload.photos.filter((photo) => photo.id !== photoId),
    });
  };

  return (
    <div className="photo-manager">
      <div className="photo-manager-toolbar">
        <div>
          <p className="travel-panel-label">保存状态</p>
          <strong>{saveStatus === 'loading' ? '加载中' : saveStatus === 'saving' ? '保存中' : saveStatus === 'saved' ? '已保存' : '保存失败'}</strong>
        </div>
        <div className="photo-manager-create">
          <input
            value={newAlbumTitle}
            onChange={(event) => setNewAlbumTitle(event.target.value)}
            placeholder="新建 album 名称"
          />
          <button type="button" onClick={createAlbum}>新建 Album</button>
        </div>
      </div>

      <div className="photo-manager-grid">
        <aside className="theme-card photo-album-list">
          {sortByOrder(payload.albums).map((album) => (
            <button
              key={album.id}
              type="button"
              className={album.id === activeAlbum?.id ? 'is-active' : ''}
              onClick={() => setActiveAlbumId(album.id)}
            >
              <span>{album.isPublished ? 'Published' : 'Hidden'}</span>
              <strong>{album.title}</strong>
              <small>{payload.photos.filter((photo) => photo.albumId === album.id).length} photos</small>
            </button>
          ))}
        </aside>

        <section className="theme-card photo-editor-panel">
          {activeAlbum ? (
            <>
              <div className="photo-editor-fields">
                <label>
                  <span>Title</span>
                  <input value={activeAlbum.title} onChange={(event) => updateAlbum(activeAlbum.id, { title: event.target.value })} />
                </label>
                <label>
                  <span>Subtitle</span>
                  <input value={activeAlbum.subtitle} onChange={(event) => updateAlbum(activeAlbum.id, { subtitle: event.target.value })} />
                </label>
                <label>
                  <span>Slug</span>
                  <input value={activeAlbum.slug} onChange={(event) => updateAlbum(activeAlbum.id, { slug: createSlug(event.target.value) })} />
                </label>
                <label className="photo-manager-checkbox">
                  <input
                    type="checkbox"
                    checked={activeAlbum.isPublished}
                    onChange={(event) => updateAlbum(activeAlbum.id, { isPublished: event.target.checked })}
                  />
                  <span>显示在主页</span>
                </label>
              </div>

              <div className="photo-upload-row">
                <label className="travel-ai-fill-button">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = '';
                      if (file) void uploadPhoto(file);
                    }}
                  />
                  <span>上传照片</span>
                </label>
                {uploadStatus && <p>{uploadStatus}</p>}
                <button type="button" className="travel-secondary-button" onClick={() => deleteAlbum(activeAlbum.id)}>
                  删除 Album
                </button>
              </div>

              <div className="photo-manager-photos">
                {activePhotos.map((photo) => (
                  <article key={photo.id}>
                    <div className="photo-manager-thumb">
                      <Image src={photo.url} alt={photo.title} fill sizes="10rem" unoptimized />
                    </div>
                    <div>
                      <input
                        value={photo.title}
                        onChange={(event) =>
                          savePayload({
                            ...payload,
                            photos: payload.photos.map((currentPhoto) =>
                              currentPhoto.id === photo.id ? { ...currentPhoto, title: event.target.value } : currentPhoto,
                            ),
                          })
                        }
                      />
                      <button type="button" onClick={() => deletePhoto(photo.id)}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="travel-timeline-empty">
              <span>还没有 album</span>
              <p>先在上方新建一个 album。</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PhotographyManager;
