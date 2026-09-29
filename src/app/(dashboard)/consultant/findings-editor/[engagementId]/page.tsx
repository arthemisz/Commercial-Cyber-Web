'use client'

import { useState } from 'react'
import { CVSSCalculator } from '@/components/cvss/calculator'
import { AlertTriangle, Send, ChevronLeft, CheckCircle2, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

const COMMON_CWES = [
  { id: 'CWE-89', name: 'SQL Injection' },
  { id: 'CWE-79', name: 'Cross-site Scripting (XSS)' },
  { id: 'CWE-639', name: 'Insecure Direct Object Reference (IDOR)' },
  { id: 'CWE-287', name: 'Improper Authentication' },
  { id: 'CWE-352', name: 'Cross-Site Request Forgery (CSRF)' },
  { id: 'CWE-862', name: 'Missing Authorization' },
  { id: 'CWE-918', name: 'Server-Side Request Forgery (SSRF)' },
  { id: 'CWE-502', name: 'Deserialization of Untrusted Data' },
]

export default function FindingsEditorPage() {
  const params = useParams()
  const router = useRouter()
  const engagementId = (params?.engagementId as string) || ''

  const [formData, setFormData] = useState({
    title: '',
    cweId: 'CWE-89',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    cvssScore: 9.8,
    severity: 'CRITICAL',
    description: '',
    poc: '',
    remediation: ''
  })
  
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-ash">
        <Link href="/consultant" className="hover:text-frost flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Consultant Console
        </Link>
        <span className="text-graphite">/</span>
        <span className="text-frost font-mono">Engagement #{engagementId.slice(0, 8)}</span>
        <span className="text-graphite">/</span>
        <span className="text-frost font-medium">Vulnerability Disclosure Form</span>
      </div>

      <div className="bg-slate-surface border border-graphite rounded-lg p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-frost">Report Security Vulnerability</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-signal/10 border border-signal/30 text-signal">
              AUTHORIZED SCOPE
            </span>
          </div>
          <p className="text-xs text-ash mt-1">
            Structured lifecycle submission adhering to CVSS v3.1 / v4.0 metrics and CWE taxonomy.
          </p>
        </div>
        <div className="flex items-center gap-2 text-caution text-xs font-mono bg-caution/10 border border-caution/30 px-3 py-1.5 rounded">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>All PoC payloads must comply with signed RoE limits.</span>
        </div>
      </div>

      {submitted ? (
        <div className="bg-slate-surface border border-graphite rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-verified/20 border border-verified/40 flex items-center justify-center text-verified">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-frost">Vulnerability Finding Logged</h2>
          <p className="text-sm text-ash max-w-md">
            The defect has entered the state machine as <span className="text-caution font-mono">REPORTED</span>. Client SecOps has been notified via real-time telemetry.
          </p>
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  title: '',
                  cweId: 'CWE-89',
                  cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
                  cvssScore: 9.8,
                  severity: 'CRITICAL',
                  description: '',
                  poc: '',
                  remediation: ''
                })
              }}
              className="px-4 py-2 rounded bg-signal text-void text-xs font-semibold hover:bg-signal/90 transition-colors"
            >
              Report Another Finding
            </button>
            <Link
              href={`/client/engagements/${engagementId}/findings`}
              className="px-4 py-2 rounded border border-graphite hover:bg-graphite/40 text-frost text-xs transition-colors"
            >
              View Findings Tracker
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
            <div className="space-y-5 bg-slate-surface border border-graphite rounded-lg p-6">
              <h2 className="text-base font-semibold text-frost border-b border-graphite pb-3">Finding Details</h2>
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ash">Finding Title</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData(p => ({...p, title: e.target.value}))}
                  className="w-full bg-void border border-graphite rounded px-3 py-2 text-sm text-frost focus:outline-none focus:border-signal"
                  placeholder="e.g. Remote Code Execution via Insecure YAML Deserialization"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ash">CWE Taxonomy Tag</label>
                <div className="flex gap-2">
                  <select
                    value={formData.cweId}
                    onChange={e => setFormData(p => ({...p, cweId: e.target.value}))}
                    className="w-full bg-void border border-graphite rounded px-3 py-2 text-xs font-mono text-frost focus:outline-none focus:border-signal"
                  >
                    {COMMON_CWES.map(cwe => (
                      <option key={cwe.id} value={cwe.id}>
                        {cwe.id} — {cwe.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-ash">Detailed Description</label>
                  <button 
                    type="button" 
                    onClick={() => setPreview(!preview)} 
                    className="text-xs font-mono text-signal hover:underline"
                  >
                    {preview ? 'Edit Raw' : 'Preview'}
                  </button>
                </div>
                {preview ? (
                  <div className="bg-void border border-graphite rounded p-3 text-frost text-xs min-h-[100px] whitespace-pre-wrap font-sans">
                    {formData.description || 'No description entered.'}
                  </div>
                ) : (
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                    className="w-full bg-void border border-graphite rounded px-3 py-2 text-xs text-frost h-28 resize-y focus:outline-none focus:border-signal"
                    placeholder="Describe the vulnerability mechanics, business impact, and affected components..."
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ash">Sanitized Proof of Concept (PoC)</label>
                <textarea 
                  required
                  value={formData.poc}
                  onChange={e => setFormData(p => ({...p, poc: e.target.value}))}
                  className="w-full bg-void border border-graphite rounded px-3 py-2 text-xs font-mono text-signal h-28 resize-y focus:outline-none focus:border-signal"
                  placeholder="HTTP request headers, curl commands, sanitized exploitation payloads..."
                />
                <p className="text-[11px] text-ash">Markdown inputs are sanitized using DOMPurify before UI rendering.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ash">Remediation Guidance</label>
                <textarea 
                  required
                  value={formData.remediation}
                  onChange={e => setFormData(p => ({...p, remediation: e.target.value}))}
                  className="w-full bg-void border border-graphite rounded px-3 py-2 text-xs text-frost h-24 resize-y focus:outline-none focus:border-signal"
                  placeholder="Code patches, architectural remediations, or configuration changes..."
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-signal hover:bg-signal/90 text-void px-4 py-2.5 rounded font-semibold text-xs tracking-wide uppercase transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Logging Defect...' : 'Submit Finding to Client'}
              </button>
            </div>
          </form>

          {/* CVSS Interactive Calculator Column */}
          <div className="lg:col-span-5 space-y-6">
            <CVSSCalculator 
              initialVector={formData.cvssVector}
              onChange={(vector: string, score: number, severity: string) => {
                setFormData(p => ({
                  ...p,
                  cvssVector: vector,
                  cvssScore: score,
                  severity: severity.toUpperCase()
                }))
              }} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

