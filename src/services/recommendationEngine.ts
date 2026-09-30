import { CompatibilityDetails, UserSkillItem, Repository, Issue, DifficultyLevel } from '../types';

export const recommendationEngine = {
  calculateRepoCompatibility(
    repo: Repository,
    userSkills: UserSkillItem[]
  ): CompatibilityDetails {
    const userSkillMap = new Map<string, string>();
    userSkills.forEach((s) => {
      userSkillMap.set(s.skill.toLowerCase(), s.proficiency);
    });

    const repoTechs = new Set<string>();
    if (repo.primaryLanguage) repoTechs.add(repo.primaryLanguage.toLowerCase());
    repo.languages.forEach((l) => repoTechs.add(l.name.toLowerCase()));
    repo.topics.forEach((t) => repoTechs.add(t.toLowerCase()));

    const matches: string[] = [];
    const needsImprovement: string[] = [];
    let matchedWeight = 0;
    let totalWeight = 0;

    // Check main languages and key frameworks
    const keyCandidates = [
      repo.primaryLanguage,
      ...repo.languages.slice(0, 3).map((l) => l.name),
      ...repo.topics.slice(0, 4),
    ].filter(Boolean);

    const uniqueCandidates = Array.from(new Set(keyCandidates));

    uniqueCandidates.forEach((candidate) => {
      const lower = candidate.toLowerCase();
      totalWeight += 2;
      let matched = false;

      for (const [skill, prof] of userSkillMap.entries()) {
        if (
          lower.includes(skill) ||
          skill.includes(lower) ||
          (skill === 'react' && lower.includes('next')) ||
          (skill === 'javascript' && lower.includes('typescript'))
        ) {
          matched = true;
          if (prof === 'Strong') matchedWeight += 2;
          else if (prof === 'Intermediate') matchedWeight += 1.5;
          else matchedWeight += 1;

          if (!matches.includes(candidate)) matches.push(candidate);
          break;
        }
      }

      if (!matched && !needsImprovement.includes(candidate)) {
        needsImprovement.push(candidate);
      }
    });

    // Difficulty penalty / bonus
    let difficultyFactor = 1;
    if (repo.difficulty === 'Beginner') difficultyFactor = 1.05;
    if (repo.difficulty === 'Advanced') difficultyFactor = 0.9;

    const rawScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 * difficultyFactor : 75;
    const finalScore = Math.min(98, Math.max(50, Math.round(rawScore)));

    let label: 'Strong match' | 'Moderate match' | 'Challenging match' = 'Moderate match';
    if (finalScore >= 85) label = 'Strong match';
    else if (finalScore < 70) label = 'Challenging match';

    const rationale = `Based on your estimated proficiency in ${
      matches.slice(0, 3).join(', ') || 'related web technologies'
    } and the repository requirements.`;

    return {
      score: finalScore,
      label,
      matches: matches.slice(0, 4),
      needsImprovement: needsImprovement.slice(0, 3),
      rationale,
    };
  },

  calculateIssueCompatibility(
    issue: Issue,
    userSkills: UserSkillItem[]
  ): CompatibilityDetails {
    const userSkillMap = new Map<string, string>();
    userSkills.forEach((s) => {
      userSkillMap.set(s.skill.toLowerCase(), s.proficiency);
    });

    const needed = issue.whatYoullNeed || [];
    const matches: string[] = [];
    const needsImprovement: string[] = [];
    let scoreAccum = 0;

    needed.forEach((req) => {
      const lower = req.toLowerCase();
      let found = false;
      for (const [skill, prof] of userSkillMap.entries()) {
        if (lower.includes(skill) || skill.includes(lower)) {
          found = true;
          if (prof === 'Strong') scoreAccum += 25;
          else if (prof === 'Intermediate') scoreAccum += 20;
          else scoreAccum += 12;

          matches.push(req);
          break;
        }
      }
      if (!found) {
        needsImprovement.push(req);
        scoreAccum += 5; // potential to learn
      }
    });

    let difficultyModifier = 0;
    if (issue.difficulty === 'Beginner') difficultyModifier = 15;
    if (issue.difficulty === 'Intermediate') difficultyModifier = 5;
    if (issue.difficulty === 'Advanced') difficultyModifier = -10;

    const baseScore = Math.min(96, Math.max(55, Math.round(scoreAccum + difficultyModifier)));
    let label: 'Strong match' | 'Moderate match' | 'Challenging match' = 'Moderate match';
    if (baseScore >= 85) label = 'Strong match';
    else if (baseScore < 70) label = 'Challenging match';

    return {
      score: baseScore,
      label,
      matches: matches.length > 0 ? matches : ['Core Programming Logic'],
      needsImprovement: needsImprovement.length > 0 ? needsImprovement : ['Repository Convention'],
      rationale: `Estimated compatibility based on your public GitHub activity and the skills flagged for #${issue.issueNumber}.`,
    };
  },
};
