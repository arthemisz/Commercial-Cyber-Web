'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScopeTag } from './scope-tag';

interface ScopeBuilderProps {
  engagementId: string;
  initialScope?: any;
  onComplete: (hash: string) => void;
}

function Toggle({ checked, onChange, label, warning }: { checked: boolean, onChange: (c: boolean) => void, label: string, warning?: string }) {
  return (
    <div className="flex items-start space-x-4 py-3 border-b border-steel last:border-0">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer border border-steel transition-colors duration-200 ease-in-out focus:outline-none focus:border-amber",
          checked ? "bg-amber" : "bg-obsidian"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform bg-bunker shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
      <div className="flex flex-col">
        <span className="text-[11px] font-mono text-chalk uppercase tracking-wide">{label}</span>
        {checked && warning && (
          <span className="text-[10px] text-amber mt-1 font-mono flex items-center">
            <span className="mr-1">⚠</span> {warning}
          </span>
        )}
      </div>
    </div>
  );
}

async function generateHash(data: string) {
  const msgUint8 = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function ScopeBuilder({ engagementId, initialScope, onComplete }: ScopeBuilderProps) {
  const [step, setStep] = useState(1);
  
  const [inScopeList, setInScopeList] = useState<string[]>(initialScope?.inScope || []);
  const [outOfScopeList, setOutOfScopeList] = useState<string[]>(initialScope?.outOfScope || []);
  const [inputValue, setInputValue] = useState('');
  const [outInputValue, setOutInputValue] = useState('');

  const [startTime, setStartTime] = useState(initialScope?.startTime || '');
  const [endTime, setEndTime] = useState(initialScope?.endTime || '');
  const [timezone, setTimezone] = useState(initialScope?.timezone || 'UTC');
  const [rateLimit, setRateLimit] = useState(initialScope?.rateLimit || '10');

  const [permissions, setPermissions] = useState({
    dos: false,
    phishing: false,
    physical: false,
    productionDb: false,
    social: false,
    wireless: false
  });

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

    try {
      await fetch(`/api/engagements/${engagementId}/sign-roe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: computedHash, role: 'client' }),
      });
    } catch (err) {
      console.warn('Sign RoE API sync note:', err);
    }

    onComplete(computedHash);
  };

  const steps = ['TARGET SCOPE', 'TESTING WINDOW', 'PERMISSIONS', 'REVIEW & SIGN'];

  return (
    <div className="max-w-3xl mx-auto bg-bunker border border-steel p-6 font-mono">
      <div className="flex items-center justify-between mb-8 border-b border-steel pb-6">
        {steps.map((label, index) => {
          const s = index + 1;
          const isActive = step === s;
          const isPast = step > s;
          return (
            <div key={label} className="flex flex-col items-center">
              <div className={cn(
                "w-6 h-6 flex items-center justify-center text-[10px] border mb-2",
                isActive ? "border-amber bg-amber/10 text-amber" :
                isPast ? "border-verified bg-verified/10 text-verified" :
                "border-steel bg-obsidian text-ash"
              )}>
                {s}
              </div>
              <span className={cn(
                "text-[9px] uppercase tracking-wider",
                isActive ? "text-frost" : "text-ash"
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mb-8 min-h-[300px]">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-frost mb-1">Define Target Scope</h3>
              <p className="text-[10px] text-ash">Add CIDR ranges, domains, URLs, or repositories.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-chalk uppercase block">In-Scope Targets</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addScope(inScopeList, setInScopeList, inputValue, setInputValue)}
                  placeholder="192.168.1.0/24 OR *.EXAMPLE.COM"
                  className="flex-1 bg-obsidian border border-steel px-3 py-2 text-chalk text-[11px] placeholder:text-ash/50 focus:border-amber focus:outline-none transition-colors"
                />
                <button 
                  onClick={() => addScope(inScopeList, setInScopeList, inputValue, setInputValue)}
                  className="px-4 py-2 bg-gunmetal border border-steel text-amber text-[11px] uppercase hover:bg-steel transition-colors"
                >
                  ADD
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-obsidian border border-steel min-h-[60px]">
                {inScopeList.length === 0 && <span className="text-ash text-[10px] uppercase">No targets defined</span>}
                {inScopeList.map((item, i) => (
                  <ScopeTag key={i} label={item} onRemove={() => removeScope(inScopeList, setInScopeList, i)} />
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-steel">
              <label className="text-[10px] text-chalk uppercase block">Explicitly Excluded Targets</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={outInputValue}
                  onChange={(e) => setOutInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addScope(outOfScopeList, setOutOfScopeList, outInputValue, setOutInputValue)}
                  placeholder="192.168.1.50 OR PROD-DB.EXAMPLE.COM"
                  className="flex-1 bg-obsidian border border-steel px-3 py-2 text-chalk text-[11px] placeholder:text-ash/50 focus:border-amber focus:outline-none transition-colors"
                />
                <button 
                  onClick={() => addScope(outOfScopeList, setOutOfScopeList, outInputValue, setOutInputValue)}
                  className="px-4 py-2 bg-gunmetal border border-steel text-amber text-[11px] uppercase hover:bg-steel transition-colors"
                >
                  ADD
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-obsidian border border-steel min-h-[60px]">
                {outOfScopeList.length === 0 && <span className="text-ash text-[10px] uppercase">No exclusions defined</span>}
                {outOfScopeList.map((item, i) => (
                  <ScopeTag key={i} label={item} onRemove={() => removeScope(outOfScopeList, setOutOfScopeList, i)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-frost mb-1">Testing Window & Limits</h3>
              <p className="text-[10px] text-ash">Define engagement constraints.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-obsidian p-4 border border-steel">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-ash block">Start Time</label>
                <input 
                  type="datetime-local" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-gunmetal border border-steel px-3 py-2 text-chalk text-[11px] focus:border-amber focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-ash block">End Time</label>
                <input 
                  type="datetime-local" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-gunmetal border border-steel px-3 py-2 text-chalk text-[11px] focus:border-amber focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-ash block">Timezone</label>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-gunmetal border border-steel px-3 py-2 text-chalk text-[11px] focus:border-amber focus:outline-none"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-ash block">Max Requests/Second</label>
                <input 
                  type="number" 
                  min="1"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                  className="w-full bg-gunmetal border border-steel px-3 py-2 text-chalk text-[11px] focus:border-amber focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-frost mb-1">Attack Vector Permissions</h3>
              <p className="text-[10px] text-ash">Select authorized testing methodologies. Deny by default.</p>
            </div>
            
            <div className="bg-obsidian border border-steel p-4 space-y-2">
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
            <h3 className="text-xs uppercase tracking-wider text-frost mb-4">Review & Sign Rules of Engagement</h3>
            
            <div className="bg-obsidian border border-steel p-5 space-y-6 text-[11px]">
              <div>
                <h4 className="text-ash mb-2 uppercase tracking-wider text-[10px]">Scope Highlights</h4>
                <p className="text-chalk"><span className="text-verified font-bold">{inScopeList.length}</span> IN-SCOPE ITEMS</p>
                <p className="text-chalk"><span className="text-kill font-bold">{outOfScopeList.length}</span> EXCLUDED ITEMS</p>
              </div>
              
              <div className="border-t border-steel pt-4">
                <h4 className="text-ash mb-2 uppercase tracking-wider text-[10px]">Window</h4>
                <p className="text-chalk">{startTime || 'NOT SET'} TO {endTime || 'NOT SET'} ({timezone})</p>
                <p className="text-chalk">RATE LIMIT: {rateLimit} REQ/SEC</p>
              </div>

              <div className="border-t border-steel pt-4">
                <h4 className="text-ash mb-2 uppercase tracking-wider text-[10px]">Authorized Vectors</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.entries(permissions).filter(([_, v]) => v).map(([k]) => (
                    <span key={k} className="border border-amber/30 bg-amber/10 text-amber px-2 py-0.5 text-[9px] uppercase">{k}</span>
                  ))}
                  {Object.values(permissions).every(v => !v) && <span className="text-ash uppercase text-[10px]">None authorized</span>}
                </div>
              </div>

              {isSigned && (
                <div className="mt-4 pt-4 border-t border-steel">
                  <h4 className="text-ash mb-2 uppercase tracking-wider text-[10px]">Digital Signature (SHA-256)</h4>
                  <div className="bg-gunmetal p-3 text-verified break-all text-[10px] border border-verified/30">
                    {hash}
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-verified text-[10px] uppercase">
                    <span>SIGNED: {new Date(signTime).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-steel">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1 || isSigned}
          className="px-4 py-2 border border-steel bg-obsidian text-[11px] text-ash hover:text-frost hover:bg-gunmetal disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase"
        >
          BACK
        </button>
        
        {step < 4 ? (
          <button
            onClick={() => setStep(Math.min(4, step + 1))}
            className="px-4 py-2 bg-gunmetal border border-steel text-frost text-[11px] uppercase hover:bg-steel transition-colors"
          >
            NEXT
          </button>
        ) : (
          !isSigned ? (
            <button
              onClick={handleSign}
              className="px-6 py-2 bg-amber text-obsidian font-bold text-[11px] hover:bg-amber/90 transition-colors uppercase tracking-wider border border-amber"
            >
              SIGN RULES OF ENGAGEMENT
            </button>
          ) : (
            <span className="text-verified text-[11px] uppercase flex items-center gap-2 border border-verified/30 bg-verified/10 px-4 py-2">
              FINALIZED
            </span>
          )
        )}
      </div>
    </div>
  );
}
