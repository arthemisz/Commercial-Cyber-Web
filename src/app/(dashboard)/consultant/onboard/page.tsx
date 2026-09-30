'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, ChevronRight, ShieldCheck, Key, DollarSign, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CERTS = ['OSCP', 'CISSP', 'CEH', 'CISM', 'CRTO', 'GPEN', 'GXPN', 'CCSP', 'OSWE']

export default function OnboardPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    certifications: [] as string[],
    hourlyRate: ''
  })
  const [stripeConnected, setStripeConnected] = useState(false)

  const toggleCert = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }))
  }

  const handleStripeConnect = () => {
    setTimeout(() => {
      setStripeConnected(true)
    }, 1000)
  }

  const handleSubmit = async () => {
    alert('Security Operator profile activated!')
    router.push('/consultant')
  }

  return (
    <div className="max-w-3xl mx-auto py-4 font-sans">
      {/* Header section */}
      <div className="border-b border-steel pb-6 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 bg-amber"></span>
          <span className="font-mono text-[10px] text-ash tracking-[0.25em] uppercase">
            SEC_07 // CONSULTANT_PROVISIONING
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-frost font-mono">
          Security Operator Onboarding
        </h1>
        <p className="text-ash text-xs font-mono mt-1">
          Cryptographic credential verification, operational rate bounding, and Stripe Connect escrow routing.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between font-mono text-xs border border-steel bg-bunker p-3">
          {[
            { num: 1, label: 'CREDENTIALS' },
            { num: 2, label: 'ESCROW ROUTING' },
            { num: 3, label: 'ACTIVATION' }
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 flex items-center justify-center text-[11px] font-mono border font-semibold",
                step === s.num ? "border-amber bg-amber/10 text-amber" : 
                step > s.num ? "border-verified bg-verified/10 text-verified" : "border-steel text-ash"
              )}>
                {step > s.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={cn(
                "hidden sm:inline text-[10px] tracking-wider uppercase",
                step === s.num ? "text-amber font-semibold" : step > s.num ? "text-verified" : "text-ash"
              )}>
                {s.label}
              </span>
              {idx < 2 && <ChevronRight className="w-3.5 h-3.5 text-steel mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Profile & Credentials */}
        <div className="bg-bunker border border-steel p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-steel pb-4">
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-frost mb-1">
                  Operator Identity & Certifications
                </h2>
                <p className="text-ash text-xs font-mono">Specify operational identity and verified penetration testing credentials.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-ash">Legal Operator Full Name</label>
                  <input 
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData(prev => ({...prev, fullName: e.target.value}))}
                    className="w-full bg-obsidian border border-steel px-3 py-2 text-xs font-mono text-frost focus:outline-none focus:border-amber transition-colors" 
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-ash">Specialization Bio & Attack Surfaces</label>
                  <textarea 
                    value={formData.bio}
                    onChange={e => setFormData(prev => ({...prev, bio: e.target.value}))}
                    className="w-full bg-obsidian border border-steel px-3 py-2 text-xs font-mono text-chalk h-24 resize-none focus:outline-none focus:border-amber transition-colors"
                    placeholder="Offensive security specialist, cloud infrastructure exploitation, smart contract auditing..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-ash">Accredited Certifications</label>
                  <div className="flex flex-wrap gap-2">
                    {CERTS.map(cert => (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleCert(cert)}
                        className={cn(
                          "px-3 py-1 font-mono text-xs border uppercase tracking-wider transition-colors",
                          formData.certifications.includes(cert)
                            ? "bg-amber text-obsidian border-amber font-semibold"
                            : "bg-obsidian border-steel text-ash hover:border-amber/60 hover:text-frost"
                        )}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-ash">Engagement Rate (USD / Hour)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-ash font-mono text-xs">$</span>
                    <input 
                      type="number"
                      value={formData.hourlyRate}
                      onChange={e => setFormData(prev => ({...prev, hourlyRate: e.target.value}))}
                      className="bg-obsidian border border-steel pl-8 pr-3 py-2 text-frost font-mono text-xs focus:outline-none focus:border-amber w-full transition-colors"
                      placeholder="200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-steel">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.fullName || !formData.hourlyRate}
                  className="bg-amber text-obsidian px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-frost transition-colors"
                >
                  Proceed to Escrow Routing →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Stripe Connect */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-steel pb-4">
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-frost mb-1">
                  Stripe Connect Escrow Payout Configuration
                </h2>
                <p className="text-ash text-xs font-mono">Bind a verified merchant account to receive multi-sig escrow milestone releases.</p>
              </div>

              <div className="bg-obsidian border border-steel p-8 flex flex-col items-center text-center gap-4">
                <ShieldCheck className="w-12 h-12 text-amber" />
                <p className="font-mono text-xs text-chalk max-w-md">
                  Cyberthink uses Stripe Connect to disburse 85% net milestone payouts directly upon cryptographic RoE acceptance.
                </p>
                
                {stripeConnected ? (
                  <div className="px-4 py-2 bg-verified/10 border border-verified/30 text-verified font-mono text-xs flex items-center gap-2 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-verified" />
                    Stripe Connect Account Verified & Armed
                  </div>
                ) : (
                  <button 
                    onClick={handleStripeConnect}
                    className="bg-[#635BFF] text-white px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Authenticate with Stripe Connect
                  </button>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-steel">
                <button 
                  onClick={() => setStep(1)}
                  className="border border-steel text-ash px-6 py-2.5 font-mono text-xs uppercase tracking-wider hover:text-frost hover:border-chalk transition-colors"
                >
                  ← Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!stripeConnected}
                  className="bg-amber text-obsidian px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-frost transition-colors"
                >
                  Review Terms →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-steel pb-4">
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-frost mb-1">
                  Review & Final Activation
                </h2>
                <p className="text-ash text-xs font-mono">Verify operational parameters before initializing your active console session.</p>
              </div>

              <div className="space-y-3 font-mono text-xs bg-obsidian border border-steel p-4">
                <div className="flex justify-between border-b border-steel/60 pb-2">
                  <span className="text-ash uppercase tracking-wider text-[10px]">OPERATOR IDENTITY:</span>
                  <span className="text-frost font-semibold">{formData.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-steel/60 pb-2">
                  <span className="text-ash uppercase tracking-wider text-[10px]">HOURLY BILLING RATE:</span>
                  <span className="text-amber font-semibold">${formData.hourlyRate} USD / hr</span>
                </div>
                <div className="flex justify-between border-b border-steel/60 pb-2">
                  <span className="text-ash uppercase tracking-wider text-[10px]">ACCREDITATIONS:</span>
                  <span className="text-frost">{formData.certifications.join(', ') || 'None Declared'}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-ash uppercase tracking-wider text-[10px]">ESCROW PIPELINE:</span>
                  <span className="text-verified flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-verified" /> CONNECTED & VERIFIED
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-steel">
                <button 
                  onClick={() => setStep(2)}
                  className="border border-steel text-ash px-6 py-2.5 font-mono text-xs uppercase tracking-wider hover:text-frost hover:border-chalk transition-colors"
                >
                  ← Back
                </button>
                <button 
                  onClick={handleSubmit}
                  className="bg-amber text-obsidian px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-frost transition-colors"
                >
                  Confirm & Initialize Operator Session →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
