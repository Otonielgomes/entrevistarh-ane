import { createContext, useContext, ReactNode } from 'react';
import { Job, CandidateResult } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';

interface AppContextType {
  jobs: Job[];
  candidates: CandidateResult[];
  loading: boolean;
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'candidatesApplied'>) => Promise<void>;
  updateJob: (jobId: string, updates: Partial<Job>) => Promise<void>;
  addCandidateResult: (candidate: Omit<CandidateResult, 'id'>) => Promise<void>;
  getJobById: (jobId: string) => Job | undefined;
  reuseCandidateForJob: (candidateId: string, jobId: string) => Promise<void>;
  refreshJobs: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const jobsData = useJobs();

  return <AppContext.Provider value={jobsData}>{children}</AppContext.Provider>;
};