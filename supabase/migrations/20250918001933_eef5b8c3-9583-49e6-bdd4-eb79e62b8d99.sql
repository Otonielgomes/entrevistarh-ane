-- Habilitar Row Level Security e criar políticas

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_questions ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (acesso completo para todos - sistema interno da empresa)
CREATE POLICY "Allow all operations on jobs" ON public.jobs FOR ALL USING (true);
CREATE POLICY "Allow all operations on ai_questions" ON public.ai_questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on custom_questions" ON public.custom_questions FOR ALL USING (true);