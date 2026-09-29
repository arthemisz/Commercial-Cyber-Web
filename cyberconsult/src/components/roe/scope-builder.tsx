'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScopeTag } from './scope-tag';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface ScopeBuilderProps {
  engagementId: string;
  initialScope?: any;
  onComplete: (hash: string) => void;
}

// Inline toggle component
function Toggle({ checked, onChange, label, warning }: { checked: boolean, onChange: (c: boolean) => void, label: string, warning?: string }) {
  return (
    <div className="flex items-start space-x-4 py-3 border-b border-slate-surface last:border-0">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2 focus:ring-offset-void",
          checked ? "bg-signal" : "bg-graphite"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-frost font-mono">{label}</span>
        {checked && warning && (
          <span className="text-xs text-caution mt-1 flex items-center">
            <span className="mr-1">⚠</span> {warning}
          </span>
        )}
      </div>
    </div>
  );
}

// Utility to generate a pseudo-hash on the client
async function generateHash(data: string) {
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function ScopeBuilder({ engagementId, initialScope, onComplete }: ScopeBuilderProps) {
  const [step, setStep] = useState(1);
  
  // Step 1 State
  const [inScopeList, setInScopeList] = useState<string[]>(initialScope?.inScope || []);
  const [outOfScopeList, setOutOfScopeList] = useState<string[]>(initialScope?.outOfScope || []);
  const [inputValue, setInputValue] = useState('');
  const [outInputValue, setOutInputValue] = useState('');

  // Step 2 State
  const [startTime, setStartTime] = useState(initialScope?.startTime || '');
  const [endTime, setEndTime] = useState(initialScope?.endTime || '');
  const [timezone, setTimezone] = useState(initialScope?.timezone || 'UTC');
  const [rateLimit, setRateLimit] = useState(initialScope?.rateLimit || '10');

  // Step 3 State
  const [permissions, setPermissions] = useState({
    dos: false,
    phishing: false,
    physical: false,
    productionDb: false,
    social: false,
    wireless: false
  });

  // Step 4 State
  const [hash, setHash] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [signTime, setSignTime] = useState('');

  const addScope = (list: string[], setList: (l: string[]) => void, value: string, setValue: (v: string) => void) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      setValue('');
    }
  };

  const removeScope = (list: string[], setList: (l: string[]) => void, index: number) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleSign = async () => {
    const dataToSign = JSON.stringify({
      engagementId,
      inScopeList,
      outOfScopeList,
      startTime,
      endTime,
      timezone,
      rateLimit,
      permissions
    });
    
    const computedHash = await generateHash(dataToSign);
    setHash(computedHash);
    setIsSigned(true);
    setSignTime(new Date().toISOString());
    onComplete(computedHash);
  };

  const steps = ['Target Scope', 'Testing Window', 'Permissions', 'Review & Sign'];

  return (
    <div className="max-w-3xl mx-auto bg-void border border-slate-surface rounded-xl p-6 shadow-xl">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, index) => {
          const s = index + 1;
          const isActive = step === s;
          const isPast = step > s;
          return (
            <div key={label} className="flex flex-col items-center relative z-10">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm border-2 transition-colors",
                isActive ? "border-signal text-signal bg-signal/10" :
                isPast ? "border-verified text-verified bg-verified/10" :
                "border-slate-surface text-ash"
              )}>
                {isPast ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              <span className={cn(
                "text-xs font-mono mt-2 absolute top-full w-24 text-center -ml-8",
                isActive ? "text-frost" : "text-ash"
              )}>
                {label}
              </span>
            </div>
          );
        })}
        {/* Connecting lines */}
        <div className="absolute top-10 left-8 right-8 h-0.5 bg-slate-surface -z-10 hidden sm:block" />
      </div>

      <div className="mt-12 mb-8 min-h-[300px]">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-mono text-frost">Define Target Scope</h3>
            <p className="text-sm text-ash mb-4">Add CIDR ranges, domains, URLs, or repositories.</p>
            
            <div className="space-y-2">
              <label className="text-sm font-mono text-frost block">In-Scope Targets</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addScope(inScopeList, setInScopeList, inputValue, setInputValue)}
                  placeholder="e.g. 192.168.1.0/24 or *.example.com"
                  className="flex-1 bg-graphite border border-slate-surface rounded px-3 py-2 text-frost font-mono text-sm focus:border-signal focus:ring-1 focus:ring-signal outline-none"
                />
                <button 
                  onClick={() => addScope(inScopeList, setInScopeList, inputValue, setInputValue)}
                  className="px-4 py-2 bg-slate-surface text-frost rounded font-mono text-sm hover:bg-graphite transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-graphite/50 rounded min-h-[60px] border border-slate-surface/50">
                {inScopeList.length === 0 && <span className="text-ash text-sm italic">No targets defined</span>}
                {inScopeList.map((item, i) => (
                  <ScopeTag key={i} label={item} onRemove={() => removeScope(inScopeList, setInScopeList, i)} />
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-sm font-mono text-frost block">Explicitly Excluded Targets</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={outInputValue}
                  onChange={(e) => setOutInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addScope(outOfScopeList, setOutOfScopeList, outInputValue, setOutInputValue)}
                  placeholder="e.g. 192.168.1.50 or production-db.example.com"
                  className="flex-1 bg-graphite border border-slate-surface rounded px-3 py-2 text-frost font-mono text-sm focus:border-signal focus:ring-1 focus:ring-signal outline-none"
                />
                <button 
                  onClick={() => addScope(outOfScopeList, setOutOfScopeList, outInputValue, setOutInputValue)}
                  className="px-4 py-2 bg-slate-surface text-frost rounded font-mono text-sm hover:bg-graphite transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-graphite/50 rounded min-h-[60px] border border-slate-surface/50">
                {outOfScopeList.length === 0 && <span className="text-ash text-sm italic">No exclusions defined</span>}
                {outOfScopeList.map((item, i) => (
                  <ScopeTag key={i} label={item} onRemove={() => removeScope(outOfScopeList, setOutOfScopeList, i)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-mono text-frost">Testing Window & Limits</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-mono text-ash block">Start Time</label>
                <input 
                  type="datetime-local" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-graphite border border-slate-surface rounded px-3 py-2 text-frost font-mono text-sm focus:border-signal outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-ash block">End Time</label>
                <input 
                  type="datetime-local" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-graphite border border-slate-surface rounded px-3 py-2 text-frost font-mono text-sm focus:border-signal outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-ash block">Timezone</label>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-graphite border border-slate-surface rounded px-3 py-2 text-frost font-mono text-sm focus:border-signal outline-none"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-ash block">Max Requests/Second</label>
                <input 
                  type="number" 
                  min="1"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                  className="w-full bg-graphite border border-slate-surface rounded px-3 py-2 text-frost font-mono text-sm focus:border-signal outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-mono text-frost mb-4">Attack Vector Permissions</h3>
            <p className="text-sm text-ash mb-6">Select authorized testing methodologies. Deny by default.</p>
            
            <div className="bg-graphite/30 rounded-lg p-4 border border-slate-surface space-y-2">
              <Toggle 
                label="Denial of Service (DoS)" 
                checked={permissions.dos} 
                onChange={(v) => setPermissions({...permissions, dos: v})} 
                warning="May cause production outages or severe performance degradation."
              />
              <Toggle 
                label="Phishing / Email Spoofing" 
                checked={permissions.phishing} 
                onChange={(v) => setPermissions({...permissions, phishing: v})} 
              />
              <Toggle 
                label="Social Engineering (Vishing, SMS)" 
                checked={permissions.social} 
                onChange={(v) => setPermissions({...permissions, social: v})} 
              />
              <Toggle 
                label="Production Database Access" 
                checked={permissions.productionDb} 
                onChange={(v) => setPermissions({...permissions, productionDb: v})} 
                warning="Risk of data corruption or unauthorized disclosure of PII."
              />
              <Toggle 
                label="Physical Intrusion" 
                checked={permissions.physical} 
                onChange={(v) => setPermissions({...permissions, physical: v})} 
                warning="Requires physical access waivers and local legal clearance."
              />
              <Toggle 
                label="Wireless Networks (Wi-Fi, RFID)" 
                checked={permissions.wireless} 
                onChange={(v) => setPermissions({...permissions, wireless: v})} 
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-mono text-frost">Review & Sign Rules of Engagement</h3>
            
            <div className="bg-graphite/40 border border-slate-surface rounded-lg p-5 space-y-6 font-mono text-sm">
              <div>
                <h4 className="text-ash mb-2 uppercase tracking-wider text-xs">Scope Highlights</h4>
                <p className="text-frost"><span className="text-verified">{inScopeList.length}</span> In-Scope Items</p>
                <p className="text-frost"><span className="text-kill">{outOfScopeList.length}</span> Excluded Items</p>
              </div>
              
              <div>
                <h4 className="text-ash mb-2 uppercase tracking-wider text-xs">Window</h4>
                <p className="text-frost">{startTime || 'Not set'} to {endTime || 'Not set'} ({timezone})</p>
                <p className="text-frost">Rate Limit: {rateLimit} req/sec</p>
              </div>

              <div>
                <h4 className="text-ash mb-2 uppercase tracking-wider text-xs">Authorized Vectors</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.entries(permissions).filter(([_, v]) => v).map(([k]) => (
                    <span key={k} className="bg-signal/20 text-signal px-2 py-0.5 rounded text-xs">{k}</span>
                  ))}
                  {Object.values(permissions).every(v => !v) && <span className="text-ash">None authorized</span>}
                </div>
              </div>

              {isSigned && (
                <div className="mt-4 pt-4 border-t border-slate-surface">
                  <h4 className="text-ash mb-2 uppercase tracking-wider text-xs">Digital Signature (SHA-256)</h4>
                  <div className="bg-graphite p-3 rounded text-signal break-all text-xs border border-signal/30">
                    {hash}
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-verified">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Signed on {new Date(signTime).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-surface">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1 || isSigned}
          className="flex items-center gap-2 px-4 py-2 font-mono text-sm text-ash hover:text-frost disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        
        {step < 4 ? (
          <button
            onClick={() => setStep(Math.min(4, step + 1))}
            className="flex items-center gap-2 px-4 py-2 bg-slate-surface hover:bg-graphite text-frost rounded font-mono text-sm transition-colors border border-slate-surface"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          !isSigned ? (
            <button
              onClick={handleSign}
              className="px-6 py-2 bg-signal hover:bg-signal/90 text-void font-bold rounded font-mono text-sm transition-colors uppercase tracking-wider"
            >
              Sign Rules of Engagement
            </button>
          ) : (
            <span className="text-verified font-mono text-sm uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Finalized
            </span>
          )
        )}
      </div>
    </div>
  );
}
