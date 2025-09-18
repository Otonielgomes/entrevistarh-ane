import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Job, AIQuestion, CustomQuestion, CandidateResult } from '@/types/job';
import { useToast } from '@/hooks/use-toast';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar jobs do Supabase
  const fetchJobs = async () => {
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Para cada job, buscar as perguntas
      const jobsWithQuestions = await Promise.all(
        (jobsData || []).map(async (job) => {
          // Buscar perguntas de IA
          const { data: aiQuestions } = await supabase
            .from('ai_questions')
            .select('*')
            .eq('job_id', job.id);

          // Buscar perguntas customizadas
          const { data: customQuestions } = await supabase
            .from('custom_questions')
            .select('*')
            .eq('job_id', job.id);

          return {
            id: job.id,
            title: job.title,
            area: job.area,
            description: job.description,
            level: job.level as 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista',
            contractType: job.contract_type as 'CLT' | 'PJ' | 'Estágio' | 'Freelancer',
            requirements: job.requirements || [],
            aiGeneratedQuestions: (aiQuestions || []).map(q => ({
              id: q.id,
              question: q.question,
              category: q.category as 'technical' | 'behavioral' | 'experience' | 'situational',
              difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
              expectedKeywords: q.expected_keywords || [],
              scoringCriteria: q.scoring_criteria
            })) as AIQuestion[],
            customQuestions: (customQuestions || []).map(q => ({
              id: q.id,
              question: q.question,
              category: q.category
            })) as CustomQuestion[],
            status: job.status as 'Ativa' | 'Pausada' | 'Finalizada',
            createdAt: new Date(job.created_at),
            candidatesApplied: job.candidates_applied || 0
          } as Job;
        })
      );

      setJobs(jobsWithQuestions);
    } catch (error) {
      console.error('Erro ao carregar jobs:', error);
      toast({
        title: "Erro ao carregar vagas",
        description: "Não foi possível carregar as vagas do banco de dados.",
        variant: "destructive"
      });
    }
  };

  // Adicionar nova vaga
  const addJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'candidatesApplied'>) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          title: jobData.title,
          area: jobData.area,
          description: jobData.description,
          level: jobData.level,
          contract_type: jobData.contractType,
          requirements: jobData.requirements,
          status: jobData.status
        }])
        .select()
        .single();

      if (error) throw error;

      // Adicionar perguntas de IA se existirem
      if (jobData.aiGeneratedQuestions.length > 0) {
        await supabase
          .from('ai_questions')
          .insert(
            jobData.aiGeneratedQuestions.map(q => ({
              job_id: data.id,
              question: q.question,
              category: q.category,
              difficulty: q.difficulty,
              expected_keywords: q.expectedKeywords,
              scoring_criteria: q.scoringCriteria
            }))
          );
      }

      // Adicionar perguntas customizadas se existirem
      if (jobData.customQuestions.length > 0) {
        await supabase
          .from('custom_questions')
          .insert(
            jobData.customQuestions.map(q => ({
              job_id: data.id,
              question: q.question,
              category: q.category
            }))
          );
      }

      await fetchJobs(); // Recarregar lista
      
      toast({
        title: "Vaga criada com sucesso!",
        description: `A vaga ${jobData.title} foi criada.`
      });
    } catch (error) {
      console.error('Erro ao criar job:', error);
      toast({
        title: "Erro ao criar vaga",
        description: "Não foi possível criar a vaga.",
        variant: "destructive"
      });
    }
  };

  // Atualizar vaga
  const updateJob = async (jobId: string, updates: Partial<Job>) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          title: updates.title,
          area: updates.area,
          description: updates.description,
          level: updates.level,
          contract_type: updates.contractType,
          requirements: updates.requirements,
          status: updates.status,
          candidates_applied: updates.candidatesApplied
        })
        .eq('id', jobId);

      if (error) throw error;

      await fetchJobs(); // Recarregar lista
      
      toast({
        title: "Vaga atualizada!",
        description: "As informações da vaga foram atualizadas."
      });
    } catch (error) {
      console.error('Erro ao atualizar job:', error);
      toast({
        title: "Erro ao atualizar vaga",
        description: "Não foi possível atualizar a vaga.",
        variant: "destructive"
      });
    }
  };

  // Adicionar resultado de candidato
  const addCandidateResult = async (candidateData: Omit<CandidateResult, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('candidate_results')
        .insert([{
          name: candidateData.name,
          email: candidateData.email,
          job_id: candidateData.jobId,
          job_title: candidateData.jobTitle,
          overall_score: candidateData.overallScore,
          disc_profile: candidateData.discProfile,
          technical_score: candidateData.technicalScore,
          behavioral_score: candidateData.behavioralScore,
          communication_score: candidateData.communicationScore,
          summary: candidateData.summary,
          strengths: candidateData.strengths,
          areas_for_improvement: candidateData.areasForImprovement,
          interview_date: candidateData.interviewDate.toISOString(),
          status: candidateData.status,
          reuse_for_other_jobs: candidateData.reuseForOtherJobs
        }])
        .select()
        .single();

      if (error) throw error;

      // Adicionar respostas da entrevista
      if (candidateData.responses.length > 0) {
        await supabase
          .from('interview_responses')
          .insert(
            candidateData.responses.map(r => ({
              candidate_result_id: data.id,
              question_id: r.questionId,
              question: r.question,
              answer: r.answer,
              score: r.score,
              analysis: r.analysis
            }))
          );
      }

      // Atualizar contadores
      await updateJob(candidateData.jobId, {
        candidatesApplied: jobs.find(j => j.id === candidateData.jobId)?.candidatesApplied + 1 || 1
      });

      toast({
        title: "Candidato avaliado!",
        description: `Resultado de ${candidateData.name} foi salvo.`
      });
    } catch (error) {
      console.error('Erro ao salvar candidato:', error);
      toast({
        title: "Erro ao salvar resultado",
        description: "Não foi possível salvar o resultado do candidato.",
        variant: "destructive"
      });
    }
  };

  // Buscar job por ID
  const getJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  // Reutilizar candidato para outra vaga
  const reuseCandidateForJob = async (candidateId: string, jobId: string) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      // Buscar candidato original
      const { data: originalCandidate, error } = await supabase
        .from('candidate_results')
        .select('*')
        .eq('id', candidateId)
        .single();

      if (error || !originalCandidate) throw error;

      // Criar nova entrada para a vaga
      const newCandidateData = {
        ...originalCandidate,
        job_id: jobId,
        job_title: job.title,
        status: 'Aguardando' as const,
        interview_date: new Date().toISOString()
      };

      delete newCandidateData.id; // Remove o ID para criar nova entrada

      await supabase
        .from('candidate_results')
        .insert([newCandidateData]);

      await updateJob(jobId, {
        candidatesApplied: job.candidatesApplied + 1
      });

      toast({
        title: "Candidato reutilizado!",
        description: `Candidato foi adicionado à vaga ${job.title}.`
      });
    } catch (error) {
      console.error('Erro ao reutilizar candidato:', error);
      toast({
        title: "Erro ao reutilizar candidato",
        description: "Não foi possível reutilizar o candidato.",
        variant: "destructive"
      });
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchJobs();
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    jobs,
    candidates,
    loading,
    addJob,
    updateJob,
    addCandidateResult,
    getJobById,
    reuseCandidateForJob,
    refreshJobs: fetchJobs
  };
};