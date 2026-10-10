import Image from "next/image";
import Link from "next/link";
import { Shield, Users, Mail, Search, Handshake, Zap, CheckCircle, ArrowRight, Globe } from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { HireModal } from "@/components/public/hire-modal";

export default function Home() {
  return (
    <div className="min-h-screen bg-obsidian text-chalk selection:bg-amber selection:text-obsidian flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 flex flex-col">
        {/* SEC_01 // COMMAND - HERO SECTION */}
        <section className="relative w-full py-20 px-6 border-b border-steel overflow-hidden">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_01 // COMMAND
          </span>

          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 border border-amber/30 bg-amber/5 text-amber font-mono text-[10px] px-2 py-1 mb-8 self-start">
                <span className="w-1.5 h-1.5 bg-amber animate-pulse"></span>
                <span>OPERATIONAL // 100+ EXPERTS READY</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-frost leading-[1.05]">
                Cybersecurity hiring<br className="hidden md:block" />
                <span className="text-chalk">shouldn't be</span><br className="hidden md:block" />
                <span className="text-amber">complicated.</span>
              </h1>

              <p className="text-chalk text-sm md:text-base leading-relaxed max-w-xl mt-6">
                Submit your requirements, and our team connects you with the right cybersecurity expert from our vetted network of 100+ specialists. No algorithms. No marketplace chaos. Just the right match.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-10">
                <HireModal>
                  <button className="bg-amber text-obsidian font-mono text-xs font-semibold px-5 py-2.5 hover:bg-frost transition-colors inline-flex items-center gap-2">
                    HIRE AN EXPERT →
                  </button>
                </HireModal>
                
                <Link
                  href="#how-it-works"
                  className="border border-steel text-chalk font-mono text-xs px-5 py-2.5 hover:border-chalk hover:text-frost transition-colors inline-flex items-center"
                >
                  HOW IT WORKS
                </Link>
              </div>
            </div>

            {/* Right Column - Stats Card */}
            <div className="lg:col-span-5 flex items-center justify-end">
              <div className="w-full border border-steel bg-bunker flex flex-col shadow-2xl">
                <div className="px-4 py-2.5 border-b border-steel bg-obsidian flex items-center justify-between">
                  <span className="font-mono text-[10px] text-ash uppercase tracking-wider">
                    EXPERT NETWORK // LIVE
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-verified"></span>
                    <span className="text-[10px] font-mono text-verified uppercase">Sync</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-3 px-4 border-b border-steel/50">
                    <span className="text-xs font-mono text-chalk/80">100+ Verified Experts</span>
                    <span className="text-[10px] font-mono text-cyan bg-cyan/10 border border-cyan/20 px-2 py-0.5">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 border-b border-steel/50">
                    <span className="text-xs font-mono text-chalk/80">Avg. Match Time: 48h</span>
                    <span className="text-[10px] font-mono text-verified bg-verified/10 border border-verified/20 px-2 py-0.5">OPTIMIZED</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 border-b border-steel/50">
                    <span className="text-xs font-mono text-chalk/80">Client Satisfaction: 98%</span>
                    <span className="text-[10px] font-mono text-verified bg-verified/10 border border-verified/20 px-2 py-0.5">VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4">
                    <span className="text-xs font-mono text-chalk/80">Skills Coverage: 25+ Domains</span>
                    <span className="text-[10px] font-mono text-amber bg-amber/10 border border-amber/20 px-2 py-0.5">COMPLETE</span>
                  </div>
                </div>

                <div className="px-4 py-2 border-t border-steel text-[10px] font-mono text-ash bg-obsidian/50 flex justify-between">
                  <span>4 metrics</span>
                  <span>Network status: operational</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEC_02 // WORKFLOW - HOW IT WORKS */}
        <section id="how-it-works" className="relative w-full py-20 px-6 border-b border-steel">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_02 // WORKFLOW
          </span>

          <div className="max-w-[1400px] mx-auto mt-8">
            <div className="mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-frost">How It Works</h2>
              <p className="text-sm text-amber font-mono mt-2 uppercase">SIMPLE WORKFLOW // 7 STEPS TO YOUR EXPERT</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Step 1 */}
              <div className="border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">01</span>
                <Users className="text-amber w-6 h-6 mb-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide">Visit Our Website</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Client lands on our platform seeking cybersecurity expertise.
                </p>
              </div>

              {/* Step 2 */}
              <div className="border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">02</span>
                <ArrowRight className="text-amber w-6 h-6 mb-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide">Click 'Hire'</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Fill out a simple request form outlining your specific needs.
                </p>
              </div>

              {/* Step 3 */}
              <div className="border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">03</span>
                <Mail className="text-amber w-6 h-6 mb-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide">We Receive Request</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Sent directly to our team's inbox for immediate attention.
                </p>
              </div>

              {/* Step 4 */}
              <div className="border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">04</span>
                <Search className="text-amber w-6 h-6 mb-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide">Team Reviews</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  We analyze scope, deadline, budget, and expertise needed.
                </p>
              </div>

              {/* Step 5 */}
              <div className="border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">05</span>
                <Shield className="text-amber w-6 h-6 mb-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide">Posted to Network</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Shared securely with our private network of 100+ specialists.
                </p>
              </div>

              {/* Step 6 */}
              <div className="border border-steel bg-bunker p-6 relative flex flex-col">
                <span className="absolute top-3 right-4 text-[10px] font-mono text-ash/30">06</span>
                <CheckCircle className="text-amber w-6 h-6 mb-4" />
                <h3 className="text-sm font-semibold text-frost uppercase tracking-wide">Skill Matching</h3>
                <p className="text-xs text-chalk/70 leading-relaxed mt-2 flex-1">
                  Experts with the right skills and availability are shortlisted.
                </p>
              </div>
            </div>

            {/* Step 7 - Distinct */}
            <div className="border-2 border-amber bg-amber/5 p-8 relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <span className="absolute top-3 right-4 text-[10px] font-mono text-amber/40">07</span>
              <Handshake className="text-amber w-12 h-12 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-frost uppercase tracking-wide">Client–Expert Connection</h3>
                <p className="text-sm text-chalk/80 leading-relaxed mt-2">
                  We schedule a meeting or share contact details to kick off your engagement. Simple, direct, and efficient.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEC_03 // METRICS - KEY FIGURES SECTION */}
        <section className="relative w-full py-16 px-6 border-b border-steel bg-obsidian">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_03 // METRICS
          </span>
          <div className="max-w-[1400px] mx-auto mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="border border-steel bg-bunker p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-amber/50 transition-colors">
                <Users className="text-amber w-6 h-6" />
                <span className="text-[11px] font-mono text-frost uppercase">100+ Cybersecurity Experts</span>
              </div>
              <div className="border border-steel bg-bunker p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-amber/50 transition-colors">
                <Globe className="text-amber w-6 h-6" />
                <span className="text-[11px] font-mono text-frost uppercase">1 Simple Hiring Website</span>
              </div>
              <div className="border border-steel bg-bunker p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-amber/50 transition-colors">
                <Mail className="text-amber w-6 h-6" />
                <span className="text-[11px] font-mono text-frost uppercase">Direct Email-Based Requests</span>
              </div>
              <div className="border border-steel bg-bunker p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-amber/50 transition-colors">
                <Search className="text-amber w-6 h-6" />
                <span className="text-[11px] font-mono text-frost uppercase">Manual Expert Matching</span>
              </div>
              <div className="border border-steel bg-bunker p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-amber/50 transition-colors">
                <Handshake className="text-amber w-6 h-6" />
                <span className="text-[11px] font-mono text-frost uppercase">Client–Expert Connection</span>
              </div>
              <div className="border border-steel bg-bunker p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-amber/50 transition-colors">
                <Zap className="text-amber w-6 h-6" />
                <span className="text-[11px] font-mono text-frost uppercase">Fast Hiring Process</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative w-full py-24 px-6 border-b border-steel bg-bunker flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-frost mb-4">Ready to find your cybersecurity expert?</h2>
          <p className="text-chalk/80 mb-8 max-w-lg text-sm">
            No account needed. No commitment. Just tell us what you need.
          </p>
          <HireModal>
            <button className="bg-amber text-obsidian font-mono text-sm font-bold px-8 py-4 hover:bg-frost transition-colors inline-flex items-center gap-2 uppercase tracking-wider">
              SUBMIT YOUR REQUIREMENT →
            </button>
          </HireModal>
        </section>

        {/* SEC_04 // SYSTEM_MONITOR - MASCOT SECTION */}
        <section className="relative w-full py-10 px-6 bg-bunker">
          <span className="absolute top-4 left-6 text-[10px] font-mono text-ash/40 uppercase tracking-[0.3em]">
            SEC_04 // SYSTEM_MONITOR
          </span>

          <div className="max-w-[1400px] mx-auto flex items-center gap-8 mt-6">
            <div className="border border-steel p-1.5 flex-shrink-0 bg-obsidian">
              <Image 
                src="/analyst-luxury.svg" 
                alt="Cyberthink Analyst" 
                width={120} 
                height={120} 
                className="w-28 h-28 object-contain"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-ash">
                CYBERTHINK ANALYST // SYSTEM MONITOR
              </h3>
              <p className="text-xs text-chalk/60 max-w-lg leading-relaxed">
                Connecting enterprises with world-class cybersecurity talent. Currently serving clients across 15+ industries.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-verified"></span>
                <span className="text-verified font-mono text-[10px]">ONLINE</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
