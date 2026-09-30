import React, { useState } from 'react';
import { ViewType } from '../../types';
import {
  Github,
  Search,
  Map,
  CheckCircle2,
  GitPullRequest,
  ArrowRight,
  Terminal,
  Code2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (view: ViewType) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      number: '01',
      title: 'Connect your GitHub',
      subtitle: 'We understand your existing skills and experience.',
      icon: <Github className="w-5 h-5 text-neutral-900" />,
      detail:
        'By scanning your public repositories, languages, and previous pull requests, OpenSourcePath builds an initial skill graph so you never get recommended codebases beyond your current level.',
      previewText: 'Skills detected: React (Intermediate), TypeScript (Basics), Tailwind CSS (Proficient)',
    },
    {
      number: '02',
      title: 'Explore projects',
      subtitle: 'Discover repositories that match your interests.',
      icon: <Search className="w-5 h-5 text-blue-600" />,
      detail:
        'Browse curated open-source projects filtered by technology, difficulty, active maintainer response rate, and the count of beginner-friendly issues waiting for contributors.',
      previewText: 'Found 42 repositories with >85% skill compatibility for your profile.',
    },
    {
      number: '03',
      title: 'Follow your roadmap',
      subtitle: 'Learn the technologies and concepts required by the project.',
      icon: <Map className="w-5 h-5 text-emerald-600" />,
      detail:
        'Every project has distinct architecture. Instead of diving in blind, complete a targeted 5-step roadmap covering component models, state patterns, and test requirements.',
      previewText: 'Roadmap step 2: Master React Hooks and custom state reducers before PR submission.',
    },
    {
      number: '04',
      title: 'Find your issue',
      subtitle: 'Get issues matched to your current skill level.',
      icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />,
      detail:
        'Filter good first issues with high skill match ratings. We highlight the files you need to understand and pre-identify prerequisites.',
      previewText: 'Matched Issue #421: "Add loading state to UserCard" — 94% skill match.',
    },
    {
      number: '05',
      title: 'Make your contribution',
      subtitle: 'Understand the codebase and start contributing.',
      icon: <GitPullRequest className="w-5 h-5 text-blue-600" />,
      detail:
        'Follow step-by-step local preparation guides, run tests, follow conventional commit formats, and open your pull request with complete confidence.',
      previewText: 'Pull request opened with verified checklist and automated tests passing.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700">
          <span>The Open Source Onboarding Standard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          How OpenSourcePath Works
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed">
          From your first repository bookmark to a merged pull request in five clear, structured steps.
        </p>
      </div>

      {/* 5-Step Visual Progression Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((step, idx) => {
          const isSelected = activeStep === idx + 1;
          return (
            <div
              key={step.number}
              onClick={() => setActiveStep(idx + 1)}
              className={`p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-100'
                  : 'bg-white border-neutral-200/90 hover:border-neutral-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-bold text-neutral-400">
                    {step.number}
                  </span>
                  <div className="p-2 rounded-lg bg-neutral-50">{step.icon}</div>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 mb-1">{step.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{step.subtitle}</p>
              </div>

              <div className="pt-3 mt-4 border-t border-neutral-100">
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-blue-600' : 'text-neutral-400'
                  }`}
                >
                  {isSelected ? 'Viewing Stage' : 'Select Stage'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Interactive Visual */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Stage {steps[activeStep - 1].number}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                {steps[activeStep - 1].title}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {steps[activeStep - 1].detail}
            </p>

            <div className="p-4 bg-neutral-50 border border-neutral-200/70 rounded-xl space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                Live Simulation Output:
              </span>
              <p className="text-xs font-mono text-neutral-800">
                {steps[activeStep - 1].previewText}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onNavigate('explore')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Try It in Exploration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {activeStep < 5 && (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
                >
                  Next Step ({steps[activeStep].number})
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-neutral-950 text-neutral-200 rounded-xl p-5 border border-neutral-800 shadow-md font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                opensourcepath-engine
              </span>
              <span>step-{steps[activeStep - 1].number}</span>
            </div>

            <p className="text-neutral-400"># Current pipeline execution</p>
            <div className="space-y-1 text-emerald-400">
              <p>&gt; opensourcepath match --profile @iammdismail</p>
              <p className="text-neutral-300">✓ Parsed 24 public commits</p>
              <p className="text-neutral-300">✓ Detected React 18/19 components</p>
              <p className="text-neutral-300">✓ Computed confidence index: 0.94</p>
              <p className="text-blue-400">→ Ready for repository onboarding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-6">
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          Ready to open your first pull request?
        </h3>
        <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
          Start exploring repositories with active maintainers looking for contributions right now.
        </p>
        <button
          onClick={() => onNavigate('explore')}
          className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
        >
          Explore Open Source Projects
        </button>
      </div>
    </div>
  );
};
