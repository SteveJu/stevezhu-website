'use client';

import { useEffect, useState } from 'react';
import { checkOwnerStatus } from './OwnerAccess';
import type { BuildStudioInquiry } from '@/lib/buildStudioInquiries';

type FormState = {
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  needsDeployment: boolean;
  description: string;
  referenceLinks: string;
};

const emptyForm: FormState = {
  name: '',
  email: '',
  projectType: '',
  budgetRange: '',
  timeline: '',
  needsDeployment: true,
  description: '',
  referenceLinks: '',
};

const ownerModeEvent = 'owner-mode-change';

const statusLabels: Record<BuildStudioInquiry['status'], string> = {
  new: 'New',
  estimating: 'Estimating',
  accepted: 'Accepted',
  declined: 'Declined',
  shipped: 'Shipped',
};

const BuildStudio = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [inquiries, setInquiries] = useState<BuildStudioInquiry[]>([]);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');

  const loadInquiries = async () => {
    setLoadStatus('loading');

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

  useEffect(() => {
    const refreshOwnerStatus = () => {
      void checkOwnerStatus().then((unlocked) => {
        setIsOwner(unlocked);
        if (unlocked) {
          void loadInquiries();
        }
      });
    };

    refreshOwnerStatus();
    window.addEventListener(ownerModeEvent, refreshOwnerStatus);
    window.addEventListener('focus', refreshOwnerStatus);

    return () => {
      window.removeEventListener(ownerModeEvent, refreshOwnerStatus);
      window.removeEventListener('focus', refreshOwnerStatus);
    };
  }, []);

  if (!isOwner) return null;

  const updateForm = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submitInquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus('submitting');

    try {
      const response = await fetch('/api/build-studio/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiry: form }),
      });

      if (!response.ok) throw new Error('Failed to submit inquiry.');

      const result = (await response.json()) as { inquiry?: BuildStudioInquiry };
      if (result.inquiry) {
        setInquiries((current) => [result.inquiry as BuildStudioInquiry, ...current]);
      }
      setForm(emptyForm);
      setSubmitStatus('submitted');
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <section id="build-studio" data-section="6" className="theme-section build-studio min-h-screen py-20 snap-start">
      <div className="theme-container">
        <div className="build-studio-header">
          <div>
            <p className="theme-kicker mb-5">Owner Preview</p>
            <h2 className="theme-heading">Build Studio</h2>
          </div>
          <p className="theme-copy">
            Fast product prototypes, polished enough to test with real users. This section is hidden until owner mode is unlocked.
          </p>
        </div>

        <div className="build-studio-grid">
          <form className="theme-card build-studio-form" onSubmit={submitInquiry}>
            <div className="build-studio-form-heading">
              <span>Inquiry Intake</span>
              <strong>Estimate a project</strong>
            </div>

            <div className="build-studio-fields">
              <label>
                <span>Name</span>
                <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} required />
              </label>
              <label>
                <span>Email</span>
                <input value={form.email} onChange={(event) => updateForm('email', event.target.value)} type="email" required />
              </label>
              <label>
                <span>Project type</span>
                <select value={form.projectType} onChange={(event) => updateForm('projectType', event.target.value)}>
                  <option value="">Select one</option>
                  <option>Personal site</option>
                  <option>Landing page</option>
                  <option>Internal tool</option>
                  <option>AI workflow</option>
                  <option>Prototype MVP</option>
                </select>
              </label>
              <label>
                <span>Budget</span>
                <select value={form.budgetRange} onChange={(event) => updateForm('budgetRange', event.target.value)}>
                  <option value="">Not sure yet</option>
                  <option>$300 - $800</option>
                  <option>$800 - $1,500</option>
                  <option>$1,500 - $3,000</option>
                  <option>$3,000+</option>
                </select>
              </label>
              <label>
                <span>Timeline</span>
                <select value={form.timeline} onChange={(event) => updateForm('timeline', event.target.value)}>
                  <option value="">Flexible</option>
                  <option>48 hours</option>
                  <option>1 week</option>
                  <option>2-3 weeks</option>
                  <option>1 month+</option>
                </select>
              </label>
              <label className="build-studio-check">
                <input
                  checked={form.needsDeployment}
                  onChange={(event) => updateForm('needsDeployment', event.target.checked)}
                  type="checkbox"
                />
                <span>Needs deployment</span>
              </label>
            </div>

            <label>
              <span>What should be built?</span>
              <textarea
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                required
                rows={6}
                placeholder="Describe the product, workflow, audience, or messy idea."
              />
            </label>

            <label>
              <span>References</span>
              <textarea
                value={form.referenceLinks}
                onChange={(event) => updateForm('referenceLinks', event.target.value)}
                rows={3}
                placeholder="Links, screenshots, competitors, examples."
              />
            </label>

            <button type="submit" disabled={submitStatus === 'submitting'}>
              {submitStatus === 'submitting' ? 'Submitting' : 'Submit Inquiry'}
            </button>
            {submitStatus === 'submitted' && <p className="build-studio-status">Inquiry saved.</p>}
            {submitStatus === 'error' && <p className="build-studio-status is-error">Could not save inquiry.</p>}
          </form>

          <aside className="theme-card build-studio-inquiries">
            <div className="build-studio-form-heading">
              <span>Pipeline</span>
              <strong>{inquiries.length} inquiries</strong>
            </div>

            {loadStatus === 'loading' && <p className="theme-copy">Loading inquiries.</p>}
            {loadStatus === 'error' && <p className="build-studio-status is-error">Run the Build Studio Supabase SQL before using this section.</p>}
            {loadStatus === 'ready' && inquiries.length === 0 && (
              <p className="theme-copy">No inquiries yet. Use the form to test the intake flow.</p>
            )}
            {inquiries.length > 0 && (
              <div className="build-studio-list">
                {inquiries.map((inquiry) => (
                  <article key={inquiry.id}>
                    <div>
                      <span>{statusLabels[inquiry.status]}</span>
                      <time>{new Date(inquiry.createdAt).toLocaleDateString()}</time>
                    </div>
                    <strong>{inquiry.name}</strong>
                    <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                    <p>{inquiry.description}</p>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default BuildStudio;
