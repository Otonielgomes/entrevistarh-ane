import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, User, CheckCircle2, ArrowRight } from "lucide-react";
import { Job, AIQuestion, CustomQuestion } from "@/types/job";

interface QuestionContextManagerProps {
  job: Job | undefined;
  currentQuestionIndex: number;
  totalResponses: number;
}

export const QuestionContextManager = ({ 
  job, 
  currentQuestionIndex, 
  totalResponses 
}: QuestionContextManagerProps) => {
  if (!job) return null;

  const aiQuestions = job.aiGeneratedQuestions || [];
  const customQuestions = job.customQuestions || [];
  const allQuestions = [...customQuestions, ...aiQuestions];

  const getQuestionType = (questionId: string) => {
    const isCustom = customQuestions.some(q => q.id === questionId);
    const isAI = aiQuestions.some(q => q.id === questionId);
    
    if (isCustom) return 'custom';
    if (isAI) return 'ai';
    return 'unknown';
  };

  const getQuestionCategory = (question: AIQuestion | CustomQuestion) => {
    // Type guard for AIQuestion
    if ('difficulty' in question) {
      const aiQuestion = question as AIQuestion;
      return aiQuestion.category === 'technical' ? 'Técnica' :
             aiQuestion.category === 'behavioral' ? 'Comportamental' :
             aiQuestion.category === 'experience' ? 'Experiência' :
             aiQuestion.category === 'situational' ? 'Situacional' : 'Geral';
    }
    
    // CustomQuestion
    const customQuestion = question as CustomQuestion;
    return customQuestion.category || 'Geral';
  };

  return (
    <Card className="p-4 bg-gradient-card shadow-card border-0 mb-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Contexto da Entrevista
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {totalResponses}/{allQuestions.length} respondidas
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom Questions Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              <span className="font-medium text-foreground">Perguntas da Entrevistadora</span>
              <Badge variant="secondary" className="text-xs">
                {customQuestions.length}
              </Badge>
            </div>
            
            {customQuestions.length > 0 ? (
              <div className="space-y-1">
                {customQuestions.slice(0, 3).map((question, index) => (
                  <div key={question.id} className="flex items-center gap-2 text-sm">
                    {totalResponses > index ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : currentQuestionIndex === index ? (
                      <ArrowRight className="h-3 w-3 text-accent animate-pulse" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-muted" />
                    )}
                    <span className={totalResponses > index ? "text-success" : "text-muted-foreground"}>
                      {getQuestionCategory(question)}
                    </span>
                  </div>
                ))}
                {customQuestions.length > 3 && (
                  <p className="text-xs text-muted-foreground pl-5">
                    +{customQuestions.length - 3} mais...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma pergunta personalizada adicionada
              </p>
            )}
          </div>

          {/* AI Questions Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Perguntas da IA</span>
              <Badge variant="secondary" className="text-xs">
                {aiQuestions.length}
              </Badge>
            </div>
            
            {aiQuestions.length > 0 ? (
              <div className="space-y-1">
                {aiQuestions.slice(0, 3).map((question, index) => {
                  const globalIndex = customQuestions.length + index;
                  return (
                    <div key={question.id} className="flex items-center gap-2 text-sm">
                      {totalResponses > globalIndex ? (
                        <CheckCircle2 className="h-3 w-3 text-success" />
                      ) : currentQuestionIndex === globalIndex ? (
                        <ArrowRight className="h-3 w-3 text-primary animate-pulse" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border-2 border-muted" />
                      )}
                      <span className={totalResponses > globalIndex ? "text-success" : "text-muted-foreground"}>
                        {getQuestionCategory(question)}
                      </span>
                    </div>
                  );
                })}
                {aiQuestions.length > 3 && (
                  <p className="text-xs text-muted-foreground pl-5">
                    +{aiQuestions.length - 3} mais...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma pergunta da IA gerada
              </p>
            )}
          </div>
        </div>

        {allQuestions.length > 0 && (
          <>
            <Separator />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-accent">Estratégia:</span> Perguntas personalizadas primeiro para melhor contextualização, 
                seguidas pelas perguntas geradas por IA baseadas no perfil da vaga.
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};