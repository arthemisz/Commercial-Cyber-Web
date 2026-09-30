'use client'

import { ScopeBuilder } from '@/components/roe/scope-builder'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react'

export default function RoeBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const id = (params?.id as string) || ''

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto font-sans">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-ash border-b border-steel pb-4">
        <Link href="/client/engagements" className="hover:text-amber transition-colors uppercase tracking-wider">
          ENGAGEMENTS
        </Link>
        <span className="text-steel">/</span>
        <Link href={`/client/engagements/${id}`} className="hover:text-amber transition-colors font-mono uppercase tracking-wider">
          SCOPE #{id.slice(0, 8)}
        </Link>
        <span className="text-steel">/</span>
        <span className="text-frost font-mono uppercase tracking-wider">CRYPTOGRAPHIC_ROE_BUILDER</span>
      </div>

      {/* Header */}
      <div className="border-b border-steel pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 bg-amber"></span>
          <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
            SEC_04 // SCOPE_AUTHORIZATION
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-frost font-mono">
          Cryptographic Rules of Engagement (RoE) Builder
        </h1>
        <p className="text-ash text-xs font-mono mt-1">
          Define multi-target boundaries, rate limits, out-of-scope exemptions, and compute tamper-proof SHA-256 digital authorizations.
        </p>
      </div>

      {/* Scope Builder Container */}
      <div className="bg-bunker border border-steel p-6 md:p-8">
        <ScopeBuilder 
          engagementId={id} 
          onComplete={(_hash) => {
            router.push(`/client/engagements/${id}`)
          }} 
        />
      </div>
    </div>
  )
}
