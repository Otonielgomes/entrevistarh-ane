export interface Job {
  id: string;
  title: string;
  area: string;
  description: string;
  level: 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista';
  contractType: 'CLT' | 'PJ' | 'Estágio' | 'Freelancer';
  requirements: string[];
  aiGeneratedQuestions: AIQuestion[];
  customQuestions: CustomQuestion[];
  status: 'Ativa' | 'Pausada' | 'Finalizada';
  createdAt: Date;
  candidatesApplied: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'experience' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedKeywords: string[];
  scoringCriteria: string;
}

export interface CustomQuestion {
  id: string;
  question: string;
  category: string;
}

export interface CandidateResult {
  id: string;
  name: string;
  email: string;
  jobId: string;
  jobTitle: string;
  overallScore: number;
  discProfile: string;
  technicalScore: number;
  behavioralScore: number;
  communicationScore: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  responses: InterviewResponse[];
  interviewDate: Date;
  status: 'Aprovado' | 'Em análise' | 'Reprovado' | 'Aguardando';
  reuseForOtherJobs: boolean;
}

export interface InterviewResponse {
  questionId: string;
  question: string;
  answer: string;
  score: number;
  analysis: string;
}