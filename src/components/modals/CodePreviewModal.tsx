import React, { useState } from 'react';
import { FileToUnderstand } from '../../types';
import { X, Copy, Check, FileCode, ExternalLink } from 'lucide-react';

interface CodePreviewModalProps {
  file: FileToUnderstand | null;
  onClose: () => void;
}

export const CodePreviewModal: React.FC<CodePreviewModalProps> = ({ file, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!file) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(file.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-neutral-900 text-neutral-100 rounded-xl shadow-2xl border border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-2 min-w-0">
            <FileCode className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="font-mono text-xs text-neutral-200 truncate">{file.path}</span>
            <span className="text-xs text-neutral-500 font-mono">({file.lines})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role Explainer */}
        <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800 text-xs text-neutral-300">
          <span className="text-neutral-400 font-medium">Context: </span>
          {file.role}
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto max-h-[460px] bg-neutral-950 font-mono text-xs leading-relaxed text-neutral-200">
          <pre className="whitespace-pre">
            <code>{file.codeSnippet}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Read-only repository file reference</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
