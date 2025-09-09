import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AIQuestion } from "@/types/job";
import { Brain, Lightbulb, Target, MessageSquare, Zap, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIJobAnalyzerProps {
  jobDescription: string;
  jobTitle: string;
  jobLevel: string;
  onQuestionsGenerated: (questions: AIQuestion[]) => void;
  isAnalyzing: boolean;
  onAnalyzingChange: (analyzing: boolean) => void;
}

export const AIJobAnalyzer = ({ 
  jobDescription, 
  jobTitle, 
  jobLevel, 
  onQuestionsGenerated, 
  isAnalyzing,
  onAnalyzingChange 
}: AIJobAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [generatedQuestions, setGeneratedQuestions] = useState<AIQuestion[]>([]);
  const { toast } = useToast();

  const analyzeJobAndGenerateQuestions = async () => {
    onAnalyzingChange(true);
    
    try {
      // Simulate AI analysis - In a real app, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = `Baseado na descrição da vaga "${jobTitle}" (${jobLevel}), identifiquei os seguintes pontos-chave:

• **Competências Técnicas**: ${getRandomTechnicalSkills()}
• **Competências Comportamentais**: ${getRandomBehavioralSkills()}
• **Experiência Necessária**: ${getRandomExperienceLevel()}
• **Perfil DISC Recomendado**: ${getRandomDISCProfile()}

A IA gerou perguntas específicas para avaliar cada uma dessas competências de forma assertiva.`;

      const mockQuestions: AIQuestion[] = generateQuestionsForJob(jobTitle, jobLevel, jobDescription);
      
      setAnalysis(mockAnalysis);
      setGeneratedQuestions(mockQuestions);
      onQuestionsGenerated(mockQuestions);
      
      toast({
        title: "Análise concluída! 🧠",
        description: `${mockQuestions.length} perguntas personalizadas foram geradas pela IA.`
      });
    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Ocorreu um erro ao processar a análise. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      onAnalyzingChange(false);
    }
  };

  const generateQuestionsForJob = (title: string, level: string, description: string): AIQuestion[] => {
    const questions: AIQuestion[] = [];
    
    // Technical questions based on job type
    if (title.toLowerCase().includes('desenvolvedor') || title.toLowerCase().includes('dev')) {
      questions.push(
        {
          id: 'tech-1',
          question: 'Descreva um desafio técnico complexo que você enfrentou recentemente e como você o solucionou.',
          category: 'technical',
          difficulty: level === 'Sênior' ? 'hard' : level === 'Pleno' ? 'medium' : 'easy',
          expectedKeywords: ['problema', 'solução', 'técnico', 'debuggar', 'código'],
          scoringCriteria: 'Clareza na explicação do problema, processo de resolução estruturado, conhecimento técnico demonstrado'
        },
        {
          id: 'tech-2',
          question: 'Como você mantém seus conhecimentos técnicos atualizados e qual foi a última tecnologia que aprendeu?',
          category: 'technical',
          difficulty: 'medium',
          expectedKeywords: ['aprendizado', 'tecnologia', 'atualização', 'estudo', 'curso'],
          scoringCriteria: 'Demonstração de proatividade no aprendizado, exemplos concretos, interesse em evolução profissional'
        }
      );
    }

    // Behavioral questions
    questions.push(
      {
        id: 'behav-1',
        question: 'Conte sobre uma situação em que você teve que trabalhar sob pressão e prazos apertados. Como você gerenciou?',
        category: 'behavioral',
        difficulty: 'medium',
        expectedKeywords: ['pressão', 'prazo', 'organização', 'priorização', 'resultado'],
        scoringCriteria: 'Capacidade de gestão sob pressão, organização, foco em resultados, resiliência'
      },
      {
        id: 'behav-2',
        question: 'Descreva uma situação em que você teve que colaborar com uma equipe para alcançar um objetivo comum.',
        category: 'behavioral',
        difficulty: 'easy',
        expectedKeywords: ['equipe', 'colaboração', 'objetivo', 'comunicação', 'resultado'],
        scoringCriteria: 'Habilidades de trabalho em equipe, comunicação, liderança colaborativa'
      }
    );

    // Experience questions
    questions.push(
      {
        id: 'exp-1',
        question: 'Qual projeto ou conquista profissional você considera mais significativo em sua carreira?',
        category: 'experience',
        difficulty: 'medium',
        expectedKeywords: ['projeto', 'conquista', 'resultado', 'impacto', 'aprendizado'],
        scoringCriteria: 'Relevância da experiência, impacto do projeto, aprendizados obtidos, alinhamento com a vaga'
      }
    );

    // Situational questions
    questions.push(
      {
        id: 'sit-1',
        question: 'Como você lidaria com uma situação em que precisa aprender uma nova tecnologia rapidamente para um projeto urgente?',
        category: 'situational',
        difficulty: 'medium',
        expectedKeywords: ['aprendizado', 'rapidez', 'estratégia', 'recursos', 'prazo'],
        scoringCriteria: 'Estratégia de aprendizado, capacidade de adaptação, gestão de tempo, busca por recursos'
      }
    );

    return questions;
  };

  const getRandomTechnicalSkills = () => {
    const skills = ['React/JavaScript', 'Python/Django', 'Node.js/Express', 'Java/Spring', 'SQL/NoSQL'];
    return skills.slice(0, Math.floor(Math.random() * 3) + 2).join(', ');
  };

  const getRandomBehavioralSkills = () => {
    const skills = ['Comunicação assertiva', 'Trabalho em equipe', 'Resolução de problemas', 'Adaptabilidade', 'Proatividade'];
    return skills.slice(0, Math.floor(Math.random() * 3) + 2).join(', ');
  };

  const getRandomExperienceLevel = () => {
    const levels = ['2-4 anos', '3-5 anos', '5+ anos', '1-3 anos'];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  const getRandomDISCProfile = () => {
    const profiles = ['D-I (Dominante-Influente)', 'I-S (Influente-Estável)', 'S-C (Estável-Consciencioso)', 'C-D (Consciencioso-Dominante)'];
    return profiles[Math.floor(Math.random() * profiles.length)];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-primary/10 text-primary';
      case 'behavioral': return 'bg-success/10 text-success';
      case 'experience': return 'bg-accent/10 text-accent';
      case 'situational': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/10 text-success';
      case 'medium': return 'bg-accent/10 text-accent';
      case 'hard': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  useEffect(() => {
    if (jobDescription && jobTitle) {
      analyzeJobAndGenerateQuestions();
    }
  }, [jobDescription, jobTitle, jobLevel]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Análise por IA</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={analyzeJobAndGenerateQuestions}
          disabled={isAnalyzing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analisando...' : 'Regenerar'}
        </Button>
      </div>

      {isAnalyzing ? (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-success/5 border-0">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="h-6 w-6 text-primary animate-pulse" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">IA analisando a vaga...</p>
              <p className="text-sm text-muted-foreground">Gerando perguntas personalizadas baseadas no perfil</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {analysis && (
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-success/5 border-0">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Análise da Vaga</h4>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {analysis}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {generatedQuestions.length > 0 && (
            <Card className="p-6 bg-gradient-card shadow-card border-0">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">
                  Perguntas Geradas ({generatedQuestions.length})
                </h4>
              </div>
              
              <div className="space-y-4">
                {generatedQuestions.map((question, index) => (
                  <div key={question.id} className="p-4 bg-white rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        <Badge className={getCategoryColor(question.category)}>
                          {question.category}
                        </Badge>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="font-medium text-foreground mb-2">{question.question}</p>
                    
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-muted-foreground">Palavras-chave esperadas: </span>
                        <span className="text-foreground">{question.expectedKeywords.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Critérios: </span>
                        <span className="text-foreground">{question.scoringCriteria}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-success" />
                  <p className="text-sm font-medium text-foreground">
                    Perguntas otimizadas para máxima assertividade na seleção
                  </p>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};