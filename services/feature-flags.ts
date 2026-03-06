const featureFlags = {
  growthCommunityPrompts: true,
  growthUniversityComparison: true,
  experimentHomeHeroVariant: true,
} as const;

export type FeatureFlagName = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlagName) {
  return featureFlags[flag];
}

export function getExperimentVariant(userId: string) {
  if (!featureFlags.experimentHomeHeroVariant) {
    return 'control' as const;
  }

  const hash = userId
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return hash % 2 === 0 ? ('variant_a' as const) : ('control' as const);
}
