import prisma from '@/lib/prisma'
import { Shield, Bug, DollarSign, Award, Clock, ArrowRight, CheckCircle2, AlertTriangle, FileCode, Activity } from 'lucide-react'
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
    <div className="flex flex-col gap-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-amber"></span>
            <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
              SEC_05 // CONSULTANT_OPERATIONS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-frost font-mono">
            CONSULTANT OPERATIONS CONSOLE
          </h1>
          <p className="text-ash text-xs font-mono mt-1">
            {profile ? `OPERATOR: ${profile.fullName} [${profile.user?.email || 'AUTHENTICATED'}]` : 'CERTIFIED SECURITY CONSULTANT'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono border border-verified/30 bg-verified/10 text-verified">
            <span className="w-1.5 h-1.5 bg-verified"></span>
            STRIPE CONNECT DISBURSAL: ARMED
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>ASSIGNED TARGETS</span>
            <Shield className="w-4 h-4 text-amber" />
          </div>
          <span className="text-3xl font-bold font-mono text-frost tracking-tight">{engagements.length}</span>
          <p className="text-[10px] font-mono text-ash mt-2">Active scopes authorized</p>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>DEFECTS DISCLOSED</span>
            <Bug className="w-4 h-4 text-cyan" />
          </div>
          <span className="text-3xl font-bold font-mono text-frost tracking-tight">{totalFindings}</span>
          <p className="text-[10px] font-mono text-ash mt-2">Logged in state machine</p>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>ESCROW NET (85%)</span>
            <DollarSign className="w-4 h-4 text-verified" />
          </div>
          <span className="text-3xl font-bold font-mono text-verified tracking-tight">{formatCurrency(pendingPayouts)}</span>
          <p className="text-[10px] font-mono text-ash mt-2">Held in milestone escrow</p>
        </div>

        <div className="bg-bunker border border-steel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash mb-3 text-[10px] font-mono uppercase tracking-wider">
            <span>VERIFIED CERTS</span>
            <Award className="w-4 h-4 text-amber" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(profile?.certifications || ['OSCP', 'CISSP', 'CRTO']).map((cert: string) => (
              <span key={cert} className="px-2 py-0.5 text-[10px] font-mono bg-obsidian border border-steel text-frost">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Engagements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-frost uppercase tracking-wider font-mono">
            Authorized Scope Assignments
          </h2>
          <span className="text-xs text-ash font-mono">{engagements.length} ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {engagements.map((eng: any) => (
            <div key={eng.id} className="bg-bunker border border-steel p-6 flex flex-col justify-between hover:border-amber/50 transition-colors">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-bold text-sm text-frost font-mono line-clamp-1">{eng.title}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-obsidian border border-verified/30 text-verified shrink-0">
                    {eng.status.replace(/_/g, ' ')}
                  </span>
                </div>
                
                <p className="text-xs font-mono text-ash mb-4">
                  ENTERPRISE: <span className="text-chalk">{eng.client?.email || 'Acme SecOps'}</span>
                </p>
                
                <div className="bg-obsidian p-3 border border-steel text-xs font-mono text-ash space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Testing Window:</span>
                    <span className="text-frost">
                      {eng.testingStartsAt ? formatDate(eng.testingStartsAt) : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Escrow Pool:</span>
                    <span className="text-amber font-semibold">{formatCurrency(eng.totalEscrowAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-steel">
                <span className="text-xs font-mono text-ash">{eng._count?.findings || 0} Findings</span>
                <Link 
                  href={`/consultant/findings-editor/${eng.id}`}
                  className="text-xs font-mono font-semibold bg-amber text-obsidian px-3 py-1.5 hover:bg-frost transition-colors flex items-center gap-1 uppercase tracking-wider"
                >
                  Report Finding
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}

          {engagements.length === 0 && (
            <div className="p-8 text-center text-ash bg-bunker border border-steel font-mono text-xs col-span-full">
              NO ACTIVE ENGAGEMENT ASSIGNMENTS CURRENTLY DISPATCHED.
            </div>
          )}
        </div>
      </div>

      {/* Security Audit Feed */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-frost uppercase tracking-wider font-mono">
          Operational Security Telemetry
        </h2>
        <div className="bg-bunker border border-steel divide-y divide-steel">
          {auditLogs.map((log: any) => (
            <div key={log.id} className="p-3.5 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gunmetal/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-amber font-semibold">{log.action}</span>
                <span className="text-ash">{log.resourceType} #{log.resourceId.slice(0, 8)}</span>
              </div>
              <span className="text-ash text-[11px]">{formatDate(log.timestamp)}</span>
            </div>
          ))}
          {auditLogs.length === 0 && (
            <div className="p-4 text-xs font-mono text-ash text-center">No recent security events logged.</div>
          )}
        </div>
      </div>
    </div>
  )
}
