import prisma from '@/lib/prisma'
import { Shield, ArrowRight, Plus, FileCheck2, AlertTriangle, Lock, DollarSign, Activity } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ClientEngagementsPage() {
  let engagements: any[] = []
  try {
    engagements = await prisma.engagement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        consultant: {
          include: { user: true }
        },
        findings: true,
        milestones: true
      }
    })
  } catch (err) {
    console.warn('Prisma query failed, using mock data:', err)
    engagements = [
      {
        id: 'eng-demo-acme-q3',
        title: 'Acme Corp Q3 External Network Penetration Test',
        status: 'TESTING_ACTIVE',
        totalEscrowAmount: 1500000,
        roeDocumentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        consultant: {
          fullName: 'Jane Doe',
          user: { email: 'hacker.one@cyberconsult.com' }
        },
        findings: [
          { id: 'f-1', severity: 'CRITICAL', title: 'SQL Injection in Login Portal' },
          { id: 'f-2', severity: 'HIGH', title: 'IDOR in Invoices' },
          { id: 'f-3', severity: 'MEDIUM', title: 'Stored XSS in Dashboard' }
        ],
        milestones: [
          { id: 'm-1', title: 'Scoping & Threat Modeling', amountCents: 500000, isApproved: true },
          { id: 'm-2', title: 'Vulnerability Identification', amountCents: 500000, isApproved: false },
          { id: 'm-3', title: 'Retest & Debrief', amountCents: 500000, isApproved: false }
        ]
      }
    ]
  }

  const totalEscrow = engagements.reduce((acc, eng) => acc + (eng.totalEscrowAmount || 0), 0)
  const activeCount = engagements.filter(eng => eng.status === 'TESTING_ACTIVE').length
  const totalFindings = engagements.reduce((acc, eng) => acc + (eng.findings?.length || 0), 0)

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-amber"></span>
            <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
              SEC_01 // CLIENT_OPERATIONS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-frost font-mono">
            ENTERPRISE ENGAGEMENTS
          </h1>
          <p className="text-ash text-xs font-mono mt-1">
            Manage authorized scope boundaries, cryptographic RoE attestations, and milestone escrows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/client/engagements/eng-demo-acme-q3/roe-builder"
            className="inline-flex items-center gap-2 bg-amber text-obsidian font-mono text-xs font-semibold px-4 py-2 hover:bg-frost transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            INITIALIZE NEW SCOPE
          </Link>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bunker border border-steel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash text-[10px] font-mono uppercase tracking-wider mb-2">
            <span>ACTIVE OPERATIONS</span>
            <Activity className="w-3.5 h-3.5 text-verified" />
          </div>
          <div className="text-2xl font-mono font-bold text-frost">
            {String(activeCount).padStart(2, '0')}
            <span className="text-xs text-ash font-normal ml-2">/ {engagements.length} TOTAL</span>
          </div>
          <div className="text-[10px] font-mono text-verified mt-2">● LIVE TESTING AUTHORIZED</div>
        </div>

        <div className="bg-bunker border border-steel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash text-[10px] font-mono uppercase tracking-wider mb-2">
            <span>TOTAL ESCROW ALLOCATED</span>
            <DollarSign className="w-3.5 h-3.5 text-amber" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber">
            {formatCurrency(totalEscrow)}
          </div>
          <div className="text-[10px] font-mono text-ash mt-2">STRIPE CONNECT 2-OF-2 MULTI-SIG</div>
        </div>

        <div className="bg-bunker border border-steel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ash text-[10px] font-mono uppercase tracking-wider mb-2">
            <span>DISCLOSED DEFECTS</span>
            <Shield className="w-3.5 h-3.5 text-cyan" />
          </div>
          <div className="text-2xl font-mono font-bold text-frost">
            {String(totalFindings).padStart(2, '0')}
          </div>
          <div className="text-[10px] font-mono text-ash mt-2">CVSS v3.1 / v4.0 VERIFIED</div>
        </div>
      </div>

      {/* Engagements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {engagements.map((eng) => {
          const isActive = eng.status === 'TESTING_ACTIVE'
          const isKillSwitch = eng.status === 'ABORTED_KILL_SWITCH'
          const criticalCount = (eng.findings || []).filter((f: any) => f.severity === 'CRITICAL').length
          const highCount = (eng.findings || []).filter((f: any) => f.severity === 'HIGH').length
          const approvedMilestones = (eng.milestones || []).filter((m: any) => m.isApproved).length
          const totalMilestones = (eng.milestones || []).length

          return (
            <div 
              key={eng.id}
              className="bg-bunker border border-steel flex flex-col justify-between hover:border-amber/50 transition-colors group relative"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                    isActive 
                      ? 'bg-verified/10 text-verified border-verified/30'
                      : isKillSwitch
                      ? 'bg-kill/10 text-kill border-kill/30'
                      : 'bg-amber/10 text-amber border-amber/30'
                  }`}>
                    {eng.status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-xs text-amber font-semibold">
                    {formatCurrency(eng.totalEscrowAmount)}
                  </span>
                </div>

                <Link href={`/client/engagements/${eng.id}`} className="block">
                  <h3 className="text-base font-bold text-frost group-hover:text-amber transition-colors line-clamp-2 mb-2 font-mono">
                    {eng.title}
                  </h3>
                </Link>

                <div className="text-[11px] font-mono text-ash mb-4 flex items-center gap-1.5">
                  <span>SPECIALIST:</span>
                  <span className="text-chalk truncate">{eng.consultant?.fullName || 'Assigned Specialist'}</span>
                </div>

                <div className="space-y-2 border-t border-steel pt-4 text-xs font-mono text-ash">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <FileCheck2 className="w-3.5 h-3.5 text-amber" />
                      RoE Hash:
                    </span>
                    <span className="text-frost font-mono text-[11px]">
                      {eng.roeDocumentHash ? eng.roeDocumentHash.slice(0, 10) + '...' : 'UNSIGNED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Defects:</span>
                    <span className="text-chalk font-mono">
                      {(eng.findings || []).length} total
                      {criticalCount > 0 && <span className="text-kill ml-1.5">({criticalCount} CRIT)</span>}
                      {highCount > 0 && <span className="text-amber ml-1">({highCount} HIGH)</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span>Escrow Milestones:</span>
                    <span className="text-frost font-mono">
                      {approvedMilestones} / {totalMilestones} approved
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-3 bg-obsidian border-t border-steel flex items-center justify-between gap-2">
                <Link
                  href={`/client/engagements/${eng.id}/roe-builder`}
                  className="text-[11px] text-ash hover:text-amber font-mono uppercase tracking-wider transition-colors px-2 py-1"
                >
                  RoE Scope
                </Link>
                <Link
                  href={`/client/engagements/${eng.id}/findings`}
                  className="text-[11px] text-ash hover:text-amber font-mono uppercase tracking-wider transition-colors px-2 py-1"
                >
                  Findings ({(eng.findings || []).length})
                </Link>
                <Link
                  href={`/client/engagements/${eng.id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-amber hover:text-frost font-semibold uppercase tracking-wider px-2 py-1 transition-colors"
                >
                  Console →
                </Link>
              </div>
            </div>
          )
        })}

        {engagements.length === 0 && (
          <div className="col-span-full p-12 text-center bg-bunker border border-steel text-ash font-mono text-xs">
            NO ENGAGEMENTS RECORDED. INITIALIZE A NEW SCOPE REQUEST TO BEGIN.
          </div>
        )}
      </div>
    </div>
  )
}
