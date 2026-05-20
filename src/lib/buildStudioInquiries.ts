import { requestSupabase } from './supabaseAdmin';

export type BuildStudioInquiryStatus = 'new' | 'estimating' | 'accepted' | 'declined' | 'shipped';

export type BuildStudioInquiry = {
  id: string;
  name: string;
  contactMethods: string;
  productFormat: string;
  platforms: string;
  timeline: string;
  description: string;
  featureScope: string;
  audienceSizeDau: string;
  audienceSizeMau: string;
  monthlySpend: string;
  maxBudget: string;
  referenceLinks: string;
  status: BuildStudioInquiryStatus;
  createdAt: string;
};

type BuildStudioInquiryRow = {
  id: string;
  name: string;
  contact_methods?: string;
  email?: string;
  product_format?: string;
  platforms?: string;
  project_type?: string;
  timeline: string;
  description: string;
  feature_scope?: string;
  audience_size_dau?: string;
  audience_size_mau?: string;
  monthly_spend?: string;
  max_budget?: string;
  budget_range?: string;
  reference_links: string;
  status: BuildStudioInquiryStatus;
  created_at: string;
};

export type BuildStudioInquiryInput = Omit<BuildStudioInquiry, 'id' | 'status' | 'createdAt'>;

const statuses = new Set<BuildStudioInquiryStatus>(['new', 'estimating', 'accepted', 'declined', 'shipped']);

const toInquiry = (row: BuildStudioInquiryRow): BuildStudioInquiry => ({
  id: row.id,
  name: row.name,
  contactMethods: row.contact_methods || row.email || '',
  productFormat: row.product_format || row.project_type || '',
  platforms: row.platforms || '',
  timeline: row.timeline,
  description: row.description,
  featureScope: row.feature_scope || '',
  audienceSizeDau: row.audience_size_dau || '',
  audienceSizeMau: row.audience_size_mau || '',
  monthlySpend: row.monthly_spend || '',
  maxBudget: row.max_budget || row.budget_range || '',
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
    contactMethods: cleanText(candidate.contactMethods, 800),
    productFormat: cleanText(candidate.productFormat, 80),
    platforms: cleanText(candidate.platforms, 180),
    timeline: cleanText(candidate.timeline, 80),
    description: cleanText(candidate.description, 2200),
    featureScope: cleanText(candidate.featureScope, 2200),
    audienceSizeDau: cleanText(candidate.audienceSizeDau, 80),
    audienceSizeMau: cleanText(candidate.audienceSizeMau, 80),
    monthlySpend: cleanText(candidate.monthlySpend, 120),
    maxBudget: cleanText(candidate.maxBudget, 120),
    referenceLinks: cleanText(candidate.referenceLinks, 1000),
  };

  if (!inquiry.contactMethods || !inquiry.description || !inquiry.featureScope) return null;

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
      contact_methods: inquiry.contactMethods,
      product_format: inquiry.productFormat,
      platforms: inquiry.platforms,
      timeline: inquiry.timeline,
      description: inquiry.description,
      feature_scope: inquiry.featureScope,
      audience_size_dau: inquiry.audienceSizeDau,
      audience_size_mau: inquiry.audienceSizeMau,
      monthly_spend: inquiry.monthlySpend,
      max_budget: inquiry.maxBudget,
      reference_links: inquiry.referenceLinks,
      status: 'new',
    },
  });

  return toInquiry(rows[0]);
};
