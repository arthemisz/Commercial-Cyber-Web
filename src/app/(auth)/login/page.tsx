'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

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

    if (data.session === null) {
      // Possible MFA requirement flow (simplified)
      setMfaRequired(true);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // In a real app we'd verify MFA challenge here
    router.push('/mfa-verify');
  };

  return (
    <div className="w-full max-w-md p-8 rounded-lg bg-slate-surface border border-graphite shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-mono text-signal tracking-widest font-bold">CYBERCONSULT</h1>
        <p className="text-ash text-sm mt-2">Secure access to your engagements</p>
      </div>

      {!mfaRequired ? (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-frost mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-void border border-graphite rounded-md px-3 py-2 text-frost focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal transition-colors"
              placeholder="operator@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-frost mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-void border border-graphite rounded-md px-3 py-2 text-frost focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-kill text-sm mt-2 p-2 bg-kill/10 rounded">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-void bg-signal hover:bg-signal/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-void" /> : 'Sign In'}
          </button>

          <div className="mt-4 text-center text-sm text-ash">
            Don't have an account?{' '}
            <Link href="/register" className="text-signal hover:underline">
              Register
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <div className="text-sm text-frost mb-4">
            Two-factor authentication is required for this account.
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-void bg-signal hover:bg-signal/90 focus:outline-none transition-colors"
          >
            Proceed to Verification
          </button>
        </form>
      )}
    </div>
  );
}
