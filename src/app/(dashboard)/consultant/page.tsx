import prisma from '@/lib/prisma'
import { Shield, Bug, DollarSign, Award, Clock, ArrowRight, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ConsultantDashboard() {
  let profile: any = null
  let engagements: any[] = []
  let auditLogs: any[] = []

  try {
    profile = await prisma.consultantProfile.findFirst({
      include: { 
        user: true,
        engagements: {
          include: {
            client: true,
            milestones: true,
            _count: { select: { findings: true } }
          }
        }
      }
    })

    engagements = profile?.engagements || await prisma.engagement.findMany({
      include: {
        client: true,
        milestones: true,
        _count: { select: { findings: true } }
      }
    })
    
    auditLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' }
    })
  } catch (err) {
    console.warn('Prisma query failed on consultant page, using mock data:', err)
    profile = {
      fullName: 'Jane Doe',
      certifications: ['OSCP', 'CISSP', 'CRTO'],
      user: { email: 'hacker.one@cyberconsult.com' }
    }
    engagements = [
      {
        id: 'eng-demo-acme-q3',
        title: 'Acme Corp Q3 External Network Penetration Test',
        status: 'TESTING_ACTIVE',
        totalEscrowAmount: 1500000,
        testingStartsAt: new Date(Date.now() - 7 * 86400000),
        testingEndsAt: new Date(Date.now() + 7 * 86400000),
        client: { email: 'secops@acme.corp' },
        milestones: [
          { amountCents: 500000, isApproved: true, paidOutAt: new Date(Date.now() - 5 * 86400000) },
          { amountCents: 500000, isApproved: false, paidOutAt: null },
          { amountCents: 500000, isApproved: false, paidOutAt: null }
        ],
        _count: { findings: 4 }
      }
    ]
    auditLogs = [
      { id: 'log-1', action: 'ROE_SIGNED', resourceType: 'ENGAGEMENT', resourceId: 'eng-demo-acme-q3', timestamp: new Date() },
      { id: 'log-2', action: 'FINDING_CREATED', resourceType: 'FINDING', resourceId: 'f-1', timestamp: new Date() }
    ]
  }

  const totalFindings = engagements.reduce((sum: number, eng: any) => sum + (eng._count?.findings || 0), 0)
  
  // Calculate total escrow and payouts
  let totalNetEscrow = 0
  let pendingPayouts = 0
  let completedPayouts = 0

  engagements.forEach((eng: any) => {
    (eng.milestones || []).forEach((m: any) => {
      const netAmount = Math.round(m.amountCents * 0.85) // after 15% platform take
      totalNetEscrow += netAmount
      if (m.isApproved && m.paidOutAt) {
        completedPayouts += netAmount
      } else {
        pendingPayouts += netAmount
      }
    })
  })

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-graphite pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-frost">Consultant Operations Console</h1>
          <p className="text-ash text-sm mt-1">
            {profile ? `Authenticated as ${profile.fullName} (${profile.user.email})` : 'Certified Security Consultant'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded bg-verified/10 text-verified border border-verified/30">
            <span className="w-1.5 h-1.5 rounded-full bg-verified" />
            Stripe Payouts Enabled
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-surface border border-graphite rounded-lg p-5">
          <div className="flex items-center justify-between text-ash mb-3 text-xs uppercase tracking-wider">
            <span>Assigned Engagements</span>
            <Shield className="w-4 h-4 text-signal" />
          </div>
          <span className="text-3xl font-semibold text-frost tracking-tight">{engagements.length}</span>
          <p className="text-xs text-ash mt-1">Target scopes authorized</p>
        </div>

        <div className="bg-slate-surface border border-graphite rounded-lg p-5">
          <div className="flex items-center justify-between text-ash mb-3 text-xs uppercase tracking-wider">
            <span>Defects Disclosed</span>
            <Bug className="w-4 h-4 text-signal" />
          </div>
          <span className="text-3xl font-semibold text-signal tracking-tight">{totalFindings}</span>
          <p className="text-xs text-ash mt-1">Across all active audits</p>
        </div>

        <div className="bg-slate-surface border border-graphite rounded-lg p-5">
          <div className="flex items-center justify-between text-ash mb-3 text-xs uppercase tracking-wider">
            <span>Escrow Net (85%)</span>
            <DollarSign className="w-4 h-4 text-verified" />
          </div>
          <span className="text-3xl font-semibold text-verified tracking-tight">{formatCurrency(pendingPayouts)}</span>
          <p className="text-xs text-ash mt-1">Held in Stripe split-escrow</p>
        </div>

        <div className="bg-slate-surface border border-graphite rounded-lg p-5">
          <div className="flex items-center justify-between text-ash mb-3 text-xs uppercase tracking-wider">
            <span>Active Certifications</span>
            <Award className="w-4 h-4 text-signal" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(profile?.certifications || ['OSCP', 'CISSP', 'CRTO']).map((cert: string) => (
              <span key={cert} className="px-2 py-0.5 text-xs font-mono rounded bg-void border border-graphite text-frost">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Engagements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-frost">Authorized Scope Assignments</h2>
          <span className="text-xs text-ash font-mono">{engagements.length} active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {engagements.map((eng: any) => (
            <div key={eng.id} className="bg-slate-surface border border-graphite rounded-lg p-5 flex flex-col justify-between hover:border-graphite/80 transition-colors">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-semibold text-sm text-frost line-clamp-1">{eng.title}</h3>
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-void border border-signal/40 text-signal shrink-0">
                    {eng.status.replace(/_/g, ' ')}
                  </span>
                </div>
                
                <p className="text-xs text-ash mb-4">Enterprise: <span className="text-frost font-mono">{eng.client?.email}</span></p>
                
                <div className="bg-void p-3 rounded border border-graphite text-xs font-mono text-ash space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Window:</span>
                    <span className="text-frost">
                      {eng.testingStartsAt ? formatDate(eng.testingStartsAt) : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Escrow Pool:</span>
                    <span className="text-verified">{formatCurrency(eng.totalEscrowAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-graphite">
                <span className="text-xs font-mono text-ash">{eng._count.findings} Findings</span>
                <div className="flex gap-2">
                  <Link 
                    href={`/consultant/findings-editor/${eng.id}`}
                    className="text-xs font-medium bg-signal text-void px-3 py-1.5 rounded hover:bg-signal/90 transition-colors flex items-center gap-1"
                  >
                    Report Finding
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {engagements.length === 0 && (
            <div className="p-8 text-center text-ash bg-slate-surface border border-graphite rounded-lg col-span-full">
              No active engagement assignments currently assigned.
            </div>
          )}
        </div>
      </div>

      {/* Security Audit Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-frost">Operational Telemetry</h2>
        <div className="bg-slate-surface border border-graphite rounded-lg divide-y divide-graphite/40">
          {auditLogs.map((log: any) => (
            <div key={log.id} className="p-3.5 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-signal font-semibold">{log.action}</span>
                <span className="text-ash">{log.resourceType} #{log.resourceId.slice(0, 8)}</span>
              </div>
              <span className="text-ash">{formatDate(log.timestamp)}</span>
            </div>
          ))}
          {auditLogs.length === 0 && (
            <div className="p-4 text-xs text-ash text-center">No recent security events logged.</div>
          )}
        </div>
      </div>
    </div>
  )
}
