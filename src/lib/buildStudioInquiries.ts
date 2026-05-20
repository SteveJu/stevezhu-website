import { requestSupabase } from './supabaseAdmin';

export type BuildStudioInquiryStatus = 'new' | 'reviewing' | 'quoted' | 'negotiating' | 'accepted' | 'building' | 'shipped' | 'archived' | 'declined';
export type BuildStudioInquiryPriority = 'low' | 'normal' | 'high';

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
  ownerNotes: string;
  quotedPrice: string;
  estimatedMonthlyCost: string;
  estimatedHours: string;
  priority: BuildStudioInquiryPriority;
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
  owner_notes?: string;
  quoted_price?: string;
  estimated_monthly_cost?: string;
  estimated_hours?: string;
  priority?: BuildStudioInquiryPriority;
  created_at: string;
};

export type BuildStudioInquiryInput = Omit<BuildStudioInquiry, 'id' | 'status' | 'ownerNotes' | 'quotedPrice' | 'estimatedMonthlyCost' | 'estimatedHours' | 'priority' | 'createdAt'>;
export type BuildStudioInquiryUpdate = Pick<BuildStudioInquiry, 'status' | 'ownerNotes' | 'quotedPrice' | 'estimatedMonthlyCost' | 'estimatedHours' | 'priority'>;

const statuses = new Set<BuildStudioInquiryStatus>(['new', 'reviewing', 'quoted', 'negotiating', 'accepted', 'building', 'shipped', 'archived', 'declined']);
const priorities = new Set<BuildStudioInquiryPriority>(['low', 'normal', 'high']);

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
  ownerNotes: row.owner_notes || '',
  quotedPrice: row.quoted_price || '',
  estimatedMonthlyCost: row.estimated_monthly_cost || '',
  estimatedHours: row.estimated_hours || '',
  priority: row.priority && priorities.has(row.priority) ? row.priority : 'normal',
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

export const parseBuildStudioInquiryUpdate = (value: unknown): BuildStudioInquiryUpdate | null => {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Partial<Record<keyof BuildStudioInquiryUpdate, unknown>>;
  const status = cleanText(candidate.status, 40) as BuildStudioInquiryStatus;
  const priority = cleanText(candidate.priority, 40) as BuildStudioInquiryPriority;

  return {
    status: statuses.has(status) ? status : 'new',
    priority: priorities.has(priority) ? priority : 'normal',
    ownerNotes: cleanText(candidate.ownerNotes, 2200),
    quotedPrice: cleanText(candidate.quotedPrice, 120),
    estimatedMonthlyCost: cleanText(candidate.estimatedMonthlyCost, 120),
    estimatedHours: cleanText(candidate.estimatedHours, 80),
  };
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

export const updateBuildStudioInquiry = async (id: string, update: BuildStudioInquiryUpdate) => {
  const rows = await requestSupabase<BuildStudioInquiryRow[]>(`/build_studio_inquiries?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      Prefer: 'return=representation',
    },
    body: {
      status: update.status,
      priority: update.priority,
      owner_notes: update.ownerNotes,
      quoted_price: update.quotedPrice,
      estimated_monthly_cost: update.estimatedMonthlyCost,
      estimated_hours: update.estimatedHours,
    },
  });

  return rows[0] ? toInquiry(rows[0]) : null;
};
