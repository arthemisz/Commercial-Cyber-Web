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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-ash">
        <Link href="/client/engagements" className="hover:text-frost transition-colors">Engagements</Link>
        <ChevronRight className="w-3.5 h-3.5 text-graphite" />
        <Link href={`/client/engagements/${id}`} className="hover:text-frost transition-colors font-mono">
          Scope #{id.slice(0, 8)}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-graphite" />
        <span className="text-frost font-medium">Cryptographic Rules of Engagement</span>
      </div>

      <div className="border-b border-graphite pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-frost">Cryptographic Rules of Engagement (RoE) Builder</h1>
        <p className="text-ash text-sm mt-1">
          Define multi-target boundaries, schedule testing windows, enforce rate-limits, and generate an authenticated SHA-256 digital signature.
        </p>
      </div>

      <div className="bg-slate-surface border border-graphite rounded-lg p-6">
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

