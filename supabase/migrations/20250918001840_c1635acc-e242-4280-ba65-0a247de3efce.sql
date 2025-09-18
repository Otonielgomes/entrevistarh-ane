-- Criar estrutura básica do banco de dados

-- Tabela de jobs/vagas
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  area TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Júnior', 'Pleno', 'Sênior', 'Especialista')),
  contract_type TEXT NOT NULL CHECK (contract_type IN ('CLT', 'PJ', 'Estágio', 'Freelancer')),
  requirements TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Pausada', 'Finalizada')),
  candidates_applied INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de perguntas geradas por IA para cada vaga
CREATE TABLE public.ai_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'behavioral', 'experience', 'situational')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  expected_keywords TEXT[] NOT NULL DEFAULT '{}',
  scoring_criteria TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de perguntas customizadas
CREATE TABLE public.custom_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);