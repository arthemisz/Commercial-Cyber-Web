import prisma from './prisma';
import { Prisma } from '@prisma/client';

interface AuditEntry {
  userId?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown> | null;
  ipAddress: string;
}

export async function createAuditLog(entry: AuditEntry) {
  return prisma.auditLog.create({
    data: {
      userId: entry.userId ?? null,
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      metadata: entry.metadata ? (entry.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      ipAddress: entry.ipAddress,
    },
  });
}

export const AuditActions = {
  ROE_SIGNED: 'ROE_SIGNED',
  KILL_SWITCH_ENGAGED: 'KILL_SWITCH_ENGAGED',
  KILL_SWITCH_RESET: 'KILL_SWITCH_RESET',
  PAYOUT_RELEASED: 'PAYOUT_RELEASED',
  FINDING_CREATED: 'FINDING_CREATED',
  FINDING_STATUS_CHANGED: 'FINDING_STATUS_CHANGED',
  ENGAGEMENT_CREATED: 'ENGAGEMENT_CREATED',
  ENGAGEMENT_STATUS_CHANGED: 'ENGAGEMENT_STATUS_CHANGED',
  ARTIFACT_UPLOADED: 'ARTIFACT_UPLOADED',
  ARTIFACT_DELETED: 'ARTIFACT_DELETED',
} as const;
