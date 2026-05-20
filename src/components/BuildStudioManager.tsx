'use client';

import { useEffect, useState } from 'react';
import type { BuildStudioInquiry } from '@/lib/buildStudioInquiries';

const statusLabels: Record<BuildStudioInquiry['status'], string> = {
  new: 'New',
  estimating: 'Estimating',
  accepted: 'Accepted',
  declined: 'Declined',
  shipped: 'Shipped',
};

const BuildStudioManager = () => {
  const [inquiries, setInquiries] = useState<BuildStudioInquiry[]>([]);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const response = await fetch('/api/build-studio/inquiries', {
          cache: 'no-store',
          credentials: 'same-origin',
        });

        if (!response.ok) throw new Error('Failed to load inquiries.');

        const result = (await response.json()) as { inquiries?: BuildStudioInquiry[] };
        setInquiries(result.inquiries ?? []);
        setLoadStatus('ready');
      } catch {
        setLoadStatus('error');
      }
    };

    void loadInquiries();
  }, []);

  return (
    <div className="build-studio-manager">
      <div className="photo-manager-toolbar">
        <div>
          <p className="travel-panel-label">Pipeline</p>
          <strong>{loadStatus === 'loading' ? 'Loading' : `${inquiries.length} inquiries`}</strong>
        </div>
      </div>

      {loadStatus === 'error' && (
        <div className="theme-card owner-placeholder-card">
          <p className="build-studio-status is-error">Run the Build Studio Supabase SQL before using this dashboard.</p>
        </div>
      )}

      {loadStatus === 'ready' && inquiries.length === 0 && (
        <div className="theme-card owner-placeholder-card">
          <p className="theme-copy">No inquiries yet.</p>
        </div>
      )}

      {inquiries.length > 0 && (
        <div className="build-studio-manager-list">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="theme-card build-studio-manager-card">
              <div className="build-studio-manager-card-head">
                <div>
                  <span>{statusLabels[inquiry.status]}</span>
                  <strong>{inquiry.name}</strong>
                  <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                </div>
                <time>{new Date(inquiry.createdAt).toLocaleString()}</time>
              </div>
              <div className="build-studio-manager-meta">
                <span>{inquiry.projectType || 'No type'}</span>
                <span>{inquiry.budgetRange || 'No budget'}</span>
                <span>{inquiry.timeline || 'Flexible'}</span>
                <span>{inquiry.needsDeployment ? 'Deploy' : 'No deploy'}</span>
              </div>
              <p>{inquiry.description}</p>
              {inquiry.referenceLinks && <pre>{inquiry.referenceLinks}</pre>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuildStudioManager;
