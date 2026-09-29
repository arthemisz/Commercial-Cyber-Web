'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
    alert('Profile created!')
    router.push('/consultant')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-void p-6">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        
        <div className="flex items-center justify-between font-mono text-sm mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full border",
                step === s ? "border-signal bg-signal/10 text-signal" : 
                step > s ? "border-verified bg-verified/10 text-verified" : "border-graphite text-graphite"
              )}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              <span className={cn(
                "hidden sm:inline",
                step === s ? "text-signal" : step > s ? "text-verified" : "text-graphite"
              )}>
                {s === 1 ? 'Profile' : s === 2 ? 'Payouts' : 'Complete'}
              </span>
              {s < 3 && <ChevronRight className="w-4 h-4 text-graphite mx-2" />}
            </div>
          ))}
        </div>

        <div className="bg-slate-surface border border-graphite p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-mono text-signal mb-2">Consultant Profile</h2>
                <p className="text-ash text-sm font-mono">Tell us about your expertise and rates.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-mono text-frost">Full Name</label>
                  <input 
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData(prev => ({...prev, fullName: e.target.value}))}
                    className="bg-void border border-graphite px-3 py-2 text-frost font-mono focus:outline-none focus:border-signal" 
                    placeholder="Jane Doe"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-mono text-frost">Bio</label>
                  <textarea 
                    value={formData.bio}
                    onChange={e => setFormData(prev => ({...prev, bio: e.target.value}))}
                    className="bg-void border border-graphite px-3 py-2 text-frost font-mono h-24 resize-none focus:outline-none focus:border-signal"
                    placeholder="Offensive security specialist..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-mono text-frost">Certifications</label>
                  <div className="flex flex-wrap gap-2">
                    {CERTS.map(cert => (
                      <button
                        key={cert}
                        onClick={() => toggleCert(cert)}
                        className={cn(
                          "px-3 py-1 font-mono text-xs border transition-colors",
                          formData.certifications.includes(cert)
                            ? "bg-signal border-signal text-void"
                            : "bg-void border-graphite text-ash hover:border-signal/50"
                        )}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-mono text-frost">Hourly Rate (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-ash font-mono">$</span>
                    <input 
                      type="number"
                      value={formData.hourlyRate}
                      onChange={e => setFormData(prev => ({...prev, hourlyRate: e.target.value}))}
                      className="bg-void border border-graphite pl-8 pr-3 py-2 text-frost font-mono focus:outline-none focus:border-signal w-full"
                      placeholder="150"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.fullName || !formData.hourlyRate}
                  className="bg-signal text-void px-6 py-2 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-signal/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-mono text-signal mb-2">Stripe Connect</h2>
                <p className="text-ash text-sm font-mono">Set up your payout account to receive funds when engagements conclude.</p>
              </div>

              <div className="bg-void border border-graphite p-6 flex flex-col items-center text-center gap-4">
                <ShieldCheck className="w-12 h-12 text-verified" />
                <p className="font-mono text-sm text-frost max-w-md">
                  We use Stripe Connect to route funds securely from the escrow smart contract directly to your bank account.
                </p>
                
                {stripeConnected ? (
                  <div className="px-4 py-2 bg-verified/10 border border-verified text-verified font-mono text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Stripe Account Connected
                  </div>
                ) : (
                  <button 
                    onClick={handleStripeConnect}
                    className="bg-[#635BFF] text-white px-6 py-2 font-mono text-sm hover:opacity-90 transition-opacity"
                  >
                    Connect with Stripe
                  </button>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="border border-graphite text-ash px-6 py-2 font-mono text-sm hover:bg-graphite/20 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!stripeConnected}
                  className="bg-signal text-void px-6 py-2 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-signal/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-mono text-signal mb-2">Confirm & Complete</h2>
                <p className="text-ash text-sm font-mono">Review your profile details before finalizing.</p>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="grid grid-cols-3 border-b border-graphite pb-2">
                  <span className="text-ash">Name:</span>
                  <span className="col-span-2 text-frost">{formData.fullName}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-graphite pb-2">
                  <span className="text-ash">Rate:</span>
                  <span className="col-span-2 text-frost">${formData.hourlyRate}/hr</span>
                </div>
                <div className="grid grid-cols-3 border-b border-graphite pb-2">
                  <span className="text-ash">Certifications:</span>
                  <span className="col-span-2 text-frost">{formData.certifications.join(', ') || 'None'}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-graphite pb-2">
                  <span className="text-ash">Payouts:</span>
                  <span className="col-span-2 text-verified flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Connected
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  onClick={() => setStep(2)}
                  className="border border-graphite text-ash px-6 py-2 font-mono text-sm hover:bg-graphite/20 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  className="bg-signal text-void px-6 py-2 font-mono text-sm hover:bg-signal/90 transition-colors"
                >
                  Complete Onboarding
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
