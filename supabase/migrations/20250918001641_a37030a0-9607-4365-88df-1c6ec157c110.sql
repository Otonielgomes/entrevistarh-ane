-- Criar tabelas para o sistema de RH com IA

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

-- Tabela de resultados de candidatos
CREATE TABLE public.candidate_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id),
  job_title TEXT NOT NULL,
  overall_score DECIMAL(3,1) NOT NULL,
  disc_profile TEXT NOT NULL,
  technical_score DECIMAL(3,1) NOT NULL,
  behavioral_score DECIMAL(3,1) NOT NULL,
  communication_score DECIMAL(3,1) NOT NULL,
  summary TEXT NOT NULL,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  areas_for_improvement TEXT[] NOT NULL DEFAULT '{}',
  interview_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('Aprovado', 'Em análise', 'Reprovado', 'Aguardando')),
  reuse_for_other_jobs BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de respostas de entrevista
CREATE TABLE public.interview_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_result_id UUID NOT NULL REFERENCES public.candidate_results(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  score DECIMAL(3,1) NOT NULL,
  analysis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de respostas de testes vocacionais
CREATE TABLE public.vocational_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT,
  candidate_email TEXT,
  answers JSONB NOT NULL,
  top_area TEXT NOT NULL,
  area_scores JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de respostas de testes comportamentais
CREATE TABLE public.behavioral_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT,
  candidate_email TEXT,
  answers JSONB NOT NULL,
  disc_profile JSONB NOT NULL,
  primary_type TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocational_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavioral_test_results ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (permissão total para todos por enquanto - pode ser refinado depois)
CREATE POLICY "Allow all operations on jobs" ON public.jobs FOR ALL USING (true);
CREATE POLICY "Allow all operations on ai_questions" ON public.ai_questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on custom_questions" ON public.custom_questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on candidate_results" ON public.candidate_results FOR ALL USING (true);
CREATE POLICY "Allow all operations on interview_responses" ON public.interview_responses FOR ALL USING (true);
CREATE POLICY "Allow all operations on vocational_test_results" ON public.vocational_test_results FOR ALL USING (true);
CREATE POLICY "Allow all operations on behavioral_test_results" ON public.behavioral_test_results FOR ALL USING (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir a vaga Franqueado Animaserv
INSERT INTO public.jobs (
  title,
  area,
  description,
  level,
  contract_type,
  requirements
) VALUES (
  'Franqueado Animaserv',
  'Negócios e Franchising',
  'Seja um franqueado da Animaserv, a franquia digital líder em soluções de RH com foco em integração de estágios. Oferecemos um modelo de negócio inovador que combina tecnologia, suporte completo e um mercado em crescimento. Nossos franqueados atuam como consultores especializados em conectar estudantes a oportunidades de estágio em empresas de todos os portes, utilizando nossa plataforma digital avançada e metodologia comprovada. Ideal para empreendedores que buscam um negócio escalável, com baixo investimento inicial e alto potencial de retorno, no segmento de educação e recursos humanos.',
  'Especialista',
  'PJ',
  ARRAY[
    'Experiência em gestão de negócios ou vendas',
    'Perfil empreendedor e orientado a resultados',
    'Conhecimento em RH ou área educacional (desejável)',
    'Habilidades de relacionamento e networking',
    'Capacidade de liderança e gestão de equipe',
    'Disponibilidade para dedicação exclusiva',
    'Capital de investimento conforme plano de franquia',
    'Residir na região de interesse da franquia'
  ]
);

-- Pegar o ID da vaga criada para inserir as perguntas
DO $$
DECLARE
  job_uuid UUID;
BEGIN
  SELECT id INTO job_uuid FROM public.jobs WHERE title = 'Franqueado Animaserv' LIMIT 1;
  
  -- Inserir 6 perguntas geradas por IA
  INSERT INTO public.ai_questions (job_id, question, category, difficulty, expected_keywords, scoring_criteria) VALUES
  (job_uuid, 'Descreva sua experiência prévia em gestão de negócios ou empreendedorismo. Como você lidou com desafios de crescimento e escalabilidade?', 'experience', 'medium', 
   ARRAY['gestão', 'negócios', 'empreendedorismo', 'crescimento', 'escalabilidade', 'desafios', 'liderança'], 
   'Experiência relevante em gestão, capacidade de superar desafios, visão de crescimento'),
   
  (job_uuid, 'Como você desenvolveria uma estratégia de networking local para conectar empresas e estudantes na sua região?', 'strategic', 'hard',
   ARRAY['networking', 'estratégia', 'relacionamento', 'empresas', 'estudantes', 'região', 'conexão'],
   'Pensamento estratégico, conhecimento do mercado local, habilidades de relacionamento'),
   
  (job_uuid, 'Qual sua visão sobre o mercado de estágios no Brasil e como a tecnologia pode transformar essa área?', 'technical', 'medium',
   ARRAY['estágios', 'mercado', 'tecnologia', 'transformação', 'inovação', 'tendências'],
   'Conhecimento do setor, visão de futuro, compreensão do papel da tecnologia'),
   
  (job_uuid, 'Como você lidaria com a resistência de empresas tradicionais em adotar uma plataforma digital para contratação de estagiários?', 'behavioral', 'hard',
   ARRAY['resistência', 'mudança', 'persuasão', 'tradicional', 'digital', 'adaptação'],
   'Habilidades de persuasão, gestão de mudança, persistência, comunicação eficaz'),
   
  (job_uuid, 'Descreva como você organizaria e gerenciaria uma equipe de consultores para maximizar os resultados da franquia.', 'experience', 'hard',
   ARRAY['organização', 'gestão', 'equipe', 'consultores', 'resultados', 'liderança', 'performance'],
   'Capacidade de liderança, organização, gestão de pessoas, foco em resultados'),
   
  (job_uuid, 'Qual seria sua abordagem para identificar e desenvolver parcerias estratégicas com universidades e instituições de ensino?', 'strategic', 'medium',
   ARRAY['parcerias', 'universidades', 'instituições', 'ensino', 'estratégia', 'desenvolvimento'],
   'Pensamento estratégico, habilidades de negociação, visão de parcerias');
   
  -- Inserir 6 perguntas customizadas específicas para franqueado
  INSERT INTO public.custom_questions (job_id, question, category) VALUES
  (job_uuid, 'Por que você escolheu investir especificamente no segmento de RH e estágios?', 'Motivação e Afinidade'),
  (job_uuid, 'Como você pretende se posicionar no mercado local frente aos concorrentes tradicionais?', 'Estratégia de Mercado'),
  (job_uuid, 'Qual sua disponibilidade financeira para investimento inicial e capital de giro nos primeiros meses?', 'Investimento e Recursos'),
  (job_uuid, 'Você tem experiência prévia com franquias ou modelos de negócio licenciados?', 'Experiência em Franquias'),
  (job_uuid, 'Como você enxerga seu papel na transformação digital do mercado de estágios na sua região?', 'Visão de Futuro'),
  (job_uuid, 'Que tipo de suporte você espera da franqueadora para garantir o sucesso do seu negócio?', 'Expectativas e Suporte');
  
END $$;