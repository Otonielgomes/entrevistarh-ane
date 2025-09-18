-- Corrigir migração anterior e inserir dados corretos

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
  
  -- Inserir 6 perguntas geradas por IA (corrigindo categorias)
  INSERT INTO public.ai_questions (job_id, question, category, difficulty, expected_keywords, scoring_criteria) VALUES
  (job_uuid, 'Descreva sua experiência prévia em gestão de negócios ou empreendedorismo. Como você lidou com desafios de crescimento e escalabilidade?', 'experience', 'medium', 
   ARRAY['gestão', 'negócios', 'empreendedorismo', 'crescimento', 'escalabilidade', 'desafios', 'liderança'], 
   'Experiência relevante em gestão, capacidade de superar desafios, visão de crescimento'),
   
  (job_uuid, 'Como você desenvolveria uma estratégia de networking local para conectar empresas e estudantes na sua região?', 'behavioral', 'hard',
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
   
  (job_uuid, 'Qual seria sua abordagem para identificar e desenvolver parcerias estratégicas com universidades e instituições de ensino?', 'situational', 'medium',
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