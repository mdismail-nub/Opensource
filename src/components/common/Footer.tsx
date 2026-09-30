import React from 'react';
import { ViewType } from '../../types';
import { GitBranch, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-white border-t border-neutral-200/80 mt-auto py-12 text-sm text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-bold">
                <GitBranch className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="font-bold tracking-tight text-neutral-900">OpenSourcePath</span>
            </div>
            <p className="text-sm text-neutral-500 max-w-sm">
              Find projects. Learn what matters. Start contributing. Empowering developers worldwide to make meaningful open source contributions.
            </p>
            <div className="text-xs text-neutral-400 pt-2 flex items-center gap-1">
              <span>Built with respect for open source builders</span>
              <Heart className="w-3 h-3 text-red-500 inline fill-red-500" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-900 tracking-wider uppercase mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Explore Repositories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('issues')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Good First Issues
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Learning Roadmaps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-blue-600 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Developer Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-900 tracking-wider uppercase mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  GitHub Guides <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://opensource.guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  Open Source Guide <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <span className="text-neutral-400">Open Source Path Spec v1.0</span>
              </li>
              <li>
                <span className="text-neutral-400">MIT Open License</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} OpenSourcePath. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-600 cursor-pointer">Privacy</span>
            <span className="hover:text-neutral-600 cursor-pointer">Terms</span>
            <span className="hover:text-neutral-600 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
