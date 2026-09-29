'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

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

  if (isAborted) {
    return (
      <div className="border-2 border-kill/30 bg-kill/5 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
        <XCircle className="w-16 h-16 text-kill" />
        <div>
          <h2 className="text-xl font-bold text-kill uppercase tracking-wider font-mono">Emergency Halt Engaged</h2>
          <p className="text-sm text-ash mt-2">All authorized testing has been terminated.</p>
        </div>
        {(killSwitchTriggeredAt || reason) && (
          <div className="bg-void p-4 rounded text-left w-full max-w-md font-mono text-sm border border-slate-surface">
            {killSwitchTriggeredAt && <p className="text-frost"><span className="text-ash">Time:</span> {new Date(killSwitchTriggeredAt).toLocaleString()}</p>}
            {reason && <p className="text-frost mt-2"><span className="text-ash">Reason:</span> {reason}</p>}
          </div>
        )}
      </div>
    );
  }

  if (!isTestingActive) {
    return (
      <div className="border border-slate-surface bg-void p-6 rounded-xl flex flex-col items-center justify-center text-center opacity-70">
        <div className="w-24 h-24 rounded-full border-4 border-slate-surface flex items-center justify-center mb-4">
          <span className="text-ash font-mono text-xs uppercase text-center">System<br/>Offline</span>
        </div>
        <h2 className="text-lg font-mono text-ash uppercase tracking-widest">Kill Switch Disabled</h2>
        <p className="text-sm text-ash/70 mt-2">Emergency halt is only available when testing is active.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border-2 border-kill/30 bg-kill/5 p-8 rounded-xl flex flex-col items-center justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "relative group flex items-center justify-center w-32 h-32 rounded-full",
            "bg-gradient-to-b from-kill to-kill/80 shadow-lg shadow-kill/20",
            "active:scale-95 transition-transform duration-100",
            "hover:shadow-kill/40 focus:outline-none focus:ring-4 focus:ring-kill/50"
          )}
        >
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-kill animate-ping opacity-75 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full border border-kill/50" />
          <span className="font-mono font-bold text-void text-center leading-tight uppercase tracking-widest z-10">
            Halt
          </span>
        </button>
        <h2 className="mt-8 text-xl font-bold text-kill uppercase tracking-wider font-mono">Emergency Halt</h2>
        <p className="text-sm text-ash mt-2 text-center max-w-sm">
          Immediately terminates all authorized testing
        </p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="bg-graphite border border-kill/30 p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-kill" />
              <h3 className="text-2xl font-bold text-kill uppercase tracking-wide font-mono">Confirm Emergency Halt</h3>
            </div>
            
            <p className="text-frost mb-4 text-sm leading-relaxed">
              This action will instantly revoke all testing authorization and notify all active consultants to cease operations immediately. This action cannot be undone.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-mono text-ash mb-1">Reason for halt (min 10 chars)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-void border border-slate-surface rounded p-3 text-frost font-mono text-sm focus:outline-none focus:border-kill focus:ring-1 focus:ring-kill resize-none h-24"
                  placeholder="e.g., Critical production impact detected..."
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-ash mb-1">Type "HALT" to confirm</label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full bg-void border border-slate-surface rounded p-3 text-kill font-bold font-mono focus:outline-none focus:border-kill focus:ring-1 focus:ring-kill uppercase tracking-widest"
                  placeholder="HALT"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded text-ash hover:text-frost transition-colors font-mono uppercase text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleKillSwitch}
                disabled={!canConfirm || isLoading}
                className={cn(
                  "px-6 py-2 rounded font-mono font-bold uppercase tracking-wider text-sm transition-all",
                  canConfirm
                    ? "bg-kill text-void hover:bg-kill/90 shadow-lg shadow-kill/20"
                    : "bg-kill/20 text-kill/50 cursor-not-allowed"
                )}
              >
                {isLoading ? 'Engaging...' : 'Engage Kill Switch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
