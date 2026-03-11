import { CRITERIA } from './criteria';

export type Recommendation = 'Strong Buy' | 'Buy' | 'Hold' | 'Caution' | 'Avoid';

export interface ScoringResult {
  totalScore: number;
  maxScore: number;
  layerScores: { suburb: number; intrasuburb: number; property: number };
  dealbreakersTriggered: string[];
  recommendation: Recommendation;
  percentage: number;
}

/**
 * Calculate the total score and recommendation.
 * @param scores - Record of criterion id → score (0–5)
 * @param dealbreakers - Record of criterion id → true (passed) | false (failed/triggered)
 */
export function calculateScore(
  scores: Record<string, number>,
  dealbreakers: Record<string, boolean>,
): ScoringResult {
  // Check dealbreakers first — any failure = auto AVOID
  const dealbreakersTriggered = CRITERIA
    .filter(c => c.type === 'dealbreaker' && dealbreakers[c.id] === false)
    .map(c => c.label);

  // Sum scored criteria
  let suburbScore = 0;
  let intrasuburb = 0;
  let propertyScore = 0;
  let maxScore = 0;

  for (const c of CRITERIA) {
    if (c.type !== 'score') continue;
    maxScore += c.maxPoints;
    const val = scores[c.id] ?? 0;
    if (c.layer === 'suburb')      suburbScore  += val;
    if (c.layer === 'intrasuburb') intrasuburb  += val;
    if (c.layer === 'property')    propertyScore += val;
  }

  const totalScore = suburbScore + intrasuburb + propertyScore;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  let recommendation: Recommendation;
  if (dealbreakersTriggered.length > 0) {
    recommendation = 'Avoid';
  } else if (totalScore > 100) {
    recommendation = 'Strong Buy';
  } else if (totalScore >= 80) {
    recommendation = 'Buy';
  } else if (totalScore >= 60) {
    recommendation = 'Hold';
  } else if (totalScore >= 40) {
    recommendation = 'Caution';
  } else {
    recommendation = 'Avoid';
  }

  return {
    totalScore,
    maxScore,
    layerScores: { suburb: suburbScore, intrasuburb, property: propertyScore },
    dealbreakersTriggered,
    recommendation,
    percentage,
  };
}

export function getRecommendationColor(rec: Recommendation): string {
  switch (rec) {
    case 'Strong Buy': return 'text-green-600 dark:text-green-400';
    case 'Buy':        return 'text-green-500 dark:text-green-500';
    case 'Hold':       return 'text-amber-600 dark:text-amber-400';
    case 'Caution':    return 'text-orange-600 dark:text-orange-400';
    case 'Avoid':      return 'text-red-600 dark:text-red-400';
  }
}

export function getRecommendationBg(rec: Recommendation): string {
  switch (rec) {
    case 'Strong Buy': return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900';
    case 'Buy':        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900';
    case 'Hold':       return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900';
    case 'Caution':    return 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900';
    case 'Avoid':      return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900';
  }
}
