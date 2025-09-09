import { createContext, useContext, useState, ReactNode } from 'react';
import { Job, CandidateResult } from '@/types/job';

interface AppContextType {
  jobs: Job[];
  candidates: CandidateResult[];
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'candidatesApplied'>) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  addCandidateResult: (candidate: Omit<CandidateResult, 'id'>) => void;
  getJobById: (jobId: string) => Job | undefined;
  reuseCandidateForJob: (candidateId: string, jobId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const mockJobs: Job[] = [
  {
    id: 'dev-fullstack-001',
    title: 'Desenvolvedor Full Stack',
    area: 'Tecnologia',
    description: 'Desenvolvedor experiente em React, Node.js e bancos de dados relacionais para projetos web escaláveis.',
    level: 'Pleno',
    contractType: 'CLT',
    requirements: ['React', 'Node.js', 'SQL', 'Git'],
    aiGeneratedQuestions: [
      {
        id: 'tech-1',
        question: 'Descreva um desafio técnico complexo que você enfrentou recentemente e como você o solucionou.',
        category: 'technical',
        difficulty: 'medium',
        expectedKeywords: ['problema', 'solução', 'técnico', 'debuggar', 'código'],
        scoringCriteria: 'Clareza na explicação do problema, processo de resolução estruturado'
      },
      {
        id: 'behav-1',
        question: 'Como você lida com pressão e prazos apertados em projetos de desenvolvimento?',
        category: 'behavioral',
        difficulty: 'medium',
        expectedKeywords: ['pressão', 'prazo', 'organização', 'priorização'],
        scoringCriteria: 'Capacidade de gestão sob pressão, organização, foco em resultados'
      }
    ],
    customQuestions: [],
    status: 'Ativa',
    createdAt: new Date('2024-01-15'),
    candidatesApplied: 15
  }
];

const mockCandidates: CandidateResult[] = [
  {
    id: 'candidate-1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    jobId: 'dev-fullstack-001',
    jobTitle: 'Desenvolvedor Full Stack',
    overallScore: 9.2,
    discProfile: 'D-I',
    technicalScore: 9.5,
    behavioralScore: 8.8,
    communicationScore: 9.3,
    summary: 'Candidata excepcional com forte background técnico e excelentes habilidades de comunicação. Demonstrou capacidade de liderança e resolução de problemas complexos.',
    strengths: ['Liderança técnica', 'Resolução de problemas', 'Comunicação clara', 'Aprendizado rápido'],
    areasForImprovement: ['Gestão de tempo', 'Documentação técnica'],
    responses: [
      {
        questionId: 'tech-1',
        question: 'Descreva um desafio técnico complexo que você enfrentou recentemente.',
        answer: 'Enfrentei um problema de performance em uma aplicação React onde o carregamento estava muito lento...',
        score: 9.5,
        analysis: 'Excelente resposta demonstrando conhecimento técnico profundo e metodologia estruturada'
      }
    ],
    interviewDate: new Date('2024-01-20'),
    status: 'Aprovado',
    reuseForOtherJobs: true
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [candidates, setCandidates] = useState<CandidateResult[]>(mockCandidates);

  const addJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'candidatesApplied'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date(),
      candidatesApplied: 0
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  const addCandidateResult = (candidateData: Omit<CandidateResult, 'id'>) => {
    const newCandidate: CandidateResult = {
      ...candidateData,
      id: `candidate-${Date.now()}`
    };
    setCandidates(prev => [newCandidate, ...prev]);
    
    // Update job candidates count
    updateJob(candidateData.jobId, {
      candidatesApplied: jobs.find(j => j.id === candidateData.jobId)?.candidatesApplied + 1 || 1
    });
  };

  const getJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  const reuseCandidateForJob = (candidateId: string, jobId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    const job = jobs.find(j => j.id === jobId);
    
    if (candidate && job) {
      const reusedCandidate: CandidateResult = {
        ...candidate,
        id: `candidate-reuse-${Date.now()}`,
        jobId: jobId,
        jobTitle: job.title,
        status: 'Aguardando',
        interviewDate: new Date()
      };
      setCandidates(prev => [reusedCandidate, ...prev]);
      updateJob(jobId, {
        candidatesApplied: job.candidatesApplied + 1
      });
    }
  };

  const value = {
    jobs,
    candidates,
    addJob,
    updateJob,
    addCandidateResult,
    getJobById,
    reuseCandidateForJob
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};