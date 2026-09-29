import prisma from '@/lib/prisma'
import { Shield, ArrowRight, Plus, Clock, FileCheck2, AlertCircle } from 'lucide-react'
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

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-graphite pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-frost">Enterprise Security Engagements</h1>
          <p className="text-ash text-sm mt-1">Manage active scopes, cryptographic RoE authorizations, and milestone escrows.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/client/engagements"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-signal hover:bg-signal/90 text-void font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Scope Request
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {engagements.map((eng) => {
          const isActive = eng.status === 'TESTING_ACTIVE'
          const isPendingRoE = eng.status === 'DRAFT_SCOPE' || eng.status === 'ROE_PENDING_SIGNATURES'
          const isKillSwitch = eng.status === 'ABORTED_KILL_SWITCH'
          const criticalCount = (eng.findings || []).filter((f: any) => f.severity === 'CRITICAL').length
          const highCount = (eng.findings || []).filter((f: any) => f.severity === 'HIGH').length

          return (
            <div 
              key={eng.id}
              className="bg-slate-surface border border-graphite rounded-lg flex flex-col justify-between hover:border-graphite/80 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className={`px-2.5 py-0.5 text-xs font-mono rounded border ${
                    isActive 
                      ? 'bg-signal/15 text-signal border-signal/30'
                      : isKillSwitch
                      ? 'bg-kill/15 text-kill border-kill/30'
                      : 'bg-graphite text-ash border-graphite'
                  }`}>
                    {eng.status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-xs text-frost font-medium">
                    {formatCurrency(eng.totalEscrowAmount)}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-frost line-clamp-1 mb-2">
                  {eng.title}
                </h3>
                <p className="text-xs text-ash mb-4">
                  Consultant: <span className="text-frost">{eng.consultant?.fullName || 'Assigned Specialist'}</span>
                </p>

                <div className="space-y-2 border-t border-graphite/50 pt-4 text-xs font-mono text-ash">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-signal" />
                      RoE Hash:
                    </span>
                    <span className="text-frost">
                      {eng.roeDocumentHash ? eng.roeDocumentHash.slice(0, 10) + '...' : 'Unsigned'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Findings:</span>
                    <span className="text-frost">
                      {(eng.findings || []).length} total
                      {criticalCount > 0 && <span className="text-kill ml-1">({criticalCount} crit)</span>}
                      {highCount > 0 && <span className="text-caution ml-1">({highCount} high)</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Milestones:</span>
                    <span className="text-frost">
                      {(eng.milestones || []).filter((m: any) => m.isApproved).length} / {(eng.milestones || []).length} approved
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-void/40 border-t border-graphite/50 flex items-center justify-between gap-2">
                <Link
                  href={`/client/engagements/${eng.id}/roe-builder`}
                  className="text-xs text-ash hover:text-signal font-mono transition-colors"
                >
                  RoE Scope
                </Link>
                <Link
                  href={`/client/engagements/${eng.id}/findings`}
                  className="text-xs text-ash hover:text-signal font-mono transition-colors"
                >
                  Findings ({eng.findings.length})
                </Link>
                <Link
                  href={`/client/engagements/${eng.id}`}
                  className="inline-flex items-center gap-1 text-xs text-signal hover:underline font-medium"
                >
                  Console
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )
        })}

        {engagements.length === 0 && (
          <div className="col-span-full p-12 text-center bg-slate-surface border border-graphite rounded-lg text-ash">
            No engagements active. Start by creating a new scope request.
          </div>
        )}
      </div>
    </div>
  )
}
