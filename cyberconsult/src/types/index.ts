import type {
  User,
  ConsultantProfile,
  Engagement,
  Milestone,
  Finding,
  Artifact,
  AuditLog,
  UserRole,
  EngagementStatus,
  SeverityLevel,
  VulnStatus,
} from '@prisma/client';

// Re-export Prisma types
export type {
  User,
  ConsultantProfile,
  Engagement,
  Milestone,
  Finding,
  Artifact,
  AuditLog,
  UserRole,
  EngagementStatus,
  SeverityLevel,
  VulnStatus,
};

// Engagement with relations
export type EngagementWithRelations = Engagement & {
  client: User;
  consultant: ConsultantProfile & { user: User };
  milestones: Milestone[];
  findings: Finding[];
  artifacts: Artifact[];
};

// RoE Scope Target structure
export interface ScopeTarget {
  cidrs: string[];
  domains: string[];
  urls: string[];
  repositories: string[];
  excludedSystems: string[];
}

export interface RoEConfiguration {
  targets: ScopeTarget;
  testingWindow: {
    startsAt: string;
    endsAt: string;
    timezone: string;
  };
  rateLimits: {
    requestsPerSecond: number;
    concurrentConnections: number;
  };
  attackVectors: {
    dosAllowed: boolean;
    phishingAllowed: boolean;
    physicalAllowed: boolean;
    productionDbAllowed: boolean;
    socialEngineeringAllowed: boolean;
    wirelessAllowed: boolean;
  };
  additionalNotes: string;
}

// CVSS v3.1 types
export interface CVSSMetrics {
  attackVector: 'N' | 'A' | 'L' | 'P';
  attackComplexity: 'L' | 'H';
  privilegesRequired: 'N' | 'L' | 'H';
  userInteraction: 'N' | 'R';
  scope: 'U' | 'C';
  confidentialityImpact: 'N' | 'L' | 'H';
  integrityImpact: 'N' | 'L' | 'H';
  availabilityImpact: 'N' | 'L' | 'H';
}

// Severity color mapping
export const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; color: string; bgColor: string }> = {
  INFORMATIONAL: { label: 'Info', color: 'text-ash', bgColor: 'bg-ash/10' },
  LOW: { label: 'Low', color: 'text-signal', bgColor: 'bg-signal/10' },
  MEDIUM: { label: 'Medium', color: 'text-caution', bgColor: 'bg-caution/10' },
  HIGH: { label: 'High', color: 'text-kill/80', bgColor: 'bg-kill/10' },
  CRITICAL: { label: 'Critical', color: 'text-kill', bgColor: 'bg-kill/20' },
} as const;

// Engagement status display config
export const STATUS_CONFIG: Record<EngagementStatus, { label: string; color: string; bgColor: string }> = {
  DRAFT_SCOPE: { label: 'Draft', color: 'text-ash', bgColor: 'bg-ash/10' },
  ROE_PENDING_SIGNATURES: { label: 'Pending Signatures', color: 'text-caution', bgColor: 'bg-caution/10' },
  ROE_SIGNED: { label: 'RoE Signed', color: 'text-signal', bgColor: 'bg-signal/10' },
  FUNDS_IN_ESCROW: { label: 'Funded', color: 'text-signal', bgColor: 'bg-signal/10' },
  TESTING_ACTIVE: { label: 'Testing Active', color: 'text-verified', bgColor: 'bg-verified/10' },
  ABORTED_KILL_SWITCH: { label: 'Aborted', color: 'text-kill', bgColor: 'bg-kill/20' },
  REPORT_DELIVERED: { label: 'Report Delivered', color: 'text-signal', bgColor: 'bg-signal/10' },
  COMPLETED: { label: 'Completed', color: 'text-verified', bgColor: 'bg-verified/10' },
} as const;

// Vulnerability status display config
export const VULN_STATUS_CONFIG: Record<VulnStatus, { label: string; color: string; bgColor: string }> = {
  REPORTED: { label: 'Reported', color: 'text-kill', bgColor: 'bg-kill/10' },
  ACKNOWLEDGED: { label: 'Acknowledged', color: 'text-caution', bgColor: 'bg-caution/10' },
  FIX_COMMITTED: { label: 'Fix Committed', color: 'text-signal', bgColor: 'bg-signal/10' },
  RETEST_VERIFIED: { label: 'Retest Verified', color: 'text-verified', bgColor: 'bg-verified/10' },
  CLOSED: { label: 'Closed', color: 'text-ash', bgColor: 'bg-ash/10' },
} as const;
