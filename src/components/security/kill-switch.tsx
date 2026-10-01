'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface KillSwitchProps {
  engagementId: string;
  currentStatus: string;
  killSwitchTriggeredAt?: string;
  killSwitchReason?: string;
}

export function KillSwitch({ engagementId, currentStatus, killSwitchTriggeredAt, killSwitchReason }: KillSwitchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(currentStatus);

  const isTestingActive = localStatus === 'TESTING_ACTIVE';
  const isAborted = localStatus === 'ABORTED' || localStatus === 'ABORTED_KILL_SWITCH';
  const canConfirm = reason.length >= 10 && confirmText === 'HALT';

  const handleKillSwitch = async () => {
    if (!canConfirm) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/engagements/${engagementId}/kill-switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        setLocalStatus('ABORTED_KILL_SWITCH');
        setIsOpen(false);
      } else {
        console.error('Failed to trigger kill switch');
      }
    } catch (error) {
      console.error('Error triggering kill switch', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTestingActive && !isAborted) {
    return (
      <div className="border border-steel bg-bunker p-5 opacity-50">
        <div className="text-[10px] font-mono text-ash uppercase tracking-[0.2em] mb-4">
          EMERGENCY HALT // KILL_SWITCH
        </div>
        <div className="font-mono font-bold text-lg text-ash">OFFLINE</div>
        <p className="font-mono text-[11px] text-ash mt-2">Emergency halt is only available when testing is active.</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn("border bg-bunker p-5 flex flex-col transition-colors", isAborted ? "border-kill" : "border-steel")}>
        <div className="text-[10px] font-mono text-ash uppercase tracking-[0.2em] mb-4">
          EMERGENCY HALT // KILL_SWITCH
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className={cn("font-mono font-bold text-lg", isAborted ? "text-kill animate-pulse" : "text-verified")}>
            {isAborted ? "ENGAGED" : "STANDBY"}
          </div>
          
          <button 
            disabled={isAborted}
            onClick={() => setIsOpen(true)}
            className={cn(
              "relative flex items-center w-14 h-7 border-2 border-steel bg-obsidian transition-colors cursor-pointer",
              isAborted && "border-kill cursor-not-allowed"
            )}
          >
            <div className={cn(
              "absolute w-5 h-5 transition-all duration-200 transform",
              isAborted ? "translate-x-7 bg-kill" : "translate-x-1 bg-verified"
            )} />
          </button>
        </div>

        <p className="font-mono text-[11px] text-ash mb-6">
          {isAborted ? "All authorized testing has been terminated." : "Immediately terminates all authorized testing."}
        </p>

        {isAborted && (killSwitchTriggeredAt || reason) && (
          <div className="bg-obsidian border border-steel p-3 mb-6">
            {killSwitchTriggeredAt && <p className="font-mono text-[11px] text-chalk"><span className="text-ash">Time:</span> {new Date(killSwitchTriggeredAt).toLocaleString()}</p>}
            {reason && <p className="font-mono text-[11px] text-chalk mt-1"><span className="text-ash">Reason:</span> {reason}</p>}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-steel/50 flex flex-col gap-1">
          <div className="font-mono text-[10px] text-ash/60">LATENCY: 12ms</div>
          <div className="font-mono text-[10px] text-ash/60">LAST CHECK: {new Date().toLocaleTimeString()}</div>
          <div className="font-mono text-[10px] text-ash/60">PROTOCOL: BROADCAST_HALT</div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90">
          <div className="bg-bunker border border-kill p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-kill" />
              <h3 className="text-lg font-bold text-kill uppercase tracking-widest font-mono">CONFIRM HALT</h3>
            </div>
            
            <p className="text-chalk mb-6 text-[11px] font-mono leading-relaxed">
              This action will instantly revoke all testing authorization and notify all active consultants to cease operations immediately. This action cannot be undone.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-ash mb-2 uppercase">Reason for halt (min 10 chars)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-obsidian border border-steel p-3 text-chalk font-mono text-[11px] focus:outline-none focus:border-kill resize-none h-24"
                  placeholder="Critical production impact detected..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-ash mb-2 uppercase">Type "HALT" to confirm</label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full bg-obsidian border border-steel p-3 text-kill font-bold font-mono text-[11px] focus:outline-none focus:border-kill uppercase tracking-widest"
                  placeholder="HALT"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-steel bg-gunmetal text-ash hover:text-frost hover:bg-steel transition-colors font-mono uppercase text-[11px]"
              >
                Cancel
              </button>
              <button
                onClick={handleKillSwitch}
                disabled={!canConfirm || isLoading}
                className={cn(
                  "px-6 py-2 border font-mono font-bold uppercase tracking-wider text-[11px] transition-all",
                  canConfirm
                    ? "bg-kill border-kill text-obsidian hover:bg-kill/90"
                    : "bg-obsidian border-steel text-ash cursor-not-allowed"
                )}
              >
                {isLoading ? 'ENGAGING...' : 'ENGAGE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
