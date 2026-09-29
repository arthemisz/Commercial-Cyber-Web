'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'CONSULTANT' | null>(null);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('ACCESS KEYS DO NOT MATCH');
      return;
    }
    if (!role) {
      setError('CLEARANCE LEVEL NOT SELECTED');
      return;
    }
    if (!terms) {
      setError('PROTOCOL ACCEPTANCE REQUIRED');
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message.toUpperCase());
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-bunker border border-steel p-8 text-center">
        <div className="w-12 h-12 bg-verified/10 border border-verified flex items-center justify-center mx-auto mb-6">
          <Shield className="w-6 h-6 text-verified" />
        </div>
        <h2 className="font-mono text-frost text-lg mb-2 tracking-widest">PROVISIONING INITIATED</h2>
        <p className="text-ash font-mono text-[11px] mb-8 leading-relaxed">
          VERIFICATION PACKET DISPATCHED TO<br/>
          <span className="text-amber">{email}</span>
        </p>
        <Link href="/login" className="text-cyan hover:text-amber text-[11px] font-mono transition-colors">
          ← RETURN TO GATEWAY
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bunker border border-steel flex flex-col shadow-2xl">
      <div className="p-6 border-b border-steel">
        <h1 className="font-mono font-bold tracking-[0.2em] text-frost text-xl mb-1">CYBERTHINK</h1>
        <p className="text-[10px] font-mono text-ash tracking-wider">IDENTITY PROVISIONING MODULE</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-ash">
              IDENTIFIER [EMAIL]
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-ash">
                ACCESS KEY
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-ash">
                VERIFY KEY
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-ash">
              REQUESTED CLEARANCE
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setRole('CLIENT')}
                className={cn(
                  "border p-3 cursor-pointer text-center transition-all",
                  role === 'CLIENT' 
                    ? "border-amber bg-amber/5 text-amber" 
                    : "border-steel bg-obsidian text-ash hover:border-graphite"
                )}
              >
                <span className="text-[11px] font-mono tracking-widest block">CLIENT</span>
              </div>
              <div
                onClick={() => setRole('CONSULTANT')}
                className={cn(
                  "border p-3 cursor-pointer text-center transition-all",
                  role === 'CONSULTANT' 
                    ? "border-amber bg-amber/5 text-amber" 
                    : "border-steel bg-obsidian text-ash hover:border-graphite"
                )}
              >
                <span className="text-[11px] font-mono tracking-widest block">CONSULTANT</span>
              </div>
            </div>
          </div>

          <div className="flex items-start mt-4 bg-obsidian p-3 border border-steel">
            <input
              type="checkbox"
              id="terms"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5 h-3 w-3 appearance-none border border-steel checked:bg-amber checked:border-amber cursor-pointer"
            />
            <label htmlFor="terms" className="ml-3 block text-[10px] font-mono text-ash leading-relaxed">
              I ACKNOWLEDGE AND ACCEPT THE <a href="#" className="text-cyan hover:text-amber transition-colors">OPERATIONAL PROTOCOLS</a> AND DATA HANDLING Directives.
            </label>
          </div>

          {error && (
            <div className="text-kill text-[11px] font-mono bg-kill/5 border border-kill/20 p-2">
              [ERR] {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber text-obsidian font-mono text-xs font-semibold w-full py-2.5 hover:bg-frost transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'PROCESSING...' : 'REQUEST PROVISIONING'}
          </button>

          <div className="mt-4 text-center">
            <Link href="/login" className="text-ash hover:text-cyan text-[10px] font-mono transition-colors uppercase tracking-widest">
              ← ABORT TO GATEWAY
            </Link>
          </div>
        </form>
      </div>
      
      <div className="border-t border-steel bg-obsidian p-2 flex justify-center">
        <span className="text-[9px] font-mono text-ash/30 uppercase tracking-widest">
          SYS_AUDIT: LOGGING ACTIVE
        </span>
      </div>
    </div>
  );
}
