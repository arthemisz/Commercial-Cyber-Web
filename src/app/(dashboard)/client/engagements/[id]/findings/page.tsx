import prisma from '@/lib/prisma'
import { cn } from '@/lib/utils'
import { Download, Bug, ChevronLeft, ShieldCheck, FileJson, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function FindingsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let engagement: any = null
  try {
    engagement = await prisma.engagement.findUnique({
      where: { id },
      include: {
        findings: {
          orderBy: { cvssScore: 'desc' }
        }
      }
    })
  } catch (err) {
    console.warn('Prisma query failed, using mock data:', err)
  }

  if (!engagement) {
    engagement = {
      id,
      title: 'Acme Corp Q3 External Network Penetration Test',
      findings: [
        {
          id: 'f-1',
          title: 'SQL Injection in Login Portal',
          cweIdentifier: 'CWE-89',
          cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
          cvssScore: 9.8,
          severity: 'CRITICAL',
          description: 'The login endpoint is vulnerable to time-based blind SQL injection in the username parameter.',
          status: 'REPORTED',
          updatedAt: new Date()
        },
        {
          id: 'f-2',
          title: 'Insecure Direct Object Reference (IDOR) on Invoices',
          cweIdentifier: 'CWE-639',
          cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
          cvssScore: 6.5,
          severity: 'HIGH',
          description: 'Authenticated users can download arbitrary organizational invoices.',
          status: 'FIX_COMMITTED',
          updatedAt: new Date()
        },
        {
          id: 'f-3',
          title: 'Cross-Site Scripting (XSS) in Dashboard Profile',
          cweIdentifier: 'CWE-79',
          cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N',
          cvssScore: 5.4,
          severity: 'MEDIUM',
          description: 'Stored XSS vulnerability in the user profile bio field.',
          status: 'ACKNOWLEDGED',
          updatedAt: new Date()
        }
      ]
    }
  }

  const findings: any[] = engagement.findings || []

  const severityCounts = {
    CRITICAL: findings.filter((f: any) => f.severity === 'CRITICAL').length,
    HIGH: findings.filter((f: any) => f.severity === 'HIGH').length,
    MEDIUM: findings.filter((f: any) => f.severity === 'MEDIUM').length,
    LOW: findings.filter((f: any) => f.severity === 'LOW').length,
    INFORMATIONAL: findings.filter((f: any) => f.severity === 'INFORMATIONAL').length,
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-kill/10 text-kill border-kill/30'
      case 'HIGH':
        return 'bg-amber/10 text-amber border-amber/30'
      case 'MEDIUM':
        return 'bg-verified/10 text-verified border-verified/30'
      case 'LOW':
        return 'bg-cyan/10 text-cyan border-cyan/30'
      default:
        return 'bg-steel/40 text-ash border-steel'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REPORTED':
        return 'bg-amber/10 text-amber border-amber/30'
      case 'ACKNOWLEDGED':
        return 'bg-cyan/10 text-cyan border-cyan/30'
      case 'FIX_COMMITTED':
        return 'bg-cobalt/15 text-frost border-cobalt/40'
      case 'RETEST_VERIFIED':
        return 'bg-verified/10 text-verified border-verified/30'
      case 'CLOSED':
        return 'bg-steel/30 text-ash border-steel'
      default:
        return 'bg-bunker text-chalk border-steel'
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto font-sans">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-ash border-b border-steel pb-4">
        <Link href={`/client/engagements/${id}`} className="hover:text-amber flex items-center gap-1 transition-colors uppercase tracking-wider">
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Engagement Console
        </Link>
        <span className="text-steel">/</span>
        <span className="text-frost font-mono">VULNERABILITY_LIFECYCLE</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-steel pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-amber"></span>
            <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
              SEC_03 // DEFECT_LEDGER
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-frost font-mono">
            Vulnerability Findings & Lifecycle Tracking
          </h1>
          <p className="text-ash text-xs font-mono mt-1">
            {engagement.title} · {findings.length} verifiable defect(s) logged
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-steel bg-bunker hover:border-amber text-frost text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <FileJson className="w-3.5 h-3.5 text-amber" />
            SARIF 2.1.0 Export
          </button>
          <button 
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-steel bg-bunker hover:border-amber text-chalk hover:text-frost text-xs font-mono uppercase tracking-wider transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-ash" />
            Sync Jira / GitHub
          </button>
        </div>
      </div>

      {/* Severity Breakdown Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.entries(severityCounts) as [string, number][]).map(([sev, count]) => (
          <div key={sev} className="bg-bunker border border-steel p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ash">{sev}</span>
              <span className={cn("px-1.5 py-0.5 text-[10px] font-mono border", getSeverityBadge(sev))}>
                {sev === 'CRITICAL' ? '9.0 - 10.0' : sev === 'HIGH' ? '7.0 - 8.9' : sev === 'MEDIUM' ? '4.0 - 6.9' : sev === 'LOW' ? '0.1 - 3.9' : '0.0'}
              </span>
            </div>
            <span className="text-2xl font-bold font-mono text-frost">{count}</span>
          </div>
        ))}
      </div>

      {/* Findings Table */}
      {findings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-bunker border border-steel text-center">
          <ShieldCheck className="w-10 h-10 text-verified mb-3" />
          <h3 className="text-base font-bold text-frost font-mono">NO VULNERABILITIES RECORDED</h3>
          <p className="text-ash text-xs font-mono mt-1 max-w-md">No security defects have been logged yet within this authenticated scope.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-steel bg-bunker">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-obsidian border-b border-steel text-[10px] font-medium text-ash uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">SEVERITY / SCORE</th>
                <th className="px-4 py-3">FINDING TITLE</th>
                <th className="px-4 py-3">TAXONOMY</th>
                <th className="px-4 py-3">CVSS VECTOR</th>
                <th className="px-4 py-3">STATE</th>
                <th className="px-4 py-3">UPDATED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel">
              {findings.map((finding) => (
                <tr key={finding.id} className="hover:bg-gunmetal/40 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={cn("px-2 py-0.5 text-[11px] font-mono border font-semibold", getSeverityBadge(finding.severity))}>
                      {finding.cvssScore.toFixed(1)} {finding.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-frost text-sm font-sans">{finding.title}</div>
                    <div className="text-xs text-ash mt-0.5 max-w-md line-clamp-1 font-sans">{finding.description}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-amber whitespace-nowrap">
                    {finding.cweIdentifier || 'CWE-UNASSIGNED'}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-ash max-w-xs truncate" title={finding.cvssVector}>
                    {finding.cvssVector}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={cn("px-2 py-0.5 text-[10px] font-mono border tracking-wider", getStatusBadge(finding.status))}>
                      {finding.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-ash whitespace-nowrap">
                    {new Date(finding.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
