import { Repository, RoadmapStep, RoadmapTopic } from '../types';
import { analysisService } from './analysisService';
import { storageService } from './storageService';

const roadmapCache = new Map<string, RoadmapStep[]>();

export const roadmapService = {
  async getRoadmapForRepository(repo: Repository): Promise<RoadmapStep[]> {
    const key = repo.name.toLowerCase();
    if (roadmapCache.has(key)) {
      return this.applyUserProgress(repo.id, roadmapCache.get(key)!);
    }

    try {
      // Analyze repo with Gemini to get custom architecture, tech stack & generated roadmap
      const analysis = await analysisService.analyzeRepository(repo);

      if (Array.isArray(analysis.generatedRoadmap) && analysis.generatedRoadmap.length > 0) {
        roadmapCache.set(key, analysis.generatedRoadmap);
        return this.applyUserProgress(repo.id, analysis.generatedRoadmap);
      }

      // If AI did not return a complete roadmap array, construct dynamic steps based on repo analysis
      const dynamicSteps = this.buildDynamicStepsFromAnalysis(repo, analysis);
      roadmapCache.set(key, dynamicSteps);
      return this.applyUserProgress(repo.id, dynamicSteps);
    } catch (err) {
      console.warn('Roadmap generation failed, creating dynamic language-based roadmap:', err);
      const fallbackSteps = this.buildDynamicStepsFromAnalysis(repo, {
        repository: repo.name,
        languages: repo.languages.map((l) => l.name),
        frameworks: [repo.primaryLanguage, 'Standard Library'],
        dependencies: [],
        architecture: repo.architectureNotes,
        importantFiles: [{ path: 'README.md', role: 'Documentation & Setup' }],
        learningRequirements: repo.prerequisites,
        difficulty: repo.difficulty,
        contributionAreas: ['Documentation', 'Unit Tests', 'Bug Fixes'],
        summary: repo.description,
      });
      roadmapCache.set(key, fallbackSteps);
      return this.applyUserProgress(repo.id, fallbackSteps);
    }
  },

  buildDynamicStepsFromAnalysis(
    repo: Repository,
    analysis: {
      languages?: string[];
      frameworks?: string[];
      learningRequirements?: string[];
      importantFiles?: { path: string; role: string }[];
      [key: string]: any;
    }
  ): RoadmapStep[] {
    const lang = repo.primaryLanguage || 'TypeScript';
    const mainFramework = analysis.frameworks?.[0] || 'Core Architecture';
    const importantFiles = Array.isArray(analysis.importantFiles) ? analysis.importantFiles : [];

    return [
      {
        stepNumber: '01',
        title: `${lang} Fundamentals & Mental Model`,
        status: 'completed',
        progress: 100,
        difficulty: 'Beginner',
        whyItMatters: `Every component in ${repo.name} relies on idiomatic ${lang} patterns and async conventions.`,
        topics: [`${lang} ES/Standard syntax`, 'Async runtime flows', 'Module modularity'],
        summary: `Understand foundational primitives and runtime expectations of ${lang} codebases.`,
        estimatedTime: '4–6 hrs',
        relatedFiles: importantFiles.slice(0, 1).map((f) => f.path),
        checklist: [
          { id: 'step1-1', name: `${lang} syntax & object destructuring`, completed: true, resourceTitle: `${lang} Guide` },
          { id: 'step1-2', name: 'Asynchronous event propagation', completed: true, resourceTitle: 'Async execution model' },
          { id: 'step1-3', name: 'Module imports & tree-shaking', completed: true, resourceTitle: 'Module resolution' },
        ],
      },
      {
        stepNumber: '02',
        title: `${mainFramework} Architecture & Patterns`,
        status: 'in_progress',
        progress: 50,
        difficulty: 'Intermediate',
        whyItMatters: `The project heavily utilizes ${mainFramework} conventions for layout and state lifecycle.`,
        topics: [`${mainFramework} lifecycle`, 'State transitions', 'Component composition'],
        summary: `Explore how ${repo.repoName} structures components and encapsulates state logic.`,
        estimatedTime: '6–8 hrs',
        relatedFiles: importantFiles.slice(1, 2).map((f) => f.path),
        checklist: [
          { id: 'step2-1', name: 'Component hierarchy & composition', completed: true, resourceTitle: 'Composition Patterns' },
          { id: 'step2-2', name: 'State management & reactivity', completed: false, resourceTitle: 'Reactivity Model' },
          { id: 'step2-3', name: 'Performance memoization', completed: false, resourceTitle: 'Performance Checklist' },
        ],
      },
      {
        stepNumber: '03',
        title: 'Project Architecture & Internal Utilities',
        status: 'next',
        progress: 0,
        difficulty: 'Intermediate',
        whyItMatters: 'Maintainers expect new PRs to reuse shared utility helpers instead of introducing external packages.',
        topics: ['Internal helper libraries', 'Design token usage', 'Type contracts'],
        summary: `Trace code execution through ${repo.repoName}'s public interfaces down into utility helpers.`,
        estimatedTime: '4 hrs',
        relatedFiles: importantFiles.slice(2, 4).map((f) => f.path),
        checklist: [
          { id: 'step3-1', name: 'Explore utility helper functions in repo', completed: false },
          { id: 'step3-2', name: 'Trace data flow from input to output', completed: false },
        ],
      },
      {
        stepNumber: '04',
        title: 'Testing Suite & Validation Matrix',
        status: 'locked',
        progress: 0,
        difficulty: 'Intermediate',
        whyItMatters: 'Every pull request must pass the automated CI pipeline before maintainer review.',
        topics: ['Unit test runner', 'Regression tests', 'Lint & typecheck'],
        summary: 'Run local test commands and write unit tests that verify fixes.',
        estimatedTime: '3 hrs',
        relatedFiles: ['package.json'],
        checklist: [
          { id: 'step4-1', name: 'Run test suite locally', completed: false },
          { id: 'step4-2', name: 'Verify test coverage for changes', completed: false },
        ],
      },
      {
        stepNumber: '05',
        title: 'Contribution Workflow & First Pull Request',
        status: 'locked',
        progress: 0,
        difficulty: 'Beginner',
        whyItMatters: 'Submitting a clean pull request with proper commit conventions ensures quick merge.',
        topics: ['Fork & Branch', 'Commit message conventions', 'PR template checklist'],
        summary: 'Final checklist to submit your contribution smoothly to maintainers.',
        estimatedTime: '2 hrs',
        relatedFiles: ['.github/CONTRIBUTING.md'],
        checklist: [
          { id: 'step5-1', name: 'Read CONTRIBUTING.md guidelines', completed: false },
          { id: 'step5-2', name: 'Open draft pull request with reproduction link', completed: false },
        ],
      },
    ];
  },

  applyUserProgress(repoId: string, steps: RoadmapStep[]): RoadmapStep[] {
    const completedTopicIds = new Set(storageService.getRepoCompletedTopicIds(repoId));

    return steps.map((step, idx) => {
      const updatedChecklist = step.checklist.map((topic) => {
        const isDone = completedTopicIds.has(topic.id);
        return { ...topic, completed: isDone };
      });

      const totalTopics = updatedChecklist.length;
      const doneTopics = updatedChecklist.filter((t) => t.completed).length;
      const progress = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

      let status = step.status;
      if (progress === 100) {
        status = 'completed';
      } else if (progress > 0) {
        status = 'in_progress';
      } else if (idx === 0 || (steps[idx - 1] && steps[idx - 1].progress && steps[idx - 1].progress! >= 80)) {
        status = 'next';
      }

      return {
        ...step,
        checklist: updatedChecklist,
        progress,
        status,
      };
    });
  },

  toggleTopic(repoId: string, stepNumber: string, topicId: string): boolean {
    return storageService.toggleTopicCompleted(repoId, stepNumber, topicId);
  },

  calculateOverallProgress(steps: RoadmapStep[]): number {
    let totalTopics = 0;
    let completedTopics = 0;
    steps.forEach((step) => {
      totalTopics += step.checklist.length;
      completedTopics += step.checklist.filter((t) => t.completed).length;
    });
    return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  },
};
