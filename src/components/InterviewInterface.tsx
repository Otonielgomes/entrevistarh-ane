import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import QuestionManager, { CustomQuestion } from "./QuestionManager";
import { QuestionContextManager } from "./QuestionContextManager";
import { useAppContext } from "@/context/AppContext";
import { CandidateResult, InterviewResponse } from "@/types/job";
import { MessageSquare, Send, Mic, MicOff, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: 'ane' | 'candidate';
  content: string;
  timestamp: Date;
}

const InterviewInterface = () => {
  const [searchParams] = useSearchParams();
  const { getJobById, addCandidateResult } = useAppContext();
  const { toast } = useToast();
  
  const jobId = searchParams.get('job') || 'dev-fullstack-001';
  const candidateToken = searchParams.get('token') || 'demo-candidate';
  const currentJob = getJobById(jobId);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ane",
      content: `Olá! Eu sou a Ane, sua entrevistadora virtual da Animaserv. Estou aqui para conduzir sua entrevista para a vaga de ${currentJob?.title || 'Desenvolvedor Full Stack'}. Para começar, qual é seu nome completo?`,
      timestamp: new Date(),
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewResponses, setInterviewResponses] = useState<InterviewResponse[]>([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [collectingPersonalInfo, setCollectingPersonalInfo] = useState(true);

  // Get all available questions (AI generated + job custom + local custom)
  const getAllQuestions = () => {
    const aiQuestions = currentJob?.aiGeneratedQuestions || [];
    const jobCustomQuestions = currentJob?.customQuestions || [];
    
    // Prioritize recruiter's custom questions first for better context
    return [...jobCustomQuestions, ...customQuestions, ...aiQuestions];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "candidate",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    processResponse(inputMessage);
    setInputMessage("");
  };

  const processResponse = (response: string) => {
    if (collectingPersonalInfo) {
      if (!candidateName) {
        setCandidateName(response.trim());
        setTimeout(() => addAneMessage("Obrigada! Qual é seu email para contato?"), 1000);
      } else if (!candidateEmail) {
        setCandidateEmail(response.trim());
        setCollectingPersonalInfo(false);
        setTimeout(() => {
          addAneMessage("Perfeito! Agora vamos começar nossa entrevista. Primeira pergunta:");
          askNextQuestion();
        }, 1500);
      }
      return;
    }

    // Process interview question responses
    const allQuestions = getAllQuestions();
    if (currentQuestionIndex < allQuestions.length) {
      const currentQuestion = allQuestions[currentQuestionIndex];
      const score = Math.random() * 3 + 7; // 7-10 score
      
      const interviewResponse: InterviewResponse = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: response,
        score: Math.round(score * 10) / 10,
        analysis: "Resposta bem estruturada demonstrando conhecimento relevante."
      };
      
      setInterviewResponses(prev => [...prev, interviewResponse]);
      setCurrentQuestionIndex(prev => prev + 1);
      
      setTimeout(() => askNextQuestion(), 1500);
    }
  };

  const askNextQuestion = () => {
    const allQuestions = getAllQuestions();
    
    if (currentQuestionIndex >= allQuestions.length) {
      completeInterview();
      return;
    }
    
    const nextQuestion = allQuestions[currentQuestionIndex];
    addAneMessage(nextQuestion.question);
  };

  const addAneMessage = (content: string) => {
    const aneMessage: Message = {
      id: Date.now().toString(),
      sender: "ane",
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aneMessage]);
  };

  const completeInterview = () => {
    setIsInterviewComplete(true);
    
    const avgScore = interviewResponses.reduce((sum, resp) => sum + resp.score, 0) / interviewResponses.length || 8;
    const discProfiles = ['D-I', 'I-S', 'S-C', 'C-D'];
    
    // Calculate weighted scores considering custom questions importance
    const customQuestionsCount = (currentJob?.customQuestions || []).length;
    const totalQuestions = getAllQuestions().length;
    const customQuestionsWeight = customQuestionsCount > 0 ? 1.2 : 1.0; // 20% bonus for custom questions
    
    const candidateResult: Omit<CandidateResult, 'id'> = {
      name: candidateName || 'Candidato',
      email: candidateEmail || 'email@exemplo.com',
      jobId: jobId,
      jobTitle: currentJob?.title || 'Vaga Demo',
      overallScore: Math.round(avgScore * customQuestionsWeight * 10) / 10,
      discProfile: discProfiles[Math.floor(Math.random() * discProfiles.length)],
      technicalScore: Math.round((Math.random() * 2 + 8) * 10) / 10,
      behavioralScore: Math.round((Math.random() * 2 + 7) * 10) / 10,
      communicationScore: Math.round((Math.random() * 2 + 8) * 10) / 10,
      summary: `Candidato avaliado através de ${totalQuestions} perguntas (${customQuestionsCount} personalizadas pela entrevistadora). Demonstrou conhecimento relevante e boa comunicação.`,
      strengths: ['Comunicação clara', 'Conhecimento técnico', 'Experiência prática'],
      areasForImprovement: ['Gestão de tempo', 'Liderança de equipe'],
      responses: interviewResponses,
      interviewDate: new Date(),
      status: avgScore >= 8 ? 'Aprovado' : avgScore >= 6 ? 'Em análise' : 'Reprovado',
      reuseForOtherJobs: true
    };
    
    addCandidateResult(candidateResult);
    
    setTimeout(() => {
      addAneMessage(`Perfeito! Sua entrevista foi concluída. Seu desempenho geral foi de ${avgScore.toFixed(1)}/10. Os resultados foram salvos e você receberá um retorno em breve. Obrigada pela participação!`);
      
      toast({
        title: "Entrevista concluída! 🎉",
        description: `Escore final: ${avgScore.toFixed(1)}/10. Resultados salvos com sucesso.`
      });
    }, 2000);
  };

  const handleAddQuestion = (question: CustomQuestion) => {
    setCustomQuestions(prev => [...prev, question]);
  };

  const handleRemoveQuestion = (id: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleEditQuestion = (id: string, updatedQuestion: CustomQuestion) => {
    setCustomQuestions(prev => prev.map(q => q.id === id ? updatedQuestion : q));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-success/5">
      <div className="container mx-auto px-4 py-8">
        {/* Question Context Manager */}
        <div className="max-w-4xl mx-auto mb-6">
          <QuestionContextManager 
            job={currentJob}
            currentQuestionIndex={currentQuestionIndex}
            totalResponses={interviewResponses.length}
          />
        </div>

        {/* Question Manager */}
        <div className="max-w-4xl mx-auto mb-6">
          <QuestionManager
            questions={customQuestions}
            onAddQuestion={handleAddQuestion}
            onRemoveQuestion={handleRemoveQuestion}
            onEditQuestion={handleEditQuestion}
          />
        </div>

        <Card className="max-w-4xl mx-auto shadow-card border-0">
          {/* Header */}
          <div className="bg-gradient-primary p-6 rounded-t-lg">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-bold text-lg">Ane</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Entrevista com Ane</h1>
                  <p className="opacity-90 flex items-center gap-2">
                    <span>Vaga: {currentJob?.title || 'Demo'}</span>
                    {(currentJob?.customQuestions?.length || 0) > 0 && (
                      <span className="px-2 py-0.5 bg-accent/20 text-accent-foreground text-xs rounded-full font-medium">
                        Contexto Personalizado
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {isInterviewComplete && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Concluída</span>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 bg-gradient-card">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                    {message.sender === 'ane' && (
                      <Avatar className="bg-gradient-primary">
                        <AvatarFallback className="text-white font-semibold">Ane</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-4 rounded-lg shadow-sm ${
                        message.sender === 'ane'
                          ? 'bg-white border border-border'
                          : 'bg-gradient-primary text-white'
                      }`}
                    >
                      <p className={message.sender === 'ane' ? 'text-foreground' : 'text-white'}>
                        {message.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'ane' ? 'text-muted-foreground' : 'text-white/70'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.sender === 'candidate' && (
                      <Avatar className="bg-success">
                        <AvatarFallback className="text-white font-semibold">
                          {candidateName ? candidateName.charAt(0) : 'C'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t bg-white rounded-b-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="border-border focus:ring-2 focus:ring-primary"
                  disabled={isInterviewComplete}
                />
              </div>
              
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                disabled={isInterviewComplete}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button 
                onClick={handleSendMessage}
                className="bg-gradient-primary hover:shadow-hover"
                disabled={isInterviewComplete}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterviewInterface;