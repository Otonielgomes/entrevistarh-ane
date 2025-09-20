import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AIQuestion } from '@/types/job';
import { useToast } from '@/hooks/use-toast';

interface QuestionGenerationRequest {
  jobId: string;
  jobTitle: string;
  jobArea: string;
  jobDescription: string;
  jobLevel: string;
  requirements: string[];
}

export const useAIQuestionGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const generateOptimizedQuestions = async (request: QuestionGenerationRequest): Promise<AIQuestion[]> => {
    setGenerating(true);
    
    try {
      // Template otimizado de perguntas baseado no contexto da vaga
      const questionTemplates = [
        {
          category: 'technical' as const,
          difficulty: 'medium' as const,
          template: `Explique como você implementaria uma solução para [contexto específico da área ${request.jobArea}] considerando as tecnologias mencionadas nos requisitos.`,
          keywords: request.requirements.slice(0, 3),
          criteria: 'Avalia conhecimento técnico específico da área e capacidade de aplicar tecnologias mencionadas'
        },
        {
          category: 'experience' as const,
          difficulty: 'medium' as const,
          template: `Descreva um projeto anterior onde você trabalhou com ${request.requirements[0] || 'tecnologias similares'} e como você superou os principais desafios.`,
          keywords: ['projeto', 'experiência', 'desafios', request.requirements[0] || 'tecnologia'],
          criteria: 'Avalia experiência prática e capacidade de resolver problemas'
        },
        {
          category: 'situational' as const,
          difficulty: 'hard' as const,
          template: `Como você abordaria uma situação onde precisa implementar uma funcionalidade urgente para ${request.jobArea} com recursos limitados?`,
          keywords: ['gestão', 'priorização', 'recursos', 'urgência'],
          criteria: 'Avalia capacidade de gestão de tempo e priorização'
        },
        {
          category: 'behavioral' as const,
          difficulty: 'easy' as const,
          template: `Conte sobre uma vez em que você teve que aprender rapidamente uma nova tecnologia ou conceito relacionado a ${request.jobArea}.`,
          keywords: ['aprendizado', 'adaptabilidade', 'crescimento'],
          criteria: 'Avalia capacidade de aprendizado e adaptação'
        },
        {
          category: 'technical' as const,
          difficulty: 'hard' as const,
          template: `Qual seria sua estratégia para otimizar o desempenho de um sistema ${request.jobArea} que está com problemas de escalabilidade?`,
          keywords: ['otimização', 'performance', 'escalabilidade', 'arquitetura'],
          criteria: 'Avalia conhecimento avançado em arquitetura e otimização'
        },
        {
          category: 'experience' as const,
          difficulty: 'medium' as const,
          template: `Como você mantém seus conhecimentos atualizados na área de ${request.jobArea} e como aplica novos aprendizados no trabalho?`,
          keywords: ['atualização', 'aprendizado contínuo', 'aplicação prática'],
          criteria: 'Avalia compromisso com desenvolvimento profissional contínuo'
        }
      ];

      // Gerar perguntas personalizadas baseadas nos templates
      const generatedQuestions: AIQuestion[] = questionTemplates.map((template, index) => ({
        id: `ai_${request.jobId}_${index + 1}`,
        question: template.template,
        category: template.category,
        difficulty: template.difficulty,
        expectedKeywords: template.keywords,
        scoringCriteria: template.criteria
      }));

      // Salvar perguntas no banco de dados
      for (const question of generatedQuestions) {
        await supabase
          .from('ai_questions')
          .insert({
            job_id: request.jobId,
            question: question.question,
            category: question.category,
            difficulty: question.difficulty,
            expected_keywords: question.expectedKeywords,
            scoring_criteria: question.scoringCriteria
          });
      }

      toast({
        title: "Perguntas IA geradas!",
        description: `6 perguntas otimizadas foram criadas para a vaga ${request.jobTitle}.`
      });

      return generatedQuestions;
    } catch (error) {
      console.error('Erro ao gerar perguntas:', error);
      toast({
        title: "Erro ao gerar perguntas",
        description: "Não foi possível gerar as perguntas de IA.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setGenerating(false);
    }
  };

  return {
    generateOptimizedQuestions,
    generating
  };
};