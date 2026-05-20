import { requestSupabase } from './supabaseAdmin';

export type BuildStudioInquiryStatus = 'new' | 'estimating' | 'accepted' | 'declined' | 'shipped';

export type BuildStudioInquiry = {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  needsDeployment: boolean;
  description: string;
  referenceLinks: string;
  status: BuildStudioInquiryStatus;
  createdAt: string;
};

type BuildStudioInquiryRow = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  budget_range: string;
  timeline: string;
  needs_deployment: boolean;
  description: string;
  reference_links: string;
  status: BuildStudioInquiryStatus;
  created_at: string;
};

export type BuildStudioInquiryInput = Omit<BuildStudioInquiry, 'id' | 'status' | 'createdAt'>;

const statuses = new Set<BuildStudioInquiryStatus>(['new', 'estimating', 'accepted', 'declined', 'shipped']);

const toInquiry = (row: BuildStudioInquiryRow): BuildStudioInquiry => ({
  id: row.id,
  name: row.name,
  email: row.email,
  projectType: row.project_type,
  budgetRange: row.budget_range,
  timeline: row.timeline,
  needsDeployment: row.needs_deployment,
  description: row.description,
  referenceLinks: row.reference_links,
  status: statuses.has(row.status) ? row.status : 'new',
  createdAt: row.created_at,
});

const cleanText = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

export const parseBuildStudioInquiryInput = (value: unknown): BuildStudioInquiryInput | null => {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Partial<Record<keyof BuildStudioInquiryInput, unknown>>;
  const inquiry: BuildStudioInquiryInput = {
    name: cleanText(candidate.name, 120),
    email: cleanText(candidate.email, 180),
    projectType: cleanText(candidate.projectType, 120),
    budgetRange: cleanText(candidate.budgetRange, 80),
    timeline: cleanText(candidate.timeline, 80),
    needsDeployment: Boolean(candidate.needsDeployment),
    description: cleanText(candidate.description, 2200),
    referenceLinks: cleanText(candidate.referenceLinks, 1000),
  };

  if (!inquiry.name || !inquiry.email || !inquiry.description) return null;

  return inquiry;
};

export const loadBuildStudioInquiries = async () => {
  const rows = await requestSupabase<BuildStudioInquiryRow[]>(
    '/build_studio_inquiries?select=*&order=created_at.desc',
  );

  return rows.map(toInquiry);
};

export const createBuildStudioInquiry = async (inquiry: BuildStudioInquiryInput) => {
  const id = crypto.randomUUID();

  const rows = await requestSupabase<BuildStudioInquiryRow[]>('/build_studio_inquiries', {
    method: 'POST',
    headers: {
      Prefer: 'return=representation',
    },
    body: {
      id,
      name: inquiry.name,
      email: inquiry.email,
      project_type: inquiry.projectType,
      budget_range: inquiry.budgetRange,
      timeline: inquiry.timeline,
      needs_deployment: inquiry.needsDeployment,
      description: inquiry.description,
      reference_links: inquiry.referenceLinks,
      status: 'new',
    },
  });

  return toInquiry(rows[0]);
};
