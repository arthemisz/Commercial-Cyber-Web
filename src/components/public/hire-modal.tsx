'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Shield } from 'lucide-react';

interface HireModalProps {
  children: React.ReactNode;
}

export function HireModal({ children }: HireModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    description: '',
    skills: '',
    deadline: '',
    budget: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/hire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit hiring request.');
      }

      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      description: '',
      skills: '',
      deadline: '',
      budget: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-bunker border-steel sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-chalk font-sans text-xl">
            <Shield className="w-5 h-5 text-amber" />
            Submit Hiring Request
          </DialogTitle>
          <DialogDescription className="text-ash font-sans">
            Provide details about your project and security needs.
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-obsidian border border-steel flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber" />
            </div>
            <p className="text-frost font-sans text-sm">
              Request received! Our team will review your requirements and reach out within 24 hours.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-obsidian border border-steel text-ash hover:text-chalk hover:border-amber transition-colors font-mono uppercase text-xs tracking-wider"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-wider text-ash block">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-wider text-ash block">Work Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="company" className="text-[10px] font-mono uppercase tracking-wider text-ash block">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-[10px] font-mono uppercase tracking-wider text-ash block">Project Subject *</label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="skills" className="text-[10px] font-mono uppercase tracking-wider text-ash block">Required Skills *</label>
              <input
                id="skills"
                name="skills"
                type="text"
                required
                placeholder="e.g. Penetration Testing, Cloud Security"
                value={formData.skills}
                onChange={handleChange}
                className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="text-[10px] font-mono uppercase tracking-wider text-ash block">Project Description *</label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="deadline" className="text-[10px] font-mono uppercase tracking-wider text-ash block">Timeline / Deadline</label>
                <input
                  id="deadline"
                  name="deadline"
                  type="text"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="budget" className="text-[10px] font-mono uppercase tracking-wider text-ash block">Budget Range</label>
                <input
                  id="budget"
                  name="budget"
                  type="text"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full bg-obsidian border border-steel text-chalk font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="text-kill font-mono text-xs">
                {errorMessage}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-amber text-obsidian font-mono uppercase tracking-wider text-sm px-4 py-3 hover:bg-frost transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
