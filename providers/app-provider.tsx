import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { UniversityFilters } from '@/types/domain';

interface AppSessionContextValue {
  universityFilters: UniversityFilters;
  setUniversityFilters: (update: Partial<UniversityFilters>) => void;
  drafts: Record<string, string>;
  setDraft: (key: string, value: string) => void;
  clearDraft: (key: string) => void;
  savedPostIds: string[];
  toggleSavedPost: (postId: string) => void;
  shortlistUniversityIds: string[];
  toggleShortlistUniversity: (universityId: string) => void;
}

const initialFilters: UniversityFilters = {
  query: '',
  region: 'All',
  major: 'All',
};

const AppSessionContext = createContext<AppSessionContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [universityFilters, setUniversityFiltersState] = useState<UniversityFilters>(initialFilters);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [shortlistUniversityIds, setShortlistUniversityIds] = useState<string[]>([]);

  const value = useMemo<AppSessionContextValue>(
    () => ({
      universityFilters,
      setUniversityFilters: (update) => {
        setUniversityFiltersState((current) => ({
          ...current,
          ...update,
        }));
      },
      drafts,
      setDraft: (key, value) => {
        setDrafts((current) => ({
          ...current,
          [key]: value,
        }));
      },
      clearDraft: (key) => {
        setDrafts((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
      },
      savedPostIds,
      toggleSavedPost: (postId) => {
        setSavedPostIds((current) =>
          current.includes(postId)
            ? current.filter((id) => id !== postId)
            : [...current, postId],
        );
      },
      shortlistUniversityIds,
      toggleShortlistUniversity: (universityId) => {
        setShortlistUniversityIds((current) =>
          current.includes(universityId)
            ? current.filter((id) => id !== universityId)
            : [...current, universityId],
        );
      },
    }),
    [drafts, savedPostIds, shortlistUniversityIds, universityFilters],
  );

  return <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>;
}

export function useAppSession() {
  const context = useContext(AppSessionContext);
  if (!context) {
    throw new Error('useAppSession must be used inside AppProvider');
  }
  return context;
}
