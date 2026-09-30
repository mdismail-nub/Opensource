import { UserProfile, UserSkillItem, Repository } from '../types';
import { storageService } from './storageService';
import { githubService } from './githubService';

export const profileService = {
  getUserProfile(activeRepo?: Repository): UserProfile {
    const savedRepos = storageService.getSavedRepos();
    const savedIssues = storageService.getSavedIssues();
    const recentlyAnalyzed = storageService.getRecentlyAnalyzed();
    const state = storageService.load();
    const skillLevels = storageService.getUserSkillLevels();

    const projectsExploring = savedRepos.length + recentlyAnalyzed.length;
    const issuesCompleted = state.completedIssueIds.length;
    const pullRequests = state.trackedPRs.length;
    const merged = state.trackedPRs.filter((p) => p.merged).length;

    // Determine current learning topic from activeRepo or first saved/recent repo
    const targetRepo = activeRepo || savedRepos[0];
    let currentLearning: any = null;

    if (targetRepo) {
      const completedTopics = storageService.getRepoCompletedTopicIds(targetRepo.id);
      const totalEstimatedTopics = 12;
      const progress = Math.min(Math.round((completedTopics.length / totalEstimatedTopics) * 100), 100);

      currentLearning = {
        repoId: targetRepo.id,
        repoName: targetRepo.name,
        topic: targetRepo.primaryLanguage || 'Core Framework',
        progress: progress > 0 ? progress : 15,
        nextSubtopic: 'Architecture & Internal Utilities',
        stepNumber: progress > 50 ? '03' : '02',
      };
    }

    return {
      name: 'Contributor',
      githubUsername: 'developer',
      avatar: '',
      role: 'Open Source Contributor',
      skills: skillLevels.map((s) => s.skill),
      skillLevels,
      stats: {
        projectsExploring,
        issuesCompleted,
        pullRequests,
        merged,
      },
      currentLearning,
      contributionStage: projectsExploring > 0 ? 'Prepare' : 'Explore',
    };
  },

  updateSkills(skills: UserSkillItem[]) {
    storageService.setUserSkillLevels(skills);
  },

  async syncWithGitHub(username: string): Promise<UserSkillItem[]> {
    const data = await githubService.fetchUserProfile(username);
    if (data.detectedLanguages && Object.keys(data.detectedLanguages).length > 0) {
      const detected = Object.keys(data.detectedLanguages).map((lang) => ({
        skill: lang,
        proficiency: 'Intermediate' as const,
      }));
      storageService.setUserSkillLevels(detected);
      return detected;
    }
    return storageService.getUserSkillLevels();
  },
};
