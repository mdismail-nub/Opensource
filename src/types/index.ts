export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type RoadmapStepStatus = 'completed' | 'in_progress' | 'next' | 'locked';

export interface RoadmapTopic {
  id: string;
  name: string;
  completed: boolean;
  resourceTitle?: string;
  resourceEstimate?: string;
}

export interface RoadmapStep {
  stepNumber: string;
  title: string;
  status: RoadmapStepStatus;
  progress?: number;
  topics: string[];
  checklist: RoadmapTopic[];
  summary: string;
  whyItMatters?: string;
  prerequisites?: string[];
  difficulty?: DifficultyLevel;
  estimatedTime?: string;
  relatedFiles?: string[];
}

export interface FileToUnderstand {
  path: string;
  lines: string;
  role: string;
  codeSnippet: string;
  language: string;
  githubUrl?: string;
}

export interface Issue {
  id: string;
  issueNumber: number;
  title: string;
  repository: string;
  repoId: string;
  labels: string[];
  difficulty: DifficultyLevel;
  skillMatch: number;
  descriptionPreview: string;
  fullDescription: string;
  expectedBehavior: string;
  reproductionSteps?: string[];
  codeSnippet?: string;
  whatYoullNeed: string[];
  youAlreadyKnow: string[];
  youShouldReview: string[];
  filesToUnderstand: FileToUnderstand[];
  preparationChecklist: {
    id: string;
    label: string;
    checked: boolean;
  }[];
  createdAt: string;
  commentsCount: number;
  htmlUrl?: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    role: string;
  };
  assignee?: {
    name: string;
    handle: string;
  };
  aiAnalysis?: IssueAnalysis;
}

export interface RepositoryContributor {
  name: string;
  handle: string;
  avatar: string;
  commits: number;
  role: string;
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  repoName: string;
  description: string;
  stars: number;
  starsFormatted: string;
  forks: number;
  contributorsCount: number;
  openIssuesCount: number;
  primaryLanguage: string;
  languages: { name: string; percentage: number; color: string }[];
  topics: string[];
  skillMatch: number;
  beginnerIssuesCount: number;
  difficulty: DifficultyLevel;
  lastUpdated: string;
  license: string;
  defaultBranch: string;
  roadmap: RoadmapStep[];
  readmePreview: string;
  architectureNotes: string[];
  prerequisites: string[];
  contributors: RepositoryContributor[];
  activity: {
    commitsThisMonth: number;
    avgPrResponseTime: string;
    releasesThisYear: number;
    mergedPrsLast30Days: number;
  };
  htmlUrl?: string;
  fileTree?: string[];
  isCustomAnalyzed?: boolean;
}

export type ViewType =
  | 'landing'
  | 'explore'
  | 'repo-detail'
  | 'roadmap'
  | 'issues'
  | 'issue-detail'
  | 'dashboard'
  | 'how-it-works';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Strong';

export interface UserSkillItem {
  skill: string;
  proficiency: SkillProficiency;
}

export interface UserProfile {
  name: string;
  githubUsername: string;
  avatar: string;
  role: string;
  skills: string[];
  skillLevels?: UserSkillItem[];
  stats: {
    projectsExploring: number;
    issuesCompleted: number;
    pullRequests: number;
    merged: number;
  };
  currentLearning: {
    repoId: string;
    repoName: string;
    topic: string;
    progress: number;
    nextSubtopic: string;
    stepNumber: string;
  };
  contributionStage: 'Learn' | 'Explore' | 'Prepare' | 'Issue' | 'Pull Request' | 'Contribution';
}

export interface RepositoryAnalysis {
  repository: string;
  languages: string[];
  frameworks: string[];
  dependencies: string[];
  architecture: string[];
  importantFiles: {
    path: string;
    role: string;
  }[];
  learningRequirements: string[];
  difficulty: DifficultyLevel;
  contributionAreas: string[];
  summary: string;
  generatedRoadmap?: RoadmapStep[];
}

export interface IssueAnalysis {
  difficulty: DifficultyLevel;
  requiredSkills: string[];
  concepts: string[];
  whyItMatches: {
    alreadyKnow: string[];
    shouldReview: string[];
    explanation: string;
  };
  filesToUnderstand: {
    path: string;
    role: string;
    lines?: string;
  }[];
  preparation: string[];
  potentialChallenges: string[];
}

export interface CompatibilityDetails {
  score: number;
  label: 'Strong match' | 'Moderate match' | 'Challenging match';
  matches: string[];
  needsImprovement: string[];
  rationale: string;
}

export interface TrackedPR {
  id: string;
  title: string;
  repo: string;
  url: string;
  merged: boolean;
  createdAt: string;
}

export interface SavedState {
  savedRepos: Repository[];
  savedIssues: Issue[];
  completedIssueIds: string[];
  trackedPRs: TrackedPR[];
  completedStepTopicIds: Record<string, string[]>; // `${repoId}:${stepNumber}` -> topicIds[]
  recentlyAnalyzed: {
    owner: string;
    repo: string;
    analyzedAt: string;
    stars: string;
    primaryLanguage: string;
  }[];
  userToken?: string;
  userSkillLevels: UserSkillItem[];
  activeRepoId?: string;
}
