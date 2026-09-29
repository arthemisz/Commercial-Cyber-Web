'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Loader2, ShieldCheck, Clock } from 'lucide-react';

export default function MfaVerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);

    // Normally you'd get the factorId from the initial signIn response
    // This is simplified
    const factorId = 'mfa-factor-id'; // placeholder
    
    try {
      /*
      const { data, error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: fullCode
      });
      if (verifyError) throw verifyError;
      */
      
      // Simulation for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (fullCode === '000000') throw new Error('Invalid code');
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setLoading(false);
      // Reset code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-lg bg-slate-surface border border-graphite shadow-2xl">
      <div className="text-center mb-8">
        <ShieldCheck className="w-12 h-12 text-signal mx-auto mb-4" />
        <h1 className="text-xl font-medium text-frost">Two-Factor Authentication</h1>
        <p className="text-ash text-sm mt-2">Enter the 6-digit code from your authenticator app</p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-between gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-mono bg-void border border-graphite rounded-md text-frost focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal transition-colors"
            />
          ))}
        </div>

        <div className="flex items-center justify-center text-sm text-ash gap-2">
          <Clock className="w-4 h-4" />
          <span>Code expires in <span className="font-mono text-signal">{timeLeft}s</span></span>
        </div>

        {error && <div className="text-kill text-sm text-center bg-kill/10 p-2 rounded">{error}</div>}

        <button
          type="submit"
          disabled={loading || code.join('').length !== 6}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-void bg-signal hover:bg-signal/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin text-void" /> : 'Verify'}
        </button>
      </form>
    </div>
  );
}
