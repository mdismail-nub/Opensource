import React, { useState } from 'react';
import { Issue, FileToUnderstand, IssueAnalysis } from '../../types';
import { SkillMatchBadge } from '../common/SkillMatchBadge';
import { DifficultyBadge } from '../common/DifficultyBadge';
import { CodePreviewModal } from '../modals/CodePreviewModal';
import { analysisService } from '../../services/analysisService';
import { githubService } from '../../services/githubService';
import { storageService } from '../../services/storageService';
import {
  ArrowLeft,
  CheckCircle2,
  FileCode,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Play,
  Terminal,
  Copy,
  Check,
  Bookmark,
  Loader2,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface IssueDetailPageProps {
  issue: Issue;
  onBack: () => void;
  onViewProject: (repoName: string) => void;
}

export const IssueDetailPage: React.FC<IssueDetailPageProps> = ({
  issue: initialIssue,
  onBack,
  onViewProject,
}) => {
  const [issue, setIssue] = useState<Issue>(initialIssue);
  const [checklist, setChecklist] = useState(initialIssue.preparationChecklist);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<FileToUnderstand | null>(null);
  const [prepWorkflowStarted, setPrepWorkflowStarted] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaved, setIsSaved] = useState(() => storageService.isIssueSaved(initialIssue.id));
  const [fileFetchLoading, setFileFetchLoading] = useState<string | null>(null);

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleToggleSave = () => {
    const updated = storageService.toggleSaveIssue(issue);
    setIsSaved(updated);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysis: IssueAnalysis = await analysisService.analyzeIssue(issue);
      const updatedFiles: FileToUnderstand[] = analysis.filesToUnderstand.map((f) => ({
        path: f.path,
        lines: f.lines || 'lines 1–50',
        role: f.role,
        codeSnippet: `// ${f.path}\n// Context: ${f.role}\n// Use "View on GitHub" to inspect complete file`,
        language: f.path.endsWith('.ts') || f.path.endsWith('.tsx') ? 'typescript' : 'javascript',
        githubUrl: `https://github.com/${issue.repository}/blob/main/${f.path}`,
      }));

      const newChecklist = analysis.preparation.map((prep, idx) => ({
        id: `prep-ai-${idx}`,
        label: prep,
        checked: idx === 0,
      }));

      const enrichedIssue: Issue = {
        ...issue,
        difficulty: analysis.difficulty || issue.difficulty,
        whatYoullNeed: analysis.requiredSkills.length > 0 ? analysis.requiredSkills : issue.whatYoullNeed,
        youAlreadyKnow: analysis.whyItMatches.alreadyKnow,
        youShouldReview: analysis.whyItMatches.shouldReview,
        filesToUnderstand: updatedFiles.length > 0 ? updatedFiles : issue.filesToUnderstand,
        preparationChecklist: newChecklist.length > 0 ? newChecklist : checklist,
        aiAnalysis: analysis,
      };

      setIssue(enrichedIssue);
      setChecklist(enrichedIssue.preparationChecklist);
    } catch (e) {
      console.warn('Failed to analyze issue with AI:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenFile = async (file: FileToUnderstand) => {
    const [owner, repo] = issue.repository.split('/');
    if (!owner || !repo) {
      setSelectedFileForPreview(file);
      return;
    }

    setFileFetchLoading(file.path);
    try {
      const liveFile = await githubService.fetchFileContent(owner, repo, file.path);
      setSelectedFileForPreview({
        ...file,
        codeSnippet: liveFile.content || file.codeSnippet,
        githubUrl: liveFile.htmlUrl,
      });
    } catch (e) {
      setSelectedFileForPreview(file);
    } finally {
      setFileFetchLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to issues</span>
      </button>

      {/* Header Container */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        {/* Repo & Issue Number */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] font-mono border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewProject(issue.repository)}
              className="text-[var(--primary)] hover:underline font-semibold"
            >
              {issue.repository}
            </button>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-500 font-bold tabular-nums">#{issue.issueNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-blue-50 text-[var(--primary)] border-blue-200'
                  : 'bg-white text-neutral-600 border-[var(--border)] hover:bg-neutral-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[var(--primary)]' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
            </button>

            {issue.htmlUrl && (
              <a
                href={issue.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[22px] sm:text-[28px] font-bold text-[var(--foreground)] tracking-tight leading-snug">
          {issue.title}
        </h1>

        {/* Labels & Matching Metas */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <SkillMatchBadge score={issue.skillMatch} size="md" />
          <DifficultyBadge difficulty={issue.difficulty} />
          {issue.labels.map((lbl) => (
            <span
              key={lbl}
              className="text-[12px] font-mono text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded border border-neutral-200/80"
            >
              {lbl}
            </span>
          ))}
          <span className="text-[12px] text-neutral-400 flex items-center gap-1 ml-auto font-mono">
            <Clock className="w-3.5 h-3.5" />
            {issue.createdAt}
          </span>
        </div>

        {/* Gemini Analysis Action Banner */}
        <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] text-neutral-600">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>AI Issue Assistant: Analyze difficulty, prerequisites, and affected files</span>
          </div>
          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="px-3.5 py-1.5 text-xs font-semibold text-[var(--primary)] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Issue with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze with Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Issue Description & File Guidance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Full Description */}
          <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                {issue.author.avatar ? (
                  <img src={issue.author.avatar} alt={issue.author.name} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 text-xs flex items-center justify-center font-bold">
                    {issue.author.name.slice(0, 1)}
                  </div>
                )}
                <span className="text-[13px] font-semibold text-neutral-900 font-mono">
                  {issue.author.name}
                </span>
                <span className="text-[12px] text-neutral-400">opened this issue</span>
              </div>

              <div className="flex items-center gap-1 text-[12px] text-neutral-500 font-mono">
                <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                <span>{issue.commentsCount} comments</span>
              </div>
            </div>

            <div className="text-[14px] text-neutral-700 leading-relaxed font-normal whitespace-pre-wrap">
              {issue.fullDescription}
            </div>
          </div>

          {/* Files to Understand & Inspect */}
          <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-[18px] font-semibold text-[var(--foreground)]">Relevant Files</h3>
              </div>
              <span className="text-[12px] text-neutral-500 font-mono">Click to preview</span>
            </div>

            <div className="space-y-2.5">
              {issue.filesToUnderstand.map((file) => (
                <div
                  key={file.path}
                  onClick={() => handleOpenFile(file)}
                  className="p-3.5 rounded-lg border border-[var(--border)] hover:border-neutral-300 hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <FileCode className="w-4 h-4 text-neutral-400 group-hover:text-[var(--primary)] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[13px] font-mono font-semibold text-neutral-900 group-hover:text-[var(--primary)] block truncate">
                        {file.path}
                      </span>
                      <p className="text-[12px] text-neutral-500 mt-0.5 line-clamp-1">
                        {file.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {fileFetchLoading === file.path ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    ) : (
                      <span className="text-[11px] font-mono text-neutral-400 group-hover:text-neutral-700">
                        Preview →
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Match Breakdown & Interactive Preparation Checklist */}
        <div className="space-y-6">
          {/* Match Rationale */}
          <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[var(--foreground)]">Match Breakdown</h3>
              <SkillMatchBadge score={issue.skillMatch} size="sm" />
            </div>

            <div className="space-y-3 text-[13px]">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 block mb-1">
                  You already know
                </span>
                <div className="flex flex-wrap gap-1">
                  {issue.youAlreadyKnow.map((item) => (
                    <span key={item} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono text-[11px]">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 block mb-1">
                  You should review
                </span>
                <div className="flex flex-wrap gap-1">
                  {issue.youShouldReview.map((item) => (
                    <span key={item} className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-mono text-[11px]">
                      • {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preparation Checklist */}
          <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[var(--foreground)]">Preparation Steps</h3>
              <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                {checklist.filter((c) => c.checked).length}/{checklist.length}
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors cursor-pointer select-none text-[13px] ${
                    item.checked
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : 'bg-white border-[var(--border)] hover:bg-neutral-50 text-neutral-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleChecklist(item.id)}
                    className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500 mt-0.5 shrink-0"
                  />
                  <span className={item.checked ? 'line-through text-neutral-400' : 'font-normal'}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Git Clone Helper Box */}
            <div className="p-3 bg-neutral-900 rounded-lg text-white font-mono text-[12px] space-y-1.5">
              <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                <span>Clone Repo Locally:</span>
                <button
                  onClick={() => handleCopy(`git clone https://github.com/${issue.repository}.git`, 'clone')}
                  className="text-neutral-300 hover:text-white flex items-center gap-1"
                >
                  {copiedCmd === 'clone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'clone' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-blue-300 truncate">git clone https://github.com/{issue.repository}.git</p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Preview Modal */}
      {selectedFileForPreview && (
        <CodePreviewModal
          file={selectedFileForPreview}
          onClose={() => setSelectedFileForPreview(null)}
        />
      )}
    </div>
  );
};
