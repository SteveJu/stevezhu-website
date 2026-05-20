'use client';

import { useEffect, useState } from 'react';
import { checkOwnerStatus } from './OwnerAccess';

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

const BuildStudio = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');

  useEffect(() => {
    const refreshOwnerStatus = () => {
      void checkOwnerStatus().then(setIsOwner);
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
            Fast product prototypes, polished enough to test with real users. This section is hidden for now while the studio offer is being shaped.
          </p>
        </div>

        <div className="build-studio-grid">
          <div className="theme-card build-studio-showcase">
            <div className="build-studio-form-heading">
              <span>Vibe coding menu</span>
              <strong>What I can build fast</strong>
            </div>
            <div className="build-studio-showcase-grid">
              <article>
                <span>01</span>
                <strong>Product prototypes</strong>
                <p>Clickable, deployed MVP-style experiences for testing an idea with real users.</p>
              </article>
              <article>
                <span>02</span>
                <strong>Internal tools</strong>
                <p>Dashboards, planners, intake systems, admin panels, and workflow helpers.</p>
              </article>
              <article>
                <span>03</span>
                <strong>AI workflows</strong>
                <p>Screenshot reading, structured extraction, automations, and lightweight agent flows.</p>
              </article>
              <article>
                <span>04</span>
                <strong>Polished web pages</strong>
                <p>Personal sites, launch pages, portfolios, and interactive product demos.</p>
              </article>
            </div>
          </div>

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
        </div>
      </div>
    </section>
  );
};

export default BuildStudio;
