'use client';

import { useEffect, useState } from 'react';
import type { BuildStudioInquiry, BuildStudioInquiryPriority, BuildStudioInquiryStatus } from '@/lib/buildStudioInquiries';

const statusLabels: Record<BuildStudioInquiryStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  quoted: 'Quoted',
  negotiating: 'Negotiating',
  accepted: 'Accepted',
  building: 'Building',
  shipped: 'Shipped',
  archived: 'Archived',
  declined: 'Declined',
};

const priorityLabels: Record<BuildStudioInquiryPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
};

type InquiryDraft = Pick<BuildStudioInquiry, 'status' | 'priority' | 'ownerNotes' | 'quotedPrice' | 'estimatedMonthlyCost' | 'estimatedHours'>;

const createDraft = (inquiry: BuildStudioInquiry): InquiryDraft => ({
  status: inquiry.status,
  priority: inquiry.priority,
  ownerNotes: inquiry.ownerNotes,
  quotedPrice: inquiry.quotedPrice,
  estimatedMonthlyCost: inquiry.estimatedMonthlyCost,
  estimatedHours: inquiry.estimatedHours,
});

const BuildStudioManager = () => {
  const [inquiries, setInquiries] = useState<BuildStudioInquiry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, InquiryDraft>>({});
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [savingId, setSavingId] = useState('');

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        const response = await fetch('/api/build-studio/inquiries', {
          cache: 'no-store',
          credentials: 'same-origin',
        });

        if (!response.ok) throw new Error('Failed to load inquiries.');

        const result = (await response.json()) as { inquiries?: BuildStudioInquiry[] };
        const nextInquiries = result.inquiries ?? [];
        setInquiries(nextInquiries);
        setDrafts(Object.fromEntries(nextInquiries.map((inquiry) => [inquiry.id, createDraft(inquiry)])));
        setLoadStatus('ready');
      } catch {
        setLoadStatus('error');
      }
    };

    void loadInquiries();
  }, []);

  const updateDraft = <Key extends keyof InquiryDraft>(id: string, key: Key, value: InquiryDraft[Key]) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [key]: value,
      },
    }));
  };

  const saveInquiry = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;

    setSavingId(id);

    try {
      const response = await fetch('/api/build-studio/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id, update: draft }),
      });

      if (!response.ok) throw new Error('Failed to update inquiry.');

      const result = (await response.json()) as { inquiry?: BuildStudioInquiry };
      if (result.inquiry) {
        setInquiries((current) => current.map((inquiry) => (inquiry.id === id ? result.inquiry as BuildStudioInquiry : inquiry)));
        setDrafts((current) => ({ ...current, [id]: createDraft(result.inquiry as BuildStudioInquiry) }));
      }
    } finally {
      setSavingId('');
    }
  };

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
                  <p>{inquiry.contactMethods}</p>
                </div>
                <time>{new Date(inquiry.createdAt).toLocaleString()}</time>
              </div>
              <div className="build-studio-manager-meta">
                <span>{inquiry.productFormat || 'No format'}</span>
                <span>{inquiry.platforms || 'No platform'}</span>
                <span>{inquiry.timeline || 'Flexible'}</span>
                <span>DAU {inquiry.audienceSizeDau || '?'}</span>
                <span>MAU {inquiry.audienceSizeMau || '?'}</span>
                <span>Monthly {inquiry.monthlySpend || '?'}</span>
                <span>Max {inquiry.maxBudget || '?'}</span>
              </div>
              <div className="build-studio-manager-copy">
                <p>{inquiry.description}</p>
                <p>{inquiry.featureScope}</p>
              </div>
              {inquiry.referenceLinks && <pre>{inquiry.referenceLinks}</pre>}
              {drafts[inquiry.id] && (
                <div className="build-studio-manager-controls">
                  <label>
                    <span>Status</span>
                    <select
                      value={drafts[inquiry.id].status}
                      onChange={(event) => updateDraft(inquiry.id, 'status', event.target.value as BuildStudioInquiryStatus)}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Priority</span>
                    <select
                      value={drafts[inquiry.id].priority}
                      onChange={(event) => updateDraft(inquiry.id, 'priority', event.target.value as BuildStudioInquiryPriority)}
                    >
                      {Object.entries(priorityLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Quoted price</span>
                    <input value={drafts[inquiry.id].quotedPrice} onChange={(event) => updateDraft(inquiry.id, 'quotedPrice', event.target.value)} />
                  </label>
                  <label>
                    <span>Monthly cost</span>
                    <input value={drafts[inquiry.id].estimatedMonthlyCost} onChange={(event) => updateDraft(inquiry.id, 'estimatedMonthlyCost', event.target.value)} />
                  </label>
                  <label>
                    <span>Hours</span>
                    <input value={drafts[inquiry.id].estimatedHours} onChange={(event) => updateDraft(inquiry.id, 'estimatedHours', event.target.value)} />
                  </label>
                  <label className="is-wide">
                    <span>Owner notes</span>
                    <textarea value={drafts[inquiry.id].ownerNotes} onChange={(event) => updateDraft(inquiry.id, 'ownerNotes', event.target.value)} rows={4} />
                  </label>
                  <button type="button" onClick={() => void saveInquiry(inquiry.id)} disabled={savingId === inquiry.id}>
                    {savingId === inquiry.id ? 'Saving' : 'Save'}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuildStudioManager;
