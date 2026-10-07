'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="bg-bunker border border-steel flex flex-col shadow-2xl relative">
      <div className="p-8 pb-6 border-b border-steel flex items-center gap-3.5">
        <Image
          src="/Logo.svg"
          alt="Cyberthink Solutions"
          width={44}
          height={44}
          className="w-11 h-11 object-contain shrink-0"
        />
        <div>
          <h1 className="font-mono font-bold tracking-[0.2em] text-frost text-2xl mb-0.5">CYBERTHINK</h1>
          <p className="text-[10px] font-mono text-ash tracking-wider">SECURE ACCESS TERMINAL</p>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-ash">
              IDENTIFIER [EMAIL]
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors"
              placeholder="operator@cyberthink.io"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-ash">
              ACCESS KEY [PASSWORD]
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors"
              placeholder="••••••••••••••••"
            />
          </div>

          {error && (
            <div className="text-kill text-[11px] font-mono bg-kill/5 border border-kill/20 p-2">
              [ERR] {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber text-obsidian font-mono text-xs font-semibold w-full py-2.5 hover:bg-frost transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/register" className="text-cyan hover:text-amber text-[11px] font-mono transition-colors">
            NO CREDENTIALS? INITIATE PROVISIONING →
          </Link>
        </div>
      </div>

      <div className="border-t border-steel bg-obsidian p-3 flex justify-center">
        <span className="text-[9px] font-mono text-ash/30 uppercase tracking-widest">
          ENCRYPTION: AES-256-GCM · AUTH: SUPABASE · MFA: TOTP
        </span>
      </div>
    </div>
  );
}
