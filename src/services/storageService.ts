import { SavedState, UserSkillItem, Repository, Issue, TrackedPR } from '../types';

const STORAGE_KEY = 'opensourcepath_storage_v2';

const defaultSkillLevels: UserSkillItem[] = [
  { skill: 'JavaScript', proficiency: 'Strong' },
  { skill: 'React', proficiency: 'Intermediate' },
  { skill: 'TypeScript', proficiency: 'Intermediate' },
  { skill: 'HTML/CSS', proficiency: 'Strong' },
  { skill: 'Tailwind CSS', proficiency: 'Strong' },
  { skill: 'Git', proficiency: 'Intermediate' },
];

const emptyState: SavedState = {
  savedRepos: [],
  savedIssues: [],
  completedIssueIds: [],
  trackedPRs: [],
  completedStepTopicIds: {},
  recentlyAnalyzed: [],
  userSkillLevels: defaultSkillLevels,
};

export const storageService = {
  load(): SavedState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return emptyState;
      const parsed = JSON.parse(data);
      return {
        ...emptyState,
        ...parsed,
        savedRepos: Array.isArray(parsed.savedRepos) ? parsed.savedRepos : [],
        savedIssues: Array.isArray(parsed.savedIssues) ? parsed.savedIssues : [],
        completedIssueIds: Array.isArray(parsed.completedIssueIds) ? parsed.completedIssueIds : [],
        trackedPRs: Array.isArray(parsed.trackedPRs) ? parsed.trackedPRs : [],
        completedStepTopicIds: parsed.completedStepTopicIds || {},
        recentlyAnalyzed: Array.isArray(parsed.recentlyAnalyzed) ? parsed.recentlyAnalyzed : [],
        userSkillLevels: Array.isArray(parsed.userSkillLevels) ? parsed.userSkillLevels : defaultSkillLevels,
      };
    } catch (e) {
      console.warn('Failed to load local storage:', e);
      return emptyState;
    }
  },

  save(state: Partial<SavedState>): SavedState {
    try {
      const current = this.load();
      const updated = { ...current, ...state };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Failed to save to local storage:', e);
      return emptyState;
    }
  },

  // ------------------------------------
  // Repositories
  // ------------------------------------
  getSavedRepos(): Repository[] {
    return this.load().savedRepos;
  },

  isRepoSaved(repoId: string): boolean {
    const state = this.load();
    return state.savedRepos.some((r) => r.id === repoId || r.name.toLowerCase() === repoId.toLowerCase());
  },

  toggleSaveRepo(repo: Repository): boolean {
    const state = this.load();
    const exists = state.savedRepos.some((r) => r.id === repo.id || r.name.toLowerCase() === repo.name.toLowerCase());
    const updated = exists
      ? state.savedRepos.filter((r) => r.id !== repo.id && r.name.toLowerCase() !== repo.name.toLowerCase())
      : [repo, ...state.savedRepos];
    this.save({ savedRepos: updated });
    return !exists;
  },

  // ------------------------------------
  // Issues
  // ------------------------------------
  getSavedIssues(): Issue[] {
    return this.load().savedIssues;
  },

  isIssueSaved(issueId: string): boolean {
    const state = this.load();
    return state.savedIssues.some((i) => i.id === issueId);
  },

  toggleSaveIssue(issue: Issue): boolean {
    const state = this.load();
    const exists = state.savedIssues.some((i) => i.id === issue.id);
    const updated = exists
      ? state.savedIssues.filter((i) => i.id !== issue.id)
      : [issue, ...state.savedIssues];
    this.save({ savedIssues: updated });
    return !exists;
  },

  isIssueCompleted(issueId: string): boolean {
    const state = this.load();
    return state.completedIssueIds.includes(issueId);
  },

  toggleIssueCompleted(issueId: string): boolean {
    const state = this.load();
    const exists = state.completedIssueIds.includes(issueId);
    const updated = exists
      ? state.completedIssueIds.filter((id) => id !== issueId)
      : [...state.completedIssueIds, issueId];
    this.save({ completedIssueIds: updated });
    return !exists;
  },

  // ------------------------------------
  // Pull Requests
  // ------------------------------------
  getTrackedPRs(): TrackedPR[] {
    return this.load().trackedPRs;
  },

  addTrackedPR(pr: TrackedPR) {
    const state = this.load();
    const updated = [pr, ...state.trackedPRs.filter((p) => p.id !== pr.id)];
    this.save({ trackedPRs: updated });
  },

  // ------------------------------------
  // Roadmap Progress
  // ------------------------------------
  isTopicCompleted(repoId: string, stepNumber: string, topicId: string): boolean {
    const state = this.load();
    const key = `${repoId.toLowerCase()}:${stepNumber}`;
    return (state.completedStepTopicIds[key] || []).includes(topicId);
  },

  toggleTopicCompleted(repoId: string, stepNumber: string, topicId: string): boolean {
    const state = this.load();
    const key = `${repoId.toLowerCase()}:${stepNumber}`;
    const currentList = state.completedStepTopicIds[key] || [];
    const exists = currentList.includes(topicId);
    const updatedList = exists
      ? currentList.filter((id) => id !== topicId)
      : [...currentList, topicId];
    const newRecord = {
      ...state.completedStepTopicIds,
      [key]: updatedList,
    };
    this.save({ completedStepTopicIds: newRecord });
    return !exists;
  },

  getRepoCompletedTopicIds(repoId: string): string[] {
    const state = this.load();
    const prefix = `${repoId.toLowerCase()}:`;
    const result: string[] = [];
    Object.entries(state.completedStepTopicIds).forEach(([key, topics]) => {
      if (key.startsWith(prefix) && Array.isArray(topics)) {
        result.push(...topics);
      }
    });
    return result;
  },

  // ------------------------------------
  // Recently Analyzed
  // ------------------------------------
  getRecentlyAnalyzed() {
    return this.load().recentlyAnalyzed;
  },

  addRecentlyAnalyzed(item: {
    owner: string;
    repo: string;
    stars: string;
    primaryLanguage: string;
  }) {
    const state = this.load();
    const filtered = state.recentlyAnalyzed.filter(
      (r) => !(r.owner.toLowerCase() === item.owner.toLowerCase() && r.repo.toLowerCase() === item.repo.toLowerCase())
    );
    const updated = [
      { ...item, analyzedAt: 'Just now' },
      ...filtered.slice(0, 7),
    ];
    this.save({ recentlyAnalyzed: updated });
  },

  // ------------------------------------
  // Token & Skills
  // ------------------------------------
  getGitHubToken(): string {
    const state = this.load();
    return state.userToken || '';
  },

  setGitHubToken(token: string) {
    this.save({ userToken: token });
  },

  getUserSkillLevels(): UserSkillItem[] {
    const state = this.load();
    return state.userSkillLevels || defaultSkillLevels;
  },

  setUserSkillLevels(skills: UserSkillItem[]) {
    this.save({ userSkillLevels: skills });
  },

  getActiveRepoId(): string | undefined {
    return this.load().activeRepoId;
  },

  setActiveRepoId(repoId: string) {
    this.save({ activeRepoId: repoId });
  },
};
