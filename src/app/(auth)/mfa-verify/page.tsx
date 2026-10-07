'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
      setError('INCOMPLETE TOKEN');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulation for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (fullCode === '000000') throw new Error('INVALID TOKEN SIGNATURE');
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'VERIFICATION FAILED');
      setLoading(false);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="bg-bunker border border-steel flex flex-col shadow-2xl">
      <div className="p-6 border-b border-steel flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Image
            src="/Logo.svg"
            alt="Cyberthink Solutions"
            width={40}
            height={40}
            className="w-10 h-10 object-contain shrink-0"
          />
          <div>
            <h1 className="font-mono font-bold tracking-[0.2em] text-frost text-xl mb-0.5">MFA_CHALLENGE</h1>
            <p className="text-[10px] font-mono text-ash tracking-wider">SECONDARY AUTHENTICATION REQUIRED</p>
          </div>
        </div>
        <div className="text-[10px] font-mono border border-steel px-2 py-1 bg-obsidian">
          <span className="text-ash">TTL: </span>
          <span className={timeLeft < 10 ? "text-kill" : "text-amber"}>{timeLeft}s</span>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-ash text-center">
              INPUT TIME-BASED ONE-TIME PASSWORD
            </label>
            <div className="flex justify-center gap-2">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-10 h-12 text-center text-lg font-mono bg-obsidian border border-steel text-chalk focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors selection:bg-amber/30"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="text-kill text-[11px] font-mono bg-kill/5 border border-kill/20 p-2 text-center">
              [ERR] {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.join('').length !== 6}
            className="bg-amber text-obsidian font-mono text-xs font-semibold w-full py-2.5 hover:bg-frost transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'VALIDATING...' : 'AUTHORIZE SESSION'}
          </button>
        </form>
      </div>

      <div className="border-t border-steel bg-obsidian p-2 flex justify-center">
        <span className="text-[9px] font-mono text-ash/30 uppercase tracking-widest">
          ALGORITHM: HMAC-SHA1 · DIGITS: 6 · PERIOD: 30S
        </span>
      </div>
    </div>
  );
}
