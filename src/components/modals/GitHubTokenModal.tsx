import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { Key, X, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface GitHubTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubTokenModal: React.FC<GitHubTokenModalProps> = ({ isOpen, onClose }) => {
  const [tokenInput, setTokenInput] = useState(() => storageService.getGitHubToken());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.setGitHubToken(tokenInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    storageService.setGitHubToken('');
    setTokenInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-sm text-neutral-900">GitHub API Rate Limit Token</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Optional Rate Limit Boost</span>
            </div>
            <p className="leading-relaxed">
              GitHub limits unauthenticated IP requests to 60/hr. Adding a personal access token (public_repo scope only) increases your limit to 5,000 requests/hour.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 block">
              Personal Access Token (classic or fine-grained):
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-2xs text-neutral-500">
              Stored exclusively in your local browser storage. Never transmitted to third-party trackers.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Generate on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2">
              {tokenInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Token</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
