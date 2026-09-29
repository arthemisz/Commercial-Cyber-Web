'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Loader2, User, Shield } from 'lucide-react';

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
      setError('Passwords do not match');
      return;
    }
    if (!role) {
      setError('Please select a role');
      return;
    }
    if (!terms) {
      setError('You must accept the terms of service');
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
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md p-8 rounded-lg bg-slate-surface border border-graphite shadow-2xl text-center">
        <Shield className="w-16 h-16 text-verified mx-auto mb-4" />
        <h2 className="text-xl font-medium text-frost mb-2">Check your email</h2>
        <p className="text-ash mb-6">
          We've sent a verification link to <span className="text-frost">{email}</span>. Please click the link to verify your account.
        </p>
        <Link href="/login" className="text-signal hover:underline text-sm">
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-lg bg-slate-surface border border-graphite shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-mono text-signal tracking-widest font-bold">CYBERCONSULT</h1>
        <p className="text-ash text-sm mt-2">Create your secure account</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-frost mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-void border border-graphite rounded-md px-3 py-2 text-frost focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal transition-colors"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-frost mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-void border border-graphite rounded-md px-3 py-2 text-frost focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-frost mb-1">Confirm</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-void border border-graphite rounded-md px-3 py-2 text-frost focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-frost mb-2">I am a...</label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setRole('CLIENT')}
              className={cn(
                "border rounded-md p-4 cursor-pointer text-center transition-all",
                role === 'CLIENT' 
                  ? "border-signal bg-signal/10" 
                  : "border-graphite bg-void hover:border-graphite/80"
              )}
            >
              <User className={cn("w-6 h-6 mx-auto mb-2", role === 'CLIENT' ? "text-signal" : "text-ash")} />
              <span className={cn("text-sm font-medium", role === 'CLIENT' ? "text-signal" : "text-ash")}>Client</span>
            </div>
            <div
              onClick={() => setRole('CONSULTANT')}
              className={cn(
                "border rounded-md p-4 cursor-pointer text-center transition-all",
                role === 'CONSULTANT' 
                  ? "border-signal bg-signal/10" 
                  : "border-graphite bg-void hover:border-graphite/80"
              )}
            >
              <Shield className={cn("w-6 h-6 mx-auto mb-2", role === 'CONSULTANT' ? "text-signal" : "text-ash")} />
              <span className={cn("text-sm font-medium", role === 'CONSULTANT' ? "text-signal" : "text-ash")}>Consultant</span>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="h-4 w-4 rounded border-graphite bg-void text-signal focus:ring-signal focus:ring-offset-void"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-ash">
            I accept the <a href="#" className="text-signal hover:underline">Terms of Service</a>
          </label>
        </div>

        {error && <div className="text-kill text-sm mt-2 p-2 bg-kill/10 rounded border border-kill/20">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-void bg-signal hover:bg-signal/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin text-void" /> : 'Create Account'}
        </button>

        <div className="mt-4 text-center text-sm text-ash">
          Already have an account?{' '}
          <Link href="/login" className="text-signal hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
