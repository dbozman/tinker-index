export type PublicationStatus =
  | 'DISCOVERED'
  | 'EVALUATING'
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'REJECTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type Provenance = 'SOURCE_VERIFIED' | 'AI_ESTIMATED' | 'UNKNOWN';

export type ProjectSort =
  | 'publishedAt_desc'
  | 'title_asc'
  | 'estimatedCost_asc'
  | 'estimatedCost_desc'
  | 'estimatedMinutes_asc'
  | 'estimatedMinutes_desc';

export interface ProvenancedValue<T> {
  value: T | null;
  provenance: Provenance;
}

export interface NamedSlug {
  slug: string;
  name: string;
}

export interface CreatorSummary {
  name: string;
  websiteUrl: string | null;
}

export interface SourceSummary {
  name: string;
  websiteUrl: string | null;
  url: string;
}

export interface ToolSummary {
  slug: string;
  name: string;
  optional: boolean;
}

export interface MaterialSummary {
  slug: string;
  name: string;
  quantity: string | null;
  unit: string | null;
}

export interface ProjectListItem {
  slug: string;
  title: string;
  summary: string;
  category: NamedSlug;
  tags: NamedSlug[];
  difficulty: ProvenancedValue<Difficulty>;
  estimatedCost: ProvenancedValue<{ amountCents: number; currency: string }>;
  estimatedDuration: ProvenancedValue<{ minutes: number }>;
  creator: CreatorSummary | null;
  sourceUrl: string;
  isDemo: boolean;
  publishedAt: string | null;
}

export interface ProjectDetail extends ProjectListItem {
  description: string;
  tools: ToolSummary[];
  materials: MaterialSummary[];
  source: SourceSummary;
  mainImage: {
    url: string | null;
    attribution: string | null;
    license: string | null;
    rightsHolder: string | null;
  };
}

export interface CategorySummary {
  slug: string;
  name: string;
  description: string | null;
  publishedProjectCount: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
