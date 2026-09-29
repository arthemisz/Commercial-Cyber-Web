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
        return 'bg-kill/15 text-kill border-kill/30'
      case 'HIGH':
        return 'bg-caution/15 text-caution border-caution/30'
      case 'MEDIUM':
        return 'bg-signal/15 text-signal border-signal/30'
      case 'LOW':
        return 'bg-ash/15 text-ash border-ash/30'
      default:
        return 'bg-graphite text-frost border-graphite'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REPORTED':
        return 'bg-caution/10 text-caution border-caution/20'
      case 'ACKNOWLEDGED':
        return 'bg-signal/10 text-signal border-signal/20'
      case 'FIX_COMMITTED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'RETEST_VERIFIED':
        return 'bg-verified/10 text-verified border-verified/20'
      case 'CLOSED':
        return 'bg-graphite text-ash border-graphite'
      default:
        return 'bg-graphite text-frost border-graphite'
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-ash">
        <Link href={`/client/engagements/${id}`} className="hover:text-frost flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Engagement
        </Link>
        <span className="text-graphite">/</span>
        <span className="text-frost font-medium">Vulnerability Lifecycle Tracker</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-graphite pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-frost">Structured Findings & Remediation</h1>
          <p className="text-ash text-sm mt-1">{engagement.title} · {findings.length} total items identified</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded border border-graphite bg-slate-surface hover:bg-graphite/40 text-frost text-xs font-mono transition-colors"
          >
            <FileJson className="w-3.5 h-3.5 text-signal" />
            SARIF 2.1.0 Export
          </button>
          <button 
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded border border-graphite bg-slate-surface hover:bg-graphite/40 text-frost text-xs font-mono transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-ash" />
            Sync to Jira / GitHub
          </button>
        </div>
      </div>

      {/* Severity Breakdown Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.entries(severityCounts) as [string, number][]).map(([sev, count]) => (
          <div key={sev} className="bg-slate-surface border border-graphite rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-ash">{sev}</span>
              <span className={cn("px-1.5 py-0.5 text-xs font-mono rounded border", getSeverityBadge(sev))}>
                {sev === 'CRITICAL' ? '9.0 - 10.0' : sev === 'HIGH' ? '7.0 - 8.9' : sev === 'MEDIUM' ? '4.0 - 6.9' : sev === 'LOW' ? '0.1 - 3.9' : '0.0'}
              </span>
            </div>
            <span className="text-2xl font-semibold text-frost">{count}</span>
          </div>
        ))}
      </div>

      {/* Findings Table */}
      {findings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-slate-surface border border-graphite rounded-lg text-center">
          <ShieldCheck className="w-12 h-12 text-verified mb-3 opacity-80" />
          <h3 className="text-lg font-semibold text-frost">Zero Vulnerabilities Recorded</h3>
          <p className="text-ash text-sm mt-1 max-w-md">No security defects have been logged yet for this engagement scope.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-graphite rounded-lg bg-slate-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-void/60 border-b border-graphite text-xs font-medium text-ash">
              <tr>
                <th className="px-4 py-3">Severity & Score</th>
                <th className="px-4 py-3">Finding Title</th>
                <th className="px-4 py-3">Taxonomy (CWE)</th>
                <th className="px-4 py-3">CVSS Vector</th>
                <th className="px-4 py-3">Audit State</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite/40">
              {findings.map((finding) => (
                <tr key={finding.id} className="hover:bg-graphite/20 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-0.5 text-xs font-mono rounded border font-semibold", getSeverityBadge(finding.severity))}>
                        {finding.cvssScore.toFixed(1)} {finding.severity}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-frost">{finding.title}</div>
                    <div className="text-xs text-ash mt-0.5 max-w-md line-clamp-1">{finding.description}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ash whitespace-nowrap">
                    {finding.cweIdentifier || 'CWE-Unassigned'}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ash max-w-xs truncate" title={finding.cvssVector}>
                    {finding.cvssVector}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={cn("px-2 py-0.5 text-xs font-mono rounded border", getStatusBadge(finding.status))}>
                      {finding.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ash whitespace-nowrap">
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
